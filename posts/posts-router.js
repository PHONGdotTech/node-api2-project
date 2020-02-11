const express = require("express");
const Posts = require("../data/db.js");
const router = express.Router();

//post a post
router.post(`/`, (req, res)=>{
    if (!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
        Posts.insert(req.body)
        .then(insertedID => {
            res.status(201).json({...req.body, id: insertedID.id})
        })
        .catch(err =>{
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
    }
})

//post a comment
router.post(`/:id/comments`, (req, res)=>{
    if (!req.body.text){
        res.status(400).json({error: "Please provide text for the comment."})
    } else {
        Posts.findById(req.params.id)
        .then((post)=>{
            if (post.length === 0) {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            } else {
                Posts.insertComment({...req.body, post_id: req.params.id})
                .then(insertedID => {
                    res.status(201).json({id: insertedID.id, ...req.body})
                })
                .catch(err =>{
                    res.status(500).json({error:"There was an error while saving the comment to the database"})
                })
            }
        })
        .catch(err =>{
            res.status(500).json({error:"The post information could not be retrieved."})
        })
    }
})

//get all posts
router.get(`/`, (req, res)=>{
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err =>{
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

//get a specific post
router.get(`/:id`, (req, res)=>{
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length === 0){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(post)
        }
    })
    .catch(err =>{
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

//get all comments for a specific post
router.get(`/:id/comments`, (req, res)=>{
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length === 0){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            Posts.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments)
            })
            .catch(err =>{
                res.status(500).json({error: "The comments information could not be retrieved."})
            })
        }
    })
    .catch(err =>{
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

//delete a specific post
router.delete(`/:id`, (req, res)=>{
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length === 0){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            Posts.remove(req.params.id)
            .then(removedID => {
                res.status(200).json(removedID)
            })
            .catch(err =>{
                res.status(500).json({error: "The post could not be removed"})
            })
        }
    })
    .catch(err =>{
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

//update a specific post
router.put(`/:id`, (req, res)=>{
    Posts.findById(req.params.id)
    .then(post => {
        if (post.length === 0){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        } else {
            if (!req.body.title || !req.body.contents){
                res.status(404).json({error: "Please provide title and contents for the post."})
            } else {
                Posts.update(req.params.id, req.body)
                .then(updatedCount => {
                    res.status(200).json({id: req.params.id, ...req.body})
                })
                .catch(err =>{
                    res.status(500).json({error: "The post information could not be modified."})
                })
            }
        }
    })
    .catch(err =>{
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

module.exports = router;