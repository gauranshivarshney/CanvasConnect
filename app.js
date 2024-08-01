const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const path = require('path');
const userController = require('./controller/userController');
const session = require('express-session');
const upload = require('./config/multerconfig');
const config = require("./config/config");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "mysession",
    resave: true,
    saveUninitialized: true
}));

app.get('/', async (req, res) => {
    const userData = await postModel.find().populate('user').populate('comments.user');
    res.render("index", {userData});
});

app.get('/create', userController.createUser);

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/usersignup', upload.single("image"), userController.insertUser);

app.post('/userlogin', userController.verifyLogin);

app.get('/userprofile', async (req, res) => {
    const user = await userModel.findById({_id:req.session.user_id});
    const userData = await postModel.find().populate('user').populate('comments.user');
    res.render('userprofile', {user, userData});
});

app.post('/post', upload.single("image"), async (req, res) => {
    const userId = req.session.user_id;
    const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        image: req.file.filename,
        user: userId
    });
    await newPost.save();
    res.redirect('userprofile');
});

app.get('/showpost', async (req, res) => {
    const userId = req.session.user_id;
    const posts = await postModel.find({user: userId});
    res.render('showpost', {posts});
});

app.get('/delete/:id', async (req, res) => {
    const post = await postModel.findOneAndDelete({_id:req.params.id});
    res.redirect('/showpost');
});

app.get('/edit/:userid', async (req, res) => {
    const user = await postModel.findOne({_id: req.params.userid});
    res.render("edit", {user});
});

app.post('/update/:userid', upload.single('image'), async (req, res) => {
    const {title, content} = req.body;
    const updateData = {
        title,
        content
    };
    if(req.file){
        updateData.image = req.file.filename;
    }
    const post = await postModel.findOneAndUpdate({_id: req.params.userid}, updateData, {new: true});
    await post.save();
    res.redirect('/showpost');
});

app.get('/like/:id', async (req, res) => {
    const userId = req.session.user_id;
    const post = await postModel.findById(req.params.id);
    if(post){
        if(post.likedBy.includes(userId)){
            post.likes -= 1;
            post.likedBy.pull(userId);
        } else{
            post.likes += 1;
            post.likedBy.push(userId);
        }
        await post.save();
    }
    res.redirect('/userprofile');
});

app.post('/comment/:id', async (req, res) => {
    const userId = req.session.user_id;
    const { content } = req.body;
    const post = await postModel.findById(req.params.id).populate('user');
    if(post){
        post.comments.push({user: userId, content});
        await post.save();
    }
    res.redirect('/userprofile');
});

app.post('/deleteComment/:postId/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.session.user_id;
    const post = await postModel.findById(postId);
    const comment = post.comments.id(commentId);
    if (comment.user.toString() === userId) {
        post.comments.pull(commentId);
        await post.save();
        res.redirect('/userprofile');
    } 
});

app.get('/logout', userController.logoutUser);

app.listen(3000);