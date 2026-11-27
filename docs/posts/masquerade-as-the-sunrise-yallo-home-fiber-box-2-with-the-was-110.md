---
date: 2026-09-02
categories:
  - XGS-PON
  - Home Fiber Box 2
  - WAS-110
  - yallo
  - Sunrise
  - Sagemcom
  - F5685LGB
description: Masquerade as the Sunrise/yallo Home Fiber Box 2 with the WAS-110 or X-ONU-SFPP
slug: masquerade-as-the-sunrise-yallo-home-fiber-box-2-with-the-was-110
links:
  - xgs-pon/index.md
  - posts/accessing-the-ont.md
  - posts/troubleshoot-connectivity-issues-with-the-was-110.md
ont: Home Fiber Box 2
operator: Sunrise/yallo
---

# Masquerade as the Sunrise/yallo Home Fiber Box 2 with the WAS-110 or X-ONU-SFPP

![Bypass Home Fiber Box 2]({{ page.meta.slug }}/bypass_{{ page.meta.ont | lower | replace(" ", "_") }}.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

!!! warning "New subscriber installations"
    Keep the {{ page.meta.ont }} in active service for roughly a week until fully provisioned and the installation
    ticket has been closed.

!!! info "Same hardware as the Virgin Media O2 Hub 5x"
    The {{ page.meta.ont }} is a Sagemcom __F5685LGB__, the same unit sold in the UK as the __Hub 5x__. Sunrise
    ships it under its own name and through its yallo brand. The one operator-specific difference is the mandatory
    [Registration ID](#registration-id).

???+ question "Common misconceptions and answers"

    {% include 'common/gateway-question.md' %}

    __Are the gateway MAC and IP Host MAC attribute the same?__

    :   No, they are different. The __IP Host MAC__ is hardcoded as `C4:EB:43:00:00:01`, while the gateway MAC is the
        value found on the [label] located at the bottom of the {{ page.meta.ont }}.

{% include 'vmed-ltd-hub/purchase-ont.md' %}

{% include 'vmed-ltd-hub/pre-config.md' %}

{% include 'bce-inc-hub/install-ont-fw.md' %}

## Configure ONT settings

To masquerade as the {{ page.meta.ont }}, you will need its ONT serial number and its WAN MAC address, both of which
are located on the bottom label as depicted below.

!!! tip "The PON serial number is not labelled"
    The {{ page.meta.ont }} label has no `PON S/N:` field. The PON serial is the bare
    `SMBS`&hellip; string printed on its own line directly beneath the `S/N:` value, with no field name in front of it.
    Do not confuse it with the `S/N:` above it, which begins `YCEC`&hellip; and is not what the OLT authenticates on.

![{{ page.meta.ont }} label]({{ page.meta.slug }}/{{ page.meta.ont | lower | replace(" ", "_") }}_label.webp){ class="nolightbox" id="{{ page.meta.ont | lower | replace(" ", "-") }}-label" }

Use your preferred setup method and carefully follow the steps to avoid unnecessary downtime and troubleshooting:

* [Web (luci)](#config-via-web)
* [Shell (linux)](#config-via-shell)

### Via web <small>recommended</small> { #config-via-web data-toc-label="Via web"}

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
   and, if asked, input your *root* [password]{ data-preview target="_blank" }.

2. From the __8311 Configuration__ page, on the __PON__ tab, fill in the configuration with the following values:

    !!! reminder
        <ins>Replace</ins> the :blue_circle: __PON Serial Number__ and the :red_circle: __Registration ID__ with the
        values derived from your own {{ page.meta.ont }} [label].

    | Attribute                  | Value                         | Mandatory    | Remarks                    |
    | -------------------------- | ----------------------------- | ------------ | -------------------------- |
    | PON Serial Number (ONT ID) | SMBS&hellip;                  | :check_mark: | :blue_circle: PON S/N      |
    | Equipment ID               | MERCV3X                       |              |                            |
    | Hardware Version           | 1.0                           |              |                            |
    | Sync Circuit Pack Version  | :check_mark:                  |              |                            |
    | Software Version A         | 7.8.3-2410.5                  |              | [Version listing]          |
    | Software Version B         | 7.8.3-2410.5                  |              | [Version listing]          |
    | MIB File                   | /etc/mibs/prx300_1V_bell.ini  | :check_mark: | VEIP and more              |
    | IP Host MAC Address        | C4:EB:43:00:00:01             |              | Shared hardcoded MAC       |
    | Registration ID (HEX)      | 314132423343344435453646      | :check_mark: | :red_circle: [see below][Registration ID] |

3. From the __8311 Configuration__ page, on the __ISP Fixes__ tab, disable __Fix VLANs__ from the drop-down.

    ??? tip "Identify VLANs (Optional: Sunrise/yallo uses VLAN `131` for internet)"
        Once configuration is complete and the fiber is connected, wait for successful authentication (__O5 state__).
        You can then use the [VLAN Table Analyser](../tools/vlan.md) to identify service VLANs by copying the table
        from the VLANs page (<https://192.168.11.1/cgi-bin/luci/admin/8311/vlans>) and pasting it into the tool.

4. __Save__ changes and *reboot* from the __System__ menu.

### Via shell { #config-via-shell }

1. Login over secure shell (SSH).

    ``` sh
    ssh root@192.168.11.1
    ```

2. Configure the 8311 U-Boot environment.

    !!! reminder "Highlighted lines are <ins>mandatory</ins>"
        <ins>Replace</ins> the :blue_circle: __8311_gpon_sn__ and the :red_circle: __8311_reg_id_hex__ with values
        derived from your own {{ page.meta.ont }} [label].

    ``` sh hl_lines="1 3 9 10 11"
    fwenv_set mib_file
    fwenv_set -8 iphost_mac !C4:EB:43:00:00:01 #(1)!
    fwenv_set -8 gpon_sn SMBS... # (2)!
    fwenv_set -8 equipment_id MERCV3X
    fwenv_set -8 hw_ver 1.0
    fwenv_set -8 cp_hw_ver_sync 1
    fwenv_set -8 sw_verA 7.8.3-2410.5 # (3)!
    fwenv_set -8 sw_verB 7.8.3-2410.5
    fwenv_set -8 mib_file /etc/mibs/prx300_1V_bell.ini
    fwenv_set -8 reg_id_hex 314132423343344435453646 # (4)!
    fwenv_set -8 fix_vlans 0
    ```

    1. Hardcoded MAC address used by all subscribers
    2. :blue_circle: PON S/N
    3. [Version listing]
    4. :red_circle: [Registration ID]. Your WAN MAC as uppercase ASCII, hex-encoded

3. Verify the 8311 U-boot environment and reboot.

    ``` sh
    fw_printenv | grep ^8311
    reboot
    ```

  [Version listing]: #software-versions
  [password]: ../xgs-pon/ont/bfw-solutions/was-110.md#web-credentials

## Registration ID { #registration-id }

!!! warning "PLOAM Registration ID"
    Sunrise/yallo OLTs **require** a PLOAM Registration ID. With the field empty the module stays in
    __O2, Serial number state__ even with correct optics and a correct PON serial number.

The value is your original {{ page.meta.ont }}'s __WAN MAC address, as an UPPERCASE ASCII string__, not as raw
MAC bytes. This is the same MAC you clone onto your gateway's WAN interface in [Pre-configuration](#pre-configuration),.

Example for a WAN MAC of `1A:2B:3C:4D:5E:6F`:

| Step | Value |
| ---- | ----- |
| WAN MAC from the label | `1A:2B:3C:4D:5E:6F` |
| As an uppercase string, colons removed | `1A2B3C4D5E6F` |
| Hex-encoded (this is what you enter) | `314132423343344435453646` |

``` sh
printf '%s' "1A2B3C4D5E6F" | xxd -p
# 314132423343344435453646
```

Confirm the value took after rebooting. `pon rig` reports the registration ID as decimal byte values, which
should decode back to your MAC string:

``` sh
pon rig
# reg_id = "49 65 50 66 51 67 52 68 53 69 54 70 0 0 ..."   # = "1A2B3C4D5E6F"
```

??? info "Confirming you are in this failure case"
    With an empty or wrong Registration ID, the downstream PLOAM counters show the OLT repeatedly ranging you and then
    kicking you off:

    ``` sh
    pon pdcg
    # assign_onu_id=N   ranging_time=N   req_reg=N   deact_onu=N   disable_ser_no=0
    ```

    `req_reg` is the OLT asking for the registration ID and `deact_onu` is it deactivating you for the wrong answer.
    `disable_ser_no=0` proves this is **not** a duplicate-serial problem.

{% include 'vmed-ltd-hub/verify-ont.md' %}

## Router tips

!!! Note "Detailed router setup falls outside the scope of the documentation due to the multitude of available solutions."

* Apply the [pre-configuration](#pre-configuration) requirements, including the WAN MAC clone.
* Configure the WAN VLAN to `131`.
* Configure the WAN for DHCP mode.

??? info "Other VLANs seen on the Sunrise/yallo OMCI VLAN table"
    | VLAN  | Role                                          |
    | ----- | --------------------------------------------- |
    | `131` | Internet (data), tag your WAN here            |
    | `121` | Operator management (TR-069/ACS plane)         |
    | `117` | Voice (VoIP/SIP)                               |

{% include 'bce-inc-hub/switch-tips.md' %}

## Software versions

The {{ page.meta.ont }} uses CWMP instead of OMCI for firmware updates. While the OLT rarely requires approval for
specific software versions, keeping the [WAS-110] or [X-ONU-SFPP] up-to-date is beneficial but not strictly necessary.

If you would like to help us maintain the software listing, you can contribute new versions via the
[8311 Discord community server] or by submitting a [Pull Request](https://github.com/up-n-atom/8311/pulls) on GitHub.

| Software Version |
| ---------------- |
| 7.8.3-2410.5     |
| 4.11.1-2309.6    |

## Credits

The Registration ID derivation for Sunrise/yallo was originally documented by [smma.ch](https://smma.ch/).

  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [Registration ID]: #registration-id
  [label]: #home-fiber-box-2-label
