/**
 * Contact class, represent a contact of a mailbox.
 * @author Jacques
 */
class Contact
{
  constructor(name, lastname, mail)
  {
    this.name = name;
    this.lastname = lastname;
    this.mail = mail;
  }

  // Display the contact to a vcard format.
  toVcard()
  {
    let vcardContact = 'BEGIN:VCARD\nVERSION:4.0\n';
    vcardContact += `N:${this.lastname};${this.name};;;\n`;
    vcardContact += `FN:${this.name} ${this.lastname}\n`;
    vcardContact += `EMAIL:${this.mail}\n`;
    vcardContact += 'END:VCARD\n\n';
    return vcardContact;
  }

  get getName()
  {
    return this.name;
  }

  get getLastName()
  {
    return this.lastname;
  }

  get getMail()
  {
    return this.mail;
  }
}

module.exports = { Contact };
