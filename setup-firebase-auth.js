const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
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

async function setupFirebaseAuth() {
  console.log('🚀 Setting up Firebase Authentication...\n');

  try {
    // Step 1: Check if user already exists
    console.log('📋 Checking if admin user already exists...');
    
    try {
      // Try to sign in with the credentials
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin user already exists and can sign in successfully!');
      console.log('📧 Email:', ADMIN_EMAIL);
      console.log('🔑 Password:', ADMIN_PASSWORD);
      return;
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found') {
        console.log('❌ Admin user does not exist. Creating new user...');
      } else {
        console.log('⚠️  User exists but password might be different:', signInError.message);
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

    console.log('\n🎉 Firebase Authentication setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com');
    console.log('2. Select your project: nova-dental-9d870');
    console.log('3. Go to Authentication > Users');
    console.log('4. Verify the admin user is listed');
    console.log('5. Go to Firestore Database > Data');
    console.log('6. Verify the sample appointment is in the appointments collection');
    console.log('\n🔐 You can now sign in to your Angular admin panel with:');
    console.log('   Email: admin@yopmail.com');
    console.log('   Password: 123456');

  } catch (error) {
    console.error('❌ Error setting up Firebase Authentication:', error);
    
    if (error.code === 'auth/configuration-not-found') {
      console.log('\n🔧 To fix this error:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com');
      console.log('2. Select your project: nova-dental-9d870');
      console.log('3. Go to Authentication > Sign-in method');
      console.log('4. Enable Email/Password authentication');
      console.log('5. Run this script again');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('\n🔧 To fix this error:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com');
      console.log('2. Select your project: nova-dental-9d870');
      console.log('3. Go to Authentication > Sign-in method');
      console.log('4. Enable Email/Password authentication');
      console.log('5. Run this script again');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n🔧 Password is too weak. Please use a stronger password.');
    } else if (error.code === 'auth/email-already-in-use') {
      console.log('\n🔧 Email is already in use. Please use a different email.');
    }
  }
}

// Run the setup
setupFirebaseAuth(); 