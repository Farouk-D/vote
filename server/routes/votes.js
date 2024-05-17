const {verifyUser, admin}=require('../middleware/authMiddleware.js')
const voteControllers=require('../controllers/voteControllers');
const express = require("express")



const router = express.Router()

//router.get("/",verifyUser)
router.use(verifyUser)

router.get("/getClePub",voteControllers.getClePub)
router.post("/createVote",voteControllers.createVote)
router.post("/testVote",voteControllers.testVote)
router.post("/calculR",voteControllers.calculR)
router.post("/postVote",voteControllers.postVote)
router.delete("/deleteVote",admin,voteControllers.deleteVote)

module.exports=router;