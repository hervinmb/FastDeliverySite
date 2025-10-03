import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import DeleteConfirmModal from './DeleteConfirmModal';

const ClientsTable = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const [isFormOpen, setIsFormOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editingClient, setEditingClient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, client: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch clients
  const { data: clientsData, isLoading, error } = useQuery(
    ['clients', currentPage, searchTerm],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await axios.get(`/api/clients?${params}`);
      return response.data;
    }
  );

  // Delete client mutation
  const deleteClientMutation = useMutation(
    (id) => axios.delete(`/api/clients/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success(t('messages.clientDeleted'));
        setDeleteModal({ isOpen: false, client: null });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = (client) => {
    setDeleteModal({ isOpen: true, client });
  };

  const confirmDelete = () => {
    if (deleteModal.client) {
      deleteClientMutation.mutate(deleteModal.client.id);
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
        <div className="mb-8 pt-4 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 pl-16 lg:pl-0">
            {t('nav.clients')}
          </h1>
          <p className="text-gray-400 pl-16 lg:pl-0">
            Gérez vos clients et leurs informations
          </p>
        </div>

        {/* Controls */}
        <div className="bg-dark-800 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('placeholders.searchClients')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditingClient(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap"
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
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livraisons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dépensé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientsData?.clients?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {t('messages.noData')}
                    </td>
                  </tr>
                ) : (
                  clientsData?.clients?.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {client.address || 'Non spécifiée'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.totalDeliveries || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          ${(client.totalSpent || 0).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-primary-600 hover:text-primary-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client)}
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
          {clientsData?.pagination && clientsData.pagination.pages > 1 && (
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
                  onClick={() => setCurrentPage(Math.min(clientsData.pagination.pages, currentPage + 1))}
                  disabled={currentPage === clientsData.pagination.pages}
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
                      {((currentPage - 1) * clientsData.pagination.limit) + 1}
                    </span>{' '}
                    à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * clientsData.pagination.limit, clientsData.pagination.total)}
                    </span>{' '}
                    sur{' '}
                    <span className="font-medium">{clientsData.pagination.total}</span>{' '}
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
                      onClick={() => setCurrentPage(Math.min(clientsData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === clientsData.pagination.pages}
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
            onClose={() => setDeleteModal({ isOpen: false, client: null })}
            onConfirm={confirmDelete}
            title="Supprimer le client"
            message={`Êtes-vous sûr de vouloir supprimer le client ${deleteModal.client?.name}?`}
            isLoading={deleteClientMutation.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
