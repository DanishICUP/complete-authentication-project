import { Router } from "express";
import { registerUser, login, logout, sendverfiyOtp, verfiyEmail, isAuthenticated, SendResetOtp, resetPassword, GetUserData } from "../controllers/user.controller.js";
import userAuth from '../middleware/userAuth.js'

const userRoute = Router()

userRoute.post('/register', registerUser);
userRoute.post('/login', login);
userRoute.post('/logout', logout);
userRoute.post('/otp', userAuth, sendverfiyOtp);
userRoute.post('/verifyotp', userAuth, verfiyEmail);
userRoute.get('/auth-user', userAuth, isAuthenticated);
userRoute.post('/send-reset-otp', SendResetOtp);
userRoute.post('/reset-password', resetPassword);


userRoute.get('/get-user-data',userAuth, GetUserData);



export default userRoute