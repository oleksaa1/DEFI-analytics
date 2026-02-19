import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("BatchRevoke", function () {
  async function deployFixture() {
    const [owner, spender1, spender2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token1 = await MockERC20.deploy("Token1", "TK1");
    const token2 = await MockERC20.deploy("Token2", "TK2");

    const BatchRevoke = await ethers.getContractFactory("BatchRevoke");
    const batchRevoke = await BatchRevoke.deploy();

    await token1.mint(owner.address, ethers.parseEther("1000"));
    await token2.mint(owner.address, ethers.parseEther("1000"));

    await token1.approve(spender1.address, ethers.MaxUint256);
    await token2.approve(spender2.address, ethers.MaxUint256);

    return { batchRevoke, token1, token2, owner, spender1, spender2 };
  }

  describe("batchCheckAllowances", function () {
    it("Should return correct allowances for multiple tokens", async function () {
      const { batchRevoke, token1, token2, owner, spender1, spender2 } =
        await loadFixture(deployFixture);

      const allowances = await batchRevoke.batchCheckAllowances(
        owner.address,
        [await token1.getAddress(), await token2.getAddress()],
        [spender1.address, spender2.address]
      );

      expect(allowances[0]).to.equal(ethers.MaxUint256);
      expect(allowances[1]).to.equal(ethers.MaxUint256);
    });

    it("Should return 0 for non-approved spenders", async function () {
      const { batchRevoke, token1, owner, spender2 } =
        await loadFixture(deployFixture);

      const allowances = await batchRevoke.batchCheckAllowances(
        owner.address,
        [await token1.getAddress()],
        [spender2.address]
      );

      expect(allowances[0]).to.equal(0);
    });

    it("Should revert with mismatched array lengths", async function () {
      const { batchRevoke, token1, owner, spender1 } =
        await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchCheckAllowances(
          owner.address,
          [await token1.getAddress()],
          [spender1.address, spender1.address]
        )
      ).to.be.revertedWithCustomError(batchRevoke, "ArrayLengthMismatch");
    });

    it("Should revert with empty arrays", async function () {
      const { batchRevoke, owner } = await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchCheckAllowances(owner.address, [], [])
      ).to.be.revertedWithCustomError(batchRevoke, "EmptyArrays");
    });

    it("Should handle non-contract addresses gracefully", async function () {
      const { batchRevoke, owner, spender1 } =
        await loadFixture(deployFixture);

      const allowances = await batchRevoke.batchCheckAllowances(
        owner.address,
        [spender1.address], // not a token contract
        [spender1.address]
      );

      expect(allowances[0]).to.equal(0);
    });
  });

  describe("batchRevoke", function () {
    it("Should emit events for batch revoke", async function () {
      const { batchRevoke, token1, token2, spender1, spender2 } =
        await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchRevoke(
          [await token1.getAddress(), await token2.getAddress()],
          [spender1.address, spender2.address]
        )
      )
        .to.emit(batchRevoke, "Revoked")
        .to.emit(batchRevoke, "BatchRevoked");
    });

    it("Should skip zero addresses and emit RevokeFailed", async function () {
      const { batchRevoke, token1, spender1 } =
        await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchRevoke(
          [ethers.ZeroAddress, await token1.getAddress()],
          [spender1.address, spender1.address]
        )
      )
        .to.emit(batchRevoke, "RevokeFailed")
        .to.emit(batchRevoke, "Revoked");
    });

    it("Should revert with mismatched array lengths", async function () {
      const { batchRevoke, token1, spender1 } =
        await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchRevoke(
          [await token1.getAddress()],
          [spender1.address, spender1.address]
        )
      ).to.be.revertedWithCustomError(batchRevoke, "ArrayLengthMismatch");
    });

    it("Should revert with empty arrays", async function () {
      const { batchRevoke } = await loadFixture(deployFixture);

      await expect(
        batchRevoke.batchRevoke([], [])
      ).to.be.revertedWithCustomError(batchRevoke, "EmptyArrays");
    });

    it("Should revert when batch exceeds max size", async function () {
      const { batchRevoke, spender1 } = await loadFixture(deployFixture);

      const tokens = Array(51).fill(spender1.address);
      const spenders = Array(51).fill(spender1.address);

      await expect(
        batchRevoke.batchRevoke(tokens, spenders)
      ).to.be.revertedWithCustomError(batchRevoke, "BatchTooLarge");
    });
  });

  describe("revoke", function () {
    it("Should revoke a single approval and emit events", async function () {
      const { batchRevoke, token1, spender1 } =
        await loadFixture(deployFixture);

      await expect(
        batchRevoke.revoke(await token1.getAddress(), spender1.address)
      )
        .to.emit(batchRevoke, "Revoked")
        .to.emit(batchRevoke, "BatchRevoked");
    });

    it("Should revert with zero token address", async function () {
      const { batchRevoke, spender1 } = await loadFixture(deployFixture);

      await expect(
        batchRevoke.revoke(ethers.ZeroAddress, spender1.address)
      ).to.be.revertedWithCustomError(batchRevoke, "ZeroAddress");
    });

    it("Should revert with zero spender address", async function () {
      const { batchRevoke, token1 } = await loadFixture(deployFixture);

      await expect(
        batchRevoke.revoke(await token1.getAddress(), ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(batchRevoke, "ZeroAddress");
    });
  });

  describe("constants", function () {
    it("Should have MAX_BATCH_SIZE of 50", async function () {
      const { batchRevoke } = await loadFixture(deployFixture);
      expect(await batchRevoke.MAX_BATCH_SIZE()).to.equal(50);
    });
  });
});
