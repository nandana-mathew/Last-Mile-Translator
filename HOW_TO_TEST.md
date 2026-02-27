# How to Run and Test Language Translation

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Wait for:
```
🚀 Last-Mile Translator API running on port 3000
🎭 Demo Mode: ✅ ENABLED
```

### 3. Open Browser
Go to: **http://localhost:3000**

## Testing Steps

### Test 1: Home Page Language Switch

1. **You'll see the default English page** with:
   - Header: "🌐 Government Policy Updates"
   - 10 policy cards with English titles

2. **Click "हिंदी" button**
   - Wait 2-3 seconds
   - ALL policy titles should change to Hindi
   - State names should be in Hindi (Maharashtra → महाराष्ट्र)
   - Category names in Hindi (Agriculture → कृषि)
   - Brief descriptions in Hindi

3. **Click "ಕನ್ನಡ" button**
   - Everything translates to Kannada
   - Policy cards update with Kannada text

4. **Click "मराठी" button**
   - Everything translates to Marathi

5. **Click "தமிழ்" button**
   - Everything translates to Tamil

6. **Click "English" button**
   - Everything returns to English

### Test 2: Policy Detail Page

1. **Select Hindi (हिंदी)**
2. **Click on first policy card** ("Maharashtra Agriculture Subsidy Scheme 2024")
3. **New page opens with**:
   - Back button in Hindi: "← नीतियों पर वापस जाएं"
   - Loading text in Hindi
   - Policy title in Hindi
   - Summary in Hindi
   - Key Changes in Hindi
   - Personal Impact in Hindi

### Test 3: Language Persistence

1. Select Kannada
2. Press F5 to refresh
3. Page should load in Kannada automatically

### Test 4: Subscribe Modal

1. Select Tamil
2. Click subscribe button
3. Modal opens in Tamil
4. Try submitting without phone
5. Error message appears in Tamil

## What Should Happen

✅ **Header and subtitle** translate
✅ **All 10 policy cards** translate (title, state, category, brief)
✅ **Button text** translates
✅ **Modal content** translates
✅ **Policy detail page** fully translates
✅ **Error messages** translate

## Troubleshooting

**If nothing translates:**
- Check browser console (F12) for errors
- Verify server is running
- Try refreshing the page

**If translations are slow:**
- Normal! Each card makes an API call
- Wait 2-3 seconds after clicking language button

**If you see English mixed with other language:**
- The translation API might have failed for some items
- Check network tab in DevTools

## Expected Timeline

- Language button click → 0.5s
- Translation API calls → 1-2s per policy
- Total time for full page translation → 2-3s

That's it! The entire website should now switch languages completely.
