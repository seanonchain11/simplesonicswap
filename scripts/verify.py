import requests
import json
import time
import urllib3
urllib3.disable_warnings()

def main():
    # Contract details
    contract_address = "0x3fb23C53eB22762087B4557DB13c4d105EecB2b8"
    api_key = "H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE"
    
    # Read source code
    with open('contracts/flattened.sol', 'r') as file:
        source_code = file.read()

    print("Attempting to verify contract...")
    
    # Verification data
    data = {
        'apikey': api_key,
        'module': 'contract',
        'action': 'verifysourcecode',
        'contractaddress': contract_address,
        'sourceCode': source_code,
        'codeformat': 'solidity-single-file',
        'contractname': 'SonicTokenWrapper',
        'compilerversion': 'v0.8.20+commit.a1b79de6',
        'optimizationUsed': '1',
        'runs': '200',
        'constructorArguements': '000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
        'evmversion': 'london',
        'licenseType': '3'
    }

    # Try different endpoints
    endpoints = [
        'https://sonicscan.io/api',
        'https://public-api.sonicscan.io/api',
        'https://explorer.sonic.ooo/api'
    ]

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'Python/3.8'
    }

    for endpoint in endpoints:
        try:
            print(f"\nTrying endpoint: {endpoint}")
            
            # Verify contract
            response = requests.post(
                endpoint,
                data=data,
                headers=headers,
                verify=False,  # Ignore SSL verification
                allow_redirects=False
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    if result.get('status') == '1' or result.get('message') == 'OK':
                        guid = result.get('result')
                        print(f"\nVerification submitted successfully. GUID: {guid}")
                        
                        # Wait and check status
                        print("Waiting 30 seconds before checking status...")
                        time.sleep(30)
                        
                        status_params = {
                            'apikey': api_key,
                            'module': 'contract',
                            'action': 'checkverifystatus',
                            'guid': guid
                        }
                        
                        status_response = requests.get(
                            endpoint,
                            params=status_params,
                            headers=headers,
                            verify=False
                        )
                        
                        print(f"Verification Status: {status_response.text}")
                        break
                except json.JSONDecodeError:
                    print("Response was not valid JSON")
                    print(f"Raw response: {response.text}")
            
        except Exception as e:
            print(f"Error with {endpoint}: {str(e)}")
            continue

if __name__ == "__main__":
    main() 