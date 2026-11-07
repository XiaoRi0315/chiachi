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
});