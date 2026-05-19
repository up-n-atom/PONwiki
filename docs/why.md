---
hide:
  - navigation
  - toc
  - feedback
---

# Why Bypass Your ISP CPE

???+ danger "AI-Generated Guidance & Reality Check"
    If you arrived at this site based on advice, diagnosis, or directions provided by an AI or Large Language Model
    (LLM), please be aware that while AI can be a helpful starting point, it is prone to ***"hallucinations"*** and can
    inadvertently create echo chambers that reinforce incorrect assumptions or personal delusions.

    This site is a dedicated space for enthusiasts to explore **Passive Optical Networks (PON)**,
    fiber-to-the-home (FTTH) hardware, and the technical challenge of bypassing ISP equipment for educational purposes.

    We do not endorse or host content related to:

    * Surveillance or spying theories
    * State-level conspiracy narrative
    * Any other forms or irrational or non-technical speculation

    If your interest in this technology is driven by a sense of personal threat or a conspiracy, we strongly advise you
    to **consult with a qualified professional or a trusted human peer** to safeguard against AI-reinforced
    misinformation.

Replacing or bypassing Internet Service Provider (ISP) Customer Premises Equipment (CPE) grants you granular
control and privacy, but it shifts the burden of maintenance from the provider to you.

## The Risks (Why NOT)

Bypassing is not necessary or advisable for most users, as it poses several downsides:

- **Complexity**  
  ISP hardware is designed for **plug-and-play reliability and convenience**. Bypassing introduces multiple points
  of failure that require manual intervention.

- **Maintenance Burden**  
  You become the IT manager. This includes patching **zero-day vulnerabilities**, managing firmware, and monitoring
  hardware health.

- **Service Breakage**  
  "Bundled" services such as Home Phone (VoIP) or TV (IPTV) are often "locked" to the ISP's hardware using hidden
  settings that aren't easy to uncover and replicate on third-party hardware.

- **Voids Support**  
  Once you bypass, the ISP’s responsibility **ends at the street**. If your internet goes down, they will likely
  refuse to troubleshoot until their original equipment is plugged back in.

- **Throughput Falsehoods**  
  Your ISP profile defines your maximum speed. Swapping hardware **will not** increase your provisioned bandwidth,
  though it may reduce network overhead.

- **Hidden Costs**  
  Moving away from an "all-in-one" gateway often requires purchasing separate routers, access points, and SFP
  modules, which can quickly **balloon your budget**.

## The Rewards

Bypassing puts full network control at your edge, enabling improvements in several areas:

- **True Transparent Bridging**  
  Eliminate **Double NAT** and the restricted **NAT table/state limits** of ISP's CPE.

- **Optimized Throughput**  
  Overcome hardware bottlenecks to ensure **full saturation** of subscribed bandwidth, e.g. 10Gbps or 2.5Gbps networking.

- **Bufferbloat Mitigation**  
  Implement advanced **QoS** to eliminate **bufferbloat** and ensure **lower latency**.

- **Digital Privacy**  
  Prevent ISP logging of browsing habits and metadata via Encrypted DNS (DoH/DoT/DNSCrypt).

- **Network-Wide Ad-blocking**  
  Strip telemetry and ads at the gateway using [Pi-hole] or [AdGuard Home].

  [Pi-hole]: https://pi-hole.net/
  [AdGuard Home]: https://adguard.com/en/adguard-home/overview.html

- **Network Segmentation**  
  Deploy advanced firewalls ([OPNsense]/[pfSense]) and managed switches to isolate untrusted hardware
  (**IoT/Cameras**) via **VLANs**.

  [OPNSense]: https://opnsense.org/
  [pfSense]: https://www.pfsense.org/

- **Threat Detection (IDS/IPS)**  
  Deploy [Suricata] or [Snort] to monitor network traffic for malicious patterns and block identified threats in
  real-time.

  [Suricata]: https://suricata.io/
  [Snort]: https://www.snort.org/

- **Policy-Based Routing (PBR)**  
  Direct outbound traffic flows by forcing **VPN tunnels** ([WireGuard]/[OpenVPN]) for sensitive clients, e.g. Ad-Hoc Road Warrior.

  [WireGuard]: https://www.wireguard.com/
  [OpenVPN]: https://openvpn.net/

- **Unrestricted Self-hosting**  
  Host services like [Home Assistant], [Nextcloud], or [Jellyfin] using **DMZs and Reverse Proxies**
  ([HAProxy]/[Traefik]).

  [Home Assistant]: https://www.home-assistant.io/
  [Nextcloud]: https://nextcloud.com/
  [Jellyfin]: https://jellyfin.org/
  [HAProxy]: https://www.haproxy.org/
  [Traefik]: https://traefik.io/

## Is Bypassing Right for You?

Take the questionnaire below to determine if your environment and technical skills are suited for a CPE bypass.

<div id="questionnaire" class="md-typeset">
  <div class="admonition note" style="padding: 1.5em;">
    <p id="question" style="font-size: 0.8rem; font-weight: bold; margin-bottom: 1em; color: var(--md-default-fg-color);"></p>
    <div id="hint-container" style="display:none; margin-bottom: 1em;"></div>
    <div style="margin-bottom: 2em; display: flex; gap: 5px;">
      <button id="yes" class="md-button" style="min-width: 80px;">Yes</button>
      <button id="no" class="md-button" style="min-width: 80px;">No</button>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--md-default-fg-color--lightest); padding-top: 1.5em;">
      <div>
        <button id="prev" class="md-button md-button--secondary">Prev</button>
        <button id="next" class="md-button md-button--secondary">Next</button>
      </div>
      <div id="status" style="font-size: 0.85em; font-weight: normal; opacity: 0.7;"></div>
    </div>
    <div id="result" style="margin-top: 1.5em; display: none;"></div>
  </div>
</div>

<script>
(async () => {
  const questions = [
    {
      q: "Do you rely on ISP‑provided services (VoIP, IPTV, or managed Wi‑Fi 'pods')?",
      hint: "Bypassing may break these services as they often require the ISP CPE",
      blocker: true
    },
    {
      q: "Can you manage firmware updates, backups, and emergency recovery for your own hardware?",
      hint: "You are responsible for security patching and manual recovery if the configuration fails",
      blocker: false
    },
    {
      q: "Do you understand VLAN tagging and how to implement network segmentation?",
      hint: "VLANs separate devices on the same physical network for security or performance",
      blocker: false
    },
    {
      q: "Do you understand the functional difference between managed and unmanaged switches?",
      hint: "A managed switch lets you create separate network segments and control traffic; an unmanaged switch does not",
      blocker: false
    },
    {
      q: "Can you manually configure firewall rules, NAT, and port forwarding?",
      hint: "Incorrect settings can block internet access or expose your network to the web",
      blocker: false
    }
  ];

  let answers = Array(questions.length).fill(null);
  let idx = 0;

  const updateUI = (container) => {
    const result = container.querySelector('#result');
    const status = container.querySelector('#status');
    const hintContainer = container.querySelector('#hint-container');
    const question = container.querySelector('#question');

    question.textContent = `${idx + 1}. ${questions[idx].q}`;

    const answeredCount = answers.filter(a => a !== null).length;
    status.textContent = `Question ${idx + 1} of ${questions.length}`;

    const currentAns = answers[idx];
    if (currentAns !== null) {
      const isRisk = questions[idx].blocker ? currentAns === true : currentAns === false;
      if (isRisk) {
        hintContainer.innerHTML = `
          <div class="admonition info">
            <p class="admonition-title">${questions[idx].hint}</p>
          </div>`;
        hintContainer.style.display = 'block';
      } else {
        hintContainer.style.display = 'none';
      }
    } else {
      hintContainer.style.display = 'none';
    }

    const allAnswered = answers.every(a => a !== null);
    const blockerActive = questions.some((q, i) => q.blocker && answers[i] === true);
    const skillGaps = questions.filter((q, i) => !q.blocker && answers[i] === false).length;

    if (allAnswered) {
      if (blockerActive) {
        result.className = "admonition failure";
        result.innerHTML = `<p class="admonition-title">ISP-specific services may fail. We recommend using 'Bridge Mode' instead of a full bypass.</p>`;
      } else if (skillGaps >= 2) {
        result.className = "admonition warning";
        result.innerHTML = `<p class="admonition-title">Your responses suggest a skill gap. Reconsider your reasoning to bypass.</p>`;
      } else {
        result.className = "admonition success";
        result.innerHTML = `<p class="admonition-title">You have the requisite knowledge to bypass, please proceed with due-diligence.</p>`;
      }
      result.style.display = 'block';
    } else {
      result.style.display = 'none';
    }

    const yesBtn = container.querySelector('#yes');
    const noBtn = container.querySelector('#no');

    yesBtn.className = (answers[idx] === true) ? "md-button md-button--primary" : "md-button";
    noBtn.className = (answers[idx] === false) ? "md-button md-button--primary" : "md-button";

    container.querySelector('#prev').disabled = (idx === 0);
    container.querySelector('#next').disabled = (idx === questions.length - 1);
  };

  const init = () => {
    const container = document.querySelector('#questionnaire');
    if (!container) return;

    container.querySelector('#yes').onclick = () => { answers[idx] = true; updateUI(container); };
    container.querySelector('#no').onclick = () => { answers[idx] = false; updateUI(container); };
    container.querySelector('#prev').onclick = () => { if (idx > 0) { idx--; updateUI(container); }};
    container.querySelector('#next').onclick = () => { if (idx < questions.length - 1) { idx++; updateUI(container); }};

    updateUI(container);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

## Practical Recommendations

Follow a cautious, test‑driven approach.

- [ ] **Define goals**

    !!! tip "Speed should be ^^an afterthought^^, not the main focus."

    - [ ] Secure DNS
    - [ ] Ad-Blocking
    - [ ] VPN
    - [ ] IDS/IPS
    - [ ] Self-hosting
    - [ ] Form factor

- [ ] **Confirm ISP requirements**

    - [ ] VLANs (Triple Play)
    - [ ] Authentication (PPPoE, Dot1X, MAC)
    - [ ] VoIP
    - [ ] IPTV (IGMP)

- [ ] **Research purpose‑built hardware**

    !!! tip "Avoid all‑in‑one's! Do not rely on mesh routers or gaming routers for core routing and security."

    - [ ] **Gateway/Router:** Dedicated device for routing, firewall, VPN, and IDS/IPS.
    - [ ] **Access Points:** Managed wireless access points for Wi‑Fi coverage.
    - [ ] **Switches:** Managed switches for VLANs, PoE, and traffic control.

- [ ] **Evaluate current setup**

    !!! tip "Before attempting a full bypass, run your custom router behind the ISP CPE in ^^passthrough or bridge mode^^. For most users, this setup is sufficient."

    - [ ] Enable bridge mode
    - [ ] Utilize the 10Gbps Ethernet port
