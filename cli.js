/**
 * CLI and entry point of the project
 * using framework caporalCli.
 *
 * use "node cli.js help" to get every commands
 * @author Jacques 
 * */

 const { program } = require('@caporal/core')
 const contactFileExtension = ".csv"

 program
 .name("Mail parser")
 .argument("<test>","test")
 .action(({logger, args}) => {
    logger.info("hello %s", args.test)
 })

 /*
 * Spec 1.1: List data from collaborator and their contacts
 */
.command('get-contacts', 'List contacts of given collaborators')
.alias('gc')
.argument('[namelist]', 'Collaborator name separated by a comma', {validator : program.ARRAY | program.STRING })
.option('-f <file>', 'Export contacts in a text file instead of the terminal',{validator : program.STRING,   validator: (value) =>  {
        if (typeof value === "string" && value.endsWith(contactFileExtension)) return value
        throw Error(`Please enter a ${contactFileExtension} file format`)
}})

.action(({ logger, args, options }) => {
    
    console.log(options)
    if (options.f && options.f !== true)
        logger.info(`Display set to ${options.f}`)
    else
        logger.info('Displaying to terminal')

    // Here the namelist is undefined or filled with names

    const list = args.namelist
    if (list === undefined)
        logger.info("Since no arguments is provided printing every contacts of every collaborator")
    else
        console.table(args.namelist)

})
/*
* Spec 1.2
Entrée(s) : Date début, date fin, liste de personnes qui ont envoyés les mails (optionnel)
*/

.command('count-mail', 'Count the number of mail on a given period')
.alias('cm')
.argument('<begining-date>','Begining date of the period', {validator : program.STRING})
.argument('<ending-date>','Ending date of the period' , {validator : program.STRING})
.argument('[nameList]','List of the email senders', {validator : program.ARRAY})
.action(({ logger, args }) => {
   const beginingDate= new Date(args.beginingDate)
   const endingDate= new Date(args.endingDate)

   checkDateFormat(beginingDate)
   checkDateFormat(endingDate)

})

/*
* Spec 1.3
Entrée(s) : Date début, date de fin, auteur des emails (optionnel)
*/
.command('buzzy-days','Count the mails wrote during "buzzy-days"')
.alias('bd')
.argument('<begining-date>','Begining date of the period', {validator : program.STRING})
.argument('<ending-date>','Ending date of the period' , {validator : program.STRING})
.argument('[nameList]','List of the email authors', {validator : program.ARRAY})
.action(({ logger, args }) => {
    const beginingDate= new Date(args.beginingDate)
    const endingDate= new Date(args.endingDate)
 
    checkDateFormat(beginingDate)
    checkDateFormat(endingDate)
 
 })

 /*
 * Spec 1.4
 Titre : Lister les 10 interlocuteurs les plus fréquents pour un collaborateur donné

 */
.command('top10-collaborator', 'List the 10 most frequent contacts of a given collaborator')
.alias('tc')
.argument('<collaboratorName>', '', {validator: program.STRING})
.option("-f,--format <format>", "Precise if the graphic should be exported as a svg or png file", {validator: ["svg", "png"], default: "png"})
.action(({ logger, args }) => {
    logger.info(`Listing the 10 most frequent contacts for ${args.collaboratorName}`)


})

/*
Spec 1.5
*/
.command('top10-words', 'List the 10 most frequent words in a given collaborator mail box')
.alias('tw')
.argument('<mailBox>','', {validator : program.STRING})
.option("-f,--format <format>", "Precise if the graphic should be exported as a svg or png file", {validator: ["svg", "png"], default: "png"})
.action(({ logger, args }) => {
    logger.info(`Listing the 10 most frequent word for ${args.mailBox}'s mailbox`)
})

/*
Spec 1.6

Titre : Créer une visualisation en nuage de points (avec taille différente) du nombre d'échange entre collaborateurs pour une boîte mail donnée.

Entrée(s) : Informations du collaborateur : email
Option: svg or png
*/
.command('exchange-between-collaborators', 'Design a scatter graph with the number of exchange between collaborators')
.alias('ebc')
.argument('<email>', 'The collaborator email')
.option("-f,--format <format>", "Precise if the graphic should be exported as a svg or png file", {validator: ["svg", "png"], default: "png"})
.action(({ logger, args, options }) => {
    console.log(args)
    console.log(options);
})

/*
* Spec 1.7 TODO
*/

 program.run()

 const checkDateFormat = (d) => {
     if ((d instanceof Date && isNaN(d.getDate())))
         throw Error("Invalid date, please use YYYY-DD-MM notation. Exiting...")
 }
