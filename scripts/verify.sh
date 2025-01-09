#!/bin/bash

# Contract details
CONTRACT_ADDRESS="0x3fb23C53eB22762087B4557DB13c4d105EecB2b8"
API_KEY="H8MUPSYH1QDBERJCUKSD8WKDYFBRZ1SAEE"
SOURCE_CODE=$(cat contracts/flattened.sol)

echo "Attempting to verify contract at $CONTRACT_ADDRESS..."

# Try the API health check first
echo "Checking API health..."
curl -v "https://public-api.sonicscan.io/api?module=proxy&action=eth_blockNumber&apikey=$API_KEY"

echo -e "\n\nSubmitting verification request..."

# Construct the verification request
curl -v -X POST "https://public-api.sonicscan.io/api" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "User-Agent: curl/7.64.1" \
  --data-urlencode "apikey=$API_KEY" \
  --data-urlencode "module=contract" \
  --data-urlencode "action=verifysourcecode" \
  --data-urlencode "contractaddress=$CONTRACT_ADDRESS" \
  --data-urlencode "sourceCode=$SOURCE_CODE" \
  --data-urlencode "codeformat=solidity-single-file" \
  --data-urlencode "contractname=SonicTokenWrapper" \
  --data-urlencode "compilerversion=v0.8.20+commit.a1b79de6" \
  --data-urlencode "optimizationUsed=1" \
  --data-urlencode "runs=200" \
  --data-urlencode "constructorArguements=000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38" \
  --data-urlencode "evmversion=london" \
  --data-urlencode "licenseType=3" \
  -k

echo -e "\n\nVerification request completed. Check the response above for status." 