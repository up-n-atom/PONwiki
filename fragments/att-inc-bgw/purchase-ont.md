## Purchase ONT { #purchase-was-110-hlx-sfpx-ont }

The [WAS-110], [X-ONU-SFPP], [WT-ONU-STICK], and [HLX-SFPX] are available from select resellers worldwide; purchase at
your discretion. We assume no responsibility or liability for the listed resellers.

??? info "Purchase SC/APC variant; if unavailable, add an SC/APC (female) to SC/UPC (male) 0dB attenuator for conversion."
    AT&T and most North American ISPs terminate their fiber at the ONT using SC/APC (green) connectors.

    Angled Physical Contact (APC) tips are polished to 8 degrees. This eliminates signal reflections on the
    fiber.

    !!! warning "Never mismatch SC/APC (green) and SC/UPC (blue). This causes signal loss and can permanently damage the fiber faces."

??? quote "HALNy issued a statement on 2025-09-23 concerning the firmware problems and resolution with the HLX-SFPX."
    > The HLX-SFPX firmware suffers from I/O errors that corrupt the overlay filesystem, soft-bricking the module.

    First of all we want to thank you for all your effort during the tests of our product HLX-SFPX. We are impressed by all your experience and knowledge about GPON/XGS-PON ONTs and embedded devices

    All HALNy products are designed to meet the ISP(Internet Service Providers) requirements.
    In terms of GPON/XGS-PON ONTs, based on the standard, they are fully managed by the ISP (from the OLT side)

    Although our goal is to support ISPs - we decided to make some exception and implement some of the request from end users on best-effort basis.

    Unlucky V7.0.6t1. version dedicated to end-users was released to fast to community - causing issue with unable to login on LAN side. The problem is not always present and few actions need to happen to reveal it.
    The device is not bricked, it will work, pass the traffic, just not possible to login. On version V7.0.7p2 please be careful when you copy the data from the other device. Wrong data may affects OMCI communication which cause not passing the traffic and login to fail.

    We released the new firmware version V7.0.8pt2, which doesn't have this issue:

    <https://active-fw.fibrain.pl/aktywa/MATERIALY/HALNy/HLX-SFPX/FIRMWARE/HLX-SFPX_V7-0-8pt2.zip>

    We strongly recommend to update product to above version.

    Again apologize for all inconvenience. We are really amazed with these community! Keep it going.

    In case of any problem with HALNy products please contact with our support team: <support@halny.com>

<div class="grid cards" markdown>

-    __WAS-110__

     [Value-Added Resellers](../xgs-pon/ont/bfw-solutions/was-110.md#value-added-resellers)

-    __HLX-SFPX__

     [Value-Added Resellers](../xgs-pon/ont/calix/100-05610.md#value-added-resellers)

-    __X-ONU-SFPP <small>WAS-110 substitute</small>__

     [Value-Added Resellers](../xgs-pon/ont/potron-technology/x-onu-sfpp.md#value-added-resellers)

     ---

     :flag_us: [EXEN Shop](https://exen.sh/products/x-onu-sfpp-was-110-alternative?utm_source=pon_wiki) <small class="affiliate"></small>

-    __WT-ONU-STICK <small>X-ONU-SFPP substitute</small>__

     [Value-Added Resellers](../xgs-pon/ont/wintop-optical-technology/wt-onu-stick.md#value-added-resellers)

</div>

!!! tip "Due to ongoing tariffs, prioritize sourcing from domestic stock and sellers."

    If you must purchase from China, be aware that additional duties and taxes will be incurred. A breakdown of the
    applicable rates and HTS (Harmonized Tariff Schedule) codes is provided below:

    | HTS Code                                                         | Rate       |
    | ---------------------------------------------------------------- | ---------- |
    | [8517.62.0090](https://hts.usitc.gov/search?query=8517.62.0090)  | 0%         |
    | [9903.01.32](https://hts.usitc.gov/search?query=9903.01.32)      | 0%         |
    | [9903.88.15](https://hts.usitc.gov/search?query=9903.88.15)      | 7.5%       |
    | [9903.01.24](https://hts.usitc.gov/search?query=9903.01.24)      | 20%        |

    Rates and HTS codes may change. Verify with the seller that the most current HTS codes are present on the customs
    declaration to prevent delays and unexpected fees.

    If you see HTS code [9903.85.08](https://hts.usitc.gov/search?query=9903.85.08) on your CBP Form 7501
    (Entry Summary), you should file a dispute immediately through your courier's portal.

  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [HLX-SFPX]: ../xgs-pon/ont/calix/100-05610.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
  [WT-ONU-STICK]: ../xgs-pon/ont/wintop-optical-technology/wt-onu-stick.md
