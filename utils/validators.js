const VALID_BRANDS = [
  'intel', 'amd', 'nvidia', 'asus', 'msi', 'gigabyte', 'corsair', 'kingston', 'crucial', 
  'wd', 'western digital', 'seagate', 'samsung', 'evga', 'sapphire', 'zotac', 'pny', 
  'nzxt', 'cooler master', 'thermaltake', 'be quiet', 'noctua', 'ryzen', 'geforce', 
  'radeon', 'g.skill', 'adata', 'teamgroup', 'asrock', 'palit', 'logitech', 'razer',
  'steelseries', 'hyperx', 'arctic', 'lian li', 'fractal', 'xfx', 'powercolor', 'inno3d'
];

// Validates if required fields for a component exist and have correct types
function validateComponentData(data) {
  const { name, category, price, quantity } = data;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'Name is required and must be a valid string.';
  }

  // Validate if it's a "real" component by checking for valid brands/lines
  const lowerName = name.toLowerCase();
  const isReal = VALID_BRANDS.some(brand => lowerName.includes(brand));
  if (!isReal) {
    return 'Component name must include a recognized real PC brand or model (e.g., AMD, Intel, NVIDIA, Corsair, ASUS, etc.).';
  }
  
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return 'Category is required and must be a valid string.';
  }
  
  if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return 'Price is required and must be a valid positive number.';
  }
  
  if (quantity !== undefined && (isNaN(parseInt(quantity)) || parseInt(quantity) < 0)) {
    return 'Quantity must be a valid non-negative integer.';
  }
  
  return null; // Return null if validation passes
}

module.exports = {
  validateComponentData
};
