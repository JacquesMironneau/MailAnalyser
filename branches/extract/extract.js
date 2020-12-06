const { Mail } = require('./Mail');
const { ColMail } = require('./ColMail');

const fs = require('fs');

// extractMail : create a list of mail with data of several files --> TODO
var extractMail = function(folder) {
    var listeMail = new ColMail('listeMail');
    files = fs.readdirSync(folder);
    for (var index = 0; index < files.length; index++) {
        listeMail.setListeMail(createMail(folder + '/' + files[index]));
    }
    return listeMail;
}

// createMail : create a mail with data of a file
var createMail = function(file) {
    fileToString = fs.readFileSync(file).toString();
    var dataTab = createTab(fileToString);
    var mail = new Mail(dataTab[0], transformDate(dataTab[1]), dataTab[2], dataTab[3], dataTab[4], dataTab[5], dataTab[6], dataTab[7], dataTab[8], dataTab[9], dataTab[10], dataTab[11], dataTab[12], dataTab[13], dataTab[14], dataTab[15]);
    return mail;
}

// createTab : create a tab with  with data which are insteresting
var createTab = function(file) {
    var separator = /(Message-ID:|Date:|From:|To:|Subject:|Mime-Version:|Content-Type:|Content-Transfer-Encoding:|X-From|X-To|X-cc:|X-bcc:|X-Folder:|X-Origin:|X-FileName:|\r\n)/;
    file = file.split(separator);
    file = file.filter((val, idx) => !val.match(separator));

    //we remove some elements of the array because they are empty ('')
    for (var index = 0; index < file.length; index++) {
        if (file[index] === '') {
            file.splice(index, 1);
        }
    }

    //we join all the message into one element
    let message = [];
    for (var index = 15; index < file.length; index++) {
        message[index-15] = file[index];
    }
    file[15] = message.join(' ');
 
    return file;
}

// tranformDate : transform the date to be interpretable
transformDate = function(date) {
    var separator = /( |:)/;
    if (date.charAt(0) === ' ') {
        date = date.substring(1);
    }
    date = date.split(separator);
    date = date.filter((val, idx) => !val.match(separator));
    var transformDate = [];
    transformDate[0] = date[3];
    switch (date[2]) {
        case 'Jan' : transformDate[1] = 0;
        case 'Feb' : transformDate[1] = 1;
        case 'Mar' : transformDate[1] = 2;
        case 'Apr' : transformDate[1] = 3;
        case 'May' : transformDate[1] = 4;
        case 'Jun' : transformDate[1] = 5;
        case 'Jul' : transformDate[1] = 6;
        case 'Aug' : transformDate[1] = 7;
        case 'Sep' : transformDate[1] = 8;
        case 'Oct' : transformDate[1] = 9;
        case 'Nov' : transformDate[1] = 10;
        case 'Dec' : transformDate[1] = 11;
    }

    transformDate[2] = date[1];
    transformDate[3] = parseInt(date[4])+1;
    transformDate[4] = date[5];
    transformDate[5] = date[6];
    
    let resultDate = new Date(transformDate[0], transformDate[1], transformDate[2], transformDate[3], transformDate[4], transformDate[5]);
    
    return resultDate;
}

//console.log(transformDate(' Mon, 11 Dec 2000 09:04:00 -0800 (PST) '));
//console.log(createTab('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//console.log(createMail('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//var file = './mail.txt/9.txt';
//console.log(fs.readFileSync(file).toString());
//console.log(createTab(fs.readFileSync(file).toString()))
//console.log(createMail('./mail.txt/9.txt'));

var folder = './mail.txt';
console.log(extractMail(folder));