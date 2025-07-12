import Product from "../models/product.js";
import ProductCategory from "../models/productCategory.js";
const findAll = async () => {
    return await Product.findAll({
        include: [
            {
                model: ProductCategory,
                attributes: ['nombre', 'descripcion', 'imagen']
            }
        ]
    });
};
const findOne = async (id) => {
    return await Product.findByPk(id, {
        include: [
            {
                model: ProductCategory,
                attributes: ['nombre', 'descripcion', 'imagen']
            }
        ]
    });
};
const findByCategory = async (categoryName) => {
    return await Product.findAll({
        include: [
            {
                model: ProductCategory,
                where: { nombre: categoryName },
                attributes: ['nombre', 'descripcion', 'imagen']
            }
        ]
    });
};
export default { 
    findAll, 
    findOne, 
    findByCategory
};

