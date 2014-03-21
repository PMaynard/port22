CREATE DATABASE port22feeds; 
USE port22feeds;

CREATE TABLE article(
	id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL, 
	url varchar(255),
	timestamp datetime NOT NULL,
	author varchar(255),
	guid text,
	comments text, 
	categories text,
	hash varchar(255) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (hash)
);

CREATE TABLE feed(
	id int NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL, 
	description text,
	site_url varchar(255),
	fed_url varchar(255),
	timestamp datetime,
	author varchar(255),
	copyright varchar(255),
	generator text,
	categories text,
	PRIMARY KEY (id),
	UNIQUE (fed_url)
);

