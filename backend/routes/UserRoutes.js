import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const UserRoutes = express.Router();

UserRoutes.get('/users', verifyToken, getUsers);
UserRoutes.post('/users', Register);
UserRoutes.post('/login', Login);
UserRoutes.get('/token', refreshToken);
UserRoutes.delete('/logout', Logout);

export default UserRoutes;