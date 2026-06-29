## Install ONT firmware

=== "WAS-110"

    ??? note "Upgrading a pre-flashed 8311 WAS-110"
        If your [WAS-110] came with 8311 firmware pre-installed, you do not need to follow the full installation guide
        below. Instead, you can go directly to the [Supplementary Upgrades] section to re-install the
        [official 8311 community build] to both A and B partitions.

  [official 8311 community build]: https://github.com/djGrrr/8311-was-110-firmware-builder/releases/latest
  [Supplementary Upgrades]: install-the-8311-community-firmware-on-the-was-110.md#supplementary-upgrades

    Although not strictly necessary for AT&T, the 8311 community firmware is highly recommended for masquerading as
    the {{ page.meta.ont }} and used for the remainder of the [WAS-110] sections of this guide.

    There are two (2) methods to install the 8311 community firmware onto the [WAS-110], outlined in the following guides:

    <div class="grid cards" markdown>

    -    __Method 1: <small>recommended</small>__

         [Install the 8311 community firmware on the WAS-110](install-the-8311-community-firmware-on-the-was-110.md)

    -    __Method 2__

         [WAS-110 multicast upgrade and community firmware recovery](was-110-multicast-upgrade-and-community-firmware-recovery.md)

    </div>

=== "HLX-SFPX"

    [HALNy] has provided a custom firmware with satisfactory customization for masquerading as the {{ page.meta.ont }}.
    It's available by request from [HALNy] and has been made available for download at:

    <https://active-fw.fibrain.pl/aktywa/MATERIALY/HALNy/TEST/HLX-SFPX_V7-0-8pt2l.zip>

    <div class="swiper" markdown>

    <div class="swiper-slide" step="2" markdown>

    ![HLX-SFPX Firmware](shared-assets/hlx_sfpx_firmware.webp){ loading=lazy }

    </div>

    <div class="swiper-slide" step="3" markdown>

    ![HLX-SFPX Firmware Select](shared-assets/hlx_sfpx_firmware_select.webp){ loading=lazy }

    </div>

    </div>

    1. Within a web browser, navigate to <http://192.168.33.1/> and, if asked, input the *useradmin*
       [web credentials]{ data-preview target="_blank" }.
    2. From the main navigation __System__ drop-down, click __Flash Firmware__.
    3. From the __Flash Firmware__ page, click __Choose Image__, browse for `G_ONU_HLX_SFPX_V7-0-8pt2-e.bin`, and click
       __Flash__ to proceed with flashing the firwmare.
    4. Follow the prompts.

=== "X-ONU-SFPP"

    The [X-ONU-SFPP] 8311 community firmware installation requires a two-step process and is more prone to failure or
    bricking.

    !!! warning "This process is not thoroughly documented and can lead to a bricked device"

    __Step 1: Install the Azores bootloader__

    :    Skip past to the solution in the following [issue tracker](../xgs-pon/ont/potron-technology/8311-uboot.md#solution)
         on how to install the Azores bootloader.

    __Step 2: Multicast upgrade__

    :    Follow through the [WAS-110 multicast upgrade and community firmware recovery](was-110-multicast-upgrade-and-community-firmware-recovery.md)
         guide to install the 8311 community firmware.

  [HALNy]: https://halny.com/
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [HLX-SFPX]: ../xgs-pon/ont/calix/100-05610.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
