import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJwt.js";
import emailRegister from "../helpers/emailRegister.js";

const register = async (req, res) => {
    const { email, name } = req.body

    const existUser = await User.findOne({ email })
    if (existUser) {
        const error = new Error("User already exists")
        return res.status(400).json({ msg: error.message })
    }

    try {
        const user = new User(req.body);
        const userSaved = await user.save()

        emailRegister({
            email,
            name,
            token: userSaved.token
        })
        res.status(200).json(userSaved)

    } catch (error) {
        console.log(`error: ${error.message}`)
    }

}

const confirm = async (req, res) => {
   const {token} = req.params

   const confirmedUser = await User.findOne({token})
   if(!confirmedUser){
    const error = new Error('Invalid Token');
    return res.status(404).json({ msg: error.message })
   }

   try {
    confirmedUser.token = null;
    confirmedUser.validated = true;
    await confirmedUser.save();
    res.json({ url: "User confirmed!" })
    
   } catch (error) {
    console.log(error)
   }
}

const profile = async (req, res) => {
    const {user} = req

     res.json({user})
    
 }
 

const authenticate = async (req, res) => {
    const { email, password } = req.body

    const existUser = await User.findOne({ email })
    if (!existUser) {
        const error = new Error("Invalid User")
        return res.status(400).json({ msg: error.message })
    }

    if (!existUser.validated) {
        const error = new Error("Account need to be validated");
        return res.status(403).json({ msg: error.message })
    }

    if (await existUser.checkPassword(password)) {
        res.json({
            _id: existUser._id,
            name: existUser.name,
            email: existUser.email,
            token: generateJwt(existUser.id)
        })
    }
    else {
        const error = new Error("Password incorrect");
        return res.status(403).json({ msg: error.message })
    }

}


export {
    register,
    confirm,
    authenticate,
    profile
}