import { ethers } from "hardhat";

async function main() {
  console.log("Deploying BatchRevoke contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BNB");

  const BatchRevoke = await ethers.getContractFactory("BatchRevoke");
  const batchRevoke = await BatchRevoke.deploy();

  await batchRevoke.waitForDeployment();

  const address = await batchRevoke.getAddress();
  console.log("BatchRevoke deployed to:", address);
  console.log("");
  console.log("Verify with:");
  console.log(`npx hardhat verify --network bsc ${address}`);
  console.log("");
  console.log("Add this address to /bsc.address file:");
  console.log(`BatchRevoke: ${address}`);
  console.log(`Explorer: https://bscscan.com/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
