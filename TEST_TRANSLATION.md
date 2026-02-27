# Testing Language Translation Feature

## Steps to Run and Test

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

You should see:
```
🚀 Last-Mile Translator API running on port 3000
📍 Environment: development
🎭 Demo Mode: ✅ ENABLED
```

### 3. Open the Application
Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Test Language Switching on Home Page

#### What to Test:
1. **Default View (English)**
   - You'll see "🌐 Government Policy Updates" as the header
   - Policy cards showing titles like "Maharashtra Agriculture Subsidy Scheme 2024"
   - Tags showing "Maharashtra", "Agriculture", etc.

2. **Switch to Hindi (हिंदी)**
   - Click the "हिंदी" button
   - Wait 1-2 seconds for translation
   - Everything should change to Hindi:
     - Header: "🌐 सरकारी नीति अपडेट"
     - Policy titles should be in Hindi
     - State names: "Maharashtra" → "महाराष्ट्र"
     - Category names: "Agriculture" → "कृषि"
     - Brief descriptions in Hindi

3. **Switch to Kannada (ಕನ್ನಡ)**
   - Click the "ಕನ್ನಡ" button
   - Everything translates to Kannada
   - Header: "🌐 ಸರ್ಕಾರಿ ನೀತಿ ನವೀಕರಣಗಳು"

4. **Switch to Marathi (मराठी)**
   - Click the "मराठी" button
   - Everything translates to Marathi
   - Header: "🌐 सरकारी धोरण अद्यतने"

5. **Switch to Tamil (தமிழ்)**
   - Click the "தமிழ்" button
   - Everything translates to Tamil
   - Header: "🌐 அரசு கொள்கை புதுப்பிப்புகள்"

### 5. Test Policy Detail Page

1. **Select a Language** (e.g., Hindi)
2. **Click on any policy card** (e.g., "Maharashtra Agriculture Subsidy Scheme 2024")
3. **Verify the detail page**:
   - Back button: "← नीतियों पर वापस जाएं" (in Hindi)
   - Loading text: "नीति का विश्लेषण किया जा रहा है..." (in Hindi)
   - Policy title in Hindi
   - Summary section in Hindi
   - Key Changes list in Hindi
   - Personal Impact section in Hindi

### 6. Test Language Persistence

1. Select Hindi (हिंदी)
2. Refresh the page (F5)
3. The page should load in Hindi automatically
4. Language preference is saved in browser localStorage

### 7. Test Subscribe Modal

1. Select a language (e.g., Kannada)
2. Click "📱 SMS ಗಾಗಿ ಚಂದಾದಾರರಾಗಿ" button
3. Modal should open with:
   - Title in Kannada
   - Description in Kannada
   - Submit button in Kannada
4. Try submitting without phone number
   - Error message should appear in Kannada

### 8. Test on Mobile

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. Test language switching
5. Verify all elements are responsive and translated

## Expected Behavior

### What Should Translate:
✅ Page headers and subtitles
✅ Button text
✅ Policy titles
✅ Policy descriptions
✅ State names (Maharashtra → महाराष्ट्र)
✅ Category names (Agriculture → कृषि)
✅ Modal content
✅ Error messages
✅ Loading messages
✅ Back button text
✅ Section titles (Summary, Key Changes, etc.)

### What Stays the Same:
- Dates (formatted as per locale)
- Numbers (Rs. 2,00,000)
- Emojis (🌐, 📱, 📋, etc.)

## Troubleshooting

### If translations don't work:
1. Check browser console (F12) for errors
2. Verify server is running on port 3000
3. Check network tab to see if `/api/translate` calls are successful
4. Try refreshing the page

### If translations are slow:
- This is normal - each policy card makes a separate API call
- The Google Translate API is being used in demo mode
- In production, you'd use AWS Translate for faster results

### If you see original English text:
- Wait a few seconds - translations happen asynchronously
- Check if the language button is highlighted (active)
- Try clicking the language button again

## Notes

- Translation uses Google Translate API in demo mode (free, no API key required)
- In production, this would use AWS Translate service
- Language preference is saved in browser localStorage
- Translations happen in real-time when you switch languages
