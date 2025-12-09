const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail
} = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA72Pkgm0V0uu4Dvo7QeiOvfeBeecY7lGQ",
  authDomain: "nova-dental-9d870.firebaseapp.com",
  projectId: "nova-dental-9d870",
  storageBucket: "nova-dental-9d870.firebasestorage.app",
  messagingSenderId: "139471332728",
  appId: "1:139471332728:web:86605f552f1341d277148d",
  measurementId: "G-MHQ4HXMDX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Default admin user credentials
const ADMIN_EMAIL = 'admin@yopmail.com';
const ADMIN_PASSWORD = '123456';

async function resetAdminPassword() {
  console.log('🔧 Resetting admin user password...\n');

  try {
    // Step 1: Send password reset email
    console.log('📧 Sending password reset email...');
    await sendPasswordResetEmail(auth, ADMIN_EMAIL);
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Check your email at:', ADMIN_EMAIL);
    console.log('🔗 Click the reset link in the email to set a new password');
    
    console.log('\n📋 Alternative Solution:');
    console.log('Since you need immediate access, here are the steps:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com');
    console.log('2. Select your project: nova-dental-9d870');
    console.log('3. Go to Authentication > Users');
    console.log('4. Find the user: admin@yopmail.com');
    console.log('5. Click the three dots (⋮) next to the user');
    console.log('6. Select "Reset password"');
    console.log('7. Set the password to: 123456');
    console.log('8. Save the changes');
    
    console.log('\n🔐 After resetting the password, you can sign in with:');
    console.log('   Email: admin@yopmail.com');
    console.log('   Password: 123456');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n🔧 User does not exist. Creating new user...');
      // Import the setup function from the other script
      const { setupFirebaseAuth } = require('./setup-firebase-auth.js');
      await setupFirebaseAuth();
    } else if (error.code === 'auth/too-many-requests') {
      console.log('\n🔧 Too many password reset attempts. Please wait a few minutes and try again.');
    } else {
      console.log('\n🔧 Manual password reset required:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com');
      console.log('2. Select your project: nova-dental-9d870');
      console.log('3. Go to Authentication > Users');
      console.log('4. Find the user: admin@yopmail.com');
      console.log('5. Click the three dots (⋮) next to the user');
      console.log('6. Select "Reset password"');
      console.log('7. Set the password to: 123456');
    }
  }
}

// Run the password reset
resetAdminPassword(); 