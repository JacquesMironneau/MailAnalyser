/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/**
 * CLI and entry point of the project
 * using framework caporalCli.
 *
 * use "node cli.js help" to get every commands
 * @author Jacques
 * */

const { program, Program } = require('@caporal/core');
const fs = require('fs');
const { Contact } = require('./contact');
const { ColMail } = require('./ColMail');
//const { extractMail } = require('./extract');

// const {extract} = require('./extract')

// check if date is mm-dd-yyyy and not invalid (13/12/2020 is invalid for instance)
const checkDateFormat = (d) => ((d instanceof Date && d != 'Invalid Date'));

program
  .name('Mail parser')
  .description('Mail CLI parser tool, used to generate graphics and text data')

/*
 * Spec 1.1: List data from collaborator and their contacts
 */
  .command('get-contacts', 'List contacts of given collaborators')
  .alias('gc')
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .option('-c, --collaborators [namelist]', 'Collaborator name separated by a comma', { validator: program.ARRAY })
  .option('-o, --out <outputfile>', 'Export contacts in a text file instead of the terminal', { validator: Program.STRING })
  .action(({ logger, args, options }) =>
  {
    console.log(options);
    console.log(args);
    let displayToTerminal = false;
    if (options.out && options.out !== true)
    {
      logger.info(`Display set to ${options.out}`);
    }
    else
    {
      logger.info('Displaying to terminal');
      displayToTerminal = true;
    }

    // Here the namelist is undefined or filled with names

    const colmail = extractMail(args.files);
    const list = args.namelist;
    let contactList = [];

    if (list === undefined)
    {
      logger.warn('Since no arguments is provided printing every contacts of every collaborator');
      contactList = colmail.collabByEmail([]);
    }
    else
    {
      logger.info(`Print names of ${list}`);
      contactList = colmail.collabByEmail(args.namelist);
    }
    contactList = '';
    contactList.forEach((contact) => contactList += contact.toVcard());

    // print to terminal or to a specified file
    if (displayToTerminal)
    {
      console.log(contactList);
    }
    else
    {
      fs.writeFile(options.out, contactList);
    }
  })
/*
* Spec 1.2
Entrée(s) : Date début, date fin, liste de personnes qui ont envoyés les mails (optionnel)
*/

  .command('count-mail', 'Count the number of mail on a given period')
  .alias('cm')
  .argument('<begining-date>', 'Begining date of the period (in mm-dd-yyyy)', {
    validator: (value) =>
    {
      const dateValue = new Date(value);
      if (checkDateFormat(dateValue)) return dateValue;
      throw new Error('Invalid ending date please use mm-dd-yyyy format');
    },
  })
  .argument('<ending-date>', 'Ending date of the period (in mm-dd-yyyy)', {
    validator: (value) =>
    {
      const dateValue = new Date(value);
      if (checkDateFormat(dateValue)) return dateValue;
      throw new Error('Invalid ending date please use mm-dd-yyyy format');
    },
  })
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })

  .option('--mail-senders [emailList]', 'List of the email authors', { validator: program.ARRAY })
  .action(({ logger, args, options }) =>
  {
    // Get mail from files
    const colmail = extractMail(args.files);
    // Get only mail in the period
    const mails = colmail.mailInInterval(args.beginingDate, args.endingDate);
    let total = 0;

    // If emails senders are provided, remove the mail from people not in the list
    if (options.emailList)
    {
      options.emailList.reduce((acc, mail) => acc + mails.SearchByEmailAuthor(mail).length, 0);
    }
    else
    {
      total = mails.getListMail().length;
    }
    // Display error message if no mail have been written (in specs)
    if (mails.getListMail().length === 0)
    {
      logger.info('No mail have been written during the period');
    }
    // Display the number of mail
    else
    {
      console.log(`There are ${total} mail(s) that were sent between ${args.beginingDate} and ${args.endingDate}`);
    }
  })

/*
* Spec 1.3
Entrée(s) : Date début, date de fin, auteur des emails (optionnel)
*/
  .command('buzzy-days', 'List the "buzzy-days" were mails are written between 10pm and 8am')
  .alias('bd')
  .argument('<begining-date>', 'Begining date of the period', {
    validator: (value) =>
    {
      const dateValue = new Date(value);
      if (checkDateFormat(dateValue)) return dateValue;
      throw new Error('Invalid ending date please use mm-dd-yyyy format');
    },
  })
  .argument('<ending-date>', 'Ending date of the period', {
    validator: (value) =>
    {
      const dateValue = new Date(value);
      if (checkDateFormat(dateValue)) return dateValue;
      throw new Error('Invalid ending date please use mm-dd-yyyy format');
    },
  })
  .option('--mail-senders [mail]', 'The email author', { validator: program.STRING })
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .action(({ logger, args, options }) =>
  {
    // Get mail from files
    let colmail = extractMail(args.files);
    // Get only mail in the period
    colmail = colmail.MailInbusyDays(args.beginingDate, args.endingDate);
    if (options.mail)
    {
      colmail = colmail.SearchByEmailAuthor(options.mail);
    }
    else
    {
      logger.warn('No author has been specified');
    }
    const daylist = [];
    colmail.forEach((mail) =>
    {
      if (!daylist.includes(mail.getDate()))
      {
        daylist.push(mail.getDate());
      }
    });
    console.log(`There are ${daylist.length} "buzzy days" mail(s) that were sent between ${args.beginingDate} and ${args.endingDate}`);
    daylist.sort((a, b) => b - a)
      .forEach((day) => console.log(day));
  })

/*
 * Spec 1.4
 Titre : Lister les 10 interlocuteurs les plus fréquents pour un collaborateur donné

 */
  .command('top10-collaborator', 'List the 10 most frequent contacts of a given collaborator')
  .alias('tc')
  .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
  .argument('<files>', 'List of data file (emails file)', { validator: (value) => value.split(',') })
  .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file', { validator: ['svg', 'png'], default: 'png' })
  .action(({ logger, args, options }) =>
  {
    const colmail = extractMail(args.files);
    logger.info(`Listing the 10 most frequent contacts for ${args.mail}`);
    const frequentContacts = colmail.bestCollab(args.collaboratorName);
    // renvoie un objet {contact: nbInterraction}
    // TODO: vegalite: top10Interloc(frequentContacts, options.format);

    //  frequentContacts.forEach((contact) => console.log(`${index++}: <${contact.getMail()}>,
    // ${contact.getName()} ${contact.getLastName()}`));
  })

/*
Spec 1.5
*/
  .command('top10-words', 'List the 10 most frequent words in a given collaborator mail box')
  .alias('tw')
  .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
  .argument('<files>', 'List of data file (emails file)', { validator: (value) => value.split(',') })
  .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file',
    { validator: ['svg', 'png'], default: 'png' })
  .action(({ logger, args, options }) =>
  {
    const colmail = extractMail(args.files);
    logger.info(`Listing the 10 most frequent words for ${args.mail}'s mailbox`);
    // renvoie un objet {term: nbInterraction}
    const frequentTerms = colmail.MostUsedTerm(args.mail);
    // TODO: top10term(frequentTerms, options.format);
  })

/*
Spec 1.6

Titre : Créer une visualisation en nuage de points (avec taille différente)
 du nombre d'échange entre collaborateurs pour une boîte mail donnée.

Entrée(s) : Informations du collaborateur : email
Option: svg or png
*/
  .command('exchange-between-collaborators', 'Design a scatter graph with the number of exchange between collaborators')
  .alias('ebc')
  .argument('<email>', 'The collaborator email')
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file',
    { validator: ['svg', 'png'], default: 'png' })
  .action(({ args, options }) =>
  {
    const interactionList = extractMail(args.files);
    //  TODO:appel visualInteraction(interactionList,options.format)
  })

/*
* Spec 1.7
*/
  .command('search-mail', 'Search mails of a given collaborator')
  .alias('se')
  .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .action(({ logger, args }) =>
  {
    logger.info(`Listing the 10 most frequent word for ${args.mailBox}'s mailbox`);
    let colmail = extractMail(args.files);
    colmail = colmail.SearchByEmailAuthor(args.mail);

    const mail = colmail.getListMail()[0];
    console.log(mail.authoToContact().toVcard());

    console.log(colmail);
  });

program.run();