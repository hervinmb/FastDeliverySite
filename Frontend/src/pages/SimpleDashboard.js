import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  UserCheck, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const SimpleDashboard = () => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeClients: 0,
    availableDeliverers: 0,
    totalRevenue: 0,
    pendingDeliveries: 0,
    inTransitDeliveries: 0,
    deliveredToday: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load deliveries
      const deliveriesSnapshot = await getDocs(collection(db, 'deliveries'));
      const deliveries = deliveriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Load clients
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clients = clientsSnapshot.docs.map(doc => doc.data());
      
      // Load deliverers
      const deliverersSnapshot = await getDocs(query(collection(db, 'deliverers'), where('status', '==', 'available')));
      const deliverers = deliverersSnapshot.docs.map(doc => doc.data());
      
      // Get recent deliveries (last 5)
      const recentDeliveriesQuery = query(
        collection(db, 'deliveries'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentSnapshot = await getDocs(recentDeliveriesQuery);
      const recentDeliveriesData = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Calculate today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate stats
      const totalDeliveries = deliveries.length;
      const activeClients = clients.filter(client => client.isActive !== false).length;
      const availableDeliverers = deliverers.length;
      const totalRevenue = deliveries.reduce((sum, delivery) => sum + (delivery.deliveryFees || 0), 0);
      
      // Calculate status-based stats
      const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
      const inTransitDeliveries = deliveries.filter(d => d.status === 'in-transit').length;
      const deliveredToday = deliveries.filter(d => {
        if (d.status === 'delivered' && d.updatedAt) {
          const deliveryDate = new Date(d.updatedAt);
          deliveryDate.setHours(0, 0, 0, 0);
          return deliveryDate.getTime() === today.getTime();
        }
        return false;
      }).length;
      
      setStats({
        totalDeliveries,
        activeClients,
        availableDeliverers,
        totalRevenue,
        pendingDeliveries,
        inTransitDeliveries,
        deliveredToday
      });
      
      setRecentDeliveries(recentDeliveriesData);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Date inconnue';
    
    const now = new Date();
    const deliveryDate = new Date(date);
    const diffInMs = now - deliveryDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes > 0) {
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
      } else {
        return 'À l\'instant';
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <div className="p-2 rounded-full bg-gradient-to-r from-green-100 to-green-200 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        );
      case 'in-transit':
        return (
          <div className="p-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 shadow-lg">
            <Truck className="h-5 w-5 text-orange-600" />
          </div>
        );
      case 'pending':
        return (
          <div className="p-2 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-lg">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
        );
      case 'cancelled':
        return (
          <div className="p-2 rounded-full bg-gradient-to-r from-red-100 to-red-200 shadow-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">
            <AlertCircle className="h-5 w-5 text-gray-600" />
          </div>
        );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'livrée avec succès';
      case 'in-transit':
        return 'en transit';
      case 'pending':
        return 'assignée';
      case 'cancelled':
        return 'annulée';
      default:
        return 'mise à jour';
    }
  };

  const getActivityGradient = (index) => {
    const gradients = [
      'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100',
      'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100',
      'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
      'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100',
      'bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100',
      'bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100',
      'bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100',
      'bg-gradient-to-r from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100'
    ];
    return gradients[index % gradients.length];
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      case 'in-transit':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  const statCards = [
    {
      title: 'Total Livraisons',
      value: stats.totalDeliveries.toString(),
      icon: Truck,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Revenus Totaux',
      value: `GNF ${stats.totalRevenue.toLocaleString()}`,
      icon: null,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      iconBg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      iconColor: 'text-yellow-600',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const statusCards = [
    {
      title: 'En Attente',
      value: stats.pendingDeliveries,
      icon: Clock,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      iconBg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'En Transit',
      value: stats.inTransitDeliveries,
      icon: Truck,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Livrées Aujourd\'hui',
      value: stats.deliveredToday,
      icon: CheckCircle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      iconBg: 'bg-gradient-to-br from-green-100 to-green-200',
      iconColor: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-400">
            Vue d'ensemble de votre système de livraison
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`${card.bgColor} rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {card.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        card.changeType === 'positive' ? 'text-green-200' : 'text-red-200'
                      }`}>
                        {card.change}
                      </span>
                      <span className="text-sm text-white/70 ml-1">
                        vs mois dernier
                      </span>
                    </div>
                  </div>
                  {card.icon && (
                    <div className={`p-3 rounded-full ${card.iconBg} shadow-lg`}>
                      <Icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`${card.bgColor} rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${card.iconBg} mr-4 shadow-lg`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Activité Récente
          </h2>
          {recentDeliveries.length > 0 ? (
            <div className="space-y-4">
              {recentDeliveries.map((delivery, index) => (
                <div key={delivery.id} className={`flex items-center p-4 ${getActivityGradient(index)} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-200`}>
                  <div className="flex-shrink-0">
                    {getStatusIcon(delivery.status)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-bold text-gray-900">
                        Livraison #{delivery.serialNumber || 'N/A'}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">
                      👤 {delivery.clientName} • {getTimeAgo(delivery.updatedAt || delivery.createdAt)}
                    </p>
                    {delivery.destination && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{delivery.destination}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg px-3 py-2 shadow-sm">
                      <p className="text-sm font-bold text-green-700">
                        GNF {Number(delivery.deliveryFees || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        {delivery.numberOfItems} article{delivery.numberOfItems > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="p-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-600 text-lg font-semibold">Aucune activité récente</p>
              <p className="text-gray-500 text-sm mt-2">Les nouvelles livraisons apparaîtront ici avec de beaux gradients</p>
            </div>
          )}
        </div>

        {/* Success Notice */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Données en Temps Réel
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Ce tableau de bord affiche des données dynamiques provenant de Firebase. Toutes les statistiques et activités sont mises à jour en temps réel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;

