}

function openLesson(card) {
  const youtubeUrl = card.dataset.youtubeUrl;

  handleLessonClick(card);

  if (youtubeUrl) {
    window.open(youtubeUrl, "_blank", "noopener");
  }
}

function handlePanelAction() {
  if (completedLessons >= videoCards.length) {
    document.querySelector("#apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const nextCard = videoCards[completedLessons];
  if (nextCard) {
    openLesson(nextCard);
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  header.classList.toggle("menu-active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });
    renderTimeline(button.dataset.track);
  });
});

range.addEventListener("input", updateRange);

chooseStageLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setStage(link.dataset.chooseStage);
  });
});

videoCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-lesson]")) {
      openLesson(card);
      return;
    }

    if (event.target.closest("iframe")) {
      handleLessonClick(card);
    }
  });
});

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select")) {
    event.target.classList.remove("invalid");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    formNote.textContent = "Please fill in all fields to submit the application.";
    formNote.classList.remove("success");
    return;
  }

  const lead = Object.fromEntries(new FormData(form).entries());
  const leads = JSON.parse(localStorage.getItem("biznesMaktabLeads") || "[]");
  leads.push({ ...lead, createdAt: new Date().toISOString() });
  localStorage.setItem("biznesMaktabLeads", JSON.stringify(leads));

  form.reset();
  formNote.textContent = "Application saved. For a real website, connect Telegram, email, or CRM.";
  formNote.classList.add("success");
});

document.querySelectorAll("details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll("details").forEach((other) => {
      if (other !== item) other.removeAttribute("open");
    });
  });
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

panelAction?.addEventListener("click", handlePanelAction);
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".program-card, .video-card, .trust-item").forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
});

revealItems.forEach((item) => revealObserver.observe(item));
counterItems.forEach((item) => counterObserver.observe(item));

renderTimeline("start");
updateRange();
updateCourseProgress();
setHeaderState();
