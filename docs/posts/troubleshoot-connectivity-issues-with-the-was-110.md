---
date: 2024-05-22
categories:
  - WAS-110
  - BFW Solutions
  - XGS-PON
description: Troubleshoot connectivity issues with the WAS-110
pin: true
---

# Troubleshoot connectivity issues with the WAS-110 or X-ONU-SFPP

![WAS-110 troubleshoot](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_troubleshoot.webp){ class="nolightbox" }

<!-- more -->
<!-- nocont -->

The MaxLinear SDK includes an extensive suite of debugging tools that come pre-bundled with the [WAS-110] firmware(s).
These tools can be run either from the shell console or have been tied into the web UI.

## PON troubleshooting

### Digital Diagnostic Monitor Interface

The [WAS-110] supports the Digital Diagnostic Monitor Interface (DDMI)[^1] to provide pseudo-real-time access to its
operating parameters via a host interface. Although simplistic, this interface is suitable for monitoring power and
temperature behaviours, which are the first tells of troubles.

For more details on accessing this interface, please search your hosts' documentation for
*Digital Diagnostic Monitoring (DDM)* or *Digital Optical Monitoring (DOM)*.

#### Host access

!!! warning "Host readings may be inaccurate"
    UniFi Network has reported 3.000 V and -inf Rx power for a [WAS-110] plugged into a USW Pro XG 24 PoE, while the
    [WAS-110] itself reported 3.30 V and -20.7 dBm. If in doubt, check the [optical status](#optical-status) and
    [voltage status](#voltage-status) from the [WAS-110] instead.

##### :simple-linux: Linux / :simple-ubiquiti: UniFi OS { #linux-ddmi data-toc-label="Linux" }

``` sh
ethtool -m <interface>
```

##### :simple-freebsd: FreeBSD / :simple-pfsense: pfSense { #freebsd-ddmi data-toc-label="FreeBSD" }

``` sh
ifconfig -v <interface>
```

##### :simple-mikrotik: MikroTik RouterOS { #mikrotik-routeros-ddmi data-toc-label="MikroTik RouterOS" }

``` sh
/interface ethernet monitor sfpX #(1)!
```

1. Replace sfp`X` with the port name/number.

### Optical power

#### Optical specifications

| &nbsp;       | Min. | Max. | Unit | WAS-110 Error |
| ------------ | ---- | ---- | ---- | ------------- |
| __Tx Power__ | 4    | 9    | dBm  | +/- 2         |
| __Rx Power__ | -29  | -8   | dBm  | +/- 3         |

##### Industry standard signal ranges

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Great</th>
      <th>Good</th>
      <th>Fair (Warning)</th>
      <th>Poor (Action)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Tx Power</strong></td>
      <td>4 to 5</td>
      <td>3 to 6</td>
      <td>2 to 7</td>
      <td><= 1 or >= 8</td>
    </tr>
    <tr>
      <td><strong>Rx Power</strong></td>
      <td>−14 to −20</td>
      <td>−8 to −24</td>
      <td>−24 to −27</td>
      <td>< −27 or > -8</td>
    </tr>
  </tbody>
  <tfoot>
   <tr>
    <td>
      <small><strong>Great</strong></small></td>
      <td colspan="4"><small>Optimal performance; low Bit Error Rate (BER).</small></td>
    </tr>
    <tr>
      <td><small><strong>Good</strong></small></td>
      <td colspan="4"><small>Typical operating range for most ISP networks.</small></td>
    </tr>
    <tr>
      <td><small><strong>Fair</strong></small></td>
      <td colspan="4"><small>Marginal; may see Error Corrections (FEC).</small></td>
    </tr>
    <tr>
      <td><small><strong>Poor</strong></small></td>
      <td colspan="4"><small>Risk of Loss of Signal (LOS) or reciever damage.</small></td>
    </tr>
  </tfoot>
</table>

#### Optical status

To determine if the [WAS-110] optics are operating within specification, execute one of the following procedures:

=== "8311 firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 PON status](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_optical_status.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/pon_status> and, if asked, input your *root* password.
    2. From the __PON Status__ page, select the __Optical Status__ tab.
    3. Evaluate __Transmit power__ and __Receive power__ are within [spec](#optical-specifications).

    <h5>from the Linux shell</h5>

    ``` sh
    pontop -b -g 'Optical Interface Status'
    ```

=== "Azores firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 PON status](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_azores_pon.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/html/main.html#status/pon> and, if asked, input your *admin*
       [web credentials]{ data-preview target="_blank" }.
    2. From the __Status__ tab, select the __PON__ page.
    3. Evaluate __Tx Power(dBm)__ and __Rx Power(dBm)__ are within [spec](#optical-specifications).

    <h5>from the Linux shell</h5>

    ``` sh
    i2c_cmd show optical
    ```

    <!--
    root@prx126-sfp-pon:~# i2c_cmd show optical
    Rx Power:	-40.00 dBm
    Tx Power:	-40.00 dBm
    Voltage:	3211 mV
    Bias Current:	0 uA
    Temperature:	40.50 C
    SFP Vendor NAME:	E.C.I. NETWORKS
    SFP Vendor REV:	V1.0
    SFP SN:	AZRS6F595EBC
    SFP VENDOR PN:	ENXGSFPPOMACV2
    -->

=== "HLX-SFPX"

    ![HLX-SFPX PON status](shared-assets/hlx_sfpx_pon_status.webp){ loading=lazy }

    1. Within a web browser, navigate to <http://192.168.33.1/> and, if asked, input the *useradmin*
       [web credentials]{ data-preview target="_blank" }.
    2. From the main navigation __Status__ drop-down, click __PON Interface__.
    3. From the __Optical Information__ section, evaluate that the __RX Power__ and __TX Power__ are within [spec](#optical-specifications).

And as with a Linux host, the DDMI[^1] is available from the [WAS-110] shell,
where both __Laser output power__ and __Receiver signal average optical power__ can be evaluated.

``` sh
ethtool -m pon0
```

!!! failure "Simplex optic fault test"

    <h5>Test 1</h5>

    1. Unplug the fiber cable.
    2. Check the [optical status](#optical-status), if the transmit (Tx) and receive (Rx) power (dBm) do not report
       __No signal__ or __-40dBm__ or __-inf__, the optics are miscalibrated or faulty.

    <h5>Test 2</h5>

    1. Plug-in the fiber cable.
    2. Check the [optical status](#optical-status), if the transmit (Tx) and receive (Rx) power (dBm) report
       __No signal__, you're likely subscribed to GPON (1490nm downstream and 1310nm upstream) which isn't a compatible
       wavelength for the [WAS-110].

### OLT authentication

#### Activation states

- O1 Initial state
- O2 Stand-by state
- O3 Serial number state
- O4 Ranging state
- O5 Operation state
- O6 POPUP state
- O7 Emergancy stop state

#### Fake O5

A common term tossed around is <q>fake</q> O5, which is a misnomer that occurs when PLOAM message activation succeeds,
including Serial Number and/or Registration ID authentication. However, the failure is further along in the
registration chain, such as OMCI. It pertains to invalid managed entity attributes with common associations to device
integrity, such as hardware and/or software versioning.

#### PLOAM status

To view the current PLOAM status (activation state), execute one of the following procedures:

=== "8311 firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 PON status](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_pon_status.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/pon_status> and, if asked, input your *root* password.
    2. From the __PON Status__ page, select the __Status__ tab to ascertain the __PON PLOAM Status__.

    <h5>from the Linux shell</h5>

    <h6>PLOAM Status</h6>

    ``` sh
    pontop -b -g s
    ```

    <h6>PLOAM counters</h6>

    ``` sh
    pontop -b -g 'PLOAM Downstream Counters'
    pontop -b -g 'PLOAM Upstream Counters'
    ```

=== "Azores firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 PON status](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_azores_pon.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/html/main.html#status/pon> and, if asked, input your *admin*
       [web credentials].
    2. From the __Status__ tab, select the __PON__ page to ascertain the __ONU State__.

    <h5>from the Linux shell</h5>

    <h6>PLOAM Status</h6>

    ``` sh
    pontop -b -g s
    ```

    <h6>PLOAM counters</h6>

    ``` sh
    pontop -b -g 'PLOAM Downstream Counters'
    pontop -b -g 'PLOAM Upstream Counters'
    ```

=== "HLX-SFPX"

    ![HLX-SFPX PON status](shared-assets/hlx_sfpx_pon_status.webp){ loading=lazy }

    1. Within a web browser, navigate to <http://192.168.33.1/> and, if asked, input the *useradmin*
       [web credentials]{ data-preview target="_blank" }.
    2. From the main navigation __Status__ drop-down, click __PON Interface__.
    3. Evaluate the __PLOAM State__ in the __Link Information__ section.

#### OMCI clarification

To identify fake O5, execute the following command procedures. If the output is empty, the operational state is
*"fake"* because the OLT failed to return the expected configuration. An output that only contains default
rules can also be deceiving, even though it is technically valid.

<table markdown>
<caption markdown>Default Rules</caption>
<thead markdown>
<tr markdown>
<th markdown></th>
<th markdown></th>
</tr>
</thead>
<tbody markdown>
<tr markdown>
<td markdown>15, 4096, 0, 15, 4096, 0, 0, (0, 15, 0, 0, 15, 0, 0)</td>
<td markdown>Untagged</td>
</tr>
<tr markdown>
<td markdown>15, 4096, 0, 14, 4096, 0, 0, (0, 15, 0, 0, 15, 0, 0)</td>
<td markdown>[Dot1Q](https://en.wikipedia.org/wiki/IEEE_802.1Q)</td>
</tr>
<tr markdown>
<td markdown>14, 4096, 0, 14, 4096, 0, 0, (0, 15, 0, 0, 15, 0, 0)</td>
<td markdown>[QinQ](https://en.wikipedia.org/wiki/IEEE_802.1ad)</td>
</tr>
</tbody>
</table>

=== "8311 firmware"

    !!! note "As of version 2.7.2 the extended VLAN table(s) can now be dumped in a human readable format"

    <h5>from the Web UI</h5>

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/vlans> and, if asked, input your root password.
    2. From the __VLAN Tables__ page, if the __textarea__ is blank, the ONT configuration has not satisfied the OLT.

    <h5>from the Linux shell</h5>

    ``` sh
    8311-extvlan-decode.sh -t
    ```
=== "Azores firmware"

    <h5>from the Linux shell</h5>

``` sh
omci_pipe.sh md | grep -E '^\|\s+(84|171)\s\|'
```

Additionally, it is possible to identify the connected OLT by executing the following command:

``` sh
omci_pipe.sh meg 131 0
```

Typically, OLT operators enforce versioning compliance when software management is not handled over CWMP[^2].

### Alarms

Alarms are critical for diagnosing hardware failures, authentication errors, and physical layer issues. Use these
indicators to pinpoint whether a fault originates with the OLT, the ODN, or your ONT.

#### Common alarms

| Alarm Code | Description             | Cause                                                                                 |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------- |
| LOS        | Loss of Signal          | Physical break in fiber, disconnected cable, or OLT port failure                      |
| LODS       | Loss of Downstream Sync | Excessive attenuation (distance, dirty connectors) or fault ONT receiver              |
| LOF        | Loss of Frame           | High Bit Error Rate (BER) or severe signal interference                               |
| O7         | Emergency Stop          | ONT is in "Rogue" state or has been disabled by the OLT. **(Disconnect immediately)** |

!!! danger "Rogue ONT (O7)"
    An O7 alarm often indicates a "Rogue ONT" that is transmitting light outside of its assigned time slot. This can
    "blind" the OLT port and drop service for every other subscriber on that same PON split.

!!! tip "O7 while plugged into a NIC?"
    Check the [supply voltage](#supply-voltage) before plugging the fiber cable back in.

To view real-time faults and begin remediation, execute one of the following procedures:

``` sh title="Example: fiber disconnect/broken"
Page: Active alarms
Alarm type       Alarm                     Description
LEVEL            PON_ALARM_STATIC_LOS      Loss of signal
LEVEL            PON_ALARM_STATIC_LODS     Loss of downstream synchronization
LEVEL            PON_ALARM_STATIC_ERR_LOSS Same signal as LOS just configured as level sensitive
```

=== "8311 firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 PON alarm status](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_alarm_status.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/pon_status> and, if asked, input your *root* password.
    2. From the __PON Status__ page, select the __Alarms__ tab to check for __Active Alarms__.

    <h5>from the Linux shell</h5>

    ``` sh
    pontop -b -g w
    ```

=== "Azores firmware"

    <h5>from the Linux shell</h5>

    ``` sh
    pontop -b -g w
    ```

## LAN troubleshooting

### Link Speed

The [WAS-110] will attempt to auto-negotiate with the host controller and, more often than not, fallback to 1 Gbps.
To prevent this behaviour, forcefully set the speed of the host interface to 10 Gbps.

Furthermore, to force the link speed on the [WAS-110] itself, execute the following `ethtool`[^3] procedures.

=== "8311 firmware"

    <h5>from the Web UI <small>permanent</small></h5>

    ![WAS-110 device tab](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_device.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/config> and, if asked, input your *root* password.
    2. From the __8311 Configuration__ page, select the __Device__ tab.
    3. From the __Device__ tab, set the __Ethtool Speed Settings__ input to one of the following:

           | Parameters  |
           | ----------- |
           | speed 1000  |
           | speed 2500  |
           | speed 10000 |

    <h5>from the Linux shell <small>temporary</small></h5>

    !!! warning "The following command sets the link speed <ins>temporarily</ins> until the next power cycle"

    ``` sh
    ethtool -s eth0_0 speed <speed> #(1)!
    ```

    1. <ins>Replace</ins> the &lt;speed&gt; parameter to either 1000, 2500, or 10000

=== "Azores firmware"

    <h5>from the Web UI <small>permanent</small></h5>

    ![WAS-110 Negotiation Speed](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_azores_speed.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/html/main.html#service/setlanfixspeed>, and, if asked, input your *admin*
       [web credentials].
    2. From the __Negotiation Speed__ page, select __OnDemand__ and __10G__ link speed, and click __Save__.

    <h5>from the Linux shell <small>temporary</small></h5>

    !!! warning "The following command sets the link speed <ins>temporarily</ins> until the next power cycle"

    ``` sh
    ethtool -s eth0_0 speed <speed> #(1)!
    ```

    1. <ins>Replace</ins> the &lt;speed&gt; parameter to either 1000, 2500, or 10000

### Tx fault

The SFP tx fault pin[^4] (2) is multiplexed with UART tx. If the serial UART is enabled, tx fault may be asserted by the
host hardware and cause the link state to flap continuously.

#### Serial console

!!! note "By default, serial UART is enabled during boot-up until Linux init, where it is disabled"

=== "8311 firmware"

    <h5>from the Web UI</h5>

    ![WAS-110 device tab](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_device.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/config> and, if asked, input your *root* password.
    2. From the __8311 Configuration__ page, select the __Device__ tab.
    3. From the __Device__ tab, uncheck the __Serial console__ checkbox.

    <h5>from the Linux shell</h5>

    To disable the serial console from the Linux shell, execute the following commands:

    ``` sh
    fwenv_set -8 console_en
    ```

    <h5>from the U-Boot shell</h5>

    To disable the serial console from the U-Boot shell, execute the following commands:

    ``` sh
    env delete 8311_console_en
    env save
    env save
    ```

=== "Azores firmware"

    !!! info "Serial console is disabled by default, except in version 1.0.11"

    To disable the serial console from the Linux shell, execute the following commands:

    ```
    uci -c /ptconf set usrconfig_conf.InternetGatewayDevice__X_PT_CONSOLE_CFG__=interface
    uci -c /ptconf set usrconfig_conf.InternetGatewayDevice__X_PT_CONSOLE_CFG__.Enable=0
    uci -c /ptconf commit usrconfig_conf
    ```

#### Boot console & early printk { #boot-console data-toc-label="Boot console" }

UART tx can be further controlled by two (2) U-Boot environment variables: `uart_select` and `uart_select_preboot`.

!!! warning "<ins>DO NOT</ins> execute the following commands unless you understand the repercussions"

<h5>from the Linux shell</h5>

``` sh
fwenv_set uart_select off
```

<h5>from the U-Boot shell</h5>

``` sh
setenv uart_select off
env save
env save
```

???+ info "To recover, a host device with serial breakout on SFP pins 2 (rx) and 7 (tx) will be required."

    1. Spam ++escape++ in the serial terminal while plugging in the WAS-110

    2. Press ++enter++

    3. Type `mw.b 0xB6180121 0xd8` followed by ++enter++

    4. Delete the `uart_select_preboot` environment variable

        ``` sh
        env set uart_select_preboot
        env save
        env save
        ```

#### Host Solutions

##### :simple-linux: Linux (SFP subsystem)

SFP+ network drivers built on the Linux [SFP subsystem] use SFF-8472[^1] DDMI to manage modules. This causes
issues for non-compliant [GPON] and [XGS-PON] sticks. To work around this, maintainers add hardcoded [quirks]. However,
each new hardware or vendor variant requires a new kernel build. As of kernel 6.17, a quirk for the Yunvo
SFP+ONU-XGSPON ([X-ONU-SFPP]) module has been included to address this.

 [SFP subsystem]: https://www.kernel.org/doc/html/latest/networking/sfp-phylink.html
 [GPON]: ../gpon/index.md
 [XGS-PON]: ../xgs-pon/index.md
 [quirks]: https://git.kernel.org/pub/scm/linux/kernel/git/next/linux-next.git/tree/drivers/net/phy/sfp.c?h=next-20251219#n489

If you see the following output in your kernel log, you are either running an older kernel version, or your
[WAS-110] or [X-ONU-SFPP] module's vendor information does not match an existing quirk.

``` sh
sfp sfp1: module transmit fault indicated
sfp sfp1: module persistently indicates fault, disabling
```

To resolve this issue, you can take one of two approaches:

1. Add a new quirk for your module and recompile your kernel.
2. Modify the vendor information on the module itself to match an existing quirk.

!!! danger "The steps below will make modifications to your module's EEPROM. Make sure you create backups and proceed with caution."

To achieve the latter, SSH into the module and read the current EEPROM value as base64, then paste it into the form below.

``` sh
base64 /sys/class/pon_mbox/pon_mbox0/device/eeprom50
```

<textarea id="eeprom-base64" rows="5" style="width: 100%;"></textarea>
<p>
  <label class="md-typeset">
    <input type="radio" name="device-type" value="WAS-110" checked>
    <span>WAS-110</span>
  </label>
  <label class="md-typeset" style="margin-left: 20px;">
    <input type="radio" name="device-type" value="X-ONU-SFPP">
    <span>X-ONU-SFPP</span>
  </label>
</p>
<a onclick="generate_eeprom_vendor()" class="md-button">Generate</a>
<div class="highlight" style="display: none;">
  <pre><code id="eeprom-output"></code></pre>
</div>

### Rx loss

The SFP rx loss pin[^5] (8) is asserted when the SC/APC fiber cable isn't plugged in and/or inactive. Depending on the
host controller and implementation, the interface may enter a power saving state, making the [WAS-110] inaccessible.

=== "8311 firmware"

    !!! info "Rx loss is deasserted by default as of version 2.3.0"

    <h5>from the Web UI</h5>

    ![WAS-110 device tab](troubleshoot-connectivity-issues-with-the-bfw-solutions-was-110/was_110_luci_device.webp){ loading=lazy }

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/8311/config> and, if asked, input your *root* password.
    2. From the __8311 Configuration__ page, select the __Device__ tab.
    3. From the __Device__ tab, uncheck the __RX Loss of Signal__ checkbox.

    <h5>from the Linux shell</h5>

    To disable rx loss from the Linux shell, execute the following commands:

    ```
    fwenv_set -8 rx_los
    ```

    <h5>from the U-Boot shell</h5>

    To disable rx loss from the U-Boot shell, execute the following commands:

    ``` sh
    env delete 8311_rx_los
    env save
    env save
    ```

=== "Azores firmware"

    Unfortunately, rx loss can't be disabled.

#### Host solutions

##### :simple-mikrotik: MikroTik RouterOS { #mikrotik-routeros-rxlos data-toc-label="MikroTik RouterOS" }

!!! info "Requires RouterOS 7.15+"

``` sh
/interface ethernet set sfpX sfp-ignore-rx-los=yes #(1)!
```

1. Replace spf`X` with the port name/number.

### Unqualified module

Intel Ethernet 700 series adapters (e.g., X710) have firmware that checks for Intel qualified modules[^8], which the
[WAS-110] is not. The check can't be disabled by the driver.

If you see the following output in your system log, the adapter has flagged the [WAS-110] as unqualified:

=== ":simple-freebsd: FreeBSD / :simple-pfsense: pfSense"

    ``` sh
    ixl0: Link failed because an unqualified module was detected!
    ```

=== ":simple-linux: Linux"

    ``` sh
    i40e 0000:01:00.0: Rx/Tx is disabled on this device because an unsupported SFP module type was detected.
    ```

The message is only logged while the link is down and does not always mean the [WAS-110] won't work. As Intel puts it,
"other modules may function but are not validated by Intel"[^9]. If the link comes up and the [WAS-110] is accessible,
the message can be ignored.

If the link never comes up, check the [link speed](#link-speed) first. Otherwise, the adapter is likely refusing the
[WAS-110], and it should be moved to a media converter or network switch port instead.

!!! warning "Unlocking the adapter has been tested but <ins>NOT</ins> vetted"
    Tools such as [xl710-unlocker](https://github.com/bibigon812/xl710-unlocker) unlock X710 and XL710 adapters for
    use with any SFP+ module by modifying the adapter's non-volatile memory (NVM). It has been tested, but the tool
    itself has not been vetted, so proceed with caution and at your own risk.

### Supply voltage

The [WAS-110] can draw up to 3 W[^6], which is more than SFP+ power class 3 (2 W)[^5] and more than some host
interfaces are able to supply. An under-powered [WAS-110] may enter O7 (emergency stop)[^6] while its host link stays
up and the web UI remains accessible.

!!! warning "Plugging the WAS-110 into a NIC is discouraged"
    NICs have been known to under-power the [WAS-110] and cause it to enter O7[^6]. A media converter or network
    switch port is recommended instead.

    Not all NIC and ONT stick combinations have been tested. To check your own, follow the
    [voltage status](#voltage-status) steps.

#### Voltage specifications

| &nbsp;             | Min.  | Max.  | Unit |
| ------------------ | ----- | ----- | ---- |
| __Supply voltage__ | 3.135 | 3.465 | V    |

!!! note "Voltage and wattage are two different things"
    Even if the voltage is within spec, the host interface may still be unable to supply the wattage the [WAS-110]
    requires. The [WAS-110] draws the most power under load[^6], so evaluate the voltage again during a speed test.

#### Voltage status

To determine if the supply voltage is within [spec](#voltage-specifications)[^5], execute one of the following
procedures:

=== "8311 firmware"

    <h5>from the Web UI</h5>

    1. Navigate to <https://192.168.11.1/cgi-bin/luci/admin/status/overview> and, if asked, input your *root* password.
    2. From the __PON Status__ section, evaluate __Module Voltage__ is within [spec](#voltage-specifications).

    <h5>from the Linux shell</h5>

    Look for __Module voltage__ in the output.

    ``` sh
    ethtool -m pon0
    ```

    <h5>from the JSON endpoint</h5>

    Version 2.8.2 and later report `module_voltage` from the JSON endpoint at
    <https://192.168.11.1/cgi-bin/luci/8311/metrics>.

=== "Azores firmware"

    <h5>from the Linux shell</h5>

    !!! info "The voltage is reported in millivolts (mV)"

    ``` sh
    i2c_cmd show optical
    ```

#### Host readings

The following readings were taken with the same [WAS-110] and are only a point of reference. Be sure to check your
own host interface.

A :check_mark: means the voltage was within [spec](#voltage-specifications). It does not mean the host interface is
able to supply enough wattage.

| Host                       | Interface | Voltage        | &nbsp;       |
| -------------------------- | --------- | -------------- | ------------ |
| Chelsio T520-CR            | SFP+      | 2.77 to 2.83 V | :x:          |
| Intel X710                 | SFP+      | 3.25 to 3.26 V | :check_mark: |
| Ubiquiti USW Pro XG 24 PoE | SFP28     | 3.30 V         | :check_mark: |

!!! failure "The Chelsio T520-CR is <ins>NOT</ins> recommended"
    It has been measured supplying a voltage below [spec](#voltage-specifications), which may cause the [WAS-110] to
    enter O7.

#### Host solutions { #supply-voltage-host-solutions data-toc-label="Host solutions" }

Unfortunately, the supply voltage can't be adjusted. Move the [WAS-110] to another host interface, such as a network
switch or media converter[^6], and check the [voltage status](#voltage-status) again.

### Throughput

If your speed test results are lower than expected, the host may be the cause.

#### Host solutions { #throughput-host-solutions data-toc-label="Host solutions" }

##### :simple-pfsense: pfSense (Chelsio cxgbe) { #pfsense-cxgbe data-toc-label="pfSense (Chelsio cxgbe)" }

The `cxgbe` driver enables rate limiting by default[^7]. With a Chelsio T520-CR, this limited routed traffic to
roughly 500 Mbps in both directions, while the CPU was mostly idle and the interface counters showed no errors.

!!! warning "The Chelsio T520-CR is <ins>NOT</ins> recommended"
    Disabling rate limiting does not resolve its low [supply voltage](#host-readings). Avoid plugging the [WAS-110]
    into the T520-CR.

To check if rate limiting is enabled, execute the following commands:

``` sh
ifconfig cxl0 #(1)!
sysctl dev.t5nex.0.niccaps
sysctl dev.cxl.0.txq | grep -E 'mp_ring.(stalls|dropped)'
```

1. Replace `cxl` and `t5nex` (T5) with `cxgbe` and `t4nex` (T4) or `cc` and `t6nex` (T6) to match your adapter.

Rate limiting is enabled if `TXRTLMT` is listed in the interface options and `niccaps` includes `ETHOFLD`. The
`mp_ring` stall and drop counters will also climb during a speed test.

``` sh title="Example: rate limiting enabled"
dev.t5nex.0.niccaps: 41<NIC,ETHOFLD>
```

To disable rate limiting, add the following loader tunable to `/boot/loader.conf.local` and reboot:

``` sh
hw.cxgbe.niccaps_allowed="1"
```

After the reboot, `niccaps` should read `1<NIC>` and `TXRTLMT` should no longer be listed.

##### :simple-pfsense: pfSense (flow control) { #pfsense-flow-control data-toc-label="pfSense (flow control)" }

If the router is connected to a network switch with flow control enabled, the switch's pause frames may stall the
router's transmit queue and cause packet drops.

For example, take a 24-port switch with a mix of 10 Gbps and 2.5 Gbps devices. When a 10 Gbps device sends a large
file to a 2.5 Gbps device, the slower port can't keep up and the switch sends pause frames back to the faster port to
slow it down. The router is in the same position whenever it sends traffic to a slower device, e.g. when routing
between VLANs or during a download from the internet. While its port is paused, everything else leaving that port has
to wait as well.

To prevent this behaviour, disable flow control on the router's interface(s) connected to the switch.

The following applies to Intel `ix` interfaces. For other drivers, refer to the pfSense documentation[^7].

!!! warning "The following command disables flow control <ins>temporarily</ins> until the next reboot"
    The driver default of `3` (full flow control) may also be restored when interfaces are re-assigned.

``` sh
sysctl dev.ix.0.fc=0 #(1)!
```

1. Replace `ix.0` with your interface e.g. `ix.1`.

To permanently disable flow control, add the following loader tunable to `/boot/loader.conf.local` and reboot:

``` sh
hw.ix.flow_control="0"
```

## Common issues & workarounds

### Nokia OLT (ALCL)

``` sh
omci_pipe.sh meadg 131 0 1 | awk '/41 4C 43 4C/ {print "Nokia OLT"; id=1} /20 20 20 20/ {print "Fake O5"; id=1} END {if (!id) print "Other OLT"}'
```

#### GEM port encryption misconfiguration (key errors)

1. Check GEM port for __Key Errors__ and make note of the __GEM ID__(s).

    ``` sh
    pontop -b -g 'GEM/XGEM Port Counters'
    ```

2. If key errors are present (greater than 0), check GEM port __Encryption Key Ring__ attribute value.

    ``` sh
    omci_pipe.sh meadg 268 <GEM ID> 10 | awk -F'attr_data=' '{print $2}' # (1)!
    ```

    1. Replace `<GEM ID>` with the one found in the output for GEM/XGEM Port Counters page.

3. If the __Encryption Key Ring__ value is 0 or 1, change it to 3 (downstream encryption only).

    ``` sh
    omci_pipe.sh meads 268 <GEM ID> 10 3 # (1)!
    ```

    1. Replace `<GEM ID>` with the one found in the output for GEM/XGEM Port Counters page.

??? abstract "Related workaround found on the XS-010X-Q (`/usr/lib/libomci.so`)"

    A similar workaround is also found on the **XS-010X-Q** within `/usr/lib/libomci.so`. Specifically, the logic is
    found in the `ca_omci_saturn_gemflow_add` function:

    ``` c title="Ghidra Disassembly Snippet"
    ...
    if ((*(int *)((int)local_38 + 0x13c) == 6) && (*(int *)((int)local_38 + 0x148) != 2)) {
        local_38 = (char *)0x7eb;
        omci_log_msg(8,4,"%s() [%d]Don\'t enable us aes for ALCL\n","ca_omci_saturn_gemflow_add",0x7eb);
        omci_log_print(1,8,"%s() [%d]Don\'t enable us aes for ALCL\r\n","ca_omci_saturn_gemflow_add",
                       local_38);
        if (param_1[0x16] == 1) {
          local_3c = 3;
        }
        else {
          local_3c = (undefined1)param_1[0x16];
        }
        iVar5 = param_1[3];
    }
    ...
    ```

  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [web credentials]: ../xgs-pon/ont/bfw-solutions/was-110.md#web-credentials
  [shell credentials]: ../xgs-pon/ont/bfw-solutions/was-110.md#shell-credentials


[^1]: [SFF-8472](https://members.snia.org/document/dl/25916)
[^2]: <https://en.wikipedia.org/wiki/TR-069>
[^3]: <https://www.linux.org/docs/man8/ethtool.html>
[^4]: <https://en.wikipedia.org/wiki/Small_Form-factor_Pluggable#Signals>
[^5]: [SFF-8419](https://members.snia.org/document/dl/25880)
[^6]: <https://akhamar.github.io/orange-xgs-pon/30_was_onu.html>
[^7]: <https://docs.netgate.com/pfsense/en/latest/hardware/tune.html>
[^8]: <https://man.freebsd.org/cgi/man.cgi?query=ixl&sektion=4>
[^9]: <https://docs.kernel.org/networking/device_drivers/ethernet/intel/i40e.html>
