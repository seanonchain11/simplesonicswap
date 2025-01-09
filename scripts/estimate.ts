const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const WSONIC_ADDRESS = '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38'

  console.log("Estimating deployment costs...")
  console.log("Using wSonic address:", WSONIC_ADDRESS)

  // Get the contract factory
  const SonicTokenWrapper = await ethers.getContractFactory("SonicTokenWrapper")
  
  // Get deployment bytecode
  const deployTx = SonicTokenWrapper.getDeployTransaction(WSONIC_ADDRESS)
  
  // Get current gas price
  const gasPrice = await ethers.provider.getGasPrice()
  console.log("\nCurrent gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei")

  // Estimate gas for deployment
  const estimatedGas = await ethers.provider.estimateGas({
    data: deployTx.data
  })
  console.log("Estimated gas:", estimatedGas.toString())

  // Calculate total cost
  const deploymentCost = gasPrice.mul(estimatedGas)
  console.log("\nEstimated deployment cost:")
  console.log("- In Sonic:", ethers.utils.formatEther(deploymentCost), "SONIC")
  
  // Add 20% buffer for safety
  const withBuffer = deploymentCost.mul(120).div(100)
  console.log("- With 20% buffer:", ethers.utils.formatEther(withBuffer), "SONIC")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 