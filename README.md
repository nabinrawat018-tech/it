# ITNOTES - Engineering Education Platform

A comprehensive educational website for engineering students featuring notes, resources, and study materials with a modern, responsive design.

## Features

### 🎨 Design & UI
- **Modern Dark Theme**: Black background with gradient accents (#923FFF, #583FFF, #7DBFFF)
- **Glassmorphic Design**: Transparent elements with blur effects
- **Spotlight Effects**: Dynamic background animations
- **Fully Responsive**: Works on all devices (desktop, tablet, mobile)
- **Professional Typography**: Clean, modern Inter font family

### 📚 Educational Content
- **Comprehensive Notes**: Subject-wise notes for all semesters (1-8)
- **Question Banks**: Previous year questions and practice papers
- **Solutions**: Step-by-step solutions with explanations
- **Syllabus**: Complete course syllabi for all subjects
- **Academic Calendar**: Important dates and events

### 🛠️ Admin Panel
- **Dashboard**: Statistics and analytics
- **Images Management**: Upload and manage website images
- **Notes Resources**: Add/edit/delete study materials
- **Notes Options**: Manage course options and categories
- **API Keys**: Configure email and external services
- **User Management**: Add/edit users with different roles
- **Settings**: Change passwords, email, and system settings

### 🔧 Technical Features
- **Firebase Integration**: Database, authentication, and file storage
- **Contact Form**: Email integration for inquiries
- **Search Functionality**: Find notes and resources quickly
- **Theme Toggle**: Dark/light mode switching
- **Mobile Navigation**: Responsive mobile menu
- **Social Media Integration**: Facebook, Instagram, WhatsApp links

## File Structure

```
it/
├── index.html              # Main homepage
├── notes.html              # Notes page
├── semester.html           # Individual semester pages
├── admin.html              # Admin panel
├── styles.css              # Main stylesheet
├── admin-styles.css        # Admin panel styles
├── script.js               # Main JavaScript
├── notes.js                # Notes page JavaScript
├── semester.js             # Semester page JavaScript
├── admin.js                # Admin panel JavaScript
├── firebase-config.js      # Firebase configuration template
└── README.md               # This file
```

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable the following services:

#### Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password authentication
- Create admin user: `admin@itnotes.com` / `admin123`

#### Firestore Database
- Go to Firestore Database
- Create database in production mode
- Apply security rules (see below)

#### Storage
- Go to Storage
- Get started with default rules
- Used for image uploads

### 2. Update Configuration

1. Copy your Firebase config from Project Settings
2. Replace the configuration in `firebase-config.js`
3. Update `script.js` and `admin.js` with your Firebase config

### 3. Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Deployment

Deploy to any hosting service:
- **Firebase Hosting**: `firebase deploy`
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to GitHub and enable Pages

## Usage

### For Students
1. Visit the homepage
2. Browse notes by semester
3. Download study materials
4. Use search to find specific topics
5. Contact for support

### For Administrators
1. Click the admin icon (bottom right)
2. Login with admin credentials
3. Manage content through the admin panel
4. Upload new resources
5. Monitor website statistics

## Customization

### Colors
The website uses CSS custom properties for easy color customization:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #923FFF, #583FFF, #7DBFFF);
    --text-primary: #ffffff;
    --bg-primary: #000000;
    /* ... more variables */
}
```

### Content
- Add new semesters in `semester.js`
- Update services in `index.html`
- Modify author information in all HTML files
- Change social media links in footer

### Images
- Replace placeholder images with actual content
- Use the admin panel to manage images
- Recommended image hosting: ImgBB, Firebase Storage

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contact Information

- **Facebook**: [Nabin Rawat](https://www.facebook.com/nabin.rawat.444218)
- **Instagram**: [@netrarawat911](https://www.instagram.com/netrarawat911/)
- **WhatsApp**: +977 970-3888510

## License

© 2025 ITNOTES. All rights reserved.

## Support

For technical support or questions, please contact through the website's contact form or social media channels.

---

**Note**: This is a template website. Replace placeholder content with actual educational materials and update all configuration settings before deployment.
