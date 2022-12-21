import express from "express";
import {
    getBlog,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from "../controllers/BlogController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const BlogRoutes = express.Router();

BlogRoutes.get('/blogs', verifyToken, getBlog);
BlogRoutes.get('/blogs/:id', getBlogById);
BlogRoutes.post('/blogs', verifyToken, createBlog);
BlogRoutes.patch('/blogs/:id', updateBlog);
BlogRoutes.delete('/blogs/:id', deleteBlog);

export default BlogRoutes;