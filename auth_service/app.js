const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const firebase = require("firebase");
const { nanoid } = require('nanoid');
require("firebase/firestore");

// initialize firebase access
firebase.initializeApp({
    apiKey: "AIzaSyCtx7BlaJUKKeqo2F1_IkKRQRd2L4Jvz3c",
    authDomain: "c01-project-8d228.firebaseapp.com",
    projectId: "c01-project-8d228",
    storageBucket: "c01-project-8d228.appspot.com",
    messagingSenderId: "897445501911",
    appId: "1:897445501911:web:b543b8b7484d2000ea0992",
    measurementId: "G-TDZ7VP3BKY"
})
var db = firebase.firestore();

// create the express app and configure all the middle ware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

SALT_ROUNDS = 5;
TOKEN_SECRET = "hahaMYSeCR3TiSA-A7iN6";

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);

    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// ###########################################################################
// ---------------------------------------------------------------------------
// ##################### APPLICATION ROUTES AND LOGIC ########################
// ---------------------------------------------------------------------------
// ###########################################################################

app.post('/register', async (req, res) => {
    try {
        let { firstname, lastname, username, email, password, bio } = req.body;

        querySnapShot = await db.collection('users').where('email', '==', email).get();
        // check if the result is non-empty email already taken
        if (querySnapShot.docs.length !== 0) {
            console.log("NOT added")
            res.status(400).end();
            //json({: user_insert.insertedCount});
        } else {
            let uid = nanoid();
            db.collection('users').doc(uid).set({
                uid,
                username,
                email,
                bio,
                firstname,
                lastname,
                role: 'inaccessible',
                password: bcrypt.hashSync(password, SALT_ROUNDS),
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            }).then((docRef) => {
                console.log("added")
                res.json({status: 'success'});
            })
            .catch((error) => {
                res.status(400);
                res.end();
            });
        }
    } catch (err) {
        res.status(400);
        res.end();
    }
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        let userResult = await db.collection('users').where('email', '==', email).get();
        // check user exists
        if (userResult.docs.length !== 1) {
            res.status(404).end("email does not exist");
        } else {
            userResult.forEach((doc) => {
                userDoc = doc.data();
            })
            if (bcrypt.compareSync(password, userDoc.password)) {
                let token = jwt.sign({userID: userDoc.uid}, TOKEN_SECRET, { expiresIn: '1h' });
                return res.json({userID: userDoc.uid, username: userDoc.username, role: userDoc.role, authToken: token});
            } else {
                return res.status(401).end("incorrect password");
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500); // db operation failed 
    }
});

app.post('/logout', async (req, res) => {
    // const authHeader = req.headers['authorization'];
    // expiredTokens.push(authHeader.split(' ')[1]);
    return res.status(200).json({});
});

app.post('/verify', async (req, res) => {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log("expired token" , token);
            return res.status(401).json({});
        } else {
            console.log("valid token" , token);
            return res.status(200).json({});
        }
    });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));