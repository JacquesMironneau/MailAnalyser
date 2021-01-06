/**
 * CLI and entry point of the project
 * using framework caporalCli.
 *
 * use "node cli.js help" to get every commands
 * @author Jacques Mironneau
 **/
require('colors');
const {program, Program} = require('@caporal/core');
const fs = require('fs');
const {visualInteraction, top10Interloc, top10term} = require('./vega/vega.js');
const {extractMail} = require('./extract/extract.js');
const {exit} = require('process');

// check if date is mm-dd-yyyy and not invalid (13/12/2020 is invalid for instance)
const checkDateFormat = d => (d instanceof Date && d !== 'Invalid Date');

program
    .name('Mail parser')
    .description('Mail CLI parser tool, to generate graphics and text data')

    /*
     * Spec 1.1: List data from collaborator and their contacts
     */
    .command('get-contacts', 'List contacts of given collaborators in Vcard format')
    .alias('gc')
    .argument('<files>', 'List of data file (emails)', { validator: value => value.split(',') })
    .option('-c, --collaborators [emailList]', 'Collaborator email separated by a comma', { validator: program.ARRAY })
    .option('-o, --out <outputfile>', 'Export contacts in a text file instead of the terminal', { validator: Program.STRING })
    .action(({ logger, args, options }) => {
        let displayToTerminal = false;
        if (options.out && options.out !== true) logger.info(`Display set to ${options.out}`);
        else{
            logger.info('Displaying to terminal');
            displayToTerminal = true;
        }
        // Here the namelist is undefined or filled with names
        const mailCollection = extractMail(args.files);
        const list = options.collaborators;
        let contactList;

        if (list === undefined) {
            logger.warn('Since no collaborators are provided printing every collaborator');
            contactList = mailCollection.collabByEmail([]);
        } else{
            logger.info(`Print names of ${list}`);
            contactList = mailCollection.collabByEmail(list);
        }
        let displayList = '';
        contactList.forEach((contact) => displayList += contact.toVcard());

        // print to terminal or to a specified file
        if (displayToTerminal) console.log(displayList);
        else{
            fs.writeFile(options.out, displayList, 'utf8', err => {
                if (err) logger.error(err);
                else logger.info(`Contact exported to ${options.out}`);
            });
        }
    })

    /*
    * Spec 1.2
    * Entrée(s) : Date début, date fin, liste de personnes qui ont envoyés les mails (optionnel)
    */
    .command('count-mail', 'Count the number of mail on a given period')
    .alias('cm')
    .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
    .argument('<beginning-date>', 'Beginning date of the period (in mm-dd-yyyy)', {
        validator: beginningDateInput => {
            const dateValue = new Date(beginningDateInput);
            if (checkDateFormat(dateValue)) return dateValue;
            console.log('ERROR : Invalid beginning date please use mm-dd-yyyy format');
            exit(1);
        },
    })
    .argument('<ending-date>', 'Ending date of the period (in mm-dd-yyyy)', {
        validator: endingDateInput => {
            const dateValue = new Date(endingDateInput);
            if (checkDateFormat(dateValue)) return dateValue;
            console.log('ERROR : Invalid ending date please use mm-dd-yyyy format');
            exit(1);
        },
    })
    .option('--mail-senders [mailSenders]', 'List of the email authors', { validator: program.ARRAY })
    .action(({ logger, args, options }) => {
        // Get mail from files
        const mailCollection = extractMail(args.files);
        // Get only mail in the period
        const mails = mailCollection.mailInInterval(args.beginningDate, args.endingDate);
        let total;
        // If emails senders are provided, remove the mail from people not in the list
        if (options.mailSenders) total = options.mailSenders.reduce((acc, mail) => acc + mails.SearchByEmailAuthor(mail).getlisteMail.length, 0);
        else total = mails.getlisteMail.length;

        // Display error message if no mail have been written (in specs)
        if (total === 0) logger.info('No mail has been written during the period');
        // Display the number of mail
        else{
            const dateBegin = args.beginningDate.dateFromMail();
            const dateEnd = args.endingDate.dateFromMail();
            console.log("There are " + ((String)(total)).green + " mail(s) that were sent between" + dateBegin.green + " and " + dateEnd.green + " (mm/dd/yyyy format)");
        }
    })

    /*
    * Spec 1.3
    * Entrée(s) : Date début, date de fin, auteur des emails (optionnel)
    */
    .command('buzzy-days', 'List the "buzzy-days" were mails are written between 10pm and 8am')
    .alias('bd')
    .argument('<files>', 'List of data file (emails)', { validator: (value) => value.split(',') })
    .argument('<beginning-date>', 'Beginning date of the period', {
        validator: beginningDateInput => {
            const dateValue = new Date(beginningDateInput);
            if (checkDateFormat(dateValue)) return dateValue;
            console.log('ERROR : Invalid beginning date please use mm-dd-yyyy format');
            exit(1);
        },
    })
    .argument('<ending-date>', 'Ending date of the period', {
        validator: endingDateInput => {
            const dateValue = new Date(endingDateInput);
            if (checkDateFormat(dateValue)) return dateValue;
            console.log('ERROR : Invalid ending date please use mm-dd-yyyy format');
            exit(1);
        },
    })
    .option('--mail-sender [mailSenders]', 'The email author', { validator: program.STRING })
    .action(({ logger, args, options }) => {
        // Get mail from files
        let mailCollection = extractMail(args.files);
        // Get only mail in the period
        if (options.mailSender) mailCollection = mailCollection.MailInbusyDays(options.mailSender, args.beginningDate, args.endingDate);
        else{
            logger.warn('No author has been specified');
            mailCollection = mailCollection.MailInbusyDays(null, args.beginningDate, args.endingDate);
        }
        const daylist = [];
        mailCollection.getlisteMail.forEach(mail => {
            console.log(mail.getDate);
            const mailDateBegin = mail.dateFromMail();
            if (daylist.indexOf(mailDateBegin)===-1) daylist.push(mailDateBegin);
        });

        const dateBegin = args.beginningDate.dateFromMail();
        const dateEnd = args.endingDate.dateFromMail();

        console.log("There are " + ((String)(daylist.length)).green + "buzzy days mail(s) that were sent between " + dateBegin.green + " and " + dateEnd.green);
        daylist.sort((a, b) => new Date(b) - new Date(a)).forEach(day => console.log(`Day: ${day}`));
    })

    /*
     * Spec 1.4
     * Titre : Lister les 10 interlocuteurs les plus fréquents pour un collaborateur donné
     */
    .command('top10-collaborators', 'List the 10 most frequent contacts of a given collaborator')
    .alias('tc')
    .argument('<files>', 'List of data file (emails file)', { validator: (value) => value.split(',') })
    .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
    .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file', { validator: ['svg', 'png'], default: 'png' })
    .action(({ logger, args, options }) => {
        logger.info(`Listing the 10 most frequent contacts for ${args.mail}`);
        const frequentContacts = extractMail(args.files).bestCollabByEmail(args.mail);
        top10Interloc(frequentContacts, options.format, 'top10-collaborators_'+args.mail);
    })

    /*
    Spec 1.5
    */
    .command('top10-words', 'List the 10 most frequent words in a given collaborator mail box')
    .alias('tw')
    .argument('<files>', 'List of data file (emails file)', { validator: value => value.split(',') })
    .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
    .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file', { validator: ['svg', 'png'], default: 'png' })
    .action(({ logger, args, options }) => {
        logger.info(`Listing the 10 most frequent words for ${args.mail}'s mailbox`);
        const frequentTerms = extractMail(args.files).MostUsedTerm(args.mail);
        top10term(frequentTerms, options.format, 'top10-words_'+args.mail);
    })

    /*
    Spec 1.6
    */
    .command('exchange-between-collaborators', 'Design a scatter graph with the number of exchange between collaborators')
    .alias('ebc')
    .argument('<files>', 'List of data file (emails)', { validator: value => value.split(',') })
    .argument('<email>', 'The collaborator email')
    .option('-f,--format <format>', 'Precise if the graphic should be exported as a svg or png file', { validator: ['svg', 'png'], default: 'png' })
    .action(({ args, options }) => {
        const interactionList = extractMail(args.files).interactionBetweenCollabForACollab(args.email);
        visualInteraction(interactionList, options.format, 'exchange-between-collaborators_' + args.email);
    })

    /*
    * Spec 1.7
    */
    .command('search-mail', 'Search mails of a given collaborator')
    .alias('se')
    .argument('<files>', 'List of data file (emails)', { validator: value => value.split(',') })
    .argument('<mail>', 'Mail of the collaborator', { validator: program.STRING })
    .option('-o, --out <outputfile>', 'Export contacts in a text file instead of the terminal', { validator: Program.STRING })
    .action(({ logger, args, options }) => {
        let displayToTerminal = false;
        if (options.out && options.out !== true) logger.info(`Display set to ${options.out}`);
        else{
            logger.info('Displaying to terminal');
            displayToTerminal = true;
        }

        let mailCollection = extractMail(args.files).SearchByEmailAuthor(args.mail);
        const mail = mailCollection.getlisteMail[0];

        if (displayToTerminal){
            logger.info(`Collaborator ${args.mail} found`);

            console.log(mail.authorToContact().toVcard());
            logger.info(`Listing mail of ${args.mail}'s mailbox`);

            console.log(mailCollection.toHumanReadableString);
        } else{
            const content = mail.authorToContact().toVcard() + mailCollection.toHumanReadableString;
            fs.writeFile(options.out, content, 'utf8', err => {
                if (err) logger.error(err);
                else logger.info(`Contact exported to ${options.out} file`);
            });
        }
    });

program.run();