---
comments: true
date: 2012-08-06 16:23:21
layout: post
slug: webserver-file-permissions
title: Webserver File Permissions
wordpress_id: 1018
categories:
- Linux
tags:
- apache
- bash
- permissions
- web server
---

I often forget what the best permission masks are for web data.

From what I have found out, the standard permissions should go along the lines of



	
  * Directories 755

	
  * PHP 600

	
  * Everything Else 644


Also make sure that all files and folder are owned by the correct users/group.

    
    find . -exec chown www-data:www-data  {} \;
    find . -type d -exec chmod 755 {} \;
    find . -iname \*.php -exec chmod 600 {} \;
    find . -type f -exec chmod 644 {} \;



Yeah I know you should use xargs, due to performance but there are not huge number of files evolved here.
