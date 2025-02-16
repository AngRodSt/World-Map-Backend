import mongoose from "mongoose"
import generateId from "../helpers/generateId.js"
import bcrypt from "bcrypt"

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    
    token:{
        type: String,
        default: generateId()
    },
    validated:{
        type: Boolean,
        default: false
    }
})

UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.checkPassword = async function(passForm) {
    return await bcrypt.compare(passForm, this.password)
}

const User = mongoose.model('User', UserSchema);

export default User;