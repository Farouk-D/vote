const DechiffrementModel = require("../models/Dechiffrement.js")
const VoteModel = require("../models/Vote.js")
const bigInt = require('big-integer');

module.exports.decrypt = async(req,res) => {
    const {adminMail,share,indice} = req.body;
    try {
        const admin = await DechiffrementModel.findOne({})
        if (admin.adminMail.length === 0) {return res.json({message: "Le déchiffrement est terminé" });}
        if (!admin.adminMail.includes(adminMail)) {
            return res.json({message: "Vous avez déja dechiffré" });
        }
        if (admin.adminMail.length === 1) {   // C'est le dernier a donner sa clé !
            let sha = admin.get("share")
            sha.push(share)
            let ind = admin.get("indice")
            ind.push(indice)
            let sum = bigInt(admin.get("decryptValue"))

            const vote = await VoteModel.findOne({})
            let prime = bigInt(vote.get("prime"))
            
            let result = bigInt(0)
            for (let i = 0; i < ind.length; i++) {
                let numerator = bigInt(1);
                let denominator = bigInt(1);
                
                for (let j = 0; j < ind.length; j++) {
                    if (j !== i) {
                        let startposition = parseInt(ind[i]);
                        let nextposition = parseInt(ind[j]);

                        numerator = numerator.multiply(nextposition).multiply(-1).mod(prime);
                        denominator = denominator.multiply(startposition - nextposition).mod(prime);
                    }
                }
                
                let value = bigInt(sha[i]);
                let tmp = value.multiply(numerator).multiply(denominator.modInv(prime)).mod(prime);
                result = prime.add(result).add(tmp).mod(prime);
                console.log("le resultat" + result)
                admin.adminMail = admin.adminMail.filter(e => e !== adminMail)
                await admin.save()
                
            }

            let n = bigInt(vote.get("clePub")[0])
            let mu = result.modPow(bigInt.minusOne, n)
            let decryptVote = sum.modPow(result, n.multiply(n)).subtract(bigInt.one).divide(n).multiply(mu).mod(n).toString()
            
            await DechiffrementModel.updateOne({},{ $set: { decryptValue: decryptVote, indice: null ,share: null  }}).exec()
            admin.adminMail = admin.adminMail.filter(e => e !== adminMail)
            await admin.save()
            
        }
        else {
            await DechiffrementModel.updateOne({},{ $push: { share: share,indice: indice }}).exec()
            admin.adminMail = admin.adminMail.filter(e => e !== adminMail)
            await admin.save()
            
        }
        return res.json({message:"déchiffrement effectué avec succès "})
    } catch(error) {
        return res.json({ message: "Error" });
    }
}

module.exports.startDecrypt = async (req,res) => {
    try {
        const date = await VoteModel.findOne({})
        if (date) {
            if (new Date().getTime() > date.dateEnd.getTime()) {
                const dechiffrement = await DechiffrementModel.findOne({})
                if (!dechiffrement) {
                    // Calcul la somme des votes
                    let votes = date.get("votes")
                    let n = bigInt(date.get("clePub")[0])
                    let sum = bigInt.one;
                    for (const voteObj of votes) {
                        sum = sum.multiply(bigInt(voteObj)).mod(n.multiply(n));
                    }
                    await DechiffrementModel.create([
                        { adminMail: ["admin1@com","admin2@com","admin3@com","admin4@com"],
                         decryptValue: sum }
                    ]);
                    return res.json({message:"Dechiffrement lancé !!"})

                } else {return res.json({message:"Le déchiffrement est déja en cours !"})}
            
            } else {return res.json({message:"Limite de date de vote pas depassé"})}
        
        } else {
            return res.json({message:"Aucun vote en cours"})
        }
    } catch (error) {
        console.error('Erreur lors du déchiffrement :', error);
        return res.json({ valid: false, message: "Erreur lors du déchiffrement." });
}

}

module.exports.verifyAllDecrypt = async (req,res) => {
    const decryptedStarted = await DechiffrementModel.findOne({})
    if (decryptedStarted) {
        const decrypted = await DechiffrementModel.findOne({}).select("adminMail");
        if (decrypted.adminMail.length === 0) {
            return res.json({ valid: true, message: "Tous les admins ont déchiffré ! " });
        } else {
            return res.json({ valid: false, message: "Il manque un ou plusieurs admins qui n'ont pas dechiffré " });
        }
    } else {
        return res.json({ valid: false, message: "Aucun déchiffrement est en cours !!!" });
    }

}


