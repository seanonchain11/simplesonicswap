const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("\nDeployer account details:");
  console.log("------------------------");
  console.log("Address:", deployer.address);
  
  // Get native balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "SONIC");
  
  // Get private key (first few characters)
  const privateKey = process.env.SONIC_PRIVATE_KEY || "";
  console.log("Private Key (first 6 chars):", privateKey.substring(0, 6) + "...");
  
  // Verify if the private key matches the address
  const wallet = new ethers.Wallet(privateKey);
  console.log("Derived address from private key:", wallet.address);
  console.log("Matches deployer address:", wallet.address === deployer.address ? "✅ Yes" : "❌ No");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 