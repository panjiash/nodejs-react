import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/ProductController.js";


const ProductRoutes = express.Router();

ProductRoutes.get('/products', getProducts);
ProductRoutes.get('/products/:id', getProductById);
ProductRoutes.post('/products', saveProduct);
ProductRoutes.patch('/products/:id', updateProduct);
ProductRoutes.delete('/products/:id', deleteProduct);

export default ProductRoutes;