import express from 'express'
import multer from 'multer';
import { register, authenticate, confirm, profile, updateProfile, sendEmailResetPassword, newPassword } from '../controllers/UserController.js';
import { saveCountry, getCountrys, deleteCountry, updateCountry } from '../controllers/MapController.js';
import { saveNote, getNotes, deleteNote, updateNote, filterNote } from '../controllers/NoteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

/*Configure Multer*/
const storage = multer.memoryStorage();
const upload = multer({storage})

/*User Routes*/
router.post("/", register)
router.post("/login", authenticate)
router.get("/confirm/:token", confirm)
router.get("/profile", checkAuth, profile)
router.post("/profile/:id", upload.single('avatar'), checkAuth, updateProfile)
router.post("/resetPassword", sendEmailResetPassword)
router.post("/resetPassword/:token", newPassword)

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


router.post("/notes/filter", checkAuth, filterNote)

export default router;
