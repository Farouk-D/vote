const express = require("express")
const decryptController=require('../controllers/dechiffrementControllers');
const { verifyUser, admin } = require("../middleware/authMiddleware");

const router = express.Router()
router.get("/startDecrypt",admin,decryptController.startDecrypt)
router.get("/verifyAllDecrypt",admin,decryptController.verifyAllDecrypt)
router.post("/decrypt",[verifyUser,admin],decryptController.decrypt)

module.exports=router;