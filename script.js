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
      const response = await fetch("https://script.google.com/macros/s/AKfycbx7A3E7hvm4UirOLBbCCq5FSq8AFM1atMbwVCpvo-l2Ie0JhEX3eb-l6UQoEM4AuRE1lQ/exec", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!response.ok) throw new Error("Submission failed");

      formMessage.textContent = "Thank you for your RSVP. We’re so excited to celebrate with you!";
      form.reset();
    } catch (error) {
      formMessage.textContent = "There was a problem sending your RSVP. Please try again.";
    }
  });
}

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
