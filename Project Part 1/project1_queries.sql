-- 1. At least one query must contain a join of at least three tables:

-- Find the employeeIDs in the gallery which has artwork from Post-Impressionism movement (movementID = 1)
SELECT DISTINCT employeeID
from Administrator
JOIN Gallery
on Administrator.galleryID = Gallery.galleryID
JOIN Artworks
on Artworks.galleryID = Gallery.galleryID
where movementID = 1


-- 2. one must contain a subquery

-- Display the count of artworks for each artist and movement
SELECT Artist, Art_Movement, COUNT(Art_Movement) AS Count_Of_Artworks
FROM (SELECT DISTINCT Artists.Name AS Artist, Art_movements.name AS Art_Movement, Artworks.artworkID
FROM Artists, Artworks, Art_movements
WHERE Artists.artistID = Artworks.artistID
AND Artworks.movementID = Art_movements.movementID)
GROUP BY Artist, Art_Movement


-- 3. one must be a group by with a having clause

-- Find nations that have 2 or more movements
SELECT  Nationality.name
from Nationality
JOIN Artists
on Nationality.nationalityID = Artists.nationalityID
JOIN Artworks
on Artworks.artistID = Artists.artistID
GROUP by Nationality.name
HAVING count (DISTINCT movementID) >= 2;


-- 4. one must contain a complex search criterion (more than one expression with logical connectors)

-- Find the name and birth year of artists and compare birth year of the artists with average birth year in the same movements
SELECT  DISTINCT Artists.name, birthYear, CAST(ROUND(AVG(birthYear) over(
PARTITION by movementID),0) as int) AS avg_birthYear_in_Movement
from Artists
join Artworks
on Artists.artistID = Artworks.artistID;

-- 5. List the artwork by status type where status is not equal to 'Active'
SELECT Status.statusType AS Status_Type, Artworks.name AS Artwork, Artists.name AS Artist
FROM Artists, Artworks, Status
WHERE Artists.artistID = Artworks.artistID
AND Artworks.statusID = Status.statusID
AND statusType NOT LIKE 'Active'
ORDER BY Status_Type, Artwork