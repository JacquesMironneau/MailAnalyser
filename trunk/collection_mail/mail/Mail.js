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
        res += "\n messageID = " + this.messageId +
            "\n date = " + this.date +
            "\n mailAuthor = " + this.mailAuthor +
            "\n mailRecipient = ";
        this.mailRecipient.forEach(element => res += element + ", ");
        res += "\n subject = " + this.subject +
            "\n version = " + this.version +
            "\n contentType = " + this.contentType +
            "\n encoding = " + this.encoding +
            "\n author = " + this.author[0] +
            "\n recipient = ";
        this.recipient.forEach(element => res += element + ", ");
        res += "\n copy = " + this.copy +
            "\n hCopy = " + this.hCopy +
            "\n path = " + this.path +
            "\n origin = " + this.origin +
            "\n filename = " + this.fileName +
            "\n message = " + this.message + "\n]";
        return res;
    }
    get toHumanReadableFormat(){
        return "FROM: " + this.mailAuthor + '\n' +
            "TO: " + this.mailRecipient + '\n' +
            "SUBJECT: " + this.subject + '\n' +
            "\nCONTENT: " + this.message + "\n";
    }

    setDate(date){
        this.date = date;
    }
    setReceiver(receiver){
        this.mailRecipient = receiver;
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
     * @name isOlderThan
     * @param {String} mail
     * vérifie si un mail est plus ancien a un autre
     */
    isOlderThan(mail){
        if(mail instanceof Mail) return mail.date.getTime() > this.date.getTime();
        else throw Error('Invalid data type, a Mail element is required');
    }

    /**
     * @name isBetweenDate
     * @param {Date} date1
     * @param {Date} date2
     * vérifie si un mail est compris entre 2 dates
     */
    isBetweenDate(date1,date2){
        return this.date.getTime() >= date1.getTime() && this.date.getTime() <= date2.getTime();
    }

    /**
     * @name isWeekend
     * vérifie si un mail est écrit pendant un weekend
     */
    isWeekend(){
        return this.date.getDay === 0 || this.date.getDay === 6;
    }

    /**
     * @name mailInBusyDays
     * vérifie si un mail est écrit pendant un busy day
     */
    mailInBusyDays(){
        return !!(this.date.getHours() < 8 || this.date.getHours() > 22 || this.isWeekend());
    }

    /**
     * @name mailContainsTextInObject
     * @param {String} txt
     * vérifie si un mail contient un message en objet
     */
    mailContainsTextInObject(txt){
        return this.object.indexOf(txt) > 0;
    }

    /**
     * @name authorToContact
     * revoie un contact correspondant à l'auteur
     */
    authorToContact(){
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
     * renvoie des contacts correspondants aux destinataires
     */
    recipientToContact(){
        let result = [], contactTest;
        for(let i=0; i < this.sizeRecipientMail; i++){
            if(this.recipient[i] !== ""){
                let lignes = this.recipient[i].split(/\s/);
                contactTest = new Contact(lignes[0], lignes[1], this.mailRecipient[i]);
            } else contactTest = new Contact("anonyme", "anonyme", this.mailRecipient[i]);
            result.push(contactTest);
        }
        return result;
    }

    recipientEmailToContact(email){
        let index = this.mailRecipient.indexOf(email);
        if(index !== -1){
            let lignes = this.recipient[index].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailRecipient[index]);
        } else throw Error('Invalid index n°' + index + ', the email :' + email + ' is not included in this Mail');
    }

    emailIncludeInRecipientMail(email){
        return this.mailRecipient.indexOf(email) !== -1;
    }

    personIncludeInRecipient(person){
        return this.recipient.indexOf(person) !== -1;
    }
}

module.exports = {Mail};