---
date: 2026-05-12
categories:
  - XGS-PON
  - Arcadyan Technology
  - PB6802B-LG
  - WAS-110
  - Virgin Media
  - GiffGaff
  - Nexfibre
description: Swap out the Arcadyan PB6802B-LG for a Small Form-factor Pluggable WAS-110 or X-ONU-SFPP
slug: swap-out-the-arcadyan-pb6802b-lg-for-a-small-form-factor-pluggable-was-110
links:
  - xgs-pon/index.md
  - posts/accessing-the-ont.md
  - posts/troubleshoot-connectivity-issues-with-the-was-110.md
ont: Arcadyan PB6802B-LG
---

# Swap out the Arcadyan PB6802B-LG for a Small Form-factor Pluggable WAS-110 or X-ONU-SFPP

!!! abstract "This is strictly for the form-factor as they're all SFU (bridge-only) ONTs"

![Swap Arcadyan PB6802B-LG](swap-out-the-arcadyan-pb6802b-lg-for-a-small-form-factor-pluggable-was-110/swap_pb6802b-lg.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

!!! warning "New subscriber installations"
    Keep the {{ page.meta.ont }} in active service for roughly a week until fully provisioned and the installation
    ticket has been closed.


???+ question "Common misconceptions and answers"

    {% include 'common/gateway-question.md' %}

{% include 'vmed-ltd-hub/purchase-ont.md' %}


## Pre-configuration

Before beginning the ONT configuration, ensure you have addressed the following networking requirements to enable
successful communication with the PON.


### LCT Access Route

To install, upgrade, and configure the ONT, your gateway must be able to reach its Local Craft Terminal (LCT) interface.
__Follow the [Accessing the ONT] guide to set up the proper network routing between your gateway and the ONT management plane.__

  [Accessing the ONT]: accessing-the-ont.md

{% include 'bce-inc-hub/install-ont-fw.md' %}


## Configure ONT settings

To masquerade as the {{ page.meta.ont }}, you will need its ONT serial number, which is located on the bottom label as
depicted below.

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
        <ins>Replace</ins> the :blue_circle: __PON Serial Number__ with the one found on the {{ page.meta.ont }} [label].

    | Attribute                        | Value                           | Mandatory    | Remarks                         |
    | -------------------------------- | ------------------------------- | ------------ | ------------------------------- |
    | PON Serial Number (ONT ID)       | ARLG&hellip;                    | :check_mark: | :blue_circle: PON S/N           |
    | Equipment ID                     | PB6802B-LG                      | :check_mark: |                                 |
    | Hardware Version                 | PB6802B-LG                      | :check_mark: |                                 |
    | Software Version A               | 3.1.6_prod                      | :check_mark: | [Version listing]               |
    | Software Version B               | 3.1.6_prod                      |              | [Version listing]               |
    | MIB File                         | /etc/mibs/prx300_1V.ini         | :check_mark: | VEIP                            |
    | Override active firmware bank    | A                               | :check_mark: | OLT inits a reboot if on bank B |
    | Override committed firmware bank | A                               | :check_mark: | OLT inits a reboot if on bank B |
    | Firmware Version Match           | `([0-9]+\.[0-9]+\.[0-9]+_prod)` |              |                                 |

3. From the __8311 Configuration__ page, on the __ISP Fixes__ tab, enable __Fix VLANs__ from the drop-down and set the internet VLAN to `911`.

4. __Save__ changes and *reboot* from the __System__ menu.


### Via shell { #config-via-shell }

1. Login over secure shell (SSH).

    ``` sh
    ssh root@192.168.11.1
    ```

2. Configure the 8311 U-Boot environment.

    !!! reminder "Highlighted lines are <ins>mandatory</ins>"
        <ins>Replace</ins> the :blue_circle: __8311_gpon_sn__ with the __PON S/N__ found on the {{ page.meta.ont }} [label].

    ``` sh hl_lines="1 2 3 4 5 6 7 8 10"
    fwenv_set -8 equipment_id=PB6802B-LG
    fwenv_set -8 hw_ver=PB6802B-LG
    fwenv_set -8 override_active=A
    fwenv_set -8 override_commit=A
    fwenv_set -8 gpon_sn=ARLG... # (1)!
    fwenv_set -8 mib_file=/etc/mibs/prx300_1V.ini
    fwenv_set -8 fix_vlans=1
    fwenv_set -8 internet_vlan=911
    fwenv_set -8 fw_match_b64=KFswLTldK1wuWzAtOV0rXC5bMC05XStfcHJvZCk=
    fwenv_set -8 sw_verA=3.1.6_prod # (2)!
    fwenv_set -8 sw_verB=3.1.6_prod
    ```

    1. :blue_circle: PON S/N
    2. [Version listing]

3. Verify the 8311 U-boot environment and reboot.

    ``` sh
    fw_printenv | grep ^8311
    reboot
    ```

  [Version listing]: #software-versions
  [password]: ../xgs-pon/ont/bfw-solutions/was-110.md#web-credentials
  [label]: #{{ page.meta.ont | lower | replace(" ", "-") }}-label

{% include 'vmed-ltd-hub/verify-ont.md' %}


## Router tips

!!! Note "Detailed router setup falls outside the scope of the documentation due to the multitude of available solutions."

* Apply the [pre-configuration](#pre-configuration) requirements.
* Configure the WAN VLAN to `911`.
* Configure the WAN for DHCP mode.

{% include 'bce-inc-hub/switch-tips.md' %}

## Software versions

The {{ page.meta.ont }} uses CWMP instead of OMCI for firmware updates. While the OLT rarely requires approval for
specific software versions, keeping the [WAS-110] or [X-ONU-SFPP] up-to-date is beneficial but not strictly necessary.

If you would like to help us maintain the software listing, you can contribute new versions via the
[8311 Discord community server] or by submitting a [Pull Request](https://github.com/up-n-atom/8311/pulls) on GitHub.

| Software Version |
| ---------------- |
| 3.1.6_prod       |
| 3.1.1_prod       |

  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [label]: #arcadyan-pb6802b-lg-label
  [Version listing]: #software-versions
