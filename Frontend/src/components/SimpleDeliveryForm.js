import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SimpleDeliveryForm = ({ delivery, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: delivery?.clientId || '',
    clientName: delivery?.clientName || '',
    delivererId: delivery?.delivererId || '',
    delivererName: delivery?.delivererName || '',
    destination: delivery?.destination || '',
    totalGoodsPrice: delivery?.totalGoodsPrice || '',
    deliveryFees: delivery?.deliveryFees || '',
    numberOfItems: delivery?.numberOfItems || 1,
    status: delivery?.status || 'pending',
    notes: delivery?.notes || ''
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!formData.clientName || !formData.delivererName || !formData.destination) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      onSuccess(formData);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {delivery ? 'Modifier la livraison' : 'Nouvelle livraison'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Client *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Nom du client"
                required
              />
            </div>

            {/* Deliverer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Livreur *
              </label>
              <input
                type="text"
                name="delivererName"
                value={formData.delivererName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Nom du livreur"
                required
              />
            </div>

            {/* Destination */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Adresse de livraison"
                required
              />
            </div>

            {/* Number of Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'articles
              </label>
              <input
                type="number"
                name="numberOfItems"
                value={formData.numberOfItems}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="pending">En attente</option>
                <option value="assigned">Assigné</option>
                <option value="in-transit">En transit</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Total Goods Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix total des marchandises (GNF)
              </label>
              <input
                type="number"
                name="totalGoodsPrice"
                value={formData.totalGoodsPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="0.00"
              />
            </div>

            {/* Delivery Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de livraison (GNF)
              </label>
              <input
                type="number"
                name="deliveryFees"
                value={formData.deliveryFees}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="0.00"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Notes supplémentaires..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <span>{delivery ? 'Mettre à jour' : 'Créer'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleDeliveryForm;
