---
date:
  created: 2025-05-12
draft: true
categories:
  - XGS-PON
  - ADTRAN
  - WAS-110
  - 8311 Firmware
  - OPNsense
  - Better Internet Store
  - YouFibre
  - Netomnia
description: Replace an ADTRAN ONT with a WAS-110 preloaded with 8311 firmware on XGS-PON
slug: replace-adtran-ont-with-was-110
---

# Replace an ADTRAN SDX ONT with the WAS-110 on XGS-PON

<!-- more -->
<!-- nocont -->

This guide outlines how to replace an **ADTRAN SDX621i** ONT on an XGS-PON line using a [WAS-110] module pre-flashed with 8311 firmware.

This has been successfully tested by a user on **Netomnia / YouFibre** in the UK, who received a static IP via DHCP using a cloned MAC.

---

## What you need

- A [WAS-110] module, pre-flashed with [8311 firmware](https://github.com/djGrrr/8311-was-110-firmware-builder)
- Your provisioned **PON Serial Number** (from your ISP)
- A router or firewall (e.g. OPNsense) with a VLAN-capable WAN interface (e.g. VLAN 911)
- Optional: ability to clone MAC address (required for static IP from some ISPs)

!!! note "Fiber connector"
    The original ONT in this case was connected using **SC/APC**, which plugged directly into the WAS-110 — no patch cables or adapters were necessary.

---

## Configuration overview

Once the WAS-110 is inserted into an SFP+ port and connected to the fiber socket:

### 1. Access the 8311 web UI

- Assign your computer a static IP (e.g., `192.168.11.3/24`)
- Connect to the module directly or via switch
- Visit: `https://192.168.11.1/cgi-bin/luci/admin/8311/config`

---

## 8311 Configuration

### Masquerade setup

To successfully masquerade on XGS-PON, the original ONT serial number and MAC is mandatory. It, along with other key
identifiers are available on the bottom label of the ADTRAN SDX621i, shown by the arrows in the following depiction:

![ADTRAN SDX621i label](masquerade-as-the-adtran-sdx621i-with-the-was-110/adtran.webp)

### Configuration tab

| Attribute                  | Value                        | Mandatory  | Notes                                 |
|---------------------------|------------------------------|------------|---------------------------------------|
| PON Serial Number (ONT ID)| From original ONT            | ✅         | Found on label of ADTRAN device       |
| Equipment ID              | `ADTN`                       | ✅         | Matches expected ID for ADTRAN ONTs   |
| Hardware Version          | `1.2.1b`                     |            |                                       |
| Sync Circuit Pack Version | `1`                          |            |                                       |
| Software Version A        | `3.7.4-2306.5`               | ✅         | Confirmed working version             |
| Software Version B        | `3.7.4-2306.5`               | ✅         | Matches A                             |
| MIB File                  | `/etc/mibs/prx300_1U.ini`    | ✅         | Note: use `1U`, not `1V`, for VEIP    |
| MAC Address               | Cloned from original ONT     | ✅         | Required for static IP on some ISPs   |

---

## Real-world example

A UK-based user successfully replaced their **ADTRAN SDX621i** on **YouFibre (Netomnia)** using a WAS-110 from the [Better Internet Store].

### Observations:

> PLOAM state reached **O5.1 (Associated)**, but no WAN IP was received until:
>
> - `Fix VLANs` was disabled
> - OPNsense was rebooted
>
> The 8311 UI became unreachable after assigning it to the WAN VLAN — a static route attempt was unsuccessful. For ongoing access, it's best to configure the ONT before attaching it to your WAN.

---

## Performance

Reported speeds were slightly improved:

> On a 1 Gbps symmetric connection, speed tests showed a 50 Mbps improvement. More importantly, space was freed in the network cabinet by removing the external ONT.

---

## Resources

- [WAS-110 Documentation](../xgs-pon/ont/bfw-solutions/was-110.md)
- [Troubleshooting fake O5](../guides/troubleshoot-connectivity-issues-with-the-was-110.md#fake-o5)
- [8311 Firmware Builder on GitHub](https://github.com/djGrrr/8311-was-110-firmware-builder)

---

## Thanks

Thanks to [Better Internet Store](https://www.betterinternet.ltd) for supplying the pre-flashed module and to the 8311 community for collective testing efforts.
