---
title: X-ONU-SFPP (SFP+ XGSPON ONU Stick)
tags:
  - X-ONU-SFPP
  - XGSPON-ONU-STICK-V8
  - FV-NS10S
  - SPP425H-GAB4
  - LL-XS1025
---

# X-ONU-SFPP (SFP+ XGSPON ONU Stick) [^1]

![X-ONU-SFPP](x-onu-sfpp/x-onu-sfpp.webp)

## Specifications

|             |                                                     |                     |
| ----------: | --------------------------------------------------- | ------------------- |
| __SoC__     | PRX126 @ 400 MHz - MIPS interAptiv 34Kc             | [Architecture] [^4] |
| __NAND__    | 128 MB *(1 Gbit)*                                   | [WN25N01GV]         |
| __RAM__     | 1 GB                                                | [RS256M32LD3D1LMZ]  |
| __BOSA__    | SC/UPC *or* SC/APC - Tx: 1270 nm / Rx: 1577 nm      | [M02181]            |
| __EEPROM__  | :check_mark:                                        | [M02181]            |
| __UART__    | UART 	Rx: pin 7 / Tx: pin 2 - 115200-8-1-N          |                     |

### OEM Firmware (PTXG)

|             |                                                     |                     |
| ----------: | --------------------------------------------------- | ------------------- |
| __IP__      | 192.168.1.1                                         |                     |
| __HTTP(S)__ | :x:                                                 |                     |
| __SSH__     | :check_mark:                                        | [Shell credentials] |

 [Architecture]: #architecture
 [WN25N01GV]: https://www.winbond.com/hq/product/code-storage-flash-memory/qspinand-flash/?__locale=en&partNo=W25N01GV
 [RS256M32LD3D1LMZ]: https://www.lcsc.com/datasheet/lcsc_datasheet_2411220107_Rayson-RS256M32LD3D1LMZ-125BT_C2840152.pdf
 [M02181]: https://www.macom.com/products/product-detail/MALD-02181
 [Shell credentials]: #shell-credentials

{% include 'ont/prx126-architecture.md' %}

## System Information

### Boot log

```
--8<-- "docs/xgs-pon/ont/potron-technology/x-onu-sfpp/bootlog"
```

### procfs [^3]

=== "/proc/cmdline"


    ```
    --8<-- "docs/xgs-pon/ont/potron-technology/x-onu-sfpp/procfs_cmdline"
    ```

=== "/proc/cpuinfo"


    ```
    --8<-- "docs/xgs-pon/ont/potron-technology/x-onu-sfpp/procfs_cpuinfo"
    ```

=== "/proc/meminfo"


    ```
    --8<-- "docs/xgs-pon/ont/potron-technology/x-onu-sfpp/procfs_meminfo"
    ```

=== "/proc/mtd"


    ```
    --8<-- "docs/xgs-pon/ont/potron-technology/x-onu-sfpp/procfs_mtd"
    ```

## EEPROM

The Digital Diagnostic Monitor Interface (DDMI)[^5] is handled by the MACOM [M02181] laser driver over an I2C bus
`/dev/i2c-0`.

There are several interfaces and utilities that provide read and/or write access to the EEPROM(s).

### Read

#### A0 (0x50)

``` sh
hexdump -Cv /sys/class/pon_mbox/pon_mbox0/device/eeprom50
```

``` sh
ethtool -m pon0 raw on | head -c 256 | hexdump -Cv
```

``` sh
i2cdump -fy 0 0x50
```

``` sh
i2cget -fy 0 0x50 0x0
```

#### A2 (0x51)

``` sh
hexdump -Cv /sys/class/pon_mbox/pon_mbox0/device/eeprom51
```

``` sh
ethtool -m pon0 raw on | tail -c 256 | hexdump -Cv
```

``` sh
i2cdump -fy 0 0x51
```

``` sh
i2cget -fy 0 0x51 0x0
```

### Write

The EEPROM is write-protected; There are two (2) known passcodes, the user and vendor passcode.

#### User

The A2 (0x51) User EEPROM section from 128 (0x80) to 247 (0xF7) can be unlocked using
the passcode `68646762` by writing it to A2 (0x51) at offset `0x7B`.

``` sh
i2cset -fy 0 0x51 0x7B 0x68 0x64 0x67 0x62 i
```

#### Vendor

!!! warning "Incorrect writes to the EEPROM can prevent the host from recognizing the X-ONU-SFPP"

A0 (0x50) can be unlocked using the passcode `9142F007` by writing it to A2 (0x51) at offset `0x7B`.

``` sh
i2cset -fy 0 0x51 0x7B 0x91 0x42 0xF0 0x07 i
```

## Default Credentials

### Web credentials

=== "Reseller 8311 forks"

    !!! note "8311 forks are NOT supported by the 8311 community"
        Please follow the FiberMall support documentation below or [install] the official [8311 firmware].

        <https://www.fibermall.com/blog/how-to-use-xgspon-onu-stick.htm>

    | Username | Password       |
    | -------- | -------------- |
    | root     | Aa123456       |

### Shell credentials

???- info "OpenSSH/SSL: unsupported algorithms and changes since 8.8 and newer"

    ``` sh
    ssh -V
    openssl version
    ```

    <https://www.openssh.com/releasenotes.html>

    __Red Hat/CentOS/Fedora/Rocky Linux__

    ``` sh
    sudo update-crypto-policies --set LEGACY
    ```

    ``` sh
    ssh -oHostKeyAlgorithms=+ssh-rsa -oPubkeyAcceptedKeyTypes=+ssh-rsa root@192.168.1.1
    ```

| Username | Password |
| -------- | -------- |
| root     |          |

### Bootloader

To access the U-Boot console type `admin` at the prompt: `Hit enter to stop autoboot`

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
<td markdown>[Better Internet](https://store.betterinternet.ltd/?ref=pon_wiki)</td>
<td markdown>[X-ONU-SFPP](https://store.betterinternet.ltd/products/x-onu-sfpp?ref=pon_wiki)</td>
<td markdown>:flag_gb: :flag_eu: <small class="affiliate"></small></td>
<td markdown>8311</td>
</tr>
<tr markdown>
<td markdown>[EXEN](https://exen.sh/)</td>
<td markdown>[X-ONU-SFPP](https://exen.sh/products/x-onu-sfpp-was-110-alternative?utm_source=pon_wiki)</td>
<td markdown>:flag_us: <small class="affiliate"></small></td>
<td markdown>8311</td>
</tr>
<tr markdown>
<td markdown>[FiberMall](https://www.fibermall.com/)</td>
<td markdown>[XGSPON-ONU-STICK-V8](https://www.fibermall.com/sale-462134-xgspon-onu-sfp-stick-i-temp.htm)</td>
<td markdown>:globe_with_meridians:</td>
<td markdown>8311<sup>2</sup></td>
</tr>
<tr markdown>
<td markdown>[Full Vision Com-Tech](https://fullvisiontech.com/)</td>
<td markdown>[FV-NS10S](http://fullvisiontech.com/web/index.php?topclassid=16&classid=133&id=141&lanstr=en)</td>
<td markdown></td>
<td markdown>PTXG (Potron)</td>
</tr>
<tr markdown>
<td markdown>[H-COM](https://www.zhaoyongoptics.com/)</td>
<td markdown>SPP425H-GAB4</td>
<td markdown>:globe_with_meridians: [Alibaba](https://www.alibaba.com/product-detail/XGS-PON-ONU-SFP-Stick-with_1601261149622.html) / [AliExpress](https://s.click.aliexpress.com/e/_mLVFkgd) <small class="affiliate"></small></td>
<td markdown>8311<sup>2</sup></td>
</tr>
<tr markdown>
<td markdown>[LuLeey](https://www.luleey.com/)</td>
<td markdown>[LL-XS1025](https://www.luleey.com/product/xgspon-stick-onu-sfp-transceiver/)</td>
<td markdown>:globe_with_meridians:</td>
<td markdown>8311<sup>2</sup></td>
</tr>
<tr markdown>
<td markdown>[Yunvo](https://www.yunvoptic.com/)</td>
<td markdown>SFP+ONU-XGSPON</td>
<td markdown>:globe_with_meridians: [Alibaba](https://www.alibaba.com/product-detail/10G-SFP-1270-1577nm-20km-SC_10000019105245.html)</td>
<td markdown>PTXG (Potron), 8311<sup>2</sup></td>
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

{% include 'ont/host-interface.md' %}

{% include 'ont/active-cooling.md' %}

[^1]: <https://www.potrontec.com/index/index/list/cat_id/2.html#11-83>
[^2]: <https://www.maxlinear.com/product/access/fiber-access/socs-for-optical-networking-units-onu/prx126>
[^3]: <https://en.wikipedia.org/wiki/Procfs>
[^4]: <https://boxmatrix.info/wiki/Property:Falcon>
[^5]: [SFF-8472](https://members.snia.org/document/dl/25916)
