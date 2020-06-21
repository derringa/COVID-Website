/*  filename: dao.js
    description: Provides MailingList class.
*/

/*
    Name:           class MailingList
    Summary:        Contains MailingList class to abstract common database calls for
                    asynchronous connection to javascript node. Writing statements are
                    serialized and reading statements retreive information using a
                    callback.
    MainMethods:    addRecipient( user = Object( email, fname, lname, freq ))
                        Insert new recipient into the database.
                    addDataRequest( req = Object( datafield, email, country, state ))
                        Insert new data requested by user associated with particular
                        country and/or state.
                    generateMailingList( freq = int, callback = Object(err, Object))
                        Return a data structure of all information that needs to be
                        e-mailed.
*/

class MailingList {
    constructor(path) {
        this.dbpath = path;
    }
    /******************* Main call methods ****************/
    addRecipient(user) {
        let db = this._dbconnection();
        let values = [user.email, user.fname, user.lname];
        let sql = 'INSERT INTO recipient (email, fname, lname, freq) VALUES (?, ?, ?, 1)';
        // insert into database
        return new Promise((resolve, reject) => {
            db.run(sql, values, function(err) {
                if (err) {
                    reject(err.message);
                    return;
                }
                console.log("User added");
            });
            this._dbclose(db);
            setTimeout(500);
            resolve(user);
        });
    }

    deleteRecipient(email) {
        let db = this._dbconnection();
        let sql = 'DELETE FROM recipient WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.run(sql, [email], function(err) {
                if (err) {
                    reject(er.message);
                    return;
                }
            });
            this._dbclose(db);
            resolve(0);
        });
    }

    addDataRequest(req) {
        let db = this._dbconnection();
        console.log(req.email);
        let regs;
        if (Array.isArray(req.regions)) {
            regs = req.regions.map(x => x.toLowerCase());
        }
        else {
            regs = [req.regions];
        }
        console.log(regs);
        let sql = 'INSERT INTO datarequests (recipient_id, region_id) ' +
                  'SELECT recipient.id, region.id FROM recipient, region ' +
                  'WHERE recipient.email = ? ' +
                  'AND region.region_code = ?'
        return new Promise((resolve, reject) => {
            regs.forEach(reg => db.run(sql, [req.email, reg], function(err) {
                if (err) {
                    reject(err.message);
                    return;
                }
                console.log(`Rows inserted ${this.changes}`);
                resolve(0);
            }));
            this._dbclose(db);
        });

    }

    generateMailingList(freq = 1) {
        let db = this._dbconnection();
        let sql = 'SELECT * FROM datarequests ' +
            'INNER JOIN recipient ON datarequests.recipient_id = recipient.id ' +
            'INNER JOIN region ON datarequests.region_ID = region.id ' +
            'WHERE recipient.freq = ?';
        var sendList = {};
        // select from database
        return new Promise((resolve, reject) => {
            db.all(sql, [freq], (err, row) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                row.forEach((row) => {
                    if (!(row.email in sendList)) {
                        sendList[row.email] = new Object();
                        sendList[row.email].fname = row.fname;
                        sendList[row.email].lname = row.lname;
                        sendList[row.email].regions = new Object();
                    }
                    if (!(row.region_code in sendList[row.email].regions)) {
                        sendList[row.email].regions[row.region_code] = [];
                    }
                    sendList[row.email].regions[row.region_code].push(row.datafield);

                });

                this._dbclose(db);
                resolve(sendList);
            });
        });
    }

    /***************** Main call methods end ***************/
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

    addRegions(reglist) {
        let db = this._dbconnection();
        console.log(reglist);
        let regs = reglist.map(x => x.toLowerCase());
        console.log(regs);
        let sql = 'INSERT INTO region (region_code) VALUES (?)';
        // insert into database
        db.serialize(() => {
            regs.forEach(reg => db.run(sql, [reg], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Rows inserted ${this.changes}`);
            }));
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
}

module.exports = { MailingList };
