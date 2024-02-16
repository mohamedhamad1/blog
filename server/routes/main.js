const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const isLogged = require('../../utiltes/isLogged');
const adminLayout = '../views/layouts/admin';
const userLayout = '../views/layouts/main';
const locals = {
    title: 'SwilamBlog',
    description: 'Swilam blog description',
}

/**
 * GET /
 * HOME
 */
router.get('/', async (req, res) => {
    try {
        
        let limit = req.query.limit || 10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(limit * page - limit).limit(limit).exec();
        const count = await Post.countDocuments(); //changeMe#1
        const nextPage = +page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / limit);
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }
})

/**
 * GET /
 * Post :postID
 */
router.get('/post/:postID',async (req, res)=>{
    try {
        let id = req.params.postID;
        const data = await Post.findById({ _id:id });
        locals.title = data.title
        res.render('post', {
            locals,
            data,
            currentRoute: '/post/'+id
        });
        locals.title = "SwilamBlog";
    } catch (error) {
        console.log(error);
    }
})

/**
 * POST /
 * Search
 */
router.post('/search',async (req, res)=>{
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
        res.render('search',{
            data,
            locals, currentRoute: '/search',
        });
        locals.title = "SwilamBlog";
    } catch (error) {
        console.log(error);
    }
})



router.get('/about', (req, res) => {
    locals.title = 'About'
    res.render('about',{
        locals,
        currentRoute: '/about'
    });
    locals.title = 'SwilamBlog'
})

router.get('/contact', (req, res) => {
    locals.title = 'Contact';
    res.render('contact',{
        locals,
        currentRoute: '/contact'
    });
    locals.title = 'SwilamBlog'
})

module.exports = router;