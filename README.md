# WorldChat 💬

A real-time chat application built with React, Vite, and Firebase. Connect with people around the world instantly.

## Features

- **Real-time Messaging**: Messages sync instantly using Firebase Firestore
- **User Authentication**: Secure email/password authentication
- **Display Names**: Custom user profiles with display names
- **Profile Pictures**: Upload and display profile pictures
- **User Identification**: Every message clearly shows who sent it
- **Professional UI**: Modern, responsive design
- **Mobile-Friendly**: Optimized for all screen sizes

## Tech Stack

- **Frontend**: React 19 + Vite
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for profile pictures)
- **Authentication**: Firebase Auth
- **Styling**: CSS3

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- A Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd WORLD-MESSAGE
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy `.env.local.example` to `.env.local` (if it exists)
   - Update with your Firebase config (currently hardcoded, see Firebase Setup below)

4. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Note your project ID

### 2. Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (development only - update for production)
4. Select your preferred location
5. Click **Create**

### 3. Enable Authentication

1. Go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider

### 4. Enable Firebase Storage

1. Go to **Storage**
2. Click **Get Started**
3. Choose a storage location
4. Click **Done**

### 5. Update Firebase Security Rules

#### Firestore Rules (for Firestore Database):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Messages collection - authenticated users can read all, write new messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.uid;
    }
  }
}
```

#### Storage Rules (for Firebase Storage):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures - users can upload to their own folder
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 6. Update Configuration

Update the Firebase config in `src/firebase.js` with your project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Firestore Data Structure

### Users Collection

```javascript
{
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: timestamp
}
```

### Messages Collection

```javascript
{
  text: string,
  uid: string,
  email: string,
  senderName: string,
  senderPhotoURL: string,
  createdAt: timestamp
}
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot reload.

### Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Lint

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add WorldChat features"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Configure Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Deploy

Click "Deploy" and your app will be live!

## Security Notes ⚠️

- **Never commit Firebase credentials** to version control in production
- Use environment variables for sensitive data
- Review and update Firebase security rules for production
- Keep dependencies up-to-date
- Regular security audits recommended

## Future Improvements

- [ ] Image sharing in messages
- [ ] Typing indicators
- [ ] Message reactions
- [ ] Group chats
- [ ] Message search
- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] End-to-end encryption

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
