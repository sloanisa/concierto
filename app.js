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
    res.write("<html><body><h1>Concert Craze</h1>");
    if(req.session.msg){
        res.write(req.session.msg);
        delete req.session.msg;
    }
    
res.write(`
    <br>
    <form method=post action='/login'>
    <input type=text id=username name=username>
    <input type=password name=password>
    <input type=submit value=Login>
    </form>
    <br>
    <form method=post action='/createAccount'>
    <input type=text id=username name=username>
    <input type=password name=password>
    <input type=submit value=Create Account>
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

app.post('/createAccount', function (req, res){
    db.once('accountCreated', function(msg){
            req.session.msg = "Account Created!";
            return res.redirect('/');
    });
    
    db.createAccount(req.body.username, req.body.password);
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
            str+="<br><div class=concert-entry><form method=post action='/saveEdit'>Artist: <input type=text name=headliner value='"+ rows[i].headliner +"'><br> Supporting Act: <input type=text name=supporting_act value='"+ rows[i].supporting_act +"'> <br> Date: <input type=text name=concertDate value=" + rows[i].concert_date + "><br> Time: <input type=text name=concertTime value='" + rows[i].concert_time + "'><br> Venue: <input type=text name=venue value='"+ rows[i].venue + "'><br>Entry: <textarea type=text name=entry value='"+ rows[i].entry +"'></textarea><br><input type=submit value='Save'></form><form method=post action='/deleteEntry'><input type=hidden name=headliner value='"+ rows[i].headliner +"'><input type=hidden name=concertDate value=" + rows[i].concert_date + "><input type=submit value='Delete'></form><button id='login-button' class='btn btn-primary'>Get Song Recommendations for " + rows[i].headliner + "! <br> Connect to Spotify</button><br><br> <a href='http://localhost:8888/main'>Back to Main</a></div>"
        }
       
        res.send(`<html><script src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script><script src='http://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js'></script><head></head><body>` + str + `</body><script>(function() {

                var stateKey = 'spotify_auth_state';

                /**
                 * Obtains parameters from the hash of the URL
                 * @return Object
                 */
                function getHashParams() {
                  var hashParams = {};
                  var e, r = /([^&;=]+)=?([^&;]*)/g,
                      q = window.location.hash.substring(1);
                  while ( e = r.exec(q)) {
                     hashParams[e[1]] = decodeURIComponent(e[2]);
                  }
                  return hashParams;
                }

                /**
                 * Generates a random string containing numbers and letters
                 * @param  {number} length The length of the string
                 * @return {string} The generated string
                 */
                function generateRandomString(length) {
                  var text = '';
                  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                  for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                  }
                  return text;
                };

                var artistID;
                var relatedArtist1;
                var relatedArtist2;
                var relatedArtist3;
                var topTrack1;
                var topTrack2;
                var topTrack3;

                var params = getHashParams();

                var access_token = params.access_token,
                    state = params.state,
                    storedState = localStorage.getItem(stateKey);

                if (access_token && (state == null || state !== storedState)) {
                  alert('There was an error during the authentication');
                } else {
                  localStorage.removeItem(stateKey);
                  if (access_token) {

                    //DEFINE THE ELEMENTS
                    var que = document.getElementById('query');

                    //LISTENERS
                    //listen for input in form
                    que.addEventListener('input', function (e) {
                      console.log(this.value);
                    }, false);
                    //listen for sumbit, send value to getArtist
                    document.getElementById('search-form').addEventListener('click', function (e) {
                    e.preventDefault();
                    getArtist(que.value);
                    }, false);


                    //pulls authorized account information
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me',
                        headers: {
                          'Authorization': 'Bearer ' + access_token
                        },
                        success: function(response) {

                          console.log('aye got that token');
                          

                          $('#login').hide();
                          $('#loggedin').show();

                        }
                    });

                    //search request
                    var getArtist = function (query) {

                    $.ajax({
                        url: 'https://api.spotify.com/v1/search',
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                        data: {
                            q: query,
                            offset: 0,
                            limit: 3,
                            type: 'artist'
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                          for (var i=0; i<1; i++) {
                          console.log(i);
                          if (json.artists.items[i]){
                          artistID = json.artists.items[i].id;

                        console.log("Artist ID: " + artistID);

                          }
                        } 
                        searchRelatedArtists();

                        }
                    });
                    console.log('hello');
                    console.log(query);
                };
                      //search for related artists request
                    var searchRelatedArtists = function () {

                    var URL = 'https://api.spotify.com/v1/artists/' + artistID + '/related-artists'
                    $.ajax({
                        url: URL,
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                        relatedArtist1 = json.artists[6].id;
                        relatedArtist2 = json.artists[13].id;
                        relatedArtist3 = json.artists[19].id;

                        console.log("related artist ids: " + relatedArtist1 + " " + relatedArtist2 + " " + relatedArtist3);

                        getTopTracks(relatedArtist1);
                        getTopTracks(relatedArtist2);
                        getTopTracks(relatedArtist3);

                        } 
                        })
                    };

                                    //search for related artists request
                    var getTopTracks = function (id) {

                    var URL = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks'
                    $.ajax({
                        url: URL,
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                         data: {
                            country: 'US'
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                        var artistName = json.tracks[7].album.artists["0"].name;
                        var albumName = json.tracks[7].album.name;
                        var trackName = json.tracks[7].name;
                        var trackSRC = json.tracks[7].external_urls.spotify;
                        var imgSRC = json.tracks[7].album.images[1].url;
        //
                          $('#results').after("<div><a href='" + trackSRC + "'><img src='" + imgSRC + "'></a><li>" + trackName + "</li><li>" + artistName + "</li><li>" + albumName + "</li></div>");

                        } 
                        })
                    };

                  } else {
                      $('#login').show();
                      $('#loggedin').hide();
                  }

                  document.getElementById('login-button').addEventListener('click', function() {

                    var client_id = 'f77925f0471243af97142794fd2efe1d'; // Your client id
                    var redirect_uri = 'http://localhost:8888/getRecs'; // Your redirect uri

                    var state = generateRandomString(16);

                    localStorage.setItem(stateKey, state);
                    var scope = 'user-read-private user-read-email';

                    var url = 'https://accounts.spotify.com/authorize';
                    url += '?response_type=token';
                    url += '&client_id=' + encodeURIComponent(client_id);
                    url += '&scope=' + encodeURIComponent(scope);
                    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                    url += '&state=' + encodeURIComponent(state);

                    window.location = url;
                  }, false);
                }
              }) ();
            function getAccessToken(){var URL = 'http://localhost:8888/getConcertInfo';var artist = $('#artist').val();$.ajax({type: 'POST',url : URL,data : {data: artist},dataType : 'text',success : function(msg){$('#results').html(msg);},error: function(jgXHR, textStatus,errorThrown){alert('Error: ' + textStatus + ' '  + errorThrown);}});}                   
            </script></html>`);
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

app.get('/getRecs', function(req, res){
    console.log('hello');
   var artist = req.query.headliner;
    console.log(artist);
    res.send(`
        <html>
          <head>
            <title>Recommended Track</title>
            <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
            <style type="text/css">
              #login, #loggedin {
                display: none;
              }
              .text-overflow {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 500px;
              }

            </style>
          </head>

          <body>
            <div class="container">
              <div id="login">
                <button id="login-button" class="btn btn-primary">Connect to Spotify</button>
              </div>
              <div id="loggedin">
                <div id="user-profile">
                </div>
                <div id="oauth">
                </div>
              </div>
            </div>


            <form id="search-form"> 
              <input type='text' id="query" placeholder="Input Artist Name">
              <input type="submit" id="search" class="btn btn-primary" value="Get Recs">
            </form>

            <div id="results"></div>
                <a href="http://localhost:8888/main">Back to Main</a>
            <script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.1/handlebars.min.js"></script>
            <script src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
            <script>
                localStorage.setItem('theArtist', $('#query').val);

                if ($('#query').val == undefined){
                        $('#query').val = localStorage.getItem('theArtist');
                }
               
              (function() {

                var stateKey = 'spotify_auth_state';

                /**
                 * Obtains parameters from the hash of the URL
                 * @return Object
                 */
                function getHashParams() {
                  var hashParams = {};
                  var e, r = /([^&;=]+)=?([^&;]*)/g,
                      q = window.location.hash.substring(1);
                  while ( e = r.exec(q)) {
                     hashParams[e[1]] = decodeURIComponent(e[2]);
                  }
                  return hashParams;
                }

                /**
                 * Generates a random string containing numbers and letters
                 * @param  {number} length The length of the string
                 * @return {string} The generated string
                 */
                function generateRandomString(length) {
                  var text = '';
                  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                  for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                  }
                  return text;
                };

                var artistID;
                var relatedArtist1;
                var relatedArtist2;
                var relatedArtist3;
                var topTrack1;
                var topTrack2;
                var topTrack3;

                var params = getHashParams();

                var access_token = params.access_token,
                    state = params.state,
                    storedState = localStorage.getItem(stateKey);

                if (access_token && (state == null || state !== storedState)) {
                  alert('There was an error during the authentication');
                } else {
                  localStorage.removeItem(stateKey);
                  if (access_token) {

                    //DEFINE THE ELEMENTS
                    var que = document.getElementById('query');

                    //LISTENERS
                    //listen for input in form
                    que.addEventListener('input', function (e) {
                      console.log(this.value);
                    }, false);
                    //listen for sumbit, send value to getArtist
                    document.getElementById('search-form').addEventListener('click', function (e) {
                    e.preventDefault();
                    getArtist(que.value);
                    }, false);


                    //pulls authorized account information
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me',
                        headers: {
                          'Authorization': 'Bearer ' + access_token
                        },
                        success: function(response) {

                          console.log('aye got that token');
                          

                          $('#login').hide();
                          $('#loggedin').show();

                        }
                    });

                    //search request
                    var getArtist = function (query) {

                    $.ajax({
                        url: 'https://api.spotify.com/v1/search',
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                        data: {
                            q: query,
                            offset: 0,
                            limit: 3,
                            type: 'artist'
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                          for (var i=0; i<1; i++) {
                          console.log(i);
                          if (json.artists.items[i]){
                          artistID = json.artists.items[i].id;

                        console.log("Artist ID: " + artistID);

                          }
                        } 
                        searchRelatedArtists();

                        }
                    });
                    console.log('hello');
                    console.log(query);
                };
                      //search for related artists request
                    var searchRelatedArtists = function () {

                    var URL = 'https://api.spotify.com/v1/artists/' + artistID + '/related-artists'
                    $.ajax({
                        url: URL,
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                        relatedArtist1 = json.artists[6].id;
                        relatedArtist2 = json.artists[13].id;
                        relatedArtist3 = json.artists[19].id;

                        console.log("related artist ids: " + relatedArtist1 + " " + relatedArtist2 + " " + relatedArtist3);

                        getTopTracks(relatedArtist1);
                        getTopTracks(relatedArtist2);
                        getTopTracks(relatedArtist3);

                        } 
                        })
                    };

                                    //search for related artists request
                    var getTopTracks = function (id) {

                    var URL = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks'
                    $.ajax({
                        url: URL,
                        headers: {
                          'Authorization': 'Bearer ' + access_token  
                        },
                         data: {
                            country: 'US'
                        },
                        success: function (response) {
                          console.log(response);
                          $('#results').html("");
                          var json = response;

                        var artistName = json.tracks[7].album.artists["0"].name;
                        var albumName = json.tracks[7].album.name;
                        var trackName = json.tracks[7].name;
                        var trackSRC = json.tracks[7].external_urls.spotify;
                        var imgSRC = json.tracks[7].album.images[1].url;
        //
                          $('#results').after("<div><a href='" + trackSRC + "'><img src='" + imgSRC + "'></a><li>" + trackName + "</li><li>" + artistName + "</li><li>" + albumName + "</li></div>");

                        } 
                        })
                    };

                  } else {
                      $('#login').show();
                      $('#loggedin').hide();
                  }

                  document.getElementById('login-button').addEventListener('click', function() {

                    var client_id = 'f77925f0471243af97142794fd2efe1d'; // Your client id
                    var redirect_uri = 'http://localhost:8888/getRecs'; // Your redirect uri

                    var state = generateRandomString(16);

                    localStorage.setItem(stateKey, state);
                    var scope = 'user-read-private user-read-email';

                    var url = 'https://accounts.spotify.com/authorize';
                    url += '?response_type=token';
                    url += '&client_id=' + encodeURIComponent(client_id);
                    url += '&scope=' + encodeURIComponent(scope);
                    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                    url += '&state=' + encodeURIComponent(state);

                    window.location = url;
                  }, false);
                }
              })();
            </script>
        </html>

    `);

    
});
