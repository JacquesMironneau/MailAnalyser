/* eslint-disable */
/**
    * vega lite module, export to png or svg.
    * @author Jacques Mironneau
*/
const colors = require('colors');
const vega = require('vega');
const vl = require('vega-lite');
const fs = require('fs');


/**
 * 
 * @param {json vega-lite spec} spec The vegalite spec to export as a file
 * @param {['png','svg']} format format of the exported graphic
 */
const render = (spec, format) =>
{
  // Compile vegalite spec to vega spec
  const vgSpec = vl.compile(spec).spec;
  const view = new vega.View(vega.parse(vgSpec))
    .renderer('none')
    .initialize();

  if (format === 'svg')
  {
    const fileName = 'test.svg';
    view.toSVG()
      .then((svg) =>
      {
        // Write the svg string into a file
        fs.writeFileSync(fileName, svg, (err) =>
        {
          if (err)
          {
            console.err(err);
          }
        });
        console.log(`${'[OK]'.green.bold} Graphic rendered to ${fileName}`);
      })
      .catch((err) =>
      {
        console.error(err);
      });
  } else
  {
    view.toCanvas()
      .then((canvas) => {
        const fileName = "test.png"
        const stream = canvas.createPNGStream();
        const out = fs.createWriteStream(fileName);
        stream.pipe(out);
        out.on('finish', () => console.log(`${'[OK]'.green.bold} Graphic rendered to ${fileName}`));

      })
  }
};
// Work in progress
const visualInteraction = (interactionList, format) => 
{

  const people = [];
  interactionList.forEach((inter) => {
    if (!people.includes(inter.getContact1.getMail))
      people.push(inter.getContact1.getMail)

    if (!people.includes(inter.getContact2.getMail))
      people.push(inter.getContact2.getMail)

  });
  console.log(people)

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
    data: { url: 'data.json' },
    mark: {
      type: 'circle',
    },
    encoding: {
      // ne marche pas avec people[0] ou 1, les fields doivent provenir de data.json :c
      x: { field: people[0], type: 'nominal', axis: { title: 'a' } },
  
      y: { field: people[1], type: 'nominal', axis: { title: 'b' } },
    },
  };

  render(spec, format);

};

const top10Interloc = (data, format) =>
{
   const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": { "values": data},
    "mark": "bar",
    "title": "Top 10 interlocteurs pour " + data[0].contact1.mail,
    "encoding": {
      "x": {
        "field": "contact2.mail",
        "title": "Interlocuteurs",
        "sort": "-y"
      },
      "y": {
        "field": "nbEchange",
        "type": "quantitative",
        "title": "Nombre d'échanges"}
      }
  };
  render(spec,format);
}

const top10term = (data, format) =>
{
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": { "values": data},
    "mark": "bar",
    "title": "Top 10 des termes utilisés dans les objets de mails",
    "encoding": {
      "x": {
        "field": "term",
        "title": "Termes utilisés",
        "sort": "-y"
      },
      "y": {
        "field": "nbUse",
        "type": "quantitative",
        "title": "Occurrence d'un terme"}
      }
  };
  render(spec,format)
}

module.exports = { visualInteraction, top10Interloc, top10term };