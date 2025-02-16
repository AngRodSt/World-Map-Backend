import mongoose from "mongoose";
import Note from "../models/Note.js";


const getNotes = async (req, res) => {
    const notes = await Note.find()
        .where("user")
        .equals(req.user)

    res.json(notes)
}

const saveNote = async (req, res) => {
    const note = new Note(req.body)
    note.user = req.user._id

    try {
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.log(error)
    }

}

const updateNote = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const note = await Note.findById(id);

    if (!note) {
        return res.status(400).json({ msg: "Non-existent Note" })
    }

    if (note.user._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ msg: "Invalid Action" })
    }

    note.message = req.body.message || note.message
    note.name = req.body.name || note.name

    try {
        const updatedNote = await note.save();
        res.json(updatedNote);

    } catch (error) {
        console.log(error)
    }

}

const deleteNote = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const note = await Note.findById(id);

    if (!note) {
        return res.status(400).json({ msg: "Non-existent Note" })
    }

    if (note.user._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ msg: "Invalid Action" })
    }

    try {
        await note.deleteOne();
        res.json({msg: "Note Deleted"})
    } catch (error) {
        console.log(error)
    }

   
}

export {
    getNotes,
    saveNote,
    deleteNote,
    updateNote
}