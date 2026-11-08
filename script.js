/**
 * 佳琦的個人網站 - 多頁式互動與選單控制腳本
 */
document.addEventListener('DOMContentLoaded', () => {
  // 導覽列滾動陰影監聽
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.toggleAttribute('data-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 行動選單開啟 / 關閉
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

  // 自動依當前 URL 標記 active 狀態
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__menu-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // 回饋表單提交事件
  const fbForm = document.getElementById('feedback-form');
  if (fbForm) {
    fbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fb-name')?.value.trim() || '訪客';
      const project = document.getElementById('fb-project')?.value || '本網站';
      alert(`感謝 ${name} 的寶貴意見！您針對【${project}】的回饋心得已成功送出。`);
      fbForm.reset();
    });
  }

  // 嗅覺日記：LINE 官方帳號 QR Code 彈跳視窗控制
  const modal = document.getElementById('line-qr-modal');
  const openBtn = document.getElementById('open-line-modal-btn');
  const closeBtn = document.getElementById('close-line-modal-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }


  // 程式方塊輪播控制邏輯 (Block Carousel)
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

});
