const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const {response} = require("express");


const app = express();
app.use(express.json());
app.use(cors());
app.listen(3001, ()=>{
    console.log("server listening on port 3001")
})

app.post('/login', (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user: "dupa", hasz:"60a5d3e4100fe8afa5ee0103739a45711d50d7f3ba7280d8a95b51f5d04aa4b8" }));
})

