import { User } from '@/models/User';
import { LoginCredentials, SignupCredentials } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export class AuthService {
  // Sign up a new user
  static async signup(credentials: SignupCredentials): Promise<User> {
    try {
      return await User.create(
        credentials.email,
        credentials.password,
        credentials.displayName
      );
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in a user
  static async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    try {
      return await User.signIn(credentials.email, credentials.password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Sign out a user
  static async logout(): Promise<void> {
    try {
      await User.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Get the current authenticated user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Subscribe to auth state changes
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<User | null> {
    try {
      return await User.getById(userId);
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }
}