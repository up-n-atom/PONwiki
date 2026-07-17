---
date: 2024-05-02
categories:
  - XGS-PON
  - FOX222
  - FRX523
  - WAS-110
  - Frontier
  - CIG
  - XG-99RG2
  - XG-99M
description: Masquerade as the Frontier Communications Inc. FOX222 or FRX523 with the WAS-110
slug: masquerade-as-the-frontier-comms-inc-fox222-frx523-with-the-was-110
---

# Masquerade as the Frontier Communications Inc. FOX222 or FRX523 with the WAS-110

![Bypass family](masquerade-as-the-frontier-comms-inc-fox222-frx523-with-the-bfw-solutions-was-110/bypass_fox222_frx523.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

!!! warning "MoCA"
    The FRX523 must be provisioned by Frontier to use the 10 GbE LAN port. The [WAS-110] will not successfully operate
    in masquerade mode if the FRX523 is provisioned to use the MoCA LAN port.

## Purchase a WAS-110

!!! note
    The [WAS-110] is __NOT__ a substitute for a layer 7 router; It is an *ONT*, and its __ONLY__ function is to convert
    *Ethernet* to *PON* over fiber medium. Additional hardware and software are required to access the Internet.

The [WAS-110] is available from select [resellers]{ data-preview } worldwide.

 [resellers]: https://pon.wiki/xgs-pon/ont/bfw-solutions/was-110/#value-added-resellers

## Install community firmware

As a prerequisite to masquerading with the [WAS-110], the community firmware is necessary; follow the steps
outlined in the community firmware installation guide: [Install the 8311 community firmware on the WAS-110].

  [Install the 8311 community firmware on the WAS-110]: install-the-8311-community-firmware-on-the-was-110.md

## WAS-110 masquerade setup

To successfully masquerade on XGS-PON, the original ONT serial number is mandatory. It, along with other key
identifiers are available on the back label of the FOX222 or FRX523, color-coordinated in the following depiction:

<div id="fox222-frx523-label"></div>

=== "FOX222"

    ![FOX222 label](masquerade-as-the-frontier-comms-inc-fox222-frx523-with-the-bfw-solutions-was-110/fox222_label.webp){ class="nolightbox" }

=== "FRX523"

    ![FRX523 label](masquerade-as-the-frontier-comms-inc-fox222-frx523-with-the-bfw-solutions-was-110/frx523_label.webp){ class="nolightbox" }

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

![WAS-110 8311 reboot](shared-assets/was_110_luci_reboot.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to
   <https://192.168.11.1/cgi-bin/luci/admin/8311/config>
   and, if asked, input your <em>root</em> password.

2. From the __8311 Configuration__ page, on the __PON__ tab, fill in the configuration with the following values:

    !!! reminder
        <ins>Replace</ins> the :blue_circle: __PON Serial Number__ with the provisioned value on the bottom [label] of
        the FOX222 or FRX523.

    !!! info "All attributes below are <ins>mandatory</ins> to achieve O5 operation state"

    === "FOX222"

        | Attribute                        | Value                   | Remarks                         |
        | -------------------------------- | ----------------------- | ------------------------------- |
        | PON Serial Number (ONT ID)       | FTRO&hellip;            | :blue_circle: S/N on label      |
        | Equipment ID                     | FOX222                  |                                 |
        | Hardware Version                 | FOX222                  |                                 |
        | Sync Circuit Pack Version        | :check_mark:            |                                 |
        | Software Version A               | R4.4.08.030             | [Version listing] <small>listing maybe dated</small> |
        | Software Version B               | R4.4.08.030             | [Version listing] <small>listing maybe dated</small> |
        | Firmware Version Match           | ^(R\d+(?:\\.\d+){3})$   | Community FW v2.5.0+            |
        | Override active firmware bank    | A                       | OLT inits a reboot if on bank B |
        | Override committed firmware bank | A                       | OLT inits a reboot if on bank B |
        | Registration ID (HEX)            | 44454641554c54          | `DEFAULT` in hex                |
        | MIB File                         | /etc/mibs/prx300_1U.ini | PPTP i.e. default value         |
        | Pon Slot                         | 10                      |                                 |

    === "FRX523"

        | Attribute                        | Value                   | Remarks                               |
        | -------------------------------- | ----------------------- | ------------------------------------- |
        | PON Serial Number (ONT ID)       | FTRO&hellip;            | :blue_circle: S/N on label            |
        | Equipment ID                     | FRX523                  |                                       |
        | Hardware Version                 | FRX523                  |                                       |
        | Sync Circuit Pack Version        | :check_mark:            |                                       |
        | Software Version A               | R4.4.13.067             | [Version listing] <small>listing maybe dated</small> |
        | Software Version B               | R4.4.13.067             | [Version listing] <small>listing maybe dated</small> |
        | Firmware Version Match           | ^(R\d+(?:\\.\d+){3})$   | Community FW v2.5.0+                  |
        | Override active firmware bank    | A                       | OLT inits a reboot if on bank B       |
        | Override committed firmware bank | A                       | OLT inits a reboot if on bank B       |
        | Registration ID (HEX)            | 44454641554c54          | `DEFAULT` in hex                      |
        | MIB File                         | /etc/mibs/prx300_1U.ini | PPTP i.e. default value               |
        | Pon Slot                         | 10                      |                                       |

    !!! note "FRX523v2 Software Versions"
        Some users have reported that they are stuck in the O5.1 "fake" state. While some have had success using the downgraded
        version `R4.4.13.067`, others have not. Your mileage may vary.

    !!! note "Registration ID fallback"
        Some OLTs reject the `DEFAULT` Registration ID and the ONT will reach O5.1 but fail to authenticate (no OMCI MIB
        upload, no T-CONTs or GEM ports provisioned). If this occurs, clear the Registration ID.

        ``` sh
        fwenv_set -8 reg_id_hex
        ```

3. __Save__ changes and *reboot* from the __System__ menu.

### from the shell

1. Login over secure shell (SSH).

    ``` sh
    ssh root@192.168.11.1
    ```

2. Configure the 8311 U-Boot environment.

    !!! reminder
        <ins>Replace</ins> the :blue_circle: __8311_gpon_sn__ with the provisioned value on the bottom [label] of the
        FOX222 or FRX523.

    !!! info "All attributes below are <ins>mandatory</ins> to achieve O5 operation state"

    === "FOX222"

        ``` sh
        fwenv_set -8 gpon_sn FTRO... # (1)!
        fwenv_set -8 equipment_id FOX222
        fwenv_set -8 hw_ver FOX222
        fwenv_set -8 cp_hw_ver_sync 1
        fwenv_set -8 sw_verA R4.4.08.030 # (2)!
        fwenv_set -8 sw_verB R4.4.08.030
        fwenv_set -8 -b fw_match '^(R\d+(?:\.\d+){3})$'
        fwenv_set -8 override_active A
        fwenv_set -8 override_commit A
        fwenv_set -8 pon_slot 10
        fwenv_set -8 reg_id_hex 44454641554c54
        ```

        1. :blue_circle: S/N
        2. [Version listing]

    === "FRX523"

        ``` sh
        fwenv_set -8 gpon_sn FTRO... # (1)!
        fwenv_set -8 equipment_id FRX523
        fwenv_set -8 hw_ver FRX523
        fwenv_set -8 cp_hw_ver_sync 1
        fwenv_set -8 sw_verA R4.4.13.067 # (2)!
        fwenv_set -8 sw_verB R4.4.13.067
        fwenv_set -b 8311_fw_match '^(R\d+(?:\.\d+){3})$'
        fwenv_set -8 override_active A
        fwenv_set -8 override_commit A
        fwenv_set -8 pon_slot 10
        fwenv_set -8 reg_id_hex 44454641554c54
        ```

        1. :blue_circle: S/N
        2. [Version listing]

    !!! note "Registration ID fallback"
        Some OLTs reject the `DEFAULT` Registration ID and the ONT will reach O5.1 but fail to authenticate (no OMCI MIB
        upload, no T-CONTs or GEM ports provisioned). If this occurs, try an all-zeros Registration ID instead — 22 bytes
        of `0x00`:

        ``` sh
        fwenv_set -8 reg_id_hex 00000000000000000000000000000000000000000000
        ```

        Note that `ONU Authentication Status` may continue to display as `0` even when authentication succeeds; verify by
        actual throughput rather than the status field.

3. Verify the 8311 U-boot environment and reboot.

    ``` sh
    fw_printenv | grep ^8311
    reboot
    ```

After rebooting the WAS-110, safely remove the SC/APC cable from either the FOX222 or FRX523 and connect it to the
WAS-110. If all previous steps were followed correctly, the WAS-110 should operate with O5.1 [PLOAM status].
For troubleshooting, please read the [Troubleshoot connectivity issues with the WAS-110] guide before seeking help on
the [8311 Discord community server].

  [PLOAM status]: troubleshoot-connectivity-issues-with-the-was-110.md#ploam-status
  [Troubleshoot connectivity issues with the WAS-110]: troubleshoot-connectivity-issues-with-the-was-110.md

!!! note "The WAS-110 may reboot after a FOX222 or FRX523 firmware upgrade is pushed over OMCI"
    The [software version](#software-versions) will also automatically update and keep in sync to maintain its OLT
    status.

## Software versions

!!! info "Automatic software version updates since 8311 community firmware version(s) 2.5.0+"
    Firmware upgrades sent over OMCI will be compared against the __Firmware Version Match__ pattern and automatically
    update the __Software Version A/B__ attributes if there is a match.

    Firmware images are stored in `/tmp/firmware.img` if further analysis is required.

The software version is used as a provisioning attribute by the OLT and must be kept up-to-date with the latest
version. Otherwise, upon a reboot, the WAS-110 will operate in a fake O5 state until corrected.

=== "FOX222"

    | Software Version |
    | ---------------- |
    | R4.4.08.030      |
    | R4.4.08.025      |

=== "FRX523"

    | Software Version |
    | ---------------- |
    | R4.4.37.019      |
    | R4.4.13.067      |
    | R4.4.13.064      |
    | R4.4.13.061      |
    | R4.4.13.057      |
    | R4.4.13.051      |
    | R4.4.13.041      |

Please help us by contributing new versions via the [8311 Discord community server] or submitting a
[Pull Request](https://github.com/up-n-atom/8311/pulls) on GitHub.

??? info "Serial access"
    The version can be extracted by means of the internal TTL UART header and a 3.3V USB to TTL UART adapter.

    <h4>Serial pinout</h4>

    | Pin | IO |
    | --- | -- |
    | 2   | Rx |
    | 4   | Tx |

    <h4>Serial setup</h4>

    |           | Value |
    | --------- | ----- |
    | Speed     | 15200 |
    | Parity    | None  |
    | Data-bits | 8     |
    | Stop-bits | 1     |

    <h4>Shell commands</h4>

    ``` sh
    enable
    ontver
    ```

  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [label]: #fox222-frx523-label
  [Version listing]: #software-versions
  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420

[^1]: <https://github.com/djGrrr/8311-was-110-firmware-builder>
