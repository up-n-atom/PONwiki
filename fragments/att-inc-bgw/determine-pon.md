!!! warning "New installations"
    Keep your {{ page.meta.ont }} in active service for roughly a week or two until fully provisioned and the
    installation ticket has been closed.

???+ question "Common misconceptions and answers"

    __Can I take an SFP+ module provided by AT&T and plug it directly into my own router or switch?__

    :   No, the AT&T supplied SFP+ module is only a physical-layer transceiver compliant with XGS-PON
        [ITU G.9807.1]. It lacks ONT management [ITU G.988], meaning it cannot function as a standalone ONT.

 [ITU G.9807.1]: ../xgs-pon/index.md
 [ITU G.988]: ../xgs-pon/index.md

    {% include 'common/gpon-question.md' %}

    {% include 'common/gateway-question.md' %}

## Verify XGS-PON service

!!! info "5 Gbps or grandfathered 2 Gbps tiers"
    If you are subscribed to 5 GIG or the grandfathered 2 GIG internet package, skip past to
    [Purchase WAS-110/HLX-SFPX ONT].

  [Purchase WAS-110/HLX-SFPX ONT]: #purchase-was-110-hlx-sfpx-ont

Your fiber internet subscription can use different underlying technologies. Use one of these methods to confirm if your
connection uses [XGS-PON]:

* [Web (fiber status page)](#via-web)
* [Transceiver (SFP module)](#via-transceiver) <small>recommended</small>

### Via web

![{{ page.meta.ont }} Fiber status]({{ page.meta.slug }}/bgw320_500_505_fiber_status.webp){ loading=lazy }

1. Within a web browser, navigate to
   <http://192.168.1.254/cgi-bin/fiberstat.ha>
2. Check the status listing for the __Wave Length__ value. A reading of *1270 nm* indicates an [XGS-PON] service.

!!! info "Since the 6x series firmware, the fiber status page *may* report 0 (zero) for the Wave Length. Use the transceiver to help determine if you have XGS-PON service."

### Via transceiver <small>recommended</small> { #via-transceiver data-toc-label="Via transceiver" }

![Nokia Transceiver](shared-assets/transceiver.webp){ loading=lazy }

1. Identify the bale clasp color. If *orange/red* :red_circle:, proceed.
2. Engage the bale clasp to release the latch and pull out the transceiver.
3. Inspect the label for *XGS-PON* or *1270* TX.

!!! note "If your wavelength is *1310 nm* and/or the bale clasp is *green* :green_circle:, you are using [GPON] and should follow the [PON Madness] guide instead."

  [XGS-PON]: ../xgs-pon/index.md
  [GPON]: ../gpon/index.md
  [PON Madness]: https://docs.google.com/document/d/1gcT0sJKLmV816LK0lROCoywk9lXbPQ7l_4jhzGIgoTo
  [WAS-110]: ../xgs-pon/ont/bfw-solutions/was-110.md
  [HLX-SFPX]: ../xgs-pon/ont/calix/100-05610.md
