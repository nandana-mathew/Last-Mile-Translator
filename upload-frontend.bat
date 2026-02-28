@echo off
echo ========================================
echo Uploading Frontend to S3
echo ========================================
echo.
echo Uploading files to: last-mile-translator-web-20260228205048
echo.

aws s3 sync ./public s3://last-mile-translator-web-20260228205048 --delete

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Upload failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Website URL: http://last-mile-translator-web-20260228205048.s3-website-us-east-1.amazonaws.com
echo.
echo NEXT STEPS:
echo 1. Clear browser cache: Ctrl + Shift + Delete
echo 2. Hard refresh: Ctrl + F5
echo 3. Test all features
echo.
pause
