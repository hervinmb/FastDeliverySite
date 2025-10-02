import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { X, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DeliveryForm = ({ delivery, clients, deliverers, onClose, onSuccess }) => {
  const { t } = useTranslation();
  // const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
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
    }
  });

  const watchedClientId = watch('clientId');
  const watchedDelivererId = watch('delivererId');

  // Update client name when client is selected
  useEffect(() => {
    if (watchedClientId) {
      const selectedClient = clients.find(c => c.id === watchedClientId);
      if (selectedClient) {
        setValue('clientName', selectedClient.name);
      }
    }
  }, [watchedClientId, clients, setValue]);

  // Update deliverer name when deliverer is selected
  useEffect(() => {
    if (watchedDelivererId) {
      const selectedDeliverer = deliverers.find(d => d.id === watchedDelivererId);
      if (selectedDeliverer) {
        setValue('delivererName', selectedDeliverer.name);
      }
    }
  }, [watchedDelivererId, deliverers, setValue]);

  // Create/Update delivery mutation
  const deliveryMutation = useMutation(
    (data) => {
      if (delivery) {
        return axios.put(`/api/deliveries/${delivery.id}`, data);
      } else {
        return axios.post('/api/deliveries', data);
      }
    },
    {
      onSuccess: (response) => {
        toast.success(
          delivery 
            ? t('messages.deliveryUpdated') 
            : t('messages.deliveryAdded')
        );
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || t('messages.error'));
      }
    }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await deliveryMutation.mutateAsync(data);
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
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.clientName')} *
              </label>
              <select
                {...register('clientId', { required: 'Client requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{t('placeholders.selectClient')}</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>

            {/* Deliverer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.delivererName')} *
              </label>
              <select
                {...register('delivererId', { required: 'Livreur requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{t('placeholders.selectDeliverer')}</option>
                {deliverers.map((deliverer) => (
                  <option key={deliverer.id} value={deliverer.id}>
                    {deliverer.name}
                  </option>
                ))}
              </select>
              {errors.delivererId && (
                <p className="mt-1 text-sm text-red-600">{errors.delivererId.message}</p>
              )}
            </div>

            {/* Destination */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.destination')} *
              </label>
              <input
                type="text"
                {...register('destination', { required: 'Destination requise' })}
                placeholder={t('placeholders.enterDestination')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>

            {/* Number of Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.numberOfItems')} *
              </label>
              <input
                type="number"
                min="1"
                {...register('numberOfItems', { 
                  required: 'Nombre d\'articles requis',
                  min: { value: 1, message: 'Minimum 1 article' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.numberOfItems && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfItems.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.status')}
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                {t('form.totalGoodsPrice')} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('totalGoodsPrice', { 
                    required: 'Prix requis',
                    min: { value: 0, message: 'Prix doit être positif' }
                  })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {errors.totalGoodsPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.totalGoodsPrice.message}</p>
              )}
            </div>

            {/* Delivery Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.deliveryFees')} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('deliveryFees', { 
                    required: 'Frais de livraison requis',
                    min: { value: 0, message: 'Frais doivent être positifs' }
                  })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {errors.deliveryFees && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryFees.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.notes')}
              </label>
              <textarea
                {...register('notes')}
                rows="3"
                placeholder={t('placeholders.enterNotes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            >
              {t('buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSubmitting ? 'Enregistrement...' : t('buttons.save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm;
