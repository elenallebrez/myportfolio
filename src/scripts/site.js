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

const initializeSite = () => {
  cleanupCurrentPage();

  const controller = new AbortController();
  const observerCleanup = initializeReveals(controller.signal);
  initializeCommandPalette(controller.signal);
  initializeHeader(controller.signal);
  initializeContactForm(controller.signal);

  cleanupCurrentPage = () => {
    controller.abort();
    observerCleanup();
  };
};

document.addEventListener('astro:page-load', initializeSite);
document.addEventListener('astro:before-swap', () => cleanupCurrentPage());
