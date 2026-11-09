---
date: 2026-11-09
categories:
  - XGS-PON
  - Connect Box 3
  - Sagemcom
  - FS.com
  - XGS-ONU-25-20NI
  - Sunrise
description: Masquerade as the Sunrise Connect Box 3 with the FS.com XGS-ONU-25-20NI
slug: masquerade-as-the-sunrise-connect-box-3-with-the-fs-xgs-onu-25-20ni
links:
  - xgs-pon/index.md
  - posts/masquerade-as-the-sunrise-yallo-home-fiber-box-2-with-the-was-110.md
ont: Connect Box 3
operator: Sunrise
---

# Masquerade as the Sunrise Connect Box 3 with the FS.com XGS-ONU-25-20NI

![Bypass Connect Box 3]({{ page.meta.slug }}/bypass_{{ page.meta.ont | lower | replace(" ", "_") }}.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

!!! warning "New subscriber installations"
    Make sure the line is active with the {{ page.meta.ont }} first. If its status page shows
    __Network access: Not allowed__, the line is not provisioned yet and no ONT will get service: the stick can reach
    __O5__ with healthy optics and still receive no DHCP lease.

!!! info "Tested setup"
    This guide was tested on a single Sunrise line in Switzerland, with an FS.com XGS-ONU-25-20NI on firmware
    `R4.4.20.023` and a {{ page.meta.ont }} on software `7.8.0-2410.5`. The WAS-110 and X-ONU-SFPP have not been tested
    with the {{ page.meta.ont }}; for those, start from the
    [Home Fiber Box 2 guide](masquerade-as-the-sunrise-yallo-home-fiber-box-2-with-the-was-110.md).

???+ question "Common misconceptions and answers"

    __Is the XGS-ONU-25-20NI a gateway/router?__

    :   No. It is an SFU ONT (not an HGU) that converts Ethernet to PON; it does not provide Layer 7 gateway functions
        (NAT, DHCP, etc.) A separate gateway/router is required for internet access.

    __Is the serial number the same as on the Home Fiber Box 2?__

    :   No. On the Home Fiber Box 2 the OLT authenticates the `SMBS`&hellip; value and not the `YCEC`&hellip; one. On the
        {{ page.meta.ont }}, the value to use is the one labelled __ONU Serial Number__, which begins `YCEC`&hellip;.

## Purchase Hardware

### ONT

The XGS-ONU-25-20NI is sold by [FS.com](https://www.fs.com/). Hardware details, UART access and the full CLI are
documented on [Hack GPON](https://hack-gpon.org/xgs/ont-fs-XGS-ONU-25-20NI/).

### Fiber adapter or cable

The {{ page.meta.ont }} uses an LC/APC connector and the stick an SC/APC one, so you need a Female LC/APC to Male
SC/APC adapter or a Male LC/APC to Male SC/APC patch cable.

!!! danger "Never mismatch APC (green) and UPC (blue)"
    This causes signal loss and can permanently damage the fiber faces.

## Pre-configuration

### DHCP MAC Spoofing

You must __clone the {{ page.meta.ont }} WAN MAC address onto your ^^gateway^^'s WAN physical interface.__ It is the
same MAC used for the [Registration ID].

### Management access

The stick is managed over telnet on `192.168.100.1` by default. Connect it to a host that can reach that address.

The telnet user is the GPON serial number of the stick, and the password is derived from it. Use the
[Hack GPON credential generator](https://hack-gpon.org/xgs/ont-fs-XGS-ONU-25-20NI/#login-and-enable) to get the login
for the current serial number, and the one for the {{ page.meta.ont }} serial number before you change it.

## Configure ONT settings

To masquerade as the {{ page.meta.ont }}, you will need its __ONU Serial Number__ and its __WAN MAC address__. The
__ONU Serial Number__ is shown on the __Info__ page of its web interface at `http://192.168.1.1`, and the WAN MAC on its
status page.

!!! tip "The ONU Serial Number may not be labelled"
    The label below only has `MAC:` and `S/N:` fields, and its `S/N:` begins `YAAS`&hellip;. Do not confuse it with the
    __ONU Serial Number__ from the __Info__ page, which begins `YCEC`&hellip;.

![{{ page.meta.ont }} label]({{ page.meta.slug }}/{{ page.meta.ont | lower | replace(" ", "_") }}_label.webp){ class="nolightbox" }

1.  Log in over telnet and open the `misc` menu.

    ``` sh
    telnet 192.168.100.1
    ```

    ``` sh
    ONT> enable
    #ONT> system
    #ONT/system> misc
    ```

2.  Set the serial number and the [Registration ID].

    !!! note "Reminder"
        Replace `YCEC1A2B3C4D` and `314132423343344435453646` with the values from your own {{ page.meta.ont }}.

    ``` sh
    #ONT/system/misc> eqsn set "YCEC1A2B3C4D"
    #ONT/system/misc> xgspon_regid set 314132423343344435453646
    ```

    !!! warning "The telnet login changes immediately"
        After `eqsn set`, the next telnet session needs the new serial number and the password derived from it.

3.  Verify the values.

    ``` sh
    #ONT/system/misc> eqsn get
    #ONT/system/misc> xgspon_regid get
    ```

4.  Reboot the stick by reseating it. The `misc` settings are applied at the next boot.

The OMCI equipment ID, hardware version and software version were left unchanged on the tested line, and `pon_passwd`
stayed zeroed.

## Registration ID { #registration-id }

The value is your original {{ page.meta.ont }}'s __WAN MAC address, as an UPPERCASE ASCII string__, not as raw MAC
bytes. The stick fills the remaining bytes with zeros.

Example for a WAN MAC of `1A:2B:3C:4D:5E:6F`:

| Step | Value |
| ---- | ----- |
| WAN MAC | `1A:2B:3C:4D:5E:6F` |
| As an uppercase string, colons removed | `1A2B3C4D5E6F` |
| Hex-encoded (this is what you enter) | `314132423343344435453646` |

``` sh
printf '%s' "1A2B3C4D5E6F" | xxd -p
# 314132423343344435453646
```

## Verify ONT connectivity

### Hot plug fiber cable

!!! danger "Avoid direct eye contact with the end of the fiber optic cable"

After rebooting the stick, safely remove the fiber from the {{ page.meta.ont }} and connect it to the stick. Check that
__Data Rx Power__ shows a value and not `No input`.

``` sh
#ONT/system/misc> show trans state
Power           : 3V3 (3.4)
Temperature     : 51.64 C
Data Rx Power   : -14.7 dBm
APD Prot        : No
Data Tx bias    : 19.8 mA
Data Tx Power   : 6.1 dBm
```

### Validate OLT authentication

Verify that the stick is in the _O5, Operation state_, and that the values in use are the ones you set:

``` sh
#ONT> traffic/pon/show link

 ----------------- LINK STATE -----------------
 Operation State Machine: OPERATION (O5)
 ----------------- STATE  END -----------------
```

``` sh
#ONT> traffic/pon/show onu
```

## Router tips

!!! Note "Detailed router setup falls outside the scope of the documentation due to the multitude of available solutions."

* Apply the [pre-configuration](#pre-configuration) requirements, including the WAN MAC clone.
* Configure the WAN VLAN to `131`.
* Configure the WAN for DHCP mode.

??? info "Other VLANs seen on the Sunrise OMCI VLAN table"
    | VLAN  | Role                                          |
    | ----- | --------------------------------------------- |
    | `131` | Internet (data), tag your WAN here            |
    | `121` | Operator management (TR-069/ACS plane)        |
    | `117` | Voice (VoIP/SIP)                              |

## Troubleshooting

__O5 but no DHCP offer__

:   The line or the identity is not provisioned. Check the status page of the {{ page.meta.ont }} and contact Sunrise.

__WAN IP assigned, but the gateway does not respond__

:   Release and renew the DHCP lease on the WAN interface. On the tested line, this restored traffic, and the same IP
    was assigned again.

__Link stuck at 1G on a UniFi gateway__

:   With the SFP+ port on Auto, a UniFi Gateway Pro saved 1G in its link cache. Setting the port to 10 Gbps, then back
    to Auto, and rebooting the stick brought the link back to 10G.

__Telnet to the stick fails once it is in the WAN port__

:   Add a temporary address and a host route on the untagged WAN interface. `arp_ignore=1` can otherwise prevent the
    router from answering the ARP requests of the stick.

    ``` sh
    ip addr add 192.168.100.2/32 dev eth2
    ip route add 192.168.100.1/32 dev eth2 src 192.168.100.2
    ```

## Software versions

| Software Version |
| ---------------- |
| 7.8.0-2410.5     |

## Credits

The Registration ID derivation for Sunrise/yallo was originally documented by [smma.ch](https://smma.ch/). The CLI
commands for the stick are documented by [Hack GPON](https://hack-gpon.org/xgs/ont-fs-XGS-ONU-25-20NI/).

  [Registration ID]: #registration-id
