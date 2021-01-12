/**
 * Classe NbUseTerm, représente une relation entre 2 contacts.
 * @author Augustin Borne
 */
class NbUseTerm{
    /**
     * Constructeur de la classe NbUseTerm
     * @param term
     * @param nbUse
     */
    constructor(term,nbUse){
        this.term = term;
        this.nbUse = nbUse;
    }

    get getTerm(){
        return this.term;
    }
    get getNbUse(){
        return this.nbUse;
    }

    setTerm(term){
        this.term = term;
    }
    setNbUse(nb){
        this.nbUse = nb;
    }

    addNbUse(){
        this.term++;
    }
}

module.exports = {NbUseTerm};