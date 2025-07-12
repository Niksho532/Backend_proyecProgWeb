import UserService from '../services/userService.js';
const login = async (req, res) => {
    try {
        const { email, correo, password, contrasena } = req.body;
        const userEmail = email || correo;
        const userPassword = password || contrasena;
        if (!userEmail || !userPassword) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }
        const user = await UserService.findByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (user.contrasena !== userPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const { contrasena: _, ...userWithoutPassword } = user.toJSON();
        console.log('Login exitoso para:', userEmail);
        return res.status(200).json({ 
            user: userWithoutPassword,
            message: 'Login exitoso'
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: error.message });
    }
};
const register = async (req, res) => {
    try {
        const { 
            username, 
            nombres, 
            apellidos, 
            tipoDocumento, 
            nroDocumento, 
            dni,
            email, 
            correo,
            password, 
            contrasena,
            telefono,
            role, 
            tipo,
            estado 
        } = req.body;
        const userData = {
            nombres,
            apellidos,
            tipoDocumento: tipoDocumento || 'DNI',
            nroDocumento: nroDocumento || dni,
            correo: email || correo,
            contrasena: password || contrasena,
            telefono: telefono || null,
            tipo: role || tipo || 'cliente',
            estado: estado || 'activo'
        };
        if (!userData.nombres || !userData.apellidos || !userData.nroDocumento || !userData.correo || !userData.contrasena) {
            return res.status(400).json({ message: 'Nombres, apellidos, documento, email y contraseña son obligatorios' });
        }
        const existingUserByEmail = await UserService.findByEmail(userData.correo);
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        const existingUserByDoc = await UserService.findByDocument(userData.nroDocumento);
        if (existingUserByDoc) {
            return res.status(400).json({ message: 'El documento ya está registrado' });
        }
        const nuevoUsuario = await UserService.create(userData);
        const { contrasena: _, ...userWithoutPassword } = nuevoUsuario.toJSON();
        return res.status(201).json({ 
            user: userWithoutPassword,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ message: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombres, 
            apellidos, 
            nroDocumento, 
            dni,
            email, 
            correo,
            password, 
            contrasena,
            telefono,
            estado,
            tipo
        } = req.body;
        const fieldsToUpdate = {};
        if (nombres !== undefined) fieldsToUpdate.nombres = nombres;
        if (apellidos !== undefined) fieldsToUpdate.apellidos = apellidos;
        if (nroDocumento !== undefined || dni !== undefined) fieldsToUpdate.nroDocumento = nroDocumento || dni;
        if (email !== undefined || correo !== undefined) fieldsToUpdate.correo = email || correo;
        if (password !== undefined || contrasena !== undefined) fieldsToUpdate.contrasena = password || contrasena;
        if (telefono !== undefined) fieldsToUpdate.telefono = telefono;
        if (estado !== undefined) fieldsToUpdate.estado = estado;
        if (tipo !== undefined) fieldsToUpdate.tipo = tipo;
        const usuarioActualizado = await UserService.update(id, fieldsToUpdate);
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const { contrasena: _, ...userWithoutPassword } = usuarioActualizado.toJSON();
        return res.status(200).json({ 
            user: userWithoutPassword,
            message: 'Usuario actualizado exitosamente' 
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        return res.status(500).json({ message: error.message });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email y nueva contraseña son obligatorios' });
        }
        const user = await UserService.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await UserService.update(user.id, { contrasena: newPassword });
        return res.status(200).json({ 
            message: 'Contraseña restablecida exitosamente' 
        });
    } catch (error) {
        console.error('Error restableciendo contraseña:', error);
        return res.status(500).json({ message: error.message });
    }
};
export default { login, register, updateUser, resetPassword };

