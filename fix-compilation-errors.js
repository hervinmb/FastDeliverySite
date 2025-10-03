const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing compilation errors...\n');

// Fix ClientsTable.js - ensure state variables are properly declared
const clientsTablePath = path.join(__dirname, 'Frontend', 'src', 'components', 'ClientsTable.js');
let clientsTableContent = fs.readFileSync(clientsTablePath, 'utf8');

// Check if state variables are commented out and fix them
if (clientsTableContent.includes('// const [isFormOpen, setIsFormOpen] = useState(false);')) {
  clientsTableContent = clientsTableContent.replace(
    '// const [isFormOpen, setIsFormOpen] = useState(false);',
    'const [isFormOpen, setIsFormOpen] = useState(false);'
  );
  console.log('✅ Fixed isFormOpen state in ClientsTable.js');
}

if (clientsTableContent.includes('// const [editingClient, setEditingClient] = useState(null);')) {
  clientsTableContent = clientsTableContent.replace(
    '// const [editingClient, setEditingClient] = useState(null);',
    'const [editingClient, setEditingClient] = useState(null);'
  );
  console.log('✅ Fixed editingClient state in ClientsTable.js');
}

fs.writeFileSync(clientsTablePath, clientsTableContent);

// Fix DeliverersTable.js - ensure state variables are properly declared
const deliverersTablePath = path.join(__dirname, 'Frontend', 'src', 'components', 'DeliverersTable.js');
let deliverersTableContent = fs.readFileSync(deliverersTablePath, 'utf8');

if (deliverersTableContent.includes('// const [isFormOpen, setIsFormOpen] = useState(false);')) {
  deliverersTableContent = deliverersTableContent.replace(
    '// const [isFormOpen, setIsFormOpen] = useState(false);',
    'const [isFormOpen, setIsFormOpen] = useState(false);'
  );
  console.log('✅ Fixed isFormOpen state in DeliverersTable.js');
}

if (deliverersTableContent.includes('// const [editingDeliverer, setEditingDeliverer] = useState(null);')) {
  deliverersTableContent = deliverersTableContent.replace(
    '// const [editingDeliverer, setEditingDeliverer] = useState(null);',
    'const [editingDeliverer, setEditingDeliverer] = useState(null);'
  );
  console.log('✅ Fixed editingDeliverer state in DeliverersTable.js');
}

fs.writeFileSync(deliverersTablePath, deliverersTableContent);

// Check for any remaining Phone references in Register.js
const registerPath = path.join(__dirname, 'Frontend', 'src', 'pages', 'Register.js');
let registerContent = fs.readFileSync(registerPath, 'utf8');

if (registerContent.includes('Phone')) {
  console.log('⚠️  Found Phone references in Register.js - removing them...');
  // Remove any remaining Phone references
  registerContent = registerContent.replace(/Phone/g, '');
  fs.writeFileSync(registerPath, registerContent);
  console.log('✅ Removed Phone references from Register.js');
} else {
  console.log('✅ No Phone references found in Register.js');
}

console.log('\n🎉 All compilation errors should be fixed!');
console.log('\n📋 Next steps:');
console.log('1. Run: cd Frontend && npm start');
console.log('2. Or use: restart-app.bat');
console.log('3. The "Add New" button should now work in the deliveries table!');

