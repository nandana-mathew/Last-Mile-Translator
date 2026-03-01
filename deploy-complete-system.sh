#!/bin/bash

echo "========================================"
echo "Deploy Complete System"
echo "========================================"
echo ""
echo "This will deploy:"
echo "- Backend Lambda functions with CORS"
echo "- Frontend with all features"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "[1/2] Deploying backend to AWS Lambda..."
serverless deploy --stage prod --region us-east-1

if [ $? -ne 0 ]; then
    echo "ERROR: Backend deployment failed!"
    exit 1
fi

echo ""
echo "[2/2] Updating frontend on S3..."
echo "Uploading to: last-mile-translator-web-20260228205048"
aws s3 sync ./public s3://last-mile-translator-web-20260228205048 --delete

if [ $? -ne 0 ]; then
    echo "ERROR: Frontend update failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Website: http://last-mile-translator-web-20260228205048.s3-website-us-east-1.amazonaws.com"
echo "API: https://v5ctt7o1s1.execute-api.us-east-1.amazonaws.com/prod"
echo ""
echo "IMPORTANT: Clear browser cache and hard refresh!"
echo ""
