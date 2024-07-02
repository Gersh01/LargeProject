require('express');
require('mongodb');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000;
const appName = "http://www.dev-fusion.com";
const frontend = "http://www.dev-fusion.com";

const ObjectId = require('mongodb').ObjectId;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        var username = payload.username;
        req.username = username;
        var rememberMe = payload.rememberMe;
        req.rememberMe = rememberMe;
        var newToken;
        var newPayload = { username, rememberMe };
        if (payload.rememberMe) {
            newToken = jwt.sign(newPayload, process.env.SECRET_KEY, { expiresIn: "1w" });
        }
        else {
            newToken = jwt.sign(newPayload, process.env.SECRET_KEY, { expiresIn: "1h" });
        }
        res.cookie("token", newToken, {
            httpOnly: true,
            path: '/'
        });
        next();
    } catch (e) {
        res.clearCookie("token");
        return res.status(403).json({ error: "token is not valid" });
    }
}

//APIs
exports.setApp = function (app, client) {

    //login api
    app.post('/api/login', async (req, res, next) => {
        var id = -1;
        var firstName = '';
        var lastName = '';
        var email = '';
        var username = '';
        var bio = '';
        var technologies = [];
        var error = '';
        var login = req.body.login;
        var password = req.body.password;
        var rememberMe = req.body.rememberMe;
        var db;

        if (rememberMe == null || rememberMe == undefined) rememberMe = false;

        var resultsUsername;
        var resultsEmail;

        var resultsUsernameUnverified;
        var resultsEmailUnverified;
        try {
            db = client.db('DevFusion');
            resultsUsername = await db.collection('Users').find({ username: login }).toArray();
            resultsEmail = await db.collection('Users').find({ email: login }).toArray();
            resultsUsernameUnverified = await db.collection('UnverifiedUsers').find({ username: login }).toArray();
            resultsEmailUnverified = await db.collection('UnverifiedUsers').find({ email: login }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, error: error };
            res.status(500).json(ret);
        }

        if (resultsUsername.length > 0) { //Login matched a verified user's username
            if (resultsUsername[0].password === password) { //Password matched
                id = resultsUsername[0]._id;
                firstName = resultsUsername[0].firstName;
                lastName = resultsUsername[0].lastName;
                confirmation = resultsUsername[0].confirmation;
                email = resultsUsername[0].email;
                username = resultsUsername[0].username;
                bio = resultsUsername[0].bio;
                technologies = resultsUsername[0].technologies;
                const payload = { username, rememberMe };
                if (rememberMe) {
                    token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1w" });
                }
                else {
                    token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
                }
                res.cookie("token", token, {
                    httpOnly: true,
                    path: '/'
                });
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, token: token, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            }
        } else if (resultsEmail.length > 0) { //Login matched a verified user's email
            if (resultsEmail[0].password === password) { //Password matched
                id = resultsEmail[0]._id;
                firstName = resultsEmail[0].firstName;
                lastName = resultsEmail[0].lastName;
                confirmation = resultsEmail[0].confirmation;
                email = resultsEmail[0].email;
                username = resultsEmail[0].username;
                bio = resultsEmail[0].bio;
                technologies = resultsEmail[0].technologies;
                const payload = { username, rememberMe };
                var token;
                if (rememberMe) {
                    token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1w" });
                }
                else {
                    token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
                }
                res.cookie("token", token, {
                    httpOnly: true,
                    path: '/'
                });
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, token: token, error: error };
                res.status(200).json(ret);
            } else { //Password did not match
                error = "password is wrong";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            }
        } else if (resultsUsernameUnverified.length > 0) { //Login matched an unverified user's username
            if (resultsUsernameUnverified[0].password === password) { //Password matched
                id = resultsUsernameUnverified[0]._id;
                firstName = resultsUsernameUnverified[0].firstName;
                lastName = resultsUsernameUnverified[0].lastName;
                confirmation = resultsUsernameUnverified[0].confirmation;
                email = resultsUsernameUnverified[0].email;
                username = resultsUsernameUnverified[0].username;
                bio = resultsUsernameUnverified[0].bio;
                technologies = resultsUsernameUnverified[0].technologies;
                error = "User is not verified";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            } else {
                error = "password is wrong";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            }

        } else if (resultsEmailUnverified.length > 0) { //Login matched an unverified user's email
            if (resultsEmailUnverified[0].password === password) { //Password matched
                id = resultsEmailUnverified[0]._id;
                firstName = resultsEmailUnverified[0].firstName;
                lastName = resultsEmailUnverified[0].lastName;
                confirmation = resultsEmailUnverified[0].confirmation;
                email = resultsEmailUnverified[0].email;
                username = resultsEmailUnverified[0].username;
                bio = resultsEmailUnverified[0].bio;
                technologies = resultsEmailUnverified[0].technologies;
                error = "User is not verified";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            } else {
                error = "password is wrong";
                var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
                res.status(401).json(ret);
            }
        } else { //Login did not match any user
            error = "Login did not match any user";
            var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
            res.status(404).json(ret);
        }

    });

    //register api
    app.post('/api/register', async (req, res, next) => {
        var db;
        var resultsUsername;
        var resultsEmail;
        var resultsUsernameUnverified;
        var resultsEmailUnverified;

        const { firstName, lastName, password, username, email } = req.body;
        var timeCreated = new Date();
        var error = '';

        try {
            db = client.db('DevFusion');
            resultsUsername = await db.collection('Users').find({ username: username }).toArray();
            resultsEmail = await db.collection('Users').find({ email: email }).toArray();
            resultsUsernameUnverified = await db.collection('UnverifiedUsers').find({ username: username }).toArray();
            resultsEmailUnverified = await db.collection('UnverifiedUsers').find({ email: email }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }


        if (resultsUsername.length == 0 && resultsEmail.length == 0 && resultsUsernameUnverified.length == 0 && resultsEmailUnverified.length == 0) {
            try {
                const payload = { email };
                const emailToken = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "1d" });
                const newUser = {
                    firstName: firstName, lastName: lastName, password: password, username: username, email: email, timeCreated: timeCreated, bio: "",
                    technologies: [], emailToken: emailToken
                };
                const result = db.collection('UnverifiedUsers').insertOne(newUser);
                transporter.sendMail({
                    to: email,
                    subject: 'Dev Fusion Email Confirmation',
                    html: `<h3>Please click <a href=${appName}/api/verify_email/${emailToken}>this link</a> to confirm your email</h3>`
                }).then(() => {
                    console.log("email sent");
                }).catch(err => {
                    console.error(err);
                });
                var ret = { error: error };
                return res.status(201).json(ret);
            } catch (e) {
                error = e.toString();
                var ret = { error: error };
                return res.status(500).json(ret);
            }
        } else if (resultsUsername.length != 0 || resultsUsernameUnverified.length != 0) { //Username is taken
            error = "username is taken";
            var ret = { error: error };
            return res.status(403).json(ret);
        } else { //Email is taken
            error = "email is taken";
            var ret = { error: error };
            return res.status(403).json(ret);
        }
    });

    //resend verification email api
    app.post('/api/resend_verification_email', async (req, res, next) => {
        var db;
        var resultEmail;
        var resultEmailUnverified;
        const email = req.body.email;
        try {
            db = client.db('DevFusion');
            resultEmail = await db.collection('Users').findOne({ email: email });
            resultEmailUnverified = await db.collection('UnverifiedUsers').findOne({ email: email });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (resultEmail != null || resultEmail != undefined) return res.status(401).json({ error: "User is already verified" });
        else if (resultEmailUnverified != null | resultEmailUnverified != undefined) {
            const emailToken = resultEmailUnverified.emailToken;
            transporter.sendMail({
                to: email,
                subject: 'Dev Fusion Email Confirmation',
                html: `<h3>Please click <a href=${appName}/api/verify_email/${emailToken}>this link</a> to confirm your email</h3>`
            }).then(() => {
                console.log("email resent");
            }).catch(err => {
                console.error(err);
                var ret = { error: error };
                return res.status(500).json(ret);
            });
            return res.status(200).json({ error: "" });
        } else return res.status(404).json({ error: "User not found" });
    });

    //verify email api
    app.get('/api/verify_email/:token', async (req, res, next) => {
        const emailToken = req.params.token;
        var payload;
        var email;
        try {
            payload = jwt.verify(emailToken, process.env.EMAIL_SECRET);
            email = payload.email;
        } catch (e) {
            return res.status(403).json({ error: "email token is not valid" });
        }

        var id = -1;
        var firstName = '';
        var lastName = '';
        var username = '';
        var password = '';
        var bio = '';
        var technologies = [];
        var error = '';

        var db;
        var resultsEmail;
        var resultsEmailUnverified;
        try {
            db = client.db('DevFusion');
            resultsEmail = await db.collection('Users').find({ email: email }).toArray();
            resultsEmailUnverified = await db.collection('UnverifiedUsers').find({ email: email }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (resultsEmail.length > 0) { //emailToken matched a verified user's email
            error = 'user is already verified';
            var ret = { error: error };
            return res.status(400).json(ret);
        } else if (resultsEmailUnverified.length > 0) { //emailToken matched an unverified user's email
            _id = resultsEmailUnverified[0]._id;
            password = resultsEmailUnverified[0].password;
            firstName = resultsEmailUnverified[0].firstName;
            lastName = resultsEmailUnverified[0].lastName;
            username = resultsEmailUnverified[0].username;
            bio = resultsEmailUnverified[0].bio;
            technologies = resultsEmailUnverified[0].technologies;
            var insertResult;
            var deleteResult;
            const newUser = {
                firstName: firstName, lastName: lastName, password: password, username: username, email: email, bio: bio, technologies: technologies
            };
            try {
                insertResult = await db.collection('Users').insertOne(newUser);
                deleteResult = await db.collection('UnverifiedUsers').deleteOne({ _id: _id });
                //if successful verification redirect 
                return res.redirect("/verified-user");
                // return res.status(200).json({ error: "" });
                // return res.redirect('/');
            } catch (e) {
                a
                error = e.toString;
                var ret = { error: error };
                return res.status(500).json(ret);
            }
        } else { //emailToken did not match any user
            error = "Email did not match any user";
            var ret = { error: error };
            return res.status(404).json(ret);
        }
    });

    //get user api
    app.get('/api/users', cookieJwtAuth, async (req, res, next) => {
        const { userId } = req.body;
        var firstName = '';
        var lastName = '';
        var email = '';
        var username = '';
        var bio = '';
        var technologies = [];
        var error = '';

        var db;
        var result;

        if(userId.length != 24) return res.status(400).json({error: "userId must be 24 characters"});
        const nid = new ObjectId(userId);

        try {
            db = client.db('DevFusion');
            result = await db.collection('Users').find({ _id: nid }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (result.length > 0) {
            firstName = result[0].firstName;
            lastName = result[0].lastName;
            confirmation = result[0].confirmation;
            email = result[0].email;
            username = result[0].username;
            bio = result[0].bio;
            technologies = result[0].technologies;
            var ret = { firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
            return res.status(200).json(ret);
        } else {
            error = 'user not found'
            var ret = { error: error };
            return res.status(404).json(ret);
        }

    });

    //update user api
    app.put('/api/users', cookieJwtAuth, async (req, res, next) => {
        var error = '';
        var userId = req.body.userId;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var bio = req.body.bio;
        var technologies = req.body.technologies;


        if (userId.length != 24) return res.status(400).json({ error: "userId must be 24 characters" });
        const nid = new ObjectId(userId);

        var db;
        var resultFind;

        try {
            db = client.db('DevFusion');
            resultFind = await db.collection('Users').findOne({ _id: nid });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (resultFind == null || resultFind == undefined) return res.status(404).json({ error: "user with the userId does not exist" });
        if (req.username != resultFind.username) return res.status(403).json({ error: "signed in user does not have access to the given user" });

        if (firstName == undefined || firstName == null) firstName = resultFind.firstName;
        if (lastName == undefined || lastName == null) lastName = resultFind.lastName;
        if (bio == undefined || bio == null) bio = resultFind.bio;
        if (technologies == undefined || technologies == null) technologies = resultFind.technologies;

        var resultPut;
        var query = { _id: nid };
        var newValues = { $set: { firstName: firstName, lastName: lastName, bio: bio, technologies: technologies } };

        try {
            db = client.db('DevFusion');
            resultPut = await db.collection('Users').updateOne(query, newValues);
            return res.status(200).json({ error: error });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }
    });

    app.post('/api/users/password', cookieJwtAuth, async (req, res, next) => {
        const username = req.username;
        var error = '';

        var db;
        var resultFind;

        try {
            db = client.db('DevFusion');
            resultFind = await db.collection('Users').findOne({ username: username });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        const userId = resultFind._id;
        const payload = { userId };
        var token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15m" });
        res.cookie("userIdToken", token, {
            httpOnly: true
        });

    });

    //logout api
    app.post('/api/logout', cookieJwtAuth, async (req, res, next) => {
        res.clearCookie("token");
        res.status(200).json({});
    });

    //forgot_password api that sends the email
    app.post('/api/forgot_password/send', async (req, res, next) => {
        var db;
        const email = req.body.email;
        var result;
        var resultUnverified;
        try {
            db = client.db('DevFusion');
            result = await db.collection('Users').findOne({ email: email });
            resultUnverified = await db.collection('UnverifiedUsers').findOne({ email: email });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (resultUnverified != null || resultUnverified != undefined) return res.status(403).json({ error: "User is not verified" });
        if (result == null || result == undefined) return res.status(404).json({ error: "User not found" });

        const userId = result._id;
        const oldPassword = result.password;
        const combinedKey = process.env.EMAIL_SECRET + oldPassword;
        var payload = {};
        var token = jwt.sign(payload, combinedKey, { expiresIn: "1d" });


        transporter.sendMail({
            to: email,
            subject: 'Dev Fusion Reset Password',
            html: `<h3>Please click <a href=${appName}/api/forgot_password/email/${userId}/${token}>this link</a> to confirm your email</h3>`
        }).then(() => {
            console.log("password reset email sent");
        }).catch(err => {
            console.error(err);
            var ret = { error: error };
            return res.status(500).json(ret);
        });

        return res.status(200).json({ error: "" });

    });

    app.post('/api/forgot_password/reset', async (req, res, next) => {
        const newPassword = req.body.newPassword;
        var db;
        try {
            db = client.db('DevFusion');
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        const token = req.cookies.userIdToken;
        var payload;
        var userId;
        try {
            payload = jwt.verify(token, process.env.SECRET_KEY);
            userId = payload.userId;
        } catch (e) {
            res.clearCookie("userIdToken");
            return res.status(403).json({ error: "Token is not valid" });
        }

        if (userId.length != 24) return res.status(400).json({ error: "userId must be 24 characters" });
        const nid = new ObjectId(userId);
        var resultFind;
        try {
            resultFind = await db.collection('Users').findOne({ _id: nid });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (resultFind == null || resultFind == undefined) return res.status(404).json({ error: "User not found" });

        var resultPut;
        var query = { _id: nid };
        var newValues = { $set: { password: newPassword } };

        try {
            resultPut = await db.collection('Users').updateOne(query, newValues);
            return res.status(200).json({ error: "" });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

    });

    //forgot_password api for when the user clicks on the link on email
    app.get('/api/forgot_password/email/:userId/:token', async (req, res, next) => {
        const combinedToken = req.params.token;
        const userId = req.params.userId;
        if (userId.length != 24) return res.status(400).json({ error: "userId must be 24 characters" });
        const nid = new ObjectId(userId);
        var db;
        var result;
        try {
            db = client.db('DevFusion');
            result = await db.collection('Users').findOne({ _id: nid });
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            return res.status(500).json(ret);
        }

        if (result == null || result == undefined) return res.status(404).json({ error: "User not found" });

        const oldPassword = result.password;
        const combinedKey = process.env.EMAIL_SECRET + oldPassword;

        try {
            var payloadVerify = jwt.verify(combinedToken, combinedKey);
        } catch (e) {
            return res.status(403).json({ error: "Token is not valid" });
        }

        const payload = { userId };
        var token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15m" });
        res.cookie("userIdToken", token, {
            httpOnly: true
        });

        return res.redirect("/reset-password");
        // return res.status(200).json({ error: "" });
        // return res.redirect('/');


    });

    //api to test jwt authentication
    app.post('/api/jwtTest', cookieJwtAuth, async (req, res, next) => {
        var id = -1;
        var firstName = '';
        var lastName = '';
        var email = '';
        var bio = '';
        var technologies = [];
        var error = '';

        const username = req.username;

        var db;
        var result;

        try {
            db = client.db('DevFusion');
            result = await db.collection('Users').find({ username: username }).toArray();
        } catch (e) {
            error = e.toString;
            var ret = { error: error };
            res.status(500).json(ret);
        }

        if (result.length > 0) {
            id = result[0]._id;
            firstName = result[0].firstName;
            lastName = result[0].lastName;
            confirmation = result[0].confirmation;
            email = result[0].email;
            bio = result[0].bio;
            technologies = result[0].technologies;
            var ret = { id: id, firstName: firstName, lastName: lastName, email: email, username: username, bio: bio, technologies: technologies, error: error };
            res.status(200).json(ret);
        } else {
            error = "username does not exist";
            var ret = { error: error };
            res.status(404).json(ret);
        }
    });

}
