import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { auth, db, analytics } from '../config/firebase';
import toast from 'react-hot-toast';
import { logger, LogCategory } from '../utils/logger';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  hints: number;
  completedCases: string[];
  unlockedCases: string[];
  totalPoints: number;
  achievements: string[];
  evidence: Evidence[];
  profilePictureUrl?: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  referralCode: string;
  referralStats: ReferralStats;
  referredBy?: string;
  isActive?: boolean; // User account status (for admin deactivation)
  // Daily login streak fields
  loginStreak?: number;
  lastLoginStreak?: Timestamp;
  lastClaimDate?: Timestamp;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralHistory: ReferralEntry[];
}

interface ReferralEntry {
  id: string;
  referredUserId: string;
  referredUserEmail: string;
  status: 'pending' | 'completed' | 'expired';
  referredAt: Date;
  completedAt?: Date;
  rewardsPaid: boolean;
  pointsEarned: number;
  hintsEarned: number;
}

interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'image' | 'clue';
  content: string;
  discoveredAt: Date;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  language: string;
}

interface UserStatistics {
  totalCasesStarted: number;
  totalCasesCompleted: number;
  totalTimeSpent: number;
  averageCaseTime: number;
  hintsUsed: number;
  currentStreak: number;
  bestStreak: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  addEvidence: (evidence: Omit<Evidence, 'id' | 'discoveredAt'>) => Promise<void>;
  completeCase: (caseId: string, points: number, timeSpent: number) => Promise<{pointsAwarded: number, isRepeat: boolean}>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetAllUserAchievements: () => Promise<{ success: boolean; updatedUsers: number } | undefined>;
  processReferral: (referralCode: string) => Promise<{ success: boolean; message: string }>;
  updateReferralStats: (userId: string, updates: Partial<ReferralStats>) => Promise<void>;
  generateReferralCode: (uid: string) => string;
  applyReferralCodeToExistingUser: (referralCode: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Firestore
  const loadUserData = async (user: User) => {
    try {
      // logger.info('📥 Loading user data from Firestore for:', user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        // logger.info('📄 User document found', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        const data = userDoc.data() as UserData;
        
        // Check if user is active (deactivated users should be signed out)
        if (data.isActive === false) {
          logger.warn(LogCategory.AUTH, '🚫 User account is deactivated, signing out:', user.uid);
          
          // Show styled toast notification
          toast.error('Your account has been deactivated. Please contact support if you believe this is an error.', {
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #ef4444'
            },
            icon: '🚫',
            duration: 8000
          });
          
          await signOut(auth);
          setCurrentUser(null);
          setUserData(null);
          return; // Don't throw error, just return after signout
        }
        
        // Update last login
        // logger.info('⏰ Updating last login timestamp...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: Timestamp.fromDate(new Date())
        });
        // logger.info('✅ User data loaded and last login updated', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        setUserData({ ...data, lastLogin: Timestamp.fromDate(new Date()) });
      } else {
        // logger.info('❌ No user document found in Firestore for:', user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      }
    } catch (error) {
      // logger.error('❌ Error loading user data:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.error('Error loading user data:', error, LogCategory.AUTH); // Keep for production monitoring // COMMENTED FOR PRODUCTION
    }
  };

  // Generate referral code
  const generateReferralCode = (uid: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const baseCode = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    for (let i = 0; i < 6; i++) {
      if (i < baseCode.length) {
        result += baseCode[i];
      } else {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return result;
  };

  // Utility function to remove undefined values from objects before Firestore operations
  const sanitizeForFirestore = (obj: any): any => {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        if (obj[key] && typeof obj[key] === 'object' && obj[key].constructor === Object) {
          cleaned[key] = sanitizeForFirestore(obj[key]);
        } else {
          cleaned[key] = obj[key];
        }
      }
    });
    return cleaned;
  };

  // Create initial user data in Firestore
  const createUserData = async (user: User, displayName: string, referralCode?: string) => {
    // logger.info('📝 Starting createUserData...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    // logger.info('👤 User UID:', user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    // logger.info('📧 User Email:', user.email, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    // logger.info('🏷️ Display Name:', displayName, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    // logger.info('🎫 Referral Code:', referralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    
    const userReferralCode = generateReferralCode(user.uid);
    // logger.info('🎯 Generated referral code:', userReferralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    
    const initialUserData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      level: 1,
      hints: referralCode ? 3 : 2, // Extra hint if referred by someone
      completedCases: [],
      unlockedCases: ['case-vanishing-blogger'], // First case always unlocked
      totalPoints: referralCode ? 700 : 500, // Bonus points if referred
      achievements: [],
      evidence: [],
      preferences: {
        theme: 'dark',
        notifications: true,
        soundEffects: true,
        language: 'en'
      },
      statistics: {
        totalCasesStarted: 0,
        totalCasesCompleted: 0,
        totalTimeSpent: 0,
        averageCaseTime: 0,
        hintsUsed: 0,
        currentStreak: 0,
        bestStreak: 0
      },
      createdAt: Timestamp.fromDate(new Date()),
      lastLogin: Timestamp.fromDate(new Date()),
      referralCode: userReferralCode,
      referralStats: {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
        referralHistory: []
      },
      ...(referralCode && { referredBy: referralCode })
    };

    try {
      // logger.info('💾 Saving user data to Firestore...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('📄 Document path: users/' + user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('📊 Data to save:', JSON.stringify(initialUserData, null, 2), LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Sanitize data to remove any undefined values
      const sanitizedData = sanitizeForFirestore(initialUserData);
      // logger.info('🧹 Sanitized data:', JSON.stringify(sanitizedData, null, 2), LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      await setDoc(doc(db, 'users', user.uid), sanitizedData);
      // logger.info('✅ User data saved successfully', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      setUserData(initialUserData);
      // logger.info('✅ UserData state updated', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    } catch (error) {
      // logger.error('❌ Error creating user data:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.error('❌ Error code:', (error as any).code, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.error('❌ Error message:', (error as any).message, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.error('Error creating user data:', error, LogCategory.AUTH); // Keep for production monitoring // COMMENTED FOR PRODUCTION
      
      // Check if it's a permissions error
      if ((error as any).code === 'permission-denied') {
        // logger.error('🚫 Firestore permission denied - check security rules', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      }
      
      // Check if it's a network error
      if ((error as any).code === 'unavailable') {
        // logger.error('🌐 Firestore unavailable - check network connection', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      }
      
      throw error; // Re-throw so the parent function knows it failed
    }
  };

  // Process referral code during registration
  const processReferral = async (referralCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      // logger.info('🔍 Processing referral code:', referralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Basic validation
      if (!referralCode || referralCode.length !== 6) {
        return { success: false, message: 'Referral code must be 6 characters long' };
      }

      // Find the user with this referral code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referralCode', '==', referralCode.toUpperCase()));
      
      // logger.info('🔍 Querying database for referral code...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // logger.info('❌ No user found with referral code:', referralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        return { success: false, message: 'Invalid referral code - no user found with this code' };
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data() as UserData;
      
      // logger.info('✅ Found referrer:', referrerData.displayName, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      return { success: true, message: `Valid referral code from ${referrerData.displayName}` };
    } catch (error: any) {
      // logger.error('❌ Error processing referral:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Handle specific Firebase errors
      if (error.code === 'permission-denied') {
        return { 
          success: false, 
          message: 'Database permissions issue - please try again or contact support' 
        };
      }
      
      if (error.code === 'unavailable') {
        return { 
          success: false, 
          message: 'Database temporarily unavailable - please try again' 
        };
      }
      
      return { success: false, message: 'Unable to validate referral code - please try again' };
    }
  };

  // Apply referral code to existing user
  const applyReferralCodeToExistingUser = async (referralCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      // logger.info('🔍 Applying referral code to existing user:', referralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      if (!currentUser || !userData) {
        return { success: false, message: 'User not authenticated' };
      }

      // Check if user already has a referral code applied
      if (userData.referredBy) {
        return { success: false, message: 'You have already used a referral code' };
      }

      // Validate referral code format
      if (!referralCode || referralCode.length !== 6) {
        return { success: false, message: 'Referral code must be 6 characters long' };
      }

      const normalizedCode = referralCode.trim().toUpperCase();

      // Check if user is trying to use their own referral code
      if (userData.referralCode === normalizedCode) {
        return { success: false, message: 'You cannot use your own referral code' };
      }

      // Find the user with this referral code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referralCode', '==', normalizedCode));
      
      // logger.info('🔍 Searching for referrer in database...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // logger.info('❌ No user found with referral code:', normalizedCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        return { success: false, message: 'Invalid referral code - no user found with this code' };
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data() as UserData;
      const referrerId = referrerDoc.id;

      // logger.info('✅ Found referrer:', referrerData.displayName, LogCategory.AUTH); // COMMENTED FOR PRODUCTION

      // Apply referral rewards to current user
      const newUserData = {
        ...userData,
        referredBy: normalizedCode,
        totalPoints: (userData.totalPoints || 0) + 200,
        hints: (userData.hints || 0) + 1
      };

      // Create referral entry for referrer
      const newReferralEntry: ReferralEntry = {
        id: `ref_${Date.now()}`,
        referredUserId: currentUser.uid,
        referredUserEmail: userData.email,
        status: 'completed',
        referredAt: new Date(),
        completedAt: new Date(),
        rewardsPaid: true,
        pointsEarned: 100,
        hintsEarned: 1
      };

      // Update referrer's stats
      const updatedReferrerStats = {
        ...referrerData.referralStats,
        totalReferrals: (referrerData.referralStats.totalReferrals || 0) + 1,
        successfulReferrals: (referrerData.referralStats.successfulReferrals || 0) + 1,
        totalRewards: (referrerData.referralStats.totalRewards || 0) + 100,
        referralHistory: [...(referrerData.referralStats.referralHistory || []), newReferralEntry]
      };

      // Update both users in Firestore
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const referrerRef = doc(db, 'users', referrerId);

      // logger.info('💾 Updating user data in database...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION

      await updateDoc(currentUserRef, {
        referredBy: normalizedCode,
        totalPoints: newUserData.totalPoints,
        hints: newUserData.hints
      });

      await updateDoc(referrerRef, {
        'referralStats': updatedReferrerStats,
        totalPoints: (referrerData.totalPoints || 0) + 100,
        hints: (referrerData.hints || 0) + 1
      });

      // Update local state
      setUserData(newUserData);

      // logger.info('✅ Referral applied successfully!', LogCategory.AUTH); // COMMENTED FOR PRODUCTION

      return { 
        success: true, 
        message: `Referral applied! You received 200 points and 1 hint. ${referrerData.displayName} also received rewards!` 
      };
    } catch (error: any) {
      // logger.error('❌ Error applying referral code:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Handle specific Firebase errors
      if (error.code === 'permission-denied') {
        return { 
          success: false, 
          message: 'Database permissions issue - please try signing out and back in, then try again' 
        };
      }
      
      if (error.code === 'unavailable') {
        return { 
          success: false, 
          message: 'Database temporarily unavailable - please try again in a moment' 
        };
      }
      
      if (error.code === 'not-found') {
        return { 
          success: false, 
          message: 'User data not found - please try refreshing the page' 
        };
      }
      
      return { success: false, message: 'Unable to apply referral code - please try again later' };
    }
  };

  // Update referral stats
  const updateReferralStats = async (userId: string, updates: Partial<ReferralStats>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { referralStats: updates });
    } catch (error) {
      // logger.error('Error updating referral stats:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    }
  };

  // Register new user
  const register = async (email: string, password: string, displayName: string, referralCode?: string) => {
    try {
      // logger.info('🚀 Starting registration process...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('📧 Email:', email, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('👤 Display Name:', displayName, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('🎫 Referral Code:', referralCode, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      let validReferral = false;
      let referrerData: UserData | null = null;

      // Validate referral code if provided
      if (referralCode) {
        // logger.info('🔍 Validating referral code...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        const result = await processReferral(referralCode);
        // logger.info('🎯 Referral validation result:', result, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        if (result.success) {
          validReferral = true;
          // Get referrer data for rewards
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCode.toUpperCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            referrerData = referrerDoc.data() as UserData;
            // Store the document ID for later use
            (referrerData as any)._docId = referrerDoc.id;
          }
        }
      }

      // logger.info('🔐 Creating Firebase user...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // logger.info('✅ Firebase user created:', result.user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // logger.info('📝 Updating user profile...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      await updateProfile(result.user, { displayName });
      // logger.info('✅ Profile updated', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // logger.info('💾 Creating user data in Firestore...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      await createUserData(result.user, displayName, validReferral ? referralCode : undefined);
      // logger.info('✅ User data created in Firestore', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Process referral rewards if valid referral
      if (validReferral && referrerData) {
        try {
          // logger.info('🎯 Processing referral rewards for referrer...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
          
          // Update referrer's stats and give rewards
          const newReferralEntry: ReferralEntry = {
            id: `ref_${Date.now()}`,
            referredUserId: result.user.uid,
            referredUserEmail: email,
            status: 'completed',
            referredAt: new Date(),
            completedAt: new Date(),
            rewardsPaid: true,
            pointsEarned: 100,
            hintsEarned: 1
          };

          const updatedReferralStats: ReferralStats = {
            ...referrerData.referralStats,
            successfulReferrals: (referrerData.referralStats?.successfulReferrals || 0) + 1,
            totalReferrals: (referrerData.referralStats?.totalReferrals || 0) + 1,
            totalRewards: (referrerData.referralStats?.totalRewards || 0) + 100,
            referralHistory: [...(referrerData.referralStats?.referralHistory || []), newReferralEntry]
          };

          // Use the document ID we stored earlier
          const referrerDocId = (referrerData as any)._docId;
          // logger.info('💾 Updating referrer document:', referrerDocId, LogCategory.AUTH); // COMMENTED FOR PRODUCTION

          // Update referrer's data
          await updateDoc(doc(db, 'users', referrerDocId), {
            'referralStats': updatedReferralStats,
            'totalPoints': (referrerData.totalPoints || 0) + 100,
            'hints': (referrerData.hints || 0) + 1
          });
          
          // logger.info('✅ Referrer rewards updated successfully!', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        } catch (error) {
          // logger.error('Error processing referral rewards:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        }
      }
      
      // Track registration event
      if (analytics) {
        logEvent(analytics, 'sign_up', {
          method: 'email',
          referred: validReferral
        });
      }
    } catch (error) {
      // logger.error('Registration error:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      // logger.info('🔐 Starting login process...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      // logger.info('📧 Email:', email, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // logger.info('🔍 Attempting Firebase authentication...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      await signInWithEmailAndPassword(auth, email, password);
      // logger.info('✅ Firebase login successful', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Track login event
      if (analytics) {
        logEvent(analytics, 'login', {
          method: 'email'
        });
      }
      // logger.info('✅ Login process completed successfully', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    } catch (error) {
      // logger.error('❌ Login error:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user data for Google sign-in
        const displayName = user.displayName || user.email?.split('@')[0] || 'Google User';
        await createUserData(user, displayName);
      }
      
      // Track login event
      if (analytics) {
        logEvent(analytics, 'login', {
          method: 'google'
        });
      }
    } catch (error) {
      // Handle specific Google auth errors
      if ((error as any).code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled');
      } else if ((error as any).code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please enable popups and try again.');
      }
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      // logger.error('Logout error:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Update user data
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!currentUser || !userData) return;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData({ ...userData, ...updates });
    } catch (error) {
      // logger.error('Error updating user data:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Refresh user data from Firebase
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        
        // Migration: Convert old 'case-tutorial' to new 'case-vanishing-blogger'
        let migratedData = { ...data };
        if (data.completedCases?.includes('case-tutorial') && !data.completedCases.includes('case-vanishing-blogger')) {
          // logger.info('🔄 Migrating case-tutorial to case-vanishing-blogger', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
          migratedData.completedCases = data.completedCases
            .filter(id => id !== 'case-tutorial')  // Remove old ID
            .concat(['case-vanishing-blogger']);   // Add new ID
          
          // Update Firebase with migrated data
          await updateDoc(doc(db, 'users', currentUser.uid), {
            completedCases: migratedData.completedCases
          });
        }
        
        setUserData(migratedData);
      }
    } catch (error) {
      // logger.error('Error refreshing user data:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    }
  };

  // Add evidence to user's collection
  const addEvidence = async (evidence: Omit<Evidence, 'id' | 'discoveredAt'>) => {
    if (!currentUser || !userData) return;

    const newEvidence: Evidence = {
      ...evidence,
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discoveredAt: new Date()
    };

    try {
      const updatedEvidence = [...(userData.evidence || []), newEvidence];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        evidence: updatedEvidence
      });
      setUserData({ ...userData, evidence: updatedEvidence });
    } catch (error) {
      // logger.error('Error adding evidence:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Complete a case with statistics tracking and evidence collection
  const completeCase = async (caseId: string, points: number, timeSpent: number): Promise<{pointsAwarded: number, isRepeat: boolean}> => {
    if (!currentUser || !userData) {
      return { pointsAwarded: 0, isRepeat: false };
    }

    try {
      // Check if this case has already been completed
      const alreadyCompleted = userData.completedCases.includes(caseId);
      
      // Prevent point farming: only award points on first completion of ANY case
      const shouldAwardPoints = !alreadyCompleted;
      
      // Only add to completed cases if not already completed
      const newCompletedCases = alreadyCompleted 
        ? userData.completedCases 
        : [...userData.completedCases, caseId];
      
      // Only award points if it's the first completion
      const pointsToAward = shouldAwardPoints ? points : 0;
      const newTotalPoints = userData.totalPoints + pointsToAward;
      const newLevel = Math.floor(newTotalPoints / 1000) + 1;
      
      // Update statistics - only count as "completed" if it's first time
      const shouldUpdateStats = !alreadyCompleted;
      const updatedStatistics: UserStatistics = shouldUpdateStats ? {
        ...userData.statistics,
        totalCasesCompleted: userData.statistics.totalCasesCompleted + 1,
        totalTimeSpent: userData.statistics.totalTimeSpent + timeSpent,
        averageCaseTime: (userData.statistics.totalTimeSpent + timeSpent) / (userData.statistics.totalCasesCompleted + 1),
        currentStreak: userData.statistics.currentStreak + 1,
        bestStreak: Math.max(userData.statistics.bestStreak, userData.statistics.currentStreak + 1)
      } : {
        ...userData.statistics,
        totalTimeSpent: userData.statistics.totalTimeSpent + timeSpent,
        // Update average case time even for repeat plays, but don't count towards completion stats
        averageCaseTime: userData.statistics.totalCasesCompleted > 0 
          ? (userData.statistics.totalTimeSpent + timeSpent) / userData.statistics.totalCasesCompleted
          : timeSpent
      };

      // Auto-generate evidence for completed case
      const caseEvidenceTemplates: Record<string, Omit<Evidence, 'id' | 'discoveredAt'>[]> = {
        'case-tutorial': [
          {
            caseId,
            title: 'Detective Academy Certificate',
            description: 'Proof of completion of the Detective Academy training program',
            type: 'document',
            content: 'This certifies that you have successfully completed the basic training in HTML and CSS investigation techniques',
            importance: 'high'
          },
          {
            caseId,
            title: 'HTML Structure Analysis',
            description: 'Notes on proper HTML structure and heading hierarchy',
            type: 'code',
            content: 'Learned how to fix improper heading tags (h2 to h1) to reveal hidden content',
            importance: 'medium'
          },
          {
            caseId,
            title: 'CSS Display Property Investigation',
            description: 'Documentation on using CSS to reveal hidden elements',
            type: 'code',
            content: 'Changing display:none to display:block revealed critical evidence',
            importance: 'high'
          }
        ],
        'case-vanishing-blogger': [
          {
            caseId,
            title: 'Corrupted Blog HTML',
            description: 'Found broken HTML tags that were hiding Sam\'s last message',
            type: 'code',
            content: '<h2> tags were preventing proper display of the blog content',
            importance: 'high'
          },
          {
            caseId,
            title: 'Hidden CSS Clue',
            description: 'Discovered a secret message hidden in the CSS code',
            type: 'clue',
            content: 'Sam left breadcrumbs about checking backup files on old server',
            importance: 'critical'
          }
        ],
        'visual-vanishing-blogger': [
          {
            caseId,
            title: 'Rishi\'s Encrypted Notes',
            description: 'Found encrypted documents about suspicious Sherpa companies',
            type: 'document',
            content: 'Rishi\'s research revealed multiple fake Sherpa certification schemes targeting climbers',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Hidden CSS Evidence',
            description: 'Discovered hidden HTML elements revealing the truth',
            type: 'code',
            content: 'CSS visibility properties were concealing crucial evidence about Rishi\'s whereabouts',
            importance: 'high'
          },
          {
            caseId,
            title: 'Phone Message Clue',  
            description: 'Decoded the final message from Rishi\'s device',
            type: 'clue',
            content: 'Rishi wasn\'t kidnapped - he went into hiding after exposing the corruption',
            importance: 'critical'
          }
        ],
        'case-social-media-stalker': [
          {
            caseId,
            title: 'Malicious Script Code',
            description: 'Found hidden JavaScript code used for tracking users',
            type: 'code',
            content: 'Tracking script embedded in profile pages',
            importance: 'critical'
          },
          {
            caseId,
            title: 'User Data Logs',
            description: 'Discovered logs of unauthorized data collection',
            type: 'document',
            content: 'Log files show systematic harvesting of personal information',
            importance: 'high'
          }
        ],
        'case-corporate-sabotage': [
          {
            caseId,
            title: 'Sabotaged Website Code',
            description: 'Identified malicious code injected into company website',
            type: 'code',
            content: 'Hidden CSS rules causing layout failures during presentation',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Internal Email Trail',
            description: 'Corporate communications revealing the sabotage plot',
            type: 'document',
            content: 'Email evidence shows coordinated effort to undermine the company presentation',
            importance: 'high'
          }
        ],
        'case-dating-app-disaster': [
          {
            caseId,
            title: 'Profile Manipulation Code',
            description: 'Code used to alter user profiles and create fake matches',
            type: 'code',
            content: 'JavaScript functions for profile data manipulation',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Fake Profile Database',
            description: 'Database of artificially created dating profiles',
            type: 'document',
            content: 'Systematic creation of fake profiles to manipulate user engagement',
            importance: 'high'
          }
        ],
        'case-ecommerce-fraud': [
          {
            caseId,
            title: 'Price Manipulation Script',
            description: 'Hidden code altering product prices at checkout',
            type: 'code',
            content: 'JavaScript code modifying DOM elements during payment process',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Financial Transaction Logs',
            description: 'Evidence of fraudulent pricing modifications',
            type: 'document',
            content: 'Log files showing systematic price manipulation affecting customer payments',
            importance: 'critical'
          }
        ],
        'case-gaming-platform-hack': [
          {
            caseId,
            title: 'Exploit Code',
            description: 'Code used to exploit gaming platform vulnerabilities',
            type: 'code',
            content: 'CSS and JavaScript exploits for unauthorized access',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Hack Methodology Document',
            description: 'Step-by-step guide used by hackers to breach the platform',
            type: 'document',
            content: 'Detailed instructions for exploiting CSS injection vulnerabilities in gaming platforms',
            importance: 'high'
          }
        ]
      };

      // Add evidence for this case - only on first completion to avoid duplicates
      const shouldAddEvidence = !alreadyCompleted;
      const caseEvidence = (shouldAddEvidence && caseEvidenceTemplates[caseId]) ? caseEvidenceTemplates[caseId] : [];
      const newEvidence: Evidence[] = caseEvidence.map((template, index) => ({
        ...template,
        id: `evidence-${caseId}-${index}-${Date.now()}`,
        discoveredAt: new Date()
      }));

      const updatedEvidence = [...(userData.evidence || []), ...newEvidence];

      const updates = {
        completedCases: newCompletedCases,
        totalPoints: newTotalPoints,
        level: newLevel,
        statistics: updatedStatistics,
        evidence: updatedEvidence
      };

      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData({ ...userData, ...updates });
      
      // Debug logging for tutorial case completion - COMMENTED FOR PRODUCTION
      if (caseId === 'visual-vanishing-blogger') {
        // logger.info('🎯 Tutorial case completion FINAL debug:', {
        //   caseId,
        //   alreadyCompleted,
        //   shouldAwardPoints,
        //   pointsToAward,
        //   newCompletedCases,
        //   previousCompletedCases: userData.completedCases,
        //   updatedUserData: { ...userData, ...updates },
        //   firestoreUpdateData: updates,
        //   finalCompletedCases: newCompletedCases
        // }, LogCategory.AUTH);
        
        // Additional verification - check if the case ID is actually in the array
        // logger.info('🔍 Array verification:', {
        //   arrayLength: newCompletedCases.length,
        //   includes: newCompletedCases.includes('visual-vanishing-blogger'),
        //   indexOf: newCompletedCases.indexOf('visual-vanishing-blogger'),
        //   arrayContents: newCompletedCases.map((id, idx) => ({ idx, id, type: typeof id, length: id?.length }))
        // }, LogCategory.AUTH);
      }
      
      // Track case completion event
      if (analytics) {
        logEvent(analytics, 'case_completed', {
          caseId,
          points: pointsToAward, // Log actual points awarded, not requested points
          originalPoints: points, // Log original points for reference
          timeSpent,
          level: newLevel,
          isRepeat: alreadyCompleted,
          isTutorial: caseId === 'visual-vanishing-blogger' || caseId === 'case-tutorial'
        });
      }

      // Return information about the completion
      return {
        pointsAwarded: pointsToAward,
        isRepeat: alreadyCompleted
      };
    } catch (error) {
      // logger.error('Error completing case:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId: string) => {
    if (!currentUser || !userData) return;

    if (userData.achievements.includes(achievementId)) return;

    try {
      const newAchievements = [...userData.achievements, achievementId];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        achievements: newAchievements
      });
      setUserData({ ...userData, achievements: newAchievements });
    } catch (error) {
      // logger.error('Error unlocking achievement:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!currentUser || !userData) return;

    try {
      const updatedPreferences = { ...userData.preferences, ...preferences };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        preferences: updatedPreferences
      });
      setUserData({ ...userData, preferences: updatedPreferences });
    } catch (error) {
      // logger.error('Error updating preferences:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    // logger.info('🔧 Setting up auth state listener...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // logger.info('🔔 Auth state changed:', user ? `User ${user.uid}` : 'No user', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      setCurrentUser(user);
      if (user) {
        // logger.info('👤 Loading user data for:', user.uid, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        await loadUserData(user);
      } else {
        // logger.info('🚪 User logged out, clearing data', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        setUserData(null);
      }
      setLoading(false);
      // logger.info('✅ Auth state update complete', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
    });

    return unsubscribe;
  }, []);

  // Reset achievements for all users (Admin function)
  const resetAllUserAchievements = async () => {
    try {
      // Import additional Firestore functions for batch operations
      const { collection, getDocs, writeBatch } = await import('firebase/firestore');
      
      // logger.info('Starting achievement reset for all users...', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // Get all user documents
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      if (usersSnapshot.empty) {
        // logger.info('No users found to reset achievements for', LogCategory.AUTH); // COMMENTED FOR PRODUCTION
        return;
      }

      // Create a batch to update all users at once
      const batch = writeBatch(db);
      let updateCount = 0;

      // Add each user update to the batch
      usersSnapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, {
          achievements: []
        });
        updateCount++;
      });

      // Execute the batch
      await batch.commit();
      
      // logger.info(`Successfully reset achievements for ${updateCount} users`, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      
      // If the current user is logged in, update their local state too
      if (currentUser && userData) {
        setUserData({ ...userData, achievements: [] });
      }
      
      return { success: true, updatedUsers: updateCount };
      
    } catch (error) {
      // logger.error('Error resetting achievements for all users:', error, LogCategory.AUTH); // COMMENTED FOR PRODUCTION
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUserData,
    refreshUserData,
    addEvidence,
    completeCase,
    unlockAchievement,
    updatePreferences,
    resetAllUserAchievements,
    processReferral,
    updateReferralStats,
    generateReferralCode,
    applyReferralCodeToExistingUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
