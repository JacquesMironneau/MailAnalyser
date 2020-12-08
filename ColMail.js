/**
    * Colection Mail class, represent an email collection.
    * @author Augustin Borne
*/
const {Mail} = require('./Mail.js');
const { Contact } = require('./contact');

class ColMail{ 
    constructor(){
        this.listeMail = new Array();
    }

    setListeMail(mailEntre){
        if(mailEntre instanceof Mail){
            this.listeMail.push(mailEntre);
        }else{
            throw Error('Invalid data type, a Mail element is required')
        }
        
    }
    setListeMail(mailEntre){
        if(mailEntre instanceof ColMail){
            mailEntre.getMail.forEach(element => {
                if(element instanceof Mail){
                    this.listeMail.push(element);
                }
            });
        }else{
            throw Error('Invalid data type, a ColMail element is required')
        }
        
    }
  

    get toString(){
        let res = "colection " + this.nomCollection+" :";
        this.listeMail.forEach(element => res+= "\n" +element.toString);
        return res;
    }
    get listeMail(){
        return this.listeMail;
    }

    mailInInterval(date1,date2){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.isBetweenDate(date1,date2)){
                    result.setListeMail(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            }
        });
        return result;
    }

    bestCollab(email){
        result =[];
    }

    chercherNbinteraction(email1,email2){
        let result = 0;
        this.listeMail.forEach(element => {
            if((element.getEmailAuthor===email1 && element.getEmailReceiver===email2) || (element.getEmailAuthor===email2 && element.getEmailReceiver===email1)){
                result++;
            }
        });
        return result;
    }

    bestCollab(nom,prenom){
       let colab = new Array();
       this.listeMail.forEach(element => {
           if(element instanceof Mail){
               if(element.authorToContact.getName()===nom && element.authorToContact.getLastName()===prenom){
                    result.setListeMail(element);

                    let estInclus = false;
                    let keys = colab.keys();
                    keys.forEach(element2 => {
                        if(element2 === element.recipientToContact() ){
                            estInclus=true;
                            break;
                        }
                    });
                    if(estInclus){
                        colab[element.recipientToContact()]++;
                    }else{
                        colab[element.recipientToContact()]=1;
                    }
               }else if(element.recipientToContact.getName()===nom && element.recipientToContact.getLastName()===prenom){
                    result.setListeMail(element);

                    let estInclus = false;
                    let keys = colab.keys();
                    keys.forEach(element2 => {
                        if(element2 === element.authorToContact() ){
                            estInclus=true;
                            break;
                        }
                    });
                    if(estInclus){
                        colab[element.authorToContact]++;
                    }else{
                        colab[element.authorToContact]=1;
                    }
               }
           }
       });    
    }

    chercherTopX(listeColab,topX){
        let colab = new Array();
        let keysLeft = left.keys();
        for(i=0;i<topX;i++){

        }
    }

    triColab(listeColab){
        if(listeColab.length < 2){
            return listeColab;
        }

        var mid = Math.floor(listeColab.length / 2);
        var right = listeColab.slice(mid);
        var left = listeColab.slice(0,mid);
        var p = this.mergeColab(this.triColab(left),this.triColab(right));

        p.unshift(0, listeColab.length);
        listeColab.splice.apply(listeColab, p);
        return listeColab;
    }

    mergeColab(left,right){
        var tab = new Array();
        var l= 0;
        var r =0;

        while(l < left.length && r < right.length){
            let keysLeft = left.keys();
            let keysRight = right.keys();
            if(left[keysLeft[l]] < right[keysRight[r]]){
                tab[keysLeft[l++]]=left[keysLeft[l++]];
            }else{
                tab[keysRight[r++]]=right[keysRight[r++]];
            }
        }
        return tab.concat(left.slice(l)).concat(right.slice(r));
    }

    MostUsedTerm(email){
        result=[];
    }

    MostUsedTerm(nom,prenom){
        result=[];
    }

    SearchByEmail(email){
        result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getEmailAuthor === email || element.getEmailReceiver === email){
                    result.setListeMail(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            } 
        });
        return result;
    }

    MailInbusyDays(email,date1,date2){
        let resultTemp = this.mailInInterval(date1,date2);
        let result = new ColMail();
        resultTemp.forEach(element => {
            if(element instanceof Mail){
                if(element.mailInBusyDays && element.getEmailAuthor==email){
                    result.setListeMail(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required');
            }
        });
        return result;

        
    }

    SearchByAuthor(nom,prenom){
        result = new ColMail();
        const regexNom = new RegExp(nom);
        const regexPrenom = new RegExp(prenom);
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(regexNom.test(element.getAuthor) && regexPrenom.test(element.getAuthor)){
                    result.setListeMail(element);
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            } 
        });
        return result;
    }

    colMailToContact(){
        let result = [];
        this.listeMail.forEach(element => {
            if(element instanceof mail){
                let contactTempAuthor = element.authorToContact();
                let contactTempRecipient = element.recipientToContact();
                let author = false;
                let recipient = false;

                //on verifie qu'il n'y a pas de doublon dans result(critere = mail)
                if(result.length != 0){
                    result.forEach(element => {
                        if(element.getMail()==contactTempAuthor.getMail()){
                            author=true;
                        }else if(element.getMail()==contactTempRecipient.getMail()){
                            recipient=true;
                        }

                        if(author && recipient){
                            break;
                        }
                    });

                    if(!author){
                        result.push(contactTempAuthor);
                    }
                    if(!recipient){
                        result.push(contactTempRecipient);
                    }
                }else{
                    result.push(contactTempAuthor);
                    result.push(contactTempRecipient);
                }
                
                
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
