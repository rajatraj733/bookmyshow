var express = require('express');
var router = express.Router();
const redis = require('redis');
var constants = require('../consts');


/* GET home page. */
router.get('/', function(req, res, next) {
    let redisClient = redis.createClient({
        host: constants.redis.url, port: constants.redis.port
    });
    redisClient.on('ready', function (resp) {
      let response = '';
        redisClient.get('stauts', (err, result1)=> {
            if(err) {
                console.error(err);
                return;
            }
            console.log(new Date()+' serving status');
            response += result1;
            redisClient.get('bookingStatus', (err, result2)=> {
                if(err) {
                    console.error(err);
                    return;
                }
                console.log(new Date()+' serving bookingStatus');
                response += ' '+result2;
                res.send(response);
            });
        });

    });
});

module.exports = router;
