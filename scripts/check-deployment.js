const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x3fb23C53eB22762087B4557DB13c4d105EecB2b8";
  const wSonicAddress = "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38";
  
  // Get the contract factory
  const SonicTokenWrapper = await ethers.getContractFactory("SonicTokenWrapper");
  
  // Get the deployment bytecode with constructor arguments
  const deployTx = SonicTokenWrapper.getDeployTransaction(wSonicAddress);
  
  console.log("\nBytecode Analysis:");
  console.log("=================");
  console.log("Full deployment data length:", deployTx.data.length);
  console.log("Contract bytecode length:", SonicTokenWrapper.bytecode.length);
  
  // Extract constructor arguments
  const constructorArgs = deployTx.data.slice(SonicTokenWrapper.bytecode.length);
  
  console.log("\nConstructor Arguments:", constructorArgs);
  console.log("\nVerification Data:");
  console.log("=================");
  console.log("Contract Address:", contractAddress);
  console.log("wSonic Address:", wSonicAddress);
  console.log("Optimization: Yes");
  console.log("Runs: 200");
  console.log("Solidity Version: v0.8.20+commit.a1b79de6");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 