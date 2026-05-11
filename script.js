const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const timeline = document.querySelector("[data-timeline]");
const tabButtons = document.querySelectorAll("[data-track]");
const range = document.querySelector("[data-hours-range]");
const rangeOutput = document.querySelector("[data-hours-output]");
const recommendation = document.querySelector("[data-recommendation]");
const form = document.querySelector("[data-apply-form]");
const formNote = document.querySelector("[data-form-note]");
const stageSelect = document.querySelector("[data-stage-select]");
const progress = document.querySelector("[data-scroll-progress]");
const backTop = document.querySelector("[data-back-top]");
const revealItems = document.querySelectorAll("[data-reveal]");
const counterItems = document.querySelectorAll("[data-counter]");
const chooseStageLinks = document.querySelectorAll("[data-choose-stage]");
const videoCards = [...document.querySelectorAll("[data-lesson]")];
const courseCount = document.querySelector("[data-course-count]");
const courseProgressFill = document.querySelector("[data-course-progress-fill]");
const panelAction = document.querySelector("[data-panel-action]");
const panelStepTitles = [...document.querySelectorAll("[data-panel-step-title]")];
const panelStepTexts = [...document.querySelectorAll("[data-panel-step-text]")];
const courseProgressKey = "biznesMaktabCourseProgress";
let completedLessons = Number(localStorage.getItem(courseProgressKey) || "0");
completedLessons = Math.min(Math.max(completedLessons, 0), videoCards.length);

const routePanelStates = [
  {
    button: "Начать с первого урока",
    steps: [
      ["С чего начать", "основа бизнеса с нуля"],
      ["Выбрать нишу", "идея, спрос, первые ошибки"],
      ["Собрать план", "первые действия без хаоса"]
    ]
  },
  {
    button: "Открыть второй урок",
    steps: [
      ["Урок 1 открыт", "старт уже засчитан"],
      ["Выбрать нишу", "проверить спрос и рынок"],
      ["Подготовить идею", "оставить только сильный вариант"]
    ]
  },
  {
    button: "Открыть третий урок",
    steps: [
      ["Ниша выбрана", "двигаемся к структуре"],
      ["Собрать бизнес-план", "цели, расходы, шаги"],
      ["Проверить цифры", "понять стартовый бюджет"]
    ]
  },
  {
    button: "Открыть четвертый урок",
    steps: [
      ["План готов", "есть маршрут запуска"],
      ["Настроить маркетинг", "каналы и первые клиенты"],
      ["Упаковать оффер", "понятное предложение"]
    ]
  },
  {
    button: "Открыть пятый урок",
    steps: [
      ["Маркетинг собран", "понятно где искать людей"],
      ["Построить продажи", "воронка и контакты"],
      ["Довести до заявки", "путь клиента без потерь"]
    ]
  },
  {
    button: "Открыть шестой урок",
    steps: [
      ["Продажи готовы", "есть путь клиента"],
      ["Разобрать финансы", "расходы, резерв, учет"],
      ["Закрыть маршрут", "финальный план запуска"]
    ]
  },
  {
    button: "Перейти к заявке",
    steps: [
      ["Все уроки открыты", "маршрут пройден"],
      ["Соберите выводы", "ниша, продажи, финансы"],
      ["Сделайте следующий шаг", "оставьте заявку на разбор"]
    ]
  }
];

const tracks = {
  start: [
    ["01", "Идея и ниша", "Проверяете спрос, конкурентов и выбираете сегмент, где есть деньги."],
    ["02", "Оффер и продукт", "Собираете понятное предложение, которое можно продавать без длинных объяснений."],
    ["03", "Первые продажи", "Запускаете простую воронку: контакты, скрипт, презентация, повторные касания."],
    ["04", "План запуска", "Получаете список действий, расчет бюджета и понятный маршрут на первые недели."]
  ],
  sales: [
    ["01", "Диагностика воронки", "Находите слабые места: лиды, конверсия, чек, повторные продажи."],
    ["02", "Скрипты и переговоры", "Пишете сценарии звонков, сообщений и встреч под разные типы клиентов."],
    ["03", "CRM и контроль", "Настраиваете этапы сделки, причины отказа и еженедельные показатели."],
    ["04", "План продаж", "Собираете квартальный план с каналами, задачами и ответственными."]
  ],
  finance: [
    ["01", "Учет денег", "Разделяете выручку, прибыль, кассовые разрывы и личные расходы владельца."],
    ["02", "Маржинальность", "Считаете прибыльность продуктов и понимаете, что стоит масштабировать."],
    ["03", "Команда и KPI", "Описываете роли, зоны ответственности и простые показатели результата."],
    ["04", "План роста", "Фиксируете цели на 90 дней, бюджет, риски и управленческий календарь."]
  ]
};

const recommendations = [
  {
    max: 4,
    text: "Мягкий темп: 1 занятие в неделю и короткие задания без перегруза."
  },
  {
    max: 8,
    text: "Оптимально: 2 занятия, домашняя работа и короткий разбор."
  },
  {
    max: 12,
    text: "Интенсив: 2 занятия, глубокие задания и быстрый запуск изменений."
  }
];

function renderTimeline(track) {
  timeline.innerHTML = tracks[track]
    .map(
      ([week, title, text], index) => `
        <article class="timeline-item" style="animation-delay: ${index * 70}ms">
          <span class="timeline-week">${week}</span>
          <div>
            <h3>${title}</h3>
            <p>${text}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function setHeaderState() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", scrolled);
  backTop.classList.toggle("visible", window.scrollY > 520);

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${percent}%`;
}

function closeMenu() {
  nav.classList.remove("open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Открыть меню");
}

function setStage(stage) {
  if (!stageSelect) return;
  stageSelect.value = stage;
  stageSelect.classList.remove("invalid");
}

function updateRange() {
  const value = Number(range.value);
  rangeOutput.value = value;
  recommendation.textContent = recommendations.find((item) => value <= item.max).text;
}

function validateForm() {
  let isValid = true;
  const fields = form.querySelectorAll("input, select");

  fields.forEach((field) => {
    const invalid = !field.value.trim();
    field.classList.toggle("invalid", invalid);
    if (invalid) isValid = false;
  });

  return isValid;
}

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    element.textContent = Math.round(target * eased);

    if (progressValue < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function updateCourseProgress() {
  const total = videoCards.length || 1;
  const percent = (completedLessons / total) * 100;
  const panelState = routePanelStates[Math.min(completedLessons, routePanelStates.length - 1)];

  if (courseCount) {
    courseCount.textContent = `${completedLessons} / ${total}`;
  }

  if (courseProgressFill) {
    courseProgressFill.style.width = `${percent}%`;
  }

  videoCards.forEach((card) => {
    const lesson = Number(card.dataset.lesson);
    const isCompleted = lesson <= completedLessons;
    const isUnlocked = lesson <= completedLessons + 1;

    card.classList.toggle("completed", isCompleted);
    card.classList.toggle("locked", !isUnlocked);
    card.querySelector("iframe")?.setAttribute("tabindex", isUnlocked ? "0" : "-1");
  });

  panelStepTitles.forEach((title, index) => {
    title.textContent = panelState.steps[index][0];
  });

  panelStepTexts.forEach((text, index) => {
    text.textContent = panelState.steps[index][1];
  });

  if (panelAction) {
    panelAction.textContent = panelState.button;
  }
}

function completeLesson(lesson) {
  if (!lesson || lesson > completedLessons + 1) return;
  if (lesson <= completedLessons) return;

  completedLessons = lesson;
  localStorage.setItem(courseProgressKey, String(completedLessons));
  updateCourseProgress();
}

function handleLessonClick(card) {
  const lesson = Number(card.dataset.lesson);
  const isUnlocked = lesson <= completedLessons + 1;

  if (!isUnlocked) return;
  completeLesson(lesson);
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
  menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
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
    formNote.textContent = "Заполните все поля, и заявка будет готова.";
    formNote.classList.remove("success");
    return;
  }

  const lead = Object.fromEntries(new FormData(form).entries());
  const leads = JSON.parse(localStorage.getItem("biznesMaktabLeads") || "[]");
  leads.push({ ...lead, createdAt: new Date().toISOString() });
  localStorage.setItem("biznesMaktabLeads", JSON.stringify(leads));

  form.reset();
  formNote.textContent = "Заявка сохранена. Для реального сайта можно подключить Telegram, email или CRM.";
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
