!!! tip "Bell Canada (Ontario/Quebec)"
    Start with PPPoE passthrough before committing to a full bypass.

!!! warning "New installations"
    Keep the {{ page.meta.ont }} in active service for roughly a week or two until fully provisioned and the
    installation ticket has been closed.

???+ question "Common misconceptions and answers"

    {% include 'common/gpon-question.md' %}

    {% include 'common/gateway-question.md' %}

## Verify XGS-PON service

!!! info "3 Gbps or higher packages"
    If you are subscribed to Gigabit Fibe 3.0 or a similar 3 Gbps or higher package, skip past to [Purchase WAS-110/X-ONU-SFPP ONT].

  [Purchase WAS-110/X-ONU-SFPP ONT]: #purchase-was-110-x-onu-sfpp-ont

Your fiber internet subscription can use different underlying technologies. Use one of these methods to confirm if your
connection uses [XGS-PON]:

* [Web](#via-web) <small>recommended</small>
* [XMO client](#via-xmo-client)


### Via web <small>recommended</small> { #via-web data-toc-label="Via web" }

<div class="swiper" markdown>

<div class="swiper-slide" markdown>

![{{ page.meta.ont }} Administrator login prompt]({{ page.meta.slug }}/{{ page.meta.ont | lower | replace(" ", "_") }}_login.webp){ loading=lazy }

</div>

<div class="swiper-slide" markdown>

![{{ page.meta.ont }} WAN mode]({{ page.meta.slug }}/{{ page.meta.ont | lower | replace(" ", "_") }}_wan_mode.webp){ loading=lazy }

</div>

</div>

1. Within a web browser, navigate to
   <https://home/?c=advancedtools/wan>
   and, if asked, input your Administrator password. (1)
   { .annotate }

    1. Press the __Up__/__Down__ arrow buttons on the front of the {{ page.meta.ont }} to select __Modem Management__ or __Modem Password__ and press the __OK__ button to display the password.

2. From the __WAN__ page, verify the displayed __current mode__ is XGS-PON.

{% if page.meta.ont == 'Home Hub 4000' %}
!!! info "Firmware version __1.7.11__ removed the helpful auto-detected mode output"

2. From the __WAN mode__ drop-down, switch from `AUTO` to `XGS-PON` and click __Save__. If your internet access doesn't
   drop out, you're subscribed on XGS-PON.
{% endif %}

### Via XMO client

The open-source XMO client[^1] requires Python 3.10 or newer. For installation instructions, see the Real Python guide:
[Python 3 Installation & Setup Guide](https://realpython.com/installing-python).

[^1]: <https://github.com/up-n-atom/sagemcom-modem-scripts>

<h4>Install client</h4>

Open a terminal and install the open-source XMO client using:

=== ":material-microsoft: Windows"

    ``` sh hl_lines="5"
    py --version # (1)!
    py -m venv venv
    venv\Scripts\activate
    py -m pip install --upgrade pip
    pip install https://github.com/up-n-atom/sagemcom-modem-scripts/releases/download/v0.0.11/xmo_remote_client-0.0.11-py3-none-any.whl
    ```

    1. Verify the installed Python version is >= __3.10__

=== ":simple-apple: macOS / :simple-linux: Linux"

    ``` sh hl_lines="5"
    python3 --version # (1)!
    python3 -m venv .venv
    . .venv/bin/activate
    python3 -m pip install --upgrade pip
    pip3 install https://github.com/up-n-atom/sagemcom-modem-scripts/releases/download/v0.0.11/xmo_remote_client-0.0.11-py3-none-any.whl
    ```

    1. Verify the installed Python version is >= __3.10__

<h4>Execute client</h4>

Finally, to determine if you have XGS-PON service, execute the following:

{% if page.meta.ont.startswith('Giga Hub') %}
``` sh
xmo-remote-client --password=<password> get-wan-mode # (1)!
```
{% else %}
``` sh
xmo-remote-client --password=<password> -a MD5 get-wan-mode # (1)!
```
{% endif %}

1. Replace the `<password>` argument. Press the __Up__/__Down__ arrow buttons on the front of the {{ page.meta.ont }} to select __Modem Management__ or __Modem Password__ and press the __OK__ button to display the password.

???- note "If your *current mode* is *GPON*, you should follow the [How to Bypass Gigahub for Bell Aliant (GPON)] guide instead"
    Before you begin, please be aware of the following important caveats to ensure a successful installation:

    1. Ensure you use the correct firmware image for your hardware:
         * __[G-010S-P]__ `alcatel-g010sp_new_busybox-squashfs.image`
         * __[MA5671A]__ / __[GPON-ONU-34-20BI]__ `huawei-ma5671a_new_busybox-squashfs.image`
    2. Install the non-themed firmware image(s). The themed versions don't render correctly in modern web browsers.
    3. Changing the language via the shell is easier than using the web UI. Run the following commands:
       ```
       uci set luci.main.lang='en'
       uci commit
       ```

  [G-010S-P]: ../gpon/ont/source-photonics/sps-34-24t-hp-tdfo.md
  [MA5671A]: ../gpon/ont/source-photonics/sps-34-24t-hp-tdfo.md
  [GPON-ONU-34-20BI]: ../gpon/ont/source-photonics/sps-34-24t-hp-tdfo.md

  [XGS-PON]: ../xgs-pon/index.md
  [How to Bypass Gigahub for Bell Aliant (GPON)]: https://github.com/dukeseb/Bell-Gigahub-Bypass-GPON
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
