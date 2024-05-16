const express = require("express")
const decryptController=require('../controllers/dechiffrementControllers');
const { verifyUser, admin } = require("../middleware/authMiddleware");

const router = express.Router()
router.use([verifyUser, admin])
router.get("/startDecrypt",decryptController.startDecrypt)
router.get("/verifyAllDecrypt",decryptController.verifyAllDecrypt)
router.post("/decrypt",decryptController.decrypt)

module.exports=router;