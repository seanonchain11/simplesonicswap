const { ethers } = require("hardhat");

async function main() {
  const address = "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38";
  const encoded = ethers.utils.defaultAbiCoder.encode(["address"], [address]);
  console.log("Constructor Arguments:", encoded);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 