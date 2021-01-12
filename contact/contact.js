/**
 * Classe Contact, représente un contact d'une boîte mail.
 * @author Jacques
 */
class Contact{
  /**
   * Constructeur de la classe Contact
   * @param name
   * @param lastname
   * @param mail
   */
  constructor(name, lastname, mail){
    this.name = name;
    this.lastname = lastname;
    this.mail = mail;
  }

  /**
   * Convertit un contact au format VCard
   * @return {string}
   */
  toVcard(){
    return 'BEGIN:VCARD\nVERSION:4.0\n' +
        `N:${this.lastname};${this.name};;;\n` +
        `FN:${this.name} ${this.lastname}\n` +
        `EMAIL:${this.mail}\n` +
        'END:VCARD\n\n';
  }

  get getName(){
    return this.name;
  }
  get getLastName(){
    return this.lastname;
  }
  get getMail(){
    return this.mail;
  }
}

module.exports = {Contact};