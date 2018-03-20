'use strict'
var fs = require('fs'); 
var http = require('http');

var $ = require('jQuery');

var EventEmitter = require('events').EventEmitter;

var key = fs.readFileSync('./api/key.txt', 'utf-8');

class Songkick extends EventEmitter{
    constructor(){super();}

    getConcertInfo(request, artist, location){
   // console.log("location: " + artist.split(' ').join('+'));
        
    artist = artist.split(' ').join('+');
        
    //get lat and long for user's location
    var options = {
        host: 'api.songkick.com',
        path: '/api/3.0/events.json?apikey=' + key + '&artist_name=' + artist + '&location=geo:39.998,-75.1448'
        };
        
        var self = this; 
        //object
        var str = '';
        http.request(options, function(response){
            response.on('data', function (chunk) {
                str += chunk;
            });
        response.on('end', function() {
            
            //headliner name
            var artistName = JSON.parse(str).resultsPage.results.event[0].performance[0].displayName;
           
            var time = JSON.parse(str).resultsPage.results.event[0].start.time;
            var date = JSON.parse(str).resultsPage.results.event[0].start.date;
            
            var venue = JSON.parse(str).resultsPage.results.event[0].venue.displayName;
            
            var html = "<form method=post action='/saveConcert'>Artist: <input type=hidden name=headliner value='"+ artistName +"'>" + artistName + "<br> Date: <input type=hidden name=concertDate value=" + date + ">" + date + "<br> Time: <input type=hidden name=concertTime value='" + time + "'>" + time + 
                "<br> Venue: <input type=hidden name=venue value='"+ venue + "'>" + venue + "<br><input type=submit value='Select Concert'></form>";
            
            self.emit('infoParse', html);
        });
        }).end();

    }

}
exports.Songkick = Songkick;