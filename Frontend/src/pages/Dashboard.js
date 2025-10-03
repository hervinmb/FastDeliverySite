import React from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { 
  Truck, 
  Users, 
  UserCheck, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  // const { t } = useTranslation();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery('dashboard-stats', async () => {
    const [deliveriesRes, clientsRes, deliverersRes] = await Promise.all([
      axios.get('/api/deliveries?limit=1000'),
      axios.get('/api/clients?limit=1000'),
      axios.get('/api/deliverers?limit=1000')
    ]);

    const deliveries = deliveriesRes.data.deliveries || [];
    const clients = clientsRes.data.clients || [];
    const deliverers = deliverersRes.data.deliverers || [];

    // Calculate statistics
    const totalDeliveries = deliveries.length;
    const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
    const inTransitDeliveries = deliveries.filter(d => d.status === 'in-transit').length;
    const deliveredToday = deliveries.filter(d => d.status === 'delivered').length;
    
    const totalRevenue = deliveries.reduce((sum, d) => sum + (d.totalGoodsPrice || 0) + (d.deliveryFees || 0), 0);
    const totalClients = clients.length;
    const activeDeliverers = deliverers.filter(d => d.status === 'available').length;

    return {
      totalDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      deliveredToday,
      totalRevenue,
      totalClients,
      activeDeliverers
    };
  });

  const statCards = [
    {
      title: 'Total Livraisons',
      value: stats?.totalDeliveries || 0,
      icon: Truck,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Clients Actifs',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-700',
      iconBg: 'bg-gradient-to-br from-green-100 to-green-200',
      iconColor: 'text-green-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Livreurs Disponibles',
      value: stats?.activeDeliverers || 0,
      icon: UserCheck,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
      iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200',
      iconColor: 'text-purple-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Revenus Totaux',
      value: `GNF ${(stats?.totalRevenue || 0).toLocaleString()}`,
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
      value: stats?.pendingDeliveries || 0,
      icon: Clock,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      iconBg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'En Transit',
      value: stats?.inTransitDeliveries || 0,
      icon: Truck,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Livrées Aujourd\'hui',
      value: stats?.deliveredToday || 0,
      icon: CheckCircle,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      iconBg: 'bg-gradient-to-br from-green-100 to-green-200',
      iconColor: 'text-green-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group">
              <div className="text-center">
                <Truck className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary-600">
                  Nouvelle Livraison
                </p>
              </div>
            </button>
            
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary-600">
                  Nouveau Client
                </p>
              </div>
            </button>
            
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group">
              <div className="text-center">
                <UserCheck className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-primary-600">
                  Nouveau Livreur
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Activité Récente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Livraison #1234 livrée avec succès
                </p>
                <p className="text-sm text-gray-500">
                  Client: Jean Dupont • Il y a 2 heures
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Truck className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Livraison #1235 en transit
                </p>
                <p className="text-sm text-gray-500">
                  Client: Marie Martin • Il y a 4 heures
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Nouvelle livraison assignée
                </p>
                <p className="text-sm text-gray-500">
                  Client: Pierre Durand • Il y a 6 heures
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
