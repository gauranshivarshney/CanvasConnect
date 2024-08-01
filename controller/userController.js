const User = require('../models/user');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

const insertUser = async (req, res) => {
    try{
        const email = req.body.email;
        const username = req.body.username;
        const userData1 = await User.findOne({email: email});
        const userData2 = await User.findOne({username: username});
        if(userData1){
            return res.render('signup', {message2: "Email already exists"});
        }
        else if(userData2){
            return res.render('signup', {message2: "Username already exists"});
        }
        const spassword = await securePassword(req.body.password);
        const userData = new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: spassword,
            profilepic: req.file.filename
        });
        const data = await userData.save();
        if(data){
            res.render('login', {message: "Success!!"});
        }
        else{
            res.render('signup', {message: "Failed!!"});
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email: email});

        if(userData){
            const passMatch = await bcrypt.compare(password, userData.password);
            if(passMatch){
                req.session.user_id = userData._id;
                res.redirect("/userprofile");
            }
            else{
                res.render('login', {message1: "Email and password are incorrect"});
            }
        }
        else{
            res.render('login', {message1: "Email and password are incorrect"});
        }
    }
    catch(error){
        console.log(error.message);
    }
}


const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).send('Unable to logout');
        }
        res.redirect('/');
    });
};

const createUser = async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const username = req.body.username;
    const userData = await User.findOne({email: email, name: name, username: username});
    res.render('create', {user: userData});
}

module.exports = {
    insertUser,
    verifyLogin,
    logoutUser,
    createUser
}