const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
    const contractAddress = '0x3fb23C53eB22762087B4557DB13c4d105EecB2b8';
    const sourceCode = fs.readFileSync(path.join(__dirname, '../contracts/verify_exact.sol'), 'utf8');
    const constructorArgs = '000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38';

    const verifyData = {
        apikey: 'YourApiKey', // Replace with your SonicScan API key
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: sourceCode,
        codeformat: 'solidity-single-file',
        contractname: 'SonicTokenWrapper',
        compilerversion: 'v0.8.20+commit.a1b79de6',
        optimizationUsed: 1,
        runs: 200,
        constructorArguements: constructorArgs,
        evmversion: 'london',
        licenseType: 3 // MIT License
    };

    try {
        const response = await axios.post('https://sonicscan.io/api', verifyData);
        console.log('Verification Response:', response.data);
    } catch (error) {
        console.error('Verification Error:', error.response ? error.response.data : error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 