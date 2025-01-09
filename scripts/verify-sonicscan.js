const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function main() {
    const contractAddress = '0x3fb23C53eB22762087B4557DB13c4d105EecB2b8';
    const sourceCode = fs.readFileSync(path.join(__dirname, '../contracts/verify_exact.sol'), 'utf8');
    
    const formData = new FormData();
    formData.append('apikey', 'H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE');
    formData.append('module', 'contract');
    formData.append('action', 'verifysourcecode');
    formData.append('contractaddress', contractAddress);
    formData.append('sourceCode', sourceCode);
    formData.append('codeformat', 'solidity-single-file');
    formData.append('contractname', 'SonicTokenWrapper');
    formData.append('compilerversion', 'v0.8.20+commit.a1b79de6');
    formData.append('optimizationUsed', '1');
    formData.append('runs', '200');
    formData.append('constructorArguements', '000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38');
    formData.append('evmversion', 'london');
    formData.append('licenseType', '3');

    try {
        console.log('Submitting verification request...');
        const response = await axios.post('https://sonicscan.io/api', formData, {
            headers: {
                ...formData.getHeaders(),
                'Accept': 'application/json'
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