
/****** Object:  Table [db_owner].[marvelCharacMovie]    Script Date: 15-09-2020 20:37:10 ******/
IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[db_owner].[marvelCharacMovie]') AND type in (N'U'))
DROP TABLE [db_owner].[marvelCharacMovie]
GO
/****** Object:  Table [db_owner].[marvelCharacter]    Script Date: 15-09-2020 20:37:55 ******/
IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[db_owner].[marvelCharacter]') AND type in (N'U'))
DROP TABLE [db_owner].[marvelCharacter]
GO
/****** Object:  Table [db_owner].[marvelMovie]    Script Date: 15-09-2020 20:38:22 ******/
IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[db_owner].[marvelMovie]') AND type in (N'U'))
DROP TABLE [db_owner].[marvelMovie]
GO

CREATE TABLE marvelCharacter
(
    characId INT IDENTITY (1,1) NOT NULL,
    characFirstName NVARCHAR(50) NOT NULL,
    characLastName NVARCHAR(50),
    characAlias NVARCHAR(50) NOT NULL,
    characDateOfBirth NVARCHAR(10),
    characGender NVARCHAR(10) NOT NULL,
    characJob NVARCHAR(50),
    characOrigin NVARCHAR(50) NOT NULL,
    characAbility NVARCHAR(50) NOT NULL,
    characWeakness NVARCHAR(50) NOT NULL,
    characArtefact NVARCHAR(50),
    characActor NVARCHAR(50) NOT NULL,

    PRIMARY KEY (characId)
);

CREATE TABLE marvelMovie
(
    movieId INT IDENTITY (1,1) NOT NULL,
    movieTitle NVARCHAR(50) NOT NULL,
    movieDescription NVARCHAR(1000) NOT NULL,
    movieReleaseYear INT NOT NULL,

    PRIMARY KEY (movieId)
);

CREATE TABLE marvelCharacMovie
(
    FK_characId INT,
    FK_movieId INT,

    CONSTRAINT PK_marvelCharacMovie PRIMARY KEY  
        ( 
            FK_characId, 
            FK_movieId 
        ),

    FOREIGN KEY (FK_characId) REFERENCES marvelCharacter (characId),
    FOREIGN KEY (FK_movieId) REFERENCES marvelMovie (movieId)
);

-- Populating the DB with test data --
INSERT INTO marvelCharacter
    ([characFirstName], [characLastName], [characAlias], [characDateOfBirth], [characGender], [characJob], [characOrigin], [characAbility], [characWeakness], [characArtefact], [characActor])
VALUES
    ('Tony', 'Stark', 'Iron Man', '29/05/1970', 'Male', 'CEO of Start Industries', 'Long Island, New York', 'Genius level intellect', 'Technology dependency', 'Iron Man suit', 'Robert Downey Jr'),
    ('Steve', 'Rogers', 'Captain America', '04/07/1918', 'Male', 'Former U.S Army soldier', 'Brooklyn, New York', 'Superhuman strength', 'Mortality', 'Captain America’s Shield', 'Chris Evans'),
    ('Natasha', 'Romanoff', 'Black Widow', 'Unknown', 'Female', 'Spy', 'Stalingrad, U.S.S.R', 'Hand-to-hand combat', 'Mortality', 'Widow’s Bite', 'Scarlett Johansson'),
    ('Clint', 'Barton', 'Hawkeye', '18/06/1982 ', 'Male', 'Special agent', 'Waverly, Iowa', 'Master archer and marksman', 'Limited arrows', 'Bow', 'Jeremy Renner'),
    ('T’Challa', '', 'Black Panther', 'Unknown', 'Male', 'Ruler of Wakanda', 'Wakanda', 'Hand-to-hand combat', 'Mortality', 'Black Panther vibranium suit', 'Chadwick Boseman'),
    ('James Rupert “Rhodey”', 'Rhodes', 'War Machine', '06/10/1968', 'Male', 'Officer in the US Air Force', 'Philadelphia, Pennsylvania', 'Marksman', 'Mortality', 'War Machine Armour', 'Don Cheadle'),
    ('Peter Benjamin', 'Parker', 'Spider Man', '10/08/2001', 'Male', '', 'Queens, New York', 'Agility', 'Mortality', 'Spider Man suit', 'Tom Holland'),
    ('Scott Edward Harris', 'Lang', 'Ant Man', '06/09/1983', 'Male', 'Professional Thief', 'Coral Gables, Florida', 'Change size', 'Mortality', 'Ant Man suit', 'Paul Rudd'),
    ('Samuel Thomas “Sam”', 'Wilson', 'Falcon', '1970', 'Male', 'Helps veterans suffering from PTSD', 'Harlem, New York', 'Marksman', 'Mortality', 'EXO-7 Falcon flying suit', 'Anthony Mackie'),
    ('Wanda', 'Maximoff', 'Scarlet Witch', 'Unknown', 'Female', '', 'Sokovia', 'Energy manipulation', 'Mental instability', '', 'Elizabeth Olson'),
    ('Vision', '', 'Vision', '2015', 'Male', '', 'Android created by Ultron', 'Energy beams', 'Relies on mind stone', 'The mind stone', 'Paul Bettany'),
    ('James Buchanan “Bucky”', 'Barnes', 'Winter Soldier', '10/03/1917', 'Male', 'Assassin', 'Brooklyn, New York', 'Superhuman strength', 'Brainwashed', 'Cybernetic arm', 'Sebastian Stan')


INSERT INTO marvelMovie
    ([movieTitle], [movieDescription], [movieReleaseYear])
VALUES
    ('Captain America: Civil War', 'Marvel’s “Captain America: Civil War” finds Steve Rogers leading the newly formed team of Avengers in their continued efforts to safeguard humanity. But after another incident involving the Avengers results in collateral damage, political pressure mounts to install a system of accountability, headed by a governing body to oversee and direct the team. The new status quo fractures the Avengers, resulting in two camps—one led by Steve Rogers and his desire for the Avengers to remain free to defend humanity without government interference, and the other following Tony Stark’s surprising decision to support government oversight and accountability.', '2016')


INSERT INTO marvelCharacMovie
    (FK_characId, FK_movieId)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),
    (6, 1),
    (7, 1),
    (8, 1),
    (9, 1),
    (10, 1),
    (11, 1),
    (12, 1)

-- Selecting
SELECT *
FROM marvelCharacter

SELECT *
FROM marvelMovie

SELECT *
FROM marvelCharacMovie

SELECT *
FROM marvelCharacMovie
WHERE FK_characId = 1

SELECT characId, characFirstName, FK_characId, FK_movieId
FROM marvelCharacter
INNER JOIN marvelCharacMovie
ON marvelCharacter.characId = marvelCharacMovie.FK_characId
ORDER BY characId ASC;