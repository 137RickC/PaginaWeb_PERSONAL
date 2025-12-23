import http.server
import socketserver
import json
import sqlite3
import datetime
from urllib.parse import urlparse, parse_qs
import os
import sys

# Configuración
PORT = 8000
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))  # Directorio backend
ROOT_DIR = os.path.dirname(PROJECT_DIR)  # Directorio raíz del proyecto
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend')
DB_FILE = os.path.join(ROOT_DIR, 'database', 'messages.db')

print(f" Directorio raíz: {ROOT_DIR}")
print(f" Frontend: {FRONTEND_DIR}")
print(f" Base de datos: {DB_FILE}")

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    """Manejador personalizado para el portafolio"""
    
    def translate_path(self, path):
        """Sobreescribir para redirigir todas las peticiones a frontend/"""
        # Primero, limpiar la ruta
        path = path.split('?', 1)[0]
        path = path.split('#', 1)[0]
        
        # Si la ruta empieza con /frontend/, quitarlo
        if path.startswith('/frontend/'):
            path = path[len('/frontend/'):]
        
        # Si es la raíz, servir index.html
        if path == '/' or path == '':
            path = 'index.html'
        # Si es una ruta como /about, añadir .html
        elif not path.endswith('.html') and not path.endswith('.css') and not path.endswith('.js'):
            if not '.' in path:  # Si no tiene extensión
                path = path + '.html'
        
        print(f"[TRANSFORM] {self.path} -> {path}")
        
        # Construir la ruta completa en frontend/
        full_path = os.path.join(FRONTEND_DIR, path)
        
        # Verificar si existe
        if os.path.exists(full_path):
            print(f"[FOUND] {full_path}")
            return full_path
        else:
            print(f"[NOT FOUND] {full_path}")
            return super().translate_path(path)
    
    def do_GET(self):
        """Manejar solicitudes GET"""
        print(f"\n[GET] {self.path}")
        
        # Mapeo de rutas a archivos
        route_mapping = {
            '/': 'index.html',
            '/index': 'index.html',
            '/index.html': 'index.html',
            '/about': 'about.html',
            '/about.html': 'about.html',
            '/portfolio': 'portfolio.html',
            '/portfolio.html': 'portfolio.html',
            '/services': 'services.html',
            '/services.html': 'services.html',
            '/contact': 'contact.html',
            '/contact.html': 'contact.html',
            '/admin': 'admin.html',
            '/admin.html': 'admin.html',
            '/css/style.css': 'css/style.css',
            '/js/logica.js': 'js/logica.js'
        }
        
        # Rutas API
        if self.path == '/messages':
            self.handle_get_messages()
            return
        
        # Buscar en el mapeo
        if self.path in route_mapping:
            file_to_serve = route_mapping[self.path]
            full_path = os.path.join(FRONTEND_DIR, file_to_serve)
            
            if os.path.exists(full_path):
                self.serve_file(full_path)
                return
        
        # Si no está en el mapeo, usar translate_path
        super().do_GET()
    
    def serve_file(self, filepath):
        """Servir un archivo específico"""
        try:
            print(f"[SERVE] Sirviendo: {filepath}")
            
            # Determinar tipo de contenido
            if filepath.endswith('.css'):
                content_type = 'text/css'
            elif filepath.endswith('.js'):
                content_type = 'application/javascript'
            elif filepath.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif filepath.endswith('.png'):
                content_type = 'image/png'
            elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
                content_type = 'image/jpeg'
            else:
                content_type = 'text/plain'
            
            # Leer y servir el archivo
            with open(filepath, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
            
        except FileNotFoundError:
            print(f"[ERROR] Archivo no encontrado: {filepath}")
            self.send_error(404, f"Archivo no encontrado: {os.path.basename(filepath)}")
        except Exception as e:
            print(f"[ERROR] {str(e)}")
            self.send_error(500, f"Error interno: {str(e)}")
    
    def do_POST(self):
        """Manejar solicitudes POST"""
        print(f"\n[POST] {self.path}")
        
        if self.path == '/contact':
            self.handle_contact_form()
        else:
            self.send_error(404, f"Ruta no encontrada: {self.path}")
    
    def handle_contact_form(self):
        """Procesar formulario de contacto"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            data = json.loads(post_data.decode('utf-8'))
            
            print(f"[CONTACT] Datos recibidos: {data}")
            
            # Validar campos requeridos
            required = ['name', 'email', 'message']
            for field in required:
                if field not in data or not str(data[field]).strip():
                    self.send_error(400, f"Campo requerido faltante: {field}")
                    return
            
            # Guardar en base de datos
            self.save_message(data)
            
            # Responder éxito
            self.send_json_response({
                'success': True,
                'message': 'Mensaje recibido correctamente'
            })
            
        except json.JSONDecodeError:
            self.send_error(400, "JSON inválido")
        except Exception as e:
            print(f"[ERROR] {str(e)}")
            self.send_error(500, f"Error interno: {str(e)}")
    
    def handle_get_messages(self):
        """Obtener todos los mensajes"""
        try:
            messages = self.get_messages()
            self.send_json_response(messages)
        except Exception as e:
            self.send_error(500, f"Error al obtener mensajes: {str(e)}")
    
    def save_message(self, data):
        """Guardar mensaje en SQLite"""
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO messages (name, email, subject, message, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['email'],
            data.get('subject', 'Sin asunto'),
            data['message'],
            datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
        
        conn.commit()
        conn.close()
        print(f"[DB] Mensaje guardado: {data['name']}")
    
    def get_messages(self):
        """Obtener mensajes de SQLite"""
        try:
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, name, email, subject, message, 
                       strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
                FROM messages 
                ORDER BY created_at DESC
            ''')
            
            messages = []
            for row in cursor.fetchall():
                messages.append(dict(row))
            
            conn.close()
            print(f"[DB] {len(messages)} mensajes recuperados")
            return messages
        except Exception as e:
            print(f"[DB ERROR] {str(e)}")
            return []
    
    def send_json_response(self, data):
        """Enviar respuesta JSON"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        """Mostrar logs personalizados"""
        # No mostrar logs de acceso estándar, solo los nuestros
        pass

def init_database():
    """Inicializar la base de datos SQLite"""
    # Crear directorio database si no existe
    db_dir = os.path.dirname(DB_FILE)
    os.makedirs(db_dir, exist_ok=True)
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Crear tabla de mensajes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT DEFAULT 'Sin asunto',
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Verificar si hay datos de ejemplo
    cursor.execute('SELECT COUNT(*) FROM messages')
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Insertar mensajes de ejemplo
        sample_messages = [
            ('Profesor García', 'profesor.garcia@unsa.edu.pe', 
             'Excelente trabajo', 
             'Richard, tu proyecto final está muy bien estructurado. Felicitaciones por el esfuerzo.',
             '2024-01-10 09:30:00'),
            ('Compañero de clase', 'carlos.m@unsa.edu.pe', 
             'Colaboración en proyecto', 
             'Hola Richard, vi tu portafolio y me gustaría colaborar en el proyecto de bases de datos.',
             '2024-01-12 14:20:00'),
        ]
        
        cursor.executemany('''
            INSERT INTO messages (name, email, subject, message, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_messages)
        
        print("✓ Base de datos inicializada con mensajes de ejemplo")
    
    conn.commit()
    conn.close()
    print(f"✓ Base de datos: {DB_FILE}")

def check_files():
    """Verificar que existan los archivos necesarios"""
    print("\n🔍 Verificando archivos...")
    
    required_files = [
        ('index.html', os.path.join(FRONTEND_DIR, 'index.html')),
        ('about.html', os.path.join(FRONTEND_DIR, 'about.html')),
        ('portfolio.html', os.path.join(FRONTEND_DIR, 'portfolio.html')),
        ('services.html', os.path.join(FRONTEND_DIR, 'services.html')),
        ('contact.html', os.path.join(FRONTEND_DIR, 'contact.html')),
        ('admin.html', os.path.join(FRONTEND_DIR, 'admin.html')),
        ('style.css', os.path.join(FRONTEND_DIR, 'css', 'style.css')),
        ('logica.js', os.path.join(FRONTEND_DIR, 'js', 'logica.js'))
    ]
    
    all_ok = True
    for name, path in required_files:
        if os.path.exists(path):
            print(f"  ✓ {name}")
        else:
            print(f"  ✗ {name} - NO ENCONTRADO en: {path}")
            all_ok = False
    
    return all_ok

def main():
    """Función principal"""
    print("=" * 60)
    print("PORTAFOLIO PERSONAL - SERVIDOR BACKEND")
    print("=" * 60)
    
    # Verificar archivos
    if not check_files():
        print("\n  ADVERTENCIA: Faltan algunos archivos")
        print("   El servidor puede no funcionar correctamente")
    
    # Inicializar base de datos
    print("\n Inicializando base de datos...")
    init_database()
    
    # Cambiar al directorio frontend para que SimpleHTTPRequestHandler funcione
    os.chdir(FRONTEND_DIR)
    
    print(f"\n Iniciando servidor en puerto {PORT}...")
    print("=" * 60)
    
    # Configurar y ejecutar servidor
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        print(f"\n SERVIDOR INICIADO CORRECTAMENTE")
        print(f" URL principal: http://localhost:{PORT}")
        print(f" Sirviendo archivos desde: {FRONTEND_DIR}")
        
        print("\n PÁGINAS DISPONIBLES:")
        print(f"   • http://localhost:{PORT}/          - Inicio")
        print(f"   • http://localhost:{PORT}/about     - Sobre Mí")
        print(f"   • http://localhost:{PORT}/portfolio - Portafolio")
        print(f"   • http://localhost:{PORT}/services  - Servicios")
        print(f"   • http://localhost:{PORT}/contact   - Contacto")
        print(f"   • http://localhost:{PORT}/admin     - Admin")
        
        print(f"\n API ENDPOINTS:")
        print(f"   • http://localhost:{PORT}/messages  - GET mensajes")
        print(f"   • http://localhost:{PORT}/contact   - POST formulario")
        
        print(f"\n  SOLUCIÓN DE PROBLEMAS:")
        print(f"   • Error 404: Verifica que los archivos estén en {FRONTEND_DIR}/")
        print(f"   • CSS/JS no cargan: Verifica rutas en HTML")
        print(f"   • Formulario no funciona: Revisa consola del navegador (F12)")
        
        print(f"\n Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Servidor detenido.")
            print("=" * 60)

if __name__ == "__main__":
    main()