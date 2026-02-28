@echo off
echo ========================================
echo Fix S3 Bucket Public Access
echo ========================================
echo.

REM Use the configured bucket name
set BUCKET_NAME=last-mile-translator-bucket

echo Fixing public access for bucket: %BUCKET_NAME%
echo.

REM Step 1: Disable block public access
echo [1/3] Disabling block public access settings...
aws s3api put-public-access-block ^
  --bucket %BUCKET_NAME% ^
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if %errorlevel% neq 0 (
    echo ERROR: Failed to update public access block settings
    echo Make sure the bucket name is correct
    pause
    exit /b 1
)
echo ✓ Public access block disabled
echo.

REM Wait a moment for AWS to process
timeout /t 2 /nobreak >nul

REM Step 2: Create and apply bucket policy
echo [2/3] Creating bucket policy...
(
echo {
echo   "Version": "2012-10-17",
echo   "Statement": [
echo     {
echo       "Sid": "PublicReadGetObject",
echo       "Effect": "Allow",
echo       "Principal": "*",
echo       "Action": "s3:GetObject",
echo       "Resource": "arn:aws:s3:::%BUCKET_NAME%/*"
echo     }
echo   ]
echo }
) > bucket-policy-temp.json

echo ✓ Policy file created
echo.

echo [3/3] Applying bucket policy...
aws s3api put-bucket-policy --bucket %BUCKET_NAME% --policy file://bucket-policy-temp.json

if %errorlevel% neq 0 (
    echo ERROR: Failed to apply bucket policy
    del bucket-policy-temp.json
    pause
    exit /b 1
)

del bucket-policy-temp.json
echo ✓ Bucket policy applied
echo.

echo ========================================
echo Success! Bucket is now public
echo ========================================
echo.
echo Your website should now be accessible at:
echo https://%BUCKET_NAME%.s3.us-east-1.amazonaws.com/index.html
echo.
echo Try opening it in your browser now!
echo.
pause
