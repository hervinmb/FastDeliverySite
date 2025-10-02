import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData.displayName,
          role: 'user', // Default role for all users
          isActive: userData.isActive !== false,
          createdAt: userData.createdAt,
          lastLoginAt: new Date()
        };
        
        // Update last login time
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLoginAt: new Date()
        });
        
        setUser(userProfile);
        toast.success('Connexion réussie');
        return userProfile;
      } else {
        // Create user profile if it doesn't exist
        const newUserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Utilisateur',
          role: 'user', // Default role for all users
          isActive: true,
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);
        setUser(newUserProfile);
        toast.success('Connexion réussie');
        return newUserProfile;
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Erreur de connexion';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Réessayez plus tard';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase profile with display name
      if (userData.displayName) {
        await updateFirebaseProfile(firebaseUser, {
          displayName: userData.displayName
        });
      }
      
      // Create user profile in Firestore
      const userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.displayName || 'Utilisateur',
        role: 'user', // Default role for all users - no admin needed
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null
      };
      
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
        setUser(userProfile);
        toast.success('Compte créé avec succès');
        return userProfile;
      } catch (firestoreError) {
        console.error('Error creating user profile in Firestore:', firestoreError);
        // Even if Firestore fails, the Firebase Auth user was created successfully
        setUser(userProfile);
        toast.success('Compte créé avec succès (profil temporaire)');
        return userProfile;
      }
    } catch (error) {
      console.error('Register error:', error);
      let errorMessage = 'Erreur lors de la création du compte';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Un compte existe déjà avec cet email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Update Firebase profile
      if (userData.displayName) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: userData.displayName
        });
      }
      
      // Update Firestore profile
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName: userData.displayName,
        role: userData.role,
        updatedAt: new Date()
      });
      
      // Update local state
      const updatedUser = {
        ...user,
        displayName: userData.displayName,
        role: userData.role
      };
      setUser(updatedUser);
      
      toast.success('Profil mis à jour avec succès');
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              role: 'user', // Default role for all users
              isActive: userData.isActive !== false,
              createdAt: userData.createdAt,
              lastLoginAt: userData.lastLoginAt
            };
            setUser(userProfile);
          } else {
            // Create user profile if it doesn't exist
            const newUserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Utilisateur',
              role: 'user', // Default role for all users
              isActive: true,
              createdAt: new Date(),
              lastLoginAt: null
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);
            setUser(newUserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If it's a permissions error, try to create the user profile
          if (error.code === 'permission-denied') {
            try {
              const newUserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Utilisateur',
                role: 'user', // Default role for all users
                isActive: true,
                createdAt: new Date(),
                lastLoginAt: null
              };
              
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);
              setUser(newUserProfile);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
