// Firebase Configuration Template
// Replace these values with your actual Firebase project configuration

const firebaseConfig = {
    // Your Firebase project configuration
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Instructions for setting up Firebase:
/*
1. Go to https://console.firebase.google.com/
2. Create a new project or select an existing one
3. Go to Project Settings > General > Your apps
4. Click "Add app" and select Web
5. Copy the configuration object and replace the values above
6. Enable the following services in Firebase Console:

   Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Set up admin user with email: admin@itnotes.com and password: admin123

   Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

   Storage:
   - Go to Storage
   - Get started with default rules
   - This will be used for image uploads

7. Update the firebaseConfig object in both script.js and admin.js files
8. Deploy your website to a hosting service (Firebase Hosting, Netlify, Vercel, etc.)

Firestore Security Rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents for public content
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /{document=**} {
      allow write: if request.auth != null;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User management
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}

Storage Security Rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
