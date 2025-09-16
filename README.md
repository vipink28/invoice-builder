# Invoice Builder

**Invoice Builder** is a React.js app for creating, managing and sending invoices. This README explains how to set up and run the project locally, how to configure Firebase (Authentication + Firestore) and the Firestore security rules you must paste into your Firebase console.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Download & Run Locally](#download--run-locally)
3. [Firebase Setup (step-by-step)](#firebase-setup-step-by-step)
4. [Environment Variables / Firebase config](#environment-variables--firebase-config)
5. [Firestore Security Rules](#firestore-security-rules)
6. [Build & Deploy](#build--deploy)
7. [License](#license)

---

## Prerequisites

- Node.js (recommended v18+)
- npm (comes with Node) or yarn
- A Firebase account

> **Note:** The project uses a Vite-style dev script (`npm run dev`). If your project uses Create React App, the commands may be `npm start` instead. This README assumes `npm run dev` as requested.

---

## Download & Run Locally

1. Download the project ZIP from GitHub and extract it.
2. Open a terminal and `cd` into the extracted project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

The app should open at the address shown in the terminal (commonly `http://localhost:5173` for Vite).

---

## Firebase Setup (step-by-step)

Follow these steps to create a Firebase project, enable Authentication, and create a Firestore database.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project** → follow the prompts to create a new project.

2. **Enable Authentication**
   - In the left sidebar go to **Authentication → Sign-in method**.
   - Enable **Google** provider and configure any required OAuth consent settings (add authorized domains if needed).
   - Enable **Email/Password** provider.

3. **Create Firestore database**
   - In the left sidebar choose **Firestore Database** → **Create database**.
   - Choose a location and create the database. It is fine to start in locked/production mode because you will paste the security rules provided below.

4. **Create a Web App (to get config)**
   - In Firebase Console go to Project Settings → _Your apps_ → click **</> (Web)** to register a new web app.
   - Copy the Firebase config object (apiKey, authDomain, projectId, etc.). You will add these to environment variables in the next section.

5. **Set Firestore Rules**
   - In the Firestore console open the **Rules** tab and replace the default rules with the security rules block shown below (make sure to publish/save them).

6. (Optional) Create test users or an admin record in `/users/{uid}` to test admin behavior. The rules expect a `role` field set to `"admin"` to grant admin permissions.

---

## Environment Variables / Firebase config

This project expects your Firebase config to be available to the client. If you are using Vite (recommended given `npm run dev`), create a file named `.env.local` in the project root and add the following entries (replace the `...` with values from your Firebase project settings):

// invoice-builder/.env.local

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...  # optional
```

```js
// src/firebaseConfig.js
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// then initialize Firebase in your project using this config
```

---

## Firestore Security Rules

Replace the default Firestore rules in the Firebase console with the following (exact block):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
     return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Users collection
    match /users/{userId} {

      // User can read/write only their own profile
      allow read, update, delete: if isOwner(userId);
      allow create: if isSignedIn();

      // ✅ Admins can read/write all users
      allow read, write: if isAdmin();

      // Subcollection: Invoices
      match /invoices/{invoiceId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }

      // Subcollection: Companies
      match /companies/{companyId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }
  }
}
```

> **Note:** According to these rules, invoices and companies are expected as subcollections under each user document, e.g. `/users/{uid}/invoices/{invoiceId}` and `/users/{uid}/companies/{companyId}`. Admins are determined by a `role` field on the user document (`role: "admin"`).

---

---

## Build & Deploy

**Build for production**

```bash
npm run build
```

If you use Vite, to preview the production build locally:

```bash
npm run preview
```

## License

This project is provided as-is. Add an appropriate license file (`LICENSE`) if you plan to publish the repository.

---

## Contact

If you need help integrating any part of Firebase or want the README adjusted (more screenshots, examples, or a different env pattern), let me know and I will update the document.
