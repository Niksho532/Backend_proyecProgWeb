import User from '../models/user.js';
const create = async (userData) => {
    return await User.create(userData);
};
const update = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data); 
    return user;
};
const findByUsername = async (username) => {
    return await User.findOne({ where: { username } });
};
const findByEmail = async (email) => {
    return await User.findOne({ where: { correo: email } });
};
const findByDocument = async (document) => {
    return await User.findOne({ where: { nroDocumento: document } });
};
export default { 
    create,
    update, 
    findByUsername, 
    findByEmail, 
    findByDocument 
};

