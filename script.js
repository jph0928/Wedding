const weddingDate = new Date("2026-10-17T16:00:00");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

if (form && formMessage) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    formMessage.textContent = "Sending your RSVP...";

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwhxS2B6TqVqyfaz9w3oPYNa11MArhbcJYhzSvZNWz13BG5tD15ngJ01wWrZeOdtETK_w/exec", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("RSVP submission failed", response.status, responseText);
        throw new Error("Submission failed");
      }

      formMessage.textContent = "Thank you for your RSVP. We’re so excited to celebrate with you!";
      form.reset();
    } catch (error) {
      console.error(error);
      formMessage.textContent = "There was a problem sending your RSVP. Please try again.";
    }
  });
}

    // --- Guestbook handling and gallery lightbox ---
    const GAS_URL = "https://script.google.com/macros/s/AKfycbwhxS2B6TqVqyfaz9w3oPYNa11MArhbcJYhzSvZNWz13BG5tD15ngJ01wWrZeOdtETK_w/exec";

    // Guestbook: fetch and render
    async function fetchGuestbook() {
      const container = document.getElementById("guestbookEntries");
      try {
        const res = await fetch(`${GAS_URL}?action=guestbook`);
        if (!res.ok) throw new Error("Failed to fetch");
        const entries = await res.json();
        if (!entries.length) {
          container.innerHTML = '<p class="muted">No messages yet — be the first!</p>';
          return;
        }

        container.innerHTML = entries.map(e => (
          `<div class="guestbook-entry"><p class="guest-name">${escapeHtml(e.name)}</p><p class="guest-message">${escapeHtml(e.message)}</p><p class="guest-time">${new Date(e.timestamp).toLocaleString()}</p></div>`
        )).join('');
      } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="muted">Could not load messages.</p>';
      }
    }

    function escapeHtml(str) {
      return String(str || '').replace(/[&<>"'`]/g, (s) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;'
      })[s]);
    }

    // Guestbook submit
    const guestForm = document.getElementById('guestbookForm');
    const guestMessage = document.getElementById('guestbookMessage');
    if (guestForm) {
      guestForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        guestMessage.textContent = 'Sending...';
        const fd = new FormData(guestForm);
        fd.append('form', 'guestbook');
        try {
          const res = await fetch(GAS_URL, { method: 'POST', body: new URLSearchParams(fd), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
          const text = await res.text();
          if (!res.ok) throw new Error(text || 'Submit failed');
          guestMessage.textContent = 'Thanks — your message is saved!';
          guestForm.reset();
          setTimeout(() => guestMessage.textContent = '', 2500);
          fetchGuestbook();
        } catch (err) {
          console.error(err);
          guestMessage.textContent = 'There was a problem saving your message.';
        }
      });
    }

    // Gallery lightbox
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (galleryGrid && lightbox && lightboxImage) {
      galleryGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.gallery-item');
        if (!btn) return;
        const img = btn.querySelector('img');
        if (!img) return;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || '';
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('open');
      });

      function closeLightbox() {
        lightboxImage.src = '';
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
      }

      lightboxClose?.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (ev) => { if (ev.target === lightbox) closeLightbox(); });
    }

    // Lazy-load fallback: swap data-srcset into srcset when in view
    function initLazyImages() {
      const lazyImages = document.querySelectorAll('img.lazy[data-srcset]');
      if ('loading' in HTMLImageElement.prototype) {
        // native lazy supported — just set srcset so browser can pick
        lazyImages.forEach(img => { img.srcset = img.dataset.srcset; img.classList.remove('lazy'); });
        return;
      }

      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.srcset = img.dataset.srcset;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      lazyImages.forEach(img => obs.observe(img));
    }

    initLazyImages();

    // initialize guestbook
    fetchGuestbook();

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((entry) => entry.classList.remove("open"));

    if (!isOpen) {
      item.classList.add("open");
    }
  });
});
