const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

async function connect() {
  return open({
    filename: "./db/P1.db",
    driver: sqlite3.Database,
  });
}

async function getFires() {
  const db = await connect();

  return await db.all("SELECT * FROM Artworks ORDER BY artworkID DESC LIMIT 6");
}

async function createFire(newFire) {
  const db = await connect();

  const stmt = await db.prepare(`INSERT INTO
    Artworks(name, artistID, year, movementID, galleryID, statusID)
    VALUES (:name, :artistID, :year, :movementID, :galleryID, :statusID)
  `);
  console.log("got create fire", newFire.name);

  stmt.bind({
    ":name": newFire.name,
    ":artistID": newFire.artistID,
    ":year": newFire.year,
    ":movementID": newFire.movementID,
    ":galleryID": newFire.galleryID,
    ":statusID": newFire.statusID,
  });

  return await stmt.run();
}
async function updateArtworks(newFire) {
  const db = await connect();

  const stmt = await db.prepare(`UPDATE Artworks
    SET name = :name, year = :year, movementID = :movementID, galleryID = :galleryID, statusID = :statusID, artistID = :artistID
    WHERE artworkID = :artworkID;
  `);
  console.log("got updateArtworks", newFire.name);

  stmt.bind({
    ":name": newFire.name,
    ":year": newFire.year,
    ":movementID": newFire.movementID,
    ":galleryID": newFire.galleryID,
    ":statusID": newFire.statusID,
    ":artistID": newFire.artistID,
    ":artworkID": newFire.artworkID,
  });
  console.log("got bind", newFire.name);

  return await stmt.run();
}

async function getFireByID(artworkID) {
  const db = await connect();

  const stmt = await db.prepare(`SELECT *
    FROM Artworks
    WHERE
      artworkID = :artworkID
  `);

  stmt.bind({
    ":artworkID": artworkID,
  });

  return await stmt.get();
}

async function deleteFire(fireToDelete) {
  const db = await connect();

  const stmt = await db.prepare(`DELETE FROM
    Artworks
    WHERE artworkID = :theIDToDelete
  `);

  stmt.bind({
    ":theIDToDelete": fireToDelete.artworkID,
  });

  return await stmt.run();
}
module.exports.getFires = getFires;
module.exports.createFire = createFire;
module.exports.deleteFire = deleteFire;
module.exports.getFireByID = getFireByID;
module.exports.updateArtworks = updateArtworks;
