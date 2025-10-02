# Firebase Data Model for LIVRAISON RAPIDE (Rapid Delivery System)

## Project Overview / Aperçu du Projet
This document outlines the Firebase data structure for a rapid delivery management system built with ReactJS frontend and Firebase backend. The system allows users to track deliveries, manage clients, and monitor delivery personnel.

Ce document décrit la structure de données Firebase pour un système de gestion de livraison rapide construit avec ReactJS frontend et Firebase backend. Le système permet aux utilisateurs de suivre les livraisons, gérer les clients et surveiller le personnel de livraison.

## Application Features / Fonctionnalités de l'Application (Based on UI Design)
- **User Authentication / Authentification Utilisateur**: Login system for secure access / Système de connexion pour un accès sécurisé
- **Home Dashboard / Tableau de Bord Principal**: Main table displaying delivery information / Tableau principal affichant les informations de livraison
- **Client Management / Gestion des Clients**: Track client information and delivery history / Suivre les informations client et l'historique des livraisons
- **Delivery Tracking / Suivi des Livraisons**: Monitor individual deliveries and their status / Surveiller les livraisons individuelles et leur statut
- **Mobile-Friendly Design / Conception Mobile-Friendly**: Responsive interface optimized for mobile devices / Interface responsive optimisée pour les appareils mobiles
- **Multi-Language Support / Support Multilingue**: English and French language support / Support des langues anglaise et française

## Firebase Collections Structure / Structure des Collections Firebase

### 1. `users` Collection / Collection `users`
**Purpose / Objectif**: Store user authentication and profile information / Stocker l'authentification utilisateur et les informations de profil
**Document ID / ID du Document**: Firebase Auth UID

```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "admin", // "admin", "deliverer", "client"
  "phone": "+1234567890",
  "isActive": true,
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "profileImage": "https://storage.googleapis.com/..."
}
```

### 2. `clients` Collection / Collection `clients`
**Purpose / Objectif**: Store client information for delivery management / Stocker les informations client pour la gestion des livraisons
**Document ID / ID du Document**: Auto-generated (e.g., `client_abc123`) / Auto-généré (ex: `client_abc123`)

```json
{
  "clientId": "client_abc123",
  "name": "Client Name Here", // Maps to CLIENTS column
  "contactPerson": "Jane Smith",
  "email": "client@company.com",
  "phone": "+1234567890",
  "address": "123 Main Street, City, Country",
  "isActive": true,
  "totalDeliveries": 0, // Calculated field
  "totalSpent": 0.00, // Calculated field
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. `deliverers` Collection / Collection `deliverers`
**Purpose / Objectif**: Store delivery personnel information / Stocker les informations du personnel de livraison
**Document ID / ID du Document**: Auto-generated (e.g., `deliverer_xyz789`) / Auto-généré (ex: `deliverer_xyz789`)

```json
{
  "delivererId": "deliverer_xyz789",
  "name": "John Doe", // Maps to LIVREURS column
  "email": "deliverer@company.com",
  "phone": "+1234567890",
  "vehicleInfo": "Van - License Plate ABC-123",
  "status": "available", // "available", "busy", "offline"
  "rating": 4.5,
  "totalDeliveries": 0, // Calculated field
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 4. `deliveries` Collection / Collection `deliveries`
**Purpose / Objectif**: Store individual delivery records (main table data) / Stocker les enregistrements de livraison individuels (données du tableau principal)
**Document ID / ID du Document**: Auto-generated (e.g., `delivery_def456`) / Auto-généré (ex: `delivery_def456`)

```json
{
  "deliveryId": "delivery_def456",
  "clientId": "client_abc123", // Reference to clients collection
  "clientName": "Client Name Here", // Denormalized for easy display
  "delivererId": "deliverer_xyz789", // Reference to deliverers collection
  "delivererName": "John Doe", // Denormalized for easy display
  "destination": "456 Oak Avenue, Town, Country", // Maps to DESTINATION column
  "totalGoodsPrice": 150.75, // Maps to PRIX TOTAL DES MARCHANDISES column
  "deliveryFees": 10.00, // Maps to FRAIS DE LIVRAISON column
  "numberOfItems": 1, // Maps to NOMBRE DE LIVRAISONS column
  "status": "pending", // "pending", "assigned", "in-transit", "delivered", "cancelled"
  "deliveryDate": "timestamp",
  "scheduledDate": "timestamp",
  "completedDate": "timestamp",
  "notes": "Fragile items - handle with care",
  "paymentStatus": "pending", // "pending", "paid", "failed"
  "createdBy": "user123", // Reference to users collection
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 5. `deliveryItems` Collection / Collection `deliveryItems` (Optional - for detailed item tracking / Optionnel - pour le suivi détaillé des articles)
**Purpose / Objectif**: Store individual items within a delivery / Stocker les articles individuels dans une livraison
**Document ID / ID du Document**: Auto-generated (e.g., `item_ghi789`) / Auto-généré (ex: `item_ghi789`)

```json
{
  "itemId": "item_ghi789",
  "deliveryId": "delivery_def456", // Reference to deliveries collection
  "itemName": "Product Name",
  "quantity": 2,
  "unitPrice": 75.50,
  "totalPrice": 151.00,
  "weight": 2.5, // in kg
  "dimensions": "30x20x15", // in cm
  "isFragile": true,
  "createdAt": "timestamp"
}
```

## Database Rules and Security / Règles de Base de Données et Sécurité

### Authentication Rules / Règles d'Authentification
```javascript
// Users can only access their own data
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    match /deliverers/{delivererId} {
      allow read, write: if request.auth != null;
    }
    
    match /deliveries/{deliveryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## API Endpoints Structure / Structure des Points de Terminaison API

### Client Management / Gestion des Clients
- `GET /api/clients` - Get all clients / Obtenir tous les clients
- `POST /api/clients` - Create new client / Créer un nouveau client
- `PUT /api/clients/:id` - Update client / Mettre à jour le client
- `DELETE /api/clients/:id` - Delete client / Supprimer le client

### Delivery Management / Gestion des Livraisons
- `GET /api/deliveries` - Get all deliveries (with pagination) / Obtenir toutes les livraisons (avec pagination)
- `POST /api/deliveries` - Create new delivery / Créer une nouvelle livraison
- `PUT /api/deliveries/:id` - Update delivery / Mettre à jour la livraison
- `DELETE /api/deliveries/:id` - Delete delivery / Supprimer la livraison
- `PUT /api/deliveries/:id/status` - Update delivery status / Mettre à jour le statut de livraison

### Deliverer Management / Gestion des Livreurs
- `GET /api/deliverers` - Get all deliverers / Obtenir tous les livreurs
- `POST /api/deliverers` - Create new deliverer / Créer un nouveau livreur
- `PUT /api/deliverers/:id` - Update deliverer / Mettre à jour le livreur
- `PUT /api/deliverers/:id/status` - Update deliverer status / Mettre à jour le statut du livreur

## Frontend State Management / Gestion d'État Frontend

### Redux Store Structure / Structure du Store Redux
```javascript
{
  auth: {
    user: null,
    isAuthenticated: false,
    loading: false
  },
  clients: {
    list: [],
    loading: false,
    error: null
  },
  deliveries: {
    list: [],
    loading: false,
    error: null,
    filters: {
      status: 'all',
      clientId: null,
      delivererId: null,
      dateRange: null
    }
  },
  deliverers: {
    list: [],
    loading: false,
    error: null
  }
}
```

## Table Display Logic / Logique d'Affichage du Tableau

### Main Table Columns Mapping / Mapping des Colonnes du Tableau Principal
1. **CLIENTS** → `clientName` from deliveries collection / `clientName` de la collection deliveries
2. **NOMBRE DE LIVRAISONS** → `numberOfItems` from deliveries collection / `numberOfItems` de la collection deliveries
3. **PRIX TOTAL DES MARCHANDISES** → `totalGoodsPrice` from deliveries collection / `totalGoodsPrice` de la collection deliveries
4. **DESTINATION** → `destination` from deliveries collection / `destination` de la collection deliveries
5. **LIVREURS** → `delivererName` from deliveries collection / `delivererName` de la collection deliveries
6. **FRAIS DE LIVRAISON** → `deliveryFees` from deliveries collection / `deliveryFees` de la collection deliveries

### Data Aggregation / Agrégation des Données
- For client summary view: Aggregate deliveries by `clientId` / Pour la vue résumé client : Agréger les livraisons par `clientId`
- For deliverer performance: Aggregate deliveries by `delivererId` / Pour les performances du livreur : Agréger les livraisons par `delivererId`
- For financial reports: Sum `totalGoodsPrice` and `deliveryFees` / Pour les rapports financiers : Somme de `totalGoodsPrice` et `deliveryFees`

## Mobile Responsiveness Considerations / Considérations de Responsivité Mobile
- Table should be horizontally scrollable on mobile / Le tableau doit être scrollable horizontalement sur mobile
- Touch-friendly buttons and inputs / Boutons et entrées tactiles
- Collapsible columns on smaller screens / Colonnes pliables sur les écrans plus petits
- Swipe gestures for row actions / Gestes de balayage pour les actions de ligne
- Optimized font sizes and spacing / Tailles de police et espacement optimisés

## Performance Optimizations / Optimisations de Performance
- Implement pagination for large datasets / Implémenter la pagination pour les grands ensembles de données
- Use Firestore indexes for efficient queries / Utiliser les index Firestore pour des requêtes efficaces
- Implement real-time listeners for live updates / Implémenter des écouteurs en temps réel pour les mises à jour en direct
- Cache frequently accessed data / Mettre en cache les données fréquemment consultées
- Lazy load images and non-critical data / Chargement paresseux des images et des données non critiques

## Language Support / Support des Langues
### Internationalization (i18n) Configuration / Configuration d'Internationalisation (i18n)
```javascript
// Language configuration for React i18n
const languages = {
  en: {
    tableHeaders: {
      clients: "CLIENTS",
      numberOfDeliveries: "NUMBER OF DELIVERIES",
      totalGoodsPrice: "TOTAL PRICE OF GOODS",
      destination: "DESTINATION",
      deliverers: "DELIVERERS",
      deliveryFees: "DELIVERY FEES"
    },
    buttons: {
      addNew: "Add New",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel"
    },
    messages: {
      loginSuccess: "Login successful",
      deliveryAdded: "Delivery added successfully",
      deliveryUpdated: "Delivery updated successfully",
      deliveryDeleted: "Delivery deleted successfully"
    }
  },
  fr: {
    tableHeaders: {
      clients: "CLIENTS",
      numberOfDeliveries: "NOMBRE DE LIVRAISONS",
      totalGoodsPrice: "PRIX TOTAL DES MARCHANDISES",
      destination: "DESTINATION",
      deliverers: "LIVREURS",
      deliveryFees: "FRAIS DE LIVRAISON"
    },
    buttons: {
      addNew: "Ajouter Nouveau",
      edit: "Modifier",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler"
    },
    messages: {
      loginSuccess: "Connexion réussie",
      deliveryAdded: "Livraison ajoutée avec succès",
      deliveryUpdated: "Livraison mise à jour avec succès",
      deliveryDeleted: "Livraison supprimée avec succès"
    }
  }
};
```

## Future Enhancements / Améliorations Futures
- Real-time tracking with GPS / Suivi en temps réel avec GPS
- Push notifications for status updates / Notifications push pour les mises à jour de statut
- QR code generation for deliveries / Génération de codes QR pour les livraisons
- Photo capture for delivery confirmation / Capture photo pour la confirmation de livraison
- Integration with payment gateways / Intégration avec les passerelles de paiement
- Analytics and reporting dashboard / Tableau de bord d'analyse et de rapports
