import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import DeliveryForm from './DeliveryForm';
import DeleteConfirmModal from './DeleteConfirmModal';

const DeliveriesTable = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, delivery: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch deliveries
  const { data: deliveriesData, isLoading, error } = useQuery(
    ['deliveries', currentPage, statusFilter, searchTerm],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await axios.get(`/api/deliveries?${params}`);
      return response.data;
    }
  );

  // Fetch clients and deliverers for form
  const { data: clientsData } = useQuery('clients', () => 
    axios.get('/api/clients?limit=100').then(res => res.data.clients)
  );
  
  const { data: deliverersData } = useQuery('deliverers', () => 
    axios.get('/api/deliverers?limit=100').then(res => res.data.deliverers)
  );

  // Delete delivery mutation
  const deleteDeliveryMutation = useMutation(
    (id) => axios.delete(`/api/deliveries/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('deliveries');
        toast.success(t('messages.deliveryDeleted'));
        setDeleteModal({ isOpen: false, delivery: null });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  // Update delivery status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }) => axios.put(`/api/deliveries/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('deliveries');
        toast.success(t('messages.deliveryUpdated'));
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    setIsFormOpen(true);
  };

  const handleDelete = (delivery) => {
    setDeleteModal({ isOpen: true, delivery });
  };

  const confirmDelete = () => {
    if (deleteModal.delivery) {
      deleteDeliveryMutation.mutate(deleteModal.delivery.id);
    }
  };

  // const handleStatusChange = (delivery, newStatus) => {
  //   updateStatusMutation.mutate({ id: delivery.id, status: newStatus });
  // };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'assigned':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{t('messages.error')}</p>
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
            {t('nav.deliveries')}
          </h1>
          <p className="text-gray-400">
            Gérez vos livraisons et suivez leur statut en temps réel
          </p>
        </div>

        {/* Controls */}
        <div className="bg-dark-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('placeholders.searchDeliveries')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="assigned">Assigné</option>
                <option value="in-transit">En transit</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditingDelivery(null);
                setIsFormOpen(true);
              }}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>{t('buttons.addNew')}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.clients')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.numberOfDeliveries')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.totalGoodsPrice')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.destination')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.deliverers')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.deliveryFees')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tableHeaders.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveriesData?.deliveries?.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      {t('messages.noData')}
                    </td>
                  </tr>
                ) : (
                  deliveriesData?.deliveries?.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {delivery.numberOfItems || 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ${delivery.totalGoodsPrice?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {delivery.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {delivery.delivererName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ${delivery.deliveryFees?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1">{t(`status.${delivery.status}`)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(delivery)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(delivery)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {deliveriesData?.pagination && deliveriesData.pagination.pages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(deliveriesData.pagination.pages, currentPage + 1))}
                  disabled={currentPage === deliveriesData.pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{' '}
                    <span className="font-medium">
                      {((currentPage - 1) * deliveriesData.pagination.limit) + 1}
                    </span>{' '}
                    à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * deliveriesData.pagination.limit, deliveriesData.pagination.total)}
                    </span>{' '}
                    sur{' '}
                    <span className="font-medium">{deliveriesData.pagination.total}</span>{' '}
                    résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(deliveriesData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === deliveriesData.pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {isFormOpen && (
          <DeliveryForm
            delivery={editingDelivery}
            clients={clientsData || []}
            deliverers={deliverersData || []}
            onClose={() => {
              setIsFormOpen(false);
              setEditingDelivery(null);
            }}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingDelivery(null);
              queryClient.invalidateQueries('deliveries');
            }}
          />
        )}

        {deleteModal.isOpen && (
          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, delivery: null })}
            onConfirm={confirmDelete}
            title="Supprimer la livraison"
            message={`Êtes-vous sûr de vouloir supprimer la livraison pour ${deleteModal.delivery?.clientName}?`}
            isLoading={deleteDeliveryMutation.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveriesTable;
