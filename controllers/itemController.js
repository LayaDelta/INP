const { validateComponentData } = require('../utils/validators');

// Create Action
async function createComponent(req, res) {
  try {
    const error = validateComponentData(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const { name, category, quantity, price, description_en, description_es } = req.body;
    const db = req.app.locals.db;

    const result = await db.run(
      'INSERT INTO components (name, category, quantity, price, description_en, description_es) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name.trim(), 
        category.trim(), 
        parseInt(quantity || 0), 
        parseFloat(price), 
        description_en ? description_en.trim() : '',
        description_es ? description_es.trim() : ''
      ]
    );

    res.status(201).json({ id: result.lastID, message: 'Component created successfully' });
  } catch (err) {
    console.error('Error in createComponent:', err);
    res.status(500).json({ error: 'Internal server error while creating component.' });
  }
}

// Read Action (All)
async function getComponents(req, res) {
  try {
    const db = req.app.locals.db;
    const components = await db.all('SELECT * FROM components ORDER BY id DESC');
    res.status(200).json(components);
  } catch (err) {
    console.error('Error in getComponents:', err);
    res.status(500).json({ error: 'Internal server error while fetching components.' });
  }
}

// Read Action (Single)
async function getComponentById(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    const component = await db.get('SELECT * FROM components WHERE id = ?', [id]);
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.status(200).json(component);
  } catch (err) {
    console.error('Error in getComponentById:', err);
    res.status(500).json({ error: 'Internal server error while fetching component.' });
  }
}

// Update Action
async function updateComponent(req, res) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const component = await db.get('SELECT * FROM components WHERE id = ?', [id]);
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const error = validateComponentData(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const { name, category, quantity, price, description_en, description_es } = req.body;

    await db.run(
      'UPDATE components SET name = ?, category = ?, quantity = ?, price = ?, description_en = ?, description_es = ? WHERE id = ?',
      [
        name.trim(), 
        category.trim(), 
        parseInt(quantity || 0), 
        parseFloat(price), 
        description_en ? description_en.trim() : '', 
        description_es ? description_es.trim() : '',
        id
      ]
    );

    res.status(200).json({ message: 'Component updated successfully' });
  } catch (err) {
    console.error('Error in updateComponent:', err);
    res.status(500).json({ error: 'Internal server error while updating component.' });
  }
}

// Delete Action
async function deleteComponent(req, res) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const result = await db.run('DELETE FROM components WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.status(200).json({ message: 'Component deleted successfully' });
  } catch (err) {
    console.error('Error in deleteComponent:', err);
    res.status(500).json({ error: 'Internal server error while deleting component.' });
  }
}

module.exports = {
  createComponent,
  getComponents,
  getComponentById,
  updateComponent,
  deleteComponent
};
