import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import SimpleDeliveryForm from './SimpleDeliveryForm';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';

const SimpleDeliveriesTable = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load deliveries from Firebase
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const deliveriesRef = collection(db, 'deliveries');
      const q = query(deliveriesRef, orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      
      const deliveriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by serial number if available, otherwise by creation date
      deliveriesData.sort((a, b) => {
        if (a.serialNumber && b.serialNumber) {
          return a.serialNumber - b.serialNumber;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      toast.error('Erreur lors du chargement des livraisons');
    } finally {
      setLoading(false);
    }
  };

  const getNextSerialNumber = () => {
    if (deliveries.length === 0) return 1;
    
    // Find the highest serial number
    const maxSerial = Math.max(...deliveries.map(d => d.serialNumber || 0));
    return maxSerial + 1;
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'assigned':
        return 'Assigné';
      case 'in-transit':
        return 'En transit';
      case 'delivered':
        return 'Livré';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };


  const handleAdd = () => {
    setEditingDelivery(null);
    setIsFormOpen(true);
  };

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    setIsFormOpen(true);
  };

  const handleDelete = async (delivery) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la livraison pour ${delivery.clientName}?`)) {
      try {
        // Delete from Firebase
        await deleteDoc(doc(db, 'deliveries', delivery.id));
        
        // Update local state
        setDeliveries(deliveries.filter(d => d.id !== delivery.id));
        toast.success(`Livraison pour ${delivery.clientName} supprimée avec succès`);
      } catch (error) {
        console.error('Error deleting delivery:', error);
        toast.error('Erreur lors de la suppression de la livraison');
      }
    }
  };

  const handleFormSuccess = async (formData) => {
    try {
      // Convert string values to numbers
      const processedData = {
        ...formData,
        totalGoodsPrice: Number(formData.totalGoodsPrice) || 0,
        deliveryFees: Number(formData.deliveryFees) || 0,
        numberOfItems: Number(formData.numberOfItems) || 1,
        serialNumber: editingDelivery ? editingDelivery.serialNumber : getNextSerialNumber(), // Auto-generate serial number for new deliveries
        createdAt: editingDelivery ? editingDelivery.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingDelivery) {
        // Update existing delivery in Firebase
        const deliveryRef = doc(db, 'deliveries', editingDelivery.id);
        await updateDoc(deliveryRef, processedData);
        
        // Update local state
        setDeliveries(deliveries.map(d => 
          d.id === editingDelivery.id 
            ? { ...d, ...processedData, id: editingDelivery.id }
            : d
        ));
        toast.success(`Livraison pour ${formData.clientName} mise à jour avec succès`);
      } else {
        // Add new delivery to Firebase
        const docRef = await addDoc(collection(db, 'deliveries'), processedData);
        
        // Update local state
        const newDelivery = {
          ...processedData,
          id: docRef.id,
        };
        setDeliveries([newDelivery, ...deliveries]);
        toast.success(`Nouvelle livraison pour ${formData.clientName} ajoutée avec succès`);
      }
      setIsFormOpen(false);
      setEditingDelivery(null);
    } catch (error) {
      console.error('Error saving delivery:', error);
      toast.error('Erreur lors de la sauvegarde de la livraison');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDelivery(null);
  };


  const getRowGradient = (index) => {
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

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-400';
      case 'assigned':
        return 'border-blue-400';
      case 'in-transit':
        return 'border-orange-400';
      case 'delivered':
        return 'border-green-400';
      case 'cancelled':
        return 'border-red-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 pl-16 lg:pl-0">
            {t('nav.deliveries')}
          </h1>
          <p className="text-gray-400 pl-16 lg:pl-0">
            Gérez vos livraisons et suivez leur statut en temps réel
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
                  placeholder={t('placeholders.searchDeliveries')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span>{t('buttons.addNew')}</span>
            </button>
          </div>
        </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-600">Chargement des livraisons...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.clients')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.numberOfDeliveries')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.totalGoodsPrice')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.destination')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.deliverers')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.deliveryFees')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t('tableHeaders.actions')}
                  </th>
                </tr>
              </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deliveries.map((delivery, index) => (
                      <tr key={delivery.id} className={`${getRowGradient(index)} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 ${getStatusBorderColor(delivery.status)}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="serial-number transition-all duration-200 hover:scale-110">
                          {delivery.serialNumber || index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {delivery.clientName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {delivery.clientName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-full px-3 py-1 inline-block">
                        {delivery.numberOfItems}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600 bg-green-50 rounded-lg px-3 py-2 inline-block">
                        GNF {Number(delivery.totalGoodsPrice || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700 max-w-xs truncate bg-gray-50 rounded-lg px-3 py-2">
                        📍 {delivery.destination}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {delivery.delivererName ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {delivery.delivererName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {delivery.delivererName}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                              <span className="text-white font-bold text-xs">?</span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-500 italic">
                              Non Assigné
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600 bg-blue-50 rounded-lg px-3 py-2 inline-block">
                        GNF {Number(delivery.deliveryFees || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(delivery.status)} shadow-sm`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(delivery)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(delivery)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                  </tbody>
                  </table>
                </div>
              )}
            </div>

        {/* Info Message */}
        {deliveries.length === 0 && !loading && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Aucune livraison trouvée
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Commencez par ajouter votre première livraison en cliquant sur le bouton "Ajouter Nouveau".</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <SimpleDeliveryForm
            delivery={editingDelivery}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleDeliveriesTable;

