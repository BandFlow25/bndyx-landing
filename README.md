# BNDY Landing Page & Authentication

Central landing page and authentication hub for the BNDY ecosystem.

## Shared Types

All shared type definitions (such as Artist, ArtistMember, MusicGenre, etc.) are provided by the [bndy-types](../bndy-types) package. **Always import shared types from `bndy-types` and do not duplicate type definitions locally.**

Example usage:

```ts
import { Artist, ArtistMember } from 'bndy-types';
```

## Features

- Landing page with information about BNDY products
- Centralized authentication service for all BNDY applications
- Shared components with bndy-ui package
- Firebase authentication integration (email/password, Google, Facebook)
- Password reset functionality
- Account management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration:
```bash
cp .env.local.example .env.local
```

3. Link to bndy-ui package (for local development):
```bash
npm link bndy-ui
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

This project serves as the central authentication service for all BNDY applications. The authentication flow works as follows:

1. Users access bndy.co.uk or are redirected here from other BNDY applications
2. User completes authentication (login, signup, password reset)
3. Once authenticated, user is redirected back to the original application with authentication token
4. The token is verified in the destination application

## Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase App ID

## Authentication Routes

- `/login`: Main login/signup page
- `/reset-password`: Password reset page (with confirmation code)
- `/account`: User account management

## Deployment

This project is deployed on Replit and served at bndy.co.uk and www.bndy.co.uk.

## Related Projects

- [bndy-ui](https://github.com/bndy/bndy-ui): Shared UI components and authentication library
- [bndy-live](https://github.com/bndy/bndy-live): Events discovery platform
- [bndy-app](https://github.com/bndy/bndy-app): Management platform for bands, artists, venues