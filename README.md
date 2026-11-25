# Pulsenmore Marketing Clinical Scan Review

An interactive, responsive single-page ultrasound clinical scan review application built for Pulsenmore marketing, sales teams, physicians, and clinical partners.

Features **2 complete clinical ultrasound scan examinations** acquired using the **Pulsenmore ES** handheld fetal ultrasound system, located in `Video_02/`:
1. **Jozzy** &mdash; **App Guided (AG)**, Gestational Week 34 *(5 sequential clinical step clips)*
2. **BPP Study** &mdash; **Clinician Guided (CG)**, Gestational Week 29 *(10 sequential clinical step clips)*

---

## 🌟 Key Capabilities

- **Scan Selection Switcher:** Switch between the **App Guided (Jozzy)** and **Clinician Guided (BPP)** protocols from the navigation bar or interactive hero cards.
- **Main Large Ultrasound Screen:** 
  - Ultrasound depth calibration scale (`0, 50, 100, 150 cm`) matching the Pulsenmore Clinician Dashboard.
  - Medical HUD technical parameters overlay (`MI: 0.6`, `TIS: 0.1`, `FPS: 25 Hz`, `Depth: 18.0 cm`, `Gain: 73%`, `Frequency: 5.0 MHz`).
  - Frame-by-frame step navigation (`⏮ -0.04s` and `⏭ +0.04s`) for detailed valve and cardiac motion evaluation.
  - Multi-speed playback: `0.25x` (slow-motion for valve dynamics), `0.5x`, `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`.
  - Loop playback and fullscreen controls.
  - Next / Previous step floating navigation chevrons.
- **Step Carousel & Filmstrip View:**
  - Displays all steps of the active examination in a smooth horizontal carousel.
  - Shows dynamic ultrasound thumbnails generated via HTML5 `<canvas>`, duration, and step title.
  - **Clicking any thumbnail immediately changes the main screen video.**
  - Current step is highlighted with glowing active borders (Cyan for App Guided, Pulsenmore Red for Clinician Guided).
- **Case Properties & Ultrasound Parameters:**
  - Side panel providing detailed metadata matching the Pulsenmore Clinician Dashboard (`CASE PROPERTIES`, `US PARAMETERS`, and `PROTOCOL`).
- **Dark Gray Theme:**
  - Charcoal / slate dark gray visual design system (`#1e2228`, `#272d36`, `#2b313b`).

---

## 📁 Repository Structure

```
Pulsenmore_Marketing_Scan/
├── index.html                 # Main Single-Page Application
├── styles.css                 # Medical Dark Gray styling, carousel, and HUD overlays
├── app.js                     # Scan data model, carousel engine, and player controls
├── README.md                  # Project documentation
├── .gitignore                 # Excludes legacy video caches
└── Video_02/                  # The 2 Marketing Clinical Scans
    ├── Jozzy_App Guided, Gestetional week 34/
    │   ├── 3N766C5QWYXK_1_1.webm    # Step 1: Scan Overview & Positioning
    │   ├── 3N766C5QWYXK_1_2.webm    # Step 2: Fetal Heart Chamber & Rhythm
    │   ├── 3N766C5QWYXK_1_3.webm    # Step 3: Fetal Movement & Profile
    │   ├── 3N766C5QWYXK_1_4.webm    # Step 4: Amniotic Fluid Pocket (MVP)
    │   └── 3N766C5QWYXK_1_5.webm    # Step 5: Placental Texture & Cord
    └── Pulsenmore ES, Clinician Guided, Gestational Week - 29 (Source BPP Study)/
        ├── EZ4JQNG5MWAR_1_1.webm     # Step 1: Cardiac Four-Chamber View
        ├── EZ4JQNG5MWAR_1_2.webm     # Step 2: Fetal Spine Longitudinal
        ├── EZ4JQNG5MWAR_1_3.webm     # Step 3: Maximum Vertical Pocket (MVP)
        ├── EZ4JQNG5MWAR_1_4.webm     # Step 4: Fetal Trunk & Body Movement
        ├── EZ4JQNG5MWAR_1_5.webm     # Step 5: Placental Texture & Position
        ├── EZ4JQNG5MWAR_1_6.webm     # Step 6: Fetal Biometry - Thoracic
        ├── EZ4JQNG5MWAR_1_7.webm     # Step 7: Fetal Extremities & Tone
        ├── EZ4JQNG5MWAR_1_8.webm     # Step 8: Fetal Breathing Movements
        ├── EZ4JQNG5MWAR_1_9.webm     # Step 9: Fetal Profile & Facial Features
        └── EZ4JQNG5MWAR_1_10.webm    # Step 10: Umbilical Cord Doppler Flow
```

---

## 💻 How to Run Locally

### Option 1: Double Click `index.html`
Simply double-click [`index.html`](index.html) to open directly in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option 2: Local HTTP Server (Python)
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause active step video |
| `←` / `→` | Previous / Next scan step |
| `1` | Switch to **Jozzy** (App Guided, Week 34) |
| `2` | Switch to **BPP Study** (Clinician Guided, Week 29) |
| `F` | Toggle Fullscreen |
