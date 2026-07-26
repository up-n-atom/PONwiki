## Software versions

The {{ page.meta.ont }} uses CWMP instead of OMCI for firmware updates. While the OLT rarely requires approval for
specific software versions, keeping the [WAS-110] or [X-ONU-SFPP] up-to-date is beneficial but not strictly necessary.

If you would like to help us maintain the software listing, you can contribute new versions via the
[8311 Discord community server] or by submitting a [Pull Request](https://github.com/up-n-atom/8311/pulls) on GitHub.

Use the following command to extract the external firmware version. This command utilizes the {{ page.meta.ont }}'s
XMO JSON-RPC and the [xmo-remote-client](#via-xmo-client) described earlier in this guide.

{% if page.meta.ont.startswith('Giga Hub') %}
``` sh
xmo-remote-client -p <password> get-value --path "Device/DeviceInfo/SoftwareVersion" --path "Device/DeviceInfo/ExternalFirmwareVersion"
```
{% else %}

!!! note "As of firmware version 2.13, the auth encoding algorithm switched from MD5 to SHA-512"

``` sh
xmo-remote-client -p <password> get-value --path "Device/DeviceInfo/SoftwareVersion" --path "Device/DeviceInfo/ExternalFirmwareVersion"
```
{% endif %}

  [8311 Discord community server]: https://discord.com/servers/8311-886329492438671420
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
