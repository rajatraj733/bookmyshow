var express = require('express');
var router = express.Router();
const redis = require('redis');
var constants = require('../consts');
const email = require('../email');


/* GET home page. */
router.get('/', function(req, res, next) {
    let redisClient = redis.createClient({
        host: constants.redis.url, port: constants.redis.port
    });
    redisClient.on('ready', function (resp) {
      let response = 'Chennai Page: ';
        redisClient.get('chennaiPageLastUpdated', (err, chennaiTime)=> {
            if(err) {
                console.error(err);
                return;
            }
            response += chennaiTime+': ';
            redisClient.get('chennaiPageStatus', (err, chennaiPageStatus)=> {
                if(err) {
                    console.error(err);
                    return;
                }
                response += chennaiPageStatus+'<br>';
                redisClient.get('iplPageLastUpdated', (err, iplTime) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    response += 'IPL Page: '+iplTime+': ';
                    redisClient.get('iplPageStatus', (err, iplPageStatus) => {
                        if(err) {
                            console.error(err);
                            return;
                        }
                        response += iplPageStatus;
                        console.log(new Date() + response);
                        res.send(response);
                    });
                })
            });
        });

    });
});

router.get('/mail', (req, res) => {
    const recipient = req.query.recipient;
    email.sendMail(recipient, 'Demo Mail', 'Got this?')
        .then(response => {
        res.send(response);
    }).catch(
        e => {
            res.send(e);
        }
    )
    ;
});

module.exports = router;
