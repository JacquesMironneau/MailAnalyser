/**
    * Mail class, represent an email.
    * @author Augustin Borne
*/

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
        res+="\n mailRecipient = "+this.mailRecipient;
        res+="\n subject = "+this.subject;
        res+="\n version = "+this.version;
        res+="\n contentType = "+this.contentType;
        res+="\n encoding = "+this.encoding;
        res+="\n author = "+this.author;
        res+="\n recipient = "+this.recipient;
        res+="\n copy = "+this.copy;
        res+="\n hcopy = "+this.hcopy;
        res+="\n path = "+this.path;
        res+="\n origin = "+this.origin;
        res+="\n filename = "+this.fileName;
        res+="\n message = "+this.message;
        res+="\n]";
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

    isEqual(mail){
        if(mail instanceof Mail){
            if(mail===this){
                return true;
            }
        }else{
            return false;
        }
    }

    isOlderThan(mail){
       if(mail instanceof Mail){
            if(mail.date>this.date){
                return true;
            }else{
                return false;
            }
       }else{
           return false;
       }
    }

    isWeekend(){
        if(Date.prototype.getDay(this.date)===0 || Date.prototype.getDay(this.date)===6){
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
}


module.exports = { Mail };