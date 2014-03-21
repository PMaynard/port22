---
comments: true
date: 2011-01-22 20:22:08
layout: post
slug: iptables-reroute-to-another-ip
title: iptables reroute to another IP
wordpress_id: 454
categories:
- Linux
tags:
- ip redirection
- iptables
---

This is how I re-routed all traffic through port 25565 to another IP address.

    
    echo "1" > /proc/sys/net/ipv4/ip_forward
    iptables -t nat -A PREROUTING -p tcp --dport 25565 -j DNAT --to-destination <IP>
    iptables -t nat -A POSTROUTING -j MASQUERADE


To clear what you just did:

    
    
    iptables -F
    iptables -X
    iptables -t nat -F
    iptables -t nat -X
    


For more information on iptables: [Linux Home Networking](http://www.linuxhomenetworking.com/wiki/index.php/Quick_HOWTO_:_Ch14_:_Linux_Firewalls_Using_iptables), [debuntu](http://www.debuntu.org/how-to-redirecting-network-traffic-a-new-ip-using-iptables).
Good luck.
