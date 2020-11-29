/**
 * Contact class, represent a contact of a mailbox.
 * @author Jacques
 */
class Contact
{

    constructor(name,lastname,mail)
    {
        this.name = name
        this.lastname = lastname
        this.mail = mail
    }

    // Display the contact to a vcard format.
    toVcard()
    {
        console.log("Not implemented yet");
    }
}

module.exports = { Contact }