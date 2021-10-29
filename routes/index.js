let express = require("express");
let router = express.Router();

const myDB = require("../db/MySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const fires = await myDB.getFires();

  // render the _index_ template with the fires attrib as the list of fires
  res.render("index", { fires: fires });
});

/* GET fire details. */
router.get("/fires/:fireID", async function (req, res) {
  console.log("Got fire details");

  const fireID = req.params.fireID;

  const fire = await myDB.getFireByID(fireID);

  res.render("fireDetails", { fire: fire });
});

/* POST update artworks. */
router.post("/fires/update", async function (req, res) {
  console.log("Got artworks.");

  //const fireID = req.params.fireID;
  const fire2 = req.body;

  console.log("gotfire details ", fire2);

  await myDB.updateArtworks(fire2);

  console.log("artworks update");

  res.render("fireDetails", { fire: fire2 });
});

/* POST create fires. */
router.post("/fires/create", async function (req, res) {
  console.log("Got post create/fires");

  const fire = req.body;

  console.log("got create fire", fire);

  await myDB.createFire(fire);

  console.log("Fire created");

  res.redirect("/");
});

/* POST delete fires. */
router.post("/fires/delete", async function (req, res) {
  console.log("Got post delete fire");

  const fire = req.body;

  console.log("got delete fire", fire);

  await myDB.deleteFire(fire);

  console.log("Fire deleted");

  res.redirect("/");
});

module.exports = router;
