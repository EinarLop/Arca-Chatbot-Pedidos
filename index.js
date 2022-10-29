const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config;

const app = express().use(body_parser.json());
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(8000 || process.env.PORT,()=>{
    console.log("jala")
});

app.get("/webhook",(req,res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    if (mode && token){
        if (mode === "subscribe" && token ===mytoken){
            res.status(200).send(challenge);
            
        }else{
            res.status(403);
        }
    }
});

app.post("/webhook", (req,res)=>{
    let body_param = req.body;

    console.log(JSON.stringify(body_param,null,2));

    if (body_param.entry &&
        body_param.entry[0].changes &&
        body_param.entry[0].changes[0].value.message &&
        body_param.entry[0].changes[0].value.message[0]
        ){
            let phone_no_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from;
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
            
            axios({
                method:"POST",
                url:"https://graph.facebook.com/v13.0/"+phone_no_id+"/messages?access_token="+token,
                data:{
                    messagin_product:"whatsapp",
                    to: from,
                    text:{
                        body: "Hi, im Alex"
                    }
                },
                headers : {
                    "Content-Type": "application/json"
                } 
            })
        res.sendStatus(200);
    }else{
        res.sendStatus(403);
    }
});