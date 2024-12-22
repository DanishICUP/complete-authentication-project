import jwt from 'jsonwebtoken'

const userAuth = async (req,res,next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({success:false , message:"not Authorized Logged in Again !"})
    }

    try {
        const decodeToken = jwt.verify(token , process.env.JWT_SECRET);

        if (decodeToken.id) {
            req.body.userId = decodeToken.id;
        }else{
            return res.json({success:false , message:"not Authorized Logged in Again !"})
        }
        next()
    } catch (error) {
        console.log('middleware Error', error.message);
        return res.status(500).json({ success: false, message: "internal server Error" })
    }
}
export default userAuth