@echo off
echo ========================================
echo Deploy Complete System
echo ========================================
echo.
echo This will deploy:
echo - Backend Lambda functions with CORS
echo - Frontend with all features
echo.
pause

echo.
echo [1/2] Deploying backend to AWS Lambda...
serverless deploy --stage prod --region us-east-1

if %errorlevel% neq 0 (
    echo ERROR: Backend deployment failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Updating frontend on S3...
echo Uploading to: last-mile-translator-web-20260228205048
aws s3 sync ./public s3://last-mile-translator-web-20260228205048 --delete

if %errorlevel% neq 0 (
    echo ERROR: Frontend update failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Website: http://last-mile-translator-web-20260228205048.s3-website-us-east-1.amazonaws.com
echo API: https://v5ctt7o1s1.execute-api.us-east-1.amazonaws.com/prod
echo.
echo IMPORTANT: Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+F5)!
echo.
pause
