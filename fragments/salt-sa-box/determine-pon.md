!!! warning "New installations"
    Keep the {{ page.meta.ont }} in active service for roughly a week until fully provisioned and the
    installation ticket has been closed.

???+ question "Common misconceptions and answers"

    {% include 'common/gpon-question.md' %}

    {% include 'common/gateway-question.md' %}

## Verify XGS-PON service

Your fiber internet subscription can use different underlying technologies. Use one of these methods to confirm if your
connection uses [XGS-PON]:

* [XMO client](#via-xmo-client)
* [Transceiver (SFP module)](#via-transceiver) <small>recommended</small>

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

``` sh
xmo-remote-client --host=192.168.1.1 --password=<password> get-value --path "Device/Optical/Interfaces/Interface[OPTICAL0]/Type" #(1)!
```

1. Replace the `<password>` argument.

### Via transceiver <small>recommended</small> { #via-transceiver data-toc-label="Via transceiver" }

![Nokia Transceiver](shared-assets/transceiver.webp){ loading=lazy }

1. Engage the bale clasp to release the latch and pull out the transceiver.
2. Inspect the label for *XGS-PON* or *1270* TX.


  [XGS-PON]: ../xgs-pon/index.md
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [X-ONU-SFPP]: ../xgs-pon/ont/potron-technology/x-onu-sfpp.md
