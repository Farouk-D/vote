const express = require("express")
const userController=require('../controllers/userControllers');
const { verifyUser, admin } = require("../middleware/authMiddleware");




// Pour expliquer en bref : une route c'est un chemin dans l'URL 
const router = express.Router()
router.post("/getUser", userController.getUser)
router.get("/admin",[verifyUser,admin],userController.getAdmin)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.get('/logout', userController.logout)
router.delete("/deleteAllUsers",[verifyUser,admin],userController.deleteAllUsers)


module.exports=router;

