const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
    const contractAddress = '0x3fb23C53eB22762087B4557DB13c4d105EecB2b8';
    const sourceCode = fs.readFileSync(path.join(__dirname, '../contracts/flattened.sol'), 'utf8');
    
    // First, try to get the API version
    try {
        const versionCheck = await axios.get('https://sonicscan.io/api', {
            params: {
                apikey: 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE',
                module: 'proxy',
                action: 'eth_blockNumber'
            }
        });
        console.log('API Check Response:', versionCheck.data);
    } catch (error) {
        console.log('API Check Error:', error.message);
    }

    // Prepare verification data
    const verificationData = new URLSearchParams();
    verificationData.append('apikey', 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE');
    verificationData.append('module', 'contract');
    verificationData.append('action', 'verifysourcecode');
    verificationData.append('contractaddress', contractAddress);
    verificationData.append('sourceCode', sourceCode);
    verificationData.append('codeformat', 'solidity-single-file');
    verificationData.append('contractname', 'SonicTokenWrapper');
    verificationData.append('compilerversion', 'v0.8.20+commit.a1b79de6');
    verificationData.append('optimizationUsed', '1');
    verificationData.append('runs', '200');
    verificationData.append('constructorArguements', '000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38');
    verificationData.append('evmversion', 'london');
    verificationData.append('licenseType', '3');

    try {
        console.log('Submitting verification request...');
        
        // Try multiple endpoints
        const endpoints = [
            'https://sonicscan.io/api',
            'https://public-api.sonicscan.io/api',
            'https://explorer.sonic.ooo/api'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                const response = await axios.post(endpoint, verificationData.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0',
                    },
                    maxRedirects: 0
                });
                
                console.log(`Response from ${endpoint}:`, response.data);
                
                if (response.data.status === '1' || response.data.message === 'OK') {
                    const guid = response.data.result;
                    console.log('Verification submitted successfully. GUID:', guid);
                    
                    // Wait and check status
                    console.log('Waiting 30 seconds before checking status...');
                    await new Promise(resolve => setTimeout(resolve, 30000));
                    
                    const statusResponse = await axios.get(endpoint, {
                        params: {
                            apikey: 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE',
                            module: 'contract',
                            action: 'checkverifystatus',
                            guid: guid
                        }
                    });
                    
                    console.log('Verification status:', statusResponse.data);
                    break;
                }
            } catch (endpointError) {
                console.log(`Error with ${endpoint}:`, endpointError.message);
                if (endpointError.response) {
                    console.log('Response status:', endpointError.response.status);
                    console.log('Response data:', endpointError.response.data);
                }
            }
        }
    } catch (error) {
        console.error('Final error:', error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 