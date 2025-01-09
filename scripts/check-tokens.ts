const hre = require("hardhat");
const { ethers } = hre;

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)"
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nChecking balances for:", deployer.address);
  console.log("----------------------------------------");
  
  // Check native SONIC balance
  const nativeBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Native SONIC:", ethers.utils.formatEther(nativeBalance));
  
  // Check ERC20 SONIC balance
  const sonicTokenAddress = "0x0e0dce2d3353013fae936543ea1362d71a9c71e7"; // SONIC token
  const sonicToken = new ethers.Contract(sonicTokenAddress, ERC20_ABI, deployer);
  
  try {
    const tokenBalance = await sonicToken.balanceOf(deployer.address);
    const symbol = await sonicToken.symbol();
    console.log(`ERC20 ${symbol}:`, ethers.utils.formatEther(tokenBalance));
  } catch (error) {
    console.log("Error checking ERC20 SONIC balance:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 