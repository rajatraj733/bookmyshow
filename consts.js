var moment = require('moment');
var momenttz = require('moment-timezone');

var constants = {
    timeInterval: 600000,
    chennaiPageUrl: 'https://in.bookmyshow.com/sports/t20-premier-league/chennai-super-kings',
    iplPageUrl: 'https://in.bookmyshow.com/sports/cricket/t20-premier-league',
    mumbaiPageUrl: 'https://in.bookmyshow.com/sports/t20-premier-league/chennai-super-kings/chennai-super-kings-vs-mumbai-indians/ET00072837',
    redis : {
        url: 'localhost',
        port: 6379
    },
    email: {
        username: 'rajatraj733@gmail.com',
        password: 'zqnxadnubifnmybv',
        recipient: 'rajatraj733@gmail.com,cprakash.chaturvedy@gmail.com',
        subject: 'Book Ticket',
        text: 'Do it fast at '
    },
    getCurrentIST: () => {
        return momenttz.tz(moment(), 'Asia/Kolkata').format('HH:mm:ss');
    }
};
// console.log(constants.getCurrentIST());
module.exports = constants;