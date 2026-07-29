---
date: 2024-11-12
categories:
  - XGS-PON
  - BBox
  - WAS-110
  - Bouygues S.A.
  - Sagemcom
  - FAST 5688b
description: Masquerade as the Bouygues S.A. BBox with the WAS-110 or X-ONU-SFPP
slug: masquerade-as-the-bouygues-sa-bbox-with-the-was-110
---

# Masquerade as the Bouygues S.A Bbox with the WAS-110 or X-ONU-SFPP

![Bypass baguette](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bypass_bbox.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

## Determine if you're an XGS-PON subscriber

!!! info "[Debit+] option"
    To subscribe to XGS-PON, you must enable and/or purchase the [Debit+] option, which is necessary to receive the
    Bbox Ultym along with an XGS-PON SFP+ transceiver.

    [Debit+]: https://www.assistance.bouyguestelecom.fr/s/article/option-debit-plus

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![Bbox Login](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_login.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![Bbox Main](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_main.webp){ loading=lazy }

</div>

<div class="swiper-slide" step="4" markdown>

![Bbox Fiber](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_fiber.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to <https://mabbox.bytel.fr/> or <https://192.168.1.254> and, if asked, input your
   Administrator password and click the __Connect__ button.

2. From the __Main__ page, click on the __:material-cog: Administration interface__ to revert to the old interface.

3. From the __Administration__ page, click on the __Fiber__ section inside the __Internet__ panel on the left-hand side.

4. From the __Fiber__ page, verify that the __PON Mode__ is XGS-PON.

    !!! tip "Take note of the Serial Number beginning with *SMBS* and Software Versions for the WAS-110 configuration"

## Extract required attributes

### PON serial number

#### with the web UI

!!! failure "The __PON Serial Number__ has been removed from the __Fiber__ status page to thwart masquerading."

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![Bbox Login](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_login.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![Bbox Main](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_main.webp){ loading=lazy }

</div>

<div class="swiper-slide" step="4" markdown>

![Bbox Fiber](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_fiber.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to <https://mabbox.bytel.fr/> or <https://192.168.1.254> and, if asked, input your
   Administrator password and click the __Connect__ button.

2. From the __Main__ page, click on the __:material-cog: Administration interface__ to revert to the old interface.

3. From the __Administration__ page, click on the __Fiber__ section inside the __Internet__ panel on the left-hand side.

4. From the __Fiber__ page, copy the __Serial Number__ beginning with `SMBS`.

#### with the web API

1. Within a web browser, navigate to <https://mabbox.bytel.fr/api/v1/wan/sfp> or <https://mabbox.bytel.fr/api/v1/wan/sff>, whichever works.

2. From the JSON output, search and copy the __Serial Number__ beginning with `SMBS` or `0x534d4253`. If the
   __Serial Number__ begins with the hexadecimal notation copy the characters after `0x534d4253` and append to `SMBS`
   or use the form below.
  <div style="margin:1em 0;">
      <form onsubmit="(function(e){e.preventDefault();var f=e.currentTarget,el=f.elements.serno;if(!el.checkValidity())return;el.value=el.value.replace('0x534d4253','SMBS');})(event)">
          <input type="text" name="serno" placeholder="0x534d4253" pattern="^0x[0-9A-Fa-f]{16}$" />
          <input type="submit" value="Submit" />
      </form>
  </div>

The above steps can be summarized into a single-line terminal command:

=== ":material-microsoft: Windows"


    ``` sh
    (Invoke-RestMethod -Uri "https://mabbox.bytel.fr/api/v1/wan/sff").wan.serial_number -replace "0x534d4253", "SMBS"
    ```

=== ":simple-apple: macOS"

    ``` sh
    curl -s https://mabbox.bytel.fr/api/v1/wan/sff | plutil -extract 0.wan.serial_number raw - | sed 's/0x534d4253/SMBS/'
    ```

=== ":simple-linux: Linux"

    ``` sh
    curl -s https://mabbox.bytel.fr/api/v1/wan/sff | jq -r '.[] | select(.wan.serial_number != null) | .wan.serial_number | sub("0x534d4253"; "SMBS")'
    ```

### PLOAM registration ID

The registration ID is composed of a seventy-two (72) octets from the fifteen (15) octet IMEI prefixed with five (5)
0's and suffixed with fifty-two (52) 1's.

<div>
  <form onsubmit="(function(e){e.preventDefault();var f=e.currentTarget,el=f.elements.imei;if(!el.checkValidity())return;document.querySelector('#regid').textContent='0'.repeat(5)+el.value+'1'.repeat(52);location.assign(`${location.origin}${location.pathname}#ploam-registration-id`);})(event)">
    <input type="text" id="imei" placeholder="IMEI" pattern="^[0-9A-Fa-f]{15}$" />
    <input type="submit" value="Submit" />
  </form>
</div>
<div class="highlight">
  <pre><code id="regid">00000XXXXXXXXXXXXXXX1111111111111111111111111111111111111111111111111111</code></pre>
</div>

The IMEI can be obtained from the back label of the Bbox or from the web UI.

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![Bbox Login](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_login.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![Bbox Main](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_main.webp){ loading=lazy }

</div>

<div class="swiper-slide" step="4" markdown>

![Bbox](masquerade-as-the-bouygues-sa-bbox-on-xgs-pon-with-the-bfw-solutions-was-110/bbox_bbox.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to <https://mabbox.bytel.fr/> or <https://192.168.1.254> and, if asked, input your
   Administrator password and click the __Connect__ button.

2. From the __Main__ page, click on the __:material-cog: Administration interface__ to revert to the old interface.

3. From the __Administration__ page, click on the __Model__ section inside the __Bbox__ panel on the right-hand side.

4. From the __Bbox__ page, copy the __IMEI__ number.

## Purchase a WAS-110 or X-ONU-SFPP

The [WAS-110] and [X-ONU-SFPP] are available from select resellers worldwide. To streamline the process, some resellers
are pre-flashing the 8311 community firmware and highly recommended for the [X-ONU-SFPP]. Purchase at your discretion;
we take no responsibility or liability for the listed resellers.

[WAS-110 Value-Added Resellers](../xgs-pon/ont/bfw-solutions/was-110.md#value-added-resellers)

[X-ONU-SFPP Value-Added Resellers](../xgs-pon/ont/potron-technology/x-onu-sfpp.md#value-added-resellers)

???+ question "Common misconceptions and answers"

    {% include 'common/gpon-question.md' %}

    {% include 'common/gateway-question.md' %}

## Install the 8311 community firmware

As a prerequisite to masquerading as the Bbox, the 8311 community firmware is recommended and required for the remainder
of this guide. If you purchased a pre-flashed [WAS-110] or [X-ONU-SFPP], skip past to the [masquerade setup](#masquerade-setup).

=== "WAS-110"

    There are two methods to install the 8311 community firmware onto the [WAS-110], outlined in the following guides:

    __Method 1: <small>recommended</small></h4>__

    :    [Install the 8311 community firmware on the WAS-110](install-the-8311-community-firmware-on-the-was-110.md)

    __Method 2:__

    :    [WAS-110 multicast upgrade and community firmware recovery](was-110-multicast-upgrade-and-community-firmware-recovery.md)

=== "X-ONU-SFPP"

    The [X-ONU-SFPP] 8311 community firmware installation requires a two-step process and is more prone to failure and
    bricking.

    !!! warning "This process is not thoroughly documented and can lead to a bricked device"

    __Step 1: Install the Azores bootloader__

    :    Skip past to the solution in the following [issue tracker](../xgs-pon/ont/potron-technology/8311-uboot.md#solution)
         on how to install the Azores bootloader.

    __Step 2: Multicast upgrade__

    :    Follow through the [WAS-110 multicast upgrade and community firmware recovery](was-110-multicast-upgrade-and-community-firmware-recovery.md)

## Masquerade setup

### from the web UI <small>recommended</small> { #from-the-web-ui data-toc-label="from the web UI"}

??? info "As of version 2.4.0 `https://` is supported and enabled by default"
    All `http://` URLs will redirect to `https://` unless the `8311_https_redirect` environment variable is set to
    0 or false.

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![WAS-110 login](shared-assets/was_110_luci_login.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![WAS-110 8311 configuration](shared-assets/was_110_luci_config.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![WAS-110 8311 configuration ISP fixes](shared-assets/was_110_luci_config_fixes.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![WAS-110 8311 reboot](shared-assets/was_110_luci_reboot.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to
   <https://192.168.11.1/cgi-bin/luci/admin/8311/config>
   and, if asked, input your <em>root</em> password.

2. From the __8311 Configuration__ page, on the __PON__ tab, fill in the configuration with the following values:

    !!! info "All attributes below are mandatory to achieve O5 operation state"

    | Attribute                  | Value                        | Remarks                          |
    | -------------------------- | ---------------------------- | -------------------------------- |
    | PON Serial Number (ONT ID) | SMBS...                      | [PON serial number]              |
    | Equipment ID               | F@st 5688b                   | Note the space                   |
    | Hardware Version           | F@st5688b                    |                                  |
    | Sync Circuit Pack Version  | :check_mark:                 |                                  |
    | Registration ID            | 00000...                     | [PLOAM registration ID]          |
    | MIB File                   | /etc/mibs/prx300_1U.ini      |                                  |

    [PON serial number]: #pon-serial-number
    [PLOAM registration ID]: #ploam-registration-id

3. From the __8311 Configuration__ page, on the __ISP Fixes__ tab, disable __Fix VLANs__ from the drop-down.

    !!! tip "Identify VLANs"
        Once configuration is complete and the fiber is connected, wait for successful authentication (__O5 state__).
        You can then use the [VLAN Table Analyser](../tools/vlan.md) to identify service VLANs by copying the table
        from the VLANs page (<https://192.168.11.1/cgi-bin/luci/admin/8311/vlans>) and pasting it into the tool.

4. __Save__ changes and *reboot* from the __System__ menu.

### from the shell

1. Login over secure shell (SSH).

    ``` sh
    ssh root@192.168.11.1
    ```

2. Configure the 8311 U-Boot environment.

    !!! info "All attributes below are mandatory to achieve O5 operation state"

    ``` sh
    fwenv_set -8 gpon_sn SMBS... # (1)!
    fwenv_set -8 equipment_id "F@st 5688b"
    fwenv_set -8 hw_ver F@st5688b
    fwenv_set -8 cp_hw_ver_sync 1
    fwenv_set -8 reg_id_hex 00000... # (2)!
    fwenv_set -8 fix_vlans 0
    ```

    1. [PON serial number]
    2. [PLOAM registration ID]

    !!! info "Additional details and variables are described at the original repository [^1]"
        `/usr/sbin/fwenv_set` is a helper script that executes `/usr/sbin/fw_setenv` twice consecutively.

        The WAS-110 functions as an A/B system, requiring the U-Boot environment variables to be set twice, once for each
        environment.

        The `-8` option prefixes the U-Boot environment variable with `8311_`.

3. Verify the 8311 U-boot environment and reboot.

    ``` sh
    fw_printenv | grep ^8311
    reboot
    ```

After rebooting the WAS-110, safely remove the SC/APC cable from the Bbox and connect it to the
WAS-110. If all previous steps were followed correctly, the WAS-110 should operate with O5.1 [PLOAM status].
For troubleshooting, please read the [Troubleshoot connectivity issues with the WAS-110] guide before seeking help on
the [8311 Discord community server].

  [PLOAM status]: troubleshoot-connectivity-issues-with-the-was-110.md#ploam-status
  [Troubleshoot connectivity issues with the WAS-110]: troubleshoot-connectivity-issues-with-the-was-110.md
  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420

!!! note "Tag the router's DHCP WAN interface and/or anything in-between the WAS-110 with VLAN 100"

Finally, continue with your bypass by consulting the [routing guide(s)](#routing-guides).

## Routing guides

* [LaFibre - Bouygues Telecom Remplacer la Bbox par un routeur](https://lafibre.info/remplacer-bbox/)

  [Purchase a WAS-110]: #purchase-a-was-110
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md

[^1]: <https://github.com/djGrrr/8311-was-110-firmware-builder>
