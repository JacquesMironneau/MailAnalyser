/* eslint-disable */
/**
    * Colection Mail class, represent an email collection.
    * @author Augustin Borne
*/
const {Mail} = require('./Mail.js');

class ColMail{ 
    constructor(nomCollection){
        this.nomCollection=nomCollection;
        this.listeMail = [];
    }

    setListeMail(mailEntre){
        if(mailEntre instanceof Mail){
            this.listeMail.push(mailEntre);
        }else{
            throw Error('Invalid data type, a Mail element is required')
        }
        
    }

    get toString(){
        let res = "colection " + this.nomCollection+" :";
        this.listeMail.forEach(element => res+= "\n" +element.toString);
        return res;
    }

    mailInInterval(date1,date2){
        result = [];
    }

    bestCollab(email){
        result =[];
    }
    bestCollab(nom,prenom){
        result =[];
    }

    MostUsedTerm(email){
        result=[];
    }

    MostUsedTerm(nom,prenom){
        result=[];
    }

    SearchByEmail(email){
        result=[];
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getEmailAuthor === email || element.getEmailReceiver === email){
                    result.push(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            } 
        });
        return result;
    }
    SearchByAuthor(nom,prenom){
        result=[];
        const regexNom = new RegExp(nom);
        const regexPrenom = new RegExp(prenom);
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(regexNom.test(element.getAuthor) && regexPrenom.test(element.getAuthor)){
                    result.push(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            } 
        });
        return result;
    }

    getMail(messageId){
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getMessageId === messageId){
                    return element;
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            }            
        });
        return "pas d'email correspondant a"+messageId;
    }

}

module.exports = { ColMail };
