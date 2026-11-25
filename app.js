/**
 * Pulsenmore Marketing Scan Review - Application Engine
 * Pure Vanilla JavaScript Single-Page Application
 * 
 * Features:
 * - 2 Scans Only: Jozzy (App Guided, Week 34) & BPP (Clinician Guided, Week 29)
 * - Multi-Step Carousel View with dynamic video thumbnails
 * - Main Large Screen Video Player with frame-stepping, speeds (0.25x - 2.0x), and medical HUD
 * - Responsive Case Properties and Ultrasound Parameters panels
 */

(function () {
  'use strict';

  // ==========================================================================
  // Data Model: Two Scans Only
  // ==========================================================================
  const SCANS_DATA = {
    jozzy: {
      id: 'jozzy',
      name: 'Jozzy',
      mode: 'AG',
      modeLabel: 'App Guided (AG)',
      gestationalAge: 'Week 34',
      weekNum: 34,
      study: 'Jozzy Protocol',
      key: '3N766C5QWYXK_1',
      folder: 'Video_02/Jozzy_App Guided, Gestetional week 34/',
      folderDisplay: 'Jozzy_App Guided, Gestetional week 34',
      description: 'Patient-administered at-home scanning guided step-by-step by the Pulsenmore mobile application.',
      assessment: 'App-guided obstetric examination successfully acquired at 34 weeks gestation. Cardiac activity confirmed with regular rhythm. Fetal gross body movement and amniotic fluid single deepest pocket meet clinical protocol criteria.',
      steps: [
        {
          stepNumber: 1,
          title: 'Step 1: Scan Overview & Anatomical Landmarks',
          filename: '3N766C5QWYXK_1_1.webm',
          finding: 'Anatomical Overview',
          duration: '0:25'
        },
        {
          stepNumber: 2,
          title: 'Step 2: Fetal Heart Chamber & Rhythm',
          filename: '3N766C5QWYXK_1_2.webm',
          finding: 'Cardiac Motion',
          duration: '0:45'
        },
        {
          stepNumber: 3,
          title: 'Step 3: Fetal Gross Movement & Profile',
          filename: '3N766C5QWYXK_1_3.webm',
          finding: 'Gross Body Movement',
          duration: '0:48'
        },
        {
          stepNumber: 4,
          title: 'Step 4: Amniotic Fluid Pocket (MVP)',
          filename: '3N766C5QWYXK_1_4.webm',
          finding: 'Amniotic Fluid',
          duration: '0:29'
        },
        {
          stepNumber: 5,
          title: 'Step 5: Placental Texture & Cord Localization',
          filename: '3N766C5QWYXK_1_5.webm',
          finding: 'Placenta & Cord',
          duration: '0:36'
        }
      ]
    },

    bpp: {
      id: 'bpp',
      name: 'BPP Study',
      mode: 'CG',
      modeLabel: 'Clinician Guided (CG)',
      gestationalAge: 'Week 29',
      weekNum: 29,
      study: 'BPP Clinical Study',
      key: 'EZ4JQNG5MWAR_1',
      folder: 'Video_02/Pulsenmore ES, Clinician Guided, Gestational Week - 29 (Source BPP Study)/',
      folderDisplay: 'Pulsenmore ES, Clinician Guided, Gestational Week - 29 (Source BPP Study)',
      description: 'Comprehensive Biophysical Profile scan protocol conducted under direct clinician guidance.',
      assessment: 'Clinician-guided Biophysical Profile (BPP) protocol completed at 29 weeks. Fetal tone, cardiac four-chamber anatomy, amniotic fluid volume, and thoracic movements verified in full compliance with study endpoints.',
      steps: [
        {
          stepNumber: 1,
          title: 'Step 1: Cardiac Four-Chamber View',
          filename: 'EZ4JQNG5MWAR_1_1.webm',
          finding: 'Four Chamber Heart',
          duration: '0:51'
        },
        {
          stepNumber: 2,
          title: 'Step 2: Fetal Spine Longitudinal Alignment',
          filename: 'EZ4JQNG5MWAR_1_2.webm',
          finding: 'Spine & Neural Axis',
          duration: '0:40'
        },
        {
          stepNumber: 3,
          title: 'Step 3: Maximum Vertical Pocket (MVP)',
          filename: 'EZ4JQNG5MWAR_1_3.webm',
          finding: 'Amniotic Fluid Pocket',
          duration: '0:45'
        },
        {
          stepNumber: 4,
          title: 'Step 4: Fetal Trunk & Gross Body Movement',
          filename: 'EZ4JQNG5MWAR_1_4.webm',
          finding: 'Fetal Trunk Motion',
          duration: '0:39'
        },
        {
          stepNumber: 5,
          title: 'Step 5: Placental Texture & Position',
          filename: 'EZ4JQNG5MWAR_1_5.webm',
          finding: 'Placental Parenchyma',
          duration: '0:38'
        },
        {
          stepNumber: 6,
          title: 'Step 6: Fetal Biometry - Thoracic Section',
          filename: 'EZ4JQNG5MWAR_1_6.webm',
          finding: 'Thoracic Section',
          duration: '0:12'
        },
        {
          stepNumber: 7,
          title: 'Step 7: Fetal Extremities & Muscle Tone',
          filename: 'EZ4JQNG5MWAR_1_7.webm',
          finding: 'Limb Flexion & Tone',
          duration: '0:51'
        },
        {
          stepNumber: 8,
          title: 'Step 8: Fetal Breathing Movements',
          filename: 'EZ4JQNG5MWAR_1_8.webm',
          finding: 'Diaphragmatic Motion',
          duration: '0:42'
        },
        {
          stepNumber: 9,
          title: 'Step 9: Fetal Profile & Facial Features',
          filename: 'EZ4JQNG5MWAR_1_9.webm',
          finding: 'Facial Profile',
          duration: '0:42'
        },
        {
          stepNumber: 10,
          title: 'Step 10: Umbilical Cord Doppler Flow',
          filename: 'EZ4JQNG5MWAR_1_10.webm',
          finding: 'Umbilical Cord Flow',
          duration: '0:39'
        }
      ]
    }
  };

  // ==========================================================================
  // Application State
  // ==========================================================================
  const state = {
    currentScanId: 'jozzy', // 'jozzy' or 'bpp'
    currentStepIndex: 0,    // 0-based index into active scan's steps array
    hudVisible: true,
    thumbnailCache: new Map() // filename -> dataURL
  };

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const elements = {
    // Nav & Scan Selectors
    btnNavJozzy: document.getElementById('btnNavJozzy'),
    btnNavBpp: document.getElementById('btnNavBpp'),
    cardScanJozzy: document.getElementById('cardScanJozzy'),
    cardScanBpp: document.getElementById('cardScanBpp'),
    scanStatusIndicator: document.getElementById('scanStatusIndicator'),
    btnQuickInfo: document.getElementById('btnQuickInfo'),

    // Active Scan Header
    activeModeBadge: document.getElementById('activeModeBadge'),
    activeScanHeading: document.getElementById('activeScanHeading'),
    activeKeyBadge: document.getElementById('activeKeyBadge'),
    activeStepCounterTag: document.getElementById('activeStepCounterTag'),
    activeStepNameHeading: document.getElementById('activeStepNameHeading'),
    btnDownloadClip: document.getElementById('btnDownloadClip'),

    // Main Large Video Player & Controls
    largePlayerFrame: document.getElementById('largePlayerFrame'),
    mainVideoPlayer: document.getElementById('mainVideoPlayer'),
    centerPlayBtn: document.getElementById('centerPlayBtn'),
    btnPrevStepChevron: document.getElementById('btnPrevStepChevron'),
    btnNextStepChevron: document.getElementById('btnNextStepChevron'),
    btnPlayPause: document.getElementById('btnPlayPause'),
    btnPrevFrame: document.getElementById('btnPrevFrame'),
    btnNextFrame: document.getElementById('btnNextFrame'),
    playerScrubber: document.getElementById('playerScrubber'),
    scrubberProgress: document.getElementById('scrubberProgress'),
    timeDisplay: document.getElementById('timeDisplay'),
    btnSpeedSelector: document.getElementById('btnSpeedSelector'),
    speedMenu: document.getElementById('speedMenu'),
    btnLoopToggle: document.getElementById('btnLoopToggle'),
    btnToggleHud: document.getElementById('btnToggleHud'),
    btnFullscreen: document.getElementById('btnFullscreen'),
    ultrasoundHud: document.getElementById('ultrasoundHud'),

    // Step Carousel
    carouselSubtext: document.getElementById('carouselSubtext'),
    carouselScrollLeft: document.getElementById('carouselScrollLeft'),
    carouselScrollRight: document.getElementById('carouselScrollRight'),
    stepCarouselTrack: document.getElementById('stepCarouselTrack'),

    // Case Properties Sidebar
    propTabButtons: document.querySelectorAll('.prop-tab-btn'),
    paneProperties: document.getElementById('paneProperties'),
    paneParameters: document.getElementById('paneParameters'),
    paneProtocol: document.getElementById('paneProtocol'),
    cpScanName: document.getElementById('cpScanName'),
    cpModeLabel: document.getElementById('cpModeLabel'),
    cpGestationalAge: document.getElementById('cpGestationalAge'),
    cpActiveStep: document.getElementById('cpActiveStep'),
    cpFilename: document.getElementById('cpFilename'),
    cpScanKey: document.getElementById('cpScanKey'),
    cpTotalSteps: document.getElementById('cpTotalSteps'),
    cpAssessmentText: document.getElementById('cpAssessmentText'),
    protocolStepsList: document.getElementById('protocolStepsList'),

    // Info Modal & Toast
    infoModal: document.getElementById('infoModal'),
    btnCloseInfoModal: document.getElementById('btnCloseInfoModal'),
    toastMessage: document.getElementById('toastMessage')
  };

  // ==========================================================================
  // Helper: Construct Video URL
  // ==========================================================================
  function getVideoUrl(scan, step) {
    const rawPath = `${scan.folder}${step.filename}`;
    return encodeURI(rawPath);
  }

  // ==========================================================================
  // Scan Switching (Jozzy <-> BPP)
  // ==========================================================================
  function selectScan(scanId, targetStepIndex = 0) {
    if (!SCANS_DATA[scanId]) return;

    state.currentScanId = scanId;
    state.currentStepIndex = targetStepIndex;
    const scan = SCANS_DATA[scanId];

    // 1. Update Scan Selector Cards
    elements.cardScanJozzy.classList.toggle('active', scanId === 'jozzy');
    elements.cardScanBpp.classList.toggle('active', scanId === 'bpp');

    // 2. Update Nav Switcher Pills
    elements.btnNavJozzy.classList.toggle('active', scanId === 'jozzy');
    elements.btnNavBpp.classList.toggle('active', scanId === 'bpp');

    // 3. Update Scan Header
    elements.activeModeBadge.textContent = scan.modeLabel;
    elements.activeModeBadge.className = `active-mode-badge ${scan.mode.toLowerCase()}`;
    elements.activeScanHeading.textContent = `${scan.name} — Gestational ${scan.gestationalAge}`;
    elements.activeKeyBadge.textContent = scan.key;

    // 4. Update Case Properties Panel
    elements.cpScanName.textContent = scan.name;
    elements.cpModeLabel.textContent = scan.modeLabel;
    elements.cpGestationalAge.textContent = scan.gestationalAge;
    elements.cpScanKey.textContent = scan.key;
    elements.cpTotalSteps.textContent = `${scan.steps.length} Steps`;
    elements.cpAssessmentText.textContent = scan.assessment;

    // Populate Protocol Steps List in Tab 3
    elements.protocolStepsList.innerHTML = '';
    scan.steps.forEach(st => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${st.title}</strong> &mdash; <span style="color: var(--text-dim);">${st.finding}</span>`;
      elements.protocolStepsList.appendChild(li);
    });

    // 5. Build the Carousel of Step Thumbnails
    renderStepCarousel(scan);

    // 6. Load Step into Main Screen Video Player
    loadStepIntoMainScreen(scan, targetStepIndex);

    // Smooth scroll workspace into view if user clicked card from top
    showToast(`Loaded ${scan.name} (${scan.modeLabel}, ${scan.gestationalAge})`);
  }

  // ==========================================================================
  // Render Step Carousel
  // ==========================================================================
  function renderStepCarousel(scan) {
    elements.stepCarouselTrack.innerHTML = '';
    elements.carouselSubtext.textContent = `${scan.steps.length} sequential ultrasound steps in this scan protocol. Click any thumbnail to view.`;

    scan.steps.forEach((step, index) => {
      const card = document.createElement('div');
      card.className = `step-card ${scan.mode === 'AG' ? 'ag-step' : ''}`;
      card.dataset.stepIndex = index;

      if (index === state.currentStepIndex) {
        card.classList.add('active');
      }

      card.innerHTML = `
        <div class="step-card-thumb-wrap">
          <img class="step-card-thumb-img" alt="${step.title}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%231a1e26'/%3E%3C/svg%3E">
          <span class="step-card-badge-step">Step ${step.stepNumber}</span>
          <span class="step-card-duration">${step.duration}</span>
          <div class="step-card-play-overlay">
            <div class="step-play-mini-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
        <div class="step-card-content">
          <div class="step-card-title">${step.title}</div>
          <span class="step-card-status-label">${index === state.currentStepIndex ? 'Now Playing' : step.finding}</span>
        </div>
      `;

      // Generate dynamic thumbnail from video frame
      const thumbImg = card.querySelector('.step-card-thumb-img');
      generateVideoThumbnail(scan, step, (dataUrl) => {
        if (thumbImg) thumbImg.src = dataUrl;
      });

      // Click handler: click thumbnail -> change main screen!
      card.addEventListener('click', () => {
        loadStepIntoMainScreen(scan, index);
      });

      elements.stepCarouselTrack.appendChild(card);
    });
  }

  // ==========================================================================
  // Load Step Into Main Large Screen
  // ==========================================================================
  function loadStepIntoMainScreen(scan, stepIndex) {
    if (stepIndex < 0 || stepIndex >= scan.steps.length) return;

    state.currentStepIndex = stepIndex;
    const step = scan.steps[stepIndex];
    const videoUrl = getVideoUrl(scan, step);

    // 1. Update Video Element Source
    elements.mainVideoPlayer.src = videoUrl;
    elements.mainVideoPlayer.playbackRate = 1.0;
    elements.mainVideoPlayer.loop = true;
    elements.btnSpeedSelector.textContent = '1.0x';

    // Auto-play
    elements.mainVideoPlayer.play().then(() => {
      updatePlayPauseUI(true);
    }).catch(() => {
      updatePlayPauseUI(false);
    });

    // 2. Update Step Headers & Counters
    elements.activeStepCounterTag.textContent = `Step ${step.stepNumber} of ${scan.steps.length}`;
    elements.activeStepNameHeading.textContent = step.title;
    elements.cpActiveStep.textContent = `Step ${step.stepNumber} of ${scan.steps.length}`;
    elements.cpFilename.textContent = step.filename;

    // 3. Update Chevron States
    elements.btnPrevStepChevron.style.opacity = stepIndex > 0 ? '1' : '0.35';
    elements.btnNextStepChevron.style.opacity = stepIndex < scan.steps.length - 1 ? '1' : '0.35';

    // 4. Update Active Thumbnail Highlight in Carousel
    const stepCards = elements.stepCarouselTrack.querySelectorAll('.step-card');
    stepCards.forEach((c, idx) => {
      const isActive = idx === stepIndex;
      c.classList.toggle('active', isActive);
      const statusLabel = c.querySelector('.step-card-status-label');
      if (statusLabel) {
        statusLabel.textContent = isActive ? 'Now Playing' : scan.steps[idx].finding;
      }

      // Scroll active card into view within carousel
      if (isActive) {
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  // ==========================================================================
  // Dynamic Canvas Ultrasound Thumbnail Generation
  // ==========================================================================
  function generateVideoThumbnail(scan, step, callback) {
    const cacheKey = `${scan.id}_${step.filename}`;
    if (state.thumbnailCache.has(cacheKey)) {
      callback(state.thumbnailCache.get(cacheKey));
      return;
    }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = getVideoUrl(scan, step);
    video.muted = true;
    video.preload = 'metadata';

    // Fallback timer if video cannot decode on certain origins
    const timeout = setTimeout(() => {
      const fallbackUrl = createUltrasoundFallbackCanvas(step.stepNumber, scan.mode);
      state.thumbnailCache.set(cacheKey, fallbackUrl);
      callback(fallbackUrl);
    }, 2800);

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(0.5, video.duration > 1 ? 1.0 : 0.1);
    });

    video.addEventListener('seeked', () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');

        // Dark gray ultrasound backdrop
        ctx.fillStyle = '#171b21';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Subtle ultrasound depth vignette
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, 'rgba(0,0,0,0.4)');
        grad.addColorStop(0.2, 'rgba(0,0,0,0)');
        grad.addColorStop(0.8, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        state.thumbnailCache.set(cacheKey, dataUrl);
        callback(dataUrl);
      } catch (err) {
        const fallbackUrl = createUltrasoundFallbackCanvas(step.stepNumber, scan.mode);
        state.thumbnailCache.set(cacheKey, fallbackUrl);
        callback(fallbackUrl);
      }
    });

    video.addEventListener('error', () => {
      clearTimeout(timeout);
      const fallbackUrl = createUltrasoundFallbackCanvas(step.stepNumber, scan.mode);
      state.thumbnailCache.set(cacheKey, fallbackUrl);
      callback(fallbackUrl);
    });
  }

  function createUltrasoundFallbackCanvas(stepNum, mode) {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');

    // Dark gray ultrasound background
    ctx.fillStyle = '#1a1e26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Curvilinear ultrasound acoustic sector visualization
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(240, 15);
    ctx.arc(240, 15, 240, Math.PI * 0.28, Math.PI * 0.72);
    ctx.closePath();
    ctx.clip();

    // Noise scanlines
    for (let y = 20; y < 260; y += 4) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.12 + 0.02})`;
      ctx.fillRect(60, y, 360, 2);
    }

    // Fetal curved anatomical echo
    ctx.beginPath();
    ctx.arc(240, 140, 55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.restore();

    // Step watermark
    ctx.fillStyle = mode === 'AG' ? 'rgba(0, 180, 216, 0.6)' : 'rgba(229, 57, 53, 0.6)';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText(`STEP ${stepNum}`, 20, 250);

    return canvas.toDataURL('image/jpeg', 0.8);
  }

  // ==========================================================================
  // Video Player Controls & UI
  // ==========================================================================
  function updatePlayPauseUI(isPlaying) {
    const playIcon = elements.btnPlayPause.querySelector('.icon-play');
    const pauseIcon = elements.btnPlayPause.querySelector('.icon-pause');

    if (isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      elements.centerPlayBtn.classList.remove('visible');
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      elements.centerPlayBtn.classList.add('visible');
    }
  }

  function togglePlayPause() {
    if (elements.mainVideoPlayer.paused) {
      elements.mainVideoPlayer.play();
      updatePlayPauseUI(true);
    } else {
      elements.mainVideoPlayer.pause();
      updatePlayPauseUI(false);
    }
  }

  function stepFrame(seconds) {
    elements.mainVideoPlayer.pause();
    updatePlayPauseUI(false);
    elements.mainVideoPlayer.currentTime = Math.max(0, Math.min(
      elements.mainVideoPlayer.duration || 0,
      elements.mainVideoPlayer.currentTime + seconds
    ));
  }

  function navigateStep(direction) {
    const scan = SCANS_DATA[state.currentScanId];
    const newIndex = state.currentStepIndex + direction;
    if (newIndex >= 0 && newIndex < scan.steps.length) {
      loadStepIntoMainScreen(scan, newIndex);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function triggerDownload() {
    const scan = SCANS_DATA[state.currentScanId];
    const step = scan.steps[state.currentStepIndex];
    const videoUrl = getVideoUrl(scan, step);

    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = step.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading ${step.filename}`);
  }

  function showToast(msg) {
    elements.toastMessage.textContent = msg;
    elements.toastMessage.classList.add('show');
    setTimeout(() => {
      elements.toastMessage.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Scan Switchers (Cards)
    elements.cardScanJozzy.addEventListener('click', () => selectScan('jozzy', 0));
    elements.cardScanBpp.addEventListener('click', () => selectScan('bpp', 0));

    // Nav Switcher Pills
    elements.btnNavJozzy.addEventListener('click', () => selectScan('jozzy', 0));
    elements.btnNavBpp.addEventListener('click', () => selectScan('bpp', 0));

    // Video Player Center & Play/Pause Button
    elements.centerPlayBtn.addEventListener('click', togglePlayPause);
    elements.mainVideoPlayer.addEventListener('click', togglePlayPause);
    elements.btnPlayPause.addEventListener('click', togglePlayPause);

    // Frame-by-frame Buttons
    elements.btnPrevFrame.addEventListener('click', () => stepFrame(-0.04));
    elements.btnNextFrame.addEventListener('click', () => stepFrame(0.04));

    // Floating Prev / Next Step Chevrons
    elements.btnPrevStepChevron.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateStep(-1);
    });
    elements.btnNextStepChevron.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateStep(1);
    });

    // Scrubber & Progress Tracking
    elements.mainVideoPlayer.addEventListener('timeupdate', () => {
      const v = elements.mainVideoPlayer;
      if (!isNaN(v.duration) && v.duration > 0) {
        const percent = (v.currentTime / v.duration) * 100;
        elements.playerScrubber.value = percent;
        elements.scrubberProgress.style.width = `${percent}%`;
        elements.timeDisplay.textContent = `${formatTime(v.currentTime)} / ${formatTime(v.duration)}`;
      }
    });

    elements.playerScrubber.addEventListener('input', (e) => {
      const v = elements.mainVideoPlayer;
      if (!isNaN(v.duration)) {
        v.currentTime = (e.target.value / 100) * v.duration;
      }
    });

    elements.mainVideoPlayer.addEventListener('play', () => updatePlayPauseUI(true));
    elements.mainVideoPlayer.addEventListener('pause', () => updatePlayPauseUI(false));

    // Carousel Left / Right Scroll Buttons
    elements.carouselScrollLeft.addEventListener('click', () => {
      elements.stepCarouselTrack.scrollBy({ left: -240, behavior: 'smooth' });
    });
    elements.carouselScrollRight.addEventListener('click', () => {
      elements.stepCarouselTrack.scrollBy({ left: 240, behavior: 'smooth' });
    });

    // Speed Selector Menu
    elements.btnSpeedSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.speedMenu.style.display = elements.speedMenu.style.display === 'none' ? 'flex' : 'none';
    });

    document.addEventListener('click', () => {
      elements.speedMenu.style.display = 'none';
    });

    elements.speedMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        elements.mainVideoPlayer.playbackRate = speed;
        elements.btnSpeedSelector.textContent = `${speed}x`;
        elements.speedMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        elements.speedMenu.style.display = 'none';
        showToast(`Playback speed: ${speed}x`);
      });
    });

    // Loop Toggle
    elements.btnLoopToggle.addEventListener('click', () => {
      elements.mainVideoPlayer.loop = !elements.mainVideoPlayer.loop;
      elements.btnLoopToggle.classList.toggle('active', elements.mainVideoPlayer.loop);
      showToast(elements.mainVideoPlayer.loop ? 'Looping enabled' : 'Looping disabled');
    });

    // HUD Toggle
    elements.btnToggleHud.addEventListener('click', () => {
      state.hudVisible = !state.hudVisible;
      elements.ultrasoundHud.style.display = state.hudVisible ? 'flex' : 'none';
      elements.btnToggleHud.classList.toggle('active', state.hudVisible);
    });

    // Fullscreen Toggle
    elements.btnFullscreen.addEventListener('click', () => {
      const frame = elements.largePlayerFrame;
      if (!document.fullscreenElement) {
        frame.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Download Button
    elements.btnDownloadClip.addEventListener('click', triggerDownload);

    // Sidebar Properties Tabs
    elements.propTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.propTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabKey = btn.dataset.tab;
        elements.paneProperties.style.display = tabKey === 'properties' ? 'flex' : 'none';
        elements.paneParameters.style.display = tabKey === 'parameters' ? 'flex' : 'none';
        elements.paneProtocol.style.display = tabKey === 'protocol' ? 'flex' : 'none';
      });
    });

    // Quick Info Modal
    elements.btnQuickInfo.addEventListener('click', () => {
      elements.infoModal.style.display = 'flex';
      elements.infoModal.classList.add('open');
    });
    elements.btnCloseInfoModal.addEventListener('click', () => {
      elements.infoModal.style.display = 'none';
      elements.infoModal.classList.remove('open');
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateStep(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateStep(1);
      } else if (e.key === '1') {
        selectScan('jozzy', 0);
      } else if (e.key === '2') {
        selectScan('bpp', 0);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        elements.btnFullscreen.click();
      } else if (e.key === 'Escape' && elements.infoModal.classList.contains('open')) {
        elements.infoModal.style.display = 'none';
        elements.infoModal.classList.remove('open');
      }
    });
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    setupEventListeners();
    // Start with Jozzy scan by default
    selectScan('jozzy', 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
