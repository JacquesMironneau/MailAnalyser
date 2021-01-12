/**
 * Collection Mail class, represent an email collection.
 * @author Augustin Borne
 */
const {Mail} = require('./mail/Mail.js');
require('../contact/contact.js');
const {Interaction} = require('../interaction/Interaction.js');
const {NbUseTerm} = require('../term_nb_utilisation/NbUseTerm.js');

class ColMail{
    constructor(){
        this.listeMail = [];
    }

    /**
     * @name setListeMail
     * Ajoute un élement de type mail à la liste des mails
     * @param inputMail
     */
    setListeMail(inputMail){
        if(inputMail instanceof Mail){
            if(this.verifInstanceOfMail(inputMail)) this.listeMail.push(inputMail);
            else{
                //console.log("ERROR : invalid data format for Mail");
            }
        } else throw Error('Invalid data type, a Mail element is required');
    }

    /**
     * @name verifInstanceOfMail
     * Vérifie si l'entrée est bien un Mail valide
     * @param inputMail
     * @return {boolean}
     */
    verifInstanceOfMail(inputMail){
        let result = true;
        if(inputMail instanceof Mail){
            if (inputMail.getSubject === undefined){
                //console.log("subject undefined");
                result = false;
            }
            else if(inputMail.getEmailReceiver.length !== inputMail.getRecipient.length){
                //console.log("longeur tab email != long tab ");
                result = false;
            }
            else if(inputMail.author === undefined){
                //console.log("pas auteur ");
                result = false;
            }
            else if(inputMail.getEmailAuthor === undefined || inputMail.getEmailAuthor === ""){
                //console.log("pas email auteur ou email auteur vide ");
                result = false;
            }
            else if(!(inputMail.getDate instanceof Date)){
                //console.log("pas de date");
                result = false;
            }
            return result;
        } else return false;
    }

    /**
     * @name toString
     * Affichage d'une collection de mails
     * @return {string}
     */
    get toString(){
        let res = "collection de Mail :";
        this.listeMail.forEach(element => res += "\n" + element.toString);
        return res;
    }

    /**
     * @name toHumanReadableString
     * Affiche la liste de mails de manière visible pour un humain
     * @return {string}
     */
    get toHumanReadableString(){
        let res = '';
        this.listeMail.forEach(mail => res += '\n' + mail.toHumanReadableFormat);
        return res;
    }
    get getListMail(){
        return this.listeMail;
    }

    /**
     * @name mailInInterval
     * @param {Date} date1
     * @param {Date} date2
     *
     * Retourne une collection de mail correspondant au mail envoyé pendant un intervalle de temps
     * @author Augustin Borne
     */
    mailInInterval(date1, date2){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail) {
                if (element.isBetweenDate(date1, date2)) result.setListeMail(element);
            } else throw Error('Invalid data type, a Mail element is required');
        });
        return result;
    }

    /**
     * @name bestCollab
     * @param {String} email
     *
     * Permet de retourner les collaborateurs d'un contact  qui échangent le plus entre eux
     * @author Augustin Borne
     */
    bestCollabByEmail(email){
        let tab = [email];

        //Creation du contact a partir de l'email
        let tempCollection = this.searchByEmail(email);
        let contactEmail;
        if(tempCollection.getListMail.length > 0){
            let mail = tempCollection.getListMail[0];
            if(mail.getEmailAuthor === email) contactEmail = mail.authorToContact();
            else contactEmail = mail.recipientEmailToContact(email);
        }

        let listeCollab = this.collabByEmail(tab);
        let resultTemp = [];

        listeCollab.forEach(element => {
            const temp = new Interaction(contactEmail,element,this.searchNbInteraction(email,element.getMail));
            resultTemp.push(temp);
        });

        let result = [];
        let nb = resultTemp.length > 10 ? 10 : resultTemp.length;

        for(let i=0; i < nb; i++){
            result.push(this.searchMaxListeCollab(resultTemp));
            resultTemp.splice(resultTemp.indexOf(this.searchMaxListeCollab(resultTemp)),1);
        }
        return result;
    }

    /**
     * @name searchMaxListeCollab
     * Renvoie le collaborateur qui a eu le plus d'échanges dans la liste
     * @param listeCollab
     * @return {null | []}
     */
    searchMaxListeCollab(listeCollab){
        if(listeCollab.length > 0){
            let collabMax = null;
            listeCollab.forEach(element => {
                if(collabMax === null || element.getNbExchanges > collabMax.getNbExchanges) collabMax = element;
            });
            return collabMax;
        } else return null;
    }

    /**
     * @name searchNbInteraction
     * @param {String} email1
     * @param {String} email2
     *
     * Retourne le nombre d'échanges entre 2 adresses mail
     *
     * @author Augustin Borne
     */
    searchNbInteraction(email1, email2){
        let result = 0;
        this.listeMail.forEach(element => {
            if((element.getEmailAuthor === email1 && element.emailIncludeInRecipientMail(email2)) || (element.getEmailAuthor === email2 && element.emailIncludeInRecipientMail(email1))) result++;
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
        let listeCollab = this.collabByEmail(tab);
        listeCollab.forEach(element => {
            if(element.getMail === email){
                //console.log(element);
                listeCollab.splice(listeCollab.indexOf(element),1);
            }
        });
        //console.log(listeCollab);
        let result = [];

        for(let i=0; i < listeCollab.length; i++){
            for(let j=i+1; j < listeCollab.length; j++) result.push(new Interaction(listeCollab[i],listeCollab[j],0));
        }
        result.forEach(element => element.setNbExchanges(this.searchNbInteraction(element.getContact1.getMail,element.getContact2.getMail)));
        return result;
    }

    /**
     * @name collabByEmail
     * @param {*} listAuthor
     * générer la liste des contacts de un ou plusieurs email et si il y a un tableau vide en argument, retourner tous les contacts de la collections de mail
     * @author Augustin Borne
     */
    collabByEmail(listAuthor){
        let collabResult = [];
        if(listAuthor.length === 0) collabResult = this.colMailToContact();
        else{
            listAuthor.forEach(author => {
                this.listeMail.forEach(mail => {
                    if(mail.getEmailAuthor === author){
                        mail.recipientToContact().forEach(contact => {
                            let isIncluded = collabResult.some(element => {
                                return element.getMail === contact.getMail;
                            });
                            if(!isIncluded) collabResult.push(contact);
                        });
                    }else if(mail.emailIncludeInRecipientMail(author)){
                        let isIncluded = collabResult.some(element => {
                            return element.getMail === mail.getEmailAuthor;
                        });
                        if(!isIncluded) collabResult.push(mail.authorToContact());
                    }
                });
            });
        }
        return collabResult;
    }

    /**
     * @name mostUsedTerm
     * @param {String} email
     * Renvoie un tableau contenant les 10 termes les plus utilisé dans les objet de mail
     * @author Augustin Borne
     */
    mostUsedTerm(email){
        let colTemp = this.searchByEmail(email);
        let result = [];
        colTemp.getListMail.forEach(mail => {
            mail.getSubject.split(/\s/).forEach(word => {
                if(word !== "" && word !== " "){
                    if(result.length === 0) result.push(new NbUseTerm(word,1));
                    else{
                        let isInclude = false;
                        result.forEach(element => {
                            if(element.getTerm === word){
                                isInclude=true;
                                element.setNbUse(element.getNbUse+1);
                            }
                        });
                        if(!isInclude) result.push(new NbUseTerm(word,1));
                    }
                }
            });
        });
        let nb = result.length > 10 ? 10 : result.length;
        let resultFin = [];

        for(let i=0;i<nb;i++){
            resultFin.push(this.searchMaxListTerm(result));
            result.splice(result.indexOf(this.searchMaxListTerm(result)),1);
        }
        return resultFin;
    }

    /**
     * @name searchMaxListTerm
     * Renvoie le terme le plus utilisé de la liste passé en paramètre
     * @param listeTerm
     * @return {null|*}
     */
    searchMaxListTerm(listeTerm){
        if(listeTerm.length > 2){
            let termMax = listeTerm[0];
            for(let i=1; i<listeTerm.length; i++){
                if(listeTerm[i].getNbUse>termMax.getNbUse) termMax=listeTerm[i];
            }
            return termMax;
        } else if(listeTerm.length > 0) return listeTerm[0];
        else return null;
    }

    /**
     * @name searchByEmail
     * @param {*} email
     *
     * Chercher dans la collection de mail tous les mail dont l'auteur ou le destinataire correspond a l'argument
     * @author Augustin Borne
     */
    searchByEmail(email){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getEmailAuthor === email || element.emailIncludeInRecipientMail(email)) result.setListeMail(element);
            } else throw Error('Invalid data type, a Mail element is required');
        });
        return result;
    }

    /**
     * @name searchByEmailAuthor
     * @param {*} email
     *
     * Chercher dans la collection de mail tous les mail dont l'auteur correspond a l'argument
     * @author Augustin Borne
     */
    searchByEmailAuthor(email){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getEmailAuthor === email ) result.setListeMail(element);
            } else throw Error('Invalid data type, a Mail element is required')
        });
        return result;
    }

    /**
     * @name MailInBusyDays
     * @param {Mail} email
     * @param {Date} date1
     * @param {Date} date2
     *Permet de retourner tous les mails envoyés le weekend ou le soir dans un intervalle de temps (email peut être null)
     *
     * @author Augustin Borne
     */
    MailInBusyDays(email, date1, date2){
        let resultTemp = this.mailInInterval(date1, date2);
        let result = new ColMail();
        resultTemp.getListMail.forEach(element => {
            if(element instanceof Mail){
                if(email !== null){
                    if(element.mailInBusyDays() && element.getEmailAuthor===email) result.setListeMail(element);
                }else{
                    if(element.mailInBusyDays()) result.setListeMail(element);
                }
            }else throw Error('Invalid data type, a Mail element is required');
        });
        return result;
    }

    /**
     * @name searchByAuthor
     * @param {String} person
     *
     * permet de retourner tous les mails écrits par l'auteur donné en argument
     * @author Augustin Borne
     */
    searchByAuthor(person){
        let result = new ColMail();
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getAuthor === person || element.personIncludeInRecipient(person)) result.setListeMail(element);
            } else throw Error('Invalid data type, a Mail element is required');
        });
        return result;
    }

    /**
     * @name colMailToContact
     * Permet de retourner tous les contact de la collection de mail
     * @author Augustin Borne
     */
    colMailToContact(){
        let result = [];
        this.listeMail.forEach(element => {
            let contactTempAuthor = element.authorToContact();
            let contactTempRecipient = element.recipientToContact();
            let author = false, recipient = false;
            //on vérifie qu'il n'y a pas de doublon dans result(critère = mail)
            if(result.length !== 0){
                result.forEach(element => {
                    if(element.getMail === contactTempAuthor.getMail) author = true;
                    else if(element.getMail === contactTempRecipient.getMail) recipient = true;
                });
                if(!author) result.push(contactTempAuthor);

                contactTempRecipient.forEach(element => {
                    let recipient = result.some(element2 => {
                        return element.getMail === element2.getMail;
                    });
                    if(!recipient) result.push(element);
                });
            } else{
                result.push(contactTempAuthor);
                contactTempRecipient.forEach(element => result.push(element));
            }
        });
        return result;
    }

    /**
     * @name getMail
     * @param {String} messageId
     *
     * Permet d'avoir un mail a partir de l'Id de ce mail (inutile)
     * @author Augustin Borne
     */
    getMail(messageId){
        let result =null;
        this.listeMail.forEach(element => {
            if(element instanceof Mail){
                if(element.getMessageId === messageId) result = element;
            } else throw Error('Invalid data type, a Mail element is required');
        });
        if(result !== null) return result;
        else return null;
    }
}

module.exports = { ColMail };