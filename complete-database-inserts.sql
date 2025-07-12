-- =============================================
-- INSERTS COMPLETOS PARA MI-TIENDITA
-- Base de datos: PostgreSQL
-- =============================================

-- Limpiar tablas (opcional, ejecutar solo si quieres reiniciar)
-- TRUNCATE TABLE "Products" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "product_categories" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;

-- =============================================
-- 1. INSERTAR USUARIOS
-- =============================================

INSERT INTO users (nombres, apellidos, correo, contrasena, "nroDocumento", telefono, tipo, estado, "fechaRegistro", "createdAt", "updatedAt") VALUES
('Juan', 'Perez', 'juan.perez@gmail.com', '123456', '12345678', '987654321', 'cliente', 'activo', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Admin', 'Sistema', 'admin@mitiendita.com', '123456', '87654321', '123456789', 'admin', 'activo', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maria', 'Gonzales', 'maria@gmail.com', '123456', '11111111', '999888777', 'cliente', 'activo', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carlos', 'Rodriguez', 'carlos@gmail.com', '123456', '22222222', '888777666', 'cliente', 'activo', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ana', 'Lopez', 'ana@gmail.com', '123456', '33333333', '777666555', 'cliente', 'activo', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 2. INSERTAR CATEGORÍAS
-- =============================================

INSERT INTO product_categories (nombre, descripcion, imagen, "createdAt", "updatedAt") VALUES
('Frutas y verduras', 'Productos frescos de temporada', '/images/categories/fruta.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carnes, aves y pescados', 'Proteínas frescas y de calidad', '/images/categories/pollo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Abarrotes', 'Productos no perecederos', '/images/categories/arroz.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Panadería', 'Pan y productos horneados', '/images/categories/arroz.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Congelados', 'Productos congelados', '/images/categories/pollo.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lácteos', 'Leche y derivados', '/images/categories/limpieza.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bebidas', 'Refrescos, jugos y bebidas', '/images/categories/limpieza.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- 3. INSERTAR PRODUCTOS
-- =============================================

INSERT INTO products (nombre, descripcion, categoria, precio, unidad, imagen, presentacion, marca, stock, "createdAt", "updatedAt") VALUES

-- Frutas y verduras
('Manzana roja', 'Manzanas rojas frescas y dulces', 'Frutas y verduras', '4.50', 'kg', '/images/products/manzana.png', 'Por kilogramo', 'Del Campo', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Plátano', 'Plátanos frescos', 'Frutas y verduras', '3.20', 'kg', '/images/products/platano.png', 'Por kilogramo', 'Del Campo', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Palta', 'Paltas Hass', 'Frutas y verduras', '8.90', 'kg', '/images/products/palta.png', 'Por kilogramo', 'Del Campo', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pera', 'Peras frescas', 'Frutas y verduras', '5.20', 'kg', '/images/products/pera.png', 'Por kilogramo', 'Del Campo', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Uvas', 'Uvas rojas sin pepa', 'Frutas y verduras', '7.50', 'kg', '/images/products/uvas.png', 'Por kilogramo', 'Del Campo', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Zanahoria', 'Zanahorias frescas', 'Frutas y verduras', '2.80', 'kg', '/images/products/zanahoria.png', 'Por kilogramo', 'Del Campo', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Carnes, aves y pescados
('Pollo entero', 'Pollo entero fresco con menudencia', 'Carnes, aves y pescados', '16.90', 'kg', '/images/products/pollo.png', 'Por kilogramo', 'San Fernando', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Abarrotes
('Azúcar blanca', 'Azúcar blanca refinada', 'Abarrotes', '3.50', 'kg', '/images/products/azucar.png', 'Bolsa 1 kg', 'Cartavio', 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Café molido', 'Café molido tradicional', 'Abarrotes', '12.90', 'unidad', '/images/products/cafe.png', 'Frasco 200g', 'Nescafé', 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Avena', 'Hojuelas de avena', 'Abarrotes', '4.20', 'unidad', '/images/products/avena.png', 'Caja 500g', 'Quaker', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lácteos
('Leche evaporada', 'Leche evaporada entera', 'Lácteos', '4.80', 'unidad', '/images/products/leche.png', 'Lata 410g', 'Gloria', 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Panadería
('Pan francés', 'Pan francés fresco del día', 'Panadería', '0.30', 'unidad', '/images/products/pan.png', 'Por unidad', 'Panadería Central', 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- INSERTS PARA TABLAS DEL CARRITO
-- =============================================

-- Insertar algunos carritos de prueba
INSERT INTO carts (user_id, estado, created_at, updated_at) VALUES
(1, 'activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),    -- Carrito para Juan Perez
(3, 'activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),    -- Carrito para Maria Gonzales
(4, 'abandonado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Carrito abandonado para Carlos Rodriguez

-- Insertar algunos items de carrito de prueba
INSERT INTO cart_items (cart_id, product_id, quantity, precio_unitario, fecha_agregado) VALUES
-- Carrito de Juan Perez (cart_id = 1)
(1, 1, 2, 4.50, CURRENT_TIMESTAMP),  -- 2 kg de Manzana roja
(1, 3, 1, 8.90, CURRENT_TIMESTAMP),  -- 1 kg de Palta
(1, 8, 1, 3.50, CURRENT_TIMESTAMP),  -- 1 kg de Azúcar blanca

-- Carrito de Maria Gonzales (cart_id = 2)
(2, 2, 3, 3.20, CURRENT_TIMESTAMP),  -- 3 kg de Plátano
(2, 10, 2, 4.80, CURRENT_TIMESTAMP), -- 2 latas de Leche evaporada

-- Carrito abandonado de Carlos (cart_id = 3)
(3, 4, 1, 5.20, CURRENT_TIMESTAMP),  -- 1 kg de Pera
(3, 9, 1, 12.90, CURRENT_TIMESTAMP); -- 1 frasco de Café molido

-- =============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =============================================

-- Contar registros insertados
SELECT 'Users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'Categories' as tabla, COUNT(*) as total FROM product_categories
UNION ALL  
SELECT 'Products' as tabla, COUNT(*) as total FROM "Products"
UNION ALL
SELECT 'Carts' as tabla, COUNT(*) as total FROM carts
UNION ALL
SELECT 'Cart Items' as tabla, COUNT(*) as total FROM cart_items;

-- Ver todas las categorías
SELECT id, nombre, descripcion FROM product_categories ORDER BY id;

-- Ver productos por categoría
SELECT p.nombre, p.categoria, p.precio, p.stock 
FROM "Products" p 
ORDER BY p.categoria, p.nombre;

-- Ver carritos con sus items
SELECT 
    c.id as cart_id,
    u.nombres || ' ' || u.apellidos as usuario,
    c.estado,
    COUNT(ci.id) as items_count,
    SUM(ci.quantity * ci.precio_unitario) as total_cart
FROM carts c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN cart_items ci ON c.id = ci.cart_id
GROUP BY c.id, u.nombres, u.apellidos, c.estado
ORDER BY c.id;

-- Ver detalle completo de carritos con productos
SELECT 
    c.id as cart_id,
    u.nombres || ' ' || u.apellidos as usuario,
    c.estado as estado_carrito,
    p.nombre as producto,
    ci.quantity,
    ci.precio_unitario,
    (ci.quantity * ci.precio_unitario) as subtotal
FROM carts c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN "Products" p ON ci.product_id = p.id
ORDER BY c.id, p.nombre;

-- =============================================
-- CREDENCIALES DE ACCESO
-- =============================================

/*
CREDENCIALES PARA LOGIN:

👤 ADMINISTRADOR:
Email: admin@mitiendita.com
Password: 123456

👥 CLIENTES:
Email: juan.perez@gmail.com | Password: 123456
Email: maria@gmail.com | Password: 123456
Email: carlos@gmail.com | Password: 123456  
Email: ana@gmail.com | Password: 123456

Nota: Todas las contraseñas son TEXTO PLANO: "123456"
*/
