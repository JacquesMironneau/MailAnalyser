/**
    * Colection Mail class, represent an email collection.
    * @author Augustin Borne
*/
const {Mail} = require('./Mail.js');
const { Contact } = require('./contact.js');
const { Interaction } = require('./Interaction.js');
const { NbUseTerm } = require('./NbUseTerm.js');

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

    get toHumanReadableString()
    {
        let res = '';
        this.listeMail.forEach(mail => res += '\n' + mail.toHumanReadableFormat)
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
    /**
     * @name bestCollab
     * @param {String} email
     * 
     * Permet de retourner les collaborateurs d'un contact  qui echangent le plus entre eux
     * @author Augustin Borne
     */
    bestCollabByEmail(email){
        let tab = [email];

        //Creation du contact a partir de l'email
        let colTemp = this.SearchByEmail(email);
        let contactEmail;
        if(colTemp.getlisteMail.length>0){
            let m = colTemp.getlisteMail[0];
            if(m.getEmailAuthor===email){
                contactEmail = m.authorToContact();
            }else{
                contactEmail = m.recipientToContact();
            }
        }
        


        let listecolab = this.collabByEmail(tab);
        let resultTemp = new Array();

        listecolab.forEach(element => {
            const temp = new Interaction(contactEmail,element,this.chercherNbinteraction(email,element.getMail));
            resultTemp.push(temp);
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
                }else if(element.getNbEchange>colabMax.getNbEchange){
                    colabMax=element;
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
     * @name interactionBetweenCollabForACollab
     * @param {String} email 
     * 
     * Renvoie le nombre d'interaction entre chaque contact d'une liste de contact d'un collaborateur donnée
     * @author Augustin Borne
     */
    interactionBetweenCollabForACollab(email){
        let tab = [email];
        let listeColab = this.collabByEmail(tab);
        let result = new Array();
        
        for(let i=0;i<listeColab.length;i++){
            for(let y=i+1;y<listeColab.length;y++){
                result.push(new Interaction(listeColab[i],listeColab[y],0));
            }
        }
        result.forEach(element => {
            element.setNbEchange(this.chercherNbinteraction(element.getContact1.getMail,element.getContact2.getMail));
        });
        return result;
    }
    

    /**
     * 
     * @param {*} listAuthor
     * generer la liste des contacts de un ou plusieurs email et si il y a un tableau vide en argument, retourner tous les contacts de la collections de mail 
     * @author Augustin Borne
     */


    
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
    
    /**
     * @name MostUsedTerm
     * @param {String} email
     * Renvoie un tableau contenant les 10 termes les plus utilisé dans les objet de mail
     * @author Augustin Borne
     */

    MostUsedTerm(email){
        let colTemp = this.SearchByEmail(email);
        let result = new Array();
        colTemp.getlisteMail.forEach(element => {
            let tabTemp = element.getSubject.split(/\s/);
            tabTemp.forEach(element2 => {
                
               if(element2!=="" && element2!==" "){
                
                if(result.length===0){
                    result.push(new NbUseTerm(element2,1));
                }else{
                 let isInclude = false;
                 
                 result.forEach(element3 => {
                    //console.log("element 3 :"+element3.getTerm+" ,element2 :"+element2);
                     if(element3.getTerm===element2){
                        //console.log("test");
                         isInclude=true;
                         element3.setNbUse(element3.getNbUse+1);
                     }
                 });
                 if(!isInclude){
                     result.push(new NbUseTerm(element2,1));
                 }
                }
               }
                         
            });
        });
        let nb = result.length;
        let resultFin = new Array();

        if(nb>10){
            nb=10;
        }

        for(let i=0;i<nb;i++){
            resultFin.push(this.chercherMaxListeTerm(result));
            
            result.splice(result.indexOf(this.chercherMaxListeTerm(result)),1);
        }
        
        return resultFin;      
    }
    chercherMaxListeTerm(listeTerm){
        if(listeTerm.length>2){
            
            let termMax = listeTerm[0];
            for(let i=1;i<listeTerm.length;i++){
                if(listeTerm[i].getNbUse>termMax.getNbUse){
                    termMax=listeTerm[i];
                    
                }
            }
 
            return termMax;
        }else if(listeTerm.length>0){
            return listeTerm[0];
        }else{
            return null;
        } 
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

    /**
     * @name SearchByEmailAuthor
     * @param {*} email
     * 
     * Chercher dans la collection de mail tous les mail dont l'auteur correspond a l'argument
     * @author Augustin Borne
     */

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
     *Permet de retourner tous les mails envoyés le weekend ou le soir dans un intervalle de temps (email peut etre null)
     *
     * @author Augustin Borne
     */

    MailInbusyDays(email,date1,date2){
        let resultTemp = this.mailInInterval(date1,date2);
        let result = new ColMail();
        resultTemp.getlisteMail.forEach(element => {
            if(element instanceof Mail){
                if(email!==null){
                    if(element.mailInBusyDays() && element.getEmailAuthor==email){
                        result.setListeMail(element);
                    }
                }else{
                    if(element.mailInBusyDays()){
                        result.setListeMail(element);
                    } 
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
