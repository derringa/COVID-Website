/*
* Program:  COVID MailingList DAO
* Summary:  Abstraction of common database calls for asynchronous connection
*           to javascript node.
* Params:   File path for local SQLite database.
* Methods:  addRecipient( user = Object( email, fname, lname, freq ))
*               Insert new recipient into the database.
*           addDataRequest( req = Object( datafield, email, country, state ))
*               Insert new data requested by user associated with particular
*               country and/or state.
*           generateMailingList( freq = int, callback = Object(err, Object))
*               Return a data structure of all information that needs to be
*               e-mailed. Structure is :
*               Object {
*                   'specificuser@email.com': Object {
*                                               fname:
*                                               lname:
*                                               regions: Object {
*                                                           'region_url': [array of data type titles]
*                                                           ...
*                                                       }
*                                           }     
*                   ...
*               }
*/

class MailingList {
    constructor(path) {
        this.dbpath = path;
    }
    _dbconnection() {
        // open file database
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database(this.dbpath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              return console.error(err.message);
            }
        });
        return db;
    }
    _dbclose(db) {
        // close the database connection
        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
        });
    }
    addRecipient(user) {
        let db = this._dbconnection();
        let values = [user.email, user.fname, user.lname, user.freq];
        let sql = 'INSERT INTO recipient (email, fname, lname, freq) VALUES (?, ?, ?, ?)';
        // insert into database
        db.serialize(() => {
            db.run(sql, values, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Rows inserted ${this.changes}`);
            });
        });
        this._dbclose(db);
    }
    addDataRequest(req) {
        let db = this._dbconnection();
        let values = [req.datafield, req.email, req.country];
        let sql = 'INSERT INTO datarequests (recipient_id, region_id, datafield) ' +
                  'SELECT recipient.id, region.id, ? FROM recipient, region ' +
                  'WHERE recipient.email = ? ' +
                  'AND region.country = ?';
        if (req.state != null) {
            sql += ' AND region.state = ?';
            values.push(req.state);
        }
        // insert into database
        db.serialize(() => {
            db.run(sql, values, function(err) {
                if (err) {
                    return console.error(err.message);
                }
            });
        });
        this._dbclose(db);
    }
    generateMailingList(freq, callback) {
        let db = this._dbconnection();
        let sql1 = 'SELECT * FROM datarequests ' + 
                   'INNER JOIN recipient ON datarequests.recipient_id = recipient.id ' +
                   'INNER JOIN region ON datarequests.region_ID = region.id ' +
                   'WHERE recipient.freq = ?';
        var sendList = new Object();
        // select from database
        db.all(sql1, [freq], (err, row) => {
            if (err) {
                callback(err.message, null);
            }
            row.forEach((row) => {
                if (!(row.email in sendList)) {
                    sendList[row.email] = new Object();
                    sendList[row.email].fname = row.fname;
                    sendList[row.email].lname = row.lname;
                    sendList[row.email].regions = new Object();
                }
                if (!(row.url in sendList[row.email].regions)) {
                    sendList[row.email].regions[row.url] = [];
                }
                sendList[row.email].regions[row.url].push(row.datafield);
            });
            callback(null, sendList);
        });
        this._dbclose(db);
    }
    listRegions() {
        let db = this._dbconnection();
        // select from database
        db.serialize(() => {
            db.each(`SELECT *
                     FROM region`, (err, row) => {
              if (err) {
                console.error(err.message);
              }
              console.log(row);
            });
        });
        this._dbclose(db);
    }
    listDataRequests() {
        let db = this._dbconnection();
        // select from database
        db.serialize(() => {
            db.each(`SELECT *
                     FROM datarequests`, (err, row) => {
              if (err) {
                console.error(err.message);
              }
              console.log(row);
            });
        });
        this._dbclose(db);
    }
    listRecipients() {
        let db = this._dbconnection();
        // select from database
        db.serialize(() => {
            db.each(`SELECT *
                     FROM recipient`, (err, row) => {
              if (err) {
                console.error(err.message);
              }
              console.log(row);
            });
        });
        this._dbclose(db);
    }
}

module.exports = MailingList;