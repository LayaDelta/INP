document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('component-form');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const searchInput = document.getElementById('search-input');
  
  const componentsGrid = document.getElementById('components-grid');
  const loadingState = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  
  const paginationControls = document.getElementById('pagination-controls');
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageIndicator = document.getElementById('page-indicator');
  
  const errorMsg = document.getElementById('error-message');
  const successMsg = document.getElementById('success-message');

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

  // Initialize
  fetchComponents();

  // Event Listeners
  form.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', handleSearch);
  
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
      const stockText = item.quantity === 0 ? 'Out of Stock' : `${item.quantity} in stock`;
      
      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${escapeHTML(item.name)}</h3>
          <span class="card-category">${escapeHTML(item.category)}</span>
        </div>
        <div class="card-price">$${Number(item.price).toFixed(2)}</div>
        <div class="card-stock ${stockClass}">${stockText}</div>
        <div class="card-desc">${escapeHTML(item.description || 'No description provided.')}</div>
        <div class="card-actions">
          <button class="btn btn-edit edit-btn" data-id="${item.id}">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn btn-danger delete-btn" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      `;
      componentsGrid.appendChild(card);
    });

    // Update Pagination UI
    if (data.length > ITEMS_PER_PAGE) {
      paginationControls.classList.remove('hidden');
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
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

    // Prepare data
    const componentData = {
      name: nameInput.value,
      category: categoryInput.value,
      price: priceInput.value,
      quantity: quantityInput.value,
      description: descInput.value
    };

    try {
      let url = API_URL;
      let method = 'POST';

      if (isEditing) {
        url = `${API_URL}/${idInput.value}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(componentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Operation failed');
      }

      showSuccess(isEditing ? 'Component updated successfully!' : 'Component added successfully!');
      resetForm();
      fetchComponents();

    } catch (error) {
      console.error('Submit Error:', error);
      showError(error.message);
    }
  }

  // Prepare form for editing
  function editComponent(id) {
    const component = components.find(c => c.id == id);
    if (!component) return;

    isEditing = true;
    formTitle.textContent = 'Edit Component';
    submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Update Component';
    cancelBtn.classList.remove('hidden');

    idInput.value = component.id;
    nameInput.value = component.name;
    categoryInput.value = component.category;
    priceInput.value = component.price;
    quantityInput.value = component.quantity;
    descInput.value = component.description || '';

    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  }

  // Delete Component
  async function deleteComponent(id) {
    if (!confirm('Are you sure you want to delete this component?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete');
      }

      showSuccess('Component deleted successfully');
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
        (c.description && c.description.toLowerCase().includes(searchTerm))
      );
    }

    currentPage = 1; // Reset to first page on search
    renderComponents(currentDisplayData);
  }

  // Utility Functions
  function resetForm() {
    form.reset();
    isEditing = false;
    idInput.value = '';
    formTitle.textContent = 'Add New Component';
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Component';
    cancelBtn.classList.add('hidden');
    // We do not hide messages here intentionally to let success stay briefly
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
});
