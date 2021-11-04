let express = require("express");
let router = express.Router();

const myDB = require("../db/artist.js");

/* GET artist home page. */
router.get("/artists", async function (req, res) {
  console.log("Got request for /artists");
  const query = req.query.q || "";
  const artists = await myDB.getArtists(query);

  // render the _artist_ template with the artists attrib as the list of artists
  res.render("artists", { artists: artists, query: query });
});

/* GET artist details. */
router.get("/artists/:artistID", async function (req, res) {
  console.log("Got artist");

  // get Nationality values for dropdown
  console.log("Got request for nationality");
  const nationality = await myDB.getNationality();

  const artistID = req.params.artistID;

  const artist = await myDB.getArtistByID(artistID);

  res.render("artistDetails", { artist: artist, nat: nationality });
});

/* POST update artworks. */
router.post("/artists/update", async function (req, res) {
  console.log("Update artist.");

  //const fireID = req.params.fireID;
  const updateInfo = req.body;

  console.log("gotArtist details", updateInfo);

  await myDB.updateArtist(updateInfo);

  console.log("artist update");

  res.redirect("/artists");
});

/* GET create artist page. */
router.get("/createArtist", async function (req, res) {
  console.log("Got request for nationality");
  const nationality = await myDB.getNationality();

  // render the createArtist template with the nationality attributes
  res.render("createArtist", { nat: nationality });
});

/* POST create artist. */
router.post("/createArtist", async function (req, res) {
  console.log("Got post create/artists");

  const artist = req.body;
  console.log("got create artist", artist);

  await myDB.createArtist(artist);

  console.log("Artist created");

  res.redirect("/artists");
});

/* POST delete Arts. */
router.post("/artists/delete", async function (req, res) {
  console.log("Got post delete artist");

  const artist = req.body;

  console.log("got delete artist", artist);

  await myDB.deleteArtist(artist);

  console.log("Artist deleted");

  res.redirect("/artists");
});

module.exports = router;
