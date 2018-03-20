var express = require('express'); // Express web server framework
var app = express();
app.use(express.static(__dirname));

var $ = require('jQuery');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var session = require('client-sessions');
app.use(session({
cookieName: 'session',
secret: '!PH@r0S!',
duration: 30 * 60 * 1000,
activeDuration: 5 * 60 * 1000
}));


console.log('Listening on 8888');
app.listen(process.env.PORT || 8888);

var database = require('./controllers/database');

var db = new database.Database();
app.get('/', function (req, res){
    res.write("<html><body>");
    if(req.session.msg){
        res.write(req.session.msg);
        delete req.session.msg;
    }
    
res.write(`
    <form method=post action='/login'>
    <input type=text id=username name=username>
    <input type=password name=password>
    <input type=submit value=Login>
    </form>
    </body>
    </html>`);
    res.send();
});


app.post('/login', function (req, res){
    db.once('loggedin', function(msg){
        if(msg==1){
            req.session.userid=req.body.username;
            return res.redirect('/main');
        }
        else{
            req.session.msg = "Invalid login";
            return res.redirect('/');
        }
    });
    
    db.login(req.body.username, req.body.password);
});

app.get('/main', function(req,res){
    
    if(!req.session.userid){
        req.session.msg = 'Not allowed there';
        return res.redirect('/');
        }
    
    var user = req.session.userid;
    
    db.once('gotId', function(rows){
        var id = rows[0].id;
        console.log("id: " + id);
        
        db.displayEntries(id);
    });

    db.once('gotEntries', function(rows){
       var str = "Hello, " + req.session.userid + "<br><br> Your Concerts - <br>";
        for(var i=0; i < rows.length; i++){
            str+="<br><div class=concert-chunk><form method=post action='/editEntry'>Artist: <input type=hidden name=headliner value='"+ rows[i].headliner +"'>" + rows[i].headliner + "<br> Date: <input type=hidden name=concertDate value=" + rows[i].concert_date + ">" + rows[i].concert_date + "<br> Time: <input type=hidden name=concertTime value='" + rows[i].concert_time + "'>" + rows[i].concert_time + 
                "<br> Venue: <input type=hidden name=venue value='"+ rows[i].venue + "'>" + rows[i].venue + "<br><input type=submit value='Edit Concert'></form></div>"
        }
       
        res.send("<html><body>" + str + "<form method=post action='/logout'><input type=submit value=Logout></form><form method=post action='/addConcert'><input type=submit value='Add Concert'></form></body></html>");
    });
    
    db.getId(user);

});

app.post('/logout', function (req, res){
    req.session.reset();
    req.session.msg = 'You logged out';
    return res.redirect('/');
});

//redirect to search page
app.post('/addConcert', function(req,res){
    if(!req.session.userid){
        req.session.msg = 'Not allowed there';
        return res.redirect('/');
        }
    return res.redirect('/search');
});

//redirect to main page
app.post('/concertAdded', function(req,res){
    if(!req.session.userid){
        req.session.msg = 'Not allowed there';
        return res.redirect('/');
        }
    return res.redirect('/main');
});

//conduct search
app.get('/search', function(req,res){
    if(!req.session.userid){
        req.session.msg = 'Not allowed there';
        return res.redirect('/');
        }

       res.send("<html><head><script src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script><script src='http://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js'></script><script>function getConcertInfo(){var URL = 'http://localhost:8888/getConcertInfo';var artist = $('#artist').val();$.ajax({type: 'POST',url : URL,data : {data: artist},dataType : 'text',success : function(msg){$('#results').html(msg);},error: function(jgXHR, textStatus,errorThrown){alert('Error: ' + textStatus + ' '  + errorThrown);}});} </script></head><body>SEARCH FOR EVENT<br><input type=text name=artist id=artist placeholder=Artist><input type=submit value='Search' onclick='getConcertInfo()'><br><div id=results></div><form method=post action='/concertAdded'><input type=submit value='Main'></form></body></html>");

});

//getConcertInfo from songkick api

var songkick = require('./controllers/songkick');
var sk = new songkick.Songkick();

app.post('/getConcertInfo', function(req, res){
    var artist = req.body.data;
    sk.once('infoParse', function(msg){
        res.send(msg);
        });
        sk.getConcertInfo(req, artist);
});

//save selected concert to database then redirect to main
app.post('/saveConcert', function(req,res){
    var user = req.session.userid;
    var artist = req.body.headliner;
    var date = req.body.concertDate;
    var time = req.body.concertTime;
    var venue = req.body.venue;

    console.log(artist + " " + date + " " + time + " " + venue);
    console.log("current user " + user);
    
    db.once('gotId', function(rows){
        var id = rows[0].id;
        console.log("id: " + id);
        
        db.saveConcert(id, artist, date, time, venue);
        });
    
    db.once('savedConcert', function(msg, res){
        console.log(msg);
    });
    
    //get current user's id in the database
    db.getId(user);

});

//display the edit page for a selected concert
app.post('/editEntry', function(req,res){
    var user = req.session.userid;
    var artist = req.body.headliner;
    var date = req.body.concertDate;
    var time = req.body.concertTime;
    var venue = req.body.venue;

    console.log(artist + " " + date + " " + time + " " + venue);
    console.log("current user " + user);
    
    db.once('gotId', function(rows){
        var id = rows[0].id;
        console.log("id: " + id);
        
        //display specific entry in input fields for editing
        db.displayToEdit(id, artist, date, time, venue);
        });
    
    db.once('gotEntry', function(rows){
        var str = "Edit this entry, " + req.session.userid + "<br><br>";
        for(var i=0; i < rows.length; i++){
            str+="<br><div class=concert-entry><form method=post action='/saveEdit'>Artist: <input type=text name=headliner value='"+ rows[i].headliner +"'><br> Supporting Act: <input type=text name=supporting_act value='"+ rows[i].supporting_act +"'> <br> Date: <input type=text name=concertDate value=" + rows[i].concert_date + "><br> Time: <input type=text name=concertTime value='" + rows[i].concert_time + "'><br> Venue: <input type=text name=venue value='"+ rows[i].venue + "'><br>Entry: <textarea type=text name=entry value='"+ rows[i].entry +"'></textarea><br><input type=submit value='Save'></form><form method=post action='/deleteEntry'><input type=hidden name=headliner value='"+ rows[i].headliner +"'><input type=hidden name=concertDate value=" + rows[i].concert_date + "><input type=submit value='Delete'></form></div>"
        }
       
        res.send("<html><script src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script><script src='http://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js'></script><script>function getAccessToken(){var URL = 'http://localhost:8888/getConcertInfo';var artist = $('#artist').val();$.ajax({type: 'POST',url : URL,data : {data: artist},dataType : 'text',success : function(msg){$('#results').html(msg);},error: function(jgXHR, textStatus,errorThrown){alert('Error: ' + textStatus + ' '  + errorThrown);}});} </script><head></head><body>" + str + "</body></html>");
    });
    
    //get current user's id in the database
    db.getId(user);

});

//save selected concert to database
app.post('/saveEdit', function(req,res){
    var user = req.session.userid;
    var artist = req.body.headliner;
    var supporting_act = req.body.supporting_act;
    var date = req.body.concertDate;
    var time = req.body.concertTime;
    var venue = req.body.venue;
    var entry = req.body.entry;

    console.log(artist + " " + date + " " + time + " " + venue);
    console.log("current user " + user);
    
    db.once('gotId', function(rows){
        var id = rows[0].id;
        console.log("id: " + id);
        
        db.saveEdit(id, artist, date, time, venue, supporting_act, entry);
        });
    
    db.once('gotEntry', function(msg, res){
        console.log(msg);
    });
    
    //get current user's id in the database
    db.getId(user);

});

//delete selected concert from database 
app.post('/deleteEntry', function(req,res){
    var user = req.session.userid;
    var artist = req.body.headliner;
    var date = req.body.concertDate;
    
    db.once('gotId', function(rows){
        var id = rows[0].id;
        console.log("id: " + id);
        
        db.deleteEntry(id, artist, date);
        });
    
    db.once('entryDeleted', function(msg, res){
        console.log(msg);
    });
    
    //get current user's id in the database
    db.getId(user);

});
