/**
    * vega lite module, export to png or svg.
    * @author Augustin Borne
*/

const {Mail} = require('./Mail.js');
const { Contact } = require('./contact');
const {ColMail} = require('./ColMail.js');
const fs = require('fs');
const vegaCli = require('vega-cli');
const vegalite = require('vega-lite');
const vega = require('vega');

function top10Interloc(listeContact){
    let top10 = '{\n\"$schema\": \"https://vega.github.io/schema/vega-lite/v4.json\",\n\"data\": {\n\"values\": [\n'
    listeContact.forEach(element => {
        if(element instanceof Contact){
            top10+='{\"Nom\": \"'+element.lastName+'\", \"Prénom\": \"'+element.getName+'\", \"E-mail\": \"'+element.getMail+'\"},\n'
        }else{
            throw Error('Invalid data type, a Contact element is required')
        }
    });
    top10+=']\n}\n}'
    fs.writeFile('result.json',top10,function(erreur){
        if(erreur){
            console.log(erreur)
        }
    })

   
}

function toSVGchart(vlSpec,filename){
    const myChart = vegalite.compile(vlSpec).spec;

    const runtime =vega.parse(myChart);
    const view = new vega.View(runtime).renderer('svg').run;
    const mySvg = view.toSVGchart;
    view.
}


