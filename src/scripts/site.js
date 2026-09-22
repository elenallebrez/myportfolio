document.documentElement.classList.add('js');

let cleanupCurrentPage = () => {};

/** @param {HTMLElement[]} items */
const getVisibleItems = (items) => items.filter((item) => !item.hidden);

/** @param {AbortSignal} signal */
const initializeCommandPalette = (signal) => {
  const dialog = document.querySelector('[data-command-dialog]');
  const input = dialog?.querySelector('[data-command-search]');
  const resultContainer = dialog?.querySelector('[data-command-results]');
  const emptyState = dialog?.querySelector('[data-command-empty]');
  const items = /** @type {HTMLElement[]} */ (dialog ? [...dialog.querySelectorAll('[data-search-item]')] : []);
  const triggers = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-command-trigger]')]);

  if (!(dialog instanceof HTMLDialogElement) || !(input instanceof HTMLInputElement) || !resultContainer) {
    return;
  }

  let activeIndex = 0;
  /** @type {Element | null} */
  let returnFocus = null;

  /** @param {number} index */
  const setActiveItem = (index) => {
    const visibleItems = getVisibleItems(items);

    if (visibleItems.length === 0) {
      activeIndex = 0;
      return;
    }

    activeIndex = (index + visibleItems.length) % visibleItems.length;
    items.forEach((item) => item.removeAttribute('data-active'));
    visibleItems[activeIndex]?.setAttribute('data-active', 'true');
    visibleItems[activeIndex]?.scrollIntoView({ block: 'nearest' });
  };

  const filterItems = () => {
    const query = input.value.trim().toLocaleLowerCase();

    items.forEach((item) => {
      const searchableText = item.getAttribute('data-search')?.toLocaleLowerCase() ?? '';
      item.hidden = query.length > 0 && !searchableText.includes(query);
    });

    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = getVisibleItems(items).length > 0;
    }

    setActiveItem(0);
  };

  /** @param {Element | null} trigger */
  const openDialog = (trigger) => {
    returnFocus = trigger;
    dialog.showModal();
    input.value = '';
    filterItems();
    requestAnimationFrame(() => input.focus());
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openDialog(trigger), { signal });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
      event.preventDefault();
      dialog.open ? dialog.close() : openDialog(document.activeElement);
      return;
    }

    if (!dialog.open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveItem(activeIndex + 1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveItem(activeIndex - 1);
    }

    if (event.key === 'Enter' && document.activeElement === input) {
      const activeItem = getVisibleItems(items)[activeIndex];
      if (activeItem instanceof HTMLAnchorElement) activeItem.click();
    }
  }, { signal });

  input.addEventListener('input', filterItems, { signal });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }, { signal });
  dialog.addEventListener('close', () => {
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
  }, { signal });
};

/** @param {AbortSignal} signal */
const initializeReveals = (signal) => {
  const elements = [...document.querySelectorAll('[data-reveal]')];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
  signal.addEventListener('abort', () => observer.disconnect(), { once: true });

  return () => observer.disconnect();
};

/** @param {AbortSignal} signal */
const initializeHeader = (signal) => {
  const header = document.querySelector('[data-site-header]');
  const mobileNavigation = document.querySelector('[data-mobile-nav]');
  const commandKey = document.querySelector('[data-command-key]');

  if (commandKey && !navigator.platform.toLocaleLowerCase().includes('mac')) {
    commandKey.textContent = 'Ctrl K';
  }

  const updateHeader = () => header?.setAttribute('data-scrolled', String(window.scrollY > 16));
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true, signal });

  mobileNavigation?.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => {
      if (mobileNavigation instanceof HTMLDetailsElement) mobileNavigation.open = false;
    }, { signal });
  });
};

/** @param {AbortSignal} signal */
const initializeContactForm = (signal) => {
  const form = document.querySelector('.contact-form');
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!(form instanceof HTMLFormElement) || !(submitButton instanceof HTMLButtonElement)) return;

  form.addEventListener('submit', () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }, { signal });
};

/** @param {AbortSignal} signal */
const initializeWorkspaceEntry = (signal) => {
  const trigger = document.querySelector('[data-workspace-trigger]');
  const image = trigger?.querySelector('img');

  if (!(trigger instanceof HTMLButtonElement) || !(image instanceof HTMLImageElement)) return;

  let isEntering = false;
  /** @type {HTMLDivElement | null} */
  let overlay = null;

  const goToWorkspace = () => window.location.assign('/desktop/');

  const enterWorkspace = async () => {
    if (isEntering) return;
    isEntering = true;
    trigger.disabled = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) {
      goToWorkspace();
      return;
    }

    const rect = image.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const scale = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.18;
    const offsetX = window.innerWidth / 2 - centerX;
    const offsetY = window.innerHeight / 2 - centerY;

    overlay = document.createElement('div');
    overlay.className = 'workspace-transition';
    overlay.setAttribute('aria-hidden', 'true');

    const veil = document.createElement('div');
    veil.className = 'workspace-transition__veil';

    const transitionImage = /** @type {HTMLImageElement} */ (image.cloneNode());
    transitionImage.removeAttribute('loading');
    transitionImage.removeAttribute('fetchpriority');
    transitionImage.src = image.currentSrc || image.src;
    transitionImage.style.left = `${rect.left}px`;
    transitionImage.style.top = `${rect.top}px`;
    transitionImage.style.width = `${rect.width}px`;
    transitionImage.style.height = `${rect.height}px`;

    overlay.append(veil, transitionImage);
    document.body.append(overlay);
    document.documentElement.classList.add('is-workspace-entering');

    try {
      const imageAnimation = transitionImage.animate([
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
        { transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`, opacity: 0.14 },
      ], {
        duration: 1050,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
      });

      const veilAnimation = veil.animate([
        { opacity: 0 },
        { opacity: 0.16, offset: 0.45 },
        { opacity: 1 },
      ], {
        duration: 1050,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
      });

      await Promise.all([imageAnimation.finished, veilAnimation.finished]);
    } catch {
      // Navigation still completes if the animation is interrupted.
    }

    if (!signal.aborted) goToWorkspace();
  };

  trigger.addEventListener('click', enterWorkspace, { signal });
  signal.addEventListener('abort', () => {
    overlay?.remove();
    document.documentElement.classList.remove('is-workspace-entering');
  }, { once: true });
};

/** @param {AbortSignal} signal */
const initializeDesktopExperience = (signal) => {
  if (!document.querySelector('[data-desktop-experience]')) return;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') window.location.assign('/');
  }, { signal });
};

const initializeSite = () => {
  cleanupCurrentPage();

  const controller = new AbortController();
  const observerCleanup = initializeReveals(controller.signal);
  initializeCommandPalette(controller.signal);
  initializeHeader(controller.signal);
  initializeContactForm(controller.signal);
  initializeWorkspaceEntry(controller.signal);
  initializeDesktopExperience(controller.signal);

  cleanupCurrentPage = () => {
    controller.abort();
    observerCleanup();
  };
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSite, { once: true });
} else {
  initializeSite();
}

document.addEventListener('astro:page-load', initializeSite);
document.addEventListener('astro:before-swap', () => cleanupCurrentPage());
