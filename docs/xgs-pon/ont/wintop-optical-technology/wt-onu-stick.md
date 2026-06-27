---
title: WT-ONU-STICK (WT XGSPON ONU Stick)
tags:
  - WT-ONU-STICK-APC
  - WT-ONU-STICK-UPC
  - BPI-ONU-STICK
---

# WT-ONU-STICK (WT XGSPON ONU Stick) [^1] [^2]

![WT-ONU-STICK](wt-onu-stick/wt-onu-stick.webp)

## Specifications

|             |                                                     |                |
| ----------: | --------------------------------------------------- | -------------- |
| __SoC__     | PRX126 @ 400 MHz - MIPS interAptiv 34Kc             | [Architecture] |
| __NAND__    | 128 MB *(1 Gbit)*                                   |                |
| __RAM__     | 1 GB                                                |                |
| __BOSA__    | SC/UPC *or* SC/APC - Tx: 1270 nm / Rx: 1577 nm      |                |
| __EEPROM__  | :check_mark:                                        |                |
| __UART__    | UART 	Rx: pin 7 / Tx: pin 2 - 115200-8-1-N          |                |

### OEM Firmware

|             |                                                     |                |
| ----------: | --------------------------------------------------- | -------------- |
| __IP__      | 192.168.1.1                                         |                |
| __SSH__     | :check_mark:                                        |                |

 [Architecture]: #architecture

{% include 'ont/prx126-architecture.md' %}


## Default Credentials

### Bootloader

To access the U-boot console hold ++esc++ on device hot plug to abort autoboot. At the prompt:
`### Please input uboot password: ###` enter `abc123`.

## Value-Added Resellers

<table markdown>
<thead markdown>
<tr markdown>
<th markdown>Company</th>
<th markdown>Product Number</th>
<th markdown>E-commerce</th>
<th markdown>Firmware</th>
</tr>
</thead>
<tbody markdown>
<tr markdown>
<td markdown>[Banana PI](https://forum.banana-pi.org)</td>
<td markdown>[BPI-XGS-PON-ONU](https://www.bpi-shop.com/products/xgs-pononustick.html)</td>
<td markdown>:globe_with_meridians: [AliExpress](https://s.click.aliexpress.com/e/_mM1jMpt) <small class="affiliate"></small></td>
<td markdown>Unknown</td>
<tr markdown>
<td markdown>[Yunvo](https://www.yunvoptic.com/)</td>
<td markdown>YV-XGS-Stick-T</td>
<td markdown>:globe_with_meridians: [Alibaba](https://www.alibaba.com/product-detail/Yunvo-10G-XGSPON-ONT-Stick-SC_10000041298376.html)</td>
<td markdown>8311<sup>2</sup></td>
</tr>
</tbody>
<tfoot markdown>
<tr markdown>
<td colspan="4" markdown>
<ol markdown>
<li markdown><small markdown>Purchase at your discretion, we take no responsibility or liability for the listed resellers.</small></li>
<li markdown><small markdown>8311 forks are NOT supported by the 8311 community. Ask the vendor for support or [install] the official [8311 community firmware].</small></li>
</ol>
</td>
</tr>
</tfoot>
</table>

  [install]: https://pon.wiki/guides/install-the-8311-community-firmware-on-the-was-110/#supplementary-upgrades
  [8311 community firmware]: https://github.com/djGrrr/8311-was-110-firmware-builder/releases

[^1]: <https://www.enwintoptec.com/>
[^2]: <https://www.wintoptec.com/post/805.html>
