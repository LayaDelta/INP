const DB = (() => {
  const INITIAL_COMPONENTS = [
    { id: 1, name: 'AMD Ryzen 9 7950X3D', category: 'CPU', quantity: 15, price: 699.99, description: '16-core, 32-thread flagship gaming processor.' },
    { id: 2, name: 'Intel Core i9-13900K', category: 'CPU', quantity: 12, price: 589.99, description: '24-core desktop processor.' },
    { id: 3, name: 'NVIDIA GeForce RTX 4090 Founders Edition', category: 'GPU', quantity: 5, price: 1599.99, description: 'Top-tier graphics card for 4K gaming.' },
    { id: 4, name: 'ASUS ROG Strix GeForce RTX 4080', category: 'GPU', quantity: 8, price: 1199.99, description: 'High-performance OC edition GPU.' },
    { id: 5, name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4', category: 'RAM', quantity: 24, price: 89.99, description: '3200MHz C16 desktop memory.' },
    { id: 6, name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5', category: 'RAM', quantity: 18, price: 129.99, description: '6000MHz CL36 high-speed memory.' },
    { id: 7, name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe', category: 'Storage', quantity: 30, price: 169.99, description: 'Ultra-fast M.2 SSD up to 7450 MB/s.' },
    { id: 8, name: 'Western Digital WD Black SN850X 1TB', category: 'Storage', quantity: 45, price: 84.99, description: 'High-end gaming NVMe SSD.' },
    { id: 9, name: 'MSI MAG B650 TOMAHAWK WIFI', category: 'Motherboard', quantity: 10, price: 219.99, description: 'AM5 ATX motherboard.' },
    { id: 10, name: 'Corsair RM850x 850W 80 Plus Gold', category: 'PSU', quantity: 20, price: 134.99, description: 'Fully modular ATX power supply.' }
  ];

  const INITIAL_USERS = [
    { id: 1, username: 'admin', email: 'admin@inp.com', password: 'admin123', role: 'admin' }
  ];

  // Initialize data if not present
  if (!localStorage.getItem('inp_db_components')) {
    localStorage.setItem('inp_db_components', JSON.stringify(INITIAL_COMPONENTS));
  }
  if (!localStorage.getItem('inp_db_users')) {
    localStorage.setItem('inp_db_users', JSON.stringify(INITIAL_USERS));
  }

  // Components CRUD
  const getComponents = () => JSON.parse(localStorage.getItem('inp_db_components'));
  
  const saveComponent = (data) => {
    const components = getComponents();
    if (data.id) {
      const index = components.findIndex(c => c.id == data.id);
      if (index !== -1) {
        components[index] = { ...components[index], ...data };
      }
    } else {
      data.id = Date.now();
      components.unshift(data);
    }
    localStorage.setItem('inp_db_components', JSON.stringify(components));
    return { success: true };
  };

  const deleteComponent = (id) => {
    const components = getComponents().filter(c => c.id != id);
    localStorage.setItem('inp_db_components', JSON.stringify(components));
    return { success: true };
  };

  const updateStock = (id, change) => {
    const components = getComponents();
    const item = components.find(c => c.id == id);
    if (item) {
      item.quantity = Math.max(0, item.quantity + change);
      localStorage.setItem('inp_db_components', JSON.stringify(components));
    }
  };

  // Auth
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('inp_db_users'));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      return { 
        success: true, 
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: user.id, username: user.username, email: user.email, role: user.role }
      };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (data) => {
    const users = JSON.parse(localStorage.getItem('inp_db_users'));
    if (users.find(u => u.email === data.email || u.username === data.username)) {
      return { success: false, error: 'User already exists' };
    }
    const newUser = { 
      id: Date.now(), 
      ...data, 
      role: 'user' 
    };
    users.push(newUser);
    localStorage.setItem('inp_db_users', JSON.stringify(users));
    return login(data.email, data.password);
  };

  return {
    getComponents,
    saveComponent,
    deleteComponent,
    updateStock,
    login,
    register
  };
})();
