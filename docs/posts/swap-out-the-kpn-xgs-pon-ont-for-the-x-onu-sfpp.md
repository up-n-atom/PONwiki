---
date: 2026-09-26
categories:
  - XGS-PON
  - X-ONU-SFPP
  - XS-010X-Q
  - Nokia
  - KPN
description: Swap out the KPN XGS-PON ONT for the X-ONU-SFPP
slug: swap-out-the-kpn-xgs-pon-ont-for-the-x-onu-sfpp
links:
  - xgs-pon/index.md
  - posts/accessing-the-ont.md
  - posts/troubleshoot-connectivity-issues-with-the-was-110.md
---

# Swap out the KPN XGS-PON ONT for the X-ONU-SFPP

!!! abstract "No masquerading required; KPN registers the serial number of your own ONT"

![Swap KPN ONT](swap-out-the-kpn-xgs-pon-ont-for-the-x-onu-sfpp/swap_kpn_ont.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

KPN offers *vrije ONT keuze* (free ONT choice) on its XGS-PON network. You register the serial number of the
[X-ONU-SFPP] with KPN, and KPN switches the connection over to it. Nothing is copied from KPN's ONT, so the steps are
the same whichever ONT KPN installed, such as the Nokia [XS-010X-Q] or the older Genexis unit. The [XS-010X-Q] doesn't
give you access to its web UI anyway.

!!! warning "XGS-PON only"
    KPN does not offer free ONT choice on GPON or AON connections. Check your connection type in the servicetool
    linked from KPN's [own equipment page][Eigen apparatuur]; KPN converts a GPON connection to XGS-PON free of charge
    on request.

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
`BIDB1A2B3C4D`. Some resellers print it on the label of the [X-ONU-SFPP].

If it isn't on the label, or to confirm it, read it from the web UI:

1. Plug the [X-ONU-SFPP] into your router or switch and [access the ONT](accessing-the-ont.md).

2. Within a web browser, navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/config> and, if asked, input your
   *root* password.

3. From the __8311 Configuration__ page, on the __PON__ tab, note the __PON Serial Number (ONT ID)__.

!!! danger "Leave the PON tab at its defaults"
    KPN authorizes the [X-ONU-SFPP] by its own serial number, so there is nothing to copy from KPN's ONT. Do not change
    the serial number after registering it with KPN.

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

KPN delivers Internet over PPPoE on VLAN 6. Configure the WAN of your router with the following values:

| Setting             | Value                                   |
| ------------------- | --------------------------------------- |
| VLAN                | 6 (802.1Q tagged)                       |
| Protocol            | PPPoE with PAP authentication           |
| Username / password | Any value, e.g. `internet` / `internet` |

!!! note "IPv6, IPTV, and VoIP are untested"
    KPN's specification lists IPv6 via DHCPv6-PD over PPPoE and IPTV on VLAN 4. Please share your findings on the
    [8311 Discord community server] if you use them.

## Register the X-ONU-SFPP with KPN

!!! info "Swap the hardware after KPN calls"
    If your router is already configured for KPN through KPN's ONT, all that's left is the physical swap. Leave KPN's
    ONT connected until KPN calls to confirm the switchover; from then on it stops working, and you
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
   no details from its own ONT.

3. Wait for KPN to call. They confirm the serial number and switch the connection over to the [X-ONU-SFPP] during the
   call.

??? info "The servicetool rejects the serial number or does not load"
    The servicetool only loads from a KPN connection, and community members report it working only between 08:00 and
    20:00. If it still fails, ask for help on the [KPN Community] forum.

## Connect the fiber

1. Slide KPN's ONT down and off the TK-01 base.

2. Open the green flap on the TK-01 to reach the SC/APC port and connect an SC/APC (green) patch lead between the
   TK-01 and the [X-ONU-SFPP].

If all previous steps were followed correctly, the [X-ONU-SFPP] should operate with O5.1 [PLOAM status].
For troubleshooting, please read the [Troubleshoot connectivity issues with the WAS-110 or X-ONU-SFPP] guide before
seeking help on the [8311 Discord community server].

!!! success "Congratulations"
    Keep KPN's ONT; it remains part of your KPN connection. You need it for fault investigations, when you move house,
    or to switch back, in which case KPN has to register it again.

  [PLOAM status]: troubleshoot-connectivity-issues-with-the-was-110.md#ploam-status
  [Troubleshoot connectivity issues with the WAS-110 or X-ONU-SFPP]: troubleshoot-connectivity-issues-with-the-was-110.md
  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [XS-010X-Q]: ../xgs-pon/ont/nokia/xs-010x-q.md
  [Eigen apparatuur]: https://www.kpn.com/service/eigen-apparatuur
  [vrije ONT keuze]: https://www.kpn.com/service/servicetools/vrije-ont-keuze
  [Specificaties voor modem/router op Glasvezel]: https://assets.ctfassets.net/zuadwp3l2xby/2Yp0HtLJPKBUX5mqr3l23a/936f91d56ff916c1f8f5c81d195bcd4f/20222263_KPN_Internet_Glasvezel_Specificaties_v20230123.pdf
  [KPN Community]: https://community.kpn.com/
