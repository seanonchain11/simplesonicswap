#!/bin/bash

# Replace these with your values
BUCKET_NAME="simplesonicswap"
REGION="us-east-1"

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html

# Create bucket policy for public access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

# Apply the bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json 