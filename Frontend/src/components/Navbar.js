import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Brain, LogOut, Globe } from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const changeLanguage = (lang) => {
    // This would be implemented with i18next
    console.log('Change language to:', lang);
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">
                LIVRAISON RAPIDE
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => changeLanguage('en')}
                className="text-sm text-gray-300 hover:text-white px-2 py-1 rounded"
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className="text-sm text-gray-300 hover:text-white px-2 py-1 rounded"
              >
                FR
              </button>
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-dark-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
