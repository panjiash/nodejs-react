import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import fileUpload from "express-fileupload";
import BlogRoutes from "./routes/BlogRoutes.js";

dotenv.config();
const app = express();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use(UserRoutes);
app.use(ProductRoutes);
app.use(BlogRoutes);

app.listen(5000, () => console.log('Server running at port 5000'));

