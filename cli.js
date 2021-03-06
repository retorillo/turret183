var maq = require('maq');
var pug = require('pug');
var gnuopt = require('gnu-option');
var gnuoptmap = { ingredient: "switch", cook: "switch" }
var fs = require('fs');
var recipe = { am:84, sl:17, sm:17, ss:17, ak:16, te:16, ha:16 };
var pugpath = "index.pug";
var outpath = "index.html";
var ingsep = "\n";
var ingpath = "ingredient";
var ingenc = "utf-8";
var outenc = ingenc;
var since = new Date("2016/12/13");
var perday = 10;
var completeMap = require('./complete.json');
var complete = 0;
for (var c in completeMap)
  complete += completeMap[c];
var incomplete = -complete;
for (var c in recipe)
  incomplete += recipe[c];

var dayms = 24 * 60 * 60 * 1000;

var argv = gnuopt.parse(gnuoptmap);

if (argv.ingredient) ingredient();
if (argv.cook) cook();

function ingredient() {
  fs.writeFileSync(ingpath, maq(recipe).join(ingsep), { encoding: ingenc });
}

function cook() {
  var cooker = pug.compileFile(pugpath, { pretty: '  ', });
  var ing = fs.readFileSync(ingpath, { encoding: ingenc }).split(ingsep);
  var day = since;
  var model = { calender: [] };
  ing.forEach((i, c) => {
    if (c % perday == 0) {
      model.calender.push({
        daysep: true,
        month: day.getMonth() + 1,
        day: day.getDate(),
      });
      day = new Date(day.getTime() + dayms)
    }
    model.calender.push({
      index: c,
      incomplete: complete <= c,
      pending: complete == c,
      img: `img/${i}.png`,
      day: day,
      progress: Math.round((c + 1) / ing.length * 100),
    })
  });
  model.status = JSON.stringify({
    start: since.getTime(),
    end: day.getTime(),
    incomplete: incomplete,
    complete: complete,
  });
  fs.writeFileSync(outpath, cooker(model), { encoding: outenc })
}
