var constants = require('./consts');
var axios = require('axios');
const cheerio = require('cheerio');
const redis = require('redis');
var email = require('./email');

var redisClient = redis.createClient({
    host: constants.redis.url, port: constants.redis.port
});


redisClient.on('ready', function (res) {
    console.log('client ready');
    let oldResult = 'Coming Soon';

    function scrapChennaiPage() {
        console.log('Chennai Page: running');
        const time = constants.getCurrentIST();
        redisClient.set('chennaiPageLastUpdated', time);
        axios.get(constants.chennaiPageUrl)
            .then((response) => {
                redisClient.set('chennaiPageOnStatus', 'Working');
                // console.log(response.data);
                email.sendMail(constants.email.recipient, constants.email.subject, +'This page is on : ' + constants.chennaiPageUrl)
                    .then(res => {
                        console.log('mail sent');
                    }).catch(e => {
                    console.log('could not send mail');
                    sendMailOnError(JSON.stringify(e));
                });
                const $ = cheerio.load(response.data);
                let node = $('.events-main-cards').eq(1);
                // console.log(node.html());
                let mainNode = $('.cards-book-button', node);
                let result = mainNode.text().trim();

                console.log('Chennai Page: ' + time + ': result: ' + result);

                if (result !== oldResult) {
                    console.log('IPL Page: book it');
                    email.sendMail(constants.email.recipient, constants.email.subject, constants.email.text + ': ' + constants.chennaiPageUrl)
                        .then(res => {
                            console.log('mail sent');
                        }).catch(e => {
                        console.log('could not send mail');
                    });
                } else {
                    console.log('Chennai Page: don\'t book it');
                }
                redisClient.set('chennaiPageStatus', result);

            }).catch(e => {
            console.error(e);
            redisClient.set('chennaiPageOnStatus', 'Not Working');
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
                const time = constants.getCurrentIST();
                console.log('IPL Page: ' + time + ': result: ' + value);
                redisClient.set('iplPageLastUpdated', time);
                if (value !== oldResult) {
                    console.log('IPL Page: book it');
                    email.sendMail(constants.email.recipient, constants.email.subject, constants.email.text + ': ' + constants.iplPageUrl)
                        .then(res => {
                            console.log('mail sent');
                        }).catch(e => {
                        console.log('could not send mail');
                    });
                } else {
                    console.log('IPL Page: don\'t book it');
                }
                redisClient.set('iplPageStatus', value);
            }).catch(e => {

            console.error(e);
            sendMailOnError(JSON.stringify(e));
        });
    }

    function scrapMumbaiPage() {
        console.log('Mumbai Page: running');
        let oldResult = 'Coming Soon';
        axios.get(constants.mumbaiPageUrl)
            .then((response) => {
                // console.log(response.data);
                email.sendMail(constants.email.recipient, constants.email.subject, +'This page is on : ' + constants.chennaiPageUrl)
                    .then(res => {
                        console.log('mail sent');
                    }).catch(e => {
                    console.log('could not send mail');
                });
                const $ = cheerio.load(response.data);
                let node = $('.book-button');
                // console.log(node.html());
                let mainNode = $('button', node);
                let result = mainNode.text().trim();
                const time = constants.getCurrentIST();
                console.log('Mumbai Page: ' + time + ': result: ' + result);
                redisClient.set('mumbaiPageLastUpdated', time);
                if (result !== oldResult) {
                    console.log('Mumbai Page: book it');
                    email.sendMail(constants.email.recipient, constants.email.subject, constants.email.text + ': ' + constants.mumbaiPageUrl)
                        .then(res => {
                            console.log('mail sent');
                        }).catch(e => {
                        console.log('could not send mail');
                    });
                } else {
                    console.log('Mumbai Page: don\'t book it');
                }
                redisClient.set('mumbaiPageStatus', result);

            }).catch(e => {
            console.error(e);
        });
    }

    function sendMailOnError(response) {
        email.sendMail(constants.email.recipient, 'Error Occured, please look at this', response).then(
            res => {
                console.log('mail sent');
            }
        ).catch(e => {
            console.log('could not send mail');
        })
    }

    scrapChennaiPage();
    // scrapIPLPage();
    scrapMumbaiPage();
    setInterval(scrapChennaiPage, constants.timeInterval);
    // setInterval(scrapIPLPage, constants.timeInterval);
    setInterval(scrapMumbaiPage, constants.timeInterval);
});