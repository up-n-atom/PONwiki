---
date: 2026-09-26
categories:
  - XGS-PON
  - X-ONU-SFPP
  - XS-010X-Q
  - Nokia
  - KPN
  - RouterOS
description: Swap out the KPN Nokia XS-010X-Q for the X-ONU-SFPP
slug: swap-out-the-kpn-nokia-xs-010x-q-for-the-x-onu-sfpp
links:
  - xgs-pon/index.md
  - posts/accessing-the-ont.md
  - posts/troubleshoot-connectivity-issues-with-the-was-110.md
---

# Swap out the KPN Nokia XS-010X-Q for the X-ONU-SFPP

!!! abstract "No masquerading required; KPN registers the serial number of your own ONT"

![Swap KPN XS-010X-Q](swap-out-the-kpn-nokia-xs-010x-q-for-the-x-onu-sfpp/swap_kpn_xs010xq.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

KPN offers *vrije ONT keuze* (free ONT choice) on its XGS-PON network. KPN's [XS-010X-Q] doesn't give you access to
its web UI, so its attributes can't be copied as in other guides. Instead, you register the serial number of the
[X-ONU-SFPP] with KPN, and KPN switches the connection over to it.

!!! warning "XGS-PON only"
    KPN does not offer free ONT choice on GPON or AON connections. The [XS-010X-Q] mounted on a white TK-01 fiber
    termination unit (FTU) indicates an XGS-PON connection.

## Purchase an X-ONU-SFPP

The [X-ONU-SFPP] is available from select resellers worldwide. A reseller that pre-flashes the 8311 community firmware
is highly recommended, as it saves a two-step installation that is prone to bricking. Purchase at your discretion; we
take no responsibility or liability for the listed resellers.

[X-ONU-SFPP Value-Added Resellers](../xgs-pon/ont/potron-technology/x-onu-sfpp.md#value-added-resellers)

!!! question "Is the X-ONU-SFPP a router?"
    The [X-ONU-SFPP] is __NOT__ a substitute for a layer 7 router; it is an *ONT*, and its __ONLY__ function is to
    convert *Ethernet* to *PON* over fiber medium. Additional hardware and software are required to access the Internet.

If your [X-ONU-SFPP] did not come pre-flashed, follow the X-ONU-SFPP steps in
[Install the 8311 community firmware](swap-out-the-nokia-xs-010x-q-for-a-small-form-factor-pluggable-was-110.md#install-the-8311-community-firmware)
first.

## Find the PON serial number

The PON serial number consists of a four-letter vendor ID followed by eight hexadecimal characters, e.g.
`BIDB1A2B3C4D` on a module flashed by Better Internet. It may be printed on the label of the [X-ONU-SFPP], as it is on
modules from Better Internet.

If it isn't on the label, or to confirm it, read it from the web UI:

1. Plug the [X-ONU-SFPP] into your router or switch and [access the ONT](accessing-the-ont.md).

2. Within a web browser, navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/config> and, if asked, input your
   *root* password.

3. From the __8311 Configuration__ page, on the __PON__ tab, note the __PON Serial Number (ONT ID)__.

!!! danger "Leave the PON tab at its defaults"
    KPN authorizes the [X-ONU-SFPP] by its own serial number, so there is nothing to copy from the [XS-010X-Q]; its
    web UI isn't accessible on KPN's units anyway. Do not change the serial number after registering it with KPN.

## Configure the X-ONU-SFPP

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![WAS-110 8311 configuration ISP fixes](shared-assets/was_110_luci_config_fixes.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![WAS-110 8311 reboot](shared-assets/was_110_luci_reboot.webp){ loading=lazy }

</div>

</div>

1. From the __8311 Configuration__ page, on the __ISP Fixes__ tab, fill in the configuration with the following values:

    | Attribute       | Value   | Remarks  |
    | --------------- | ------- | -------- |
    | Fix VLANs       | Enabled |          |
    | Internet VLAN   | 6       | Internet |
    | Services VLAN   | 4       | IPTV     |

2. __Save__ changes and *reboot* from the __System__ menu.

## Configure the router

KPN delivers Internet over PPPoE on VLAN 6. RouterOS connects with the username and password left blank; if your
router requires them, enter any value, e.g. `internet`.

=== ":simple-mikrotik: RouterOS"

    Replace `sfp-sfpplus1` with the interface the [X-ONU-SFPP] is plugged into.

    ``` sh
    /interface vlan
    add interface=sfp-sfpplus1 name=vlan6-kpn vlan-id=6
    /ppp profile
    add change-tcp-mss=yes name=kpn
    /interface pppoe-client
    add add-default-route=yes disabled=no interface=vlan6-kpn max-mtu=1492 name=pppoe-kpn profile=kpn
    ```

    ??? tip "Translate VLAN 6 on a CRS3xx switch"
        If the [X-ONU-SFPP] sits in a CRS3xx switch and your router already expects a different WAN VLAN, the switch
        chip can rewrite the VLAN ID in both directions. The example below translates VLAN 6 on the
        [X-ONU-SFPP] port to VLAN 3501 on the router port.

        ``` sh
        /interface ethernet switch rule
        add new-dst-ports=sfp-sfpplus3-rb5009 new-vlan-id=3501 ports=sfp-sfpplus8-x-onu-sfpp switch=switch1 vlan-id=6
        add new-dst-ports=sfp-sfpplus8-x-onu-sfpp new-vlan-id=6 ports=sfp-sfpplus3-rb5009 switch=switch1 vlan-id=3501
        ```

        The PPPoE client on the router then runs on its VLAN 3501 interface instead of VLAN 6.

        The management interface of the [X-ONU-SFPP] is untagged, so it follows the native VLAN (PVID) of its switch
        port. Either leave it on your existing native VLAN or give the port a dedicated one, then follow
        [Accessing the ONT](accessing-the-ont.md) to reach `192.168.11.1`.

!!! note "IPv6, IPTV, and VoIP are untested"
    Please share your findings on the [8311 Discord community server] if you use them.

## Register the X-ONU-SFPP with KPN

!!! info "Swap the hardware after KPN calls"
    If your router is already configured for KPN through the [XS-010X-Q], all that's left is the physical swap.
    Leave the [XS-010X-Q] connected until KPN calls to confirm the switchover; from then on it stops working, and you
    [connect the fiber](#connect-the-fiber) to the [X-ONU-SFPP].

KPN publishes its requirements for your own ONT in [Specificaties voor modem/router op Glasvezel] (PDF, Dutch). The
XGS-PON section lists the requirements the ONT must meet, including:

| Requirement     | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| Transmission    | ITU-T G.9807.1 (XGS-PON)                                     |
| Fiber interface | FTU-TK01 (SC/APC)                                            |
| OMCI            | ITU-T G.988                                                  |
| Authentication  | Serial number                                                |
| VLANs           | Internet `6`, TV `4`, telephony `7` (older Experia Box only) |
| Interface       | Slot id `1`, port id `1`                                     |

The registration form is behind a __Mijn KPN__ login.

1. From your KPN connection, open the [vrije ONT keuze] servicetool and log in with your __Mijn KPN__ account.

2. Enter the PON serial number of the [X-ONU-SFPP] exactly as printed on its label or shown in its web UI. KPN needs
   no details from the [XS-010X-Q].

3. Wait for KPN to call. They confirm the serial number and switch the connection over to the [X-ONU-SFPP] during the
   call.

??? info "The servicetool rejects the serial number or does not load"
    The servicetool only loads from a KPN connection, and community members report it working only between 08:00 and
    20:00. If it still fails, ask for help on the [KPN Community] forum.

## Connect the fiber

1. Slide the [XS-010X-Q] down and off the TK-01 base.

2. Open the green flap on the TK-01 to reach the SC/APC port and connect an SC/APC (green) patch lead between the
   TK-01 and the [X-ONU-SFPP].

If all previous steps were followed correctly, the [X-ONU-SFPP] should operate with O5.1 [PLOAM status].
For troubleshooting, please read the [Troubleshoot connectivity issues with the WAS-110 or X-ONU-SFPP] guide before
seeking help on the [8311 Discord community server].

!!! success "Congratulations"
    Keep the [XS-010X-Q]; it remains part of your KPN connection. You need it for fault investigations, when you move
    house, or to switch back, in which case KPN has to register it again.

  [PLOAM status]: troubleshoot-connectivity-issues-with-the-was-110.md#ploam-status
  [Troubleshoot connectivity issues with the WAS-110 or X-ONU-SFPP]: troubleshoot-connectivity-issues-with-the-was-110.md
  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [XS-010X-Q]: ../xgs-pon/ont/nokia/xs-010x-q.md
  [vrije ONT keuze]: https://www.kpn.com/service/servicetools/vrije-ont-keuze
  [Specificaties voor modem/router op Glasvezel]: https://assets.ctfassets.net/zuadwp3l2xby/2Yp0HtLJPKBUX5mqr3l23a/936f91d56ff916c1f8f5c81d195bcd4f/20222263_KPN_Internet_Glasvezel_Specificaties_v20230123.pdf
  [KPN Community]: https://community.kpn.com/
