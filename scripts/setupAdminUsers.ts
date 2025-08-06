import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase config (use your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyC_example", // Replace with your actual config
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin users to add
const adminUsers = [
  {
    uid: 'admin_rutwik', // This will be replaced with actual UID when they sign up
    email: 'rutwiksunilbutani@gmail.com',
    role: 'super_admin',
    permissions: [
      'manage_users',
      'manage_cases', 
      'view_analytics',
      'manage_admins',
      'export_data',
      'delete_users',
      'system_settings'
    ],
    isActive: true,
    createdAt: Timestamp.now(),
    createdBy: 'system'
  },
  {
    uid: 'admin_test1', // This will be replaced with actual UID when they sign up
    email: 'testadminuser1@gmail.com',
    role: 'super_admin',
    permissions: [
      'manage_users',
      'manage_cases',
      'view_analytics', 
      'manage_admins',
      'export_data',
      'delete_users',
      'system_settings'
    ],
    isActive: true,
    createdAt: Timestamp.now(),
    createdBy: 'system'
  }
];

// Function to add admin users to Firestore
const addAdminUsers = async () => {
  try {
    console.log('🔧 Adding admin users to Firebase...');
    
    for (const admin of adminUsers) {
      // Add to admins collection using email as document ID for now
      // When they actually sign up, this will be updated with their real UID
      const adminDocId = admin.email.replace('@', '_at_').replace('.', '_dot_');
      
      await setDoc(doc(db, 'admin_preapproved', adminDocId), {
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        createdBy: admin.createdBy,
        status: 'preapproved' // They get admin access when they first sign up
      });
      
      console.log(`✅ Pre-approved admin access for: ${admin.email}`);
    }
    
    console.log('🎉 All admin users have been pre-approved!');
    console.log('📝 Note: When these users sign up for the first time, they will automatically get admin privileges.');
    
  } catch (error) {
    console.error('❌ Error adding admin users:', error);
  }
};

// Run the script
addAdminUsers();

export { addAdminUsers };
