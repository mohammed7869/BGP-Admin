const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  deleteUser
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

async function fixAdminUser() {
  console.log('🔧 Fixing admin user...\n');

  try {
    // Step 1: Try to sign in to see if user exists
    console.log('📋 Checking current user status...');
    
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ User exists and password is correct!');
      console.log('🔐 You can now sign in with:');
      console.log('   Email: admin@yopmail.com');
      console.log('   Password: 123456');
      return;
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        console.log('❌ User does not exist. Creating new user...');
      } else if (signInError.code === 'auth/invalid-login-credentials') {
        console.log('⚠️  User exists but password is incorrect. Need to recreate user.');
        console.log('📋 Note: This requires Firebase Console access to delete the existing user.');
        console.log('\n🔧 Manual steps required:');
        console.log('1. Go to Firebase Console: https://console.firebase.google.com');
        console.log('2. Select your project: nova-dental-9d870');
        console.log('3. Go to Authentication > Users');
        console.log('4. Find the user: admin@yopmail.com');
        console.log('5. Click the three dots (⋮) next to the user');
        console.log('6. Select "Delete user"');
        console.log('7. Confirm deletion');
        console.log('8. Run this script again to create the user with correct password');
        return;
      } else {
        console.log('⚠️  Unexpected error:', signInError.message);
        return;
      }
    }

    // Step 2: Create the admin user
    console.log('👤 Creating admin user...');
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('🆔 User ID:', user.uid);

    // Step 3: Create a sample appointment for testing
    console.log('\n📅 Creating sample appointment for testing...');
    
    const sampleAppointment = {
      patientName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      appointmentDate: new Date('2024-01-15'),
      appointmentTime: '10:00 AM',
      duration: '30 minutes',
      location: 'Main Clinic',
      provider: 'Dr. Smith',
      source: 'Online',
      reason: 'Regular Checkup',
      status: 'Requested',
      isNewPatient: true,
      insuranceInfo: {
        provider: 'Blue Cross',
        memberId: 'BC123456789',
        groupNumber: 'GRP001',
        phoneNumber: '+18005551234'
      },
      contactInfo: {
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '+1234567891'
      },
      reminderStatus: 'Reminder Not Sent',
      appointmentOrigin: 'Online',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.uid,
      notes: 'Sample appointment for testing purposes',
      // Additional fields from your Firebase screenshot
      dob: new Date('1990-01-01'),
      sex: 'Male',
      requestedTime: '10:00 AM',
      calendarName: 'General Dentistry',
      patientComments: 'Patient prefers morning appointments',
      notificationOptOuts: ['email', 'sms']
    };

    const docRef = await addDoc(collection(db, 'appointments'), sampleAppointment);
    console.log('✅ Sample appointment created with ID:', docRef.id);

    console.log('\n🎉 Admin user setup completed successfully!');
    console.log('\n🔐 You can now sign in to your Angular admin panel with:');
    console.log('   Email: admin@yopmail.com');
    console.log('   Password: 123456');

  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n🔧 User already exists with different credentials.');
      console.log('📋 Manual steps required:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com');
      console.log('2. Select your project: nova-dental-9d870');
      console.log('3. Go to Authentication > Users');
      console.log('4. Find the user: admin@yopmail.com');
      console.log('5. Click the three dots (⋮) next to the user');
      console.log('6. Select "Delete user"');
      console.log('7. Confirm deletion');
      console.log('8. Run this script again');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n🔧 Password is too weak. Please use a stronger password.');
    } else {
      console.log('\n🔧 Unexpected error. Please check the Firebase Console manually.');
    }
  }
}

// Run the fix
fixAdminUser(); 