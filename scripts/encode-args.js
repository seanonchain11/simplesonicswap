const { ethers } = require("hardhat");

async function main() {
  const wSonicAddress = "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38";
  
  // Method 1: Using defaultAbiCoder
  const encoded1 = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [wSonicAddress]
  );
  
  // Method 2: Using Interface
  const iface = new ethers.utils.Interface([
    "constructor(address _wSonic)"
  ]);
  const encoded2 = iface.encodeDeploy([wSonicAddress]);
  
  // Method 3: Using Contract Factory
  const SonicTokenWrapper = await ethers.getContractFactory("SonicTokenWrapper");
  const encoded3 = SonicTokenWrapper.interface.encodeDeploy([wSonicAddress]);
  
  console.log("\nConstructor Arguments Encoding Results:");
  console.log("=====================================");
  console.log("Method 1 (defaultAbiCoder):", encoded1);
  console.log("Method 2 (Interface):", encoded2);
  console.log("Method 3 (Contract Factory):", encoded3);
  console.log("\nwSonic Address:", wSonicAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 