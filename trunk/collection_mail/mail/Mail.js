const {Contact} = require('../../contact/contact');

/**
 * Classe Mail, représente un mail.
 * @author Augustin Borne
 */
class Mail{
    /**
     * Constructeur de la classe Mail
     * @param messageId
     * @param date
     * @param mailAuthor
     * @param mailRecipient
     * @param subject
     * @param version
     * @param contentType
     * @param encoding
     * @param author
     * @param recipient
     * @param copy
     * @param hCopy
     * @param path
     * @param origin
     * @param fileName
     * @param message
     */
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

    /**
     * Convertit un objet mail en String pour l'affichage
     * @return {string}
     */
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

    /**
     * Retourne un mail visible correctement pour un humain
     * @return {string}
     */
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
     * Vérifie si un mail est plus ancien qu'un autre
     * @param {String} mail
     * @return {boolean | Error}
     */
    isOlderThan(mail){
        if(mail instanceof Mail) return mail.date.getTime() > this.date.getTime();
        else throw Error('Invalid data type, a Mail element is required');
    }

    /**
     * Vérifie si un mail est compris entre 2 dates
     * @param {Date} date1
     * @param {Date} date2
     * @return {boolean}
     */
    isBetweenDate(date1,date2){
        return this.date.getTime() >= date1.getTime() && this.date.getTime() <= date2.getTime();
    }

    /**
     * Vérifie si un mail est écrit pendant un weekend
     * @return {boolean}
     */
    isWeekend(){
        return this.date.getDay === 0 || this.date.getDay === 6;
    }

    /**
     * Vérifie si un mail est écrit pendant un busy day
     * @return {boolean}
     */
    mailInBusyDays(){
        return !!(this.date.getHours() < 8 || this.date.getHours() > 22 || this.isWeekend());
    }

    /**
     * Vérifie si un mail contient un message en objet
     * @param {String} txt
     * @return {boolean}
     */
    mailContainsTextInObject(txt){
        return this.object.indexOf(txt) > 0;
    }

    /**
     * Renvoie un contact correspondant à l'auteur
     * @return {Contact}
     */
    authorToContact(){
        if(this.author!==""){
            let lignes = this.author[0].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailAuthor);
        } else return new Contact("anonyme","anonyme",this.mailAuthor);
    }

    /**
     * Renvoie la taille de la liste recipient mail
     * @return {number}
     */
    get sizeRecipientMail(){
        let result = 0;
        this.mailRecipient.forEach(() => result++);
        return result;
    }

    /**
     * Renvoie des contacts correspondants aux destinataires
     * @return {[]}
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

    /**
     * Retourne un contact créé à partir d'un mail
     * @param email
     * @return {Contact}
     */
    recipientEmailToContact(email){
        let index = this.mailRecipient.indexOf(email);
        if(index !== -1){
            let lignes = this.recipient[index].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailRecipient[index]);
        } else throw Error('Invalid index n°' + index + ', the email :' + email + ' is not included in this Mail');
    }

    /**
     * Vérifie si un mail est contenu dans la liste des recipients mails
     * @param email
     * @return {boolean}
     */
    emailIncludeInRecipientMail(email){
        return this.mailRecipient.indexOf(email) !== -1;
    }

    /**
     * Vérifie si une personne est contenue dans recipient
     * @param person
     * @return {boolean}
     */
    personIncludeInRecipient(person){
        return this.recipient.indexOf(person) !== -1;
    }
}

module.exports = {Mail};