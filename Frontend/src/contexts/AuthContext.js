import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
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
      
      // For now, create a mock user for testing
      const mockUser = {
        uid: 'test-user-123',
        email: email,
        displayName: 'Test User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      
      setUser(mockUser);
      toast.success('Connexion réussie (Mode Test)');
      return mockUser;
      
      // Uncomment when Firebase is properly configured:
      /*
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Get user profile from backend
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
      setUser(response.data);
      toast.success('Connexion réussie');
      return response.data;
      */
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Erreur de connexion';
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
      
      // For now, create a mock user for testing
      const mockUser = {
        uid: 'test-user-' + Date.now(),
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role || 'client',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null
      };
      
      setUser(mockUser);
      toast.success('Compte créé avec succès (Mode Test)');
      return mockUser;
      
      // Uncomment when backend is running:
      /*
      const response = await axios.post('/api/auth/register', userData);
      toast.success('Compte créé avec succès');
      return response.data;
      */
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de la création du compte';
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
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.put('/api/auth/me', userData, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
      setUser(response.data);
      toast.success('Profil mis à jour avec succès');
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
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
