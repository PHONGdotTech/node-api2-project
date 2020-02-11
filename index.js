const express = require("express");
const postsRouter = require("./posts/posts-router.js");

const server = express();

server.use(express.json());
server.use("/api/posts", postsRouter)

server.listen(5000, ()=>{
    console.log("Server is running on port 5000")
})