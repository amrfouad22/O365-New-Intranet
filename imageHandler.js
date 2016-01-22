var express = require('express');
var request=require('request');
var base64=require('base64id').Base64;
var router = express.Router();

router.post('/', function(req, res) {
    //read the request url and try to get it from mongodb, if not try Office365 and put it in mongodb for further usage.
    var url=req.body.image;
    
    
    //get the item from SPO using same access token submitted by AngularJS SPA
    var weburl='https://insightme.sharepoint.com/sites/pub/news';
    //try to get it from cache first
    //get the image url and get the list folder
    url=url.replace(weburl,'');
    var index=url.lastIndexOf('/');
    var folder=url.substring(1,index);
    var file=url.substring(index+1);
    var fileUrl=weburl+"/_api/web/GetFolderByServerRelativeUrl('"+folder+"')/Files('"+file+"')/$value";
    var options = {
        url: fileUrl,
        headers: {
            'authorization': req.body.token
        }
    };
    //get file data from SharePoint online
    request.get(options,function(error,response,body){
        if (!error && response.statusCode == 200) {
            res.send(base64.encode(response.data));
        } 
        else{
            console.log("can't get SPO file..")
            res.sendStatus(403);
        }
    });
});

//disallow get request to images handler
router.get('/',function(req,res){
  //forbbiden
  res.sendStatus(403);
})

module.exports = router;