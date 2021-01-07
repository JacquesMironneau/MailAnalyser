/**
 * vega lite module, export to png or svg.
 * @author Jacques Mironneau
 */

const vega = require('vega');
const vl = require('vega-lite');
const fs = require('fs');

/**
 *
 * @param {json vega-lite spec} spec The vegaLite spec to export as a file
 * @param {['png','svg']} format format of the exported graphic
 * @param {String} fileName name of the exported file
 */
const render = (spec, format, fileName) => {
  fileName = 'resultat/' + fileName + '.' + format
  // Compile vegaLite spec to vega spec
  const vgSpec = vl.compile(spec).spec;
  const view = new vega.View(vega.parse(vgSpec))
      .renderer('none')
      .initialize();

  if (format === 'svg'){
    view.toSVG()
        .then(svg => {
          // Write the svg string into a file
          fs.writeFileSync(fileName, svg, 'utf8');
          console.log(`${'[OK]'.green.bold} Graphic rendered to ${fileName}`);
        })
        .catch(err => console.error(err));
  } else if (format === 'png'){
    view.toCanvas()
        .then(canvas => {
          const stream = canvas.createPNGStream();
          const out = fs.createWriteStream(fileName);
          stream.pipe(out);
          out.on('finish', () => console.log(`${'[OK]'.green.bold} Graphic rendered to ${fileName}`));
        });
  }
};

/**
 *
 * @param {Interaction[]} interactionList list of interaction between every contact of the given collaborator
 * @param {String} format Format of the file that will be exported (svg or png)
 * @param {String} fileName name of the exported file
 */
const visualInteraction = (interactionList, format, fileName) => {
  if (interactionList.every((inter) => inter.nbEchange === 0)){
    console.log('[x]'.red + 'No interactions among the contact of the given collaborator');
    return;
  }
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {values: interactionList},
    transform: [{filter: "datum.nbEchange > 0"}],
    mark: {
      type: "circle",
      opacity: 0.8,
      stroke: "black",
      strokeWidth: 1
    },
    title: "Nombre d'interlocuteurs",
    encoding: {
      x: {
        field: "contact1.mail",
        title: "Interlocuteurs",
        axis: {grid: false}
      },
      y: {
        field: "contact2.mail",
        title: "Interlocuteur"},
      size: {
        field: "nbEchange",
        type: "quantitative",
        legend: {clipHeight: 60},
        scale: {rangeMin: 1}
      }
    }
  };
  render(spec, format, fileName);
};

/**
 * Create the vegaLite spec
 * @param {Interaction[]} data  interaction list, contact1 is the collaborator, contact2 is the other contact
 * @param {String} format Format of the file that will be exported (svg or png)
 * @param {String} fileName name of the exported file
 */
const top10Interloc = (data, format, fileName) => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {values: data},
    mark: "bar",
    title: "Top 10 interlocuteurs pour " + data[0].contact1.mail,
    encoding: {
      x: {
        field: "contact2.mail",
        title: "Interlocuteurs",
        sort: "-y"
      },
      y: {
        field: "nbEchange",
        type: "quantitative",
        title: "Nombre d'échanges"
      }
    }
  };
  render(spec, format, fileName);
}

/**
 *
 * @param {NbUseTerm[]} data Array of object: NbUseTerm ( a term and the number of its occurrence)
 * @param {String} format Format of the file that will be exported (svg or png)
 * @param {String} fileName name of the exported file
 */
const top10term = (data, format, fileName) => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {values: data},
    mark: "bar",
    title: "Top 10 des termes utilisés dans les objets de mails",
    encoding: {
      x: {
        field: "term",
        title: "Termes utilisés",
        sort: "-y"
      },
      y: {
        field: "nbUse",
        type: "quantitative",
        title: "Occurrence d'un terme"
      }
    }
  };
  render(spec, format, fileName);
}

module.exports = { visualInteraction, top10Interloc, top10term };