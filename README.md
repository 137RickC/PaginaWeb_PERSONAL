# PaginaWeb_PERSONAL
Descripción
Aplicación web personal completa desarrollada como proyecto final de Introducción al Desarrollo Web. Implementa una arquitectura full-stack que integra frontend, backend y base de datos.

Características del Proyecto
Frontend (HTML + CSS)
5 páginas web completamente responsivas

Diseño moderno con CSS personalizado

Layouts adaptativos para diferentes dispositivos

Navegación intuitiva entre páginas

Frontend (JavaScript)
Menú responsivo dinámico - Se adapta a dispositivos móviles

Validación de formularios - En tiempo real con feedback visual

Animaciones CSS/JS - Efectos interactivos y transiciones

Manipulación del DOM - Carga dinámica de contenido

Backend (Python)
Servidor HTTP personalizado usando http.server

Manejo manual de rutas y formularios

API REST para comunicación frontend-backend

Procesamiento de solicitudes GET y POST

Base de Datos (SQLite)
Almacenamiento de mensajes del formulario de contacto

Consulta y visualización en página admin protegida

Datos persistentes entre sesiones

Estructura de tabla normalizada

Páginas Web Desarrolladas
index.html - Página principal con presentación personal

about.html - Información académica y personal

portfolio.html - Portafolio de proyectos desarrollados

services.html - Servicios ofrecidos

contact.html - Formulario de contacto funcional

admin.html - Panel de administración protegido

Tecnologías Utilizadas
Frontend
HTML5 (semántico y accesible)

CSS3 (Flexbox, Grid, animaciones)

JavaScript ES6+ (funcionalidades interactivas)

Backend
Python 3.x (http.server puro)

SQLite3 (base de datos embebida)

JSON (formato de intercambio de datos)

Herramientas
VS Code (editor de código)

Git & GitHub (control de versiones)

Responsive Design (mobile-first)

Instalación y Ejecución
Requisitos Previos
Python 3.7 o superior

Navegador web moderno

Git (opcional para clonar)
ESTRUTURA DEL PROYECTO
portafolio-personal/
├── frontend/                    # Archivos frontend
│   ├── css/
│   │   └── style.css          # Estilos principales
│   ├── js/
│   │   └── logica.js          # JavaScript con todas las funcionalidades
│   ├── index.html             # Página principal
│   ├── about.html             # Sobre mí
│   ├── portfolio.html         # Portafolio de proyectos
│   ├── services.html          # Servicios ofrecidos
│   ├── contact.html           # Formulario de contacto
│   └── admin.html             # Panel de administración
├── backend/
│   └── server.py              # Servidor Python completo
├── database/
│   └── messages.db            # Base de datos SQLite (se crea automáticamente)
├── docs/                      # Documentación
├── README.md                  # Este archivo
└── .gitignore                 # Archivos ignorados por Git
Funcionalidades JavaScript Detalladas
1. Menú Responsive
Botón hamburguesa en dispositivos móviles

Animación suave al abrir/cerrar

Cierre automático al seleccionar opción

2. Validación de Formulario
Validación en tiempo real

Mensajes de error específicos

Validación de email con regex

Longitud mínima de mensaje

3. Página Admin
Protección con contraseña simple

Almacenamiento en sessionStorage

Visualización de mensajes con formato

Logout seguro

4. Animaciones
Efectos al hacer scroll (Intersection Observer)

Transiciones suaves en hover

Mensajes flotantes de notificación
ESTRUCTURA DE LA TABLA MENSAGES
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT 'Sin asunto',
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
FLUJO DE LA APLICAION
Usuario visita sitio → Navega por páginas → Llena formulario 
→ JavaScript valida → Envía datos al servidor → Python procesa 
→ Guarda en SQLite → Admin ingresa con contraseña → Ve mensajes
DATOS
Desarrollado por: Richard Negron - Estudiante de Ingeniería de Sistemas
Universidad: Universidad Nacional de San Agustín (UNSA)
Año: 2024