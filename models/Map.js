import mongoose from "mongoose"


const MapSchema = mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
})

const Map = mongoose.model('Countrys', MapSchema);

export default Map;