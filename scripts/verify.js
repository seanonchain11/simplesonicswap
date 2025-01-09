const { ethers } = require("hardhat");

async function main() {
  const wSonicAddress = "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38";
  
  // Get the contract factory
  const SonicTokenWrapper = await ethers.getContractFactory("SonicTokenWrapper");
  
  // Encode constructor arguments
  const constructorArgs = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [wSonicAddress]
  );
  
  console.log("Contract Address:", "0x3fb23C53eB22762087B4557DB13c4d105EecB2b8");
  console.log("Constructor Arguments:", constructorArgs);
  console.log("wSonic Address:", wSonicAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 