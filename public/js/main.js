document.addEventListener('DOMContentLoaded', () => {

  const translations = {
    en: {
      appTitle: 'INP Inventory',
      appSubtitle: 'Manage your PC Components effortlessly',
      formTitleAdd: 'Add New Component',
      formTitleEdit: 'Edit Component',
      labelName: 'Component Name <span class="required">*</span>',
      labelCategory: 'Category <span class="required">*</span>',
      labelPrice: 'Price ($) <span class="required">*</span>',
      labelQuantity: 'Quantity',
      labelDesc: 'Description',
      btnCancel: 'Cancel Edit',
      btnAdd: 'Add Component',
      btnUpdate: 'Update Component',
      inventoryTitle: 'Current Inventory',
      loading: 'Loading inventory...',
      btnPrev: 'Previous',
      btnNext: 'Next',
      emptyTitle: 'No components found',
      emptyDesc: 'Start by adding your first PC component using the form above.',
      optSelect: 'Select category...',
      optMotherboard: 'Motherboard',
      optStorage: 'Storage',
      optPSU: 'Power Supply',
      optCase: 'Case',
      optCooler: 'Cooling',
      optOther: 'Other',
      placeholderName: 'e.g. NVIDIA RTX 4090',
      placeholderDescEn: 'English details...',
      placeholderDescEs: 'Spanish details (optional)...',
      placeholderSearch: 'Search components...',
      stockOut: 'Out of Stock',
      stockIn: 'in stock',
      noDesc: 'No description provided.',
      btnEdit: 'Edit',
      btnDelete: 'Delete',
      msgAdded: 'Component added successfully!',
      msgUpdated: 'Component updated successfully!',
      msgDeleted: 'Component deleted successfully',
      msgConfirm: 'Are you sure you want to delete this component?',
      catMotherboard: 'Motherboard',
      catStorage: 'Storage',
      catPSU: 'Power Supply',
      catCase: 'Case',
      catCooler: 'Cooling',
      catOther: 'Other',
      catCPU: 'CPU',
      catGPU: 'GPU',
      catRAM: 'RAM',
      pageOf: 'Page {0} of {1}'
    },
    es: {
      appTitle: 'Inventario INP',
      appSubtitle: 'Gestiona tus Componentes de PC sin esfuerzo',
      formTitleAdd: 'Añadir Nuevo Componente',
      formTitleEdit: 'Editar Componente',
      labelName: 'Nombre del Componente <span class="required">*</span>',
      labelCategory: 'Categoría <span class="required">*</span>',
      labelPrice: 'Precio ($) <span class="required">*</span>',
      labelQuantity: 'Cantidad',
      labelDesc: 'Descripción',
      btnCancel: 'Cancelar Edición',
      btnAdd: 'Añadir Componente',
      btnUpdate: 'Actualizar Componente',
      inventoryTitle: 'Inventario Actual',
      loading: 'Cargando inventario...',
      btnPrev: 'Anterior',
      btnNext: 'Siguiente',
      emptyTitle: 'No se encontraron componentes',
      emptyDesc: 'Empieza añadiendo tu primer elemento usando el formulario.',
      optSelect: 'Seleccionar categoría...',
      optMotherboard: 'Placa Base',
      optStorage: 'Almacenamiento',
      optPSU: 'Fuente de Poder',
      optCase: 'Gabinete (Case)',
      optCooler: 'Refrigeración',
      optOther: 'Otro',
      placeholderName: 'ej. NVIDIA RTX 4090',
      placeholderDescEn: 'Detalles en inglés...',
      placeholderDescEs: 'Detalles en español (opcional)...',
      placeholderSearch: 'Buscar componentes...',
      stockOut: 'Agotado',
      stockIn: 'en stock',
      noDesc: 'Sin descripción.',
      btnEdit: 'Editar',
      btnDelete: 'Eliminar',
      msgAdded: '¡Componente añadido exitosamente!',
      msgUpdated: '¡Componente actualizado exitosamente!',
      msgDeleted: 'Componente eliminado exitosamente',
      msgConfirm: '¿Estás seguro de que deseas eliminar este componente?',
      catMotherboard: 'Placa Base',
      catStorage: 'Almacenamiento',
      catPSU: 'Fuente de Poder',
      catCase: 'Gabinete',
      catCooler: 'Refrigeración',
      catOther: 'Otro',
      catCPU: 'CPU',
      catGPU: 'GPU',
      catRAM: 'RAM',
      pageOf: 'Página {0} de {1}'
    }
  };

  let currentLang = localStorage.getItem('inp_lang') || 'en';
  // DOM Elements
  const form = document.getElementById('component-form');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const searchInput = document.getElementById('search-input');
  
  // Edit Modal Elements
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-component-form');
  const closeEditBtn = document.getElementById('close-modal-btn');
  const cancelEditBtn = document.getElementById('edit-cancel-btn');
  
  const editIdInput = document.getElementById('edit-component-id');
  const editNameInput = document.getElementById('edit-name');
  const editCategoryInput = document.getElementById('edit-category');
  const editPriceInput = document.getElementById('edit-price');
  const editQuantityInput = document.getElementById('edit-quantity');
  const editDescInput = document.getElementById('edit-description');
  
  const componentsGrid = document.getElementById('components-grid');
  const loadingState = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  
  const paginationControls = document.getElementById('pagination-controls');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageIndicator = document.getElementById('page-indicator');
  
  const errorMsg = document.getElementById('error-message');
  const successMsg = document.getElementById('success-message');

  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');

  // Form Fields
  const idInput = document.getElementById('component-id');
  const nameInput = document.getElementById('name');
  const categoryInput = document.getElementById('category');
  const priceInput = document.getElementById('price');
  const quantityInput = document.getElementById('quantity');
  const descInput = document.getElementById('description');

  let components = [];
  let currentDisplayData = [];
  let isEditing = false;
  
  // Pagination State
  let currentPage = 1;
  const ITEMS_PER_PAGE = 10;

  // API Base URL
  const API_URL = '/api/components';

  // Translation Icon
  const translateIcon = '<i class="fa-solid fa-wand-magic-sparkles"></i>';

  // Apply initially saved language
  setLanguage(currentLang);

  // Event Listeners
  form.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', handleSearch);
  
  btnEn.addEventListener('click', () => setLanguage('en'));
  btnEs.addEventListener('click', () => setLanguage('es'));

  // Edit Modal Listeners
  editForm.addEventListener('submit', handleEditSubmit);
  closeEditBtn.addEventListener('click', closeEditModal);
  cancelEditBtn.addEventListener('click', closeEditModal);
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderComponents(currentDisplayData);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(currentDisplayData.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderComponents(currentDisplayData);
    }
  });

  // Auto-translation listeners removed - now handled on submit for better UX

  // Fetch components from API
  async function fetchComponents() {
    showLoading();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      components = await response.json();
      currentDisplayData = [...components];
      currentPage = 1;
      renderComponents(currentDisplayData);
    } catch (error) {
      console.error('Error fetching components:', error);
      showError('Failed to load components. Please try again.');
      hideLoading();
    }
  }

  // Render components to the grid
  function renderComponents(data) {
    hideLoading();
    
    if (data.length === 0) {
      componentsGrid.classList.add('hidden');
      paginationControls.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    componentsGrid.classList.remove('hidden');
    componentsGrid.innerHTML = '';

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pagedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    pagedData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'component-card';
      
      const stockClass = item.quantity < 5 ? 'stock-low' : '';
      const stockText = item.quantity === 0 ? translations[currentLang].stockOut : `${item.quantity} ${translations[currentLang].stockIn}`;
      
      const descKey = currentLang === 'en' ? 'description_en' : 'description_es';
      const displayDesc = item[descKey] ? escapeHTML(item[descKey]) : translations[currentLang].noDesc;
      const t = translations[currentLang];
      const displayCategory = t['cat' + item.category] || item.category;

      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${escapeHTML(item.name)}</h3>
          <span class="card-category">${escapeHTML(displayCategory)}</span>
        </div>
        <div class="card-price">$${Number(item.price).toFixed(2)}</div>
        <div class="card-stock ${stockClass}">${stockText}</div>
        <div class="card-desc">${displayDesc}</div>
        <div class="card-actions">
          <button class="btn btn-edit edit-btn" data-id="${item.id}">
            <i class="fa-solid fa-pen"></i> <span data-i18n="btnEdit">${t.btnEdit}</span>
          </button>
          <button class="btn btn-danger delete-btn" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i> <span data-i18n="btnDelete">${t.btnDelete}</span>
          </button>
        </div>
      `;
      componentsGrid.appendChild(card);
    });

    // Update Pagination UI
    if (data.length > ITEMS_PER_PAGE) {
      paginationControls.classList.remove('hidden');
      const pageText = translations[currentLang].pageOf.replace('{0}', currentPage).replace('{1}', totalPages);
      pageIndicator.textContent = pageText;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
    } else {
      paginationControls.classList.add('hidden');
    }

    // Add event listeners to newly created buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editComponent(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteComponent(btn.dataset.id));
    });
  }

  // Handle Form Submit (Create or Update)
  async function handleFormSubmit(e) {
    e.preventDefault();
    hideMessages();

    // Automatic Translation Logic
    const descValue = descInput.value.trim();
    let description_en = '';
    let description_es = '';

    if (descValue) {
      setBtnLoading(submitBtn, true);
      const isEn = currentLang === 'en';
      description_en = isEn ? descValue : await translateText(descValue, 'es', 'en');
      description_es = isEn ? await translateText(descValue, 'en', 'es') : descValue;
    }

    const componentData = {
      name: nameInput.value,
      category: categoryInput.value,
      price: priceInput.value,
      quantity: quantityInput.value,
      description_en,
      description_es
    };

    try {
      let url = API_URL;
      let method = 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(componentData)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Operation failed');

      showSuccess(translations[currentLang].msgAdded);
      resetForm();
      fetchComponents();

    } catch (error) {
      console.error('Submit Error:', error);
      showError(error.message);
    } finally {
      setBtnLoading(submitBtn, false);
    }
  }

  // Handle Edit Form Submit
  async function handleEditSubmit(e) {
    e.preventDefault();
    hideMessages();

    // Automatic Translation Logic
    const descValue = editDescInput.value.trim();
    let description_en = '';
    let description_es = '';

    const editSubmitBtn = editForm.querySelector('button[type="submit"]');

    if (descValue) {
      setBtnLoading(editSubmitBtn, true);
      const isEn = currentLang === 'en';
      description_en = isEn ? descValue : await translateText(descValue, 'es', 'en');
      description_es = isEn ? await translateText(descValue, 'en', 'es') : descValue;
    }

    const componentData = {
      name: editNameInput.value,
      category: editCategoryInput.value,
      price: editPriceInput.value,
      quantity: editQuantityInput.value,
      description_en,
      description_es
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(componentData)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Update failed');
      }

      showSuccess(translations[currentLang].msgUpdated);
      closeEditModal();
      fetchComponents();
    } catch (error) {
      console.error('Update Error:', error);
      showError(error.message);
    } finally {
      setBtnLoading(editSubmitBtn, false);
    }
  }

  // Prepare form for editing (Open Modal)
  function editComponent(id) {
    const component = components.find(c => c.id == id);
    if (!component) return;

    editIdInput.value = component.id;
    editNameInput.value = component.name;
    editCategoryInput.value = component.category;
    editPriceInput.value = component.price;
    editQuantityInput.value = component.quantity;
    const descKey = currentLang === 'en' ? 'description_en' : 'description_es';
    editDescInput.value = component[descKey] || '';

    editModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeEditModal() {
    editModal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
    editForm.reset();
  }

  // Delete Component
  async function deleteComponent(id) {
    if (!confirm(translations[currentLang].msgConfirm)) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete');
      }

      showSuccess(translations[currentLang].msgDeleted);
      fetchComponents();
    } catch (error) {
      console.error('Delete Error:', error);
      showError(error.message);
    }
  }

  // Search/Filter function
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
      currentDisplayData = [...components];
    } else {
      currentDisplayData = components.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.category.toLowerCase().includes(searchTerm) ||
        (c.description_en && c.description_en.toLowerCase().includes(searchTerm)) ||
        (c.description_es && c.description_es.toLowerCase().includes(searchTerm))
      );
    }

    currentPage = 1; // Reset to first page on search
    renderComponents(currentDisplayData);
  }

  // Utility Functions
  function resetForm() {
    form.reset();
    isEditing = false;
    const t = translations[currentLang];
    formTitle.textContent = t.formTitleAdd;
    submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> <span data-i18n="btnAdd">${t.btnAdd}</span>`;
  }

  function showLoading() {
    loadingState.classList.remove('hidden');
    componentsGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
  }

  function hideLoading() {
    loadingState.classList.add('hidden');
  }

  function showSuccess(msg) {
    successMsg.textContent = msg;
    successMsg.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 3000);
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    successMsg.classList.add('hidden');
  }

  function hideMessages() {
    errorMsg.classList.add('hidden');
    successMsg.classList.add('hidden');
  }

  async function autoTranslate(sourceEl, targetEl, from, to) {
    // Legacy function - kept empty for compatibility if needed elsewhere
  }

  function setBtnLoading(btn, isLoading) {
    if (isLoading) {
      btn.dataset.originalContent = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ' + (currentLang === 'en' ? 'Translating...' : 'Traduciendo...');
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalContent;
      btn.disabled = false;
    }
  }

  async function translateText(text, from, to) {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const data = await response.json();
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
    } catch (error) {
      return null;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Language translation runner
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('inp_lang', lang);

    // Update active button state
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    } else {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    }

    const t = translations[lang];

    // Traverse all DOM elements looking for data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key]; // innerHTML supports nested span for required asterisks
      }
    });

    // Replace placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Re-render components grids safely to reflect translation
    if (components.length === 0) {
      fetchComponents(); // Fetch initial data if not yet loaded
    } else {
      renderComponents(currentDisplayData); 
    }
  }

});
