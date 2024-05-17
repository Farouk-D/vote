const objID = require('mongoose').Types.ObjectId;
const UserModel = require("../models/Users.js")
const VoteModel = require("../models/Vote.js")
const DechiffrementModel = require("../models/Dechiffrement.js")
const bigInt = require('big-integer');
const nodemailer=require("nodemailer")

module.exports.getClePub = async(req,res) => {
    try {
        const clePub = await VoteModel.findOne({}).select("clePub");
        if (!clePub) {
            return res.json({ valid: false, message: "Aucun vote est en cours! " });
        }
        const pubCle = clePub.clePub 
        return res.json({valid: true,pubCle});
    }catch (error) {
        return res.status(500).json({valid: true, message: "Error" });
    }
    
}

module.exports.createVote = async (req,res) => {
    const {dateEnd} = req.body;
    const votes = await VoteModel.findOne({});
    if (!votes) {
        const key = createKeys()
        const newVote = new VoteModel({clePub:key[0],prime:key[1],dateEnd})
        await newVote.save()
        return res.json({message:"Vote crée"})
    } else {
        return res.json({message:"Un vote est déja en cours ! "})
    }
}
module.exports.deleteVote = async (req,res) => {
    try {
        const resultVote = await VoteModel.findOneAndDelete({});
        await DechiffrementModel.deleteOne({})

        if (resultVote) {
            await UserModel.updateMany({},{ $set: { userVoted: false }})
            return res.json({message:"Le vote a bien été effacé et les utilisateurs peuvent re voter pour les prochains"})
        }
        else {
            return res.json({message:"Aucun vote en cours"})
        }

    } catch (error) {
        return res.json({message: "Une erreur s'est produite lors de la suppression du vote" });
    }

}

module.exports.calculR = (req,res) => {
    const n = bigInt(req.body)
    let r
    while (true) {
        do {
            r = bigInt.randBetween(
                bigInt(2).pow(511),   
                bigInt(2).pow(512).minus(1) 
            ); 
        } while (!r.isProbablePrime()); 
        if (r.compare(n) < 0) {
            break;
        }
    }
    return res.json({r})
}

module.exports.testVote = async(req,res) => {
    const {userId} = req.body
    if (!objID.isValid(userId))
        return res.status(400).send("ID inconnu : " + userId);

    try {
        const user = await UserModel.findById(userId);
            if (!user) {return res.json({valid:false,message:"Utilisateur non existant"});} 
            else if (user.userVoted) {return res.json({valid:false,message:"Vous avez déja voté"});} 
            else {
                const existVote = await VoteModel.findOne({})
                if (existVote){
                    return res.json({valid:true,message:"On peut chiffrer le vote et l'envoyer au serveur"})
                }
                else {
                    return res.json({valid:false,message:"Aucun vote en cours"})
                }
            }
    } catch(error) {
        console.error("Une erreur s'est produite lors de la mise à jour :");
        return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour" }); 
    }

}
module.exports.postVote = async (req,res) => {
    const {userId,voteTime,resultat} = req.body;
    try {
        const vote = await VoteModel.findOne({})
        if (vote.dateEnd.getTime() < voteTime) {
            return res.json({message:"la date limite a été depassé ! "})
        }
        await VoteModel.findOneAndUpdate(
            {},
            {$push: { votes: resultat }},
            { new: true,upsert: false  }
        );
        await UserModel.findByIdAndUpdate(
            userId,
            { $set: { userVoted: true } },
            { new: true }
        );
        return res.json({message:"Votre vote a bien été pris en compte"});

        } catch(error) {
            console.error("Une erreur s'est produite lors de la mise à jour :");
            return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour" });
        }
}

const createKeys = () => {
    // PAILLIER INITIALIZATION
    let p, q   
        do {
            p = bigInt.randBetween(
                bigInt(2).pow(255),   
                bigInt(2).pow(256).minus(1) 
            ); 
        } while (!p.isProbablePrime());
        do {
            q = bigInt.randBetween(
                bigInt(2).pow(255),   
                bigInt(2).pow(256).minus(1) 
            ); 
        } while (!q.isProbablePrime());
        let n = p.multiply(q);

        while (bigInt.gcd(n, p.subtract(bigInt.one).multiply(q.subtract(bigInt.one))).toJSNumber() !== 1) {
            do {
                p = bigInt.randBetween(
                    bigInt(2).pow(255),   
                    bigInt(2).pow(256).minus(1) 
                ); 
            } while (!p.isProbablePrime());
            do {
                q = bigInt.randBetween(
                    bigInt(2).pow(255),   
                    bigInt(2).pow(256).minus(1) 
                ); 
            } while (!q.isProbablePrime());
            n = p.multiply(q);
        }

        let g = n.add(bigInt.one);
        // SHAMIR SPLIT 
        let lambda = bigInt.lcm(p.subtract(bigInt.one), q.subtract(bigInt.one));
        let prime = bigInt.one
        do {
            prime = bigInt.randBetween(
                bigInt(2).pow(511),   
                bigInt(2).pow(512).minus(1) 
            ); 
        } while (!prime.isProbablePrime())
        let coeffs = [lambda];
        for (let i = 0; i < 3; i++) {
            let coeffObj;
            while (true) {
                coeffObj = bigInt.randBetween(
                    bigInt(2).pow(511),   
                    bigInt(2).pow(512).minus(1) 
                ); 
                if (coeffObj.compare(bigInt.zero) > 0 && coeffObj.compare(prime) < 0) {
                    break;
                }
            }
            coeffs.push(coeffObj);
        }
        let sha  
        for (let x = 1; x <= 4; x++) {
            sha = calculateF(coeffs, x, prime).toString();
            console.log(x + " : " + sha) // REMPLACER PAR : sendSecretKey(mail admin, [x, sha])
        }

        function calculateF(coeffs, x, prime) {
            let out = coeffs[0];
            for (let i = 1; i < coeffs.length; i++) {
                out = out.add(coeffs[i].multiply(bigInt(x).pow(i).mod(prime))).mod(prime);
            }
            return out;
        }
        // FIN SHAMIR & INITIALIZAITON
        let publicKey = [n.toString(), g.toString()];
        return [publicKey, prime]
}

const sendSecretKey = async (email,secretKey) => {
    
    var transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port : 465,
        secure : true,
        auth: {
          user: "quomexfr@gmail.com",
          pass: "a",
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: email,
        subject: "Votre clé secrete pour le déchiffrement",
        text: `${secretKey}`,
    };
    try {
        await transporter.sendMail(mailOptions)
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        return false;
    }
    
        
}