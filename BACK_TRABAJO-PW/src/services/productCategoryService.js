import ProductCategory from "../models/productCategory.js";
const findAll = async () => {
    return await ProductCategory.findAll();
};
const findOne = async (id) => {
    return await ProductCategory.findByPk(id);
};
const findByName = async (name) => {
    return await ProductCategory.findOne({ where: { nombre: name } });
};
export default { findAll, findOne, findByName };

