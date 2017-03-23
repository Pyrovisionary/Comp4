DROP DATABASE LloydGeorge;
CREATE DATABASE LloydGeorge;

USE LloydGeorge;

CREATE TABLE IF NOT EXISTS classes(
	classid integer primary key auto_increment not null,
    classname varchar(20) not null
);

CREATE TABLE IF NOT EXISTS users(
	userid integer primary key auto_increment not null,
    username varchar(60) not null,
    forename varchar(30) not null,
    surname varchar(40) not null,
    pass varchar(100) not null,
    email varchar(100) not null,
    teacher boolean not null,
    accountbalance boolean not null
);

CREATE TABLE IF NOT EXISTS classuserlink (
	linkid integer primary key auto_increment not null,
    classid integer not null,
    userid integer not null,
    FOREIGN KEY (classid) REFERENCES classes(classid),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS portfolios(
	portfolioid integer primary key auto_increment not null,
    userid integer not null,
    portfolioname varchar(20),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS stocknames(
	stockid integer primary key auto_increment not null, 
    stockticker varchar(10) not null,
	stockname varchar(100) not null,
    ipoyear varchar(4),
    sector varchar(90),
    industry varchar(90)
);

CREATE TABLE IF NOT EXISTS stockhistory(
	stockhistoryid integer primary key auto_increment not null, 
    stockid integer not null,
    stockvalue integer not null,
    stockvaluepercentagechange float not null,
    sampletime integer not null,
    volume integer not null,
    FOREIGN KEY (stockid) REFERENCES stocknames(stockid)
);

CREATE TABLE IF NOT EXISTS portfoliostocklink(
	portfoliostocklinkid integer primary key auto_increment not null,
    portfolioid integer not null,
    stockid integer not null,
	buyprice integer not null,
    volume integer not null,
    purchasedatetime TIMESTAMP,
    FOREIGN KEY (portfolioid) REFERENCES portfolios(portfolioid),
    FOREIGN KEY (stockid) REFERENCES stocknames(stockid)
);