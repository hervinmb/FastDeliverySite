import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        deliveries: "Deliveries",
        clients: "Clients",
        deliverers: "Deliverers",
        logout: "Logout",
        login: "Login",
        register: "Register"
      },
      // Navigation
      // Table Headers
      tableHeaders: {
        clients: "CLIENTS",
        numberOfDeliveries: "NUMBER OF DELIVERIES",
        totalGoodsPrice: "TOTAL PRICE OF GOODS",
        destination: "DESTINATION",
        deliverers: "DELIVERERS",
        deliveryFees: "DELIVERY FEES",
        status: "STATUS",
        actions: "ACTIONS"
      },
      // Buttons
      buttons: {
        addNew: "Add New",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        search: "Search",
        filter: "Filter",
        clear: "Clear"
      },
      // Filters
      //jkaldhlasd
      // Messages
      messages: {
        loginSuccess: "Login successful",
        logoutSuccess: "Logout successful",
        deliveryAdded: "Delivery added successfully",
        deliveryUpdated: "Delivery updated successfully",
        deliveryDeleted: "Delivery deleted successfully",
        clientAdded: "Client added successfully",
        clientUpdated: "Client updated successfully",
        clientDeleted: "Client deleted successfully",
        delivererAdded: "Deliverer added successfully",
        delivererUpdated: "Deliverer updated successfully",
        delivererDeleted: "Deliverer deleted successfully",
        loading: "Loading...",
        noData: "No data available",
        error: "An error occurred",
        confirmDelete: "Are you sure you want to delete this item?",
        success: "Operation completed successfully"
      },
      // Form Labels
      form: {
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        displayName: "Full Name",
        role: "Role",
        clientName: "Client Name",
        delivererName: "Deliverer Name",
        destination: "Destination",
        totalGoodsPrice: "Total Goods Price",
        deliveryFees: "Delivery Fees",
        numberOfItems: "Number of Items",
        status: "Status",
        notes: "Notes"
      },
      // Status
      status: {
        pending: "Pending",
        assigned: "Assigned",
        inTransit: "In Transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
        available: "Available",
        busy: "Busy",
        offline: "Offline"
      },
      // Roles
      roles: {
        admin: "Administrator",
        deliverer: "Deliverer",
        client: "Client"
      },
      // Placeholders
      placeholders: {
        searchClients: "Search clients...",
        searchDeliverers: "Search deliverers...",
        searchDeliveries: "Search deliveries...",
        selectClient: "Select a client",
        selectDeliverer: "Select a deliverer",
        enterDestination: "Enter destination address",
        enterPrice: "Enter price",
        enterNotes: "Enter notes (optional)"
      }
    }
  },
  fr: {
    translation: {
      // Navigation
      nav: {
        home: "Accueil",
        deliveries: "Livraisons",
        clients: "Clients",
        deliverers: "Livreurs",
        logout: "Déconnexion",
        login: "Connexion",
        register: "S'inscrire"
      },
      // Table Headers
      tableHeaders: {
        clients: "CLIENTS",
        numberOfDeliveries: "NOMBRE DE LIVRAISONS",
        totalGoodsPrice: "PRIX TOTAL DES MARCHANDISES",
        destination: "DESTINATION",
        deliverers: "LIVREURS",
        deliveryFees: "FRAIS DE LIVRAISON",
        status: "STATUT",
        actions: "ACTIONS"
      },
      // Buttons
      buttons: {
        addNew: "Ajouter Nouveau",
        edit: "Modifier",
        delete: "Supprimer",
        save: "Enregistrer",
        cancel: "Annuler",
        confirm: "Confirmer",
        close: "Fermer",
        search: "Rechercher",
        filter: "Filtrer",
        clear: "Effacer"
      },
      // Messages
      messages: {
        loginSuccess: "Connexion réussie",
        logoutSuccess: "Déconnexion réussie",
        deliveryAdded: "Livraison ajoutée avec succès",
        deliveryUpdated: "Livraison mise à jour avec succès",
        deliveryDeleted: "Livraison supprimée avec succès",
        clientAdded: "Client ajouté avec succès",
        clientUpdated: "Client mis à jour avec succès",
        clientDeleted: "Client supprimé avec succès",
        delivererAdded: "Livreur ajouté avec succès",
        delivererUpdated: "Livreur mis à jour avec succès",
        delivererDeleted: "Livreur supprimé avec succès",
        loading: "Chargement...",
        noData: "Aucune donnée disponible",
        error: "Une erreur s'est produite",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément?",
        success: "Opération terminée avec succès"
      },
      // Form Labels
      form: {
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        displayName: "Nom complet",
        role: "Rôle",
        clientName: "Nom du client",
        delivererName: "Nom du livreur",
        destination: "Destination",
        totalGoodsPrice: "Prix total des marchandises",
        deliveryFees: "Frais de livraison",
        numberOfItems: "Nombre d'articles",
        status: "Statut",
        notes: "Notes"
      },
      // Status
      status: {
        pending: "En attente",
        assigned: "Assigné",
        inTransit: "En transit",
        delivered: "Livré",
        cancelled: "Annulé",
        available: "Disponible",
        busy: "Occupé",
        offline: "Hors ligne"
      },
      // Roles
      roles: {
        admin: "Administrateur",
        deliverer: "Livreur",
        client: "Client"
      },
      // Placeholders
      placeholders: {
        searchClients: "Rechercher des clients...",
        searchDeliverers: "Rechercher des livreurs...",
        searchDeliveries: "Rechercher des livraisons...",
        selectClient: "Sélectionner un client",
        selectDeliverer: "Sélectionner un livreur",
        enterDestination: "Entrer l'adresse de destination",
        enterPrice: "Entrer le prix",
        enterNotes: "Entrer des notes (optionnel)"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
