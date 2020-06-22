require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    jwtSign: function(context) {
        return new Promise((resolve, reject) => {
            jwt.sign(context, JWT_SECRET, (err, token) => {
                if (err) {
                    console.log(err);
                    return reject();
                }
    
                resolve(token);
    
            })
        })
    },

    jwtDecode: function(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if(err) {
                    console.log(err);
                    return reject();
                }
                resolve(decoded);
            })
        })
    }

}
