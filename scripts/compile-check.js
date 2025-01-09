const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('Compiling contract...');
    const SonicTokenWrapper = await ethers.getContractFactory('contracts/verify_exact.sol:SonicTokenWrapper');
    
    // Get the bytecode
    const bytecode = SonicTokenWrapper.bytecode;
    console.log('\nContract Bytecode:');
    console.log(bytecode);

    // Get the constructor arguments
    const wSonicAddress = '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38';
    const encodedArgs = ethers.utils.defaultAbiCoder.encode(['address'], [wSonicAddress]);
    console.log('\nEncoded Constructor Arguments:');
    console.log(encodedArgs);

    // Full deployment bytecode
    const fullBytecode = bytecode + encodedArgs.slice(2); // remove 0x prefix from args
    console.log('\nFull Deployment Bytecode:');
    console.log(fullBytecode);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 