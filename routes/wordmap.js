import express from 'express'
import { register, authenticate, confirm, profile } from '../controllers/UserController.js';
import { saveCountry, getCountrys, deleteCountry, updateCountry } from '../controllers/MapController.js';
import { saveNote, getNotes, deleteNote, updateNote } from '../controllers/NoteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

/*User Routes*/
router.post("/", register)
router.post("/login", authenticate)
router.get("/confirm/:token", confirm)
router.get("/profile", checkAuth, profile)

/*Country Routes*/
router.route("/country").post(checkAuth, saveCountry).get(checkAuth, getCountrys)
router.route("/country/:id")
    .delete(checkAuth ,deleteCountry)
    .put(checkAuth, updateCountry)    

/*Notes Routes*/
router.route("/notes").post(checkAuth, saveNote).get(checkAuth, getNotes)
router.route("/notes/:id")
    .delete(checkAuth ,deleteNote)
    .put(checkAuth, updateNote)

export default router;