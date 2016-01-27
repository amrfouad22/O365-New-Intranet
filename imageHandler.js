var express = require('express');
var request=require('request');
var redis=require('redis');
var fs = require('fs');
var uuid = require('node-uuid');
var router = express.Router();

router.post('/', function(req, res) {
    //read the request url and try to get it from redis cache, if not try Office365 and put it in mongodb for further usage.
    var url=req.body.image;
    var fileName=url.substring(url.lastIndexOf('/')+1);
    var cachedImagesFolder='/public/CachedImages/';
    //create redis client
    var client = redis.createClient();
    client.on('connect',function(){  
        //try to get the value from redis  
        client.get(req.body.image,function(err,reply){
            if(err){ //redis cache is not available 
                res.sendStatus(500);
                return;
            }
            //value doesn't exists , try to get it from SPO
            if(!reply)
            {
                console.log(err);
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
                    },
                    encoding:'binary'
                };
                //get file data from SharePoint online
                request.get(options,function(error,response,body){
               
                    if (!error && response.statusCode == 200) {

                        //save file to the cachedImages folder sync
                        //full file name
                        var uniqueFileName=uuid.v4()+'_'+fileName;
                        fs.writeFileSync(__dirname+cachedImagesFolder+uniqueFileName,response.body,'binary');
                        //save the result to redis cache
                        client.set(req.body.image,uniqueFileName);
                        res.send(uniqueFileName);
                    } 
                    else{
                        console.log("can't get SPO file..")
                        res.sendStatus(403);
                    }
                });
            }
            //if the value is retrieved send the reply
            else{
                res.send(reply);
            }
        });
       
    });
});

//disallow get request to images handler
router.get('/',function(req,res){
  //forbbiden
  res.sendStatus(403);
})
module.exports = router;