import { UserModel } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export class User implements UserModel {
  id: string;
  email: string;
  displayName?: string;
  devices: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<UserModel>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.displayName = data.displayName;
    this.devices = data.devices || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new user in Firebase Auth and Firestore
  static async create(email: string, password: string, displayName?: string): Promise<User> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with display name if provided
      if (displayName) {
        await firebaseUpdateProfile(firebaseUser, { displayName });
      }
      
      // Create user document in Firestore
      const userData: Partial<UserModel> = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: displayName || firebaseUser.displayName || '',
        devices: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return new User(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID from Firestore
  static async getById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserModel;
        return new User(userData);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Get user by email from Firestore
  static async getByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as UserModel;
        return new User(userData);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Update user in Firestore
  async update(data: Partial<UserModel>): Promise<User> {
    try {
      const userRef = doc(db, 'users', this.id);
      
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update local object
      Object.assign(this, data);
      this.updatedAt = new Date();
      
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Add device to user
  async addDevice(deviceId: string): Promise<User> {
    if (!this.devices.includes(deviceId)) {
      this.devices.push(deviceId);
      await this.update({ devices: this.devices });
    }
    return this;
  }

  // Remove device from user
  async removeDevice(deviceId: string): Promise<User> {
    this.devices = this.devices.filter(id => id !== deviceId);
    await this.update({ devices: this.devices });
    return this;
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out user
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}