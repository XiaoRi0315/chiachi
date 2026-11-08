/**
 * 佳琦的個人網站 - 多頁式互動與動態效果腳本
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 導覽列滾動陰影監聽
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.toggleAttribute('data-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. 行動版選單開關控制
  const toggle = document.querySelector('.nav__toggle');
  const close = document.querySelector('.nav__close');
  const menu = document.getElementById('menu');

  const setOpen = (open) => {
    if (!menu) return;
    menu.hidden = !open;
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
    }
    if (open && close) {
      close.focus();
    }
  };

  if (toggle) {
    toggle.addEventListener('click', () => setOpen(true));
  }
  if (close) {
    close.addEventListener('click', () => {
      setOpen(false);
      toggle && toggle.focus();
    });
  }
  if (menu) {
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
  }
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu && !menu.hidden) {
      setOpen(false);
      toggle && toggle.focus();
    }
  });

  // 3. 自動依當前 URL 標記 active 狀態
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__menu-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // 4. 嗅覺日記：LINE 官方帳號 QR Code 彈跳視窗控制
  const lineModal = document.getElementById('line-qr-modal');
  const openLineBtn = document.getElementById('open-line-modal-btn');
  const closeLineBtn = document.getElementById('close-line-modal-btn');

  if (openLineBtn && lineModal) {
    openLineBtn.addEventListener('click', () => {
      lineModal.classList.add('is-active');
      lineModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeLineBtn && lineModal) {
    closeLineBtn.addEventListener('click', () => {
      lineModal.classList.remove('is-active');
      lineModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (lineModal) {
    lineModal.addEventListener('click', (e) => {
      if (e.target === lineModal) {
        lineModal.classList.remove('is-active');
        lineModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 5. 程式方塊輪播控制邏輯 (Block Carousel)
  document.querySelectorAll('.block-carousel').forEach((carousel) => {
    const slides = carousel.querySelectorAll('.block-carousel__slide');
    const dots = carousel.querySelectorAll('.block-carousel__dot');
    const prevBtn = carousel.querySelector('.block-carousel__btn--prev');
    const nextBtn = carousel.querySelector('.block-carousel__btn--next');
    let currentIndex = 0;

    const showSlide = (index) => {
      if (slides.length === 0) return;
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === currentIndex);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    }
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => showSlide(idx));
    });
  });

  // 6. 獎狀與證照圖片點擊放大 (Lightbox Modal)
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.cert-card__media').forEach((cardMedia) => {
      cardMedia.addEventListener('click', () => {
        const img = cardMedia.querySelector('.cert-card__img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || '';
          if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || '';
          }
          lightbox.classList.add('is-active');
          lightbox.setAttribute('aria-hidden', 'false');
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('is-active');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
        closeLightbox();
      }
    });
  }

  // 7. 首頁橫幅：Live Orb 靈動光球 (WebGL 原生著色器運算)
  const orbCanvas = document.getElementById('hero-live-orb');
  if (orbCanvas) {
    const VERT = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const FRAG = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_speed;
      uniform vec2 u_look;
      uniform float u_blink;
      uniform float u_mode;
      uniform vec3 u_body;
      uniform vec3 u_eye;
      uniform vec3 u_c1;
      uniform vec3 u_c2;
      uniform vec3 u_c3;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = m * p;
          a *= 0.5;
        }
        return v;
      }

      vec3 orient(vec3 p, vec2 look) {
        float yaw = look.x * 0.92;
        float pitch = -look.y * 0.78;
        float cy = cos(yaw);
        float sy = sin(yaw);
        float cp = cos(pitch);
        float sp = sin(pitch);
        vec3 q = vec3(p.x, p.y * cp - p.z * sp, p.y * sp + p.z * cp);
        return vec3(q.x * cy + q.z * sy, q.y, -q.x * sy + q.z * cy);
      }

      float eyeMask(vec3 n, vec3 e, vec3 right, vec3 up, float halfH, float rad) {
        float facing = dot(n, e);
        float x = dot(n, right) - dot(e, right);
        float y = dot(n, up) - dot(e, up);
        y -= clamp(y, -halfH, halfH);
        float d = length(vec2(x, y)) - rad;
        float fill = 1.0 - smoothstep(-0.01, 0.01, d);
        return fill * smoothstep(0.12, 0.32, facing);
      }

      vec3 wash(vec3 n, float t) {
        vec2 q = n.xy * 2.2 + n.z * 0.85;
        vec2 w1 = vec2(
          fbm(q * 1.4 + vec2(t * 0.22, t * 0.18)),
          fbm(q * 1.4 + vec2(-t * 0.16, t * 0.24) + 4.1)
        );
        q += (w1 - 0.5) * 0.72;
        float f = fbm(q * 2.1 + vec2(0.0, t * 0.12));
        float g = fbm(q * 4.6 - vec2(t * 0.2, 0.0));
        vec3 col = mix(u_c1, u_c2, smoothstep(0.28, 0.72, f));
        return mix(col, u_c3, pow(smoothstep(0.42, 0.9, g), 1.4));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        uv.x *= aspect;

        float radius = 0.94;
        vec2 p = uv / radius;
        float r2 = dot(p, p);
        float edge = 1.0 - smoothstep(0.985, 1.012, sqrt(max(r2, 0.0)));
        if (edge <= 0.001) {
          gl_FragColor = vec4(0.0);
          return;
        }

        float z = sqrt(max(1.0 - r2, 0.0));
        vec3 n = normalize(vec3(p, z));

        vec2 look = u_look;
        float lm = length(look);
        if (lm > 1.0) look /= lm;

        vec3 right = orient(vec3(1.0, 0.0, 0.0), look);
        vec3 up = orient(vec3(0.0, 1.0, 0.0), look);
        vec3 eL = orient(normalize(vec3(-0.32, 0.08, 1.0)), look);
        vec3 eR = orient(normalize(vec3(0.32, 0.08, 1.0)), look);

        float halfH = mix(0.128, 0.012, u_blink);
        float rad = mix(0.054, 0.062, u_blink);
        float eyes = max(
          eyeMask(n, eL, right, up, halfH, rad),
          eyeMask(n, eR, right, up, halfH, rad)
        );

        vec3 body = u_mode > 0.5 ? wash(n, u_time * u_speed) : u_body;
        vec3 col = mix(body, u_eye, clamp(eyes, 0.0, 1.0));

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), edge);
      }
    `;

    function hexToRgb(hex) {
      const h = hex.replace('#', '').trim();
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0').slice(0, 6);
      const n = parseInt(full, 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }

    const gl = orbCanvas.getContext('webgl', { alpha: true, powerPreference: 'high-performance' });
    if (gl) {
      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, 'u_resolution');
      const uTime = gl.getUniformLocation(prog, 'u_time');
      const uSpeed = gl.getUniformLocation(prog, 'u_speed');
      const uLook = gl.getUniformLocation(prog, 'u_look');
      const uBlink = gl.getUniformLocation(prog, 'u_blink');
      const uMode = gl.getUniformLocation(prog, 'u_mode');
      const uBody = gl.getUniformLocation(prog, 'u_body');
      const uEye = gl.getUniformLocation(prog, 'u_eye');
      const uC1 = gl.getUniformLocation(prog, 'u_c1');
      const uC2 = gl.getUniformLocation(prog, 'u_c2');
      const uC3 = gl.getUniformLocation(prog, 'u_c3');

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // 配色調整：以天藍(#a0ddff)、淡薰衣草(#c1cefe)、柔和紫藍(#758ecd)為主體，
      // 避開橫幅背景的 #7189ff，眼睛則使用深邃紫羅蘭(#624cab)，讓光球在背景上明亮立體！
      const colors = ['#dabfff', '#907ad6', '#5e61ba'].map(hexToRgb);
      const eyeCol = hexToRgb('#000');

      let look = { x: 0, y: 0.08 };
      let targetLook = { x: 0, y: 0.08 };
      let glance = { x: 0, y: 0.08 };
      let clock = 0;
      let last = performance.now();
      let pointerAt = -Infinity;
      let nextBlink = 2000;
      let blinkAt = -10000;
      let nextGlance = 1000;

      const resize = () => {
        const parent = orbCanvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        orbCanvas.width = w * dpr;
        orbCanvas.height = h * dpr;
        gl.viewport(0, 0, orbCanvas.width, orbCanvas.height);
      };
      window.addEventListener('resize', resize);
      resize();

      window.addEventListener('pointermove', (e) => {
        const rect = orbCanvas.getBoundingClientRect();
        if (rect.width <= 0) return;
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (rect.top + rect.height / 2 - e.clientY) / (rect.height / 2);
        targetLook.x = Math.min(1, Math.max(-1, dx));
        targetLook.y = Math.min(1, Math.max(-1, dy));
        pointerAt = performance.now();
      }, { passive: true });

      function tick(now) {
        const dt = Math.min(50, now - last);
        last = now;
        clock += dt;

        const isSteering = now - pointerAt < 3000;
        if (!isSteering && clock >= nextGlance) {
          glance.x = Math.random() < 0.3 ? 0 : (Math.random() * 2 - 1) * 0.7;
          glance.y = Math.random() < 0.3 ? 0.08 : (Math.random() * 2 - 1) * 0.4;
          nextGlance = clock + 1000 + Math.random() * 2000;
        }

        const goal = isSteering ? targetLook : glance;
        look.x += (goal.x - look.x) * 0.12;
        look.y += (goal.y - look.y) * 0.12;

        if (clock >= nextBlink) {
          blinkAt = clock;
          nextBlink = clock + 2500 + Math.random() * 3500;
        }
        const bt = (clock - blinkAt) / 1000;
        let b = 0;
        if (bt < 0.06) b = bt / 0.06;
        else if (bt < 0.12) b = 1;
        else if (bt < 0.2) b = 1 - (bt - 0.12) / 0.08;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes, orbCanvas.width, orbCanvas.height);
        gl.uniform1f(uTime, clock / 1000);
        gl.uniform1f(uSpeed, 0.45);
        gl.uniform2f(uLook, look.x, look.y);
        gl.uniform1f(uBlink, b);
        gl.uniform1f(uMode, 1.0); // WebGL 流體流光模式
        gl.uniform3f(uEye, eyeCol[0], eyeCol[1], eyeCol[2]);
        gl.uniform3f(uC1, colors[0][0], colors[0][1], colors[0][2]);
        gl.uniform3f(uC2, colors[1][0], colors[1][1], colors[1][2]);
        gl.uniform3f(uC3, colors[2][0], colors[2][1], colors[2][2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }
});