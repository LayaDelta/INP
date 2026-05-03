# INP - Inventario de Componentes de PC

## 📖 Descripción General
**INP** (Inventory Manager) es una aplicación web de ciclo completo (Full-Stack) diseñada para la gestión, control y registro de componentes de computadoras. 

El proyecto implementa operaciones **CRUD** (Crear, Leer, Actualizar, Borrar) y cuenta con una arquitectura dividida donde un backend en **Node.js + Express** despacha datos en formato JSON a través de una base de datos relacional ligera **SQLite**, que es consumida interactivamente por un Frontend nativo implementado con **Vanilla HTML, JS y CSS**. El diseño destaca por un elegante acabado premium *"Glassmorphism"*, responsividad en todo momento y modo súper oscuro enfocado en hardware.

---

## 🛠️ Stack Tecnológico
* **Backend:** Node.js, Express.js.
* **Base de Datos:** SQLite (`sqlite3` y paquete wrapper de promesas `sqlite`).
* **Frontend:** HTML5 semántico, Vanilla JavaScript (con promesas a la Fetch API), CSS3 nativo (CSS Variables, Flexbox, y CSS Grid).
* **Fuentes e Iconos:** Fuente oficial *Inter* de Google Fonts y set de iconos de *FontAwesome*.

---

## 📂 Arquitectura de Archivos y Carpetas

La arquitectura del proyecto sigue el popular estándar de separación de capas lógicas:

```text
INP/
├── package.json               # Dependencias del proyecto y metadatos
├── server.js                  # Punto de entrada y configuración del servidor Express
├── db/
│   ├── database.js            # Configuración de SQLite, SQL de Tablas, y Auto-Populación
│   └── inventory.db           # Base de datos relacional (Generada Automáticamente)
├── controllers/
│   └── itemController.js      # Lógica de negocio CRUD (Funciones Request-Response)
├── routes/
│   └── itemRoutes.js          # Punto de anclaje de un enrutador Express a los endpoints (/api/components)
├── utils/
│   └── validators.js          # Helpers de validación para proteger el servidor
└── public/                    # Vistas y estáticos del Frontend
    ├── index.html             # UI de la Aplicación y Estructura Principal
    ├── css/
    │   └── style.css          # Reglas UI tipo "Glassmorphism", CSS Variables y Animaciones.
    └── js/
        └── main.js            # Frontend DOM API y lógica asíncrona ligada a los Endpoints.
```

---

## ⚙️ Características y Lógica Destacada

### 1. Robustez del Backend (Sistema de Validaciones)
El servidor jamás sucumbe ante inputs incorrectos del usuario. El código implementado en `utils/validators.js` inspecciona estrictamente:
- **Campos en Blanco:** Se rechazan peticiones con espacios vacíos.
- **Campos Negativos o Tipos Corruptos:** Las variables numéricas como inventario o precio son convertidas y sanitizadas.
- **Reales vs Falsos (Hardware Exclusivo):** Existe un riguroso regex/control interno que verifica que el título contenga obligatoriamente una marca madre existente registrada en el espectro internacional de PC (ej. *Intel, AMD, NVIDIA, Corsair, ASUS, MSI, Gigabyte*, etc.), rechazando productos genéricos para garantizar la pureza del inventario.

### 2. Auto-Populación Inteligente (Seeding)
Para fines de prueba inmediatos, al detectar que la base de datos `inventory.db` es nueva o está vacía, `database.js` procede a insertar instantáneamente **100 artículos** configurados con precios e inventario verosímil y nombres técnicos aleatorios.

### 3. Paginación y Filtrado del Client-Side
Se aplican filtros instantáneos que no colapsan el servidor en cada escritura del usuario, debido a la delegación de búsquedas y paginado por bloques de 10 unidades completamente lideradas por JavaScript puro del Frontend, ofreciendo la experiencia de una verdadera Single-Page Application (SPA). Efectos de paginado fluidos integrados nativamente. 

### 4. Estética de Diseño UX Premium (Glassmorphism + Dark Mode)
En vez del clásico aspecto rústico y aburrido, la aplicación emplea componentes translúcidos (*backdrop-filter* de CSS) superpuestos sobre nodos de degradados radiales dinámicos. Las flechas nativas anti-estéticas de los inputs son eliminadas o sustituidas por iconos SVGs customizados en `style.css`. La barra lateral de formulario se ajusta contextualmente usando `align-self` y rastreo `sticky` para adherirse fluidamente a la parte superior cuando se hace scroll.

---

## 🗄️ Esquema de la Base de Datos

Tabla principal: `components`

| Columna       | Tipo                            | Reglas                             |
| ------------- |---------------------------------|----------------------------------- |
| `id`          | `INTEGER`                       | `PRIMARY KEY AUTOINCREMENT`        |
| `name`        | `TEXT`                          | `NOT NULL`                         |
| `category`    | `TEXT`                          | `NOT NULL`                         |
| `quantity`    | `INTEGER`                       | `DEFAULT 0`                        |
| `price`       | `REAL`                          | `NOT NULL`                         |
| `description` | `TEXT`                          | *(Opcional)*                       |

---

## 🚀 Despliegue Exitoso (Servidor Local)

Para arrancar esta aplicación en cualquier otra máquina desde cero o tras descargar su resguardo, los pasos son los siguientes:

1. **Abre tu Terminal** (CMD, Powershell o Bash) ubicada dentro del directorio `INP`.
2. **Descarga dependencias de NPM** (Express, SQLite, CORS):
   ```bash
   npm install
   ```
3. **Inicia del Servicio local:**
   ```bash
   node server.js
   ```
   *(Observarás el Output de confirmación: `Server is running on http://localhost:3000` e imprimirá la confirmación de seeding local si es la primera vez).*
4. Ingresa a tu navegador a través de **http://localhost:3000** y disfruta de la aplicación terminada.
