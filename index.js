require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
mongoose
    .connect(process.env.dburi)
    .then(()=>{console.log('db connect successfully');})
    .catch((err)=>{console.log(err);})
const Flag = require('./model')
const bodyparser = require('body-parser')
const app = express()

app.set('view engine', 'ejs')
app.use(bodyparser.json())
app.use(express.static('public'))

app.get('/',(req, res)=>{
    res.render('home')
})
app.post('/',async(req, res)=>{
    const farmerStatus = req.body.farmerStatus
    if(farmerStatus === 'full'){
        res.json({message:'GREAT!!!',color:'green'})
    }else if(farmerStatus === 'half'){
        res.json({message:'WE WILL SEE IT',color:'red'})
    }else{
        const output = await Flag.findOne({flag:farmerStatus})
        console.log(output);
        if(!output){
            res.json({message:'Hmmm, Can U Exploit it!?'})
        }else{
            res.json(output)
        }
    }
})
app.get('/evil',(req,res)=>{
    res.send('Farmer{0k, U are H2cker nOw, St0p FUZZ Me}')
})
app.all('*',(req, res)=>{
    res.status(404).send('<h1>Congratulation you found the FLAG...<br>Hhhh Sorry i kidding you, 404 PageNotFound<br>Go to where you came \.\')</h1>')
})

app.listen(6001||process.env.port, ()=>{
    console.log(`server run on http://localhost:${process.env.port}/`);
}) 