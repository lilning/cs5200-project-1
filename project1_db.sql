BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Status" (
	"statusID"	INTEGER NOT NULL UNIQUE,
	"statusType"	TEXT NOT NULL CHECK("statusType" IN ('Active', 'Inactive', 'In Maintenance')),
	PRIMARY KEY("statusID")
);
CREATE TABLE IF NOT EXISTS "Artworks" (
	"artworkID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"artistID"	INTEGER NOT NULL,
	"year"	INTEGER NOT NULL,
	"movementID"	INTEGER NOT NULL,
	"galleryID"	INTEGER NOT NULL,
	"statusID"	INTEGER NOT NULL,
	PRIMARY KEY("artworkID"),
	FOREIGN KEY("artistID") REFERENCES "Artists"("artistID"),
	FOREIGN KEY("statusID") REFERENCES "Status"("statusID"),
	FOREIGN KEY("galleryID") REFERENCES "Gallery"("galleryID"),
	FOREIGN KEY("movementID") REFERENCES "Art_movements"("movementID")
);
CREATE TABLE IF NOT EXISTS "Administrator" (
	"employeeID"	INTEGER NOT NULL UNIQUE,
	"firstName"	TEXT NOT NULL,
	"lastName"	TEXT NOT NULL,
	"galleryID"	INTEGER NOT NULL,
	"startDate"	TEXT NOT NULL,
	"endDate"	TEXT NOT NULL,
	"email"	TEXT NOT NULL CHECK("email" LIKE "%_@__%.__%"),
	PRIMARY KEY("employeeID"),
	FOREIGN KEY("galleryID") REFERENCES "Gallery"("galleryID")
);
CREATE TABLE IF NOT EXISTS "Gallery" (
	"galleryID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"address"	TEXT NOT NULL,
	"phoneNumber"	TEXT NOT NULL CHECK(LENGTH("phoneNumber") > 9),
	"businessEmail"	TEXT NOT NULL CHECK("businessEmail" LIKE "%_@__%.__%"),
	PRIMARY KEY("galleryID")
);
CREATE TABLE IF NOT EXISTS "Artists" (
	"artistID"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"birthYear"	INTEGER NOT NULL CHECK("deathYear" IS NULL OR "deathYear" > "birthYear"),
	"deathYear"	INTEGER NOT NULL,
	"nationalityID"	INTEGER NOT NULL,
	"description"	TEXT NOT NULL,
	PRIMARY KEY("artistID"),
	FOREIGN KEY("nationalityID") REFERENCES "Nationality"("nationalityID")
);
CREATE TABLE IF NOT EXISTS "Art_movements" (
	"movementID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("movementID")
);
CREATE TABLE IF NOT EXISTS "Nationality" (
	"nationalityID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"region"	TEXT NOT NULL,
	PRIMARY KEY("nationalityID")
);
COMMIT;
