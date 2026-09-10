---
date: 2026-09-05
categories:
  - XGS-PON
  - XS-220X-A
  - WAS-110
  - Nokia
  - X-ONU-SFPP
  - TDS Telecom
description: Masquerade as the Nokia XS-220X-A with the WAS-110 or X-ONU-SFPP
slug: masquerade-as-the-nokia-xs-220x-a-with-the-was-110
---

# Masquerade as the Nokia XS-220X-A with the WAS-110 or X-ONU-SFPP

<!-- more -->
<!-- nocont -->

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

As a prerequisite to masquerading as the XS-220X-A, the 8311 community firmware is recommended and required for the
remainder of this guide. If you purchased a pre-flashed [WAS-110] or [X-ONU-SFPP], skip past to the [masquerade setup](#masquerade-setup).

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

!!! info "This guide was verified on 8311 community firmware v2.8.3"
    Any recent 8311 release exposes the __Fix VLANs__ option this guide relies on. Running the latest release is
    recommended.

## Masquerade setup

Mandatory identifiers are available on the back label of the XS-220X-A, such as the ONT P/N, ICS, and CLEI code. The
CLEI code and ONT P/N are identical for every XS-220X-A; only the serial number is unique to your unit.

!!! warning "TDS Telecom: you must **enable** Fix VLANs"
    Unlike many deployments, the XS-220X-A on TDS requires __Fix VLANs__ to be __enabled__. Left disabled, the ONT
    reaches O5 and obtains a public IP over DHCP, but no traffic passes: the OLT's downstream VLAN rules strip the
    internet VLAN tag, so a tagged router WAN drops every return frame. Enabling Fix VLANs restores the tag. See
    [ISP fixes](#isp-fixes) below.

### from the web UI <small>recommended</small> { #from-the-web-ui data-toc-label="from the web UI"}

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

    !!! reminder "All attributes below are <ins>mandatory</ins> to achieve O5 operation state"
        <ins>Replace</ins> the __PON Serial Number__ with your unit's serial. MAC cloning and a Registration ID are
        not required on TDS.

    | Attribute                        | Value                     | Remarks                             |
    | -------------------------------- | ------------------------- | ----------------------------------- |
    | PON Serial Number (ONT ID)       | ALCL&hellip;              | Serial number                       |
    | Equipment ID                     | BVMN300DRAXS220XA         | CLEI + Mnemonic                     |
    | Hardware Version                 | 3TN00617AAAA              | ONT P/N + ICS                       |
    | Sync Circuit Pack Version        | :check_mark:              |                                     |
    | Software Version A               | 3TN00669AOCK59            | Seed; auto-updates via OLT          |
    | Software Version B               | 3TN00669AOCK59            | Seed; auto-updates via OLT          |
    | Firmware Version Match           | (3TN[0-9A-Z]{11})$        | Note the __3TN__ vendor prefix      |
    | Override active firmware bank    | A                         | OLT inits a reboot if on bank B     |
    | Override committed firmware bank | A                         | OLT inits a reboot if on bank B     |
    | MIB File                         | /etc/mibs/prx300_1U.ini   | PPTP i.e. default value             |
    | PON Slot                         | 10                        | internet UNI (see remarks below)    |

    !!! info "Only one Ethernet UNI"
        The XS-220X-A has both a 1GE and a 10GE port, so the OLT provisions two Ethernet UNIs (instances 257 and 2561).
        An SFP+ stick has a single physical port and can satisfy only one; the second fails to bind, which is harmless.
        Internet is carried on the slot-10 UNI, hence __PON Slot__ `10`.

3. From the __8311 Configuration__ page, on the __ISP Fixes__ tab:

    - __enable__ __Fix VLANs__ from the drop-down, and
    - set __Internet VLAN__ to your line's internet VLAN (TDS uses `474`).

    !!! tip "Identify VLANs"
        If you are unsure of your internet VLAN, first configure with Fix VLANs disabled, connect the fiber, wait for
        __O5 state__, then use the [VLAN Table Analyser](../tools/vlan.md) on the table from the VLANs page
        (<https://192.168.11.1/cgi-bin/luci/admin/8311/vlans>). Then enable Fix VLANs and set the identified VLAN.

4. __Save__ changes and *reboot* from the __System__ menu.

### from the shell

1. Login over secure shell (SSH).

    ``` sh
    ssh root@192.168.11.1
    ```

2. Configure the 8311 U-Boot environment.

    !!! reminder "All attributes below are <ins>mandatory</ins> to achieve O5 operation state"
        <ins>Replace</ins> __8311_gpon_sn__ with your unit's serial.

    ``` sh
    fwenv_set -8 gpon_sn ALCL... # (1)!
    fwenv_set -8 equipment_id BVMN300DRAXS220XA # (2)!
    fwenv_set -8 hw_ver 3TN00617AAAA # (3)!
    fwenv_set -8 cp_hw_ver_sync 1
    fwenv_set -8 sw_verA 3TN00669AOCK59
    fwenv_set -8 sw_verB 3TN00669AOCK59
    fwenv_set -8 -b fw_match '(3TN[0-9A-Z]{11})$'
    fwenv_set -8 override_active A
    fwenv_set -8 override_commit A
    fwenv_set -8 pon_slot 10
    fwenv_set -8 fix_vlans 1
    fwenv_set -8 internet_vlan 474
    ```

    1. Serial number or S/N
    2. CLEI + Mnemonic
    3. ONT P/N + ICS

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

After rebooting the WAS-110, safely remove the SC/APC cable from the XS-220X-A and connect it to the
WAS-110. If all previous steps were followed correctly, the WAS-110 should operate with O5.1 [PLOAM status].
For troubleshooting, please read the [Troubleshoot connectivity issues with the WAS-110] guide before seeking help on
the [8311 Discord community server].

## Software versions

The following are the last known supported software versions. If the __Firmware Version Match__ attribute is configured
with the correct regular expression, the __Software Version A/B__ attribute(s) will attempt to auto-update to match the
firmware version transferred by the OLT, although this isn't foolproof. Most OLT provisioning systems will attempt to
update the firmware via OMCI upon detecting a mismatch. Note that this transfer can take several minutes due to the
size of the firmware image.

| ISP         | Software Version A/B |
| ----------- | -------------------- |
| TDS Telecom | 3TN00634HJMI95       |

Please help us by contributing new versions via the [8311 Discord community server] or submitting a Pull Request.

  [PLOAM status]: troubleshoot-connectivity-issues-with-the-was-110.md#ploam-status
  [Troubleshoot connectivity issues with the WAS-110]: troubleshoot-connectivity-issues-with-the-was-110.md
  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md

[^1]: <https://github.com/djGrrr/8311-was-110-firmware-builder>
