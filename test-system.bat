@echo off
echo ========================================
echo Last-Mile Translator - System Test
echo ========================================
echo.

set API_URL=https://v5ctt7o1s1.execute-api.us-east-1.amazonaws.com/prod
set WEBSITE_URL=https://last-mile-translator-bucket.s3.us-east-1.amazonaws.com/index.html

echo Testing backend API...
echo.

echo [1/3] Testing health endpoint...
curl -s %API_URL%/api/health
echo.
echo.

echo [2/3] Testing recent policies endpoint...
curl -s %API_URL%/api/policies/recent
echo.
echo.

echo [3/3] Testing CORS headers...
curl -s -I %API_URL%/api/health | findstr "Access-Control"
echo.
echo.

echo ========================================
echo Frontend URLs
echo ========================================
echo.
echo Website: %WEBSITE_URL%
echo.
echo Open this URL in your browser and test:
echo - Language switching
echo - Policy card clicks
echo - Document upload
echo - SMS subscription
echo.

echo ========================================
echo Test Complete
echo ========================================
echo.
echo If you see JSON responses above, the backend is working!
echo If you see "Access-Control-Allow-Origin", CORS is fixed!
echo.
pause
