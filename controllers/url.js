const ShortUniqueId = require('short-unique-id');
const URL = require('../models/url'); //acquiring database

async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:'url is required'});
    const uid = new ShortUniqueId();
    const ShortID = uid.rnd(6);
    await URL.create({
        shortId : ShortID,
        redirectURL: body.url,
        visitHistory:[],
    }); //creating new user

    return res.render('home', {
        id: ShortID,
    })
    

    
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length, 
        analytics: result.visitHistory, });

}

async function handleDeleteURL(req,res){
    const shortId = req.params.shortId;
    await URL.findOneAndDelete(shortId);
    return res.json({status : "Successfully deleted"});
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL,
}