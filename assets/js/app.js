(() => {
  const $ = (selector) => document.querySelector(selector);
  const grid = $("#recommendations"),
    form = $("#search-form"),
    queryInput = $("#vehicle-query"),
    querySuggestions = $("#query-suggestions"),
    priceInput = $("#price"),
    locationInput = $("#location"),
    priorityInput = $("#priority"),
    title = $("#results-title"),
    description = $("#results-description"),
    resultsEyebrow = $("#results-eyebrow"),
    summary = $("#search-summary"),
    actions = $("#smart-actions"),
    clearButton = $("#clear-search"),
    template = $("#car-card-template"),
    onboarding = $("#onboarding"),
    helpForm = $("#help-form"),
    helpLocation = $("#help-location"),
    helpPrice = $("#help-price"),
    helpType = $("#help-type"),
    helpPriority = $("#help-priority"),
    helpFeedback = $("#help-feedback"),
    nextStep = $("#next-step"),
    diagnosticBack = $("#diagnostic-back"),
    diagnosticNext = $("#diagnostic-next"),
    diagnosticFinish = $("#diagnostic-finish"),
    diagnosticTitle = $("#diagnostic-title"),
    diagnosticCopy = $("#diagnostic-copy"),
    diagnosticEyebrow = $("#diagnostic-eyebrow"),
    catalogTab = $("#catalog-tab"),
    filtersTab = $("#filters-tab"),
    catalogFilters = $("#catalog-filters"),
    filterBrand = $("#filter-brand"),
    filterType = $("#filter-type"),
    filterLocation = $("#filter-location"),
    filterPrice = $("#filter-price"),
    filterSort = $("#filter-sort"),
    clearCatalogFilters = $("#clear-catalog-filters"),
    catalogFilterCount = $("#catalog-filter-count"),
    compareTool = $("#open-comparison-tool"),
    comparePickerDialog = $("#compare-picker-dialog"),
    comparePickerContent = $("#compare-picker-content");

  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  let cars = [],
    selected = [],
    lastSearch = {},
    currentVehicle = null,
    diagnosticStep = 1,
    querySuggestionItems = [],
    querySuggestionIndex = -1;

  const normalize = (value = "") =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  const parsedPrice = (value) => Number(String(value).replace(/\D/g, "")) || 0;
  const textFor = (car) => normalize(`${car.Name} ${car.Model}`);
  const electricModels = ["dolphin", "ora 03", "e-208"];
  const suvModels = ["t-cross", "pulse", "renegade"];
  const isElectric = (car) => electricModels.includes(normalize(car.Model));
  const isSuv = (car) => suvModels.includes(normalize(car.Model));
  const isSedan = (car) => ["corolla", "civic"].includes(normalize(car.Model));
  const catalogCategories = (car) => [
    ...new Set(
      [
        isElectric(car) && "electric",
        isSuv(car) && "suv",
        isSedan(car) && "sedan",
        !isSuv(car) && !isSedan(car) && "hatch",
      ].filter(Boolean),
    ),
  ];
  const fullName = (car) => `${car.Name} ${car.Model}`;

  const vehicleInsights = {
    Dolphin: {
      family: 3,
      comfort: 4,
      safety: 4,
      economy: 5,
      seats: 5,
      use: "Cidade e deslocamentos diários",
    },
    Corolla: {
      family: 5,
      comfort: 5,
      safety: 5,
      economy: 3,
      seats: 5,
      use: "Família e viagens confortáveis",
    },
    "T-Cross": {
      family: 4,
      comfort: 4,
      safety: 4,
      economy: 3,
      seats: 5,
      use: "Família, cidade e fim de semana",
    },
    Civic: {
      family: 4,
      comfort: 5,
      safety: 4,
      economy: 3,
      seats: 5,
      use: "Conforto e viagens",
    },
    Onix: {
      family: 3,
      comfort: 3,
      safety: 3,
      economy: 5,
      seats: 5,
      use: "Primeiro carro e economia",
    },
    HB20: {
      family: 3,
      comfort: 3,
      safety: 3,
      economy: 5,
      seats: 5,
      use: "Cidade e custo-benefício",
    },
    Kwid: {
      family: 2,
      comfort: 2,
      safety: 3,
      economy: 5,
      seats: 5,
      use: "Rotina urbana e economia",
    },
    Pulse: {
      family: 4,
      comfort: 4,
      safety: 4,
      economy: 4,
      seats: 5,
      use: "Versatilidade para o dia a dia",
    },
    Renegade: {
      family: 4,
      comfort: 4,
      safety: 4,
      economy: 2,
      seats: 5,
      use: "Família e estrada",
    },
    208: {
      family: 3,
      comfort: 4,
      safety: 4,
      economy: 4,
      seats: 5,
      use: "Cidade com mais estilo e conforto",
    },
  };
  const insightFor = (car) =>
    vehicleInsights[car.Model] || {
      family: 3,
      comfort: 3,
      safety: 3,
      economy: 3,
      seats: 5,
      use: "Uso urbano",
    };

  const brandSites = {
    BYD: "https://www.byd.com/br",
    Toyota: "https://www.toyota.com.br",
    Volkswagen: "https://www.vw.com.br",
    Honda: "https://www.honda.com.br",
    Chevrolet: "https://www.chevrolet.com.br",
    Hyundai: "https://www.hyundai.com.br",
    Renault: "https://www.renault.com.br",
    Fiat: "https://www.fiat.com.br",
    Jeep: "https://www.jeep.com.br",
    Peugeot: "https://www.peugeot.com.br",
  };
  const verifiedGuides = {
    Dolphin: {
      source:
        "https://www.byd.com/content/dam/byd-site/br/fichas-t%C3%A9cnicas---update-2025/agosto/Ficha_Tecnica_Dolphin_08_09_2025.pdf",
      sourceName: "Ficha técnica BYD Dolphin",
      note: "Dados da ficha BYD consultada; confirme versão e ano do anúncio.",
      facts: [
        ["Autonomia PBEV", "291 km"],
        ["Bateria", "Blade (LFP), 44,9 kWh"],
        ["Recarga DC 30–80%", "30 min"],
        ["Potência", "95 cv"],
      ],
    },
    Kwid: {
      source: "https://www.renault.com.br/veiculos-de-passeio/kwid.html",
      sourceName: "Página oficial Renault Kwid",
      note: "Itens e consumo variam por versão; confira a configuração do anúncio.",
      facts: [
        ["Porta-malas", "290 L"],
        ["Consumo urbano", "14,4 km/L (gasolina)"],
        ["Altura do solo", "185 mm"],
        ["Segurança", "ESP e assistente de rampa"],
      ],
    },
    HB20: {
      source: "https://www.hyundai.com.br/veiculos/novo-hyundai-hb20.html",
      sourceName: "Página oficial Hyundai HB20",
      note: "A motorização e os equipamentos dependem da versão.",
      facts: [
        ["Motor turbo", "1.0 TGDI flex"],
        ["Potência turbo", "120 cv"],
        ["Torque turbo", "17,5 kgfm"],
        ["Câmbio automático", "6 velocidades"],
      ],
    },
  };
  const guideFor = (car) => verifiedGuides[car.Model];

  // Elementos dinâmicos extras
  const decisionContext = document.createElement("aside");
  decisionContext.className = "decision-context";
  decisionContext.id = "decision-context";
  decisionContext.hidden = true;
  if (summary) summary.insertAdjacentElement("afterend", decisionContext);

  const typeStep = document.querySelector('[data-diagnostic-step="1"]');
  const electricContext = document.createElement("fieldset");
  electricContext.className = "electric-context";
  electricContext.hidden = true;
  electricContext.innerHTML =
    '<legend>Para um elétrico funcionar na sua rotina, como seria a recarga?</legend><label><input type="radio" name="charging" value="home" /> Tenho onde recarregar em casa ou no condomínio</label><label><input type="radio" name="charging" value="public" /> Dependeria de recarga pública</label><label><input type="radio" name="charging" value="unsure" /> Ainda não sei</label>';
  if (typeStep) typeStep.appendChild(electricContext);

  function interpret(text) {
    const value = normalize(text);
    const matchingCar = cars.find(
      (car) =>
        value.includes(normalize(car.Model)) ||
        value.includes(normalize(car.Name)),
    );
    const city =
      cars.find((car) => value.includes(normalize(car.Location)))?.Location ||
      "";
    const priceMatch =
      value.match(/(?:r?\$?\s*)?(\d{2,3})\s*(?:mil|k)\b/) ||
      value.match(/r?\$?\s*(\d{4,6})\b/);
    return {
      model: matchingCar?.Model || "",
      city,
      maxPrice: priceMatch
        ? Number(priceMatch[1]) * (/mil|k/.test(priceMatch[0]) ? 1000 : 1)
        : 0,
      electric: /eletric|ev\b/.test(value),
      suv: /suv/.test(value),
      sedan: /seda/.test(value),
      hatch: /hatch|compacto/.test(value),
    };
  }

  function reasonsFor(car, ctx) {
    const reasons = [];
    const requestedModel =
      ctx.model && normalize(car.Model) === normalize(ctx.model);
    const desiredType = ctx.electric
      ? isElectric(car)
      : ctx.suv
        ? isSuv(car)
        : ctx.sedan
          ? isSedan(car)
          : ctx.hatch
            ? catalogCategories(car).includes("hatch")
            : false;
    if (requestedModel) reasons.push(["good", "Modelo solicitado"]);
    else if (desiredType)
      reasons.push([
        "good",
        ctx.electric
          ? "Elétrico como você pediu"
          : ctx.suv
            ? "SUV como você pediu"
            : ctx.sedan
              ? "Sedã como você pediu"
              : "Hatch como você pediu",
      ]);
    else if (ctx.model) reasons.push(["warn", "Modelo semelhante à sua busca"]);
    if (ctx.location)
      reasons.push([
        car.Location === ctx.location ? "good" : "warn",
        car.Location === ctx.location
          ? `Em ${car.Location}`
          : `Em ${car.Location} · fora da região desejada`,
      ]);
    if (ctx.maxPrice)
      reasons.push([
        car.Price <= ctx.maxPrice ? "good" : "warn",
        car.Price <= ctx.maxPrice
          ? "Dentro do seu orçamento"
          : `${money.format(car.Price - ctx.maxPrice)} acima do orçamento`,
      ]);
    return reasons.length ? reasons : [["good", "No catálogo demonstrativo"]];
  }

  function score(car, ctx) {
    let total = 58;
    const hasIntent =
      ctx.model ||
      ctx.electric ||
      ctx.suv ||
      ctx.sedan ||
      ctx.hatch ||
      ctx.location ||
      ctx.maxPrice;
    if (!hasIntent) return 80;
    const weights = {
      balanced: { intent: 30, location: 18, price: 18 },
      model: { intent: 42, location: 12, price: 12 },
      price: { intent: 20, location: 12, price: 32 },
      location: { intent: 20, location: 34, price: 12 },
    }[ctx.priority || "balanced"];
    if (ctx.model)
      total +=
        normalize(car.Model) === normalize(ctx.model)
          ? weights.intent
          : textFor(car).includes(normalize(ctx.model))
            ? Math.round(weights.intent / 2)
            : 0;
    else if (ctx.electric) total += isElectric(car) ? weights.intent : 0;
    else if (ctx.suv) total += isSuv(car) ? weights.intent : 0;
    else if (ctx.sedan) total += isSedan(car) ? weights.intent : 0;
    else if (ctx.hatch)
      total += catalogCategories(car).includes("hatch") ? weights.intent : 0;
    if (ctx.location)
      total += car.Location === ctx.location ? weights.location : 2;
    if (ctx.maxPrice)
      total +=
        car.Price <= ctx.maxPrice
          ? weights.price
          : Math.max(
              -12,
              Math.round(weights.price / 2) -
                Math.round((car.Price - ctx.maxPrice) / 1000),
            );
    (ctx.needs || []).forEach((need) => {
      total += Math.max(0, insightFor(car)[need] - 2) * 2;
    });
    return Math.max(45, Math.min(100, total));
  }

  function rank(ctx) {
    return cars
      .map((car) => ({
        car,
        score: score(car, ctx),
        reasons: reasonsFor(car, ctx),
      }))
      .sort((a, b) => b.score - a.score || a.car.Price - b.car.Price);
  }
  function updateCompareCount() {
    if ($("#compare-tray-count"))
      $("#compare-tray-count").textContent = selected.length;
    if (compareTool)
      compareTool.setAttribute(
        "aria-label",
        `Abrir ferramenta de comparação: ${selected.length} ${selected.length === 1 ? "veículo selecionado" : "veículos selecionados"}`,
      );
  }
  function toggleCompare(car) {
    const index = selected.indexOf(car);
    if (index >= 0) selected.splice(index, 1);
    else if (selected.length < 3) selected.push(car);
    else {
      alert("Você pode comparar até três veículos.");
      return false;
    }
    updateCompareCount();
    return selected.includes(car);
  }

  function criteriaFor(ctx = {}) {
    const criteria = [];
    if (ctx.maxPrice) criteria.push("orçamento");
    if (ctx.location) criteria.push("região");
    if (ctx.model || ctx.electric || ctx.suv) criteria.push("tipo ou modelo");
    if ((ctx.needs || []).length) criteria.push("rotina");
    if (!criteria.length) criteria.push("preferências gerais");
    return criteria;
  }

  function makeCard(item, label) {
    const fragment = template.content.cloneNode(true),
      car = item.car,
      image = fragment.querySelector(".car-image");
    image.src = car.Image;
    image.alt = fullName(car);
    const badge = fragment.querySelector(".match-badge");
    badge.textContent = item.neutral
      ? "No catálogo"
      : `${item.score}% de compatibilidade`;
    badge.classList.toggle("neutral-badge", Boolean(item.neutral));
    fragment.querySelector(".card-label").innerHTML = (
      Array.isArray(label) ? label : [label]
    )
      .filter(Boolean)
      .map((tag) => `<span>${tag}</span>`)
      .join("");
    fragment.querySelector(".car-brand").textContent = car.Name;
    fragment.querySelector(".car-model").textContent = car.Model;
    fragment.querySelector(".car-location").textContent = car.Location;
    fragment.querySelector(".car-price").textContent = money.format(car.Price);
    const reasonEl = fragment.querySelector(".reasons");
    reasonEl.innerHTML = item.reasons
      .slice(0, 3)
      .map(
        ([kind, text]) =>
          `<p class="reason ${kind}">${kind === "good" ? "✓" : "△"} ${text}</p>`,
      )
      .join("");
    fragment.querySelector(".card-bottom small").textContent =
      "Preço no catálogo";
    const availability = fragment.querySelector(".car-meta span:last-child");
    availability.textContent = "Disponibilidade a confirmar";
    const note = document.createElement("p");
    note.className = "match-note";
    note.textContent = item.neutral
      ? "Preço do catálogo demonstrativo."
      : `Compatibilidade considera ${criteriaFor(lastSearch).join(", ")}.`;
    reasonEl.insertAdjacentElement("afterend", note);
    const listingNote = document.createElement("p");
    listingNote.className = "listing-note";
    listingNote.textContent = "Confirme preço, versão e condições com a loja.";
    note.insertAdjacentElement("afterend", listingNote);
    fragment
      .querySelector(".details-button")
      .addEventListener("click", () => openDetails(item));
    return fragment;
  }

  function updatePickerStatus() {
    const status = $("#compare-picker-status"),
      confirm = $("#confirm-comparison");
    if (!status || !confirm) return;
    status.textContent =
      selected.length < 2
        ? `Selecione mais ${2 - selected.length} veículo${selected.length ? "" : "s"} para comparar.`
        : `${selected.length} veículos prontos para comparar.`;
    confirm.disabled = selected.length < 2;
  }

  function openComparisonTool() {
    comparePickerContent.innerHTML = `<p class="eyebrow">FERRAMENTA DE COMPARAÇÃO</p><h2>Escolha os carros lado a lado</h2><p>Selecione até três opções. Você pode voltar a esta lista sempre que quiser ajustar a escolha.</p><div class="compare-picker-list">${cars.map((car, index) => `<label class="compare-picker-option"><input type="checkbox" data-compare-car="${index}" ${selected.includes(car) ? "checked" : ""} /><img src="${car.Image}" alt="" /><span><strong>${fullName(car)}</strong><small>${money.format(car.Price)} ·${car.Location}</small></span></label>`).join("")}</div><div class="compare-picker-footer"><p class="compare-picker-status" id="compare-picker-status"></p><button class="compare-picker-confirm" id="confirm-comparison" type="button">Ver comparativo →</button></div>`;
    comparePickerContent
      .querySelectorAll("[data-compare-car]")
      .forEach((input) =>
        input.addEventListener("change", (event) => {
          const car = cars[Number(event.target.dataset.compareCar)];
          if (!toggleCompare(car)) event.target.checked = false;
          updatePickerStatus();
        }),
      );
    $("#confirm-comparison").addEventListener("click", () => {
      if (selected.length < 2) return;
      comparePickerDialog.close();
      openCompare();
    });
    updatePickerStatus();
    comparePickerDialog.showModal();
  }

  function addAction(label, handler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", handler);
    actions.appendChild(button);
  }
  function updateElectricContext() {
    electricContext.hidden = helpType.value !== "elétrico";
  }

  function openPreferenceReview() {
    onboarding.hidden = false;
    $("#onboarding-choice").hidden = true;
    helpForm.hidden = false;
    helpType.value = lastSearch.electric
      ? "elétrico"
      : lastSearch.suv
        ? "SUV"
        : "";
    helpPrice.value = lastSearch.maxPrice
      ? money.format(lastSearch.maxPrice)
      : "";
    helpLocation.value = lastSearch.location || "";
    helpPriority.value = lastSearch.priority || "balanced";
    const charging = document.querySelector(
      `input[name="charging"][value="${lastSearch.charging || ""}"]`,
    );
    if (charging) charging.checked = true;
    updateElectricContext();
    setDiagnosticStep(4);
    $("#jornada").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function updateDecisionContext(ctx) {
    const criteria = criteriaFor(ctx);
    decisionContext.hidden = false;
    decisionContext.innerHTML = `<div><strong>Como chegamos a estas opções</strong><p>Priorizamos ${criteria.join(", ")}. A compatibilidade organiza suas preferências; ela não certifica o veículo nem substitui a confirmação com a loja.</p>${ctx.electric && ctx.charging !== "home" ? '<p class="electric-alert">Antes de decidir por um elétrico, confirme onde você recarregará, autonomia da versão e disponibilidade de pontos na sua rota.</p>' : ""}</div><button type="button" id="review-preferences">Rever critérios</button>`;
    $("#review-preferences").addEventListener("click", openPreferenceReview);
  }

  function addDecisionAids(item) {
    const car = item.car,
      profile = $(".vehicle-profile"),
      criteria = criteriaFor(lastSearch),
      explainer = document.createElement("section");
    explainer.className = "match-explainer";
    explainer.innerHTML = `<h3>Como ler esta compatibilidade</h3><p>${item.neutral ? "Este veículo está no catálogo demonstrativo. Compare os dados e confirme as informações com a loja." : "Ela reflete o quanto esta opção atende às preferências que você informou; não é uma nota de qualidade do veículo."}</p><div class="match-criteria">${criteria.map((criterion) => `<span>${criterion}</span>`).join("")}</div>`;
    if (profile) profile.insertAdjacentElement("afterend", explainer);
    const planner = document.createElement("section");
    planner.className = "budget-planner";
    planner.innerHTML = `<h3>Planeje o valor da compra</h3><p>Uma referência simples para você conversar com a loja sem confundir preço do veículo com financiamento.</p><div class="budget-controls"><label>Entrada desejada<select class="budget-entry"><option value="0.1">10% · ${money.format(car.Price * 0.1)}</option><option value="0.2" selected>20% · ${money.format(car.Price * 0.2)}</option><option value="0.3">30% · ${money.format(car.Price * 0.3)}</option></select></label><p class="budget-result"></p></div><p class="listing-note">Valor restante sem juros. Seguro, IPVA, documentação, manutenção e condições de crédito não estão incluídos.</p>`;
    explainer.insertAdjacentElement("afterend", planner);
    const entry = planner.querySelector(".budget-entry"),
      result = planner.querySelector(".budget-result"),
      update = () => {
        const value = car.Price * Number(entry.value);
        result.textContent = `Restante a considerar: ${money.format(car.Price - value)}`;
      };
    entry.addEventListener("change", update);
    update();
  }

  function addCompareContext() {
    const content = $("#compare-content");
    content.innerHTML = content.innerHTML
      .replace("Match Score", "compatibilidade com sua busca")
      .replace(">Match</span>", ">Compatibilidade</span>");
    const table = content.querySelector(".compare-table");
    if (!table || !selected.length) return;
    const context = document.createElement("p");
    context.className = "source-note";
    context.textContent =
      "Compare o que muda na rotina. Preço, versão e disponibilidade continuam sujeitos à confirmação com a loja.";
    table.insertAdjacentElement("beforebegin", context);
    [
      ["Uso indicado", (car) => insightFor(car).use],
      ["Economia no dia a dia", (car) => `${insightFor(car).economy}/5`],
      ["Conforto", (car) => `${insightFor(car).comfort}/5`],
    ].forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "compare-row";
      row.innerHTML = `<span>${label}</span>${selected.map((car) => `<span>${value(car)}</span>`).join("")}`;
      table.appendChild(row);
    });
  }

  function setCatalogTab(showFilters, focus = false) {
    catalogTab.setAttribute("aria-selected", String(!showFilters));
    filtersTab.setAttribute("aria-selected", String(showFilters));
    catalogFilters.hidden = !showFilters;
    if (showFilters && focus) catalogFilters.focus();
  }

  function renderCatalogCards(list, filtered = false) {
    lastSearch = {};
    onboarding.hidden = false;
    $("#onboarding-choice").hidden = false;
    helpForm.hidden = true;
    actions.hidden = true;
    summary.hidden = true;
    nextStep.hidden = true;
    clearButton.hidden = true;
    resultsEyebrow.textContent = "CATÁLOGO DE VEÍCULOS";
    title.textContent = filtered
      ? "Catálogo filtrado"
      : "Carros para começar a explorar";
    description.textContent = filtered
      ? `${list.length} ${list.length === 1 ? "opção encontrada" : "opções encontradas"} para os filtros escolhidos.`
      : "Veja as opções com calma ou peça uma recomendação baseada no que importa para você.";
    grid.innerHTML = "";
    const row = document.createElement("div");
    row.className = "cards-grid";
    if (list.length)
      list.forEach((car) =>
        row.appendChild(
          makeCard(
            {
              car,
              score: 0,
              neutral: true,
              reasons: [["good", "Disponível no catálogo"]],
            },
            "Disponível",
          ),
        ),
      );
    else
      row.innerHTML =
        '<p class="catalog-empty">Nenhum carro corresponde a esses filtros. Ajuste uma opção ou limpe os filtros.</p>';
    grid.appendChild(row);
  }

  function catalogFilterIsActive() {
    return Boolean(
      filterBrand.value ||
      filterType.value ||
      filterLocation.value ||
      filterPrice.value ||
      filterSort.value !== "recommended",
    );
  }

  function applyCatalogFilters() {
    const maxPrice = Number(filterPrice.value);
    let list = cars.filter(
      (car) =>
        (!filterBrand.value || car.Name === filterBrand.value) &&
        (!filterType.value ||
          catalogCategories(car).includes(filterType.value)) &&
        (!filterLocation.value || car.Location === filterLocation.value) &&
        (!maxPrice || car.Price <= maxPrice),
    );
    if (filterSort.value === "low") list.sort((a, b) => a.Price - b.Price);
    if (filterSort.value === "high") list.sort((a, b) => b.Price - a.Price);
    const filtered = catalogFilterIsActive();
    catalogFilterCount.textContent = filtered
      ? `${list.length} ${list.length === 1 ? "carro encontrado" : "carros encontrados"}.`
      : "Use um ou mais filtros para refinar o catálogo.";
    renderCatalogCards(list, filtered);
  }

  function resetCatalogFilters() {
    filterBrand.value = "";
    filterType.value = "";
    filterLocation.value = "";
    filterPrice.value = "";
    filterSort.value = "recommended";
    catalogFilterCount.textContent =
      "Use um ou mais filtros para refinar o catálogo.";
  }

  function renderWelcome() {
    renderCatalogCards(cars);
    decisionContext.hidden = true;
  }

  function renderCatalog() {
    renderWelcome();
    $("#ofertas").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function render(ctx) {
    ctx.charging =
      document.querySelector('input[name="charging"]:checked')?.value || "";
    onboarding.hidden = true;
    lastSearch = ctx;
    resultsEyebrow.textContent = "RECOMENDAÇÕES PARA VOCÊ";
    const ranked = rank(ctx),
      hasIntent =
        ctx.model ||
        ctx.electric ||
        ctx.suv ||
        ctx.sedan ||
        ctx.hatch ||
        ctx.location ||
        ctx.maxPrice;
    grid.innerHTML = "";
    actions.innerHTML = "";
    clearButton.hidden = !hasIntent;
    nextStep.hidden = !hasIntent;
    title.textContent = hasIntent
      ? "Etapa 2 de 3 · Opções para a sua vida"
      : "Sua jornada começa aqui";
    description.textContent = hasIntent
      ? "Agora veja os trade-offs e escolha o que faz mais sentido para você."
      : "Conte um pouco sobre o que procura para começar.";
    summary.hidden = !hasIntent;
    if (hasIntent) {
      const labels = {
        balanced: "melhor equilíbrio",
        model: "modelo desejado",
        price: "menor preço",
        location: "localização",
      };
      summary.innerHTML = `Você busca <strong>${ctx.model || (ctx.electric ? "carro elétrico" : ctx.suv ? "SUV" : ctx.sedan ? "sedã" : ctx.hatch ? "hatch" : "uma boa oportunidade")}</strong>${ctx.location ? ` em <strong>${ctx.location}</strong>` : ""}${ctx.maxPrice ? ` até <strong>${money.format(ctx.maxPrice)}</strong>` : ""}. Critério principal: <strong>${labels[ctx.priority]}</strong>.`;
    }
    const best = ranked[0];
    const economicPool = ranked.filter(
      (item) =>
        item.car !== best.car &&
        (!ctx.maxPrice || item.car.Price <= ctx.maxPrice),
    );
    const economic =
      economicPool[0] ||
      ranked
        .slice()
        .sort((a, b) => a.car.Price - b.car.Price)
        .find((item) => item.car !== best.car);
    const nearby = ctx.location
      ? ranked.find(
          (item) => item.car !== best.car && item.car.Location === ctx.location,
        ) ||
        ranked.find(
          (item) => item.car !== best.car && item.car !== economic?.car,
        )
      : ranked.find(
          (item) => item.car !== best.car && item.car !== economic?.car,
        );
    const recommendations = [
      [best, ["Melhor match"]],
      [economic, ["Boa escolha no orçamento"]],
      [nearby, ["Perto de você"]],
    ];
    const used = new Set(),
      row = document.createElement("div");
    row.className = "cards-grid";
    recommendations.forEach(([item, tags]) => {
      if (!item || used.has(item.car)) return;
      used.add(item.car);
      row.appendChild(makeCard(item, tags));
    });
    grid.appendChild(row);
    if (
      hasIntent &&
      (!ctx.maxPrice ||
        best.car.Price > ctx.maxPrice ||
        (ctx.location && best.car.Location !== ctx.location))
    ) {
      actions.hidden = false;
      actions.innerHTML = "<span>Ajustar a busca:</span>";
      if (ctx.maxPrice)
        addAction("+ R$ 5.000 no orçamento", () => {
          priceInput.value = money.format(ctx.maxPrice + 5000);
          runSearch();
        });
      if (ctx.location)
        addAction("Ampliar localização", () => {
          locationInput.value = "";
          runSearch();
        });
      if (ctx.model)
        addAction("Ver modelos semelhantes", () => {
          queryInput.value = "";
          runSearch();
        });
    } else actions.hidden = true;
    updateDecisionContext(ctx);
  }

  function openDetails(item) {
    const car = item.car,
      info = insightFor(car),
      guide = guideFor(car),
      reviewQuery = encodeURIComponent(
        `${fullName(car)} avaliação review Brasil`,
      ),
      scoreLabel = item.neutral
        ? "VEÍCULO DISPONÍVEL"
        : `${item.score}% COMPATÍVEL COM SUA BUSCA`,
      guideMarkup = guide
        ? `<section class="verified-guide"><p class="eyebrow">DADOS DO MODELO · FONTE OFICIAL</p><h3>O que a ficha técnica informa</h3><div class="fact-grid">${guide.facts.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</div><p class="source-note">${guide.note}</p><a href="${guide.source}" target="_blank" rel="noopener">Ver ${guide.sourceName} →</a></section>`
        : `<section class="verified-guide pending-guide"><p class="eyebrow">FICHA AINDA NÃO VINCULADA</p><h3>Especificações dependem da versão</h3><p>Para comparar esse veículo com segurança, precisamos associar ano, versão e ficha oficial ao anúncio. Enquanto isso, consulte a página da marca.</p><a href="${brandSites[car.Name] || "#"}" target="_blank" rel="noopener">Consultar site oficial →</a></section>`;
    $("#vehicle-details").innerHTML =
      `<img class="detail-image" src="${car.Image}" alt="${fullName(car)}"><div class="detail-content"><p class="eyebrow">${scoreLabel}</p><h2>${fullName(car)}</h2><p class="detail-price">${money.format(car.Price)}</p><p class="detail-location">📍 ${car.Location} · ${info.seats} lugares</p><p>${info.use}. A leitura de perfil abaixo é uma orientação do AutoMatch; a ficha oficial vem em seguida.</p><div class="vehicle-profile">${[
        ["comfort", "Conforto"],
        ["safety", "Segurança"],
        ["family", "Família"],
        ["economy", "Economia"],
      ]
        .map(
          ([key, label]) =>
            `<div class="profile-meter"><strong>${label}</strong><span class="profile-bar" style="--level:${info[key] * 20}%"></span></div>`,
        )
        .join(
          "",
        )}</div>${guideMarkup}<h3>Por que recomendamos este carro?</h3>${item.reasons.map(([kind, text]) => `<p class="detail-reason ${kind}">${kind === "good" ? "✓" : "△"}${text}</p>`).join("")}<div class="purchase-checklist"><h3>Antes de avançar, confirme com a loja</h3><p>Condições finais de preço, disponibilidade, itens inclusos, garantia e possibilidades de test drive.</p></div><div class="media-links"><a href="https://www.youtube.com/results?search_query=${reviewQuery}" target="_blank" rel="noopener">Reviews no YouTube</a><a href="https://www.instagram.com/explore/tags/${normalize(car.Model).replace(/\s/g, "")}/" target="_blank" rel="noopener">Ver no Instagram</a><a href="https://www.tiktok.com/search?q=${reviewQuery}" target="_blank" rel="noopener">Ver no TikTok</a><a href="${brandSites[car.Name] || "#"}" target="_blank" rel="noopener">Site da ${car.Name}</a></div><button class="search-button dialog-choose" type="button">Escolhi este carro</button><button class="details-button dialog-compare" type="button">${selected.includes(car) ? "Remover da comparação" : "Adicionar à comparação"}</button><button class="details-button dialog-contact" type="button">Quero mais informações</button><p class="trust-note">O AutoMatch organiza informações para a decisão; valores e condições devem ser confirmados diretamente com o anunciante.</p></div>`;
    $(".dialog-compare").addEventListener("click", () => {
      toggleCompare(car);
      $("#vehicle-dialog").close();
    });
    $(".dialog-contact").addEventListener("click", () => {
      $("#vehicle-dialog").close();
      openContact(car);
    });
    $(".dialog-choose").addEventListener("click", () => {
      $("#vehicle-dialog").close();
      openDecision(car);
    });
    addDecisionAids(item);
    $("#vehicle-dialog").showModal();
  }

  function openContact(car = currentVehicle) {
    currentVehicle = car;
    const name = car ? fullName(car) : "opções do AutoMatch";
    $("#email-contact").href =
      `mailto:?subject=${encodeURIComponent(`Quero mais informações sobre ${name}`)}&body=${encodeURIComponent(`Olá! Quero receber mais informações sobre ${name}.`)}`;
    $("#whatsapp-contact").href =
      `https://wa.me/?text=${encodeURIComponent(`Olá! Quero mais informações sobre ${name}.`)}`;
    $("#test-drive-contact").href =
      `https://wa.me/?text=${encodeURIComponent(`Olá! Tenho interesse no ${name} e gostaria de combinar um test drive.`)}`;
    $("#contact-dialog").showModal();
  }

  function openDecision(car) {
    const info = insightFor(car);
    $("#decision-content").innerHTML =
      `<p class="eyebrow">SUA ESCOLHA, REGISTRADA</p><h2>${fullName(car)} parece ser uma boa direção.</h2><p>Vou preparar um resumo para você guardar e usar quando conversar com a loja.</p><div class="purchase-checklist"><h3>Resumo da sua escolha</h3><p><strong>Preço anunciado:</strong> ${money.format(car.Price)}<br><strong>Localização:</strong> ${car.Location}<br><strong>Indicado para:</strong> ${info.use}</p></div><label>Para qual e-mail envio o resumo?<input id="decision-email" type="email" placeholder="voce@email.com" required /></label><p class="help-feedback" id="decision-feedback" aria-live="polite"></p><button class="search-button" id="prepare-decision-email" type="button">Preparar e-mail com meu resumo →</button><p class="trust-note">O e-mail será aberto no seu aplicativo para você revisar e enviar. Nada é disparado automaticamente.</p>`;
    $("#prepare-decision-email").addEventListener("click", () => {
      const email = $("#decision-email").value.trim();
      if (!email) {
        $("#decision-feedback").textContent =
          "Informe um e-mail para preparar o resumo.";
        return;
      }
      const subject = encodeURIComponent(
          `Minha escolha no AutoMatch: ${fullName(car)}`,
        ),
        body = encodeURIComponent(
          `Minha escolha no AutoMatch\n\nVeículo: ${fullName(car)}\nPreço anunciado: ${money.format(car.Price)}\nLocalização: ${car.Location}\nIndicado para: ${info.use}\n\nAntes de fechar, quero confirmar disponibilidade, condições finais, itens inclusos, garantia e test drive.`,
        );
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
    });
    $("#decision-dialog").showModal();
  }

  function openCompare() {
    const content = $("#compare-content");
    if (!selected.length)
      content.innerHTML =
        "<h2>Compare veículos</h2><p>Escolha até três veículos nos cards para comparar preço, localização e Match Score.</p>";
    else
      content.innerHTML = `<h2>Seu comparativo</h2><div class="compare-table"><div class="compare-row compare-head"><span>Critério</span>${selected.map((car) => `<strong>${fullName(car)}</strong>`).join("")}</div>${[
        ["Preço", (car) => money.format(car.Price)],
        ["Localização", (car) => car.Location],
        ["Match", (car) => `${score(car, lastSearch)}%`],
      ]
        .map(
          ([label, value]) =>
            `<div class="compare-row"><span>${label}</span>${selected.map((car) => `<span>${value(car)}</span>`).join("")}</div>`,
        )
        .join("")}</div>`;
    addCompareContext();
    $("#compare-dialog").showModal();
  }

  const diagnosticContent = [
    null,
    [
      "Vamos partir do que você imagina dirigir.",
      "É só um ponto de partida. Você pode mudar de ideia a qualquer momento.",
    ],
    [
      "Agora, vamos definir uma faixa confortável.",
      "Assim eu separo oportunidades reais de opções que pesariam no seu plano.",
    ],
    [
      "Vamos olhar para a sua região.",
      "Você decide se prefere algo perto ou se vale considerar uma boa oportunidade em outra cidade.",
    ],
    [
      "Para fechar, diga o que mais importa.",
      "Esse detalhe deixa a recomendação mais próxima da sua rotina, sem eliminar possibilidades.",
    ],
  ];

  function setDiagnosticStep(step) {
    diagnosticStep = Math.max(1, Math.min(4, step));
    document.querySelectorAll("[data-diagnostic-step]").forEach((element) => {
      element.hidden =
        Number(element.dataset.diagnosticStep) !== diagnosticStep;
    });
    diagnosticEyebrow.textContent = `MILLA · PERGUNTA ${diagnosticStep} DE 4`;
    diagnosticTitle.textContent = diagnosticContent[diagnosticStep][0];
    diagnosticCopy.textContent = diagnosticContent[diagnosticStep][1];
    document
      .querySelectorAll(".journey-progress span")
      .forEach((segment, index) =>
        segment.classList.toggle("is-complete", index < diagnosticStep),
      );
    diagnosticBack.hidden = diagnosticStep === 1;
    diagnosticNext.hidden = diagnosticStep === 4;
    diagnosticFinish.hidden = diagnosticStep !== 4;
    helpFeedback.textContent = "";
  }

  function runSearch(event) {
    event?.preventDefault();
    hideQuerySuggestions();
    const natural = interpret(queryInput.value),
      ctx = {
        ...natural,
        location: locationInput.value || natural.city,
        maxPrice: parsedPrice(priceInput.value) || natural.maxPrice,
        priority: priorityInput.value,
        needs: [...document.querySelectorAll('input[name="need"]:checked')].map(
          (input) => input.value,
        ),
      };
    if (
      !(
        ctx.model ||
        ctx.electric ||
        ctx.suv ||
        ctx.sedan ||
        ctx.hatch ||
        ctx.location ||
        ctx.maxPrice
      )
    ) {
      renderWelcome();
      return;
    }
    render(ctx);
    $("#ofertas").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearSearch() {
    form.reset();
    resetCatalogFilters();
    renderWelcome();
  }

  // Helpers para sugestões de busca
  function showQuerySuggestions() {
    if (!querySuggestions) return;
    const query = normalize(queryInput.value);
    if (!query) {
      hideQuerySuggestions();
      return;
    }
    const matches = cars.filter((c) => textFor(c).includes(query)).slice(0, 5);
    if (!matches.length) {
      hideQuerySuggestions();
      return;
    }
    querySuggestions.innerHTML = matches
      .map(
        (c) =>
          `<button type="button" class="query-suggestion"><strong>${fullName(c)}</strong><small>${c.Location} · ${money.format(c.Price)}</small></button>`,
      )
      .join("");
    querySuggestions.hidden = false;
  }
  function hideQuerySuggestions() {
    if (querySuggestions) querySuggestions.hidden = true;
    querySuggestionIndex = -1;
  }
  function setQuerySuggestionActive(index) {
    const items = querySuggestions.querySelectorAll(".query-suggestion");
    if (!items.length) return;
    querySuggestionIndex = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((el, i) =>
      el.classList.toggle("is-active", i === querySuggestionIndex),
    );
  }
  function chooseQuerySuggestion(index) {
    const items = querySuggestions.querySelectorAll(".query-suggestion");
    if (items[index]) {
      queryInput.value = items[index].querySelector("strong").textContent;
      hideQuerySuggestions();
      runSearch();
    }
  }

  // Listeners de Eventos
  queryInput.addEventListener("input", showQuerySuggestions);
  queryInput.addEventListener("focus", () => {
    if (queryInput.value.trim()) showQuerySuggestions();
  });
  queryInput.addEventListener("keydown", (event) => {
    if (querySuggestions.hidden) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setQuerySuggestionActive(querySuggestionIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setQuerySuggestionActive(querySuggestionIndex - 1);
    } else if (event.key === "Enter" && querySuggestionIndex >= 0) {
      event.preventDefault();
      chooseQuerySuggestion(querySuggestionIndex);
    } else if (event.key === "Escape") hideQuerySuggestions();
  });
  queryInput.addEventListener("blur", () =>
    window.setTimeout(hideQuerySuggestions, 120),
  );
  querySuggestions.addEventListener("mousedown", (event) =>
    event.preventDefault(),
  );
  querySuggestions.addEventListener("click", (event) => {
    const option = event.target.closest(".query-suggestion");
    if (option)
      chooseQuerySuggestion(
        [...querySuggestions.querySelectorAll(".query-suggestion")].indexOf(
          option,
        ),
      );
  });

  priceInput.addEventListener("input", () => {
    const number = parsedPrice(priceInput.value);
    priceInput.value = number ? money.format(number) : "";
  });
  form.addEventListener("submit", runSearch);
  clearButton.addEventListener("click", clearSearch);

  const startHelp = () => {
    $("#onboarding-choice").hidden = true;
    helpForm.hidden = false;
    setDiagnosticStep(1);
    $("#jornada").scrollIntoView({ behavior: "smooth", block: "center" });
  };
  $("#start-help").addEventListener("click", startHelp);
  $("#hero-start").addEventListener("click", startHelp);
  $("#header-start").addEventListener("click", startHelp);
  $("#browse-catalog").addEventListener("click", renderCatalog);
  diagnosticNext.addEventListener("click", () =>
    setDiagnosticStep(diagnosticStep + 1),
  );
  diagnosticBack.addEventListener("click", () =>
    setDiagnosticStep(diagnosticStep - 1),
  );
  helpPrice.addEventListener("input", () => {
    const number = parsedPrice(helpPrice.value);
    helpPrice.value = number ? money.format(number) : "";
  });
  helpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      !(helpType.value || helpLocation.value || parsedPrice(helpPrice.value))
    ) {
      helpFeedback.textContent =
        "Escolha ao menos uma preferência para eu conseguir recomendar algo.";
      return;
    }
    helpFeedback.textContent = "";
    queryInput.value = helpType.value;
    locationInput.value = helpLocation.value;
    priceInput.value = helpPrice.value;
    priorityInput.value = helpPriority.value;
    runSearch();
  });

  if (compareTool) compareTool.addEventListener("click", openComparisonTool);
  $("#next-step-compare").addEventListener("click", openCompare);
  $("#open-compare").addEventListener("click", () => {
    if (selected.length < 2) {
      alert(
        "Escolha pelo menos dois veículos para comparar os pontos que realmente mudam sua decisão.",
      );
      return;
    }
    openCompare();
  });
  $("#open-contact").addEventListener("click", () => openContact());
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((button) =>
      button.addEventListener("click", () => button.closest("dialog").close()),
    );
  document.querySelectorAll("[data-quick]").forEach((button) =>
    button.addEventListener("click", () => {
      queryInput.value = button.dataset.quick;
      runSearch();
    }),
  );
  helpType.addEventListener("change", updateElectricContext);
  updateElectricContext();
  catalogTab.addEventListener("click", () => setCatalogTab(false));
  filtersTab.addEventListener("click", () => setCatalogTab(true, true));
  [filterBrand, filterType, filterLocation, filterPrice, filterSort].forEach(
    (input) => input.addEventListener("change", applyCatalogFilters),
  );
  clearCatalogFilters.addEventListener("click", () => {
    resetCatalogFilters();
    applyCatalogFilters();
  });

  // Fetch e Inicialização
  fetch("data/cars.json")
    .then((response) => response.json())
    .then((data) => {
      cars = data;
      [...new Set(cars.map((car) => car.Location))].sort().forEach((place) => {
        locationInput.add(new Option(place, place));
        helpLocation.add(new Option(place, place));
        filterLocation.add(new Option(place, place));
      });
      [...new Set(cars.map((car) => car.Name))]
        .sort()
        .forEach((brand) => filterBrand.add(new Option(brand, brand)));
      resetCatalogFilters();
      renderWelcome();
    })
    .catch(() => {
      title.textContent = "Não foi possível carregar os veículos";
      description.textContent =
        "Abra o projeto por um servidor local para acessar os dados.";
    });
})();
