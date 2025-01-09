const hre = require("hardhat");
const { ethers, run, network } = hre;

async function main() {
  // Check if we're on the correct network
  if (network.name !== 'sonic') {
    throw new Error('Please run the deployment script on the Sonic network')
  }

  const WSONIC_ADDRESS = '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38'

  console.log("Deploying SonicTokenWrapper contract...")
  console.log("Network:", network.name)
  console.log("Using wSonic address:", WSONIC_ADDRESS)

  const SonicTokenWrapper = await ethers.getContractFactory("SonicTokenWrapper")
  const wrapper = await SonicTokenWrapper.deploy(WSONIC_ADDRESS)

  await wrapper.deployed()

  console.log("SonicTokenWrapper deployed to:", wrapper.address)
  console.log("Waiting for block confirmations...")

  // Wait for 6 block confirmations
  await wrapper.deployTransaction.wait(6)

  console.log("Verifying contract on SonicScan...")
  
  // Verify the contract on SonicScan
  try {
    await run("verify:verify", {
      address: wrapper.address,
      constructorArguments: [WSONIC_ADDRESS],
    })
    console.log("Contract verified successfully")
  } catch (error) {
    console.error("Error verifying contract:", error)
  }

  // Log deployment info
  console.log("\nDeployment Summary:")
  console.log("-------------------")
  console.log("Network:", network.name)
  console.log("Contract Address:", wrapper.address)
  console.log("wSonic Address:", WSONIC_ADDRESS)
  console.log("Block Number:", wrapper.deployTransaction.blockNumber)
  console.log("Transaction Hash:", wrapper.deployTransaction.hash)
  console.log("\nNext steps:")
  console.log("1. Update WRAPPER_ADDRESS in src/services/contractService.ts")
  console.log("2. Update contract address in the frontend environment variables")
  console.log("3. Test the contract with frontend integration")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 