const DechiffrementModel = require("../models/Dechiffrement.js")
const VoteModel = require("../models/Vote.js")
const bigInt = require('big-integer');

module.exports.decrypt = async(req,res) => {
    const {adminMail,share,indice} = req.body;
    console.log("1ere ")
    try {
        const admin = await DechiffrementModel.findOne({})
        if (!admin.adminMail.includes(adminMail)) {
            return res.json({message: "Vous avez déja dechiffré" });
        }
        const vote = await VoteModel.findOne({})
        let delta = bigInt(vote.get("delta"))
        let n = bigInt(vote.get("clePub")[0])

        let c = bigInt(admin.get("decryptValue"))
        console.log("2eme ")
        let sha = c.modPow(bigInt(2).times(delta).times(share.trim()), n.pow(2)).toString()
        console.log("3eme ")
        await DechiffrementModel.updateOne({},{ $push: { decryptedShare: sha,indice: indice }})

        admin.adminMail = admin.adminMail.filter(e => e !== adminMail)
        await admin.save()

        return res.json({message:"Déchiffrement effectué avec succès "})
    } catch(error) {
        console.log(error.toString())
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
                    // Recherche clé et votes
                    let votes = date.get("votes")
                    let n = bigInt(date.get("clePub")[0])
                    // Calcul la somme des votes
                    let sum = bigInt.one;
                    for (const voteObj of votes) {
                        sum = sum.multiply(bigInt(voteObj)).mod(n.multiply(n));
                    }
                    // Initialisation dechiffrement
                    await DechiffrementModel.create([
                        { adminMail: ["admin1@com","admin2@com","admin3@com","admin4@com"],
                         decryptValue: sum}
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
module.exports.endDecrypt = async(req,res) => {
    function calculMu(ind, delta) {
        // Calcul parameters for threshold version Paillier.
        let muList = []
        for (let i = 0; i < ind.length; i++) {
            let numerator = bigInt(1);
            let denominator = bigInt(1);
            
            for (let j = 0; j < ind.length; j++) {
                if (j !== i) {
                    let startposition = parseInt(ind[i]);
                    let nextposition = parseInt(ind[j]);
        
                    numerator = numerator.multiply(nextposition).multiply(-1);
                    denominator = denominator.multiply(startposition - nextposition);
                }
            }
            muList.push(delta.times(numerator.divide(denominator)))
        }
        return muList
    }

    function decrypt(cList, muList, n, delta, theta) {
        // Calcul m with parameters Paillier and all personnal decrypt.
        let pList = []
        for (let i = 0; i < cList.length; i++) {
            let pi = bigInt(cList[i]).modPow(bigInt(2).times(muList[i]), n.pow(2))
            pList.push(pi)
        }
        let product = bigInt(1)
        for (let j = 0; j < pList.length-1; j+=2) {
            let temp = timesMod(pList[j], pList[j+1], n.times(n))
            product = timesMod(product, temp, n.pow(2))
        }
        if (pList.length % 2 !== 0) {
            product = timesMod(product, pList[pList.length-1], n.pow(2))
        }
        let invTemp = (bigInt(4).times(delta).times(delta).times(theta).mod(n)).modInv(n)
        return timesMod(L(product, n), invTemp, n)
    }

    function timesMod(a, b, modulus) {
        // Modular multiplication. => (a.multiply(b)).mod(modulus).
        let temp = a.times(b)
        return temp.mod(modulus)
    }

    function L(x, n) {
        // Linear function L(x, n) = (x-1)/n .
        let temp = x.minus(1)
        return temp.divide(n)
    }

    try {
        const admin = await DechiffrementModel.findOne({})
        const vote = await VoteModel.findOne({})
        let delta = bigInt(vote.get("delta"))
        let n = bigInt(vote.get("clePub")[0])
        let indiceList = admin.get("indice")
        let decryptedList = admin.get("decryptedShare")
        let theta = bigInt(vote.get("clePub")[2])
        let muList = calculMu(indiceList, delta)
        let d = decrypt(decryptedList, muList, n, delta, theta)
        await DechiffrementModel.updateOne({},{ $set: { decryptValue: d.toString() }})
        
        return res.json({message:"Calcul de d effectuÃ© "})
    } catch(error) {
        console.log(error.toString())
        return res.json({ message: "Error" });
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


