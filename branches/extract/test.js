


const { Mail } = require('./Mail.js');
const {ColMail} = require('./ColMail.js');
const { Contact } = require('./contact');
const { Interaction } = require('./Interaction');
const { NbUseTerm } = require('./NbUseTerm.js');

let date = new Date(2020, 8, 22, 15, 0, 0);
let date2 = new Date(2020,8,23,17,0,0);
let date3 = new Date(2020,8,24,19,0,0);
let m =  new Mail("1",date,"bernard@bernard.com","jojo@jojo.com","reunion sur le projet gl02","2","jsp","utf8","Bernard Durand","Jojo Marcel","","","","","xm.xml","hallo liebe jojo, wie geth s es dir");
let m2 = new Mail("2",date2,"laurent@laurent.com","jamie@cps.fr","sps n°20","","","utf8","laurent dupont","Jamie Gourmaud","","","","","sps.xml","salut, c'est quand que tu filmes le prochain sps?");
let m3 = new Mail("3",date3,"jojo@jojo.com","laurent@laurent.com","tu vas bien?","","","utf8","Jojo Marcel","Laurent Dupont","","","","","","salut mon pote ca va?");
let m4 = new Mail("4",date3,"bernard@bernard.com","laurent@laurent.com","hi boss","","","utf8","Bernard Durand","Laurent Dupont","","","","","","salut mon pote ca va?");
let m5 = new Mail("5",date3,"jojo@jojo.com","laurent@laurent.com","reunion avec le boss","","","utf8","Jojo Marcel","Laurent Dupont","","","","","","salut mon pote ca va?");
let col = new ColMail();
col.setListeMail(m);
col.setListeMail(m2);
col.setListeMail(m3);
col.setListeMail(m4);
col.setListeMail(m5);
//console.log(col.getlisteMail.length);
//console.log(col.toString);

//fonction intervalle de temps
//let colTemp = col.mailInInterval(date2,date3);
//console.log(colTemp.toString);

//fonction nbInteractions
//console.log(col.chercherNbinteraction("jojo@jojo.com","jamie@cps.fr"));


//let contactTab = col.colMailToContact([]);
//console.log(m.mailContainsTxtinMessage("liebeeee"));
/*
let lignes = m.getRecipient.split(/\s/);
console.log(lignes[0]+" "+lignes[1]+" "+m.getEmailReceiver);
let contactTest = new Contact(lignes[0],lignes[1],m.getEmailReceiver);
console.log("mail :"+contactTest.getMail+", Prenom :"+contactTest.getName+", Nom : "+contactTest.getLastName+"\n");


console.log("mail :"+m.recipientToContact().getMail+", Prenom :"+m.recipientToContact().getName+", Nom : "+m.recipientToContact().getLastName+"\n");


let contactTemp = new Array();
let listeEmail = new Array();
listeEmail.push("jojo@jojo.com");
//console.log(listeEmail.length);
contactTemp = col.collabByEmail(listeEmail);


contactTemp.forEach(element => {
    console.log("mail :"+element.getMail+", Prenom :"+element.getName+", Nom : "+element.getLastName+"\n");
});*/

//let colTemp = col.SearchByEmail("jojo@jojo.com");
//let colTemp = col.SearchByAuthor("Jojo Marcel");
//console.log(colTemp.toString);
/*let mail1 = col.getMail("1");
//console.log(mail1.toString);

let bestColab = col.bestCollabByEmail("jojo@jojo.com");

for (const [key, value] of Object.entries(bestColab)) {
    console.log(`${key}: ${value}`);
}*/

//let temp = col.bestCollabByEmail("jojo@jojo.com");
/*let temp = col.interactionBetweenCollabForACollab("jojo@jojo.com");
temp.forEach(element => {
    console.log("contact 1 :"+element.getContact1.getMail+" ,contact 2 : "+element.getContact2.getMail+", int :"+element.getNbEchange);
});

let temp = col.MostUsedTerm("jojo@jojo.com");

temp.forEach(element => {
    console.log("term : "+element.getTerm+" ,nbUse : "+element.getNbUse);
});*/