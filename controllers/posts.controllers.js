const Post = require('../models/posts.model.js')
const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find({});
        res.json({status:'success',code:200,error:null,data:posts})
    } catch (error) {
        console.log(error);
        res.json({status:'error',code:500,error,data:null})
    }
}
const getSinglePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.json({status:'success',code:200,error:null,data:post})
    } catch (error) {
        console.log(error);
        res.json({status:'error',code:500,error,data:null})
    }
}
const createPost = async(req,res)=>{
    try {
        const newPost = Post({
            title: req.body.title,
            desc: req.body.desc,
            user_id: '111',
            user_name: 'name',
        })
        await newPost.save();
        res.json({status:'success',code:201,error:null,data:newPost});
    } catch (error) {
        console.log(error);
        res.json({status:'error',code:500,error,data:null})
    }
}
const deletePost = async(req,res)=>{
    try {
        await Post.deleteOne({_id:req.params.id})
        res.json({status:'success', code:200, error:null, data:null})
    } catch (error) {
        console.log(error);
        res.json({status:'error',code:500,error,data:null})
    }
}
const updatePost = async(req,res)=>{
    try {
        const newData = {
            title: req.body.title,
            desc: req.body.desc,
        }
        const updatedPost = await Post.updateOne({_id:req.params.id},{$set:{...newData}})
        res.json({status:'success', code:200, error:null, data:updatedPost})
    } catch (error) {
        console.log(error);
        res.json({status:'error',code:500,error,data:null})
    }
}
module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    deletePost,
    updatePost
}