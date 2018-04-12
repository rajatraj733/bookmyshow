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
    function scrapChennaiPage() {
        console.log('Chennai Page: running');
        axios.get(constants.chennaiPageUrl)
            .then((response) => {
                // console.log(response.data);
                const $ = cheerio.load(response.data);
                let node = $('.events-main-cards').eq(1);
                // console.log(node.html());
                let mainNode = $('.cards-book-button', node);
                let result = mainNode.text().trim();
                const time = new Date().toLocaleTimeString();
                console.log('Chennai Page: '+time+': result: '+result);
                redisClient.set('chennaiPageLastUpdated', time);
                if(result !== oldResult) {
                    console.log('IPL Page: book it');
                } else {
                    console.log('IPL Page: don\'t book it');
                }
                redisClient.set('chennaiPageStatus', result);

            }).catch(e => {
                console.error(e);
        });
    }
    function scrapIPLPage() {
        console.log('IPL Page: running');
        let oldResult = 'Coming Soon';
        axios.get(constants.iplPageUrl)
            .then(response => {
                const $ = cheerio.load(response.data);
                let card = $('._chennai');
                let button = $('.__buyBtn', card);
                let value = button.text().trim();
                const time = new Date().toLocaleTimeString();
                console.log('IPL Page: '+time+': result: '+value);
                redisClient.set('iplPageLastUpdated', time);
                if(value !== oldResult) {
                    console.log('IPL Page: book it');
                } else {
                    console.log('IPL Page: don\'t book it');
                }
                redisClient.set('iplPageStatus', value);
            }).catch(e => {console.error(e);});
    }

    scrapChennaiPage();
    scrapIPLPage();
    setInterval(scrapChennaiPage, constants.timeInterval);
    setInterval(scrapIPLPage, constants.timeInterval);
});