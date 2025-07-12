import productCategoryService from "../services/productCategoryService.js";
const findAll = async (req, res) => {
    try {
        const result = await productCategoryService.findAll();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productCategoryService.findOne(id);
        return result ? res.status(200).json(result) : res.status(404).json({ message: 'Categoría no encontrada' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export default { findAll, findOne };

