# Last-Mile Translator

Government document translation and summarization system using AWS services.

## Features

- 📄 PDF document upload and text extraction (Textract)
- 🌍 Multi-language translation (Amazon Translate)
- 🔊 Text-to-speech conversion (Amazon Polly)
- 📱 SMS notifications for policy updates (SNS)
- 🎯 Category-based subscription system
- 📰 Live scrolling news ticker
- 🎨 Modern, responsive UI

## Quick Start

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Windows
```cmd
deploy-complete-system.bat
```

### Mac / Linux / WSL
```bash
chmod +x deploy-complete-system.sh
./deploy-complete-system.sh
```

## Architecture

- **Frontend**: Static HTML/CSS/JS hosted on S3
- **Backend**: AWS Lambda + API Gateway
- **Storage**: S3 (documents) + DynamoDB (metadata)
- **AI Services**: Textract (OCR), Translate, Polly

## Project Structure

```
├── public/              # Frontend files
├── src/
│   ├── handlers/       # Business logic
│   ├── lambda/         # Lambda handlers
│   └── services/       # AWS integrations
├── serverless.yml      # Infrastructure config
└── .env               # Environment variables
```

## Requirements

- AWS Account with credentials configured
- Node.js 18+
- AWS CLI
- Serverless Framework

## Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [requirements.md](requirements.md) - Project requirements
- [design.md](design.md) - System design
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture

## Cost Estimate

With AWS Free Tier: ~$5-20/month depending on usage.

## License

MIT
