/**
    * Interaction class, represent a relation between two contact.
    * @author Augustin Borne
*/

const { Contact } = require('../contact/contact');

class Interaction{
    constructor(contact1,contact2,nbEchange){
        if(contact1 instanceof Contact){
            this.contact1=contact1;
        }else{
            throw Error('Invalid data type, a Contact instance is required')
        }
        if(contact2 instanceof Contact){
            this.contact2=contact2;
        }else{
            throw Error('Invalid data type, a Contact instance is required')
        }
        this.nbEchange=nbEchange;
    }

    get getContact1(){
        return this.contact1;
    }

    get getContact2(){
        return this.contact2;
    }

    get getNbEchange(){
        return this.nbEchange;
    }

    setContact1(contact){
        if(contact instanceof Contact){
            this.contact1=contact;
        }else{
            throw Error('Invalid data type, a Contact instance is required')
        }
        
    }

    setContact2(contact){
        if(contact instanceof Contact){
            this.contact2=contact;
        }else{
            throw Error('Invalid data type, a Contact instance is required')
        }
    }

    setNbEchange(nb){
        this.nbEchange=nb;
    }

    addNbEchange(){
        this.nbEchange++;
    }

    minNbEchange(){
        this.nbEchange--;
    }
}

module.exports = { Interaction };