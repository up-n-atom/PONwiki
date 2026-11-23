## Managed switch tips

!!! note "Except for flow control, the following tips are only relevant if the ONT is plugged into the switch"

* Filter or disable any Layer 2 management protocols (e.g., (R)STP) and discovery protocols (e.g., LLDP, CDP, FDP, MNDP, RoMON).
* Isolate the ONT and router WAN ports in a dedicated untagged (native) VLAN and exclude it from all other ports.
  AT&T does not require a tagged VLAN when __Fix VLANs__ is enabled.
* Block all other VLANs on the ONT and router WAN ports.
* Disable [flow control] on the router's interface(s) connected to the switch.

??? tip ":simple-ubiquiti: UniFi: New VLANs are tagged on all ports by default"
    Ports with __Tagged VLAN Management__ set to __Allow All__ will automatically carry the ONT VLAN, which puts it on
    every trunk and access port.

    1. Create a VLAN-only network for the ONT e.g. VLAN 99.
    2. On the ONT and router WAN ports, set __Native VLAN / Network__ to the ONT VLAN and __Tagged VLAN Management__
       to __Block All__.
    3. On the ONT port, disable __Spanning Tree Protocol__ and __LLDP-MED__.
    4. On all other ports, exclude the ONT VLAN, either per port or with a port profile.

  [flow control]: troubleshoot-connectivity-issues-with-the-was-110.md#pfsense-flow-control
