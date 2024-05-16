const express = require("express")
const userController=require('../controllers/userControllers');
const { verifyUser, admin } = require("../middleware/authMiddleware");




// Pour expliquer en bref : une route c'est un chemin dans l'URL 
const router = express.Router()

// a la page http://localhost:3001/auth/register, on fait un POST
// req = request donc ce qu'elle recoit
// res = response donc la réponse du serveur 

router.post("/getUser", userController.getUser)
router.get("/admin",[verifyUser,admin],userController.getAdmin)
router.post("/register", userController.register)


//a la page http://localhost:3001/auth/login, on fait un POST
// C'est la page ou la personne va voté et pour ca il doit entrer : 
// l'ID + le vote

router.post("/login", userController.login)
router.get('/logout', userController.logout)
router.delete("/deleteAllUsers",[verifyUser,admin],userController.deleteAllUsers)


module.exports=router;

