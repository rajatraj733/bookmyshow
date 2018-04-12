var constants = require('./consts');
var axios = require('axios');
const cheerio = require('cheerio');
const redis = require('redis');

var redisClient = redis.createClient({
    host: constants.redis.url, port: constants.redis.port
});


redisClient.on('ready', function (res) {
    console.log('client ready');
    let oldResult = 'Coming Soon';
    function scrap() {
        console.log('running');
        axios.get(constants.url)
            .then((response) => {
                // console.log(response.data);
                const $ = cheerio.load(response.data);
                let node = $('.events-main-cards').eq(1);
                let mainNode = $('.cards-book-button', node);
                let result = mainNode.text().trim();
                console.log('result: '+result);
                if(result !== oldResult) {
                    redisClient.set('bookingStatus', 'Book it');
                } else {
                    redisClient.set('bookingStatus', 'Don\'t book it');
                }
                redisClient.set('status', result);

            });
    }

    scrap();
    setInterval(scrap, constants.timeInterval);
});