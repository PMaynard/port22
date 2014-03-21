---
comments: true
date: 2013-01-24 17:08:58
layout: post
slug: connect-to-eduroam-using-wpa_supplicant
title: Connect to Eduroam using wpa_supplicant
wordpress_id: 1134
categories:
- Linux
tags:
- arch linux
- Eduroam
- wirelss
- wpa_supplicant
---

I can never remeber how it's meant to work, which normally results in lots of authentication errors and google queries.

Less: **/etc/wpa_supplicant/wpa_supplicant_edu.conf**

    
    ctrl_interface=/var/run/wpa_supplicant
    eapol_version=1
    ap_scan=1
    fast_reauth=1
    
    network={
            ssid="eduroam"
            key_mgmt=IEEE8021X WPA-NONE WPA-EAP
            eap=PEAP
            identity="abc1@uni.ac.uk"
            password="*****"
            #ca_cert="/location/of/cert" # This might not be required.
            phase2="auth=MSCHAPV2"
            priority=2
            auth_alg=OPEN
    }


**As this will contain your password make sure that only root has read access!**

That's all there is to it. But seeing as I have done this in Arch Linux I'll include the extra steps taken to get it fully working.

Created a netcfg profile.

Less: **/etc/network.d/wlan0-eduroam**

    
    CONNECTION="wireless"
    INTERFACE=wlan0
    SCAN="no"
    SECURITY="wpa-config"
    ESSID="eduroam"
    IP="dhcp"
    TIMEOUT=30
    WPA_CONF="/etc/wpa_supplicant/wpa_supplicant_edu.conf"


You should now be able to connect to eduroam with **netcfg wlan0-eduroam**

And to make it auto connect you need to add the profile to **/etc/conf.d/netcfg**. See [netcfg](https://wiki.archlinux.org/index.php/Netcfg#Net-Auto-Wireless)
