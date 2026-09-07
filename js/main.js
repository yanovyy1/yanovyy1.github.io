(() => {
  const PROJECTS = {
    freelance: {
      label: 'freelance',
      title: 'Freelance',
      role: 'Motion Design',
      period: '2018 — Present',
      desc: [
        'Full-cycle motion design — script to final edit, sound design, color grade',
        'Typography, icon, illustration & UI animation',
        'Performance creatives for Tier-1 markets (US, Europe, Asia) — Instagram, TikTok, Facebook, Google',
      ],
      media: ['freelance_5.mp4', 'freelance_4.mp4'],
      mediaCount: 9,
      mediaColumns: 3,
    },
    glam: {
      label: 'ai design',
      title: 'Glam app',
      role: 'Lead Motion Designer / AI Artist',
      period: '2023 — 2024',
      desc: [
        'Led a content team of 5 designers + 5–7 outsource creators',
        'Built a production pipeline delivering 50+ creatives a week',
        'Tested new AI tools and helped integrate them into the product',
        'Helped grow the app to 1M+ users',
      ],
      media: ['glam_1.mp4', 'glam_2.mp4'],
      mediaCount: 9,
      mediaColumns: 3,
    },
    prequel: {
      label: 'advertising',
      title: 'Prequel app',
      role: 'Marketing Motion Designer',
      period: '2021 — 2023',
      desc: [
        'Ad creatives for Instagram, TikTok, Facebook & Google Ads',
        'Trend research and new creative concepts from scratch',
        'Close collaboration with product & analytics teams, A/B testing',
        '30+ creatives shipped, scaled with budgets from $10k/video',
        'Steady output of 3–6 ad packs a week, zero missed deadlines',
      ],
      media: ['prequel_01.mp4', 'prequel_02.mp4', 'prequel_03.mp4', 'prequel_04.mp4', 'prequel_05.mp4', 'prequel_06.mp4'],
      mediaCount: 9,
      mediaPlaceholder: 'NDA',
      mediaColumns: 3,
    },
    other: {
      label: 'showcase',
      title: 'AI Generations',
      role: 'Generative AI',
      period: 'Various projects',
      desc: [
        'A curated set of AI-generated visuals and clips',
        'Pulled from several client projects — names withheld under NDA',
        'Made with Midjourney, Kling, Seedance, Nano Banana & other AI tools',
      ],
      media: [
        'Other_1.mp4', 'Other_2.mp4', 'Other_3.mp4',
        'ai_01.mp4', 'ai_02.mp4', 'ai_03.mp4', 'ai_04.mp4', 'ai_05.mp4',
      ],
      mediaCount: 9,
      mediaColumns: 3,
    },
    denim: {
      label: 'content',
      title: '495 Denim',
      role: 'Content Creator',
      period: '',
      desc: [
        'Motion & graphic design — ad creatives and content for IG, TikTok, FB, Google Ads',
        'Print/apparel visuals and packaging concepts',
        'Seasonal concept planning and photo retouching',
        'Audience, competitor & trend analysis with monthly reporting',
        'Sourced UGC creators, wrote briefs and reviewed delivery',
      ],
      media: ['495_01.mp4', '495_02.mp4', '495_03.mp4', '495_04.mp4', '495_05.mp4', '495_06.mp4', '495_07.mp4', '495_08.mp4', '495_09.mp4'],
      mediaCount: 9,
      mediaColumns: 3,
    },
  };

  /* ---------- Theme toggle (persisted in localStorage) ----------
     The actual switch already happened before first paint - an inline
     script in index.html's <head> reads localStorage and sets
     data-theme="dark" on <html> synchronously, so there's no flash of the
     light theme on a dark-mode reload. This just keeps the button's label
     in sync and remembers new choices. */
  const THEME_KEY = 'theme';
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleLabel = document.getElementById('themeToggleLabel');

  const currentTheme = () => (htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const applyTheme = (theme) => {
    if (theme === 'dark') htmlEl.setAttribute('data-theme', 'dark');
    else htmlEl.removeAttribute('data-theme');
    if (themeToggleLabel) themeToggleLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  };
  applyTheme(currentTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Fade-in on load ---------- */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('is-visible'));
    });
  });

  /* ---------- Custom cursor (pointer devices only) ---------- */
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursorDot = document.getElementById('cursorDot');

  if (isFinePointer && cursorDot) {
    document.documentElement.classList.add('has-custom-cursor');
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursorDot.classList.add('is-active');
    });
    /* Delegated (not bound per-element) because the project list and work
       track below are generated after this runs - a direct querySelectorAll
       here would miss every button in them. */
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button')) cursorDot.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button')) cursorDot.classList.remove('is-hover');
    });
    document.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
  }

  /* ---------- Live local-time clock (top nav) ---------- */
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value || '';
    const tick = () => {
      const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      clockEl.textContent = tzAbbr ? `${tzAbbr} ${time}` : time;
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Build the project list + scroll track ----------
     ORDER is the single source of truth for display order - reorder
     projects by editing this array only, nothing else derives order from
     PROJECTS' own key order. Both the sticky left-hand list and the tall
     center scroll track are generated from it, one <button>/<section> per
     project, each carrying its own <video> (lazy-loaded on first activation
     rather than all five up front). */
  const ORDER = ['denim', 'glam', 'prequel', 'freelance', 'other'];
  const projList = document.getElementById('projList');
  const workTrack = document.getElementById('workTrack');
  const footerCount = document.getElementById('footerCount');

  const posterFor = (file) => `assets/vids/posters/${file.replace(/\.mp4$/, '.jpg')}`;

  /* Posters are extracted ~15% into each clip, not at frame 0 (see the
     commit that added them) - it dodges black/blank opening frames on this
     footage. Seeking here to that same point before playing means the
     poster-to-video crossfade hands off between two frames that actually
     match, instead of jumping from the ~15% frame to frame 0 - which is
     what read as a flicker no matter how the crossfade itself was timed. */
  const PREVIEW_START_FRACTION = 0.15;
  const startPreviewVideo = (video) => {
    const seekAndPlay = () => {
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = video.duration * PREVIEW_START_FRACTION;
      }
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) seekAndPlay();
    else video.addEventListener('loadedmetadata', seekAndPlay, { once: true });
  };

  ORDER.forEach((key, i) => {
    const p = PROJECTS[key];
    const firstMedia = (p.media && p.media[0]) || null;

    const row = document.createElement('button');
    row.className = 'proj-row';
    row.dataset.project = key;
    row.style.setProperty('--d1', String(i + 1));
    row.innerHTML = `
      <span class="proj-row-thumb">${firstMedia ? `
        <img class="proj-row-poster" src="${posterFor(firstMedia)}" alt="" loading="lazy">
        <video class="proj-row-video" muted loop playsinline preload="none" data-file="${firstMedia}"></video>
      ` : ''}</span>
      <span class="proj-row-text">
        <span class="proj-row-name">${p.title}</span>
        <span class="proj-row-meta">${p.role}</span>
      </span>`;
    projList.appendChild(row);

    /* Reveal on the video's own 'playing' event, not on the play() promise -
       the promise resolves as soon as playback is requested, which on a
       fresh (preload="none") video is well before the first real frame is
       decoded, so cross-fading the video in right then flashed a blank/black
       frame for an instant. 'playing' only fires once a frame is actually
       about to render, so there's nothing left uncovered underneath. */
    const rowVideo = row.querySelector('.proj-row-video');
    if (rowVideo) {
      rowVideo.addEventListener('playing', () => {
        row.querySelector('.proj-row-thumb')?.classList.add('is-playing');
      });
    }

    const slide = document.createElement('section');
    slide.className = 'work-slide';
    slide.dataset.project = key;
    slide.innerHTML = `
      <button class="preview-frame-group" data-project="${key}" aria-label="Open ${p.title} case study">
        <span class="preview-frame">
          <img class="preview-poster" src="${firstMedia ? posterFor(firstMedia) : ''}" alt="">
          <video class="preview-video" muted loop playsinline preload="none" data-file="${firstMedia || ''}"></video>
          <span class="preview-frame-overlay">
            <span class="preview-frame-overlay-label">View project</span>
          </span>
        </span>
        <span class="preview-cta">View case study →</span>
      </button>
      <span class="preview-role">${p.role}</span>`;
    workTrack.appendChild(slide);

    const slideVideo = slide.querySelector('.preview-video');
    if (slideVideo) {
      slideVideo.addEventListener('playing', () => {
        slide.querySelector('.preview-frame')?.classList.add('is-playing');
      });
    }
  });

  const projRows = Array.from(document.querySelectorAll('.proj-row'));
  const slides = Array.from(document.querySelectorAll('.work-slide'));

  const workActiveTitle = document.getElementById('workActiveTitle');
  const setActive = (key) => {
    projRows.forEach((row) => row.classList.toggle('is-active', row.dataset.project === key));
    if (footerCount) {
      const idx = ORDER.indexOf(key) + 1;
      footerCount.textContent = `${String(idx).padStart(2, '0')} / ${String(ORDER.length).padStart(2, '0')}`;
    }
    if (workActiveTitle) workActiveTitle.textContent = PROJECTS[key].title;
  };
  setActive(ORDER[0]);

  /* ---------- Scroll-driven active project (desktop) ----------
     As a slide crosses the vertical center band of the viewport, it
     becomes "active": its list row bolds, the footer counter updates, and
     its video lazy-loads (first activation only) and plays muted+looping.
     Only the active slide's video plays - the other four stay paused. */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slide = entry.target;
          const key = slide.dataset.project;
          const video = slide.querySelector('.preview-video');
          const frame = slide.querySelector('.preview-frame');
          if (entry.isIntersecting) {
            setActive(key);
            if (video && video.dataset.file) {
              if (!video.src) {
                video.src = `assets/vids/${video.dataset.file}`;
                video.load();
              }
              startPreviewVideo(video);
            }
          } else if (video) {
            video.pause();
            frame.classList.remove('is-playing');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    slides.forEach((slide) => io.observe(slide));
  }

  /* ---------- Clicks: list row -> jump to slide (or open modal on mobile
     where the track is hidden); preview frame -> open modal ---------- */
  /* Kept in sync with the CSS breakpoint (see the comment above it in
     style.css) - a phone in landscape is wide enough to clear a
     width-only check, which used to leave it on the desktop hover-driven
     preview path where autoplay never got triggered by touch. */
  const isMobileLayout = () => window.matchMedia('(max-width: 720px), (max-height: 480px) and (pointer: coarse)').matches;

  /* ---------- Autoplay row thumbnails on mobile ----------
     .work-track (and its autoplaying videos) is display:none on mobile -
     without this, the mobile list is a purely static gallery even though
     motion is the actual product. Each row's thumbnail lazy-loads and
     plays its clip while the row is substantially in view, muted+looping,
     same as the desktop preview. Guarded by isMobileLayout() so a resize
     back to desktop width doesn't fight the .work-track videos. */
  if ('IntersectionObserver' in window) {
    const rowIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const row = entry.target;
          const thumb = row.querySelector('.proj-row-thumb');
          const video = row.querySelector('.proj-row-video');
          if (!thumb || !video) return;
          if (entry.isIntersecting && isMobileLayout()) {
            if (!video.src) {
              video.src = `assets/vids/${video.dataset.file}`;
              video.load();
            }
            startPreviewVideo(video);
          } else {
            video.pause();
            thumb.classList.remove('is-playing');
          }
        });
      },
      { threshold: 0.5 }
    );
    projRows.forEach((row) => rowIO.observe(row));
  }
  projRows.forEach((row) => {
    row.addEventListener('click', () => {
      const key = row.dataset.project;
      if (isMobileLayout()) {
        openModalRef(key);
        return;
      }
      const slide = workTrack.querySelector(`[data-project="${key}"]`);
      if (slide) slide.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  document.querySelectorAll('.preview-frame-group').forEach((btn) => {
    btn.addEventListener('click', () => openModalRef(btn.dataset.project));
  });
  /* openModal is defined further down (and assigned to this ref right
     after); this indirection lets the listeners above be wired up right
     next to the elements they control instead of after the modal block. */
  let openModalRef;

  /* ---------- Project modal ---------- */
  const page = document.querySelector('.page');
  const overlay = document.getElementById('modalOverlay');
  const modal = overlay.querySelector('.modal');
  const modalScroll = document.getElementById('modalScroll');
  const modalClose = document.getElementById('modalClose');
  const modalLabel = document.getElementById('modalLabel');
  const modalTitle = document.getElementById('modalTitle');
  const modalRole = document.getElementById('modalRole');
  const modalPeriod = document.getElementById('modalPeriod');
  const modalDesc = document.getElementById('modalDesc');
  const modalMedia = document.getElementById('modalMedia');

  let lastFocused = null;

  const updateScrollHint = () => {
    const hasMore = modalScroll.scrollHeight - modalScroll.scrollTop - modalScroll.clientHeight > 4;
    modal.classList.toggle('modal--scrollable', hasMore);
  };
  modalScroll.addEventListener('scroll', updateScrollHint);
  window.addEventListener('resize', () => {
    if (overlay.classList.contains('is-open')) updateScrollHint();
  });

  const getFocusable = () =>
    Array.from(modal.querySelectorAll('button, a[href], video, [tabindex]:not([tabindex="-1"])'))
      .filter((el) => !el.disabled && el.offsetParent !== null);

  const trapFocus = (e) => {
    if (e.key !== 'Tab' || !overlay.classList.contains('is-open')) return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const openModal = (key) => {
    const p = PROJECTS[key];
    if (!p) return;
    modalLabel.textContent = p.label;
    modalTitle.textContent = p.title;
    modalRole.textContent = p.role;
    modalPeriod.textContent = p.period || '';
    modalPeriod.style.display = p.period ? '' : 'none';
    modalDesc.innerHTML = '';
    const descList = document.createElement('ul');
    descList.className = 'modal-desc-list';
    (Array.isArray(p.desc) ? p.desc : [p.desc]).forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      descList.appendChild(li);
    });
    modalDesc.appendChild(descList);
    modalMedia.innerHTML = '';
    modalMedia.classList.toggle('modal-media--fixed3', p.mediaColumns === 3);
    const media = p.media || [];
    const count = Math.max(media.length, p.mediaCount || 0) || 3;
    for (let i = 0; i < count; i += 1) {
      const file = media[i];
      const slot = document.createElement('div');
      if (file) {
        slot.className = 'media-slot media-slot--video';
        const video = document.createElement('video');
        video.src = `assets/vids/${file}`;
        video.poster = `assets/vids/posters/${file.replace(/\.mp4$/, '.jpg')}`;
        video.controls = true;
        video.preload = 'metadata';
        video.playsInline = true;
        slot.appendChild(video);
      } else {
        slot.className = 'media-slot';
        const label = document.createElement('span');
        label.textContent = p.mediaPlaceholder || `Video ${i + 1}`;
        slot.appendChild(label);
      }
      modalMedia.appendChild(slot);
    }
    modalScroll.scrollTop = 0;
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    page.inert = true;
    modalClose.focus();
    updateScrollHint();
  };
  openModalRef = openModal;

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    page.inert = false;
    if (lastFocused) lastFocused.focus();
  };

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    trapFocus(e);
  });
})();
