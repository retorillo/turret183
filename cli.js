var maq = require('maq');
var pug = require('pug');
var gnuopt = require('gnu-option');
var gnuoptmap = { ingredient: "switch", "cook": "switch" }
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
var complete = 10;

var argv = gnuopt.parse(gnuoptmap);

if (argv.ingredient) ingredient();
if (argv.cook) cook();

function ingredient() {
  fs.writeFileSync(ingpath, maq(recipe).join(ingsep), { encoding: ingenc });
}

function cook() {
  var cooker = pug.compileFile(pugpath);
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
      day = new Date(day.getTime() + 24 * 60 * 60 * 1000)
    }
    model.calender.push({
      index: c,
      incomplete: complete <= c,
      img: `img/${i}.png`,
      day: day,
      progress: Math.round((c + 1) / ing.length * 100),
    })
  });

  fs.writeFileSync(outpath, cooker(model), { encoding: outenc })
}
