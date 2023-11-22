const express = require('express');
const path = require('path');
const urlRoute = require('./routes/url'); //importing route
const staticRoute = require("./routes/staticRouter");
const {connectToMongoDB} = require("./connect");
const URL = require('./models/url');
const app = express();
const PORT = 8001;
connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>console.log('Mongodb connected'));

//setting up ejs
app.set("view engine","ejs");
app.set('views', path.resolve("./views"));



//middleware
app.use(express.json());                       //to support form data
app.use(express.urlencoded({extended:false})); //to support form data
app.use("/url", urlRoute);
app.use("/", staticRoute);


app.get("/url/:shortId", async(req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {
                    timestamp : Date.now(),
                },
                    
            },
        }
    );
    res.redirect(entry.redirectURL);
});



app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`));

