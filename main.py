#!/usr/bin/python

import feedparser, sqlite3, datetime, hashlib

# Load Feed URLs
con = sqlite3.connect('data/data.db')
con.row_factory = sqlite3.Row
c = con.cursor()

# Initialise tables
c.execute('''CREATE TABLE feed ( link text unique, title text, date_added date)''')
c.execute('''CREATE TABLE news ( title text, author text, link text unique, description text, published date, date_added date)''')
urls = [("./lwn.atom", "The LWN", datetime.datetime.now()), 
	("./ics-cert.xml", "ICS Cert", datetime.datetime.now())]

with con:
	con.executemany('INSERT INTO feed VALUES (?, ?, ?)', urls)


for row in c.execute('SELECT link FROM feed'):
	print row['link']
	
	for e in feedparser.parse(row['link']).entries:
		published = datetime.datetime.now()
		if 'published' in e:
			published = e.published
		elif 'updated' in e:
			published = e.updated

		try:
			# Bug: Breaks out of feed loop.
			c.execute('INSERT INTO news VALUES (?, ?, ?, ?, ?, ?)', 
				(e.title, e.author, e.link, e.description, published, datetime.datetime.now()))
		except sqlite3.IntegrityError:
			print "ALREADY THERE!!", e.title 
		else: 
			print "\t", e.title
