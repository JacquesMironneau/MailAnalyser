/**
 * NbUseTerm class, represent a relation between two contact.
 * @author Augustin Borne
 */

class NbUseTerm{
    constructor(term,nbUse){
        this.term=term;
        this.nbUse=nbUse;
    }

    get getTerm(){
        return this.term;
    }
    get getNbUse(){
        return this.nbUse;
    }

    setTerm(term){
        this.term=term;
    }
    setNbUse(nb){
        this.nbUse=nb;
    }

    addNbUse(){
        this.term++;
    }
    minNbUse(){
        this.term--;
    }
}

module.exports = {NbUseTerm};