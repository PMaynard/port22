# id | title | url | timestamp | hash  

CREATE DATABASE port22feeds; 

CREATE TABLE feeds(
	id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL, 
	url text,
	# source varchar(255) NOT NULL,
	timestamp datetime NOT NULL,
	hash varchar(255) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (hash)
);