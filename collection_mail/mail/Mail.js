/**
 * Mail class, represent an email.
 * @author Augustin Borne
 */
const {Contact} = require('../../contact/contact');

class Mail{
    constructor(messageId, date, mailAuthor, mailRecipient, subject, version, contentType, encoding, author, recipient, copy, hCopy, path, origin, fileName, message){
        this.messageId = messageId;
        this.date = date;
        this.mailAuthor = mailAuthor;
        this.mailRecipient = mailRecipient;
        this.subject = subject;
        this.version = version;
        this.contentType = contentType;
        this.encoding = encoding;
        this.author = author;
        this.recipient = recipient;
        this.copy = copy;
        this.hCopy = hCopy;
        this.path = path;
        this.origin = origin;
        this.fileName = fileName;
        this.message = message;
    }

    get toString(){
        let res = "[";
        res += "\n messageID = " + this.messageId;
        res += "\n date = " + this.date;
        res += "\n mailAuthor = " + this.mailAuthor;
        res += "\n mailRecipient = ";
        this.mailRecipient.forEach(element => res += element + ", ");
        res += "\n subject = " + this.subject;
        res += "\n version = " + this.version;
        res += "\n contentType = " + this.contentType;
        res += "\n encoding = " + this.encoding;
        res += "\n author = " + this.author[0];
        res += "\n recipient = ";
        this.recipient.forEach(element => res += element + ", ");
        res += "\n copy = " + this.copy;
        res += "\n hcopy = " + this.hcopy;
        res += "\n path = " + this.path;
        res += "\n origin = " + this.origin;
        res += "\n filename = " + this.fileName;
        res += "\n message = " + this.message;
        res += "\n]";
        return res;
    }
    get toHumanReadableFormat(){
        let res = "FROM: " + this.mailAuthor + '\n';
        res += "TO: " + this.mailRecipient + '\n';
        res += "SUBJECT: " + this.subject + '\n';
        res += "\nCONTENT: " + this.message + "\n";
        return res;
    }

    setSubject(subject){
        this.subject = subject;
    }
    setDate(date){
        this.date = date;
    }
    setReceiver(receiver){
        this.mailRecipient = receiver;
    }
    setSender(sender){
        this.mailAuthor = sender;
    }
    setContent(content){
        this.message = content;
    }

    get getDate(){
        return this.date;
    }
    get getMessageId(){
        return this.messageId;
    }
    get getEmailAuthor(){
        return this.mailAuthor;
    }
    get getEmailReceiver(){
        return this.mailRecipient;
    }
    get getAuthor(){
        return this.author;
    }
    get getRecipient(){
        return this.recipient;
    }
    get getSubject(){
        return this.subject;
    }

    /**
     * @name isEqual
     * @param {String} mail
     * verifie si un mail est egal a un autre
     */
    isEqual(mail){
        if(mail instanceof Mail){
            if(mail === this) return true;
        } else throw Error('Invalid data type, a Mail element is required');
    }

    /**
     * @name isOlderThan
     * @param {String} mail
     * verifie si un mail est plus ancien a un autre
     */
    isOlderThan(mail){
        if(mail instanceof Mail) return mail.date.getTime() > this.date.getTime();
        else throw Error('Invalid data type, a Mail element is required');
    }

    /**
     * @name isBetweenDate
     * @param {Date} date1
     * @param {Date} date2
     * verifie si un mail est compris entre 2 dates
     */
    isBetweenDate(date1,date2){
        return this.date.getTime() >= date1.getTime() && this.date.getTime() <= date2.getTime();
    }

    /**
     * @name isWeekend
     * verifie si un mail est ecrit pendant un weekend
     */
    isWeekend(){
        return this.date.getDay === 0 || this.date.getDay === 6;
    }

    /**
     * @name mailInBusyDays
     * Verifie si un mail est ecrit pendant un busy day
     */
    mailInBusyDays(){
        return !!(this.date.getHours() < 8 || this.date.getHours() > 22 || this.isWeekend());
    }

    /**
     * @name mailContainsTxtinMessage
     * @param {String} txt
     * verifie si un mail contient un message(txt) dans la section message
     */
    mailContainsTxtinMessage(txt){
        let pos = this.message.indexOf(txt);
        return pos > 0;
    }

    /**
     * @name mailContainsTxtinObject
     * @param {String} txt
     * verifie si un mail contient un message en objet
     */
    mailContainsTxtinObject(txt){
        let pos = this.object.indexOf(txt);
        return pos > 0;
    }

    /**
     * @name authorToContact
     * revoie un contact correpondant a l'auteur
     */
    authorToContact(){
        //console.log(this.author);
        if(this.author!==""){
            let lignes = this.author[0].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailAuthor);
        } else return new Contact("anonyme","anonyme",this.mailAuthor);
    }

    get sizeRecipientMail(){
        let result = 0;
        this.mailRecipient.forEach(() => result++);
        return result;
    }

    /**
     * @name recipientToContact
     * renvoie des contacts correpondants aux destinataires
     */
    recipientToContact(){
        let result = [];
        let contactTest;
        for(let i=0;i<this.sizeRecipientMail;i++){
            if(this.recipient[i]!==""){
                let lignes = this.recipient[i].split(/\s/);
                contactTest = new Contact(lignes[0],lignes[1],this.mailRecipient[i]);
            } else contactTest = new Contact("anonyme","anonyme",this.mailRecipient[i]);
            result.push(contactTest);
        }
        return result;
    }

    recipientEmailTocontact(email){
        let index = this.mailRecipient.indexOf(email);
        if(index !== -1){
            let lignes = this.recipient[index].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailRecipient[index]);
        } else throw Error('Invalid index n°' + index + ', the email :' + email + ' is not included in this Mail');
    }

    emailIncludeInRecipientMail(email){
        return this.mailRecipient.indexOf(email) !== -1;
    }

    personnIncludeInRecipient(personn){
        return this.recipient.indexOf(personn) !== -1;
    }

    dateFromMail(){
        const mailbeginMonth = ((this.getDate.getMonth() + 1) < 10) ? '0' + (this.getDate.getMonth() +1) : (this.getDate.getMonth() + 1);
        const mailbeginDay = (this.getDate.getDate() < 10) ? '0' + this.getDate.getDate() : this.getDate.getDate();
        return ` ${mailbeginMonth}/${mailbeginDay}/${this.getDate.getFullYear()}`;
    }
}

module.exports = {Mail};