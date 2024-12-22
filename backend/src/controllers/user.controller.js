import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js';
import transporter from '../config/nodeMailer.js';

const generateToken = async (user, res) => {
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
    //send cookies
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required !!" });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "password must be atleast 6 characters !!" });
    }
    if (name.length > 10) {
        return res.status(400).json({ success: false, message: "please enter name atleast 10 character  !!" });
    }

    try {
        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(400).json({ success: false, message: "Email Already in used" })
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new UserModel({
            name,
            email,
            password: hashPassword
        })
        const response = await user.save()

        await generateToken(user, res)

        //send email to user 
        const MailOption = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: `Welcome to Danish Khan's Website, ${name}!`,
            text: `Dear ${name},
        
        Welcome to Danish Khan's website! We're excited to have you as part of our community.
        
        Your account has been successfully created with the email ID: ${email}.
        
        If you have any questions or need assistance, feel free to reply to this email. We're here to help!
        
        Best regards,  
        Danish Khan`
        };

        await transporter.sendMail(MailOption)

        return res.status(201).json({
            success:true,
            message: 'Registration successful!',
            response,
            name: user.name,
            email: user.email,
            password: user.password,
            userId: user._id
        })

    } catch (error) {
        console.log('error in register controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are Required !!" })
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "user does not Exist !!" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "incorrect Password !!" })
        }

        await generateToken(user, res)

        return res.status(200).json({ success: true , message:"Login successfully" })

    } catch (error) {
        console.log('error in login controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production'
        })
        return res.status(200).json({ success: true, message: "logged out" })
    } catch (error) {
        console.log('error in login controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

// account verfication 
const sendverfiyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(401).json({ success: false, message: "Account Already verify !!" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailoptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: `Verify Your Email !`,
            text: `Dear <h3 style = "color:red;"> ${user.name}<h3>,
        
        your email verification OTP is : .
        OTP: <span style="color: #4CAF50; padding:10px">${otp}</span>
        please verify account with in 24h Thank You 
       Please do not share this OTP with anyone for security reasons !!
        
        Best regards,  
        Danish Khan`

        }

        await transporter.sendMail(mailoptions);
        res.status(201).json({ success: true, message: "OTP send" })

    } catch (error) {
        console.log('error in verifying otp controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

//email verfiy using otp
const verfiyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "details missing" })
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not found !" })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "invalid otp !" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "otp expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save()

        const mailoptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: `Congratulations! Your Account is Verified`,
            text: `Hello ${user.name},
        
        We are excited to inform you that your account has been successfully verified! 
        You can now enjoy full access to all the features and services of our platform.
        
        If you have any questions or need assistance, please don’t hesitate to contact us.
                        
   
        
        Best regards,  
        Danish Khan`

        }

        await transporter.sendMail(mailoptions)

        return res.status(200).json({ success: true, message: "Account verification success ." })

    } catch (error) {
        console.log('error in verifying email controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

const isAuthenticated = async (req, res) => {
    try {
        res.status(200).json({ success: true })
    } catch (error) {

    }
}

//send password reset otp
const SendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ Success: false, message: "email is required !" })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({ Success: false, message: "user not found !" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailoptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: `password Reset OTP !`,
            text: `Dear <h3 style = "color:red;"> ${user.name}<h3>,
        
       your password reset otp is : .
        OTP: <span style="color: #4CAF50; padding:10px">${otp}</span>
        please use otp with in 15 min use this otp for resting your password
       Please do not share this OTP with anyone for security reasons !!
        
        Best regards,  
        Danish Khan`

        }
        await transporter.sendMail(mailoptions)
        return res.json({ success: true, message: "password reset otp is send" })

    } catch (error) {
        console.log('error in password reset controller', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}

//reset password
const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body
    if (!email || !otp || !newpassword) {
        return res.json({ success: false, message: "email otp password confirmpassword are required !" })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "otp expired" })
        }

        const HashNewPassword = await bcrypt.hash(newpassword, 10);
        user.password = HashNewPassword;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0

        await user.save();

        const mailoptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: `password reset success !`,
            text: `Dear <h3 style = "color:red;"> ${user.name}<h3>,
            Your password is reset successfully 
        if is this you ignore this message : .
        your new password is don't worry this is encrypted smile :) => ${user.password}</span> 
        if any issue sent message on this !!
        
        Best regards,  
        Danish Khan`

        }

        await transporter.sendMail(mailoptions);

       return res.json({ success: true, message: "password reset" })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

//get user details
const GetUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID Not Found !" })
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User Not Found !" })
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        console.log("error in getUserData", error.message);
        return res.json({ success: false, message: "internal server Error" })
    }
}

export { registerUser, login, logout, sendverfiyOtp, verfiyEmail, isAuthenticated, SendResetOtp, resetPassword, GetUserData }