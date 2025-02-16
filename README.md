# Mental Health & Wellness Platform

This project is a comprehensive mental health and wellness platform that combines AI-powered chat support, guided exercises, and mood tracking to help users maintain their mental well-being.

## Features

### 🤖 AI Chat Support
- Empathetic AI companion for supportive conversations
- Multiple chat topics including anxiety, relationships, and general wellness
- Crisis detection and emergency resource provision
- Chat history and session management

### 🧘‍♂️ Wellness Activities
- **Focus Sessions**: Guided meditation for improved concentration
- **Breathing Exercises**: 4-7-8 breathing technique for stress relief
- **Bedtime Routine**: Structured routine for better sleep quality
- **Relaxation Exercises**: Guided relaxation for stress reduction

### 📊 Progress Tracking
- Daily mood tracking with visual analytics
- Points system for activity completion
- Progress statistics and trends
- Mood distribution analysis

### 📚 Resource Library
- Mindful music playlists
- Wellness podcasts
- Self-help book recommendations
- Guided video content
- Mental health articles and research

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: Google's Gemini Pro
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Routing**: React Router
- **Markdown**: React Markdown

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── context/          # React context providers
├── lib/              # Utility functions and API clients
├── pages/            # Main application pages
└── types/            # TypeScript type definitions
```

## Key Components

- `Layout.tsx`: Main application layout with navigation
- `Chat.tsx`: AI chat interface with mood tracking
- `ActivityCard.tsx`: Reusable card for wellness activities
- `Statistics.tsx`: Data visualization and progress tracking
- `MoodSelector.tsx`: Interactive mood selection interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request




## Acknowledgments

- Google's Gemini AI for powering the chat functionality
- Firebase for authentication and database services
- The React and TypeScript communities for excellent tools and documentation