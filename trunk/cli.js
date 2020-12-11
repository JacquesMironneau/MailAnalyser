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
const { extractMail } = require('./test.js');
const { visualInteraction } = require('./vega');
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
    let displayList = '';
    contactList.forEach((contact) => displayList += contact.toVcard());

    // print to terminal or to a specified file
    if (displayToTerminal)
    {
      console.log(displayList);
    }
    else
    {
      fs.writeFile(options.out, displayList, (err) =>
      {
        if (err)
        {
          logger.error(err);
        }
        else
        {
          logger.info(`Contact exported to  ${options.out}`);
        }
      });
    }
  })

/*
* Spec 1.2
Entrée(s) : Date début, date fin, liste de personnes qui ont envoyés les mails (optionnel)
*/
  .command('count-mail', 'Count the number of mail on a given period')
  .alias('cm')
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
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

  .option('--mail-senders [mailSenders]', 'List of the email authors', { validator: program.ARRAY })
  .action(({ logger, args, options }) =>
  {
    // Get mail from files
    const colmail = extractMail(args.files);
    // Get only mail in the period
    const mails = colmail.mailInInterval(args.beginingDate, args.endingDate);
    let total = 0;

    // If emails senders are provided, remove the mail from people not in the list
    if (options.mailSenders)
    {
      total = options.mailSenders.reduce((acc, mail) => acc + mails.SearchByEmailAuthor(mail)
        .getlisteMail.length, 0);
    }
    else
    {
      total = mails.getlisteMail.length;
    }

    // Display error message if no mail have been written (in specs)
    if (total === 0)
    {
      logger.info('No mail has been written during the period');
    }
    // Display the number of mail
    else
    {
      const dateBegin = ` ${args.beginingDate.getMonth()}/${args.beginingDate.getDate()}/${args.beginingDate.getFullYear()}`;
      const dateEnd = ` ${args.endingDate.getMonth()}/${args.endingDate.getDate()}/${args.endingDate.getFullYear()}`;
      console.log(`There are ${total} mail(s) that were sent between ${dateBegin} and ${dateEnd} (mm/dd/yyyy format)`);
    }
  })

/*
* Spec 1.3
Entrée(s) : Date début, date de fin, auteur des emails (optionnel)
*/
  .command('buzzy-days', 'List the "buzzy-days" were mails are written between 10pm and 8am')
  .alias('bd')
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
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
  .option('--mail-senders [mailSenders]', 'The email author', { validator: program.STRING })
  .action(({ logger, args, options }) =>
  {
    // Get mail from files
    let colmail = extractMail(args.files);
    // Get only mail in the period
    if (options.mailSenders)
    {
      colmail = colmail.MailInbusyDays(options.mailSenders, args.beginingDate, args.endingDate);
    }
    else
    {
      logger.warn('No author has been specified');
      colmail = colmail.MailInbusyDays(null, args.beginingDate, args.endingDate);
    }
    const daylist = [];
    colmail.getlisteMail.forEach((mail) =>
    {
      if (!daylist.includes(mail.getDate))
      {
        daylist.push(mail.getDate);
      }
    });
    const dateBegin = ` ${args.beginingDate.getMonth()}/${args.beginingDate.getDate()}/${args.beginingDate.getFullYear()}`;
    const dateEnd = ` ${args.endingDate.getMonth()}/${args.endingDate.getDate()}/${args.endingDate.getFullYear()}`;

    console.log(`There are ${daylist.length} "buzzy days" mail(s) that were sent between ${dateBegin} and ${dateEnd}`);
    daylist.sort((a, b) => b - a)
      .forEach((day) => console.log(`Day: ${day.getMonth()}/${day.getDate()}/${day.getFullYear()}`));
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
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .argument('<email>', 'The collaborator email')
  .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file',
    { validator: ['svg', 'png'], default: 'png' })
  .action(({ args, options }) =>
  {
    const colmail = extractMail(args.files);
    console.log(colmail);
    const interactionList = colmail.interactionBetweenCollabForACollab(args.email);
    console.log(interactionList);
    visualInteraction(interactionList, options.format);
  })

/*
* Spec 1.7
*/
  .command('search-mail', 'Search mails of a given collaborator')
  .alias('se')
  .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
  .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
  .action(({ logger, args }) =>
  {
    let colmail = extractMail(args.files);
    colmail = colmail.SearchByEmailAuthor(args.mail);
    const mail = colmail.getlisteMail[0];
    logger.info(`Collaborator ${args.mail} found`);

    console.log(mail.authorToContact().toVcard());
    logger.info(`Listing mail of ${args.mail}'s mailbox`);

    console.log(colmail.toHumanReadableString);
  });

program.run();
