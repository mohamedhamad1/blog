const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const adminLayout = '../views/layouts/admin';
const userLayout = '../views/layouts/main';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const locals = {
    title: 'Admin',
    description: 'nodejs blog description',
}
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(401, { msg: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decoded.userId;
        next();
    } catch (error) {
        res.json(401, { msg: 'Unauthorized' })
    }
}

/**
 * GET /
 * Admin - Panel Page
 */
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        res.render('admin/index', { locals, layout: adminLayout, });
    } catch (error) {
        console.log(error);
    }
})

/**
 * GET /
 * Admin - Login Page
 */
router.get('/login', async (req, res) => {
    try {
        locals.title = 'Login'
        res.render('admin/login', { locals, layout: userLayout, currentRoute: '/login' });
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
})

/**
 * Post /
 * Admin - Check Login Credentials
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            res.json(401, { msg: 'invalid credentials' })
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            res.json(401, { msg: 'invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }
})

/**
 * 
 * Admin - Check Login
 */

/**
 * GET /
 * Admin - Register Page
 */
router.get('/register',authMiddleware, async (req, res) => {
    try {
        locals.title = 'Register'
        res.render('admin/register', { locals, layout: adminLayout });
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
});

/**
 * Post /
 * Admin - Check Register
 */
router.post('/register',authMiddleware, async (req, res) => {
    try {
        const userExisted = await User.findOne({ email: req.body.email });
        if (userExisted) {
            return res.json(500, { msg: 'user already exists' })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        })
        await newUser.save();
        res.redirect('/users');
    } catch (error) {
        console.log(error);
        res.json(500, { msg: 'internal erver error' })
    }
});

/**
 * GET /
 * Admin - Posts
 */
router.get('/posts', authMiddleware, async (req, res) => {
    try {
        const data = await Post.find();
        locals.title = 'Posts'
        res.render('admin/posts', {
            locals,
            data,
            layout: adminLayout
        });
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Posts
 */
router.get('/posts/:postID',authMiddleware, async (req, res) => {
    try {
        let id = req.params.postID;
        const data = await Post.findById({ _id: id });
        locals.title = data.title
        res.render('admin/admin-posts', {
            locals,
            data,
            currentRoute: '/post/' + id,
            layout: adminLayout
        });
        locals.title = "nodejs blog";
    } catch (error) {
        console.log(error);
    }
})

/**
 * GET /
 * Admin - Create Post Page
 */
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        locals.title = 'Create Post'
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        })
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST /
 * Admin - Create Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            });
            await Post.create(newPost);
            res.redirect('/posts')
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Edit Post Page
 */
router.get('/edit-post/:postID', authMiddleware, async (req, res) => {
    try {
        const postID = req.params.postID;
        const data = await Post.findById({ _id: postID });
        locals.title = 'Edit Post'
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
});

/**
 * PUT /
 * Admin - Edit Post
 */
router.put('/edit-post/:postID', authMiddleware, async (req, res) => {
    try {
        await Post.updateOne({ _id: req.params.postID }, { $set: { ...req.body, updatedAt: Date.now() } })
        res.redirect('/posts')
    } catch (error) {
        console.log(error);
    }
});

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete('/delete-post/:postID', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.postID });
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Logout
 */
router.get('/logout', authMiddleware, async (req, res) => {
    try {
        res.clearCookie('token');

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - About
 */
router.get('/admin-about', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = decoded.userId;
        const data = await User.findById({ _id: userId })
        res.render('admin/admin-about', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Users
 */
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;
        const data = await User.find();
        locals.title = 'Users'
        res.render('admin/users', {
            locals,
            data,
            userId,
            layout: adminLayout
        });
        locals.title = 'Admin'
    } catch (error) {
        console.log(error);
    }
});

/**
 * DELETE /
 * Admin - Delete User
 */
router.delete('/delete-user/:postID', authMiddleware, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.postID });
        res.redirect('/users');
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Admin - Search
 */
router.post('/admin-search',authMiddleware,async (req, res)=>{
    try {
        let searchTerm = req.body.searchTerm;
        const searchFiltered = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        const data = await Post.find({
            $or:[
                {title:{$regex: new RegExp(searchFiltered, 'i')}},
                {body:{$regex: new RegExp(searchFiltered, 'i')}},
            ]
        })
        locals.title = "Search"
        res.render('admin/search',{
            data,
            locals, currentRoute: '/admin-search',
            layout: adminLayout
        });
        locals.title = "Admin";
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;