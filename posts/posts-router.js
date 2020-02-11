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
            console.log(err)
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
    }
    
})

//post a comment
router.post(`/:id/comments`, (req, res)=>{
    Posts.insertComment(req.body)
    .then(insertedID => {
        res.status(201).json(insertedID)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

//get all posts
router.get(`/`, (req, res)=>{
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

//get a specific post
router.get(`/:id`, (req, res)=>{
    Posts.findById(req.params.id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

//get all comments for a specific post
router.get(`/:id/comments`, (req, res)=>{
    Posts.findPostComments(req.params.id)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

//delete a specific post
router.delete(`/:id`, (req, res)=>{
    Posts.remove(req.params.id)
    .then(removedID => {
        res.status(200).json(removedID)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

//update a specific post
router.put(`/:id`, (req, res)=>{
    Posts.update(req.params.id, req.body)
    .then(updatedCount => {
        res.status(200).json(updatedCount)
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({errorMessage: "error message"})
    })
})

module.exports = router;