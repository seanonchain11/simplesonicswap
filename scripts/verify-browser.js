const axios = require('axios');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

async function main() {
    const contractAddress = '0x3fb23C53eB22762087B4557DB13c4d105EecB2b8';
    const sourceCode = fs.readFileSync(path.join(__dirname, '../contracts/verify_exact.sol'), 'utf8');
    
    const verificationData = {
        apikey: 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE',
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: sourceCode,
        codeformat: 'solidity-single-file',
        contractname: 'SonicTokenWrapper',
        compilerversion: 'v0.8.20+commit.a1b79de6',
        optimizationUsed: '1',
        runs: '200',
        constructorArguements: '000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
        evmversion: 'london',
        licenseType: '3'
    };

    try {
        console.log('Submitting verification request...');
        const response = await axios.post('https://sonicscan.io/api', querystring.stringify(verificationData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://sonicscan.io',
                'Referer': 'https://sonicscan.io/'
            }
        });
        console.log('Response:', response.data);

        if (response.data.status === '1') {
            console.log('Verification submitted successfully. GUID:', response.data.result);
            
            // Check verification status
            const checkStatus = async (guid) => {
                const statusResponse = await axios.get('https://sonicscan.io/api', {
                    params: {
                        apikey: 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE',
                        module: 'contract',
                        action: 'checkverifystatus',
                        guid: guid
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json, text/plain, */*',
                        'Origin': 'https://sonicscan.io',
                        'Referer': 'https://sonicscan.io/'
                    }
                });
                return statusResponse.data;
            };

            // Wait for 30 seconds and check status
            console.log('Waiting 30 seconds before checking status...');
            await new Promise(resolve => setTimeout(resolve, 30000));
            
            const status = await checkStatus(response.data.result);
            console.log('Verification status:', status);
        } else {
            console.error('Verification submission failed:', response.data.result);
        }
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error:', error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 