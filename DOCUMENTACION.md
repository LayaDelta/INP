# INP - Inventario Pro de Componentes de PC (Bilingüe + IA)

## 📖 Descripción General
**INP** es una plataforma de gestión de inventario para hardware de alto rendimiento. Esta aplicación Full-Stack destaca por su enfoque internacional, permitiendo gestionar existencias en **Inglés y Español** de forma simultánea. 

Gracias a la integración de inteligencia artificial para traducciones y una interfaz inspirada en el minimalismo moderno (*Glassmorphism*), INP ofrece una experiencia de usuario fluida, rápida y profesional.

---

## 🛠️ Stack Tecnológico
*   **Backend:** Node.js 20 LTS, Express.js.
*   **Base de Datos:** SQLite v2 (`inventory_v2.db`) para máxima portabilidad y rendimiento ligero.
*   **Inteligencia Artificial:** Integración de la API MyMemory para traducción automática de descripciones en tiempo real.
*   **Frontend:** Vanilla Architecture (HTML5, JS, CSS3) con enfoque en Single-Page Application (SPA).
*   **Estética:** Google Fonts (Inter), FontAwesome 6, y efectos avanzados de desenfoque y graduado radial.

---

## 🌟 Funcionalidades Premium

### 1. Sistema Bilingüe Nativo (EN/ES)
La aplicación no solo traduce la interfaz, sino que gestiona contenido bilingüe real. Cada componente almacena descripciones independientes para inglés y español en la base de datos, asegurando que tu catálogo sea profesional en ambos idiomas.

### 2. Traducción Automática por IA
¡Escribe una sola vez! Al añadir o editar un componente, la aplicación detecta el idioma actual y traduce automáticamente la descripción al idioma opuesto en segundo plano. Incluye estados de carga visuales y manejo de errores.

### 3. Modal de Edición "Focus Mode"
Hemos separado la creación de la edición. Al editar, se activa un modal con efecto *Glassmorphism* y desenfoque de fondo que permite concentrarte en los cambios del producto sin perder el contexto de tu inventario.

### 4. Base de Datos v2 con Catálogo Expandido
El sistema incluye una base de datos auto-generada con **25 productos reales** de alta gama (CPUs, GPUs, periféricos de última generación) para que el inventario se vea poblado y profesional desde el despliegue inicial.

### 5. Estética y Animaciones
*   **Glassmorphism:** Paneles traslúcidos con bordes brillantes.
*   **Micro-interacciones:** Animaciones `pop-in` para modales y efectos de elevación en tarjetas.
*   **Responsive Pro:** Optimizado para monitores ultrawide y dispositivos móviles.

---

## 📂 Arquitectura de Archivos
```text
INP/
├── server.js                  # Servidor Express y despacho de estáticos
├── db/
│   ├── database.js            # Lógica de creación, migración v2 y seeding bilingüe
│   └── inventory_v2.db        # Base de datos activa (SQLite)
├── controllers/
│   └── itemController.js      # Lógica CRUD compatible con campos bilingües
├── public/                    # Frontend SPA
│   ├── index.html             # UI con sistema de modales y contenedores bilingües
│   ├── css/style.css          # Diseño premium, variables CSS y animaciones
│   └── js/main.js             # Motor de traducción, gestión de DOM e i18n
├── .nvmrc                     # Versión de Node.js fijada (v20)
└── package.json               # Configuración de dependencias compatibles con Render (Linux)
```

---

## 🗄️ Esquema de Datos (v2)

Tabla: `components`

| Columna | Tipo | Función |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Clave primaria autoincremental |
| `name` | `TEXT` | Nombre técnico verificado (Marca/Modelo) |
| `category` | `TEXT` | Categoría de hardware (CPU, GPU, RAM, etc.) |
| `quantity` | `INTEGER` | Nivel de stock actual |
| `price` | `REAL` | Precio unitario en USD |
| `description_en` | `TEXT` | Descripción extendida en Inglés |
| `description_es` | `TEXT` | Descripción extendida en Español |

---

## 🚀 Despliegue en la Nube (Render.com)

El proyecto está pre-configurado para desplegarse en Render en menos de 5 minutos:

1.  **Repo en GitHub:** Sube tu código (`git push origin main`).
2.  **Web Service en Render:**
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
3.  **Variables de Entorno (Settings):**
    *   `NODE_VERSION`: `20`
    *   `NODE_ENV`: `production`

---

## 💻 Ejecución Local
1. Instalar: `npm install`
2. Ejecutar: `npm run dev`
3. Acceder: `http://localhost:3000`

---
**Desarrollado por Juan - Delta DevWeb S.A.D**
*"Hardware management, redefined."*
