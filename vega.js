/* eslint-disable */
/**
    * vega lite module, export to png or svg.
    * @author Augustin Borne, Jacques Mironneau
*/
const colors = require('colors');
const vega = require('vega');
const vl = require('vega-lite');
const fs = require('fs');



const render = (spec, format) =>
{
  const vgSpec = vl.compile(spec).spec;
  const view = new vega.View(vega.parse(vgSpec))
    .renderer('none')
    .initialize();
  // generate a static SVG image
  if (format === 'svg')
  {
    const fileName = 'test.svg';
    view.toSVG()
      .then((svg) =>
      {
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
  }
};

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



module.exports = { visualInteraction };