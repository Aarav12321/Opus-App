# Opus app — starter project

## Run it locally

1. Make sure you have Node.js installed (download from nodejs.org if not — pick the LTS version).
2. Open a terminal in this folder.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open the URL it gives you (usually `http://localhost:5173`) in your browser.

You should see the Opus app running. Edit `src/App.jsx` and save — the browser updates automatically.

## Deploy to Vercel

1. Create a free account at vercel.com (sign in with GitHub).
2. Push this folder to a new GitHub repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. On Vercel: "Add New Project" → import your repository → Deploy.
   Vercel auto-detects the Vite settings, no config needed.
4. You'll get a live URL you can open on any device.

## Project structure

- `src/App.jsx` — the whole app (all screens, components, data)
- `src/firebase.js` — Firebase setup (auth + Firestore). Safe to leave unconfigured.
- `src/main.jsx` — entry point, don't need to touch this
- `index.html` — page shell, don't need to touch this
- `package.json` — dependencies

## Sign-up & accounts

The app works without any backend setup — sign-up via the email form stores
your profile in the browser's local storage, so it persists between visits
on the same device/browser.

**Demo account**: enter the name "Example Pitch" (or any name) with the email
`pitch@example.com` to jump straight into a pre-filled example profile — useful
for showing the app to someone without creating a real account.

**Google / Apple sign-in**: optional, requires Firebase (see below). Without
it configured, those buttons show an explanation and the email form still works.

## Optional: set up Firebase (Google sign-in, cloud storage)

1. Create a free project at https://console.firebase.google.com
2. In the project, go to Build > Authentication > Sign-in method, and enable
   **Google** (and **Apple**, if you have an Apple Developer account — $99/year).
3. Go to Build > Firestore Database and create a database (test mode is fine
   to start).
4. Go to Project settings > General > Your apps > add a Web app, and copy the
   config values shown.
5. Copy `.env.example` to `.env` and paste those values in.
6. Restart `npm run dev`.

Without these steps, the app runs entirely on local storage — no errors, just
fewer features (no cross-device sync, no Google/Apple buttons).
