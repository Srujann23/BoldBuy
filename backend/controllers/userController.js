import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
// User Login Route
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            // res.json({ success: true, token });
            res.json({ success: true, token, name: user.name });
        }
        else {


            
            res.json({ success: false, message: "Invalid Credentials!" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Register Route
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id);
        // res.status(201).json({ success: true, message: "User created successfully", token })
        res.status(201).json({ success: true, message: "User created successfully", token, name: user.name })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Admin Route
const adminLogin = async (req, res) => {
    try{
        const{email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Admin Credentials"});
        }
    } catch (error){
        console.log(error);
        res.json({success:false,message:error.message});

    }
}

export { loginUser, registerUser, adminLogin }