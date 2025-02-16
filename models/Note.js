import mongoose from "mongoose"


const NoteSchema = mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
})

const Note = mongoose.model('Note', NoteSchema);

export default Note;