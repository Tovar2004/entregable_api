# 🛸 Rick & Morty App

Aplicación web desarrollada en React que consume la API pública de [Rick and Morty](https://rickandmortyapi.com/) y permite explorar los personajes de la serie de forma visual e interactiva.

---

## 🚀 Demo en producción

🔗 [https://entregable-api.vercel.app](https://entregable-api.vercel.app)

---

## 📸 Características

- 🌍 Página de inicio con personajes flotando animados
- 🚀 Cursor cohete con rastro de humo
- 🧑‍🚀 Listado completo de personajes con paginación
- 🔬 Filtrado de personajes por especie
- 🃏 Tarjetas interactivas con animaciones al hover
- 📋 Modal detallado al hacer clic en un personaje
- 📱 Diseño completamente responsivo (móvil, tablet, desktop)
- ⚠️ Manejo de estados de carga y errores
- 🚫 Página 404 personalizada

---

## 🛠️ Tecnologías utilizadas

- [React](https://react.dev/) — Framework de UI
- [Vite](https://vitejs.dev/) — Bundler y servidor de desarrollo
- [React Router DOM](https://reactrouter.com/) — Navegación entre vistas
- [Rick and Morty API](https://rickandmortyapi.com/) — API REST pública
- CSS personalizado — Estilos y animaciones

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── CharacterCard.jsx     # Tarjeta de personaje
│   ├── CharacterModal.jsx    # Modal con detalle del personaje
│   ├── FilterDropdown.jsx    # Dropdown para filtrar por especie
│   ├── Loader.jsx            # Indicador de carga
│   └── Navbar.jsx            # Barra de navegación
├── hooks/
│   └── useCharacters.js      # Custom hook para consumir la API
├── pages/
│   ├── Characters.jsx        # Página de todos los personajes
│   ├── ErrorPage.jsx         # Página 404
│   └── Home.jsx              # Página de inicio animada
├── services/
│   └── api.js                # Funciones de consumo de la API
├── styles/
│   ├── CharacterCard.css
│   ├── CharacterModal.css
│   ├── Characters.css
│   ├── ErrorPage.css
│   ├── FilterDropdown.css
│   ├── Home.css
│   ├── Loader.css
│   └── Navbar.css
├── App.jsx                   # Configuración de rutas
├── App.css                   # Estilos globales
└── main.jsx                  # Punto de entrada
```

---

## ⚙️ Instalación y ejecución local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Pasos

**1. Clona el repositorio:**
```bash
git clone https://github.com/Tovar2004/entregable_api.git
```

**2. Entra a la carpeta del proyecto:**
```bash
cd entregable_api
```

**3. Instala las dependencias:**
```bash
npm install
```

**4. Inicia el servidor de desarrollo:**
```bash
npm run dev
```

**5. Abre en tu navegador:**
```
http://localhost:5173
```

---

## 📦 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la build de producción |

---

## 🌐 Deploy en Vercel

El proyecto está desplegado automáticamente desde el repositorio de GitHub.

Cada `git push` a la rama `main` genera un nuevo deploy automático en Vercel.

```bash
git add .
git commit -m "descripción del cambio"
git push
```

---

## 📡 API utilizada

Base URL: `https://rickandmortyapi.com/api`

| Endpoint | Descripción |
|----------|-------------|
| `/character` | Lista de personajes paginada |
| `/character?page=2` | Paginación |
| `/character?species=Human` | Filtrado por especie |
| `/character/1,2,3` | Múltiples personajes por ID |

---

## 👨‍💻 Autor

Desarrollado como entrega académica para el curso de Programación Web.

Repositorio: [https://github.com/Tovar2004/entregable_api](https://github.com/Tovar2004/entregable_api)
