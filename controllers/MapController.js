import Map from "../models/Map.js";
import mongoose from "mongoose";

const saveCountry = async (req , res) => {
    const country = new Map(req.body)
    country.user = req.user._id
    try {
        const savedCountry = await country.save()
        res.json(savedCountry)
    } catch (error) {
        console.log(error)
    }
}

const getCountrys = async (req , res) => {
    
    const country = await Map.find()
    .where("user")
    .equals(req.user)

    res.json(country)
}

const updateCountry = async (req , res) => {
    
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const country = await Map.findById(id);

    if (!country) {
        return res.status(400).json({ msg: "Non-existent Note" })
    }

    if (country.user._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ msg: "Invalid Action" })
    }

    country.color = req.body.color || country.color

    try {
        const updatedCountry = await country.save();
        res.json(updatedCountry);

    } catch (error) {
        console.log(error)
    }
}

const deleteCountry = async (req , res) => {
    
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const country = await Map.findById(id);

    if (!country) {
        return res.status(400).json({ msg: "Non-existent Country" })
    }

    if (country.user._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ msg: "Invalid Action" })
    }


    try {
       await country.deleteOne();
       res.json({msg: "Country Deleted"})

    } catch (error) {
        console.log(error)
    }
}

export {
    getCountrys,
    saveCountry,
    updateCountry,
    deleteCountry
}