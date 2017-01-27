module.exports = function(app, db){
    
    app.route('/:url').get(readURL);
    
    app.get('/new/:url*', createURL);
    
    
    function readURL(req, res){
        var url = process.env.APP_URL + req.params.url;
        if (url != process.env.APP_URL + 'favicon.ico'){
            search(url, db, res);
        }
    }
    
    
    function search(url, db, res){
        var webs = db.collection('websites');
        
        webs.findOne({"short_url" : url}, function(err, result){
            
            if (err) throw err; 
            
            if (result){
                
                console.log("Got : " + result);
                res.redirect(result.original_url);
                
            } else {
                
                res.send({"error: url is not in database"});
                
            }
            
        });
        
    }
    
    function valid(url){
        //Regex from https://gist.github.com/dperini/729294
        // checks if the format of url is valid 
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regex.test(url);
    }
    
    
    function genNum(){
        var num = Math.floor( Math.random() * 900000 + 100000);
        return num.toString().substring(0, 4);
    }
    
    
    
    function save(obj, db){
        var webs = db.collection("websites");
        webs.save(obj, function(err, result){
            
            if (err) throw err;
            console.log("Entered into db: " + result);
            
        });
    }
    
    
    function createURL(req, res){
        var url = req.url.slice(5);
        
        var sentObj = {}; 
        
        if(valid(url)){
            sentObj = {"original_url" : url, "short_url" : process.env.APP_URL + genNum()};
            res.send(sentObj);
            save(sentObj, db); 
        } else {
            sentObj = {"error" : "Wrong format"};
            res.send(sentObj);
        }
  
    } //end createURL
 
};