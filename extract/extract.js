const {Mail} = require('../collection_mail/mail/Mail');
const {ColMail} = require('../collection_mail/ColMail');

const fs = require('fs');

//extractMail : create a list of mail with data of several files
extractMail = path => {
    let listOfPath = [], listeMail = new ColMail('listeMail');
    for (let indexPath = 0; indexPath < path.length; indexPath++) listOfPath = listOfPath.concat(getPathOfFiles(path[indexPath]));
    for (let indexFiles = 0; indexFiles < listOfPath.length; indexFiles++){
        let mail = createMail(listOfPath[indexFiles]);
        if (mail === null) console.log(`mail in the file ${listOfPath[indexFiles]} incorrect, we cannot extract it`);
        else listeMail.setListeMail(mail);
    }
    return listeMail;
}

//getPathOfFiles : with one way, we get all the ways of files
getPathOfFiles = path => {
    let results = [];
    if (inputIsFile(path)) results.push(path);
    else if (inputIsFolder(path)){
        let list = fs.readdirSync(path);
        list.forEach(file => {
            file = path + '/' + file;
            let stat = fs.statSync(file);
            if (stat && stat.isDirectory()) results = results.concat(getPathOfFiles(file));
            else if (stat && stat.isFile()) results.push(file);
        });
    }
    return results;
}

// createMail : create a mail with data of a file
createMail = file => {
    let fileToString = fs.readFileSync(file).toString();
    //we verify if data in the file is a mail
    if (!fileToString.includes('Message-ID: ') || !fileToString.includes('\nDate: ') || !fileToString.includes('\nFrom: ') || !fileToString.includes('\nTo: ') || !fileToString.includes('\nSubject: ') || !fileToString.includes('\nMime-Version: ') || !fileToString.includes('Content-Type: ') || !fileToString.includes('Content-Transfer-Encoding: ') || !fileToString.includes('X-From: ') || !fileToString.includes('X-To: ') || !fileToString.includes('X-cc: ') || !fileToString.includes('X-bcc: ') || !fileToString.includes('X-Folder: ') || !fileToString.includes('X-Origin: ') || !fileToString.includes('X-FileName: ')) return null;

    let dataTab = createTab(fileToString);

    //we verify if the date, the author and the recipient are not empty
    if (dataTab[1] === '' || dataTab[2] === '' || dataTab[3] === '') return null;

    return new Mail(dataTab[0], transformDate(dataTab[1]), dataTab[2], dataTab[3], dataTab[4], dataTab[5], dataTab[6], dataTab[7], transformName(dataTab[8]), transformName(dataTab[9]), dataTab[10], dataTab[11], dataTab[12], dataTab[13], dataTab[14], dataTab[15]);
}

// createTab : create a tab with data which are interesting
createTab = file => {
    let separator = /(Message-ID: |Date: |From: |Mime-Version: |Content-Type: |Content-Transfer-Encoding: |X-From: |X-To: |X-cc: |X-bcc: |X-Folder: |X-Origin: |X-FileName: |\r\n|\n)/;
    file = file.split(separator).filter(val => !val.match(separator));

    //we remove some elements of the array because they are empty ('')
    for (let index = 0; index < file.length; index++) if (file[index] === '') file.splice(index, 1);
    //we remove the element Cc:
    for (let index = 0; index < file.length; index++) {
        if (file[index].includes('Subject: ')) {
            if (file[index+1].includes('Cc: ')) file.splice(index+1, 1);
            break;
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
        for (let index = indexTo; index < indexSubject; index++) to[index-indexTo] = file[index];
        file[indexTo] = to.join(' ');
    }
    //we remove the lines between the mailRecipients and the subject
    file.splice(indexTo+1, indexSubject-indexTo-1);
    //we remove the element Bcc:
    if (file[8].includes('Bcc: ')) file.splice(8, 1);
    //we remove the element To: and Subject:, which are not remove previously because of the message
    separator = /(To: |Subject: )/;
    let temporaryFile = file[3].split(separator).filter(val => !val.match(separator));
    file[3] = temporaryFile[1];
    temporaryFile = file[4].split(separator).filter(val => !val.match(separator));
    file[4] = temporaryFile[1];
    //we separate all the mailRecipient in a table
    separator = /(, )/;
    let tabMailRecipient = file[3].split(separator).filter(val => !val.match(separator));
    for (let i=0; i < tabMailRecipient.length; i++) {
        while (tabMailRecipient[i].charAt(0) === ' ') tabMailRecipient[i] = tabMailRecipient[i].substring(1);
        while (tabMailRecipient[i].charAt(0) === '\t') tabMailRecipient[i] = tabMailRecipient[i].substring(1);
    }
    file[3] = tabMailRecipient;
    //we join all the message into one element
    let message = [];
    for (let index = 15; index < file.length; index++) message[index-15] = file[index];
    file[15] = message.join('\n');
    return file;
}

// transformDate : transform the date to be interpretable
transformDate = date => {
    let separator = /[ :]/;
    if (date.charAt(0) === ' ') date = date.substring(1);
    date = date.split(separator).filter(val => !val.match(separator));
    let transformDate = [];
    transformDate[0] = date[3];
    switch (date[2]) {
        case 'Jan': transformDate[1] = 0; break;
        case 'Feb': transformDate[1] = 1; break;
        case 'Mar': transformDate[1] = 2; break;
        case 'Apr': transformDate[1] = 3; break;
        case 'May': transformDate[1] = 4; break;
        case 'Jun': transformDate[1] = 5; break;
        case 'Jul': transformDate[1] = 6; break;
        case 'Aug': transformDate[1] = 7; break;
        case 'Sep': transformDate[1] = 8; break;
        case 'Oct': transformDate[1] = 9; break;
        case 'Nov': transformDate[1] = 10; break;
        case 'Dec': transformDate[1] = 11; break;
    }

    transformDate[2] = date[1];
    transformDate[3] = parseInt(date[4]) + 1;
    transformDate[4] = date[5];
    transformDate[5] = date[6];

    return new Date(transformDate[0], transformDate[1], transformDate[2], transformDate[3], transformDate[4], transformDate[5]);
}

// transformName : transform the author and recipient to be interpretable
transformName = name => {
    let regexName = /^[A-Za-z]+((\s)?(['-.]?([A-Za-z])+))*$/;
    let tabName = [], needToInverseNameAndFirstname = [];
    if (name.match(regexName)) {
        tabName[0] = name;
        return tabName;
    } else{
        let temporaryName = [];
        if (name.match(/, /) && !name.match(/"[A-Za-z]+,/)){
            name = name.split(/, /).filter(val => !val.match(/, /));
            temporaryName = name;
        } else if (name.match(/"[A-Za-z]+,/)){
            name = name.split(/, /).filter(val => !val.match(/, /));
            for (let indexForGroup = 0; indexForGroup < name.length-1; indexForGroup++) {
                if (name[indexForGroup].match(/"[A-z]+/) && name[indexForGroup+1].match(/[^\"]+" [<A-z@0-9\s]+/)) {
                    name[indexForGroup] = name[indexForGroup] + ' ' + name[indexForGroup+1];
                    name.splice(indexForGroup+1, 1);
                    needToInverseNameAndFirstname.push(indexForGroup);
                }
            }
            temporaryName = name;
        } else temporaryName[0] = name;
        for (let indexRecipient = 0; indexRecipient < temporaryName.length; indexRecipient++){
            if (temporaryName[indexRecipient].match(regexName)) tabName[indexRecipient] = temporaryName[indexRecipient];
            else{
                if (temporaryName[indexRecipient].match(/ </) && !temporaryName[indexRecipient].match(/, /)) {
                    temporaryName[indexRecipient] = temporaryName[indexRecipient].split(' <');
                    temporaryName[indexRecipient] = temporaryName[indexRecipient][0];
                    if (temporaryName[indexRecipient].match(/"/)) {
                        temporaryName[indexRecipient] = temporaryName[indexRecipient].split('"').filter(val => !val.match('"'));
                        tabName[indexRecipient] = temporaryName[indexRecipient][1];
                    } else tabName[indexRecipient] = temporaryName[indexRecipient];
                } else tabName[indexRecipient] = '';
            }
        }
        for (let indexInverse = 0; indexInverse < needToInverseNameAndFirstname.length; indexInverse++){
            if (tabName[needToInverseNameAndFirstname[indexInverse]].match(/\s/)){
                let temporaryTab = tabName[needToInverseNameAndFirstname[indexInverse]];
                temporaryTab = temporaryTab.split(/ /).filter(val => !val.match(/ /));
                tabName[needToInverseNameAndFirstname[indexInverse]] = temporaryTab[1] + ' ' + temporaryTab[0];
            }
        }
        return tabName;
    }
}

// inputIsFolder : verify if the input is a folder
inputIsFolder = path => {
    return fs.lstatSync(path).isDirectory();
}

// inputIsFile : verify if the input is a file
inputIsFile = path => {
    return fs.lstatSync(path).isFile();
}

module.exports = { extractMail };