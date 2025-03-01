import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJwt.js";
import emailRegister from "../helpers/emailRegister.js";
import emailResetPassword from "../helpers/emailResetPassword.js";
import mongoose from "mongoose";

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
    const { token } = req.params

    const confirmedUser = await User.findOne({ token })
    if (!confirmedUser) {
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
    try {
        let user = req.user;
        if (!user) {
            return res.status(401).json({ msg: "Usuario no autenticado" });
        }

        user = user.toObject();

        if (user.avatar?.data) {
            user.avatar = {
                data: user.avatar.data.toString("base64"),
                contentType: user.avatar.contentType,
            };
        } else {
            user.avatar = null;
        }

        res.json({ user });
    } catch (error) {
        console.error("Error en el perfil:", error);
        res.status(500).json({ msg: "Error del servidor" });
    }


}

const updateProfile = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const currentUser = await User.findById(id);

    if (!currentUser) {
        return res.status(400).json({ msg: "Non-existent User" })
    }

    if (currentUser._id.toString() !== id.toString()) {
        return res.status(400).json({ msg: "Invalid Action" })
    }


    currentUser.name = req.body.name || currentUser.name
    currentUser.phone = req.body.phone || currentUser.phone
    currentUser.birthDate = req.body.birthDate || currentUser.birthDate
    currentUser.profession = req.body.profession || currentUser.profession
    currentUser.bio = req.body.bio || currentUser.bio

    if (req.file) {
        currentUser.avatar.data = req.file.buffer;
        currentUser.avatar.contentType = req.file.mimetype;
    }
    else {
        currentUser.avatar = currentUser.avatar
    }

    try {
        const updatedcurrentUser = await currentUser.save();
        res.json(updatedcurrentUser);

    } catch (error) {
        console.log(error)
    }

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
            phone: existUser.phone,
            bio: existUser.bio,
            avatar: existUser.avatar.data !== null
                ? {
                    data: existUser.avatar.data.toString('base64'),
                    contentType: existUser.avatar.contentType
                }
                : existUser.avatar,

            profession: existUser.profession,
            token: generateJwt(existUser.id),
        })
    }
    else {
        const error = new Error("Password incorrect");
        return res.status(403).json({ msg: error.message })
    }

}

const sendEmailResetPassword = async (req, res) => {
    const { email } = req.body

    const existUser = await User.findOne({ email })
    if (!existUser) {
        const error = new Error("User doesn't exist")
        return res.status(400).json({ msg: error.message })
    }
    try {
        existUser.token = generateId()
        await existUser.save()
        emailResetPassword({
            email,
            token: existUser.token
        })
        res.status(200).json({ msg: "Email send it correctly, please check your imbox" })
    }
    catch (error) {
        console.log(error)
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const userSaved = await User.findOne({ token })
    if (!userSaved) {
        const error = new Error('Some server error');
        return res.status(404).json({ msg: error.message })
    }

    try {
        userSaved.password = password;
        userSaved.token = null;
        await userSaved.save();
        res.json({ url: "Password Changed Correctly" })

    } catch (error) {
        console.log(error)
    }
}

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const { id } = req.user
    
        const currentUser = await User.findById(id);
        if (!currentUser) {
            const error = new Error('Some server error');
            return res.status(404).json({ msg: error.message })
        }
        try {
            if (await currentUser.checkPassword(currentPassword)) {
                currentUser.password = newPassword
                await currentUser.save()
                return res.json({ msg: 'Password updated successufully' })
            }
            const response = new Error("Password incorrect");
            return res.status(403).json({ msg: response.message })
        } catch (error) {
            console.log(error)
        }
        
    

}

export {
    register,
    confirm,
    authenticate,
    profile,
    updateProfile,
    sendEmailResetPassword,
    newPassword,
    changePassword
}