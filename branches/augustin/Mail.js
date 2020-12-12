/**
    * Mail class, represent an email.
    * @author Augustin Borne
*/
const {Contact} = require('./contact');

class Mail{

    
    constructor(messageId,date,mailAuthor,mailRecipient,subject,version,contentType,encoding,author,recipient,copy,hCopy,path,origin,fileName,message){
        this.messageId=messageId;
        this.date=date;
        this.mailAuthor=mailAuthor;
        this.mailRecipient=mailRecipient;
        this.subject=subject;
        this.version=version;
        this.contentType=contentType;
        this.encoding=encoding;
        this.author=author;
        this.recipient=recipient;
        this.copy=copy;
        this.hCopy=hCopy;
        this.path=path;
        this.origin=origin;
        this.fileName=fileName;
        this.message=message;

    }

    get toString(){
        let res = "[";
        res+="\n messageID = "+this.messageId;
        res+="\n date = "+this.date;
        res+="\n mailAuthor = "+this.mailAuthor;
        res+="\n mailRecipient = ";
        this.mailRecipient.forEach(element => {
            res+=element+", ";
        }); 
        res+="\n subject = "+this.subject;
        res+="\n version = "+this.version;
        res+="\n contentType = "+this.contentType;
        res+="\n encoding = "+this.encoding;
        res+="\n author = "+this.author;
        res+="\n recipient = ";
        this.recipient.forEach(element => {
            res+=element+", ";
        });
        res+="\n copy = "+this.copy;
        res+="\n hcopy = "+this.hcopy;
        res+="\n path = "+this.path;
        res+="\n origin = "+this.origin;
        res+="\n filename = "+this.fileName;
        res+="\n message = "+this.message;
        res+="\n]";
        return res;
    }

    get toHumanReadableFormat()
    {
        let res = "FROM: " + this.mailAuthor + '\n';
        res += "TO: " + this.mailRecipient + '\n';
        res += "SUBJECT: " + this.subject + '\n';
        res += "\nCONTENT: " + this.message + "\n";
        return res;
    }

    setSubject(subject){
        this.subject=subject;
    }
    setDate(date){
        this.date=date;
    }
    setReceiver(receiver){
        this.mailRecipient=receiver;
    }
    setSender(sender){
        this.mailAuthor=sender;
    }
    setContent(content){
        this.message=content;
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

    isEqual(mail){
        if(mail instanceof Mail){
            if(mail===this){
                return true;
            }
        }else{
            throw Error('Invalid data type, a Mail element is required')
        }
    }

    isOlderThan(mail){
       if(mail instanceof Mail){
            if(mail.date.getTime()>this.date.getTime()){
                return true;
            }else{
                return false;
            }
       }else{
        throw Error('Invalid data type, a Mail element is required')
       }
    }
    isBetweenDate(date1,date2){
        if(this.date.getTime()>=date1.getTime() && this.date.getTime()<=date2.getTime()){
            return true;
        }else{
            false;
        }
     }

    isWeekend(){
        if(this.date.getDay===0 || this.date.getDay===6){
            return true;
        }else{
            return false;
        }
    }

    mailInBusyDays(){
        if(this.date.getHours()<=8 || this.date.getHours>=22 || this.isWeekend){
            return true;
        }else{
            return false;
        }
    }

    mailContainsTxtinMessage(txt){
        let pos = this.message.indexOf(txt);

        if(pos > 0){
            return true;
        }else{
            return false;
        }
    }

    mailContainsTxtinObject(txt){
        let pos = this.object.indexOf(txt);
        if(pos > 0){
            return true;
        }else{
            return false;
        }
    }

    authorToContact(){
        var lignes = this.author.split(/\s/);
        let contactTest = new Contact(lignes[0],lignes[1],this.mailAuthor);
        return contactTest;
    }

    get sizeRecipientMail(){
        let result = 0;
        this.mailRecipient.forEach(element => {
            result++;
        });
        return result;
    }

    recipientToContact(){
        let result = new Array();
        for(let i=0;i<this.sizeRecipientMail;i++){
            let lignes = this.recipient[i].split(/\s/);
            let contactTest = new Contact(lignes[0],lignes[1],this.mailRecipient[i]);
            result.push(contactTest)
        }
        
        return result;
    }

    recipientEmailTocontact(email){
        let result;
        let index = this.mailRecipient.indexOf(email);
        if(index !=-1){
            let lignes = this.recipient[index].split(/\s/);
            return new Contact(lignes[0],lignes[1],this.mailRecipient[index]);
        }else{
            throw Error('Invalid index n°'+index+', the email :'+email+' is not included in this Mail')
        }
        
    }

    emailIncludeInRecipientMail(email){
        if(this.mailRecipient.indexOf(email)!=-1){
            return true;
        }else{
            return false;
        }

    }

    personnIncludeInRecipient(personn){
        if(this.recipient.indexOf(personn)!=-1){
            return true;
        }else{
            return false;
        }

    }
}


module.exports = { Mail };