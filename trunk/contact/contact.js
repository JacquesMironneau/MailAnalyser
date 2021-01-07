/**
 * Contact class, represent a contact of a mailbox.
 * @author Jacques
 */
class Contact{
  constructor(name, lastname, mail){
    this.name = name;
    this.lastname = lastname;
    this.mail = mail;
  }

  // Display the contact to a vcard format.
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