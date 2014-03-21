---
comments: true
date: 2012-06-25 12:10:49
layout: post
slug: ssh-and-tsocks
title: SSH and tsocks
wordpress_id: 835
categories:
- Linux
tags:
- Encrypted
- proxy
- SOCKS
- SSH
---

Install tsocks on your client machine. Tsocks is a application which replaces all connect() calls with it's own, which means you can run any application though the server/proxy even if it dosent have support for proxy/SOCKS.


    
    apt-get install tsocks



Update **/etc/tsocks.conf**
server = 127.0.0.1
server_port = 1080




These will need to match the SSH setting, as seen later on.

You might want to configure local networks, but that's up to you. Local allows you to directly access the address, instead of through the server/proxy.

Setup your SSH connection to your sever.


    
    ssh -w  -D 1080 user@server



That's it, you should be all set up. To run an application though the server/proxy simply open a terminal and enter:

    
    tsocks <application>



For example force firefox to use the server/proxy


    
    tsocks firefox https://www.google.co.uk/search?q=whats+my+ip
