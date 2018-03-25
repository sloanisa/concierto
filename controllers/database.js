'use strict'
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "roscoeswetsuit",
  database: "concert_craze"
});

con.connect(function(err) {
if (err) {
console.log('Error connecting to database');
}
else {
console.log('Database successfully connected');
}
});

class Database extends EventEmitter{
constructor(){super();}
    login (username,password){
        var str = "SELECT 1 FROM user_accounts WHERE username="+con.escape(username)
        + " AND password=PASSWORD("+ con.escape(password) +");";
        var self = this;
        //console.log("str: " + str);
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error' + err);
                return 0;
            }
            else{
                if(rows.length>0)
                    self.emit('loggedin',1);
                else
                    self.emit('loggedin',0);
                }
        });
    }
    
    createAccount (username,password){
        var str = "INSERT INTO user_accounts (username, password) VALUES ("+con.escape(username)
        + ", PASSWORD("+ con.escape(password) +"));";
        console.log(str);
        var self = this;
        //console.log("str: " + str);
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error' + err);
                return 0;
            }
            else{
                    self.emit('accountCreated');
            }

        });
    }
    
    displayEntries (id){
        var str = "SELECT * FROM concert_info WHERE user_id="+ con.escape(id) + " order by concert_date ASC;";
        var self = this;
        
        console.log(str);
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error');
                return 0;
            }
            else{
                self.emit('gotEntries',rows);
            }
        });
    }
    
    getId(user) {
        
        var idQuery =  "SELECT * FROM user_accounts WHERE username="+con.escape(user)+";";
            
        var self = this;
        con.query(idQuery, function(err, rows, fields){
            if(err){
                console.log('Error' + err);
                return 0;
            }
            else{
                self.emit('gotId',rows);
            }
        });
        
    }
    
    saveConcert(id, headliner, concertDate, concertTime, venue) {
        
        console.log("id: " + id)
        var str = "INSERT INTO concert_info (user_id, headliner, concert_date, concert_time, venue, supporting_act, entry) VALUES ("+ con.escape(id) +", " + con.escape(headliner) + ", " + con.escape(concertDate) +", "+ con.escape(concertTime) +", "+ con.escape(venue) +", ' ', ' ');";
        
        console.log(str);
        
        var self = this;
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error' + err);
                return 0;
            }
            else{
                var msg = "1 entry added.";
                self.emit('savedConcert',msg);
            }
        });
        
    }
    
    displayToEdit(id, headliner, concertDate){
        var str = "SELECT * FROM concert_info WHERE user_id="+ con.escape(id) + " AND headliner=" + con.escape(headliner) + " AND concert_date=" + con.escape(concertDate) + ";";
        var self = this;
        
        console.log(str);
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error');
                return 0;
            }
            else{
                self.emit('gotEntry',rows);
            }
        });
    }
    
    saveEdit(id, headliner, concertDate, concertTime, venue, supporting_act, entry){
        var str = "UPDATE concert_info SET headliner=" + con.escape(headliner) + ", supporting_act=" + con.escape(supporting_act) + ", concert_date=" + con.escape(concertDate) + ", concert_time=" + con.escape(concertTime) + ", venue=" + con.escape(venue) + ", entry=" + con.escape(entry) + " WHERE user_id="+ con.escape(id) + " AND headliner=" + con.escape(headliner) + " AND concert_date=" + con.escape(concertDate) + ";";
        var self = this;
        
        console.log(str);
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error');
                return 0;
            }
            else{
                var msg = "1 entry updated.";
                self.emit('gotEntry',msg);
            }
        });
    }
    
    deleteEntry(id, headliner, concertDate) {
        
        var str =  "DELETE FROM concert_info WHERE user_id="+con.escape(id)+" AND headliner=" + con.escape(headliner) + " AND concert_date=" + con.escape(concertDate) + ";";
        
        console.log(str);
        var self = this;
        con.query(str, function(err, rows, fields){
            if(err){
                console.log('Error' + err);
                return 0;
            }
            else{
                var msg = "1 entry deleted.";
                self.emit('entryDeleted',msg);
            }
        });
        
    }
    
    
    

}
exports.Database = Database;