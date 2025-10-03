import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';

const DeliverersTable = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [isFormOpen, setIsFormOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editingDeliverer, setEditingDeliverer] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, deliverer: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch deliverers
  const { data: deliverersData, isLoading, error } = useQuery(
    ['deliverers', currentPage, statusFilter, searchTerm],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await axios.get(`/api/deliverers?${params}`);
      return response.data;
    }
  );

  // Delete deliverer mutation
  const deleteDelivererMutation = useMutation(
    (id) => axios.delete(`/api/deliverers/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('deliverers');
        toast.success(t('messages.delivererDeleted'));
        setDeleteModal({ isOpen: false, deliverer: null });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  // Update deliverer status mutation
  const updateStatusMutation = useMutation(
    ({ id, status }) => axios.put(`/api/deliverers/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('deliverers');
        toast.success(t('messages.delivererUpdated'));
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  const handleEdit = (deliverer) => {
    setEditingDeliverer(deliverer);
    setIsFormOpen(true);
  };

  const handleDelete = (deliverer) => {
    setDeleteModal({ isOpen: true, deliverer });
  };

  const confirmDelete = () => {
    if (deleteModal.deliverer) {
      deleteDelivererMutation.mutate(deleteModal.deliverer.id);
    }
  };

  const handleStatusChange = (deliverer, newStatus) => {
    updateStatusMutation.mutate({ id: deliverer.id, status: newStatus });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
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
            {t('nav.deliverers')}
          </h1>
          <p className="text-gray-400">
            Gérez vos livreurs et leur statut
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
                  placeholder={t('placeholders.searchDeliverers')}
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
                <option value="available">Disponible</option>
                <option value="busy">Occupé</option>
                <option value="offline">Hors ligne</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditingDeliverer(null);
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
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livraisons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliverersData?.deliverers?.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      {t('messages.noData')}
                    </td>
                  </tr>
                ) : (
                  deliverersData?.deliverers?.map((deliverer) => (
                    <tr key={deliverer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <UserCheck className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {deliverer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deliverer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deliverer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {deliverer.vehicleInfo || 'Non spécifié'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deliverer.totalDeliveries || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            {deliverer.rating ? deliverer.rating.toFixed(1) : 'N/A'}
                          </span>
                          {deliverer.rating && (
                            <span className="ml-1 text-yellow-400">★</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deliverer.status)}`}>
                          {getStatusIcon(deliverer.status)}
                          <span className="ml-1">{t(`status.${deliverer.status}`)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <select
                            value={deliverer.status}
                            onChange={(e) => handleStatusChange(deliverer, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="available">Disponible</option>
                            <option value="busy">Occupé</option>
                            <option value="offline">Hors ligne</option>
                          </select>
                          <button
                            onClick={() => handleEdit(deliverer)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(deliverer)}
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
          {deliverersData?.pagination && deliverersData.pagination.pages > 1 && (
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
                  onClick={() => setCurrentPage(Math.min(deliverersData.pagination.pages, currentPage + 1))}
                  disabled={currentPage === deliverersData.pagination.pages}
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
                      {((currentPage - 1) * deliverersData.pagination.limit) + 1}
                    </span>{' '}
                    à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * deliverersData.pagination.limit, deliverersData.pagination.total)}
                    </span>{' '}
                    sur{' '}
                    <span className="font-medium">{deliverersData.pagination.total}</span>{' '}
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
                      onClick={() => setCurrentPage(Math.min(deliverersData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === deliverersData.pagination.pages}
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

        {/* Delete Modal */}
        {deleteModal.isOpen && (
          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, deliverer: null })}
            onConfirm={confirmDelete}
            title="Supprimer le livreur"
            message={`Êtes-vous sûr de vouloir supprimer le livreur ${deleteModal.deliverer?.name}?`}
            isLoading={deleteDelivererMutation.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DeliverersTable;
