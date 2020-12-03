/**
    * Colection Mail class, represent an email collection.
    * @author Augustin Borne
*/
const mail = require('./Mail.js');

class ColMail{ 
    constructor(nomCollection){
        this.nomCollection=nomCollection;
        this.listeMail = [];
    }

    setListeMail(mail){
        if(mail instanceof Mail){
            this.listeMail.push(mail);
        }
        
    }

    get toString(){
        let res = "colection " + this.nomCollection+" :";
        this.listeMail.forEach(element => res+= "\n" +element.toString);
        return res;
    }

}

module.exports = { ColMail };
