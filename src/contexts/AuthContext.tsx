import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'user' | 'admin' | 'superadmin';

interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  stationId?: string;
  stationName?: string;
  [key: string]: any; // For any additional properties
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, additionalData?: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(docRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserData, 'uid'>;
            setUserData({ uid: user.uid, ...userData });
          } else {
            console.error('No user data found in Firestore');
            setUserData(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoading && userData) {
      const path = window.location.pathname;
      
      if (path === '/' || path.startsWith('/auth')) {
        if (userData.role === 'user') {
          navigate('/u/dashboard');
        } else if (userData.role === 'admin') {
          navigate('/a/dashboard');
        } else if (userData.role === 'superadmin') {
          navigate('/sa/dashboard');
        }
      }
      
      if (userData.role === 'user' && (path.startsWith('/a/') || path.startsWith('/sa/'))) {
        navigate('/u/dashboard');
        toast.error('You do not have permission to access that page');
      } else if (userData.role === 'admin' && path.startsWith('/sa/')) {
        navigate('/a/dashboard');
        toast.error('You do not have permission to access that page');
      }
    }
  }, [isLoading, userData, navigate]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to login');
      }
      throw error;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    role: UserRole, 
    additionalData: Record<string, any> = {}
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      const userData = {
        email: user.email,
        role,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      toast.success('Account created successfully');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    isLoading,
    login,
    signup,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
