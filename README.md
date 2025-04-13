# Political News Summarizer

A mobile application that provides accessible summaries of political news for audiences who may not be familiar with political terminology.

## Project Structure

- `backend/` - Go/GraphQL server with AWS integration
- `frontend/` - React Native mobile application

## Features

- News aggregation from multiple sources
- AI-powered summarization
- Simplified political news explanations
- Mobile-first design
- GraphQL API for efficient data fetching

## Tech Stack

### Backend
- Go
- GraphQL
- AWS Services (Lambda, DynamoDB, S3)
- News API integration

### Frontend
- React Native
- Apollo Client
- TypeScript
- Native iOS/Android components

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- React Native CLI
- AWS Account
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Set up backend:
   ```bash
   cd backend
   go mod init
   go mod tidy
   ```

3. Set up frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Configure environment variables for both backend and frontend

## Development

### Backend Development
```bash
cd backend
go run main.go
```

### Frontend Development
```bash
cd frontend
npm start
```

## License
MIT 