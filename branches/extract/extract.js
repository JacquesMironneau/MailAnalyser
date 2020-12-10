const { Mail } = require('./Mail');
const { ColMail } = require('./ColMail');

const fs = require('fs');

// extractMail : create a list of mail with data of several files --> transformer en boucle while pour ne pas avoir le nombre de sous-dossier prédéfnini
var extractMail = function(path) {
    var listOfPath = [];
    var listeMail = new ColMail('listeMail');
    for (let indexPath = 0; indexPath < path.length; indexPath++) {
        listOfPath = listOfPath.concat(getPathOfFiles(path[indexPath]));
    }
    for (let indexFiles = 0; indexFiles < listOfPath.length; indexFiles++) {
        var mail = createMail(listOfPath[indexFiles]);
        if (mail === null) {
            console.log(`mail in the file ${listOfPath[indexFiles]} incorrect, we cannot extract it`);
        }
        else {
            listeMail.setListeMail(mail);
        }
    }
    return listeMail;
}

//with one way, we get all the ways of files
var getPathOfFiles = function(path) {
    var results = [];
    var list = fs.readdirSync(path);
    list.forEach(function(file) {
        file = path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getPathOfFiles(file));
        }
        else if (stat && stat.isFile()) {
            results.push(file);
        }
    });
    return results;
}

// createMail : create a mail with data of a file
var createMail = function(file) {
    fileToString = fs.readFileSync(file).toString();
    var dataTab = createTab(fileToString);

    if (dataTab[1] === '' || dataTab[2] === '' || dataTab[3] === '') {
        return null;
    }

    var mail = new Mail(dataTab[0], transformDate(dataTab[1]), dataTab[2], dataTab[3], dataTab[4], dataTab[5], dataTab[6], dataTab[7], dataTab[8], dataTab[9], dataTab[10], dataTab[11], dataTab[12], dataTab[13], dataTab[14], dataTab[15]);
    return mail;
}

// createTab : create a tab with data which are insteresting
var createTab = function(file) {
    var separator = /(Message-ID: |Date: |From: |Mime-Version: |Content-Type: |Content-Transfer-Encoding: |X-From: |X-To: |X-cc: |X-bcc: |X-Folder: |X-Origin: |X-FileName: |\r\n)/;
    file = file.split(separator);
    file = file.filter((val, idx) => !val.match(separator));

    //we remove some elements of the array because they are empty ('')
    for (var index = 0; index < file.length; index++) {
        if (file[index] === '') {
            file.splice(index, 1);
        }
    }

    //we remove the element To: and Subject:, which are not remove previously because of the message
    separator = /(To: |Subject: )/;
    var temporarFile = file[3];
    temporarFile = temporarFile.split(separator);
    temporarFile = temporarFile.filter((val, idx) => !val.match(separator));
    file[3] = temporarFile[1];
    temporarFile = file[4];
    temporarFile = temporarFile.split(separator);
    temporarFile = temporarFile.filter((val, idx) => !val.match(separator));
    file[4] = temporarFile[1];

    //we join all the message into one element
    let message = [];
    for (var index = 15; index < file.length; index++) {
        message[index-15] = file[index];
    }
    file[15] = message.join('\n');
    return file;
}

// tranformDate : transform the date to be interpretable
var transformDate = function(date) {
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

// tranformName : transform the author and recipient to be interpretables (début)
var transformName = function(name) {
    var regexName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (name.match(regexName)) {
        return name;
    }
    else {
        if (name.match(/"/)) {
            name = name.split(/"/);
            name = name[1];
            if (name.match(/,/)) {
                name = name.split(/,/);
                name[1] = name[1].substring(1);
                name = name[1] + ' ' + name[0];
            }
            return name;
        }
        else {
            return "transformation necessaire";
        }
    }
}

// // inputIsFolder : verify if the input is a folder
// inputIsFolder = function(path) {
//     var stat = fs.lstatSync(path);
//     return stat.isDirectory();
// }

// // inputIsFile : verifiy if the input is a file
// inputIsFile = function(path) {
//     var stat = fs.lstatSync(path);
//     return stat.isFile();
// }

//TEST
//console.log(transformDate(' Mon, 11 Dec 2000 09:04:00 -0800 (PST) '));
//console.log(createTab('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//console.log(createMail('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//var file = './mail.txt/9.txt';
//console.log(fs.readFileSync(file).toString());
//console.log(createTab(fs.readFileSync(file).toString()))
//console.log(createMail('./mail.txt/7.txt'));

//var folder = './mail.txt';
//console.log(extractMail(folder));

// var file = './mail.txt/9.txt';
// //typeOfInput(file);
// var folder = './mail.txt';
// //typeOfInput(folder);

// console.log(inputIsFolder(folder));
// console.log(inputIsFile(folder));
// console.log(inputIsFile(file));
// console.log(inputIsFolder(file));

//var file = './j-arnold/mail.txt/9.txt';
//console.log(extractMail(file));
//var folder = './j-arnold/mail.txt';
//console.log(extractMail(folder));
//var bigFolder = './BD';
//console.log(extractMail([bigFolder]));

//console.log(getPathOfFiles(bigFolder));

//var folder1 = './BD/campbell';
//var folder2 = './BD/j-arnold';
//var folder = [folder1, folder2];
//extractMail(folder);

console.log(transformName('Greg Whalley'));
console.log(transformName('"Jennifer White" <jenwhite7@zdnetonebox.com> @ ENRON'));
console.log(transformName('"White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON'));
console.log(transformName('Greg A Whalley'));
console.log(transformName('Greg Whalley, Jennifer Arrison'));


module.exports = { extractMail };