const express = require('express');
jsSHA = require('jssha');
btoa = require('btoa');
fs = require('fs');
const commandLineArgs = require('command-line-args');
var tokenGenerated = false;
var vCardFileSpecified = false;

const app = express()
const port = 5055

// res.send('Hello World!')

app.get('/generateToken', (req, res) => {

    let username = req.query.username;


    let token = generateToken(username, "");



    res.send({
        token: token
    })
})


function generateToken(userName, vCard) {
    let appID = "ec3df6.vidyo.io";
    let key = " 81cb90487fe945a0b07f3664966edda3";
    let expiresInSeconds = 1800;

    var EPOCH_SECONDS = 62167219200;
    var expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
    var shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(key, "TEXT");
    jid = userName + '@' + appID;
    var body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00' + vCard;
    shaObj.update(body);
    var mac = shaObj.getHMAC("HEX");
    var serialized = body + '\0' + mac;
    console.log("\nGenerated Token: \n" + btoa(serialized));
    return btoa(serialized);
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))