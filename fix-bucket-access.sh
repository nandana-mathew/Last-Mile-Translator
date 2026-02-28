#!/bin/bash

echo "========================================"
echo "Fix S3 Bucket Public Access"
echo "========================================"
echo ""

# Get bucket name
BUCKET_NAME=$(aws s3 ls | grep last-mile-translator-web | awk '{print $3}')

if [ -z "$BUCKET_NAME" ]; then
    echo "ERROR: Could not find bucket starting with 'last-mile-translator-web'"
    echo "Please run: aws s3 ls"
    exit 1
fi

echo "Found bucket: $BUCKET_NAME"
echo ""
echo "Disabling block public access..."

aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Success! Public access enabled."
    echo ""
    echo "Your website URL:"
    echo "http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
else
    echo ""
    echo "✗ Failed to update bucket settings"
    exit 1
fi
