# Jumblem Web App

A browser-based version of **Jumblem**, a multiplayer word game originally built for iOS. This version was created with React and TypeScript and uses Firebase for authentication and game data.

**Live app:** [jumblem.com](https://www.jumblem.com)
**iOS repository:** [JumblemiOS](https://github.com/jedkutai/JumblemiOS)

## About the Game

Jumblem challenges players to find and build words while competing in several game modes. Players can complete the daily puzzle, play against other users, spectate games, explore player profiles, and look up words in the in-app dictionary.

## Features

* Daily word puzzle
* Casual multiplayer games
* Rated competitive games
* Private matches
* Live game spectating
* Guest access
* Account creation and login
* Player profiles
* Player search and social features
* Game and player statistics
* Rematch support
* Dictionary word pages
* In-app game tutorials
* Account and username settings
* Privacy policy and terms pages
* Custom 404 page

## Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **React Router**
* **Firebase Authentication**
* **Cloud Firestore**
* **Material UI**
* **Emotion**
* **Axios**
* **date-fns and Luxon**
* **Vercel**

## Getting Started

### Prerequisites

Install a current Node.js LTS release, which includes npm.

### 1. Clone the repository

```bash
git clone https://github.com/jedkutai/JumblemWebApp.git
cd JumblemWebApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

The Firebase client configuration is initialized in:

```text
src/firebase.ts
```

To use your own Firebase project:

1. Create a project in the Firebase console.
2. Register a web application.
3. Enable the authentication providers required by the app.
4. Create a Cloud Firestore database.
5. Replace the values in `src/firebase.ts` with your Firebase web configuration.
6. Add Firestore Security Rules that protect users, games, ratings, puzzles, and administrative data.

Firebase web configuration values are included in client-side applications and should not be treated as server credentials. Never place Firebase Admin service-account keys, private keys, passwords, or other server secrets in this project.

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs the TypeScript project build and creates a production bundle in `dist/`.

```bash
npm run preview
```

Serves the production build locally for testing.

```bash
npm run lint
```

Runs ESLint across the project.

## Project Structure

```text
JumblemWebApp/
├── public/                 Static public assets
├── src/
│   ├── App/
│   │   ├── Components/     Reusable interface components
│   │   ├── General/        Tutorials, policies, and shared pages
│   │   ├── GuestViews/     Guest-user experiences
│   │   └── Views/          Feature-specific application views
│   ├── Background/
│   │   ├── Extends/        Shared extensions and helpers
│   │   ├── Managers/       Game and spectating state management
│   │   ├── Models/         Users, games, moves, words, and puzzles
│   │   ├── Service/        Firebase and application services
│   │   └── Utils/          General utilities
│   ├── ReactSwiftly/       Shared UI and application abstractions
│   ├── RouteControllers/   Route-level components grouped by feature
│   ├── assets/             Images and bundled assets
│   ├── App.tsx             Main router configuration
│   ├── ContentView.tsx     Initial authentication and app-entry flow
│   ├── firebase.ts         Firebase client initialization
│   └── main.tsx            React entry point
├── vercel.json             Single-page application route rewrites
├── vite.config.ts          Vite configuration
├── wordbank.txt            Word-bank data
└── package.json            Dependencies and npm scripts
```

## Main Routes

| Route               | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `/`                 | Initial application and authentication flow |
| `/home`             | Main signed-in experience                   |
| `/dailypuzzle`      | Daily puzzle                                |
| `/casual`           | Casual game                                 |
| `/rated`            | Rated game                                  |
| `/private`          | Private match                               |
| `/spectate`         | Spectator menu                              |
| `/spectate/:gameId` | Spectate a specific game                    |
| `/profile`          | Current user profile                        |
| `/people`           | Player and social area                      |
| `/findpeople`       | Player search                               |
| `/people/:username` | Public player profile                       |
| `/games/:gameId`    | Specific game details                       |
| `/dictionary/:word` | Dictionary entry                            |
| `/settings`         | Account settings                            |

## Deployment

The production site is hosted on Vercel and connected to this GitHub repository. Pushing changes to the configured production branch triggers a new deployment.

The project uses `vercel.json` to send application routes to `index.html`, allowing React Router URLs such as `/rated`, `/profile`, and `/games/:gameId` to work when opened or refreshed directly.

Vercel should use:

```text
Build command: npm run build
Output directory: dist
```

## Security

The frontend should never be trusted to enforce authorization by itself. Firebase Authentication identifies the user, but access to Firestore data must be enforced with Firestore Security Rules.

Do not commit:

* Firebase Admin SDK service-account files
* Private API keys or server credentials
* `.env` files containing secrets
* Passwords or authentication tokens
* Vercel access tokens

## Related Project

The original iOS version is written in Swift and SwiftUI:

[JumblemiOS on GitHub](https://github.com/jedkutai/JumblemiOS)

## Author

Idea by Jake Lambert.
Created by [Jed Kutai](https://github.com/jedkutai).
