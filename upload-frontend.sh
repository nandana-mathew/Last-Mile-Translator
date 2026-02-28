#!/bin/bash

echo "========================================"
echo "Uploading Frontend to S3"
echo "========================================"
echo ""
echo "Uploading files to: last-mile-translator-web-20260228205048"
echo ""

aws s3 sync ./public s3://last-mile-translator-web-20260228205048 --delete

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Upload failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Upload Complete!"
echo "========================================"
echo ""
echo "Website URL: http://last-mile-translator-web-20260228205048.s3-website-us-east-1.amazonaws.com"
echo ""
echo "NEXT STEPS:"
echo "1. Clear browser cache: Cmd + Shift + Delete (Mac) or Ctrl + Shift + Delete"
echo "2. Hard refresh: Cmd + Shift + R (Mac) or Ctrl + F5"
echo "3. Test all features"
echo ""
