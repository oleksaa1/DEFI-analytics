// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BatchRevoke
 * @notice Utility contract for batch-checking and revoking ERC20 token approvals.
 * @dev
 *   - batchCheckAllowances: View function to check multiple allowances in a single call.
 *   - batchRevoke / revoke: Call approve(spender, 0) on tokens.
 *     NOTE: For EOA wallets, approve() sets allowance for msg.sender which is THIS contract,
 *     not the end user. EOA users should call approve(spender, 0) directly on each token
 *     from the frontend. These functions are useful for smart contract wallets that
 *     can delegatecall into this contract.
 */

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract BatchRevoke {
    uint256 public constant MAX_BATCH_SIZE = 50;

    event BatchRevoked(address indexed owner, uint256 count);
    event Revoked(address indexed owner, address indexed token, address indexed spender);
    event RevokeFailed(address indexed owner, address indexed token, address indexed spender);

    error ArrayLengthMismatch();
    error EmptyArrays();
    error BatchTooLarge(uint256 size);
    error ZeroAddress();
    error RevokeFailed_Single();

    /**
     * @notice Check multiple token allowances in a single call.
     * @param owner The address whose allowances to check
     * @param tokens Array of ERC20 token addresses
     * @param spenders Array of spender addresses
     * @return allowances Array of current allowance values
     */
    function batchCheckAllowances(
        address owner,
        address[] calldata tokens,
        address[] calldata spenders
    ) external view returns (uint256[] memory allowances) {
        if (tokens.length != spenders.length) revert ArrayLengthMismatch();
        if (tokens.length == 0) revert EmptyArrays();
        if (tokens.length > MAX_BATCH_SIZE) revert BatchTooLarge(tokens.length);

        allowances = new uint256[](tokens.length);

        for (uint256 i = 0; i < tokens.length;) {
            (bool success, bytes memory data) = tokens[i].staticcall(
                abi.encodeWithSelector(IERC20.allowance.selector, owner, spenders[i])
            );
            if (success && data.length >= 32) {
                allowances[i] = abi.decode(data, (uint256));
            }
            unchecked { ++i; }
        }
    }

    /**
     * @notice Revoke multiple token approvals in a single transaction.
     * @dev For EOA users, this sets the CONTRACT's allowances, not the caller's.
     *      EOA users should call approve(spender, 0) directly on each token.
     *      This function is intended for smart contract wallets using delegatecall.
     * @param tokens Array of ERC20 token addresses to revoke approvals for
     * @param spenders Array of spender addresses whose approvals should be revoked
     */
    function batchRevoke(
        address[] calldata tokens,
        address[] calldata spenders
    ) external {
        if (tokens.length != spenders.length) revert ArrayLengthMismatch();
        if (tokens.length == 0) revert EmptyArrays();
        if (tokens.length > MAX_BATCH_SIZE) revert BatchTooLarge(tokens.length);

        uint256 successCount = 0;

        for (uint256 i = 0; i < tokens.length;) {
            if (tokens[i] == address(0) || spenders[i] == address(0)) {
                emit RevokeFailed(msg.sender, tokens[i], spenders[i]);
                unchecked { ++i; }
                continue;
            }

            (bool success, ) = tokens[i].call(
                abi.encodeWithSelector(IERC20.approve.selector, spenders[i], 0)
            );

            if (success) {
                emit Revoked(msg.sender, tokens[i], spenders[i]);
                unchecked { ++successCount; }
            } else {
                emit RevokeFailed(msg.sender, tokens[i], spenders[i]);
            }

            unchecked { ++i; }
        }

        emit BatchRevoked(msg.sender, successCount);
    }

    /**
     * @notice Revoke a single token approval.
     * @dev Same caveat as batchRevoke — for EOA users, call approve directly on the token.
     * @param token ERC20 token address
     * @param spender Address of the spender to revoke
     */
    function revoke(address token, address spender) external {
        if (token == address(0) || spender == address(0)) revert ZeroAddress();

        (bool success, ) = token.call(
            abi.encodeWithSelector(IERC20.approve.selector, spender, 0)
        );
        if (!success) revert RevokeFailed_Single();

        emit Revoked(msg.sender, token, spender);
        emit BatchRevoked(msg.sender, 1);
    }
}
