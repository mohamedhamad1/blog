const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/posts.controllers')

router.route('/')
    .get(postsControllers.getAllPosts)

router.route('/create')
    .post(postsControllers.createPost)

router.route('/delete/:id')
    .delete(postsControllers.deletePost)

router.route('/update/:id')
    .put(postsControllers.updatePost)

router.route('/:id')
    .get(postsControllers.getSinglePost)

module.exports = router