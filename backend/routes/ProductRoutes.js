import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/ProductController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const ProductRoutes = express.Router();

ProductRoutes.get('/products', verifyToken, getProducts);
ProductRoutes.get('/products/:id', getProductById);
ProductRoutes.post('/products', verifyToken, saveProduct);
ProductRoutes.patch('/products/:id', verifyToken, updateProduct);
ProductRoutes.delete('/products/:id', verifyToken, deleteProduct);

export default ProductRoutes;