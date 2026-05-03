const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDbConnection } = require('./db/database');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/components', itemRoutes);

// Database Initialization & Server Start
async function startServer() {
  try {
    const db = await getDbConnection();
    // make db accessible in routes
    app.locals.db = db;
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
