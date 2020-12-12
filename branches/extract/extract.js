const { Mail } = require('./Mail');
const { ColMail } = require('./ColMail');

const fs = require('fs');

// extractMail : create a list of mail with data of several files
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

// getPathOfFiles : with one way, we get all the ways of files
var getPathOfFiles = function(path) {
    var results = [];
    if (inputIsFile(path)) {
        results.push(path);
    }
    else if (inputIsFolder(path)) {
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
    }
    return results;
}

// createMail : create a mail with data of a file
var createMail = function(file) {
    fileToString = fs.readFileSync(file).toString();

    //we verify if data in the file is a mail
    if (!fileToString.includes('Message-ID: ') || !fileToString.includes('Date: ') || !fileToString.includes('From: ') || !fileToString.includes('To: ') || !fileToString.includes('Subject: ') || !fileToString.includes('Mime-Version: ') || !fileToString.includes('Content-Type: ') || !fileToString.includes('Content-Transfer-Encoding: ') || !fileToString.includes('X-From: ') || !fileToString.includes('X-To: ') || !fileToString.includes('X-cc: ') || !fileToString.includes('X-bcc: ') || !fileToString.includes('X-Folder: ') || !fileToString.includes('X-Origin: ') || !fileToString.includes('X-FileName: ')) {
        return null;
    }  

    var dataTab = createTab(fileToString);

    //we verify if the date, the author and the recipient are not empty
    if (dataTab[1] === '' || dataTab[2] === '' || dataTab[3] === '') {
        return null;
    }

    var mail = new Mail(dataTab[0], transformDate(dataTab[1]), dataTab[2], dataTab[3], dataTab[4], dataTab[5], dataTab[6], dataTab[7], transformName(dataTab[8]), transformName(dataTab[9]), dataTab[10], dataTab[11], dataTab[12], dataTab[13], dataTab[14], dataTab[15]);
    return mail;
}

// createTab : create a tab with data which are interesting
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

    //we remove the element Cc:
    for (var index = 0; index < file.length; index++) {
        if (file[index].includes('Subject: ')) {
            if (file[index+1].includes('Cc: ')) {
                file.splice(index+1, 1);
            }
        }
    }

    //we join all the mailAuthor into one element
    let indexTo = 0, indexSubject = 0;
        //we search when there is the beginning of the mailRecipient
    for (let index = 0; index < file.length; index++) {
        if (file[index].includes('To: ')) {
            indexTo = index;
            break;
        }
    }
        //we search when there is the subject
    for (let index = 0; index < file.length; index++) {
        if (file[index].includes('Subject: ')) {
            indexSubject = index;
            break;
        }
    }
        //we join all the mailRecipient
    if (indexSubject !== indexTo+1) {
        let to = [];
        for (var index = indexTo; index < indexSubject; index++) {
            to[index-indexTo] = file[index];
        }
        file[indexTo] = to.join(' ');
    }
        //we remove the lines between the mailRecipients and the subject
    file.splice(indexTo+1, indexSubject-indexTo-1);

    //we remove the element Bcc:
    if (file[8].includes('Bcc: ')) {
        file.splice(8, 1);
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

    //we separate all the mailRecipient in a table
    separator = /(, )/;
    var tabMailRecipient = [];
    tabMailRecipient = file[3];
    tabMailRecipient = tabMailRecipient.split(separator);
    tabMailRecipient = tabMailRecipient.filter((val, idx) => !val.match(separator));
    for (let i = 0; i < tabMailRecipient.length; i++) {
        while (tabMailRecipient[i].charAt() === ' ') {
            tabMailRecipient[i] = tabMailRecipient[i].substring(1);
        }
        while (tabMailRecipient[i].charAt() === '\t') {
            tabMailRecipient[i] = tabMailRecipient[i].substring(1);
        }
    }
    file[3] = tabMailRecipient;

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

// tranformName : transform the author and recipient to be interpretables
var transformName = function(name) {
    var regexName = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;
    var tabName = [];
    var needToInverseNameAndFirstname = [];
    if (name.match(regexName)) {
        tabName[0] = name;
        return tabName;
    }
    else {
        var temporarName = [];
        if (name.match(/, /) && !name.match(/"[A-Za-z]+,/)) {
            name = name.split(/, /);
            name = name.filter((val, idx) => !val.match(/, /));
            temporarName = name;
        }
        else if (name.match(/"[A-Za-z]+,/)) {
            name = name.split(/, /);
            name = name.filter((val, idx) => !val.match(/, /));
            for (let indexForGroup = 0; indexForGroup < name.length-1; indexForGroup++) {
                if (name[indexForGroup].match(/"[A-z]+/) && name[indexForGroup+1].match(/[^\"]+" [<A-z@0-9\s]+/)) {
                    name[indexForGroup] = name[indexForGroup] + ' ' + name[indexForGroup+1];
                    name.splice(indexForGroup+1, 1);
                    needToInverseNameAndFirstname.push(indexForGroup);
                }
            }
            temporarName = name;
        }
        else {
            temporarName[0] = name;
        }
        for (let indexRecipient = 0; indexRecipient < temporarName.length; indexRecipient++) {
            if (temporarName[indexRecipient].match(regexName)) {
                tabName[indexRecipient] = temporarName[indexRecipient];
            }
            else {
                if (temporarName[indexRecipient].match(/ </) && !temporarName[indexRecipient].match(/, /)) {
                    temporarName[indexRecipient] = temporarName[indexRecipient].split(' <');
                    temporarName[indexRecipient] = temporarName[indexRecipient][0];
                    if (temporarName[indexRecipient].match(/"/)) {
                        temporarName[indexRecipient] = temporarName[indexRecipient].split('"');
                        temporarName[indexRecipient] = temporarName[indexRecipient].filter((val, idx) => !val.match('"'));
                        tabName[indexRecipient] = temporarName[indexRecipient][1];
                    }
                    else {
                        tabName[indexRecipient] = temporarName[indexRecipient];
                    }
                }
                else {
                    tabName[indexRecipient] = '';
                }
            }
        }
        for (let indexInverse = 0; indexInverse < needToInverseNameAndFirstname.length; indexInverse++) {
            if (tabName[needToInverseNameAndFirstname[indexInverse]].match(/\s/)) {
                var tabTemporar = tabName[needToInverseNameAndFirstname[indexInverse]];
                tabTemporar = tabTemporar.split(/ /);
                tabTemporar = tabTemporar.filter((val, idx) => !val.match(/ /));
                tabName[needToInverseNameAndFirstname[indexInverse]] = tabTemporar[1] + ' ' + tabTemporar[0];
            }
        }
        return tabName;
    }
}

// inputIsFolder : verify if the input is a folder
inputIsFolder = function(path) {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
}

// inputIsFile : verifiy if the input is a file
inputIsFile = function(path) {
    var stat = fs.lstatSync(path);
    return stat.isFile();
}

//TEST
//console.log(transformDate(' Mon, 11 Dec 2000 09:04:00 -0800 (PST) '));
//console.log(createTab('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//console.log(createMail('Message-ID: <12319276.1075857594379.JavaMail.evans@thyme> Date: Mon, 11 Dec 2000 09:04:00 -0800 (PST) From: john.arnold@enron.com To: slafontaine@globalp.com Subject: re:summer inverses Mime-Version: 1.0 Content-Type: text/plain; charset=us-ascii Content-Transfer-Encoding: 7bit X-From: John Arnold X-To: slafontaine@globalp.com @ ENRON X-cc:  X-bcc:  X-Folder: \John_Arnold_Dec2000\Notes Folders\'sent mail X-Origin: Arnold-J X-FileName: Jarnold.nsf \r\n a couple more thoughts.  certainly losing lots of indutrial demand both to switching and slowdown in economy.  Big 3 automakers all temporarily closing plants for instance.  switching is significant and has led to cash in the gulf expiring weak everyday.  gas daily spread to prompt trading at $1....need some very cold weather to justify that.  this seems to be the test of the next 3-5 days.   Will the switching/loss of demand/storage management keep cash futures spread at reasonable levels or will it blow to $5+. Not too many years ago we had a $50 print on the Hub.  unless we get some crazy  prints, you have to question the steep backwardation in the market. funny watching the flies in the front.  Bot large chunk of g/h/j at $.50 friday morning.  probably worth 1.30 now.  crazy.  people have seen each front spread be weak since forever and are already starting to eye up g/h.  what\'s the thoughts on distillates...  is it tight enough such that gas switching is the marginal mmbtu of demand and pulls it up or is the market too oversupplied to care?'));
//var file = './mail.txt/9.txt';
//console.log(fs.readFileSync(file).toString());
//console.log(createTab(fs.readFileSync(file).toString()))
//console.log(createMail('./mail.txt/7.txt'));

//var folder = './BD';
//console.log(extractMail([folder]));

// var file = './mail.txt/9.txt';
// //typeOfInput(file);
// var folder = './mail.txt';
// //typeOfInput(folder);

// console.log(inputIsFolder(folder));
// console.log(inputIsFile(folder));
// console.log(inputIsFile(file));
// console.log(inputIsFolder(file));

//var file = './BD/j-arnold/mail.txt/9.txt';
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

// console.log(transformName('Greg Whalley')); // FAIT
// console.log(transformName('"Jennifer White" <jenwhite7@zdnetonebox.com> @ ENRON')); // FAIT
// console.log(transformName('"White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON'));
// console.log(transformName('"White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON, "White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON'));
// console.log(transformName('Greg A Whalley')); // FAIT
// console.log(transformName('Greg Whalley, Jennifer Arrison')); // FAIT
// console.log(transformName('greg.whalley@eron.com, Jennifer Arrison')); // FAIT
// console.log(transformName('greg.whalley@eron.com')); // FAIT
// console.log(transformName('Jennifer White <jenwhite7@zdnetonebox.com> @ ENRON, Jennifer White <jenwhite7@zdnetonebox.com> @ ENRON')); // FAIT
// console.log(transformName('Sierra O\'Neil')); // FAIT
// console.log(transformName('slafontaine@globalp.com @ ENRON')); // FAIT
// console.log(transformName('Greg Whalley, "Jennifer White" <jenwhite7@zdnetonebox.com> @ ENRON')); // FAIT
// console.log(transformName('Greg Whalley, "Jennifer White" <jenwhite7@zdnetonebox.com> @ ENRON, "White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON'));
// console.log(transformName('Greg Whalley, "Jennifer White" <jenwhite7@zdnetonebox.com> @ ENRON, "White, Jennifer" <jenwhite7@zdnetonebox.com> @ ENRON, greg.whalley@eron.com, slafontaine@globalp.com @ ENRON, Sierra O\'Neil'));
//on doit avoir [Greg Whalley, Jennifer White, Jennifer White, '', '', Sierra O\'Neil]

// var path = './BD/j-arnold';
// console.log(extractMail([path]).getMailRecipient()); --> A VERIFIER

// var path = './BD';
// console.log(extractMail([path]));

//var file = ['./BD/j-arnold/mail.txt/3.txt', './BD/j-arnold/mail.txt/9.txt'];
// console.log(getPathOfFiles(file));
// console.log(inputIsFile(file));
//console.log(extractMail(file));
// var folder = './BD/j-arnold/mail.txt/3.txt';
// console.log(extractMail([folder]));

//var file = './BD/j-arnold/mail.txt/1159.txt';
//extractMail([file]);

//var file = './BD/campbell/5.txt';
//console.log(extractMail([file]).toString);

module.exports = { extractMail };