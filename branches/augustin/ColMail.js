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

    /**
     * @name mailInInterval
     * @param {Date} date1 
     * @param {Date} date2 
     * 
     * Retourne une collection de mail correspondant au mail envoye pendant un intervalle de temps
     * @
     * @author Augustin Borne
     */
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
    /**
     * @name chercherNbinteraction
     * @param {String} email1 
     * @param {String} email2 
     * 
     * Retourne le nombre d'echange entre 2 adresses mail
     * 
     * @author Augustin Borne
     */
    chercherNbinteraction(email1,email2){
        let result = 0;
        this.listeMail.forEach(element => {
            if((element.getEmailAuthor===email1 && element.getEmailReceiver===email2) || (element.getEmailAuthor===email2 && element.getEmailReceiver===email1)){
                result++;
            }
        });
        return result;
    }

    /**
     * @name bestCollab
     * @param {String} nom 
     * @param {String} prenom 
     * 
     * Permet de retourner les collaborateurs d'un contact  qui echangent le plsu entre eux     (non fonctionnel pour le moment)
     * @author Augustin Borne
     */
    bestCollab(nom,prenom){
       let colab = new Object();
       this.listeMail.forEach(element => {
           if(element instanceof Mail){
               if(element.authorToContact.getName()===nom && element.authorToContact.getLastName===prenom){
                    result.setListeMail(element);

                    let estInclus = false;
                    let keys = colab.keys();
                    keys.forEach(element2 => {
                        if(element2 === element.recipientToContact ){
                            estInclus=true;
                            break;
                        }
                    });
                    if(estInclus){
                        colab[element.recipientToContact]++;
                    }else{
                        colab[element.recipientToContact]=1;
                    }
               }else if(element.recipientToContact.getName===nom && element.recipientToContact.getLastName===prenom){
                    result.setListeMail(element);

                    let estInclus = false;
                    let keys = colab.keys();
                    keys.forEach(element2 => {
                        if(element2 === element.authorToContact ){
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
    /**
     * @name chercherTopX
     * @param {Contact*Int} listeColab 
     * @param {Int} topX 
     * 
     * Permet de retoruner le top X des echanges de colaborateur a partir d'une liste du type contact x int
     * 
     * @author Augustin Borne
     */

    chercherTopX(listeColab,topX){
        let colab = new Object();
        let keysLeft = left.keys();
        
        if(listeColab.length>0){
            for(let i = 0;i<topX;i++){
                
                    let max = null;
                    let nbMax = null;
                    for(var i in listeColab){
                        if(max===null){
                            max=i;
                            nbMax=listeColab[i];
                        }else{
                            if(listeColab[i]>nbMax){
                                max=i;
                                nbMax=listeColab[i];
                            }
                        }
                    }
                    colab[max]=nbMax;

                    listeColab = listeColab.filter(function(item){
                        return item !== max;
                    })
                
            }
            return colab;
        }else{
            return listeColab;
        }
    }

    /**
     * 
     * @param {*} listAuthor
     * generer la liste des contacts de un ou plusieurs email et si il y a un tableau vide en argument, retourner tous les contacts de la collections de mail 
     * @author Augustin Borne
     */



    collabByEmail(listAuthor){
        let colabResult = new Array();
        if(listAuthor.lengh===0){
            
            colabResult=this.colMailToContact;
        }else{
            listAuthor.forEach(element => {
                this.listeMail.forEach(element2 => {

                    if(element2.getEmailAuthor===element){
                        let estInclus=false;
                        colabResult.forEach(element3 => {
                            if(element3.getMail===element2.getEmailReceiver){
                                estInclus=true;
                            }
                        });

                        if(!estInclus){
                            colabResult.push(element2.recipientToContact);
                        }
                    }else if(element2.getEmailReceiver===element){
                        let estInclus=false;
                        colabResult.forEach(element3 => {
                            if(element3.getMail===element2.getEmailAuthor){
                                estInclus=true;
                            }
                        });
                        if(!estInclus){
                            colabResult.push(element2.authorToContact);
                        }
                    }
                });
            });
        }
        return colabResult;
        
    }
   
    MostUsedTerm(email){
        result=[];
    }

    MostUsedTerm(nom,prenom){
        result=[];
    }

    /**
     * @name SearchByEmail
     * @param {*} email
     * 
     * Chercher dans la collection de mail tous les mail dont l'auteur ou le destinataire correspond a l'argument
     * @author Augustin Borne
     */

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

    /**
     * @name MailInbusyDays
     * @param {Mail} email 
     * @param {Date} date1 
     * @param {Date} date2
     *Permet de retourner tous les mails envoyés le weekend ou le soir dans un intervalle de temps 
     *
     * @author Augustin Borne
     */

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

    /**
     * @name SearchByAuthor
     * @param {String} nom 
     * @param {String} prenom
     * 
     * permet de retourner tous les mails ecrits par l'auteur donné en argument
     * @author Augustin Borne
     */

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
    /**
     * @name colMailToContact
     * Permet de retoruner tous les contact de la collection de mail
     * @author Augustin Borne
     */
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

    /**
     * @name getMail
     * @param {String} messageId
     * 
     * Permet d'avoir un mail a partir de l'id de ce mail (inutile)
     * @author Augustin Borne
     */
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
