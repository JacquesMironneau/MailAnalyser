/**
 * Interaction class, represent a relation between two contact.
 * @author Augustin Borne
 */

const {Contact} = require('../contact/contact');

class Interaction{
    constructor(contact1, contact2, nbExchanges){
        if(contact1 instanceof Contact) this.contact1 = contact1;
        else throw Error('Invalid data type, a Contact instance is required');
        if(contact2 instanceof Contact) this.contact2 = contact2;
        else throw Error('Invalid data type, a Contact instance is required');
        this.nbEchange = nbExchanges;
    }

    get getContact1(){
        return this.contact1;
    }
    get getContact2(){
        return this.contact2;
    }
    get getNbExchanges(){
        return this.nbEchange;
    }

    setNbExchanges(nb){
        this.nbEchange=nb;
    }

    addNbExchanges(){
        this.nbEchange++;
    }
    minNbExchanges(){
        this.nbEchange--;
    }
}

module.exports = {Interaction};