import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Truck, 
  Users, 
  UserCheck, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Zap
} from 'lucide-react';

// Custom Logo Component - Professional LIVRAISON RAPIDE Logo
const LivraisonRapideLogo = ({ className = "h-8 w-8" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Delivery Scooter - Professional Design */}
      {/* Scooter Frame */}
      <rect x="15" y="65" width="30" height="6" rx="3" fill="currentColor" />
      {/* Scooter Handlebar */}
      <rect x="12" y="50" width="4" height="15" rx="2" fill="currentColor" />
      {/* Scooter Seat */}
      <rect x="20" y="60" width="18" height="6" rx="3" fill="currentColor" />
      
      {/* Delivery Box */}
      <rect x="40" y="45" width="15" height="20" rx="2" fill="currentColor" />
      {/* Box Details */}
      <rect x="42" y="47" width="11" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="42" y="50" width="11" height="1" rx="0.5" fill="white" opacity="0.3" />
      <rect x="42" y="52" width="11" height="1" rx="0.5" fill="white" opacity="0.2" />
      
      {/* Delivery Person */}
      <circle cx="30" cy="50" r="5" fill="currentColor" />
      <rect x="27" y="55" width="6" height="10" rx="3" fill="currentColor" />
      {/* Cap */}
      <rect x="27" y="44" width="6" height="4" rx="2" fill="currentColor" />
      
      {/* Speed Lines - Motion Effect */}
      <line x1="58" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="3" opacity="0.7" />
      <line x1="60" y1="75" x2="68" y2="75" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="62" y1="80" x2="66" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Additional Speed Lines */}
      <line x1="58" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="60" y1="55" x2="68" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  </div>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    setIsLanguageOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { path: '/dashboard', label: t('nav.home'), icon: Home },
    { path: '/deliveries', label: t('nav.deliveries'), icon: Truck },
    { path: '/clients', label: t('nav.clients'), icon: Users },
    { path: '/deliverers', label: t('nav.deliverers'), icon: UserCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-4 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <LivraisonRapideLogo className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    LIVRAISON
                  </span>
                  <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    RAPIDE
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium mt-1">
                  Système de Gestion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-lg'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-all duration-300 group"
              >
                <Globe className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="uppercase text-sm font-semibold">
                  {i18n.language}
                </span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600 z-50 overflow-hidden">
                  <button
                    onClick={toggleLanguage}
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {i18n.language === 'fr' ? 'English' : 'Français'}
                  </button>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl px-4 py-2 shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-white font-semibold">{user?.displayName}</p>
                  <p className="text-gray-300 text-xs capitalize font-medium">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 transition-all duration-300 group shadow-lg hover:shadow-red-500/25"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{t('nav.logout')}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-600 shadow-2xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-500 transition-all duration-300 w-full"
              >
                <Globe className="h-6 w-6" />
                <span className="font-medium">Switch to {i18n.language === 'fr' ? 'English' : 'Français'}</span>
              </button>
              
              {/* Mobile User Info & Logout */}
              <div className="border-t border-gray-600 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user?.displayName}</p>
                    <p className="text-gray-300 text-sm capitalize font-medium">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 transition-all duration-300 w-full"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="font-medium">{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
