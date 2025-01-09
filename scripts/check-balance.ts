const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("\nDeployer account:", deployer.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "SONIC");
  
  const requiredAmount = ethers.utils.parseEther("0.0011");
  if (balance.lt(requiredAmount)) {
    console.log("\n⚠️  Insufficient funds for deployment!");
    console.log("Required:", ethers.utils.formatEther(requiredAmount), "SONIC");
    console.log("Missing:", ethers.utils.formatEther(requiredAmount.sub(balance)), "SONIC");
  } else {
    console.log("\n✅ Sufficient funds for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 