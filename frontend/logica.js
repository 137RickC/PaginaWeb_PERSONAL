//MENÚ RESPONSIVE
document.addEventListener('DOMContentLoaded', function() {
    // Crear botón de menú móvil
    createMobileMenu();
    
    // Validación de formulario de contacto (Funcionalidad 2)
    setupContactForm();
    
    // Cargar mensajes si estamos en admin
    checkAdminSession();
    
    // Animación para las tarjetas
    animateCards();
});

function createMobileMenu() {
    const nav = document.querySelector('nav');
    const navMenu = document.querySelector('.nav-menu');
    
    // Crear botón de hamburguesa
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    // Insertar antes del menú
    nav.insertBefore(menuToggle, navMenu);
    
    // Añadir evento de clic
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}
//Formulario de contacto
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Mostrar mensaje de éxito
            showMessage('¡Mensaje enviado correctamente!', 'success');
            
            // Aquí normalmente enviaríamos los datos al servidor
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simular envío al servidor
            sendToServer(formData);
            
            // Limpiar formulario
            contactForm.reset();
        }
    });
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
}

function validateForm() {
    let isValid = true;
    
    // Validar cada campo
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    if (!validateField(name)) isValid = false;
    if (!validateField(email)) isValid = false;
    if (!validateField(message)) isValid = false;
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorId = field.id + 'Error';
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    // Limpiar error anterior
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    field.style.borderColor = '#ddd';
    
    // Validaciones específicas
    if (field.hasAttribute('required') && value === '') {
        showError(field, errorElement, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, errorElement, 'Email no válido');
            return false;
        }
    }
    
    if (field.id === 'message' && value.length < 10) {
        showError(field, errorElement, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    }
    
    return true;
}

function showError(field, errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    field.style.borderColor = '#e74c3c';
}

function clearError(e) {
    const field = e.target;
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        field.style.borderColor = '#ddd';
    }
}

function showMessage(message, type) {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    .menu-toggle {
        display: none;
        flex-direction: column;
        cursor: pointer;
        padding: 5px;
    }
    .menu-toggle span {
        width: 25px;
        height: 3px;
        background: white;
        margin: 3px 0;
        transition: 0.3s;
    }
    @media (max-width: 768px) {
        .menu-toggle {
            display: flex;
        }
        .nav-menu {
            display: none;
            flex-direction: column;
            width: 100%;
            position: absolute;
            top: 100%;
            left: 0;
            background: #1e3c72;
            padding: 1rem 0;
        }
        .nav-menu.active {
            display: flex;
        }
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);

//FUNCIONALIDAD ADMIN
function checkAdminSession() {
    const adminPage = document.getElementById('adminPassword');
    if (!adminPage) return;
    
    // Verificar si ya está logueado
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        document.querySelector('.login-section').style.display = 'none';
        document.querySelector('.messages-section').style.display = 'block';
        loadMessages();
    }
}

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.querySelector('.error-message');
    
    // Contraseña simple
    if (password === 'admin123') {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.querySelector('.login-section').style.display = 'none';
        document.querySelector('.messages-section').style.display = 'block';
        loadMessages();
    } else {
        errorElement.textContent = 'Contraseña incorrecta';
        errorElement.style.display = 'block';
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('adminLoggedIn');
    document.querySelector('.login-section').style.display = 'block';
    document.querySelector('.messages-section').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

async function loadMessages() {
    try {
        // Obtener mensajes del servidor
        const response = await fetch('http://localhost:8000/messages');
        const messages = await response.json();
        
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;
        
        messagesList.innerHTML = '';
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<p>No hay mensajes recibidos.</p>';
            return;
        }
        
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-item';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-name">${msg.name}</span>
                    <span class="message-date">${msg.created_at}</span>
                </div>
                <div class="message-email"><strong>Email:</strong> ${msg.email}</div>
                <div class="message-subject"><strong>Asunto:</strong> ${msg.subject}</div>
                <div class="message-content">${msg.message}</div>
            `;
            messagesList.appendChild(messageDiv);
        });
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        // Mostrar mensajes de ejemplo si el servidor no está disponible
        loadMessagees();
    }
}

async function loadMessages() {
    try {
        const messagesList = document.getElementById('messagesList');
        const messageCount = document.getElementById('messageCount');
        
        if (!messagesList || !messageCount) return;
        
        // Mostrar mensaje de carga
        messagesList.innerHTML = '<p class="loading">🔄 Cargando mensajes de la base de datos...</p>';
        
        // 1. Hacer petición GET al servidor para obtener mensajes REALES
        const response = await fetch('http://localhost:8000/messages');
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        
        // 2. Convertir respuesta a JSON (mensajes REALES de la BD)
        const messages = await response.json();
        
        console.log('✅ Mensajes cargados desde base de datos:', messages);
        
        // 3. Actualizar contador
        messageCount.textContent = messages.length;
        
        // 4. Mostrar mensajes o mensaje vacío
        if (messages.length === 0) {
            messagesList.innerHTML = `
                <div class="no-messages">
                    <h3>📭 No hay mensajes en la base de datos</h3>
                    <p>Aún no se han recibido mensajes a través del formulario de contacto.</p>
                    <p>Envía un mensaje desde <a href="/contact">la página de contacto</a> para verlo aquí.</p>
                </div>
            `;
            return;
        }
        
        // 5. Crear HTML para cada mensaje REAL
        messagesList.innerHTML = '';
        messages.forEach((msg, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-item';
            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="message-name">${msg.name || 'Anónimo'}</span>
                    <span class="message-date">${msg.created_at || 'Sin fecha'}</span>
                </div>
                <div class="message-email">📧 <strong>Email:</strong> ${msg.email || 'No proporcionado'}</div>
                <div class="message-subject">📌 <strong>Asunto:</strong> ${msg.subject || 'Sin asunto'}</div>
                <div class="message-content">
                    <strong>Mensaje:</strong><br>
                    ${msg.message || 'Sin contenido'}
                </div>
                <div class="message-id"><small>ID: ${msg.id || index + 1}</small></div>
            `;
            messagesList.appendChild(messageDiv);
        });
        
    } catch (error) {
        console.error('Error cargando mensajes:', error);
        
        // MOSTRAR ERROR al usuario
        const messagesList = document.getElementById('messagesList');
        if (messagesList) {
            messagesList.innerHTML = `
                <div class="error-message">
                    <h3>Error al conectar con el servidor</h3>
                    <p><strong>Detalles:</strong> ${error.message}</p>
                    <p><strong>Solución:</strong></p>
                    <ol>
                        <li>Asegúrate de que el servidor esté corriendo: <code>python backend/server.py</code></li>
                        <li>Verifica que la ruta <code>/messages</code> esté configurada en el servidor</li>
                        <li>Revisa la consola del navegador (F12) para más detalles</li>
                    </ol>
                </div>
            `;
        }
    }
}

//ANIMACIONES
function animateCards() {
    const cards = document.querySelectorAll('.info-card, .skill-item, .project-card, .service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

//SIMULACIÓN DE ENVÍO AL SERVIDOR
async function sendToServer(formData) {
    try {
        const response = await fetch('http://localhost:8000/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        
        return await response.json();
    } catch (error) {
        console.log('Nota: El servidor no está corriendo. En un entorno real, esto enviaría los datos.');
        // En desarrollo, simulamos éxito
        return { success: true, message: 'Mensaje recibido (modo simulación)' };
    }
}

//FUNCIONES GLOBALES PARA HTML
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;