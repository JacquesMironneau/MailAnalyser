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
    setListeColMail(colMailEntre){
        if(colMailEntre instanceof ColMail){
            colMailEntre.getMail.forEach(element => {
                if(element instanceof Mail){
                    this.listeMail.push(element);
                }
            });
        }else{
            throw Error('Invalid data type, a ColMail element is required')
        }
        
    }
  

    get toString(){
        let res = "colection de Mail :";
        this.listeMail.forEach(element => res+= "\n" +element.toString);
        return res;
    }
    get getlisteMail(){
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

    bestCollabByEmail(email){
        let listecolab = this.collabByEmail({email});
        function nbEchange(contact,nbEchange){
            this.contact=contact;
            this.nbEchange=nbEchange;
        }
        let resultTemp = new Array();

        listecolab.forEach(element => {
            resultTemp.push(element,this.chercherNbinteraction(email,element.getMail));
        });

        let result = new Array();

        let nb = resultTemp.length;
        if(nb>10){
            nb=10;
        }

        for(let i=0;i<nb;i++){
            result.push(this.chercherMaxListeColab(resultTemp));
            resultTemp.splice(resultTemp.indexOf(this.chercherMaxListeColab(resultTemp)),1);
        }
        return result;
        


    }

    chercherMaxListeColab(listeColab){
        if(listeColab.length>0){
            let colabMax = null;
            listeColab.forEach(element => {
                if(colabMax===null){
                    colabMax=element;
                }else if(element.){

                }
            });
            
           

            return colabMax;
        }else{
            return null;
        }
        
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
    

    /**
     * 
     * @param {*} listAuthor
     * generer la liste des contacts de un ou plusieurs email et si il y a un tableau vide en argument, retourner tous les contacts de la collections de mail 
     * @author Augustin Borne
     */


    interactionBetweenCollabForACollab(email){

    }
    collabByEmail(listAuthor){
        
        let colabResult = new Array();
        if(listAuthor.length===0){
            colabResult=this.colMailToContact();
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
                            colabResult.push(element2.recipientToContact());
                        }
                    }else if(element2.getEmailReceiver===element){
                        let estInclus=false;
                        colabResult.forEach(element3 => {
                            if(element3.getMail===element2.getEmailAuthor()){
                                estInclus=true;
                            }
                        });
                        if(!estInclus){
                            colabResult.push(element2.authorToContact());
                        }
                    }
                });
            });
        }
        return colabResult;
        
    }
    
    //object (string * int)

    MostUsedTerm(email){
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
        let result = new ColMail();
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

    SearchByEmailAuthor(email){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getEmailAuthor === email ){
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


    //prendre le cas ou email est vide

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

    SearchByAuthor(personn){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getAuthor===personn || element.getRecipient===personn){
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
        let result = new Array();
        this.listeMail.forEach(element => {

            let contactTempAuthor = element.authorToContact();


            let contactTempRecipient = element.recipientToContact();

            let author = false;
            let recipient = false;

            //on verifie qu'il n'y a pas de doublon dans result(critere = mail)
            if(result.length != 0){
                result.forEach(element => {
                    if(element.getMail==contactTempAuthor.getMail){
                        author=true;
                    }else if(element.getMail==contactTempRecipient.getMail){
                        recipient=true;
                    }
                    /*
                    if(author && recipient){
                        break;
                    }*/
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
        let result =null;
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getMessageId === messageId){
                    result= element;
                }
            }else{
                throw Error('Invalid data type, a Mail element is required')
            }            
        });
        if(result !== null){
            return result;
        }else{
            return null;
        }
        
    }

}

module.exports = { ColMail };
