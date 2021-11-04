const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require('path');
sqlite3.verbose();

async function connect() {
  return open({
    filename: "./db/P1.db",
    driver: sqlite3.Database,
  });
}

// Create an artist record
async function createArtist(newArtist) {
  let db, stmt, stmt1;
  try {
    db = await connect();

    if (newArtist.nationality == 'other') {
      try {
        stmt1 = await db.prepare(`INSERT INTO
        Nationality(name, region)
        VALUES (:newNationality, :newRegion)`);
        console.log("Add new nationality", newArtist.newNationality);
        stmt1.bind({
          ":newNationality": newArtist.newNationality,
          ":newRegion": newArtist.newRegion,
        });
        return await stmt1.run();
      } finally {
        await stmt1.finalize();
        stmt = await db.prepare(`INSERT INTO
          Artists(Name, birthYear, deathYear, nationalityID, description)
          VALUES (:Name, :birthYear, :deathYear, (SELECT nationalityID FROM Nationality WHERE name=:newNationality), :description)
          `);
          console.log("got create artist with new nationality", newArtist.Name);
        stmt.bind({
          ":Name": newArtist.Name,
          ":birthYear": newArtist.birthYear,
          ":deathYear": newArtist.deathYear,
          ":newNationality": newArtist.newNationality,
          ":description": newArtist.description,
        });
        return await stmt.run();
      }
    } else {

      stmt = await db.prepare(
      `INSERT INTO
      Artists(Name, birthYear, deathYear, nationalityID, description)
      VALUES (:Name, :birthYear, :deathYear, (SELECT nationalityID FROM Nationality WHERE name=:nationalityName), :description)
      `)
  
      console.log("got create artist with existing nationality", newArtist.Name);

      stmt.bind({
        ":Name": newArtist.Name,
        ":birthYear": newArtist.birthYear,
        ":deathYear": newArtist.deathYear,
        ":nationalityName": newArtist.nationality,
        ":description": newArtist.description,
      });
      return await stmt.run();
    }
  } catch(e) {
    console.error(e.message);
  } finally {
    await stmt.finalize();
    await db.close();
  }
}

// Update an artist record
async function updateArtist(newArtist) {
  let db, stmt;  
  try {
    db = await connect();

    stmt = await db.prepare(`UPDATE Artists
      SET Name = :Name, birthYear = :birthYear, deathYear = :deathYear, nationalityID = (SELECT nationalityID FROM Nationality WHERE Nationality.name LIKE :nationalityName), description = :description
      WHERE artistID = :artistID;
    `);
    console.log("got updateArtist", newArtist.Name);

    stmt.bind({
      ":artistID": newArtist.artistID,
      ":Name": newArtist.Name,
      ":birthYear": newArtist.birthYear,
      ":deathYear": newArtist.deathYear,
      ":nationalityName": newArtist.nationalityName,
      ":description": newArtist.description,
    });

    console.log("got bind", newArtist.Name);

    return await stmt.run();
  } catch(e) {
    console.error(e.message);
  } finally {
    await stmt.finalize();
    await db.close();
  }
}

// Get Artist Record by ID
async function getArtistByID(artistID) {
  let db, stmt;
  try {
    db = await connect();

    let sql_query = `SELECT Artists.artistID, Artists.Name, Artists.birthYear, Artists.deathYear, Nationality.name AS nationalityName, Nationality.region, Artists.description FROM Artists, Nationality Where Artists.artistID = :artistID and Artists.nationalityID = Nationality.nationalityID`
    stmt = await db.prepare(sql_query);

    stmt.bind({
      ":artistID": artistID,
    });

    return await stmt.get();
  } catch(e) {
    console.error(e.message);
  } finally {
    await stmt.finalize();
    await db.close();
  }
}

// Delete Artist Record
async function deleteArtist(artistToDelete) {
  let db, stmt;
  try {
    db = await connect();

    stmt = await db.prepare(`DELETE FROM
      Artists
      WHERE artistID = :IDToDelete
    `);

    stmt.bind({
      ":IDToDelete": artistToDelete.artistID,
    });

    return await stmt.run();
  } catch(e) {
    console.error(e.message);
  } finally {
    await stmt.finalize();
    await db.close();
  }
}

// List out all artist records with or without query
async function getArtists(query) {
  let db, stmt;
  try {
    console.log("got searchArtist", query);
    db = await connect();

    let sql_query = `SELECT Artists.artistID, Artists.Name, Artists.birthYear, Artists.deathYear, Nationality.name AS nationalityName, Nationality.region FROM Artists, Nationality Where Artists.nationalityID = Nationality.nationalityID AND Artists.Name LIKE :query ORDER BY Artists.Name`;
    stmt = await db.prepare(sql_query);

    stmt.bind({
      ":query": "%"+query+"%",
    });

    return await stmt.all();
  } finally {
    await stmt.finalize();
    await db.close();
  }
}

// List out all nationality records
async function getNationality() {
  let db;
  try {
    db = await connect();
    return await db.all("SELECT name, region FROM Nationality");
  } finally {
    await db.close();
  }
}

module.exports.getArtists = getArtists;
module.exports.createArtist = createArtist;
module.exports.deleteArtist = deleteArtist;
module.exports.getArtistByID = getArtistByID;
module.exports.updateArtist = updateArtist;
module.exports.getNationality = getNationality;