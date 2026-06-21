const storageKey = "painel-pessoal-v1";
const authRememberKey = "painel-pessoal-manter-login";
const themeStorageKey = "theme";

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  const sun = document.querySelector("#theme-sun");
  const moon = document.querySelector("#theme-moon");
  if (!sun || !moon) return;
  const isDark = nextTheme === "dark";
  sun.style.display = isDark ? "" : "none";
  moon.style.display = isDark ? "none" : "";
  const button = sun.closest("#theme-toggle");
  if (!button) return;
  button.title = isDark ? "Ativar modo claro" : "Ativar modo escuro";
  button.setAttribute("aria-label", button.title);
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
}

function closeEmojiPicker() {
  const picker = document.querySelector("#emoji-picker");
  picker.hidden = true;
  activeEmojiInput = null;
}

function openEmojiPicker(input, anchor) {
  const picker = document.querySelector("#emoji-picker");
  activeEmojiInput = input;
  picker.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const pickerWidth = 300;
  const left = Math.min(window.innerWidth - pickerWidth - 12, Math.max(12, rect.right - pickerWidth));
  const top = Math.min(window.innerHeight - 310, rect.bottom + 7);
  picker.style.left = `${left}px`;
  picker.style.top = `${Math.max(12, top)}px`;
}

const defaultNavOrder = ["dashboard", "quick-notes", "tasks", "pending", "pc", "diet", "wins", "cnh", "home", "agenda", "wishlist", "market", "routine", "finance", "jonathan", "wardrobe"];
const defaultNavGroups = {
  dashboard: "featured",
  "quick-notes": "general",
  tasks: "general",
  pending: "general",
  pc: "organization",
  diet: "organization",
  wins: "organization",
  cnh: "organization",
  home: "organization",
  agenda: "organization",
  wishlist: "shopping",
  market: "shopping",
  routine: "personal",
  finance: "personal",
  jonathan: "personal",
  wardrobe: "personal",
};
const defaultNavMeta = {
  dashboard: { icon: "⌂", label: "Painel" },
  "quick-notes": { icon: "📝", label: "Anotações" },
  tasks: { icon: "📋", label: "Coisas a fazer" },
  pending: { icon: "🚨", label: "Pendências" },
  pc: { icon: "💻", label: "PC" },
  diet: { icon: "🥬", label: "Dieta" },
  wins: { icon: "★", label: "Conquistas" },
  cnh: { icon: "🪪", label: "CNH" },
  home: { icon: "🪑", label: "Mobília" },
  agenda: { icon: "🗓", label: "Agenda" },
  wishlist: { icon: "🛍", label: "Coisas a comprar" },
  market: { icon: "🛒", label: "Mercado" },
  routine: { icon: "💪", label: "Rotina" },
  jonathan: { icon: "📄", label: "Docs" },
  finance: { icon: "💰", label: "Finanças" },
  wardrobe: { icon: "👔", label: "Guarda Roupa" },
};
const navGroupDefinitions = [
  { id: "featured", label: "" },
  { id: "general", label: "Geral" },
  { id: "organization", label: "Organização" },
  { id: "shopping", label: "Compras" },
  { id: "personal", label: "Pessoal" },
];

const defaultState = {
  profilePhoto: "",
  navLayoutVersion: 3,
  navOrder: [...defaultNavOrder],
  navGroups: { ...defaultNavGroups },
  navLabels: Object.fromEntries(Object.entries(defaultNavMeta).map(([section, meta]) => [section, meta.label])),
  navIcons: Object.fromEntries(Object.entries(defaultNavMeta).map(([section, meta]) => [section, meta.icon])),
  navGroupLabels: Object.fromEntries(navGroupDefinitions.map((group) => [group.id, group.label])),
  marketSeedVersion: 0,
  wishlistSeedVersion: 0,
  homePhotoSeedVersion: 1,
  tasks: [
    { id: crypto.randomUUID(), title: "Organizar primeiro painel pessoal", priority: "Alta", done: false },
    { id: crypto.randomUUID(), title: "Definir subdomínio do app", priority: "Média", done: false },
    { id: crypto.randomUUID(), title: "Separar módulos que terão login e banco", priority: "Média", done: false },
  ],
  market: [
    { id: crypto.randomUUID(), name: "Sucrilhos para açaí", category: "food", qty: 1, price: 0, bought: false },
    { id: crypto.randomUUID(), name: "Pão sovado", category: "food", qty: 1, price: 0, bought: true },
    { id: crypto.randomUUID(), name: "Macarrão 500g", category: "food", qty: 1, price: 0, bought: true },
    { id: crypto.randomUUID(), name: "Pão italiano", category: "food", qty: 1, price: 0, bought: true },
    { id: crypto.randomUUID(), name: "Ketchup", category: "seasoning", qty: 1, price: 0, bought: true },
    { id: crypto.randomUUID(), name: "Detergente", category: "cleaning", qty: 1, price: 0, bought: false },
    { id: crypto.randomUUID(), name: "Sabonete", category: "hygiene", qty: 3, price: 0, bought: false },
    { id: crypto.randomUUID(), name: "Frango", category: "mix", qty: 2, price: 18.5, bought: false },
    { id: crypto.randomUUID(), name: "Maçã", category: "fruit", qty: 6, price: 0, bought: false },
    { id: crypto.randomUUID(), name: "Leite condensado", category: "dessert", qty: 1, price: 0, bought: true },
  ],
  wishlist: [
    { id: crypto.randomUUID(), name: "Cuecas novas", priority: "Alta", price: 0, link: "", bought: false },
    { id: crypto.randomUUID(), name: "Bateria do notebook", priority: "Média", price: 0, link: "", bought: false },
    { id: crypto.randomUUID(), name: "Bateria do iPhone", priority: "Média", price: 0, link: "Santa Efigênia", bought: false },
  ],
  agenda: [
    { id: crypto.randomUUID(), title: "Revisar prioridades do dia", date: new Date().toISOString().slice(0, 10), type: "reminder", done: false },
  ],
  agendaPlan: {
    month: todayISO().slice(0, 7),
  },
  cnh: {
    startDate: "2026-04-29",
    endDate: "2027-04-29",
    steps: [
      { id: crypto.randomUUID(), title: "Iniciar", value: 0, dueDate: "2026-04-29", done: true },
      { id: crypto.randomUUID(), title: "Curso teórico", value: 0, dueDate: "", done: true },
      { id: crypto.randomUUID(), title: "Coleta biométrica (foto + digital)", value: 0, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Exame médico", value: 90, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Psicotécnico", value: 90, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Taxa prova teórica", value: 52.83, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Agendar prova teórica", value: 0, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Aulas práticas (auto escola)", value: 0, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Aulas práticas", value: 0, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Prova prática", value: 52.83, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Agendar prova prática", value: 0, dueDate: "", done: false },
      { id: crypto.randomUUID(), title: "Emitir CNH", value: 137.79, dueDate: "2027-04-29", done: false },
    ],
  },
  wins: [
    { id: crypto.randomUUID(), title: "Comprei Notebook", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Comprei Air Fryer", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Comprei Panela de Arroz", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Comprei Liquidificador", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Comprei PC Gamer", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Entrei na Faculdade", date: todayISO(), photo: "" },
    { id: crypto.randomUUID(), title: "Fui morar em um Studio Melhor", date: todayISO(), photo: "" },
  ],
  homeItems: [
    { id: crypto.randomUUID(), title: "Air Fryer", done: true, photo: "https://images-na.ssl-images-amazon.com/images/I/61reOuZyZNL.jpg" },
    { id: crypto.randomUUID(), title: "Panela de Arroz", done: true, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rice_Cooker_1.png/500px-Rice_Cooker_1.png" },
    { id: crypto.randomUUID(), title: "Liquidificador", done: true, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Vitamix_Blender.jpg/500px-Vitamix_Blender.jpg" },
    { id: crypto.randomUUID(), title: "Ventilador", done: true, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hatari_18_inch_fan.jpg/500px-Hatari_18_inch_fan.jpg" },
    { id: crypto.randomUUID(), title: "Geladeira", done: false, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/A_Samsung_Refrigerator.jpg/500px-A_Samsung_Refrigerator.jpg" },
    { id: crypto.randomUUID(), title: "Máquina de lava e seca", done: false, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg/500px-LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg" },
    { id: crypto.randomUUID(), title: "Chuveiro ducha", done: false, photo: "https://whitehauscollection.com/cdn/shop/products/WHOSA28SQ-8_PolishedChrome.jpg?v=1602014810&width=900" },
  ],
  wardrobeItems: [],
  wardrobeSelection: [],
  wardrobeLooks: [],
  personal: {
    info: {
      name: "Jonatã",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
    goals: [
      { id: crypto.randomUUID(), title: "Organizar documentos pessoais", area: "Vida", done: false },
      { id: crypto.randomUUID(), title: "Definir metas do mês", area: "Dinheiro", done: false },
    ],
    docs: [
      { id: crypto.randomUUID(), title: "CNH", value: "Acompanhar processo", done: false },
      { id: crypto.randomUUID(), title: "Documentos importantes", value: "Separar documentos pessoais", done: false },
    ],
  },
  notes: [
    { id: crypto.randomUUID(), text: "Ideia: transformar cada área do Notion em um módulo real do app.", date: new Date().toLocaleDateString("pt-BR") },
  ],
  finance: [
    { id: crypto.randomUUID(), title: "Salário", type: "income", category: "Salário", value: 0, dueDate: todayISO(), done: false, date: new Date().toLocaleDateString("pt-BR") },
    { id: crypto.randomUUID(), title: "Mercado", type: "expense", category: "Mercado", value: 0, dueDate: todayISO(), done: false, date: new Date().toLocaleDateString("pt-BR") },
  ],
  financePlan: {
    month: todayISO().slice(0, 7),
    viewMode: "month",
    year: Number(todayISO().slice(0, 4)),
    plannedIncome: 0,
    reserveGoal: 0,
  },
  financeLayout: {
    summary: ["received", "payable", "expected", "free"],
    dashboard: ["distribution", "bills", "subscriptions", "commissions", "goals", "categories", "recent"],
  },
  financeGoals: [
    { id: crypto.randomUUID(), title: "Reserva de emergência", current: 0, target: 10000 },
  ],
  fixedCosts: [
    { id: crypto.randomUUID(), title: "Aluguel", value: 0, dueDay: 10, paid: false },
    { id: crypto.randomUUID(), title: "Água", value: 0, dueDay: 10, paid: false },
    { id: crypto.randomUUID(), title: "Energia", value: 0, dueDay: 10, paid: false },
    { id: crypto.randomUUID(), title: "Conta de celular", value: 0, dueDay: 15, paid: false },
    { id: crypto.randomUUID(), title: "Internet", value: 0, dueDay: 15, paid: false },
  ],
  variableCosts: [
    { id: crypto.randomUUID(), title: "Lazer", value: 0, dueDate: todayISO(), paid: false },
    { id: crypto.randomUUID(), title: "Educação", value: 0, dueDate: todayISO(), paid: false },
    { id: crypto.randomUUID(), title: "Sair", value: 0, dueDate: todayISO(), paid: false },
    { id: crypto.randomUUID(), title: "Comprar coisas", value: 0, dueDate: todayISO(), paid: false },
    { id: crypto.randomUUID(), title: "Mercado extra", value: 0, dueDate: todayISO(), paid: false },
  ],
  pending: [
    {
      id: crypto.randomUUID(),
      title: "Organização pessoal",
      type: "daily",
      done: false,
      subtasks: [
        { id: crypto.randomUUID(), title: "Revisar prioridades do dia", done: false },
        { id: crypto.randomUUID(), title: "Organizar pendências abertas", done: false },
        { id: crypto.randomUUID(), title: "Separar tarefas importantes", done: false },
      ],
    },
    { id: crypto.randomUUID(), title: "Comprar cueca", type: "daily", done: false, subtasks: [] },
    {
      id: crypto.randomUUID(),
      title: "Revisão semanal",
      type: "weekly",
      done: false,
      subtasks: [
        { id: crypto.randomUUID(), title: "Revisar tarefas da semana", done: false },
        { id: crypto.randomUUID(), title: "Atualizar agenda e finanças", done: false },
      ],
    },
    { id: crypto.randomUUID(), title: "Trocar bateria iPhone Santa Efigênia", type: "backlog", done: false, subtasks: [] },
    { id: crypto.randomUUID(), title: "Trocar bateria notebook", type: "backlog", done: false, subtasks: [] },
    { id: crypto.randomUUID(), title: "Revisar planejamento do mês", type: "monthly", done: false, subtasks: [] },
  ],
  routineTracker: {
    date: todayISO(),
    selectedDate: todayISO(),
    viewMode: "day",
    waterType: "required",
    consistencyStartDate: todayISO(),
    waterMl: 0,
    waterGoalMl: 3000,
    history: {},
    habitHistory: {},
    bestStreak: 0,
  },
  routineCategories: [
    { id: "required", name: "Essenciais (Diário)", locked: true },
    { id: "endday", name: "Saúde", locked: true },
    { id: "day", name: "Produtividade", locked: true },
    { id: "weekly", name: "Semanais", locked: true },
    { id: "extras", name: "Extras", locked: true },
  ],
  routineLayout: ["required", "endday", "day", "weekly", "extras"],
  routine: [
    { id: crypto.randomUUID(), title: "Café da manhã", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Almoço", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Lanche da tarde", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Janta", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Sobremesa", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Fruta", type: "required", done: false },
    { id: crypto.randomUUID(), title: "1L de água", type: "required", done: false },
    { id: crypto.randomUUID(), title: "1L de água", type: "required", done: false },
    { id: crypto.randomUUID(), title: "1L de água", type: "required", done: false },
    { id: crypto.randomUUID(), title: "3L de água", type: "required", done: false },
    { id: crypto.randomUUID(), title: "30m de sol", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Remédios", type: "required", done: false },
    { id: crypto.randomUUID(), title: "Academia", type: "endday", done: false },
    { id: crypto.randomUUID(), title: "Correr", type: "endday", done: false },
    { id: crypto.randomUUID(), title: "Luta", type: "endday", done: false },
    { id: crypto.randomUUID(), title: "Sair para qualquer coisa", type: "extras", done: false },
    { id: crypto.randomUUID(), title: "Trabalhar", type: "day", done: false },
    { id: crypto.randomUUID(), title: "B12 1 semana", type: "weekly", done: false },
  ],
};

const placeholders = {
  pending: ["Pendências", "Acompanhamento de pendências com prazos, status, responsáveis e alertas."],
  personal: ["Jonatã", "Espaço para documentos, metas pessoais, dados importantes e planos."],
  wishlist: ["Coisas a comprar", "Lista de desejos com prioridade, preço esperado e link de compra."],
  diet: ["Dieta", "Controle de refeições, metas, compras e acompanhamento alimentar."],
  cnh: ["CNH", "Etapas, documentos, datas e pendências do processo de habilitação."],
  pc: ["PC", "Configurações, programas, manutenções e histórico do computador."],
  mods: ["Modificações", "Ideias de mudanças, melhorias e projetos em andamento."],
  apps: ["Aplicativos", "Lista de ferramentas, contas, assinaturas e apps importantes."],
  specs: ["Especificações", "Dados técnicos, medidas, equipamentos e informações de referência."],
  home: ["Mobília", "Planejamento de móveis, medidas, compras e prioridades da casa."],
  wins: ["Conquistas", "Registro de vitórias, marcos e evolução pessoal."],
};

let activeFinanceFilter = "all";
let marketShopMode = false;

const financeCategories = ["Salário", "Casa", "Mercado", "Transporte", "Lazer", "Saúde", "Outros"];

const wardrobeCategories = [
  { id: "coat", label: "Casaco/Jaqueta", optional: true },
  { id: "top", label: "Parte de cima", optional: false },
  { id: "bottom", label: "Parte de baixo", optional: false },
  { id: "shoes", label: "Calçado", optional: false },
  { id: "accessory", label: "Acessório", optional: true },
];

const routineEmojiOptions = [
  "☕", "🍽️", "🍛", "🍎", "🍌", "🥗", "💧", "💊",
  "🏋️", "🏃", "🥊", "🚴", "⚽", "☀️", "🌙", "🛌",
  "🧘", "🧹", "🧼", "🚿", "🪥", "💼", "📚", "✍️",
  "💻", "📱", "💡", "🎯", "✅", "🔥", "⭐", "🏆",
  "💰", "🛒", "🚶", "🚗", "🎵", "🎮", "❤️", "🙏",
];
let activeEmojiInput = null;

function wardrobeCategoryLabel(category) {
  return wardrobeCategories.find((item) => item.id === category)?.label || category;
}

function inferRoutineEmoji(title) {
  return /café|cafe/i.test(title) ? "☕"
    : /almoço/i.test(title) ? "🍽️"
      : /janta|lanche|sobremesa/i.test(title) ? "🍛"
        : /fruta/i.test(title) ? "🍎"
          : /academia/i.test(title) ? "🏋️"
            : /correr/i.test(title) ? "🏃"
              : /luta/i.test(title) ? "🥊"
                : /sol/i.test(title) ? "☀️"
                  : /medit/i.test(title) ? "🧘"
                    : /trabalh/i.test(title) ? "💼"
                      : /estud|ler|leitura/i.test(title) ? "📚"
                        : /projeto/i.test(title) ? "💡"
                          : /b12|remédio|remedio/i.test(title) ? "💊"
                            : /limpeza/i.test(title) ? "🧹"
                              : /sair/i.test(title) ? "🚶"
                                : "✅";
}

const marketCategories = [
  { id: "food", icon: "🍽", label: "Comida" },
  { id: "seasoning", icon: "🔥", label: "Temperos" },
  { id: "cleaning", icon: "🧹", label: "Limpeza" },
  { id: "hygiene", icon: "🧴", label: "Higiene pessoal" },
  { id: "mix", icon: "🍖", label: "Mistura" },
  { id: "fruit", icon: "🍎", label: "Frutas" },
  { id: "dessert", icon: "🍫", label: "Sobremesas" },
];

const marketSeedItems = [
  { name: "Sucrilhos para Açaí", category: "food" },
  { name: "Pão Sovado", category: "food" },
  { name: "Macarrão 500g 1 Pacote", category: "food" },
  { name: "Pão Italiano", category: "food" },
  { name: "Miojo", category: "food" },
  { name: "Ketchup 1", category: "food" },
  { name: "Suco de Pacote 10", category: "food" },
  { name: "Leite Condensado", category: "food" },
  { name: "Queijo Ralado", category: "food" },
  { name: "Leite", category: "food" },
  { name: "Iogurte", category: "food" },
  { name: "Goiabada 2", category: "food" },
  { name: "Maionese", category: "food" },
  { name: "Manteiga", category: "food" },
  { name: "Bolacha de Sal", category: "food" },
  { name: "Bolacha de Maizena", category: "food" },
  { name: "Polpa de Frutas Variadas 2", category: "food" },
  { name: "Arroz 8 KG", category: "food" },
  { name: "Toddy 1 Pote", category: "food" },
  { name: "Gelatina 4", category: "food" },
  { name: "Molho de Tomate 3", category: "food" },
  { name: "Feijão 1 KG", category: "food" },
  { name: "Óleo 6", category: "food" },
  { name: "Sal 1 KG", category: "seasoning" },
  { name: "Azeite", category: "seasoning" },
  { name: "Vinagre", category: "seasoning" },
  { name: "Bom Ar em Spray", category: "cleaning" },
  { name: "Bom Ar Automático de Banheiro", category: "cleaning" },
  { name: "Saco de Lixo Grande", category: "cleaning" },
  { name: "Sabão em Pó 2 KG", category: "cleaning" },
  { name: "Detergente 5L", category: "cleaning" },
  { name: "Amaciante 5L", category: "cleaning" },
  { name: "Enxaguante Bucal", category: "hygiene" },
  { name: "Desodorante", category: "hygiene" },
  { name: "Barbeador", category: "hygiene" },
  { name: "Fio Dental", category: "hygiene" },
  { name: "Pasta de Dente", category: "hygiene" },
  { name: "Sabonete", category: "hygiene" },
  { name: "Shampoo", category: "hygiene" },
  { name: "Papel higiênico", category: "hygiene" },
  { name: "Soro Fisiológico", category: "hygiene" },
  { name: "Lasanha", category: "mix" },
  { name: "Peixe - Tilápia e Salmão", category: "mix" },
  { name: "Coxinha da Asa", category: "mix" },
  { name: "Filé de Frango 2 KG", category: "mix" },
  { name: "Cartela de Ovos 12", category: "mix" },
  { name: "Maçã 1kg", category: "fruit" },
  { name: "Banana 5", category: "fruit" },
  { name: "Manga", category: "fruit" },
  { name: "Morango", category: "fruit" },
  { name: "Uva", category: "fruit" },
  { name: "Pera", category: "fruit" },
  { name: "Melancia", category: "fruit" },
  { name: "Limão", category: "fruit" },
  { name: "AÇAÍ 2L", category: "dessert" },
  { name: "Barra de Chocolate", category: "dessert" },
];

const wishlistCategories = [
  { id: "technology", icon: "▣", label: "Tecnologia" },
  { id: "bedroom", icon: "⌁", label: "Quarto" },
  { id: "kitchen", icon: "⌂", label: "Cozinha" },
  { id: "cleaning", icon: "⌁", label: "Limpeza" },
  { id: "clothing", icon: "◇", label: "Roupas e acessórios" },
];

const wishlistSeedItems = [
  { name: "Televisão", category: "technology" },
  { name: "Cabo de carregador Tipo C para Iphone", category: "technology" },
  { name: "Teclado Gamer", category: "technology", link: "Link" },
  { name: "Base para Notebook com Cooler", category: "technology" },
  { name: "Sensor de Presença/Movimento para ligar luz.", category: "technology" },
  { name: "Luz de Led HDMI para Tv e Monitor", category: "technology" },
  { name: "Carregador Sem Fio Iphone", category: "technology" },
  { name: "Tomada Inteligente", category: "technology" },
  { name: "Tomada com cabo de carregador e USB", category: "technology" },
  { name: "Teclado Macro de Atalhos", category: "technology" },
  { name: "HDMI sem FIO", category: "technology" },
  { name: "Bateria Portátil Iphone - Baseus", category: "technology" },
  { name: "Travesseiro Grande", category: "bedroom" },
  { name: "3 Fronha de Travesseiro", category: "bedroom" },
  { name: "2 Lençóis Cama de Casal", category: "bedroom" },
  { name: "2 Protetor de Cama de Casal", category: "bedroom" },
  { name: "Cabides Normal e de Ternos", category: "bedroom" },
  { name: "Micro-ondas", category: "kitchen" },
  { name: "Panela de Arroz", category: "kitchen" },
  { name: "Lancheira ou Bolsa Térmica", category: "kitchen" },
  { name: "Faca de Cortar Carnes Amolada", category: "kitchen" },
  { name: "Pote para Batata Balha e Macarrão", category: "kitchen" },
  { name: "Copo de Vidro Grosso", category: "kitchen" },
  { name: "Copo de Plástico", category: "kitchen" },
  { name: "Pincel para Temperar Carne e Untar Forno", category: "kitchen" },
  { name: "Pano de Prato", category: "kitchen" },
  { name: "Máquina de Lavar", category: "cleaning" },
  { name: "Toalha de Rosto", category: "cleaning" },
  { name: "Rodo e Cabo", category: "cleaning" },
  { name: "Cabo de Vassoura", category: "cleaning" },
  { name: "Pá", category: "cleaning" },
  { name: "Cueca", category: "clothing", link: "Link" },
  { name: "Multivitamínicos", category: "clothing" },
  { name: "Óculos Colorido de Role", category: "clothing", link: "Loja Insta e Net" },
  { name: "Relógio", category: "clothing", link: "Loja Insta e Net" },
  { name: "Sapato Social Preto", category: "clothing", link: "Loja Insta e Net" },
  { name: "Corrente", category: "clothing", link: "Loja Insta e Net" },
  { name: "Minoxidil", category: "clothing" },
  { name: "Perfume para trabalho", category: "clothing" },
  { name: "Perfume para sair", category: "clothing" },
  { name: "Palmilha Tênis Puma", category: "clothing" },
  { name: "Cadarço Preto Tênis Puma", category: "clothing" },
  { name: "Cadarço Marrom Sapato Marrom", category: "clothing" },
  { name: "Cinto", category: "clothing" },
  { name: "Dixavador", category: "clothing" },
  { name: "Maquina de Cortar Barba e Aparador de Pelos", category: "clothing" },
];

const homeDefaultPhotos = {
  "air fryer": "https://images-na.ssl-images-amazon.com/images/I/61reOuZyZNL.jpg",
  "panela de arroz": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rice_Cooker_1.png/500px-Rice_Cooker_1.png",
  liquidificador: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Vitamix_Blender.jpg/500px-Vitamix_Blender.jpg",
  ventilador: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hatari_18_inch_fan.jpg/500px-Hatari_18_inch_fan.jpg",
  geladeira: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/A_Samsung_Refrigerator.jpg/500px-A_Samsung_Refrigerator.jpg",
  "maquina de lava e seca": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg/500px-LG_%EB%93%9C%EB%9F%BC%EC%84%B8%ED%83%81%EA%B8%B0%EC%99%80_%EC%8B%9D%EA%B8%B0%EC%84%B8%EC%B2%99%EA%B8%B0%2C_%EC%98%81%EA%B5%AD%EC%84%9C_%EB%AC%BC%EC%82%AC%EC%9A%A9_%ED%9A%A8%EC%9C%A8_%EC%B5%9C%EC%9A%B0%EC%88%98_%EC%A0%9C%ED%92%88_%EC%88%98%EC%83%81.jpg",
  "chuveiro ducha": "https://whitehauscollection.com/cdn/shop/products/WHOSA28SQ-8_PolishedChrome.jpg?v=1602014810&width=900",
};

let stateWasMigrated = false;
let state = loadState();
ensureRoutineToday();
if (stateWasMigrated) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
let expandedPending = new Set();
let undoStack = [];
let supabaseClient = null;
let currentUser = null;
let allowAuthAutoEnter = false;
let onlineSaveTimer = null;
let isLoadingRemoteState = false;
let financeBillFilter = "all";
const cloudModuleKeys = Object.keys(defaultState);

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".side-nav button");
const sidebar = document.querySelector(".sidebar");
const pageTitle = document.querySelector("#page-title");

function loadState() {
  try {
    stateWasMigrated = false;
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const savedRoutineHasGroups = saved?.routine?.some((item) => item.type);
    const merged = saved ? {
      ...defaultState,
      ...saved,
      tasks: saved.tasks || defaultState.tasks,
      market: saved.market || defaultState.market,
      wishlist: saved.wishlist || defaultState.wishlist,
      agenda: saved.agenda || defaultState.agenda,
      cnh: saved.cnh || defaultState.cnh,
      wins: saved.wins || defaultState.wins,
      homeItems: saved.homeItems || defaultState.homeItems,
      wardrobeItems: saved.wardrobeItems || defaultState.wardrobeItems,
      wardrobeSelection: saved.wardrobeSelection || defaultState.wardrobeSelection,
      wardrobeLooks: saved.wardrobeLooks || defaultState.wardrobeLooks,
      personal: saved.personal || defaultState.personal,
      notes: saved.notes || defaultState.notes,
      finance: saved.finance || defaultState.finance,
      financePlan: saved.financePlan || defaultState.financePlan,
      financeLayout: saved.financeLayout || defaultState.financeLayout,
      financeGoals: saved.financeGoals || defaultState.financeGoals,
      fixedCosts: saved.fixedCosts || defaultState.fixedCosts,
      variableCosts: saved.variableCosts || defaultState.variableCosts,
      pending: saved.pending || defaultState.pending,
      routineTracker: saved.routineTracker || defaultState.routineTracker,
      routineCategories: saved.routineCategories || defaultState.routineCategories,
      routineLayout: saved.routineLayout || defaultState.routineLayout,
      routine: savedRoutineHasGroups ? saved.routine : defaultState.routine,
    } : defaultState;
    merged.pending = merged.pending.map((task) => ({ ...task, subtasks: task.subtasks || [] }));
    merged.wardrobeItems = (merged.wardrobeItems || []).map((item) => ({
      ...item,
      name: item.name || "Peça sem nome",
      category: item.category || "top",
      color: item.color || "",
      style: item.style || "",
      notes: item.notes || "",
      image: item.image || "",
    }));
    merged.wardrobeSelection = (merged.wardrobeSelection || []).filter((id) => merged.wardrobeItems.some((item) => item.id === id));
    merged.wardrobeLooks = (merged.wardrobeLooks || []).map((look) => ({
      ...look,
      pieces: (look.pieces || []).filter((id) => merged.wardrobeItems.some((item) => item.id === id)),
      favorite: Boolean(look.favorite),
      createdAt: look.createdAt || new Date().toISOString(),
    }));
    merged.routineTracker = {
      ...defaultState.routineTracker,
      ...(merged.routineTracker || {}),
      history: merged.routineTracker?.history || {},
      habitHistory: merged.routineTracker?.habitHistory || {},
      selectedDate: merged.routineTracker?.selectedDate || todayISO(),
      viewMode: ["day", "month", "year"].includes(merged.routineTracker?.viewMode) ? merged.routineTracker.viewMode : "day",
      waterType: merged.routineTracker?.waterType || "required",
      consistencyStartDate: merged.routineTracker?.consistencyStartDate || todayISO(),
      waterMl: Number(merged.routineTracker?.waterMl || 0),
      waterGoalMl: Number(merged.routineTracker?.waterGoalMl || 3000),
      bestStreak: Number(merged.routineTracker?.bestStreak || 0),
    };
    merged.routineCategories = [
      ...defaultState.routineCategories,
      ...(merged.routineCategories || []).filter((category) => !defaultState.routineCategories.some((defaultCategory) => defaultCategory.id === category.id)),
    ];
    const savedRoutineLayout = merged.routineLayout || [];
    const availableRoutineCategories = merged.routineCategories.map((category) => category.id);
    if (!availableRoutineCategories.includes(merged.routineTracker.waterType)) merged.routineTracker.waterType = "required";
    merged.routineLayout = [
      ...savedRoutineLayout.filter((key) => availableRoutineCategories.includes(key)),
      ...availableRoutineCategories.filter((key) => !savedRoutineLayout.includes(key)),
    ];
    if (merged.routineTracker.date !== todayISO()) {
      const previousHabits = merged.routine.filter((item) => !/água|agua/i.test(item.title));
      const previousDone = previousHabits.filter((item) => item.done).length;
      const previousTotal = previousHabits.length + 1;
      const waterDone = merged.routineTracker.waterMl >= merged.routineTracker.waterGoalMl ? 1 : 0;
      merged.routineTracker.history[merged.routineTracker.date] = Math.round(((previousDone + waterDone) / Math.max(1, previousTotal)) * 100);
      if (merged.routineTracker.date >= merged.routineTracker.consistencyStartDate) {
        recordRoutineHabitHistoryFor(merged.routineTracker, merged.routine, merged.routineTracker.date);
      }
      merged.routineTracker.date = todayISO();
      merged.routineTracker.waterMl = 0;
      merged.routine = merged.routine.map((item) => ({ ...item, done: false }));
      stateWasMigrated = true;
    }
    [
      ["Meditar", "endday"],
      ["Estudar", "day"],
      ["Ler", "day"],
      ["Projetos pessoais", "day"],
      ["Limpeza geral", "weekly"],
    ].forEach(([title, type]) => {
      if (!merged.routine.some((item) => item.title.toLocaleLowerCase("pt-BR") === title.toLocaleLowerCase("pt-BR"))) {
        merged.routine.push({ id: crypto.randomUUID(), title, type, done: false });
        stateWasMigrated = true;
      }
    });
    const availableNavSections = [...document.querySelectorAll(".side-nav button")].map((button) => button.dataset.section);
    merged.navOrder = [
      ...(merged.navOrder || []).filter((section) => availableNavSections.includes(section)),
      ...availableNavSections.filter((section) => !(merged.navOrder || []).includes(section)),
    ];
    merged.navGroups = {
      ...defaultNavGroups,
      ...(merged.navGroups || {}),
    };
    Object.keys(merged.navGroups).forEach((section) => {
      if (!availableNavSections.includes(section)) delete merged.navGroups[section];
    });
    merged.navLabels = {
      ...defaultState.navLabels,
      ...(merged.navLabels || {}),
    };
    merged.navIcons = {
      ...defaultState.navIcons,
      ...(merged.navIcons || {}),
    };
    merged.navGroupLabels = {
      ...defaultState.navGroupLabels,
      ...(merged.navGroupLabels || {}),
    };
    Object.keys(merged.navLabels).forEach((section) => {
      if (!availableNavSections.includes(section)) delete merged.navLabels[section];
    });
    Object.keys(merged.navIcons).forEach((section) => {
      if (!availableNavSections.includes(section)) delete merged.navIcons[section];
    });
    if (Number(saved?.navLayoutVersion || 0) < defaultState.navLayoutVersion) {
      merged.navOrder = defaultNavOrder.filter((section) => availableNavSections.includes(section));
      merged.navGroups = { ...defaultNavGroups };
      merged.navLabels = { ...defaultState.navLabels };
      merged.navIcons = { ...defaultState.navIcons };
      merged.navGroupLabels = { ...defaultState.navGroupLabels };
      merged.navLayoutVersion = defaultState.navLayoutVersion;
      stateWasMigrated = true;
    }
    const normalizeName = (value) => String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    merged.market = merged.market.map((item) => ({ ...item, category: item.category || "food" }));
    if (Number(saved?.marketSeedVersion || merged.marketSeedVersion || 0) < 1) {
      const existingMarketNames = new Set(merged.market.map((item) => normalizeName(item.name)));
      const newMarketItems = marketSeedItems
        .filter((item) => !existingMarketNames.has(normalizeName(item.name)))
        .map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          category: item.category,
          qty: 1,
          price: 0,
          shopQty: 1,
          shopPrice: 0,
          bought: false,
          inCart: false,
        }));
      merged.market.push(...newMarketItems);
      merged.marketSeedVersion = 1;
      stateWasMigrated = true;
    }
    merged.wishlist = merged.wishlist.map((item) => {
      const name = String(item.name || "").toLowerCase();
      const inferredCategory = /cueca|roupa|sapato|tênis|tenis|perfume|óculos|oculos|relógio|relogio|cinto|corrente/.test(name)
        ? "clothing"
        : /bateria|notebook|iphone|carregador|teclado|monitor|hdmi|tomada|sensor|televis/.test(name)
          ? "technology"
          : "technology";
      return {
        ...item,
        category: item.category || inferredCategory,
        priority: item.priority || "Média",
        price: Number(item.price || 0),
        link: item.link || "",
        bought: Boolean(item.bought),
      };
    });
    if (Number(saved?.wishlistSeedVersion || merged.wishlistSeedVersion || 0) < 1) {
      const existingNames = new Set(merged.wishlist.map((item) => item.name.trim().toLowerCase()));
      const newItems = wishlistSeedItems
        .filter((item) => !existingNames.has(item.name.trim().toLowerCase()))
        .map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          category: item.category,
          priority: "Média",
          price: 0,
          link: item.link || "",
          bought: false,
        }));
      merged.wishlist.push(...newItems);
      merged.wishlistSeedVersion = 1;
      stateWasMigrated = true;
    }
    merged.agenda = merged.agenda.map((item) => ({ ...item, date: item.date || new Date().toISOString().slice(0, 10), type: item.type || "reminder", done: Boolean(item.done) }));
    merged.cnh = {
      ...defaultState.cnh,
      ...(merged.cnh || {}),
      steps: (merged.cnh?.steps || defaultState.cnh.steps).map((item) => ({
        ...item,
        title: item.title || "Etapa da CNH",
        value: Number(item.value || 0),
        dueDate: item.dueDate || "",
        done: Boolean(item.done),
      })),
    };
    merged.wins = merged.wins.map((item) => ({ ...item, date: item.date || todayISO(), photo: item.photo || "" }));
    const shouldRefreshHomePhotos = Number(saved?.homePhotoSeedVersion || 0) < 1;
    merged.homeItems = (merged.homeItems || defaultState.homeItems).map((item) => {
      const defaultPhoto = homeDefaultPhotos[normalizeName(item.title)] || "";
      const currentPhoto = String(item.photo || "");
      const hasManualPhoto = currentPhoto.startsWith("data:image/");
      const hasOldRandomPhoto = currentPhoto.includes("loremflickr.com");
      const needsDefaultPhoto = defaultPhoto && (!currentPhoto || hasOldRandomPhoto || (shouldRefreshHomePhotos && !hasManualPhoto));
      if (needsDefaultPhoto) stateWasMigrated = true;
      return {
        ...item,
        done: Boolean(item.done),
        photo: needsDefaultPhoto ? defaultPhoto : currentPhoto,
      };
    });
    if (shouldRefreshHomePhotos) {
      merged.homePhotoSeedVersion = 1;
      stateWasMigrated = true;
    }
    merged.personal = {
      ...defaultState.personal,
      ...merged.personal,
      info: { ...defaultState.personal.info, ...(merged.personal?.info || {}) },
      goals: (merged.personal?.goals || defaultState.personal.goals).map((item) => ({ ...item, area: item.area || "Vida", done: Boolean(item.done) })),
      docs: (merged.personal?.docs || defaultState.personal.docs).map((item) => ({ ...item, value: item.value || "", done: Boolean(item.done) })),
    };
    merged.financePlan = {
      ...defaultState.financePlan,
      ...merged.financePlan,
      viewMode: merged.financePlan?.viewMode || "month",
      year: Number(merged.financePlan?.year || String(merged.financePlan?.month || todayISO()).slice(0, 4)),
      plannedIncome: Number(merged.financePlan?.plannedIncome || 0),
      reserveGoal: Number(merged.financePlan?.reserveGoal || 0),
    };
    const savedSummaryLayout = merged.financeLayout?.summary || [];
    let savedDashboardLayout = merged.financeLayout?.dashboard || [];
    const previousDashboardDefaults = [
      ["bills", "subscriptions", "distribution", "commissions", "goals", "recent", "categories"],
      ["bills", "distribution", "subscriptions", "commissions", "goals", "recent", "categories"],
    ];
    if (previousDashboardDefaults.some((layout) => layout.join("|") === savedDashboardLayout.join("|"))) {
      savedDashboardLayout = defaultState.financeLayout.dashboard;
      stateWasMigrated = true;
    }
    merged.financeLayout = {
      summary: [
        ...savedSummaryLayout.filter((key) => defaultState.financeLayout.summary.includes(key)),
        ...defaultState.financeLayout.summary.filter((key) => !savedSummaryLayout.includes(key)),
      ],
      dashboard: [
        ...savedDashboardLayout.filter((key) => defaultState.financeLayout.dashboard.includes(key)),
        ...defaultState.financeLayout.dashboard.filter((key) => !savedDashboardLayout.includes(key)),
      ],
    };
    merged.financeGoals = (merged.financeGoals || defaultState.financeGoals).map((item) => ({
      ...item,
      title: item.title || "Meta financeira",
      current: Number(item.current || 0),
      target: Number(item.target || 0),
    }));
    merged.fixedCosts = merged.fixedCosts.map((item) => ({
      ...item,
      value: Number(item.value || 0),
      dueDay: Number(item.dueDay || 1),
      paidMonths: item.paidMonths || (item.paid ? { [merged.financePlan.month || todayISO().slice(0, 7)]: true } : {}),
      paid: Boolean(item.paid),
    }));
    merged.variableCosts = merged.variableCosts.map((item) => ({
      ...item,
      value: Number(item.value || 0),
      dueDate: item.dueDate || todayISO(),
      paidMonths: item.paidMonths || (item.paid ? { [merged.financePlan.month || todayISO().slice(0, 7)]: true } : {}),
      paid: Boolean(item.paid),
    }));
    merged.finance = merged.finance.map((item) => ({
      ...item,
      value: Number(item.value || 0),
      dueDate: item.dueDate || todayISO(),
      dateMode: item.dateMode || "date",
      businessDay: Number(item.businessDay || 5),
      done: Boolean(item.done),
      date: item.date || new Date().toLocaleDateString("pt-BR"),
    }));
    if (merged.routine.some((item) => !item.emoji)) stateWasMigrated = true;
    merged.routine = merged.routine.map((item) => ({
      ...item,
      type: item.type === "day" && /sair/i.test(item.title) ? "extras" : item.type || "required",
      emoji: item.emoji || inferRoutineEmoji(item.title),
    }));
    return merged;
  } catch {
    return defaultState;
  }
}

function recordRoutineHabitHistoryFor(tracker, routine, date = todayISO()) {
  if (!tracker || !routine) return;
  tracker.consistencyStartDate ||= todayISO();
  tracker.habitHistory ||= {};
  tracker.habitHistory[date] ||= {};
  routine
    .filter((item) => !/água|agua/i.test(item.title))
    .forEach((item) => {
      tracker.habitHistory[date][item.id] = Boolean(item.done);
    });
  tracker.habitHistory[date].__water = tracker.waterMl >= tracker.waterGoalMl;
}

function recordRoutineHabitHistory() {
  recordRoutineHabitHistoryFor(state.routineTracker, state.routine);
}

function getRoutineHabits() {
  return state.routine.filter((item) => !/água|agua/i.test(item.title));
}

function ensureRoutineDayRecord(date = todayISO()) {
  const tracker = state.routineTracker;
  tracker.habitHistory ||= {};
  tracker.history ||= {};
  tracker.habitHistory[date] ||= {};
  const record = tracker.habitHistory[date];
  getRoutineHabits().forEach((item) => {
    if (!Object.prototype.hasOwnProperty.call(record, item.id)) {
      record[item.id] = date === todayISO() ? Boolean(item.done) : false;
    }
  });
  if (!Object.prototype.hasOwnProperty.call(record, "__water")) {
    record.__water = date === todayISO() ? tracker.waterMl >= tracker.waterGoalMl : false;
  }
  updateRoutineHistoryScoreForDate(date);
  return record;
}

function syncTodayRoutineFromRecord() {
  const record = ensureRoutineDayRecord(todayISO());
  state.routine = state.routine.map((item) => /água|agua/i.test(item.title)
    ? item
    : { ...item, done: Boolean(record[item.id]) });
}

function setRoutineDayHabit(date, habitId, value) {
  const record = ensureRoutineDayRecord(date);
  record[habitId] = value;
  if (date === todayISO()) {
    state.routine = state.routine.map((item) => item.id === habitId ? { ...item, done: value } : item);
  }
  updateRoutineHistoryScoreForDate(date);
}

function setRoutineDayWater(date, value) {
  const tracker = state.routineTracker;
  const record = ensureRoutineDayRecord(date);
  record.__water = value;
  if (date === todayISO()) {
    tracker.waterMl = value ? tracker.waterGoalMl : 0;
  }
  updateRoutineHistoryScoreForDate(date);
}

function ensureRoutineToday() {
  const tracker = state.routineTracker;
  if (!tracker) return;
  tracker.date ||= todayISO();
  ensureRoutineDayRecord(tracker.date);
  if (tracker.date !== todayISO()) {
    tracker.date = todayISO();
    tracker.selectedDate = todayISO();
    tracker.waterMl = 0;
    state.routine = state.routine.map((item) => ({ ...item, done: false }));
    ensureRoutineDayRecord(todayISO());
    stateWasMigrated = true;
  } else {
    syncTodayRoutineFromRecord();
  }
}

function saveState() {
  if (state.routineTracker && state.routine) {
    ensureRoutineDayRecord(todayISO());
  }
  localStorage.setItem(storageKey, JSON.stringify(state));
  queueOnlineSave();
}

function isSupabaseConfigured() {
  const config = window.PAINEL_SUPABASE || {};
  return Boolean(
    window.supabase
    && config.url
    && config.anonKey
    && !config.url.includes("COLE_AQUI")
    && !config.anonKey.includes("COLE_AQUI")
  );
}

function setSyncStatus(text, mode = "local") {
  const status = document.querySelector("#sync-status");
  if (!status) return;
  status.textContent = text;
  status.dataset.mode = mode;
}

function setAuthGate(isLocked) {
  document.body.classList.toggle("auth-locked", isLocked);
}

function openLoginPanel(message = "") {
  document.querySelector("#login-message").textContent = message;
  document.querySelector("#login-remember").checked = shouldRememberLogin();
  updateSavedLoginCard();
  setAuthGate(true);
  document.querySelector("#login-panel").classList.add("open");
  document.querySelector("#login-panel").setAttribute("aria-hidden", "false");
}

function closeLoginPanel() {
  if (!currentUser) return;
  setAuthGate(false);
  document.querySelector("#login-panel").classList.remove("open");
  document.querySelector("#login-panel").setAttribute("aria-hidden", "true");
}

function updateAuthButtons() {
  const loginButton = document.querySelector("#login-btn");
  const logoutButton = document.querySelector("#logout-btn");
  if (loginButton) loginButton.hidden = Boolean(currentUser);
  if (logoutButton) logoutButton.hidden = !currentUser;
  const profileBlock = document.querySelector("#profile-block-dropdown");
  if (profileBlock) {
    profileBlock.style.display = currentUser ? "" : "none";
  }
}

function getCurrentUserProfile() {
  const metadata = currentUser?.user_metadata || {};
  const rawName = metadata.full_name || metadata.name || "";
  const firstName = rawName.trim().split(" ")[0] || "Jonatã";
  return {
    name: firstName,
    email: currentUser?.email || "",
    avatar: metadata.avatar_url || metadata.picture || state.profilePhoto || "assets/jonata.jpeg",
  };
}

function updateSavedLoginCard() {
  const savedLogin = document.querySelector("#saved-login");
  if (!savedLogin) return;
  savedLogin.hidden = !currentUser;
  if (!currentUser) return;
  const profile = getCurrentUserProfile();
  document.querySelector("#login-saved-avatar").src = profile.avatar;
  document.querySelector("#login-saved-name").textContent = profile.name;
  document.querySelector("#login-saved-email").textContent = profile.email;
}

function shouldRememberLogin() {
  return localStorage.getItem(authRememberKey) !== "false";
}

function initSupabaseClient() {
  if (!isSupabaseConfigured()) {
    setSyncStatus("Local", "local");
    updateAuthButtons();
    return false;
  }

  const config = window.PAINEL_SUPABASE;
  if (supabaseClient) return true;
  supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      storageKey: "painel-pessoal-jonata-auth",
      storage: window.localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  setSyncStatus("Conectando", "syncing");
  return true;
}

async function loadRemoteState() {
  if (!supabaseClient || !currentUser) return;
  isLoadingRemoteState = true;
  setSyncStatus("Sincronizando", "syncing");

  const { data, error } = await supabaseClient
    .from("painel_pessoal_modules")
    .select("module,data")
    .eq("user_id", currentUser.id);

  if (error) {
    console.error(error);
    setSyncStatus("Erro sync", "error");
    isLoadingRemoteState = false;
    return;
  }

  if (data?.length) {
    const remoteState = data.reduce((result, item) => {
      result[item.module] = item.data;
      return result;
    }, {});
    if (remoteState.market && !Object.prototype.hasOwnProperty.call(remoteState, "marketSeedVersion")) {
      remoteState.marketSeedVersion = 0;
    }
    if (remoteState.wishlist && !Object.prototype.hasOwnProperty.call(remoteState, "wishlistSeedVersion")) {
      remoteState.wishlistSeedVersion = 0;
    }
    if (remoteState.homeItems && !Object.prototype.hasOwnProperty.call(remoteState, "homePhotoSeedVersion")) {
      remoteState.homePhotoSeedVersion = 0;
    }
    localStorage.setItem(storageKey, JSON.stringify({ ...state, ...remoteState }));
    state = loadState();
    const migratedRemoteState = stateWasMigrated;
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    if (migratedRemoteState) {
      isLoadingRemoteState = false;
      await saveStateOnlineNow();
      setSyncStatus("Online", "online");
      return;
    }
  } else {
    await saveStateOnlineNow();
  }

  isLoadingRemoteState = false;
  setSyncStatus("Online", "online");
}

async function saveStateOnlineNow() {
  if (!supabaseClient || !currentUser || isLoadingRemoteState) return;

  const modules = cloudModuleKeys.map((module) => ({
    user_id: currentUser.id,
    module,
    data: state[module],
    updated_at: new Date().toISOString(),
  }));

  setSyncStatus("Salvando", "syncing");
  const { error } = await supabaseClient
    .from("painel_pessoal_modules")
    .upsert(modules, { onConflict: "user_id,module" });

  if (error) {
    console.error(error);
    setSyncStatus("Erro sync", "error");
    return;
  }

  setSyncStatus("Online", "online");
}

function queueOnlineSave() {
  if (!supabaseClient || !currentUser || isLoadingRemoteState) return;
  clearTimeout(onlineSaveTimer);
  onlineSaveTimer = setTimeout(() => {
    saveStateOnlineNow();
  }, 650);
}

async function initAuth() {
  if (!initSupabaseClient()) {
    openLoginPanel("Configure o Supabase para acessar o painel online.");
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthButtons();
  updateSavedLoginCard();

  if (currentUser) {
    await loadRemoteState();
    openLoginPanel("Escolha a conta salva para entrar ou use outra conta.");
  } else {
    setAuthGate(true);
    setSyncStatus("Sem login", "local");
    openLoginPanel("Entre ou crie sua conta para acessar e salvar o painel online.");
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    updateAuthButtons();
    updateSavedLoginCard();
    if (currentUser) {
      if (allowAuthAutoEnter || !document.body.classList.contains("auth-locked")) {
        allowAuthAutoEnter = false;
        setAuthGate(false);
        closeLoginPanel();
        await loadRemoteState();
      } else {
        openLoginPanel("Escolha a conta salva para entrar ou use outra conta.");
      }
    } else if (_event === "SIGNED_OUT") {
      setAuthGate(true);
      setSyncStatus("Local", "local");
      openLoginPanel("Entre para acessar o painel online.");
    }
  });
}

function snapshot() {
  return JSON.parse(JSON.stringify(state));
}

function rememberUndo() {
  undoStack.push(snapshot());
  if (undoStack.length > 30) undoStack.shift();
  updateUndoButton();
}

function updateUndoButton() {
  const undoButton = document.querySelector("#undo-btn");
  if (!undoButton) return;
  undoButton.disabled = undoStack.length === 0;
}

function commitChange() {
  saveState();
  render();
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Sem data";
  const [year, month, day] = value.split("-");
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(Number(year), Number(month) - 1, Number(day)));
}

function isUrl(value) {
  return /^(https?:\/\/|www\.)\S+/i.test(String(value || "").trim());
}

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function todayISO() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function dateToISO(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function daysInMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function getBusinessDayDate(monthKey, businessDay) {
  const [year, month] = monthKey.split("-").map(Number);
  let count = 0;
  const limit = daysInMonth(monthKey);

  for (let day = 1; day <= limit; day += 1) {
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue;
    count += 1;
    if (count === businessDay) return dateToISO(date);
  }

  return dateToISO(new Date(year, month - 1, limit));
}

function getFixedCostDueDate(item) {
  const monthKey = state.financePlan.month || todayISO().slice(0, 7);
  const [year, month] = monthKey.split("-").map(Number);
  const day = Math.min(daysInMonth(monthKey), Math.max(1, Number(item.dueDay || 1)));
  return dateToISO(new Date(year, month - 1, day));
}

function getFixedCostDueLabel(item) {
  const dueDate = getFixedCostDueDate(item);
  return `Dia ${item.dueDay || 1} • ${formatDate(dueDate)}`;
}

function getFinanceDueDateFromForm() {
  const mode = document.querySelector("#finance-date-mode").value;
  if (mode === "business") {
    const businessDay = Number(document.querySelector("#finance-business-day").value || 5);
    return getBusinessDayDate(state.financePlan.month || todayISO().slice(0, 7), businessDay);
  }
  return document.querySelector("#finance-due-date").value || `${currentFinanceMonth()}-01`;
}

function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return dateToISO(date);
}

function addMonthsToDate(isoDate, monthsToAdd) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const target = new Date(year, month - 1 + monthsToAdd, 1);
  const monthKey = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  const safeDay = Math.min(day, daysInMonth(monthKey));
  return dateToISO(new Date(target.getFullYear(), target.getMonth(), safeDay));
}

function getFinanceOccurrenceDate(baseDate, index, dateMode, repeat, businessDay = 5) {
  if (index === 0) return baseDate;
  if (repeat === "biweekly") return addDays(baseDate, index * 15);
  if (repeat === "monthly") {
    if (dateMode === "business") {
      const [year, month] = baseDate.split("-").map(Number);
      const target = new Date(year, month - 1 + index, 1);
      const monthKey = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
      return getBusinessDayDate(monthKey, businessDay);
    }
    return addMonthsToDate(baseDate, index);
  }
  return baseDate;
}

function normalizeFinanceRepeat(repeat, repeatCount) {
  const count = Math.max(1, Number(repeatCount || 1));
  return count > 1 && repeat === "once" ? "monthly" : repeat || "once";
}

function currentFinanceMonth() {
  return state.financePlan.month || todayISO().slice(0, 7);
}

function isInFinanceMonth(dateValue) {
  return String(dateValue || "").slice(0, 7) === currentFinanceMonth();
}

function currentFinanceYear() {
  return String(state.financePlan.year || currentFinanceMonth().slice(0, 4));
}

function isInFinancePeriod(dateValue) {
  const value = String(dateValue || "");
  return state.financePlan.viewMode === "year"
    ? value.slice(0, 4) === currentFinanceYear()
    : value.slice(0, 7) === currentFinanceMonth();
}

function isBudgetPaid(item) {
  return Boolean(item.paidMonths?.[currentFinanceMonth()] ?? item.paid);
}

function toggleBudgetPaid(item) {
  const month = currentFinanceMonth();
  const paidMonths = { ...(item.paidMonths || {}) };
  paidMonths[month] = !Boolean(paidMonths[month] ?? item.paid);
  return { ...item, paidMonths, paid: paidMonths[month] };
}

function clearBudgetPaidForCurrentMonth(item) {
  const month = currentFinanceMonth();
  const paidMonths = { ...(item.paidMonths || {}) };
  paidMonths[month] = false;
  return { ...item, paidMonths, paid: false };
}

function openSection(sectionId) {
  const realSection = document.querySelector(`#${sectionId}`) ? sectionId : "placeholder";
  pages.forEach((page) => page.classList.toggle("active", page.id === realSection));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === sectionId));

  const navLabel = state.navLabels?.[sectionId] || defaultNavMeta[sectionId]?.label || "Painel";
  const navIcon = state.navIcons?.[sectionId] || defaultNavMeta[sectionId]?.icon || "";
  const titleText = sectionId === "dashboard" ? "Visão geral" : navLabel;
  const titleIcon = sectionId === "dashboard" ? "⌂" : navIcon;
  const titleTextEl = document.querySelector("#page-title-text");
  const titleIconEl = document.querySelector("#page-title-icon");
  if (titleTextEl) titleTextEl.textContent = titleText;
  if (titleIconEl) titleIconEl.textContent = titleIcon;

  const novoLancBtn = document.querySelector('#btn-novo-lancamento');
  if (novoLancBtn) {
    novoLancBtn.style.display = (realSection === 'finance') ? '' : 'none';
  }

  const monthBar = document.querySelector('.finance-month-bar');
  if (monthBar) {
    monthBar.style.display = (realSection === 'finance') ? 'flex' : 'none';
  }

  const financeNav = document.getElementById('finance-internal-nav');
  if (financeNav) {
    financeNav.style.display = (realSection === 'finance') ? '' : 'none';
  }

  const novaNotaBtn = document.querySelector('[data-section-shortcut="quick-notes"]');
  if (novaNotaBtn) {
    novaNotaBtn.style.display = (realSection === 'quick-notes') ? '' : 'none';
  }

  if (realSection === "placeholder") {
    const [title, copy] = placeholders[sectionId] || ["Área em construção", "Esse módulo está reservado para evoluir depois."];
    document.querySelector("#placeholder-title").textContent = title;
    document.querySelector("#placeholder-copy").textContent = copy;
    document.querySelector("#placeholder-kicker").textContent = "Módulo reservado";
  }

  sidebar.classList.remove("open");
}

function applyNavOrder() {
  const nav = document.querySelector(".side-nav");
  const buttonsBySection = new Map([...navButtons].map((button) => [button.dataset.section, button]));
  nav.innerHTML = "";
  const groupLists = new Map();

  navGroupDefinitions.forEach((groupDefinition) => {
    const group = document.createElement("div");
    group.className = `nav-group nav-group-${groupDefinition.id}`;
    group.dataset.navGroup = groupDefinition.id;

    const groupLabel = state.navGroupLabels?.[groupDefinition.id] ?? groupDefinition.label;
    if (groupLabel) {
      const title = document.createElement("strong");
      title.className = "nav-group-title";
      title.textContent = groupLabel;
      group.append(title);
    }

    const items = document.createElement("div");
    items.className = "nav-items";
    items.dataset.navGroupItems = groupDefinition.id;
    group.append(items);
    nav.append(group);
    groupLists.set(groupDefinition.id, items);
  });

  state.navOrder.forEach((section) => {
    const button = buttonsBySection.get(section);
    const groupId = state.navGroups?.[section] || defaultNavGroups[section] || "personal";
    const groupList = groupLists.get(groupId) || groupLists.get("personal");
    if (button) {
      const icon = state.navIcons?.[section] || defaultNavMeta[section]?.icon || "•";
      const label = state.navLabels?.[section] || defaultNavMeta[section]?.label || section;
      const iconNode = button.querySelector("span") || document.createElement("span");
      iconNode.textContent = icon;
      if (!iconNode.parentElement) button.prepend(iconNode);
      [...button.childNodes].forEach((node) => {
        if (node.nodeType === 3) node.remove();
      });
      button.append(document.createTextNode(label));
      groupList.append(button);
    }
  });
}

function renderNavEditor() {
  const list = document.querySelector("#nav-edit-list");
  list.innerHTML = "";

  navGroupDefinitions.forEach((groupDefinition) => {
    const groupId = groupDefinition.id;
    const card = document.createElement("article");
    card.className = "nav-edit-group";
    card.innerHTML = `
      <label class="nav-edit-category">
        <span>Categoria</span>
        <input type="text" data-nav-group-label="${groupId}" value="${escapeHtml(state.navGroupLabels?.[groupId] ?? groupDefinition.label)}" ${groupId === "featured" ? "placeholder=\"Destaque\"" : ""} />
      </label>
      <div class="nav-edit-items"></div>
    `;

    const items = card.querySelector(".nav-edit-items");
    state.navOrder
      .filter((section) => (state.navGroups?.[section] || defaultNavGroups[section]) === groupId)
      .forEach((section) => {
        const row = document.createElement("div");
        row.className = "nav-edit-item";
        row.dataset.navEditSection = section;
        row.innerHTML = `
          <label>
            <span>Ícone</span>
            <input type="text" maxlength="4" data-nav-icon="${section}" value="${escapeHtml(state.navIcons?.[section] || defaultNavMeta[section]?.icon || "")}" />
          </label>
          <label>
            <span>Nome</span>
            <input type="text" data-nav-label="${section}" value="${escapeHtml(state.navLabels?.[section] || defaultNavMeta[section]?.label || section)}" />
          </label>
        `;
        items.append(row);
      });

    list.append(card);
  });
}

function applyFinanceLayoutOrder() {
  const summary = document.querySelector(".finance-summary");
  const dashboard = document.querySelector(".finance-dashboard-grid");
  if (!summary || !dashboard) return;
  const summaryCards = new Map([...summary.querySelectorAll("[data-finance-summary-card]")].map((card) => [card.dataset.financeSummaryCard, card]));
  const dashboardCards = new Map([...dashboard.querySelectorAll("[data-finance-dashboard-card]")].map((card) => [card.dataset.financeDashboardCard, card]));
  state.financeLayout.summary.forEach((key) => summaryCards.get(key) && summary.append(summaryCards.get(key)));
  state.financeLayout.dashboard.forEach((key) => dashboardCards.get(key) && dashboard.append(dashboardCards.get(key)));
}

function ensureRoutineCategoryCards() {
  const board = document.querySelector(".routine-board");
  if (!board) return;
  const addCard = board.querySelector("#routine-add-card");
  const categoryIds = state.routineCategories.map((category) => category.id);
  board.querySelectorAll("[data-routine-card]").forEach((card) => {
    if (!categoryIds.includes(card.dataset.routineCard)) card.remove();
  });
  state.routineCategories.forEach((category) => {
    let card = board.querySelector(`[data-routine-card="${category.id}"]`);
    if (!card) {
      card = document.createElement("section");
      card.className = "routine-section";
      card.dataset.routineCard = category.id;
      card.draggable = true;
      card.innerHTML = `<div class="routine-section-head"><h3></h3><div><button type="button" data-routine-add-type="${category.id}" title="Adicionar hábito">＋</button><button class="routine-card-delete" type="button" data-routine-delete-card="${category.id}" title="Excluir card">×</button><strong id="routine-${category.id}-progress">0/0</strong></div></div><div class="routine-list" id="routine-${category.id}"></div>`;
      board.insertBefore(card, addCard);
    }
    card.querySelector("h3").textContent = category.name;
  });
}

function applyRoutineLayoutOrder() {
  const board = document.querySelector(".routine-board");
  if (!board) return;
  const cards = new Map([...board.querySelectorAll("[data-routine-card]")].map((card) => [card.dataset.routineCard, card]));
  const addCard = board.querySelector("#routine-add-card");
  state.routineLayout.forEach((key) => cards.get(key) && board.insertBefore(cards.get(key), addCard));
}

function render() {
  applyNavOrder();
  applyFinanceLayoutOrder();
  ensureRoutineCategoryCards();
  applyRoutineLayoutOrder();
  const profile = currentUser ? getCurrentUserProfile() : null;
  const displayName = profile ? profile.name : (state.personal?.info?.name?.split(" ")[0] || "Jonatã");
  const nameSpan = document.querySelector(".profile-name-text");
  if (nameSpan) {
    nameSpan.textContent = displayName;
  }
  const dropdownName = document.querySelector(".dropdown-profile-name");
  if (dropdownName) {
    dropdownName.textContent = displayName;
  }
  const avatarImg = document.querySelector("#profile-avatar");
  if (avatarImg) {
    avatarImg.src = (profile?.avatar) || state.profilePhoto || "assets/jonata.jpeg";
  }
  renderTasks();
  renderPending();
  renderMarket();
  renderFinance();
  renderPersonal();
  renderWishlist();
  renderCnh();
  renderAgenda();
  renderWins();
  renderHomeItems();
  renderWardrobe();
  renderNotes();
  renderRoutineDashboard();
  renderDashboard();
  renderToday();
}

function getFinanceBaseTitle(item) {
  return String(item.baseTitle || item.title || "").replace(/\s+\(\d+\/\d+\)$/, "").trim();
}

function getFinanceYearGroupKey(item) {
  return [
    item.type,
    item.category,
    item.groupId || getFinanceBaseTitle(item).toLowerCase(),
  ].join("::");
}

function formatFinanceMonthShort(value) {
  const [year, month] = String(value).split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(new Date(year, month - 1, 1)).replace(".", "");
}

function groupFinanceYearItems(items) {
  const groups = items.reduce((result, item) => {
    const key = getFinanceYearGroupKey(item);
    result[key] = result[key] || [];
    result[key].push(item);
    return result;
  }, {});

  return Object.entries(groups).map(([groupKey, groupItems]) => {
    const sorted = [...groupItems].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const first = sorted[0];
    if (sorted.length === 1) return first;
    return {
      ...first,
      id: groupKey,
      editId: first.id,
      groupKey,
      isGrouped: true,
      title: getFinanceBaseTitle(first),
      value: sorted.reduce((sum, item) => sum + Number(item.value || 0), 0),
      averageValue: sorted.reduce((sum, item) => sum + Number(item.value || 0), 0) / sorted.length,
      dueDate: sorted[0].dueDate,
      endDate: sorted[sorted.length - 1].dueDate,
      count: sorted.length,
      doneCount: sorted.filter((item) => item.done).length,
      done: sorted.every((item) => item.done),
    };
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function isCommissionItem(item) {
  return /comiss|comissão|comissao/i.test(`${item.title || ""} ${item.category || ""}`);
}

function getActiveMonthCount(items) {
  return Math.max(1, new Set(items.map((item) => String(item.dueDate || "").slice(0, 7))).size);
}

function renderFinanceYearSummary(periodFinance) {
  const box = document.querySelector("#finance-year-summary");
  const isYear = state.financePlan.viewMode === "year";
  box.hidden = !isYear;

  const incomeItems = periodFinance.filter((item) => item.type === "income");
  const commissionItems = incomeItems.filter(isCommissionItem);
  const soldItems = incomeItems.filter((item) => !isCommissionItem(item));
  const soldTotal = soldItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const commissionTotal = commissionItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const soldMonthCount = getActiveMonthCount(soldItems);
  const commissionMonthCount = getActiveMonthCount(commissionItems);
  if (!isYear) return;

  document.querySelector("#finance-year-sold-total").textContent = formatMoney(soldTotal);
  document.querySelector("#finance-year-sold-average").textContent = formatMoney(soldTotal / soldMonthCount);
  document.querySelector("#finance-year-commission-total").textContent = formatMoney(commissionTotal);
  document.querySelector("#finance-year-commission-average").textContent = formatMoney(commissionTotal / commissionMonthCount);
}

function isSubscriptionItem(item) {
  return item.isSubscription || /netflix|spotify|chatgpt|icloud|prime|disney|hbo|max|youtube|assinatura|streaming|barbeiro|barbearia|claro\s*flex/i.test(`${item.title || ""} ${item.category || ""}`);
}

function renderFinanceDashboard(periodFinance, periodVariableCosts, fixedTotal, variableTotal, expense, income, balance) {
  const isYear = state.financePlan.viewMode === "year";
  document.querySelector(".finance-overview-panel h3").textContent = "Contas a pagar";
  document.querySelector(".finance-distribution-panel h3").textContent = isYear ? "Fluxo do ano" : "Fluxo do mês";
  const received = periodFinance
    .filter((item) => item.type === "income" && item.done)
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
  const pendingExtraExpenses = periodFinance
    .filter((item) => item.type === "expense" && !item.done)
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
  const pendingFixed = isYear
    ? fixedTotal
    : state.fixedCosts.filter((item) => !isBudgetPaid(item)).reduce((sum, item) => sum + Number(item.value || 0), 0);
  const pendingVariable = isYear
    ? variableTotal
    : periodVariableCosts.filter((item) => !isBudgetPaid(item)).reduce((sum, item) => sum + Number(item.value || 0), 0);
  const payable = pendingFixed + pendingVariable + pendingExtraExpenses;
  const commissionItems = periodFinance.filter((item) => {
    const isSalary = /sal[aá]rio/i.test(`${item.title || ""} ${item.category || ""}`);
    return item.type === "income" && !item.done && (isCommissionItem(item) || !isSalary);
  });
  const commissionExpected = commissionItems.reduce((sum, item) => sum + Number(item.value || 0), 0);

  const summaryLabels = document.querySelectorAll(".finance-summary [data-finance-summary-card] > span:not(.finance-summary-icon)");
  ["Recebido", "A pagar", "Previsto", "Sobra do período", "Comissões previstas"].forEach((label, index) => {
    if (summaryLabels[index]) summaryLabels[index].textContent = label;
  });
  document.querySelector("#finance-received").textContent = formatMoney(received);
  document.querySelector("#finance-payable").textContent = formatMoney(payable);
  document.querySelector("#finance-commission-expected").textContent = formatMoney(commissionExpected);
  const periodWord = isYear ? "ANO" : "MÊS";
  [`RECEBIDO NO ${periodWord}`, "A PAGAR", `PREVISTO NO ${periodWord}`, `SOBRA DO ${periodWord}`, "COMISSÕES PREVISTAS"].forEach((label, index) => {
    if (summaryLabels[index]) summaryLabels[index].textContent = label;
  });
  const previousPeriod = isYear
    ? String(Number(currentFinanceYear()) - 1)
    : dateToISO(new Date(Number(currentFinanceMonth().slice(0, 4)), Number(currentFinanceMonth().slice(5, 7)) - 2, 1)).slice(0, 7);
  const previousReceived = state.finance
    .filter((item) => item.type === "income" && item.done && String(item.dueDate).startsWith(previousPeriod))
    .reduce((sum, item) => sum + Number(item.value || 0), 0);
  const receivedChange = previousReceived > 0 ? Math.round(((received - previousReceived) / previousReceived) * 100) : 0;
  const receivedNote = document.querySelector("#finance-received-note");
  receivedNote.textContent = `${receivedChange >= 0 ? "↑" : "↓"} ${Math.abs(receivedChange)}% vs ${isYear ? "ano" : "mês"} anterior`;
  receivedNote.className = receivedChange >= 0 ? "positive-note" : "negative-note";
  const pendingBillsCount = state.fixedCosts.filter((item) => !isBudgetPaid(item)).length
    + periodVariableCosts.filter((item) => !isBudgetPaid(item)).length
    + periodFinance.filter((item) => item.type === "expense" && !item.done).length;
  document.querySelector("#finance-payable-note").textContent = `${pendingBillsCount} contas pendentes`;
  document.querySelector("#finance-expected-progress").style.width = `${income > 0 ? Math.min(100, Math.round((received / income) * 100)) : 0}%`;
  document.querySelector("#finance-period-label").textContent = state.financePlan.viewMode === "year"
    ? String(state.financePlan.year)
    : new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${currentFinanceMonth()}-01T12:00:00`));

  const billItems = [
    ...state.fixedCosts.map((item) => ({
      ...item,
      dueDate: getFixedCostDueDate(item),
      done: isBudgetPaid(item),
      kind: "fixed",
    })),
    ...periodVariableCosts.map((item) => ({ ...item, done: isBudgetPaid(item), kind: "variable" })),
    ...periodFinance.filter((item) => item.type === "expense").map((item) => ({ ...item, kind: "extra" })),
  ].sort((a, b) => String(a.dueDate || "").localeCompare(String(b.dueDate || "")));

  const filteredBillItems = financeBillFilter === "all"
    ? billItems
    : billItems.filter((item) => financeBillFilter === "variable" ? item.kind !== "fixed" : item.kind === "fixed");
  document.querySelectorAll("[data-finance-bill-filter]").forEach((button) => button.classList.toggle("active", button.dataset.financeBillFilter === financeBillFilter));
  const billsList = document.querySelector("#finance-overview-bills");
  billsList.innerHTML = billItems.length ? "" : `<div class="empty-state">Nenhuma conta neste período.</div>`;
  filteredBillItems.slice(0, 8).forEach((item) => {
    const row = document.createElement("article");
    const actionData = item.kind === "fixed" || item.kind === "variable"
      ? `data-budget-paid="${item.kind}:${item.id}"`
      : `data-finance-done="${item.id}"`;
    row.className = item.done ? "done" : "";
    row.innerHTML = `
      <button class="check-btn ${item.done ? "active" : ""}" type="button" ${actionData}>✓</button>
      <div><strong>${escapeHtml(item.title)} <small class="finance-bill-kind">${item.kind === "fixed" ? "Fixa" : "Variável"}</small></strong><span>${item.done ? "Pago em" : "Vence em"} ${formatDate(item.dueDate)}</span></div>
      <strong class="${item.done ? "money-income" : "money-expense"}">${formatMoney(item.value)}</strong>
      <button class="finance-status ${item.done ? "paid" : ""}" type="button" ${actionData}>${item.done ? "Pago" : "Pagar"}</button>
    `;
    billsList.append(row);
  });

  const subscriptions = [
    ...state.fixedCosts.filter(isSubscriptionItem).map((item) => ({ ...item, dueDate: getFixedCostDueDate(item) })),
    ...periodFinance.filter((item) => item.type === "expense" && isSubscriptionItem(item)),
  ];
  const subscriptionsTotal = subscriptions.reduce((sum, item) => {
    const multiplier = isYear && state.fixedCosts.some((fixed) => fixed.id === item.id) ? 12 : 1;
    return sum + Number(item.value || 0) * multiplier;
  }, 0);
  document.querySelector("#finance-subscriptions-total").textContent = formatMoney(subscriptionsTotal);
  const subscriptionsList = document.querySelector("#finance-subscriptions");
  subscriptionsList.innerHTML = subscriptions.length ? "" : `<div class="empty-state">Cadastre Netflix, Spotify ou outra assinatura.</div>`;
  subscriptions.slice(0, 6).forEach((item) => {
    const brand = /netflix/i.test(item.title) ? "N" : /spotify/i.test(item.title) ? "S" : /chatgpt/i.test(item.title) ? "AI" : /icloud/i.test(item.title) ? "☁" : "◆";
    subscriptionsList.innerHTML += `<article><span class="finance-brand-icon">${brand}</span><div><strong>${escapeHtml(item.title)}</strong><span>${formatDate(item.dueDate)}</span></div><strong>${formatMoney(item.value)}</strong></article>`;
  });

  document.querySelector("#finance-commissions-total").textContent = formatMoney(commissionExpected);
  const commissionsList = document.querySelector("#finance-commissions");
  commissionsList.innerHTML = commissionItems.length ? "" : `<div class="empty-state">Nenhuma comissão prevista.</div>`;
  commissionItems.slice(0, 6).forEach((item) => {
    const name = getFinanceBaseTitle(item);
    commissionsList.innerHTML += `<article><span class="finance-avatar">${escapeHtml(name.slice(0, 1).toUpperCase())}</span><div><strong>${escapeHtml(name)}</strong><span>Previsto ${formatDate(item.dueDate)}</span></div><strong class="money-income">${formatMoney(item.value)}</strong></article>`;
  });

  const distributionItems = [
    { label: "Receitas", value: income, className: "income" },
    { label: "Custos fixos", value: fixedTotal, className: "fixed" },
    { label: "Variáveis", value: variableTotal + expense, className: "variable" },
    { label: "Livre", value: Math.max(0, balance), className: "free" },
  ];
  const distributionMax = Math.max(1, ...distributionItems.map((item) => item.value));
  const distributionTotal = Math.max(1, income + fixedTotal + variableTotal + expense + Math.max(0, balance));
  const incomeEnd = (Math.max(0, income) / distributionTotal) * 360;
  const fixedEnd = incomeEnd + (Math.max(0, fixedTotal) / distributionTotal) * 360;
  const variableEnd = fixedEnd + (Math.max(0, variableTotal + expense) / distributionTotal) * 360;
  const freeEnd = variableEnd + (Math.max(0, balance) / distributionTotal) * 360;
  document.querySelector("#finance-donut").style.background = `conic-gradient(#45d483 0deg ${incomeEnd}deg, #ff5b73 ${incomeEnd}deg ${fixedEnd}deg, #f3bd36 ${fixedEnd}deg ${variableEnd}deg, #9b5de5 ${variableEnd}deg ${freeEnd}deg, #291035 ${freeEnd}deg 360deg)`;
  document.querySelector("#finance-distribution").innerHTML = distributionItems.map((item) => `
    <article>
      <div><span><i class="${item.className}"></i>${item.label}</span><strong>${formatMoney(item.value)} <small>${Math.round((Math.max(0, item.value) / distributionTotal) * 100)}%</small></strong></div>
      <div class="finance-bar"><span class="${item.className}" style="width:${Math.max(2, (item.value / distributionMax) * 100)}%"></span></div>
    </article>
  `).join("");
  const totalExpenses = fixedTotal + variableTotal + expense;
  document.querySelector("#finance-distribution-expenses").textContent = formatMoney(totalExpenses);
  document.querySelector("#finance-distribution-percent").textContent = `${income > 0 ? Math.round((totalExpenses / income) * 100) : 0}%`;
  document.querySelector("#finance-distribution-expected").textContent = formatMoney(income);
  document.querySelector("#finance-distribution-realized").textContent = formatMoney(received);
  document.querySelector("#finance-distribution-difference").textContent = formatMoney(received - income);
  document.querySelector("#finance-distribution-difference").className = received - income >= 0 ? "money-income" : "money-expense";

  const goalsList = document.querySelector("#finance-goals-list");
  goalsList.innerHTML = state.financeGoals.length ? "" : `<div class="empty-state">Nenhuma meta financeira.</div>`;
  state.financeGoals.forEach((goal) => {
    const percent = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
    goalsList.innerHTML += `
      <article>
        <div class="finance-goal-head">
          <span class="finance-goal-icon">${/reserva|emerg/i.test(goal.title) ? "♜" : /viagem/i.test(goal.title) ? "✈" : "★"}</span>
          <div><strong>${escapeHtml(goal.title)}</strong><span>${formatMoney(goal.current)} de ${formatMoney(goal.target)}</span></div>
          <button class="edit-btn" type="button" data-generic-edit="financeGoal:${goal.id}">Editar</button>
        </div>
        <div class="finance-bar"><span class="free" style="width:${Math.max(2, percent)}%"></span></div>
        <small>${percent}% concluído</small>
      </article>
    `;
  });
  const recentList = document.querySelector("#finance-recent-list");
  const recentItems = [...periodFinance].sort((a, b) => String(b.dueDate).localeCompare(String(a.dueDate))).slice(0, 6);
  recentList.innerHTML = recentItems.length ? "" : `<div class="empty-state">Nenhum lançamento neste período.</div>`;
  recentItems.forEach((item) => {
    recentList.innerHTML += `
      <article>
        <span class="finance-recent-date">${String(item.dueDate || "").slice(8, 10)}<small>${formatFinanceMonthShort(item.dueDate)}</small></span>
        <div><strong>${item.type === "income" ? "Recebimento" : "Pagamento"} - ${escapeHtml(getFinanceBaseTitle(item))}</strong><span>${escapeHtml(item.category)}</span></div>
        <span class="finance-recent-type ${item.type === "income" ? "money-income" : "money-expense"}">${item.type === "income" ? "Entrada" : "Saída"}</span>
        <strong class="${item.type === "income" ? "money-income" : "money-expense"}">${item.type === "income" ? "+" : "-"} ${formatMoney(item.value)}</strong>
      </article>
    `;
  });

  const categoryExpenses = {};
  state.fixedCosts.forEach((item) => { categoryExpenses.Casa = (categoryExpenses.Casa || 0) + Number(item.value || 0) * (isYear ? 12 : 1); });
  periodVariableCosts.forEach((item) => { categoryExpenses[item.title || "Variáveis"] = (categoryExpenses[item.title || "Variáveis"] || 0) + Number(item.value || 0); });
  periodFinance.filter((item) => item.type === "expense").forEach((item) => {
    categoryExpenses[item.category || "Outros"] = (categoryExpenses[item.category || "Outros"] || 0) + Number(item.value || 0);
  });
  const categoryTotal = Math.max(1, Object.values(categoryExpenses).reduce((sum, value) => sum + value, 0));
  const categoryIcons = { Casa: "⌂", Mercado: "▦", Transporte: "◆", Lazer: "★", Saúde: "+", Outros: "●" };
  const categoryColors = ["green", "red", "yellow", "purple", "blue"];
  document.querySelector("#finance-category-breakdown").innerHTML = Object.entries(categoryExpenses)
    .sort((a, b) => b[1] - a[1])
    .map(([category, value], index) => {
      const percent = Math.round((value / categoryTotal) * 100);
      const color = categoryColors[index % categoryColors.length];
      return `<article><span class="finance-category-icon ${color}">${categoryIcons[category] || "●"}</span><div><div><strong>${escapeHtml(category)}</strong><span>${formatMoney(value)} · ${percent}%</span></div><div class="finance-bar"><span class="${color}" style="width:${percent}%"></span></div></div></article>`;
    }).join("") || `<div class="empty-state">Nenhum gasto categorizado.</div>`;
}

function renderFinance() {
  const periodFinance = state.finance.filter((item) => isInFinancePeriod(item.dueDate));
  const periodVariableCosts = state.variableCosts.filter((item) => isInFinancePeriod(item.dueDate));
  
  const incomeItems = periodFinance.filter((item) => item.type === "income");
  const expenseItems = periodFinance.filter((item) => item.type === "expense");
  
  const incomeExtra = incomeItems.reduce((sum, item) => sum + item.value, 0);
  const expense = expenseItems.reduce((sum, item) => sum + item.value, 0);
  const fixedMonthlyTotal = state.fixedCosts.reduce((sum, item) => sum + item.value, 0);
  const variableTotal = periodVariableCosts.reduce((sum, item) => sum + item.value, 0);
  
  const costTotal = fixedMonthlyTotal + variableTotal + expense;
  const income = incomeExtra;
  const balance = income - costTotal;
  const today = todayISO();

  // 1. HEADER CONTROLS — update month bar label
  const monthNamesShort = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const [y, m] = (state.financePlan.month || todayISO().slice(0, 7)).split('-');
  const triggerLabel = document.getElementById('finance-month-trigger-label');
  if (triggerLabel) triggerLabel.textContent = monthNamesShort[parseInt(m)-1] + '/' + y;

  // 2. ROW 1 OVERVIEW CARDS
  const totalExpenseItemsCount = expenseItems.length + state.fixedCosts.length + periodVariableCosts.length;
  
  const grid = document.querySelector('.finance-overview-grid');
  if (grid) {
    const cards = grid.querySelectorAll('.finance-card');
    if (cards.length >= 4) {
      // A Receber
      cards[0].querySelector('.money-income').textContent = formatMoney(income);
      cards[0].querySelector('small').textContent = '• ' + incomeItems.length + ' lançamentos';
      
      // A Pagar
      cards[1].querySelector('.money-expense').textContent = formatMoney(costTotal);
      cards[1].querySelector('small').textContent = '• ' + totalExpenseItemsCount + ' lançamentos';
      
      // Saldo Previsto
      cards[2].querySelector('strong').textContent = formatMoney(balance);
      cards[2].querySelector('strong').className = balance >= 0 ? "money-blue" : "money-expense";
      
      // Reserva Financeira
      const reserveGoal = (state.financeGoals && state.financeGoals[0]) ? state.financeGoals[0] : { current: 0, target: 10000 };
      const reservePercent = reserveGoal.target > 0 ? Math.round((reserveGoal.current / reserveGoal.target) * 100) : 0;
      cards[3].querySelector('strong').textContent = formatMoney(reserveGoal.current);
      cards[3].querySelector('small').textContent = 'Meta: ' + formatMoney(reserveGoal.target) + ' · ' + reservePercent + '%';
      
      cards[3].style.cursor = 'pointer';
      cards[3].onclick = () => {
         const newCurrent = prompt("Reserva atual (R$):", reserveGoal.current);
         if (newCurrent !== null) {
            const newTarget = prompt("Meta da Reserva (R$):", reserveGoal.target);
            if (newTarget !== null) {
              reserveGoal.current = parseFloat(newCurrent.replace(',','.')) || 0;
              reserveGoal.target = parseFloat(newTarget.replace(',','.')) || 0;
              if(!state.financeGoals) state.financeGoals = [];
              state.financeGoals[0] = reserveGoal;
              saveState();
              renderFinance();
            }
         }
      };
    }
  }

  // Helper functions for lists
  const formatDay = (dateStr) => {
    if(!dateStr) return { d: '--', m: '---' };
    const [y, m, d] = dateStr.split('-');
    const monthNamesShort = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    return { d: d, m: monthNamesShort[parseInt(m)-1] };
  };

  const getIconHTML = (item, forceType, isList = true) => {
    const t = forceType || item.type;
    const ltitle = item.title ? item.title.toLowerCase() : '';
    const className = isList ? 'finance-list-icon' : 'finance-item-icon';
    
    // Brand logos via Simple Icons SVG CDN
    if (ltitle.includes('netflix')) return `<img src="https://cdn.simpleicons.org/netflix/E50914" class="${className}" style="padding: 6px; background: #E50914; border-radius: 50%; filter: brightness(0) invert(1);" alt="Netflix" />`;
    if (ltitle.includes('spotify')) return `<img src="https://cdn.simpleicons.org/spotify/1DB954" class="${className}" style="padding: 6px; background: #1DB954; border-radius: 50%; filter: brightness(0) invert(1);" alt="Spotify" />`;
    if (ltitle.includes('icloud') || ltitle.includes('apple')) return `<img src="https://cdn.simpleicons.org/icloud/007AFF" class="${className}" style="padding: 6px; background: #007AFF; border-radius: 50%; filter: brightness(0) invert(1);" alt="iCloud" />`;
    if (ltitle.includes('amazon') || ltitle.includes('prime')) return `<img src="https://cdn.simpleicons.org/amazon/FF9900" class="${className}" style="padding: 6px; background: #FF9900; border-radius: 50%; filter: brightness(0) invert(1);" alt="Amazon" />`;
    if (ltitle.includes('youtube')) return `<img src="https://cdn.simpleicons.org/youtube/FF0000" class="${className}" style="padding: 6px; background: #FF0000; border-radius: 50%; filter: brightness(0) invert(1);" alt="YouTube" />`;
    if (ltitle.includes('disney')) return `<img src="https://cdn.simpleicons.org/disneyplus/11385B" class="${className}" style="padding: 6px; background: #11385B; border-radius: 50%; filter: brightness(0) invert(1);" alt="Disney" />`;
    if (ltitle.includes('playstation') || ltitle.includes('psn') || ltitle.includes('ps5')) return `<img src="https://cdn.simpleicons.org/playstation/003087" class="${className}" style="padding: 6px; background: #003087; border-radius: 50%; filter: brightness(0) invert(1);" alt="PlayStation" />`;
    if (ltitle.includes('xbox')) return `<img src="https://cdn.simpleicons.org/xbox/107C10" class="${className}" style="padding: 6px; background: #107C10; border-radius: 50%; filter: brightness(0) invert(1);" alt="Xbox" />`;
    if (ltitle.includes('steam')) return `<img src="https://cdn.simpleicons.org/steam/1B2838" class="${className}" style="padding: 6px; background: #1B2838; border-radius: 50%; filter: brightness(0) invert(1);" alt="Steam" />`;
    if (ltitle.includes('chatgpt') || ltitle.includes('openai')) return `<img src="https://cdn.simpleicons.org/openai/412991" class="${className}" style="padding: 6px; background: #412991; border-radius: 50%; filter: brightness(0) invert(1);" alt="ChatGPT" />`;
    if (ltitle.includes('globo')) return `<img src="https://cdn.simpleicons.org/globoplay/EB2629" class="${className}" style="padding: 6px; background: #EB2629; border-radius: 50%; filter: brightness(0) invert(1);" alt="GloboPlay" />`;
    if (ltitle.includes('hbo') || ltitle.includes('max')) return `<img src="https://cdn.simpleicons.org/hbo/002D62" class="${className}" style="padding: 6px; background: #002D62; border-radius: 50%; filter: brightness(0) invert(1);" alt="HBO" />`;
    if (ltitle.includes('uber')) return `<img src="https://cdn.simpleicons.org/uber/000000" class="${className}" style="padding: 6px; background: #276EF1; border-radius: 50%; filter: brightness(0) invert(1);" alt="Uber" />`;
    if (ltitle.includes('nubank')) return `<img src="https://cdn.simpleicons.org/nubank/820AD9" class="${className}" style="padding: 6px; background: #820AD9; border-radius: 50%; filter: brightness(0) invert(1);" alt="Nubank" />`;
    if (ltitle.includes('bradesco')) return `<img src="https://cdn.simpleicons.org/bradesco/CC092F" class="${className}" style="padding: 6px; background: #CC092F; border-radius: 50%; filter: brightness(0) invert(1);" alt="Bradesco" />`;
    if (ltitle.includes('itaú') || ltitle.includes('itau')) return `<img src="https://cdn.simpleicons.org/itau/EC7000" class="${className}" style="padding: 6px; background: #EC7000; border-radius: 50%; filter: brightness(0) invert(1);" alt="Itaú" />`;
    if (ltitle.includes('santander')) return `<img src="https://cdn.simpleicons.org/santander/EC0000" class="${className}" style="padding: 6px; background: #EC0000; border-radius: 50%; filter: brightness(0) invert(1);" alt="Santander" />`;
    if (ltitle.includes('mercado livre') || ltitle.includes('mercado pago')) return `<img src="https://cdn.simpleicons.org/mercadolibre/FFE600" class="${className}" style="padding: 6px; background: #FFE600; border-radius: 50%; filter: brightness(0) invert(1);" alt="Mercado Livre" />`;
    if (ltitle.includes('claro')) return `<div class="${className}" style="background: #DA291C; color: #fff; font-weight: bold; font-size: 11px; letter-spacing: -0.5px;">Claro</div>`;
    if (ltitle.includes('vivo')) return `<img src="https://cdn.simpleicons.org/vivo/CC0066" class="${className}" style="padding: 6px; background: #CC0066; border-radius: 50%; filter: brightness(0) invert(1);" alt="Vivo" />`;
    if (ltitle.includes('tim')) return `<img src="https://cdn.simpleicons.org/tim/003DA5" class="${className}" style="padding: 6px; background: #003DA5; border-radius: 50%; filter: brightness(0) invert(1);" alt="TIM" />`;

    // General categories with colored background and emoji
    if (ltitle.includes('barbeiro') || ltitle.includes('barbearia') || ltitle.includes('cabelereiro')) {
      return `<div class="${className}" style="background: #8b5cf6; color: #fff; font-size: 16px;">✂️</div>`;
    }
    if (ltitle.includes('mei')) {
      return `<div class="${className}" style="background: #ef4444; color: #fff; font-size: 16px;">📄</div>`;
    }
    if (ltitle.includes('aluguel') || ltitle.includes('casa') || ltitle.includes('condomínio') || ltitle.includes('moradia')) {
      return `<div class="${className}" style="background: #9c27b0; color: #fff; font-size: 16px;">🏠</div>`;
    }
    if (ltitle.includes('internet') || ltitle.includes('wifi')) {
      return `<div class="${className}" style="background: #4caf50; color: #fff; font-size: 16px;">📶</div>`;
    }
    if (ltitle.includes('energia') || ltitle.includes('luz') || ltitle.includes('enel') || ltitle.includes('cpfl')) {
      return `<div class="${className}" style="background: #ff9800; color: #fff; font-size: 16px;">⚡</div>`;
    }
    if (ltitle.includes('água') || ltitle.includes('sabesp') || ltitle.includes('copasa')) {
      return `<div class="${className}" style="background: #2196f3; color: #fff; font-size: 16px;">💧</div>`;
    }
    if (ltitle.includes('salário') || ltitle.includes('trabalho') || ltitle.includes('job') || ltitle.includes('pagamento')) {
      return `<div class="${className}" style="background: #2e7d32; color: #fff; font-size: 16px;">💼</div>`;
    }
    if (ltitle.includes('mercado') || ltitle.includes('alimentação') || ltitle.includes('comida') || ltitle.includes('ifood') || ltitle.includes('feira')) {
      return `<div class="${className}" style="background: #f44336; color: #fff; font-size: 16px;">🛒</div>`;
    }
    if (ltitle.includes('academia') || ltitle.includes('saúde') || ltitle.includes('médico') || ltitle.includes('treino') || ltitle.includes('farmácia')) {
      return `<div class="${className}" style="background: #00bcd4; color: #fff; font-size: 16px;">💪</div>`;
    }
    
    // Default fallback arrows
    if (t === 'income') {
      return `<div class="${className}" style="background: #22c55e; color: #fff; font-weight: bold; font-size: 14px;">↗</div>`;
    }
    if (t === 'fixed' || t === 'expense' || t === 'variable') {
      return `<div class="${className}" style="background: #ef4444; color: #fff; font-weight: bold; font-size: 14px;">↘</div>`;
    }
    return `<div class="${className}" style="background: #6b7280; color: #fff; font-size: 16px;">👤</div>`;
  };

  // Build All Items for Month
  let allMonthItems = [];
  incomeItems.forEach(i => allMonthItems.push({...i, realType: 'income', done: i.done}));
  expenseItems.forEach(i => allMonthItems.push({...i, realType: 'expense', done: i.done}));
  periodVariableCosts.forEach(i => allMonthItems.push({...i, realType: 'variable', done: isBudgetPaid(i)}));
  state.fixedCosts.forEach(i => {
    const [y, m] = state.financePlan.month.split('-');
    const dueStr = `${y}-${m}-${String(i.dueDay).padStart(2, '0')}`;
    allMonthItems.push({...i, realType: 'fixed', dueDate: dueStr, done: isBudgetPaid(i)});
  });

  // Sort by date
  allMonthItems.sort((a,b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  // ROW 2: Próximos compromissos
  const compromissosList = document.querySelector('#section-resumo .finance-list-mock');
  if (compromissosList) {
    const upcoming = allMonthItems.filter(i => (i.dueDate || '') >= today).slice(0, 5);
    compromissosList.innerHTML = upcoming.map(i => {
      const date = formatDay(i.dueDate);
      const isIncome = i.realType === 'income';
      const cssColor = isIncome ? 'money-income' : 'money-expense';
      const typeLabel = isIncome ? 'A receber' : 'A pagar';
      const descLabel = isIncome ? 'Recebimento' : 'Conta';
      return `
        <article class="finance-list-item ${i.done ? 'done-item' : ''}">
          <button class="check-btn ${i.done ? 'active' : ''}" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-paid="${i.realType}:${i.id}"` : `data-finance-done="${i.id}"`} title="${isIncome ? "Marcar recebido" : "Marcar pago"}">✓</button>
          <div class="finance-list-date"><strong>${date.d}</strong><span>${date.m}</span></div>
          ${getIconHTML(i, i.realType, true)}
          <div class="finance-list-info">
            <strong>${i.title}</strong>
            <span>${descLabel}</span>
          </div>
          <div class="finance-list-value">
            <strong class="${cssColor}">${formatMoney(i.value)}</strong>
            <span class="${cssColor}">${typeLabel}</span>
          </div>
          <button class="edit-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-edit="${i.realType}:${i.id}"` : `data-finance-edit="${i.id}"`}>Editar</button>
          <button class="delete-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-delete="${i.realType}:${i.id}"` : `data-finance-delete="${i.id}"`}>×</button>
        </article>`;
    }).join('');
    if(upcoming.length === 0) compromissosList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhum compromisso pendente.</p>';
  }

  // ROW 2: Contas a pagar
  const pagarList = document.querySelector('#section-pagar .finance-list-mock');
  if (pagarList) {
    const pagarItems = allMonthItems.filter(i => i.realType !== 'income' && !isSubscriptionItem(i));
    const pagarTotal = pagarItems.reduce((sum, i) => sum + (i.value || 0), 0);
    pagarList.innerHTML = pagarItems.map(i => {
      return `
        <article class="finance-list-item ${i.done ? 'done-item' : ''}">
          <button class="check-btn ${i.done ? 'active' : ''}" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-paid="${i.realType}:${i.id}"` : `data-finance-done="${i.id}"`} title="Marcar como pago">✓</button>
          ${getIconHTML(i, i.realType, true)}
          <div class="finance-list-info">
            <strong>${i.title}</strong>
            <span>Vence dia ${i.dueDate ? i.dueDate.split('-').reverse().join('/').slice(0,5) : '--'}</span>
          </div>
          <div class="finance-list-value">
            <strong class="money-expense">${formatMoney(i.value)}</strong>
          </div>
          <button class="edit-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-edit="${i.realType}:${i.id}"` : `data-finance-edit="${i.id}"`}>Editar</button>
          <button class="delete-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-delete="${i.realType}:${i.id}"` : `data-finance-delete="${i.id}"`}>×</button>
        </article>`;
    }).join('');
    if (pagarItems.length > 0) {
      pagarList.innerHTML += `<div class="finance-panel-total">Total mensal: <strong class="money-expense">${formatMoney(pagarTotal)}</strong></div>`;
    } else {
      pagarList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhuma conta a pagar.</p>';
    }
  }

  // ROW 2: A receber
  const receberList = document.querySelector('#section-receber .finance-list-mock');
  if (receberList) {
    const receberItems = allMonthItems.filter(i => i.realType === 'income');
    const receberTotal = receberItems.reduce((sum, i) => sum + (i.value || 0), 0);
    receberList.innerHTML = receberItems.map(i => {
      return `
        <article class="finance-list-item ${i.done ? 'done-item' : ''}">
          <button class="check-btn ${i.done ? 'active' : ''}" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-paid="${i.realType}:${i.id}"` : `data-finance-done="${i.id}"`} title="Marcar como recebido">✓</button>
          ${getIconHTML(i, i.realType, true)}
          <div class="finance-list-info">
            <strong>${i.title}</strong>
            <span>Recebimento</span>
          </div>
          <div class="finance-list-value">
            <strong class="money-income">${formatMoney(i.value)}</strong>
            <span class="money-income">A receber</span>
          </div>
          <button class="edit-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-edit="${i.realType}:${i.id}"` : `data-finance-edit="${i.id}"`}>Editar</button>
          <button class="delete-btn" type="button" ${i.realType === 'fixed' || i.realType === 'variable' ? `data-budget-delete="${i.realType}:${i.id}"` : `data-finance-delete="${i.id}"`}>×</button>
        </article>`;
    }).join('');
    if (receberItems.length > 0) {
      receberList.innerHTML += `<div class="finance-panel-total">Total mensal: <strong class="money-income">${formatMoney(receberTotal)}</strong></div>`;
    } else {
      receberList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nada a receber neste mês.</p>';
    }
  }

  // ROW 3: Assinaturas
  const assinaturasList = document.querySelector('#section-assinaturas .finance-horizontal-list');
  let subs = state.fixedCosts.filter(i => i.isSubscription || isSubscriptionItem(i)).map(i => ({...i, done: isBudgetPaid(i)}));
  let nonSubs = state.fixedCosts.filter(i => !i.isSubscription && !isSubscriptionItem(i)).map(i => ({...i, done: isBudgetPaid(i)}));
  
  if (assinaturasList) {
    assinaturasList.innerHTML = subs.map(i => {
      return `
        <article class="finance-horizontal-item ${i.done ? 'done-item' : ''}">
          <button class="check-btn ${i.done ? 'active' : ''}" type="button" data-budget-paid="fixed:${i.id}" title="Marcar como pago">✓</button>
          ${getIconHTML(i, 'fixed', false)}
          <div class="finance-item-text">
            <strong>${i.title}</strong>
            <span>Dia ${String(i.dueDay).padStart(2,'0')}</span>
          </div>
          <strong class="finance-item-price">${formatMoney(i.value)}</strong>
          <button class="edit-btn" type="button" data-budget-edit="fixed:${i.id}">Editar</button>
          <button class="delete-btn" type="button" data-budget-delete="fixed:${i.id}">×</button>
        </article>`;
    }).join('');
    const subsTotal = subs.reduce((a,b)=>a+b.value, 0);
    const subsTotalEl = document.querySelector('#section-assinaturas .finance-panel-total strong');
    if(subsTotalEl) subsTotalEl.textContent = formatMoney(subsTotal);
    if(subs.length === 0) assinaturasList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding-top:8px;">Nenhuma assinatura identificada.</p>';
  }

  // ROW 3: Contas Fixas
  const fixasList = document.querySelector('#section-fixas .finance-horizontal-list');
  if (fixasList) {
    fixasList.innerHTML = nonSubs.map(i => {
      return `
        <article class="finance-horizontal-item ${i.done ? 'done-item' : ''}">
          <button class="check-btn ${i.done ? 'active' : ''}" type="button" data-budget-paid="fixed:${i.id}" title="Marcar como pago">✓</button>
          ${getIconHTML(i, 'fixed', false)}
          <div class="finance-item-text">
            <strong>${i.title}</strong>
            <span>Dia ${String(i.dueDay).padStart(2,'0')}</span>
          </div>
          <strong class="finance-item-price">${formatMoney(i.value)}</strong>
          <button class="edit-btn" type="button" data-budget-edit="fixed:${i.id}">Editar</button>
          <button class="delete-btn" type="button" data-budget-delete="fixed:${i.id}">×</button>
        </article>`;
    }).join('');
    const fixasTotal = nonSubs.reduce((a,b)=>a+b.value, 0);
    const fixasTotalEl = document.querySelector('#section-fixas .finance-panel-total strong');
    if(fixasTotalEl) fixasTotalEl.textContent = formatMoney(fixasTotal);
    if(nonSubs.length === 0) fixasList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding-top:8px;">Nenhuma conta fixa.</p>';
  }

  // ROW 3: Visão mensal — 3 meses antes e 3 depois do mês selecionado
  const histTbody = document.querySelector('#section-historico tbody');
  if (histTbody) {
    const monthNamesShort = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const [curY, curM] = (state.financePlan.month || todayISO().slice(0, 7)).split('-').map(Number);
    const rows = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(curY, curM - 1 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      const isCurrent = i === 0;

      const monthIncome = state.finance.filter(item => {
        const dt = String(item.dueDate || '');
        return dt.startsWith(monthKey) && item.type === 'income';
      }).reduce((s, item) => s + (item.value || 0), 0);

      const monthExpenseExtra = state.finance.filter(item => {
        const dt = String(item.dueDate || '');
        return dt.startsWith(monthKey) && item.type === 'expense';
      }).reduce((s, item) => s + (item.value || 0), 0);

      const monthVariable = state.variableCosts.filter(item => {
        const dt = String(item.dueDate || '');
        return dt.startsWith(monthKey);
      }).reduce((s, item) => s + (item.value || 0), 0);

      const currentMonthKey = (state.financePlan.month || todayISO().slice(0, 7));
      const monthFixed = state.fixedCosts.filter(item => {
        const created = item.createdAt || currentMonthKey;
        return created <= monthKey;
      }).reduce((s, item) => s + (item.value || 0), 0);

      const monthPaid = monthFixed + monthVariable + monthExpenseExtra;
      const monthBalance = monthIncome - monthPaid;

      const rowClass = isCurrent ? ' class="current-month-row"' : '';
      rows.push(`<tr${rowClass}>
        <td>${monthNamesShort[month - 1]}/${year}</td>
        <td class="money-income">${formatMoney(monthIncome)}</td>
        <td class="money-expense">${formatMoney(monthPaid)}</td>
        <td class="${monthBalance >= 0 ? 'money-blue' : 'money-expense'}">${formatMoney(monthBalance)}</td>
      </tr>`);
    }
    histTbody.innerHTML = rows.join('');
  }
}


function renderFinanceToday(items) {
  const list = document.querySelector("#finance-today-list");
  list.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nada para receber ou pagar hoje.";
    list.append(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("article");
    const isFixed = item.type === "fixed";
    const isVariable = item.type === "variable";
    const isBudget = isFixed || isVariable;
    const actionLabel = isBudget ? "Pagar" : item.type === "income" ? "Receber" : "Pagar";
    const doneLabel = isBudget ? "Paguei" : item.type === "income" ? "Recebi" : "Paguei";
    const actionData = isBudget ? `data-budget-paid="${isFixed ? "fixed" : "variable"}:${item.id}"` : `data-finance-done="${item.id}"`;
    row.className = `finance-alert ${item.type === "income" ? "income" : "expense"}`;
    row.innerHTML = `
      <div>
        <strong>${actionLabel}: ${escapeHtml(item.title)}</strong>
        <span>${formatMoney(item.value)} • ${escapeHtml(item.category || (isFixed ? "Custo fixo" : "Custo variável"))} • ${formatDate(item.dueDate)}</span>
      </div>
      <button class="primary-action" type="button" ${actionData}>${doneLabel}</button>
    `;
    list.append(row);
  });
}

function openFinanceEdit(itemId) {
  const item = state.finance.find((entry) => entry.id === itemId);
  if (!item) return;

  document.querySelector("#finance-edit-id").value = item.id;
  document.querySelector("#finance-edit-title").value = item.title;
  document.querySelector("#finance-edit-type").value = item.type;
  document.querySelector("#finance-edit-date").value = item.dueDate;
  document.querySelector("#finance-edit-value").value = item.value;
  document.querySelector("#finance-edit-repeat").value = item.repeat || "once";
  document.querySelector("#finance-edit-repeat-count").value = item.repeatCount || 1;

  const category = document.querySelector("#finance-edit-category");
  category.innerHTML = financeCategories.map((option) => `<option value="${option}" ${item.category === option ? "selected" : ""}>${option}</option>`).join("");

  document.querySelector("#finance-edit-panel").classList.add("open");
  document.querySelector("#finance-edit-panel").setAttribute("aria-hidden", "false");
}

function rebuildFinanceSeries(original, updates) {
  const repeat = normalizeFinanceRepeat(updates.repeat, updates.repeatCount);
  const count = repeat === "once" ? 1 : Math.max(1, Number(updates.repeatCount || 1));
  const groupId = original.groupId || crypto.randomUUID();
  const enteredTitle = String(updates.title || original.baseTitle || original.title).replace(/\s+\(\d+\/\d+\)$/, "");
  const baseTitle = enteredTitle;
  const baseDate = updates.dueDate || original.dueDate;
  const businessDay = Number(original.businessDay || 5);

  state.finance = state.finance.filter((item) => item.id === original.id || item.groupId !== groupId);

  const entries = Array.from({ length: count }, (_, index) => ({
    ...original,
    ...updates,
    id: index === 0 ? original.id : crypto.randomUUID(),
    groupId,
    baseTitle,
    title: count > 1 ? `${baseTitle} (${index + 1}/${count})` : baseTitle,
    dueDate: getFinanceOccurrenceDate(baseDate, index, original.dateMode || "date", repeat, businessDay),
    repeat,
    repeatCount: count,
    installment: index + 1,
    done: index === 0 ? false : false,
  }));

  state.finance = state.finance.filter((item) => item.id !== original.id);
  state.finance.push(...entries);
}

function openBudgetEdit(payload) {
  const [kind, id] = payload.split(":");
  const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
  const item = state[key].find((entry) => entry.id === id);
  if (!item) return;

  document.querySelector("#budget-edit-id").value = id;
  document.querySelector("#budget-edit-kind").value = kind;
  document.querySelector("#budget-edit-title").value = item.title;
  document.querySelector("#budget-edit-value").value = item.value;
  document.querySelector("#budget-edit-day").value = item.dueDay || 1;
  document.querySelector("#budget-edit-date").value = kind === "fixed" ? getFixedCostDueDate(item) : item.dueDate || todayISO();
  document.querySelector("#budget-edit-date").disabled = kind === "fixed";
  document.querySelector("#budget-edit-day-wrap").style.display = kind === "fixed" ? "grid" : "none";

  document.querySelector("#budget-edit-panel").classList.add("open");
  document.querySelector("#budget-edit-panel").setAttribute("aria-hidden", "false");
}

const genericEditConfigs = {
  task: {
    title: "Editar tarefa",
    find: (id) => state.tasks.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Tarefa", type: "text" },
      { key: "priority", label: "Prioridade", type: "select", options: ["Alta", "Média", "Baixa"] },
    ],
    save: (id, values) => {
      state.tasks = state.tasks.map((item) => item.id === id ? { ...item, title: values.title || item.title, priority: values.priority } : item);
    },
  },
  pending: {
    title: "Editar pendência",
    find: (id) => state.pending.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Nome", type: "text" },
      { key: "type", label: "Tipo", type: "select", options: [["daily", "Diária/imediata"], ["backlog", "Sem prazo"], ["weekly", "Semanal"], ["monthly", "Mensal"]] },
    ],
    save: (id, values) => {
      state.pending = state.pending.map((item) => item.id === id ? { ...item, title: values.title || item.title, type: values.type } : item);
    },
  },
  subtask: {
    title: "Editar subtarefa",
    find: (id) => {
      const [taskId, subtaskId] = id.split(":");
      return state.pending.find((task) => task.id === taskId)?.subtasks.find((subtask) => subtask.id === subtaskId);
    },
    fields: [{ key: "title", label: "Subtarefa", type: "text" }],
    save: (id, values) => {
      const [taskId, subtaskId] = id.split(":");
      state.pending = state.pending.map((task) => task.id === taskId ? {
        ...task,
        subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, title: values.title || subtask.title } : subtask),
      } : task);
    },
  },
  market: {
    title: "Editar compra",
    find: (id) => state.market.find((item) => item.id === id),
    fields: [
      { key: "name", label: "Item", type: "text" },
      { key: "category", label: "Categoria", type: "select", options: marketCategories.map((category) => [category.id, category.label]) },
      { key: "qty", label: "Quantidade", type: "number" },
      { key: "price", label: "Preço", type: "number" },
    ],
    save: (id, values) => {
      state.market = state.market.map((item) => item.id === id ? {
        ...item,
        name: values.name || item.name,
        category: values.category,
        qty: Number(values.qty || 1),
        price: Number(values.price || 0),
        shopQty: Number(values.qty || 1),
        shopPrice: Number(values.price || 0),
      } : item);
    },
  },
  wishlist: {
    title: "Editar item para comprar",
    find: (id) => state.wishlist.find((item) => item.id === id),
    fields: [
      { key: "name", label: "Item", type: "text" },
      { key: "category", label: "Categoria", type: "select", options: wishlistCategories.map((category) => [category.id, category.label]) },
      { key: "priority", label: "Prioridade", type: "select", options: ["Alta", "Média", "Baixa"] },
      { key: "price", label: "Valor previsto", type: "number" },
      { key: "link", label: "Loja ou link", type: "text" },
    ],
    save: (id, values) => {
      state.wishlist = state.wishlist.map((item) => item.id === id ? { ...item, name: values.name || item.name, category: values.category, priority: values.priority, price: Number(values.price || 0), link: values.link || "" } : item);
    },
  },
  routine: {
    title: "Editar rotina",
    find: (id) => state.routine.find((item) => item.id === id),
    fields: [
      { key: "emoji", label: "Emoji", type: "text" },
      { key: "title", label: "Tarefa", type: "text" },
      { key: "type", label: "Tipo", type: "select", options: () => state.routineCategories.map((category) => [category.id, category.name]) },
    ],
    save: (id, values) => {
      state.routine = state.routine.map((item) => item.id === id ? { ...item, emoji: values.emoji || inferRoutineEmoji(values.title || item.title), title: values.title || item.title, type: values.type } : item);
    },
  },
  agenda: {
    title: "Editar agenda",
    find: (id) => state.agenda.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Compromisso", type: "text" },
      { key: "date", label: "Data", type: "date" },
      { key: "type", label: "Tipo", type: "select", options: [["appointment", "Compromisso"], ["reminder", "Lembrete"], ["deadline", "Prazo"]] },
    ],
    save: (id, values) => {
      state.agenda = state.agenda.map((item) => item.id === id ? { ...item, title: values.title || item.title, date: values.date || item.date, type: values.type } : item);
    },
  },
  cnh: {
    title: "Editar etapa da CNH",
    find: (id) => state.cnh.steps.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Etapa", type: "text" },
      { key: "value", label: "Valor", type: "number" },
      { key: "dueDate", label: "Data prevista", type: "date" },
    ],
    save: (id, values) => {
      state.cnh.steps = state.cnh.steps.map((item) => item.id === id ? {
        ...item,
        title: values.title || item.title,
        value: Number(values.value || 0),
        dueDate: values.dueDate || "",
      } : item);
    },
  },
  financeGoal: {
    title: "Editar meta financeira",
    find: (id) => state.financeGoals.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Meta", type: "text" },
      { key: "current", label: "Valor atual", type: "number" },
      { key: "target", label: "Valor alvo", type: "number" },
    ],
    save: (id, values) => {
      state.financeGoals = state.financeGoals.map((item) => item.id === id ? {
        ...item,
        title: values.title || item.title,
        current: Number(values.current || 0),
        target: Number(values.target || 0),
      } : item);
    },
  },
  note: {
    title: "Editar anotação",
    find: (id) => state.notes.find((item) => item.id === id),
    fields: [{ key: "text", label: "Anotação", type: "textarea" }],
    save: (id, values) => {
      state.notes = state.notes.map((item) => item.id === id ? { ...item, text: values.text || item.text } : item);
    },
  },
  personalGoal: {
    title: "Editar meta",
    find: (id) => state.personal.goals.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Meta", type: "text" },
      { key: "area", label: "Área", type: "text" },
    ],
    save: (id, values) => {
      state.personal.goals = state.personal.goals.map((item) => item.id === id ? { ...item, title: values.title || item.title, area: values.area || item.area } : item);
    },
  },
  personalDoc: {
    title: "Editar documento/link",
    find: (id) => state.personal.docs.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Nome", type: "text" },
      { key: "value", label: "Detalhe", type: "text" },
    ],
    save: (id, values) => {
      state.personal.docs = state.personal.docs.map((item) => item.id === id ? { ...item, title: values.title || item.title, value: values.value || "" } : item);
    },
  },
  win: {
    title: "Editar conquista",
    find: (id) => state.wins.find((item) => item.id === id),
    fields: [
      { key: "title", label: "Conquista", type: "text" },
      { key: "date", label: "Data", type: "date" },
    ],
    save: (id, values) => {
      state.wins = state.wins.map((item) => item.id === id ? { ...item, title: values.title || item.title, date: values.date || item.date } : item);
    },
  },
  wardrobe: {
    title: "Editar roupa",
    find: (id) => state.wardrobeItems.find((item) => item.id === id),
    fields: [
      { key: "name", label: "Nome", type: "text" },
      { key: "category", label: "Categoria", type: "select", options: wardrobeCategories.map((category) => [category.id, category.label]) },
      { key: "color", label: "Cor", type: "text" },
      { key: "style", label: "Estilo", type: "text" },
      { key: "notes", label: "Observações", type: "textarea" },
    ],
    save: (id, values) => {
      state.wardrobeItems = state.wardrobeItems.map((item) => item.id === id ? {
        ...item,
        name: values.name || item.name,
        category: values.category,
        color: values.color || "",
        style: values.style || "",
        notes: values.notes || "",
      } : item);
    },
  },
};

function openGenericEdit(entity, id) {
  const config = genericEditConfigs[entity];
  const item = config?.find(id);
  if (!config || !item) return;

  document.querySelector("#generic-edit-title").textContent = config.title;
  document.querySelector("#generic-edit-entity").value = entity;
  document.querySelector("#generic-edit-id").value = id;
  const fields = document.querySelector("#generic-edit-fields");
  fields.innerHTML = "";

  config.fields.forEach((field) => {
    const label = document.createElement("label");
    label.innerHTML = `<span>${field.label}</span>`;
    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      const options = typeof field.options === "function" ? field.options() : field.options;
      options.forEach((option) => {
        const value = Array.isArray(option) ? option[0] : option;
        const text = Array.isArray(option) ? option[1] : option;
        input.innerHTML += `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`;
      });
    } else if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 4;
    } else {
      input = document.createElement("input");
      input.type = field.type;
      if (field.type === "number") {
        input.min = "0";
        input.step = "0.01";
      }
    }
    input.dataset.genericField = field.key;
    input.value = item[field.key] ?? "";
    if (field.key === "emoji") {
      const wrap = document.createElement("div");
      wrap.className = "emoji-input-wrap";
      input.id = "generic-routine-emoji";
      const emojiButton = document.createElement("button");
      emojiButton.type = "button";
      emojiButton.dataset.emojiPickerTarget = input.id;
      emojiButton.title = "Escolher emoji";
      emojiButton.textContent = "☺";
      wrap.append(input, emojiButton);
      label.append(wrap);
    } else {
      label.append(input);
    }
    fields.append(label);
  });

  document.querySelector("#generic-edit-panel").classList.add("open");
  document.querySelector("#generic-edit-panel").setAttribute("aria-hidden", "false");
}

function deleteGenericItem(entity, id) {
  if (entity === "task") state.tasks = state.tasks.filter((item) => item.id !== id);
  if (entity === "pending") state.pending = state.pending.filter((item) => item.id !== id);
  if (entity === "subtask") {
    const [taskId, subtaskId] = id.split(":");
    state.pending = state.pending.map((task) => task.id === taskId ? {
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    } : task);
  }
  if (entity === "market") state.market = state.market.filter((item) => item.id !== id);
  if (entity === "wishlist") state.wishlist = state.wishlist.filter((item) => item.id !== id);
  if (entity === "routine") state.routine = state.routine.filter((item) => item.id !== id);
  if (entity === "agenda") state.agenda = state.agenda.filter((item) => item.id !== id);
  if (entity === "cnh") state.cnh.steps = state.cnh.steps.filter((item) => item.id !== id);
  if (entity === "financeGoal") state.financeGoals = state.financeGoals.filter((item) => item.id !== id);
  if (entity === "note") state.notes = state.notes.filter((item) => item.id !== id);
  if (entity === "personalGoal") state.personal.goals = state.personal.goals.filter((item) => item.id !== id);
  if (entity === "personalDoc") state.personal.docs = state.personal.docs.filter((item) => item.id !== id);
  if (entity === "win") state.wins = state.wins.filter((item) => item.id !== id);
  if (entity === "wardrobe") {
    state.wardrobeItems = state.wardrobeItems.filter((item) => item.id !== id);
    state.wardrobeSelection = state.wardrobeSelection.filter((itemId) => itemId !== id);
    state.wardrobeLooks = state.wardrobeLooks.filter((look) => !look.pieces.includes(id));
  }
}

function renderBudgetList(elementId, items, kind) {
  const list = document.querySelector(`#${elementId}`);
  list.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("article");
    const paid = isBudgetPaid(item);
    const dueDate = kind === "fixed" ? getFixedCostDueDate(item) : item.dueDate;
    const statusText = paid ? "Pago" : dueDate < todayISO() ? "Atrasado" : "Pendente";
    row.className = `finance-row budget-row ${paid ? "done paid" : ""} ${!paid && dueDate < todayISO() ? "late" : ""}`;
    row.innerHTML = `
      <span class="finance-date">${formatDate(dueDate)}</span>
      <div class="finance-row-main">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${kind === "fixed" ? "Custo fixo" : "Custo variável"} • ${statusText}</small>
      </div>
      <strong class="money-expense">- ${formatMoney(item.value)}</strong>
      <div class="finance-row-actions">
        <button class="check-btn ${paid ? "active" : ""}" type="button" data-budget-paid="${kind}:${item.id}" title="Marcar como pago">✓</button>
        <button class="edit-btn" type="button" data-budget-edit="${kind}:${item.id}">Editar</button>
        <button class="delete-btn" type="button" data-budget-delete="${kind}:${item.id}">×</button>
      </div>
    `;
    list.append(row);
  });
}

function renderToday() {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  document.querySelector("#today-date").textContent = `Hoje, ${today}`;
}

function renderDashboard() {
  const openTasks = state.tasks.filter((task) => !task.done);
  const openPending = (state.pending || []).filter((task) => !task.done);
  const pendingMarket = state.market.filter((item) => !item.bought);
  const routineDone = state.routine.filter((item) => item.done).length;
  const routinePercent = state.routine.length ? Math.round((routineDone / state.routine.length) * 100) : 0;
  const total = state.market.reduce((sum, item) => sum + item.qty * item.price, 0);

  document.querySelector("#metric-tasks").textContent = openTasks.length + openPending.length;
  document.querySelector("#metric-market").textContent = pendingMarket.length;
  document.querySelector("#metric-routine").textContent = `${routinePercent}%`;
  document.querySelector("#metric-total").textContent = formatMoney(total);

  const taskList = document.querySelector("#dashboard-tasks");
  taskList.innerHTML = "";
  openTasks.slice(0, 4).forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${task.title}</span><strong>${task.priority}</strong>`;
    taskList.append(li);
  });
  if (!openTasks.length) taskList.innerHTML = "<li><span>Nenhuma tarefa aberta.</span><strong>OK</strong></li>";

  const marketList = document.querySelector("#dashboard-market");
  marketList.innerHTML = "";
  pendingMarket.slice(0, 4).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span><strong>${formatMoney(item.qty * item.price)}</strong>`;
    marketList.append(li);
  });
  if (!pendingMarket.length) marketList.innerHTML = "<li><span>Nenhuma compra pendente.</span><strong>OK</strong></li>";
}

function renderPending() {
  const types = ["daily", "backlog", "weekly", "monthly"];
  const emptyText = {
    daily: "Nada imediato por aqui. Quando aparecer algo para hoje, coloque nesta coluna.",
    backlog: "Sem pendências soltas registradas.",
    weekly: "Nenhuma tarefa semanal cadastrada.",
    monthly: "Nenhuma tarefa mensal cadastrada.",
  };

  types.forEach((type) => {
    const list = document.querySelector(`#pending-${type}`);
    const items = (state.pending || []).filter((task) => task.type === type);
    list.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = emptyText[type];
      list.append(empty);
      return;
    }

    items.forEach((task) => {
      const completed = task.subtasks.filter((subtask) => subtask.done).length;
      const progress = task.subtasks.length ? `${completed}/${task.subtasks.length}` : "sem subtarefas";
      const row = document.createElement("article");
      const isOpen = expandedPending.has(task.id);
      row.className = `pending-item ${task.done ? "done" : ""}`;
      row.draggable = true;
      row.dataset.pendingDrag = task.id;
      row.innerHTML = `
        <div class="pending-main">
          <button class="check-btn ${task.done ? "active" : ""}" type="button" data-pending-check="${task.id}">✓</button>
          <div>
            <strong>${task.title}</strong>
            <small>${progress}</small>
          </div>
          <button class="expand-btn ${isOpen ? "open" : ""}" type="button" data-pending-expand="${task.id}" title="Abrir subtarefas">${isOpen ? "−" : "+"}</button>
          <button class="drag-handle" type="button" title="Arrastar tarefa">⋮⋮</button>
          <button class="edit-btn" type="button" data-generic-edit="pending:${task.id}">Editar</button>
          <button class="delete-btn" type="button" data-pending-delete="${task.id}">×</button>
        </div>
        <div class="subtasks ${isOpen ? "" : "collapsed"}">
          <ul>
            ${task.subtasks.map((subtask) => `
              <li class="${subtask.done ? "done" : ""}">
                <button class="mini-check ${subtask.done ? "active" : ""}" type="button" data-subtask-check="${task.id}:${subtask.id}">✓</button>
                <span>${subtask.title}</span>
                <button class="mini-edit" type="button" data-generic-edit="subtask:${task.id}:${subtask.id}">Editar</button>
                <button class="mini-delete" type="button" data-subtask-delete="${task.id}:${subtask.id}">×</button>
              </li>
            `).join("")}
          </ul>
          <form class="subtask-form" data-subtask-form="${task.id}">
            <input type="text" placeholder="Adicionar subtarefa" />
            <button type="submit">Adicionar</button>
          </form>
        </div>
      `;
      list.append(row);
    });
  });
}

function renderTasks() {
  const list = document.querySelector("#task-list");
  list.innerHTML = "";
  state.tasks.forEach((task) => {
    const row = document.createElement("div");
    row.className = `table-row ${task.done ? "done" : ""}`;
    row.innerHTML = `
      <span><button class="check-btn ${task.done ? "active" : ""}" type="button" data-task-check="${task.id}">✓</button></span>
      <strong>${task.title}</strong>
      <span class="pill ${task.priority}">${task.priority}</span>
      <button class="edit-btn" type="button" data-generic-edit="task:${task.id}">Editar</button>
      <button class="delete-btn" type="button" data-task-delete="${task.id}">×</button>
    `;
    list.append(row);
  });
}

function renderMarket() {
  const list = document.querySelector("#market-list");
  const categoryGrid = document.querySelector("#market-categories");
  const side = document.querySelector("#market-side");
  renderMarketShop();
  list.innerHTML = "";
  categoryGrid.innerHTML = "";
  side.innerHTML = "";

  marketCategories.forEach((category) => {
    const items = state.market.filter((item) => item.category === category.id);
    const pending = items.filter((item) => !item.bought).length;

    const card = document.createElement("button");
    card.className = "category-card";
    card.type = "button";
    card.dataset.marketJump = category.id;
    card.innerHTML = `
      <span>${category.icon}</span>
      <strong>${category.label}</strong>
      <small>${pending} pendente${pending === 1 ? "" : "s"}</small>
    `;
    categoryGrid.append(card);

    const sideButton = document.createElement("button");
    sideButton.type = "button";
    sideButton.dataset.marketJump = category.id;
    sideButton.innerHTML = `<span>${category.icon} ${category.label}</span><strong>${items.length}</strong>`;
    side.append(sideButton);

    const section = document.createElement("section");
    section.className = "market-section";
    section.id = `market-${category.id}`;
    section.innerHTML = `
      <div class="market-section-head">
        <h3>${category.icon} ${category.label}</h3>
        <span>${items.length} item${items.length === 1 ? "" : "s"}</span>
      </div>
    `;

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Nenhum item nesta categoria.";
      section.append(empty);
    }

    items.forEach((item) => {
      const total = item.qty * item.price;
      const row = document.createElement("div");
      row.className = `market-item-row ${item.bought ? "done" : ""}`;
      row.innerHTML = `
        <button class="check-btn ${item.bought ? "active" : ""}" type="button" data-market-check="${item.id}">✓</button>
        <strong>${item.name}</strong>
        <span class="market-value-cell"><small>Quantidade</small>${item.qty}</span>
        <span class="market-value-cell"><small>Unitário</small>${formatMoney(item.price)}</span>
        <span class="market-value-cell"><small>Total</small>${formatMoney(total)}</span>
        <button class="edit-btn" type="button" data-generic-edit="market:${item.id}">Editar</button>
        <button class="delete-btn" type="button" data-market-delete="${item.id}">×</button>
      `;
      section.append(row);
    });

    list.append(section);
  });
}

function getMarketShopQty(item) {
  return Math.max(1, Number(item.shopQty || item.qty || 1));
}

function getMarketShopPrice(item) {
  return Number(item.shopPrice ?? item.price ?? 0);
}

function renderMarketShop() {
  const panel = document.querySelector("#market-shop-panel");
  const list = document.querySelector("#market-shop-list");
  const toggle = document.querySelector("#market-shop-toggle");
  const pendingItems = state.market.filter((item) => !item.bought || item.inCart);
  const pickedItems = pendingItems.filter((item) => item.inCart);
  const estimatedTotal = pendingItems.reduce((sum, item) => sum + getMarketShopQty(item) * getMarketShopPrice(item), 0);
  const pickedTotal = pickedItems.reduce((sum, item) => sum + getMarketShopQty(item) * getMarketShopPrice(item), 0);

  document.querySelector("#market").classList.toggle("market-shopping", marketShopMode);
  panel.hidden = !marketShopMode;
  toggle.textContent = marketShopMode ? "Voltar para lista geral" : "Ir ao mercado";
  document.querySelector("#market-shop-pending").textContent = state.market.filter((item) => !item.bought).length;
  document.querySelector("#market-shop-picked").textContent = pickedItems.length;
  document.querySelector("#market-shop-estimate").textContent = formatMoney(estimatedTotal);
  document.querySelector("#market-shop-total").textContent = formatMoney(pickedTotal);

  if (!marketShopMode) return;

  list.innerHTML = "";
  if (!pendingItems.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum item pendente para comprar.";
    list.append(empty);
    return;
  }

  marketCategories.forEach((category) => {
    const items = pendingItems.filter((item) => item.category === category.id);
    if (!items.length) return;

    const section = document.createElement("section");
    section.className = "market-shop-section";
    section.innerHTML = `<h4>${category.icon} ${category.label}</h4>`;

    items.forEach((item) => {
      const qty = getMarketShopQty(item);
      const price = getMarketShopPrice(item);
      const rowTotal = qty * price;
      const row = document.createElement("article");
      row.className = `market-shop-row ${item.inCart ? "picked" : ""}`;
      row.innerHTML = `
        <button class="check-btn ${item.inCart ? "active" : ""}" type="button" data-market-shop-pick="${item.id}" title="Marcar como pego">✓</button>
        <strong>${escapeHtml(item.name)}</strong>
        <label>
          <span>Qtd</span>
          <input type="number" min="1" step="1" value="${qty}" data-market-shop-qty="${item.id}" />
        </label>
        <label>
          <span>Preço</span>
          <input type="number" min="0" step="0.01" value="${price || ""}" data-market-shop-price="${item.id}" />
        </label>
        <span class="market-shop-row-total">${formatMoney(rowTotal)}</span>
      `;
      section.append(row);
    });

    list.append(section);
  });
}

function renderPersonal() {
  if (!document.querySelector("#personal-name")) return;
  const info = state.personal.info;
  document.querySelector("#personal-name").value = info.name || "";
  document.querySelector("#personal-phone").value = info.phone || "";
  document.querySelector("#personal-email").value = info.email || "";
  document.querySelector("#personal-address").value = info.address || "";
  document.querySelector("#personal-notes").value = info.notes || "";

  const openGoals = state.personal.goals.filter((item) => !item.done);
  const doneGoals = state.personal.goals.filter((item) => item.done);
  document.querySelector("#personal-goals-open").textContent = openGoals.length;
  document.querySelector("#personal-goals-done").textContent = doneGoals.length;
  document.querySelector("#personal-docs-count").textContent = state.personal.docs.length;

  const goalsList = document.querySelector("#personal-goals-list");
  goalsList.innerHTML = "";
  if (!state.personal.goals.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhuma meta pessoal cadastrada.";
    goalsList.append(empty);
  }

  state.personal.goals.forEach((goal) => {
    const row = document.createElement("article");
    row.className = `personal-row ${goal.done ? "done" : ""}`;
    row.innerHTML = `
      <button class="check-btn ${goal.done ? "active" : ""}" type="button" data-personal-goal-check="${goal.id}">✓</button>
      <div>
        <strong>${escapeHtml(goal.title)}</strong>
        <small>${escapeHtml(goal.area)}</small>
      </div>
      <button class="edit-btn" type="button" data-generic-edit="personalGoal:${goal.id}">Editar</button>
      <button class="delete-btn" type="button" data-personal-goal-delete="${goal.id}">×</button>
    `;
    goalsList.append(row);
  });

  const docsList = document.querySelector("#personal-docs-list");
  docsList.innerHTML = "";
  if (!state.personal.docs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum documento ou link cadastrado.";
    docsList.append(empty);
  }

  state.personal.docs.forEach((doc) => {
    const row = document.createElement("article");
    row.className = `personal-row ${doc.done ? "done" : ""}`;
    row.innerHTML = `
      <button class="check-btn ${doc.done ? "active" : ""}" type="button" data-personal-doc-check="${doc.id}">✓</button>
      <div>
        <strong>${escapeHtml(doc.title)}</strong>
        <small>${escapeHtml(doc.value || "Sem detalhe")}</small>
      </div>
      <button class="edit-btn" type="button" data-generic-edit="personalDoc:${doc.id}">Editar</button>
      <button class="delete-btn" type="button" data-personal-doc-delete="${doc.id}">×</button>
    `;
    docsList.append(row);
  });
}

function renderWishlist() {
  const list = document.querySelector("#wishlist-list");
  const categories = document.querySelector("#wishlist-categories");
  const openItems = state.wishlist.filter((item) => !item.bought);
  const total = openItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const high = openItems.filter((item) => item.priority === "Alta").length;

  document.querySelector("#wishlist-open").textContent = openItems.length;
  document.querySelector("#wishlist-total").textContent = formatMoney(total);
  document.querySelector("#wishlist-high").textContent = high;

  categories.innerHTML = "";
  wishlistCategories.forEach((category) => {
    const items = state.wishlist.filter((item) => item.category === category.id);
    const pending = items.filter((item) => !item.bought).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wishlist-category-card";
    button.dataset.wishlistCategoryJump = category.id;
    button.innerHTML = `
      <span>${category.icon}</span>
      <strong>${category.label}</strong>
      <small>${pending} pendente(s)</small>
    `;
    categories.append(button);
  });

  list.innerHTML = "";
  if (!state.wishlist.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhuma compra futura cadastrada.";
    list.append(empty);
    return;
  }

  wishlistCategories.forEach((category) => {
    const items = state.wishlist.filter((item) => item.category === category.id);
    const section = document.createElement("section");
    section.className = "wishlist-section";
    section.id = `wishlist-category-${category.id}`;
    section.innerHTML = `
      <div class="wishlist-section-head">
        <span>${category.icon}</span>
        <h3>${category.label}</h3>
        <small>${items.filter((item) => !item.bought).length} pendente(s)</small>
      </div>
      <div class="wishlist-list"></div>
    `;
    const sectionList = section.querySelector(".wishlist-list");
    if (!items.length) {
      sectionList.innerHTML = `<div class="empty-state">Nenhum item nesta categoria.</div>`;
    }
    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = `wishlist-row ${item.bought ? "done" : ""}`;
      row.innerHTML = `
        <button class="check-btn ${item.bought ? "active" : ""}" type="button" data-wishlist-check="${item.id}" title="Marcar como comprado">✓</button>
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          ${
            isUrl(item.link)
              ? `<a class="wishlist-link" href="${escapeHtml(normalizeUrl(item.link))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.link)}</a>`
              : `<small>${escapeHtml(item.link || "Sem loja/link")}</small>`
          }
        </div>
        <span class="pill ${escapeHtml(item.priority)}">${escapeHtml(item.priority)}</span>
        <strong>${formatMoney(item.price)}</strong>
        <button class="edit-btn" type="button" data-generic-edit="wishlist:${item.id}">Editar</button>
        <button class="delete-btn" type="button" data-wishlist-delete="${item.id}">×</button>
      `;
      sectionList.append(row);
    });
    list.append(section);
  });
}

function renderAgenda() {
  const list = document.querySelector("#agenda-list");
  const calendar = document.querySelector("#agenda-calendar-grid");
  const typeLabels = {
    appointment: "Compromisso",
    reminder: "Lembrete",
    deadline: "Prazo",
  };
  const sorted = [...state.agenda].sort((a, b) => a.date.localeCompare(b.date));
  const monthKey = state.agendaPlan?.month || todayISO().slice(0, 7);
  const [year, month] = monthKey.split("-").map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const monthDays = daysInMonth(monthKey);
  const previousMonthDate = new Date(year, month - 2, 1);
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, "0")}`;
  const previousMonthDays = daysInMonth(previousMonthKey);

  document.querySelector("#agenda-calendar-title").textContent = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  calendar.innerHTML = "";
  Array.from({ length: 42 }, (_, index) => {
    const relativeDay = index - firstWeekday + 1;
    let date = "";
    let day = relativeDay;
    let outside = false;

    if (relativeDay < 1) {
      day = previousMonthDays + relativeDay;
      date = dateToISO(new Date(year, month - 2, day));
      outside = true;
    } else if (relativeDay > monthDays) {
      day = relativeDay - monthDays;
      date = dateToISO(new Date(year, month, day));
      outside = true;
    } else {
      date = dateToISO(new Date(year, month - 1, day));
    }

    const events = sorted.filter((item) => item.date === date);
    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = `agenda-day ${outside ? "outside" : ""} ${date === todayISO() ? "today" : ""}`;
    dayButton.dataset.agendaDay = date;
    dayButton.innerHTML = `
      <span class="agenda-day-number">${day}</span>
      <span class="agenda-day-events">
        ${events.slice(0, 3).map((item) => `<small class="${item.type} ${item.done ? "done" : ""}">${escapeHtml(item.title)}</small>`).join("")}
        ${events.length > 3 ? `<small class="agenda-more">+${events.length - 3} compromisso(s)</small>` : ""}
      </span>
    `;
    calendar.append(dayButton);
  });

  list.innerHTML = "";
  if (!sorted.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum compromisso cadastrado.";
    list.append(empty);
    return;
  }

  sorted.forEach((item) => {
    const row = document.createElement("article");
    row.className = item.done ? "done" : "";
    row.innerHTML = `
      <button class="check-btn ${item.done ? "active" : ""}" type="button" data-agenda-check="${item.id}">✓</button>
      <b>${formatDate(item.date)}</b>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${typeLabels[item.type] || "Lembrete"}</span>
      </div>
      <button class="edit-btn" type="button" data-generic-edit="agenda:${item.id}">Editar</button>
      <button class="delete-btn" type="button" data-agenda-delete="${item.id}">×</button>
    `;
    list.append(row);
  });
}

function renderCnh() {
  const list = document.querySelector("#cnh-list");
  if (!list) return;

  const steps = state.cnh?.steps || [];
  const total = steps.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const completed = steps.filter((item) => item.done);
  const completedTotal = completed.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const progress = steps.length ? Math.round((completed.length / steps.length) * 100) : 0;
  const nextStep = steps.find((item) => !item.done);

  document.querySelector("#cnh-total").textContent = formatMoney(total);
  document.querySelector("#cnh-paid").textContent = formatMoney(completedTotal);
  document.querySelector("#cnh-open").textContent = formatMoney(Math.max(0, total - completedTotal));
  document.querySelector("#cnh-progress-text").textContent = `${progress}%`;
  document.querySelector("#cnh-progress-bar").style.width = `${progress}%`;
  document.querySelector("#cnh-step-count").textContent = `${completed.length} de ${steps.length} etapas`;
  document.querySelector("#cnh-next-step").textContent = nextStep ? `Próxima etapa: ${nextStep.title}` : "Processo concluído";
  document.querySelector("#cnh-date-range").textContent = `${formatDate(state.cnh?.startDate)} até ${formatDate(state.cnh?.endDate)}`;

  list.innerHTML = "";
  if (!steps.length) {
    list.innerHTML = `<div class="empty-state">Nenhuma etapa da CNH cadastrada.</div>`;
    return;
  }

  steps.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = `cnh-step ${item.done ? "done" : ""}`;
    row.innerHTML = `
      <button class="check-btn ${item.done ? "active" : ""}" type="button" data-cnh-check="${item.id}" title="Marcar etapa como concluída">✓</button>
      <div class="cnh-step-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="cnh-step-main">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${item.dueDate ? formatDate(item.dueDate) : "Sem data definida"}</span>
      </div>
      <strong class="cnh-step-value">${formatMoney(item.value)}</strong>
      <span class="pill ${item.done ? "Baixa" : "Média"}">${item.done ? "Concluído" : "Pendente"}</span>
      <button class="edit-btn" type="button" data-generic-edit="cnh:${item.id}">Editar</button>
      <button class="delete-btn" type="button" data-cnh-delete="${item.id}">×</button>
    `;
    list.append(row);
  });
}

function renderWins() {
  const list = document.querySelector("#wins-list");
  const sorted = [...state.wins].sort((a, b) => b.date.localeCompare(a.date));
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });

  list.innerHTML = "";
  if (!sorted.length) {
    list.innerHTML = `<div class="empty-state">Nenhuma conquista cadastrada.</div>`;
    return;
  }

  const groupBy = (items, getKey) => items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
  const byYear = groupBy(sorted, (item) => item.date.slice(0, 4));
  Object.entries(byYear).forEach(([year, yearItems]) => {
    const yearSection = document.createElement("section");
    yearSection.className = "wins-year";
    yearSection.innerHTML = `<h2>${year}</h2><div class="wins-months"></div>`;
    const months = yearSection.querySelector(".wins-months");
    const byMonth = groupBy(yearItems, (item) => item.date.slice(0, 7));

    Object.entries(byMonth).forEach(([monthKey, monthItems]) => {
      const [monthYear, month] = monthKey.split("-").map(Number);
      const monthSection = document.createElement("section");
      monthSection.className = "wins-month";
      monthSection.innerHTML = `
        <h3>${monthFormatter.format(new Date(monthYear, month - 1, 1))}</h3>
        <div class="wins-grid"></div>
      `;
      const grid = monthSection.querySelector(".wins-grid");

      monthItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "win-card";
        card.innerHTML = `
          <button class="win-photo ${item.photo ? "has-photo" : ""}" type="button" data-win-photo="${item.id}" title="Adicionar ou trocar foto">
            ${item.photo ? `<img src="${item.photo}" alt="${escapeHtml(item.title)}" />` : `<span>Adicionar foto</span>`}
          </button>
          <div class="win-card-body">
            <span>${formatDate(item.date)}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <button class="edit-btn" type="button" data-generic-edit="win:${item.id}">Editar</button>
            <button class="delete-btn" type="button" data-win-delete="${item.id}" title="Apagar conquista">×</button>
          </div>
        `;
        grid.append(card);
      });

      months.append(monthSection);
    });

    list.append(yearSection);
  });
}

function renderHomeItems() {
  const list = document.querySelector("#home-list");
  const doneItems = state.homeItems.filter((item) => item.done);
  const openItems = state.homeItems.filter((item) => !item.done);
  list.innerHTML = "";
  document.querySelector("#home-done-count").textContent = doneItems.length;
  document.querySelector("#home-open-count").textContent = openItems.length;

  state.homeItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = `home-card ${item.done ? "done" : ""}`;
    card.innerHTML = `
      <button class="home-photo ${item.photo ? "has-photo" : ""}" type="button" data-home-photo="${item.id}" title="Adicionar ou trocar foto">
        ${item.photo ? `<img src="${item.photo}" alt="${escapeHtml(item.title)}" />` : "<span>Foto</span>"}
      </button>
      <div class="home-card-body">
        <button class="check-btn ${item.done ? "active" : ""}" type="button" data-home-check="${item.id}" title="Marcar como comprado">✓</button>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${item.done ? "Tenho" : "Pendente"}</span>
        <button class="delete-btn" type="button" data-home-delete="${item.id}">×</button>
      </div>
    `;
    list.append(card);
  });
}

function getGeneratedWardrobeLooks() {
  const selected = state.wardrobeItems.filter((item) => state.wardrobeSelection.includes(item.id));
  const byCategory = Object.fromEntries(wardrobeCategories.map((category) => [
    category.id,
    selected.filter((item) => item.category === category.id),
  ]));
  if (!byCategory.top.length || !byCategory.bottom.length || !byCategory.shoes.length) return [];
  const choices = [
    byCategory.coat.length ? [null, ...byCategory.coat] : [null],
    byCategory.top,
    byCategory.bottom,
    byCategory.shoes,
    byCategory.accessory.length ? [null, ...byCategory.accessory] : [null],
  ];
  return choices.reduce((looks, categoryChoices) => (
    looks.flatMap((look) => categoryChoices.map((piece) => piece ? [...look, piece.id] : look))
  ), [[]]).filter((pieces) => pieces.length >= 3);
}

function wardrobePieceVisual(item, compact = false) {
  return `<article class="wardrobe-look-piece ${compact ? "compact" : ""}">
    <div>${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />` : `<span>👕</span>`}</div>
    <strong>${escapeHtml(item.name)}</strong>
    <small>${escapeHtml(item.color || "Sem cor")}</small>
  </article>`;
}

function wardrobeLookCard(pieces, actions = "") {
  const ordered = wardrobeCategories.flatMap((category) => pieces.filter((item) => item.category === category.id));
  return `<article class="wardrobe-look-card"><div class="wardrobe-look-pieces">${ordered.map((item) => wardrobePieceVisual(item, true)).join("")}</div><div class="wardrobe-look-actions">${actions}</div></article>`;
}

function renderWardrobe() {
  const list = document.querySelector("#wardrobe-list");
  if (!list) return;
  const nameFilter = document.querySelector("#wardrobe-filter-name").value.trim().toLocaleLowerCase("pt-BR");
  const categoryFilter = document.querySelector("#wardrobe-filter-category").value;
  const colorFilter = document.querySelector("#wardrobe-filter-color").value.trim().toLocaleLowerCase("pt-BR");
  const filtered = state.wardrobeItems.filter((item) => (
    (!nameFilter || item.name.toLocaleLowerCase("pt-BR").includes(nameFilter))
    && (!categoryFilter || item.category === categoryFilter)
    && (!colorFilter || item.color.toLocaleLowerCase("pt-BR").includes(colorFilter))
  ));
  list.innerHTML = filtered.length ? filtered.map((item) => `<article class="wardrobe-item-card">
    <button class="wardrobe-item-photo" type="button" data-wardrobe-photo="${item.id}" title="Adicionar ou trocar foto">${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />` : `<span>Adicionar foto</span>`}</button>
    <div class="wardrobe-item-body"><span>${escapeHtml(wardrobeCategoryLabel(item.category))}</span><h4>${escapeHtml(item.name)}</h4><p><i style="--piece-color:${escapeHtml(item.color)}"></i>${escapeHtml(item.color || "Sem cor")}</p><small>${escapeHtml(item.style || "Sem estilo definido")}</small><div><button type="button" data-generic-edit="wardrobe:${item.id}">Editar</button><button class="delete-btn" type="button" data-wardrobe-delete="${item.id}">×</button></div></div>
  </article>`).join("") : `<div class="empty-state">Nenhuma roupa encontrada.</div>`;

  const groups = document.querySelector("#wardrobe-selection-groups");
  groups.innerHTML = wardrobeCategories.map((category) => {
    const items = state.wardrobeItems.filter((item) => item.category === category.id);
    return `<section><div><h4>${category.label}</h4><span>${category.optional ? "Opcional" : "Obrigatório"}</span></div><div>${items.length ? items.map((item) => `<label class="wardrobe-select-piece"><input type="checkbox" data-wardrobe-select="${item.id}" ${state.wardrobeSelection.includes(item.id) ? "checked" : ""} /><span>${item.image ? `<img src="${item.image}" alt="" />` : "👕"}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.color)}</small></label>`).join("") : `<p>Nenhuma peça cadastrada.</p>`}</div></section>`;
  }).join("");

  const generated = getGeneratedWardrobeLooks();
  document.querySelector("#wardrobe-item-count").textContent = state.wardrobeItems.length;
  document.querySelector("#wardrobe-look-count").textContent = generated.length;
  document.querySelector("#wardrobe-saved-count").textContent = state.wardrobeLooks.length;
  document.querySelector("#wardrobe-generated-total").textContent = `${generated.length} ${generated.length === 1 ? "combinação" : "combinações"}`;
  document.querySelector("#wardrobe-generated-looks").innerHTML = generated.length
    ? generated.map((pieceIds, index) => wardrobeLookCard(pieceIds.map((id) => state.wardrobeItems.find((item) => item.id === id)).filter(Boolean), `<button type="button" data-wardrobe-save-look="${index}">Salvar look</button><button type="button" data-wardrobe-favorite-generated="${index}">☆ Favoritar</button>`)).join("")
    : `<div class="empty-state">Selecione pelo menos uma parte de cima, uma parte de baixo e um calçado.</div>`;

  const favoritesOnly = document.querySelector("#wardrobe-favorites-only").checked;
  const savedLooks = state.wardrobeLooks.filter((look) => !favoritesOnly || look.favorite);
  document.querySelector("#wardrobe-saved-looks").innerHTML = savedLooks.length
    ? savedLooks.map((look) => wardrobeLookCard(look.pieces.map((id) => state.wardrobeItems.find((item) => item.id === id)).filter(Boolean), `<button type="button" data-wardrobe-favorite-look="${look.id}">${look.favorite ? "★ Favorito" : "☆ Favoritar"}</button><button class="delete-btn" type="button" data-wardrobe-delete-look="${look.id}">×</button>`)).join("")
    : `<div class="empty-state">Nenhum look salvo.</div>`;
}

function resizeImageFile(file, size = 720, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("error", reject);
      image.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", quality));
      });
      image.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

function buildSearchItems() {
  return [
    ...state.tasks.map((item) => ({ section: "tasks", label: item.title, detail: `Tarefa • ${item.priority}` })),
    ...state.pending.map((item) => ({ section: "pending", label: item.title, detail: `Pendência • ${item.type}` })),
    ...state.market.map((item) => ({ section: "market", label: item.name, detail: `Mercado • ${item.bought ? "comprado" : "pendente"}` })),
    ...state.personal.goals.map((item) => ({ section: "personal", label: item.title, detail: `Meta pessoal • ${item.area}` })),
    ...state.personal.docs.map((item) => ({ section: "personal", label: item.title, detail: `Documento/link • ${item.value || "sem detalhe"}` })),
    ...state.wishlist.map((item) => ({ section: "wishlist", label: item.name, detail: `Compra futura • ${item.priority}` })),
    ...state.agenda.map((item) => ({ section: "agenda", label: item.title, detail: `Agenda • ${formatDate(item.date)}` })),
    ...state.wins.map((item) => ({ section: "wins", label: item.title, detail: `Conquista • ${formatDate(item.date)}` })),
    ...state.wardrobeItems.map((item) => ({ section: "wardrobe", label: item.name, detail: `Guarda-Roupa • ${wardrobeCategoryLabel(item.category)} • ${item.color}` })),
    ...state.notes.map((item) => ({ section: "quick-notes", label: item.text, detail: `Nota • ${item.date}` })),
    ...state.finance.map((item) => ({ section: "finance", label: item.title, detail: `Financeiro • ${item.category} • ${formatDate(item.dueDate)}` })),
  ];
}

function renderSearch(query = "", targetSelector = "#search-results", limit = 30) {
  const results = document.querySelector(targetSelector);
  const normalized = query.trim().toLowerCase();
  const items = buildSearchItems().filter((item) => !normalized || `${item.label} ${item.detail}`.toLowerCase().includes(normalized));

  if (!results) return;
  results.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nada encontrado.";
    results.append(empty);
    return;
  }

  items.slice(0, limit).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.searchOpen = item.section;
    button.innerHTML = `<strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.detail)}</span>`;
    results.append(button);
  });
}

function renderTodaySummary() {
  const box = document.querySelector("#today-summary");
  const today = todayISO();
  const openTasks = state.tasks.filter((item) => !item.done).length;
  const openPending = state.pending.filter((item) => !item.done).length;
  const todayAgenda = state.agenda.filter((item) => item.date === today && !item.done).length;
  const todayFinance = state.finance.filter((item) => item.dueDate <= today && !item.done).length
    + state.fixedCosts.filter((item) => !isBudgetPaid(item) && getFixedCostDueDate(item) <= today).length
    + state.variableCosts.filter((item) => !isBudgetPaid(item) && item.dueDate <= today).length;
  const market = state.market.filter((item) => !item.bought).length;
  const routineDone = state.routine.filter((item) => item.done).length;
  const routinePercent = state.routine.length ? Math.round((routineDone / state.routine.length) * 100) : 0;

  box.innerHTML = `
    <article><span>Tarefas abertas</span><strong>${openTasks}</strong></article>
    <article><span>Pendências abertas</span><strong>${openPending}</strong></article>
    <article><span>Agenda de hoje</span><strong>${todayAgenda}</strong></article>
    <article><span>Financeiro hoje</span><strong>${todayFinance}</strong></article>
    <article><span>Compras pendentes</span><strong>${market}</strong></article>
    <article><span>Rotina concluída</span><strong>${routinePercent}%</strong></article>
  `;
}

function renderNotes() {
  const list = document.querySelector("#notes-list");
  list.innerHTML = "";
  if (!state.notes.length) {
    list.innerHTML = `<div class="empty-state notes-empty">Nenhuma anotação salva ainda.</div>`;
    return;
  }
  state.notes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.innerHTML = `
      <div class="note-card-top">
        <span>Nota rápida</span>
        <small>${escapeHtml(note.date)}</small>
      </div>
      <p>${escapeHtml(note.text)}</p>
      <div class="note-card-actions">
        <button class="edit-btn" type="button" data-generic-edit="note:${note.id}">Editar</button>
        <button class="delete-btn" type="button" data-note-delete="${note.id}">Excluir</button>
      </div>
    `;
    list.append(card);
  });
}

function renderRoutine() {
  const types = ["required", "endday", "day", "weekly"];
  const emptyText = {
    required: "Nenhum obrigatório cadastrado.",
    endday: "Nada no fim do dia por enquanto.",
    day: "Nenhuma ação do dia cadastrada.",
    weekly: "Nenhum item semanal cadastrado.",
  };

  types.forEach((type) => {
    const list = document.querySelector(`#routine-${type}`);
    const items = state.routine.filter((item) => item.type === type);
    list.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = emptyText[type];
      list.append(empty);
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = `routine-item ${item.done ? "done" : ""}`;
      row.innerHTML = `
        <button class="check-btn ${item.done ? "active" : ""}" type="button" data-routine-check="${item.id}">✓</button>
        <strong>${item.title}</strong>
        <button class="edit-btn" type="button" data-generic-edit="routine:${item.id}">Editar</button>
        <button class="delete-btn" type="button" data-routine-delete="${item.id}">×</button>
      `;
      list.append(row);
    });
  });
}

function renderRoutineDashboardLegacy() {
  const tracker = state.routineTracker;
  const habits = state.routine.filter((item) => !/água|agua/i.test(item.title));
  const waterDone = tracker.waterMl >= tracker.waterGoalMl;
  const doneCount = habits.filter((item) => item.done).length + (waterDone ? 1 : 0);
  const totalCount = habits.length + 1;
  const progress = Math.round((doneCount / Math.max(1, totalCount)) * 100);
  tracker.history[todayISO()] = progress;

  document.querySelector("#routine-progress-percent").textContent = `${progress}%`;
  document.querySelector("#routine-progress-title").textContent = `${doneCount} de ${totalCount} hábitos concluídos`;
  document.querySelector("#routine-progress-message").textContent = progress === 100
    ? "Dia completo. Excelente trabalho."
    : progress >= 70 ? "Continue assim. Você está perto de vencer o dia." : "Cada hábito concluído aproxima você da meta.";
  document.querySelector("#routine-progress-bar").style.width = `${progress}%`;
  document.querySelector("#routine-progress-ring").style.background = `conic-gradient(#f3bd36 ${progress}%, rgba(255,255,255,.09) 0)`;
  document.querySelector("#routine-done-count").textContent = doneCount;
  document.querySelector("#routine-open-count").textContent = Math.max(0, totalCount - doneCount);
  document.querySelector("#routine-total-count").textContent = totalCount;
  document.querySelector("#routine-score").textContent = `${progress}%`;

  const historyDates = Object.entries(tracker.history).sort(([a], [b]) => b.localeCompare(a));
  let currentStreak = 0;
  for (const [, score] of historyDates) {
    if (score < 100) break;
    currentStreak += 1;
  }
  const perfectDates = historyDates.filter(([, score]) => score === 100).map(([date]) => date).sort();
  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate = "";
  perfectDates.forEach((date) => {
    runningStreak = previousDate && addDays(previousDate, 1) === date ? runningStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, runningStreak);
    previousDate = date;
  });
  tracker.bestStreak = Math.max(tracker.bestStreak || 0, bestStreak);
  document.querySelector("#routine-current-streak").textContent = `${currentStreak} dias`;
  document.querySelector("#routine-best-streak").textContent = `${tracker.bestStreak} dias`;

  document.querySelector("#routine-water-label").textContent = `${(tracker.waterMl / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}L / ${(tracker.waterGoalMl / 1000).toLocaleString("pt-BR")}L`;
  document.querySelector("#routine-water-drops").innerHTML = Array.from({ length: 6 }, (_, index) =>
    `<span class="${tracker.waterMl >= (index + 1) * 500 ? "filled" : ""}">●</span>`
  ).join("");

  const monthKey = todayISO().slice(0, 7);
  const [calendarYear, calendarMonth] = monthKey.split("-").map(Number);
  const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
  document.querySelector("#routine-calendar-title").textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(calendarYear, calendarMonth - 1, 1));
  const calendar = document.querySelector("#routine-calendar-grid");
  calendar.innerHTML = "";
  Array.from({ length: firstDay }).forEach(() => calendar.append(document.createElement("span")));
  Array.from({ length: daysInMonth(monthKey) }, (_, index) => {
    const date = `${monthKey}-${String(index + 1).padStart(2, "0")}`;
    const score = tracker.history[date];
    const day = document.createElement("span");
    day.className = score === undefined ? "future" : score >= 100 ? "complete" : score >= 50 ? "partial" : "missed";
    day.title = `${formatDate(date)}: ${score ?? 0}%`;
    day.textContent = index + 1;
    calendar.append(day);
  });

  const labels = {
    required: ["Essenciais", "Hábitos básicos de todos os dias."],
    endday: ["Saúde", "Exercícios e cuidados pessoais."],
    day: ["Produtividade", "Trabalho e ações importantes."],
    weekly: ["Semana", "Hábitos que acontecem durante a semana."],
  };
  Object.entries(labels).forEach(([type, [label, description]]) => {
    const list = document.querySelector(`#routine-${type}`);
    const items = habits.filter((item) => item.type === type);
    const section = list.closest(".routine-section");
    section.querySelector("h3").textContent = label;
    section.querySelector("p").textContent = description;
    section.dataset.progress = `${items.filter((item) => item.done).length}/${items.length}`;
    list.innerHTML = items.length ? "" : `<div class="empty-state">Nenhum hábito cadastrado.</div>`;
    items.forEach((item) => {
      const icon = /café|cafe/i.test(item.title) ? "☕" : /almoço|janta|lanche|sobremesa/i.test(item.title) ? "🍽" : /fruta/i.test(item.title) ? "🍎" : /academia/i.test(item.title) ? "🏋" : /correr/i.test(item.title) ? "🏃" : /luta/i.test(item.title) ? "🥊" : /sol/i.test(item.title) ? "☀" : /trabalh/i.test(item.title) ? "💼" : /b12|remédio|remedio/i.test(item.title) ? "💊" : "✓";
      const row = document.createElement("article");
      row.className = `routine-item ${item.done ? "done" : ""}`;
      row.innerHTML = `
        <button class="check-btn ${item.done ? "active" : ""}" type="button" data-routine-check="${item.id}">✓</button>
        <span class="routine-item-icon">${icon}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <button class="edit-btn" type="button" data-generic-edit="routine:${item.id}">Editar</button>
        <button class="delete-btn" type="button" data-routine-delete="${item.id}">×</button>
      `;
      list.append(row);
    });
  });
}

function getRoutinePeriodStats(tracker, habits, selectedDate, viewMode) {
  if (viewMode === "day") {
    const dailyHistory = tracker.habitHistory?.[selectedDate] || {};
    const done = habits.filter((item) => Boolean(dailyHistory[item.id])).length
      + (dailyHistory.__water ? 1 : 0);
    const total = habits.length + 1;
    const inProgress = selectedDate === todayISO()
      ? habits.filter((item) => !item.done && /sol|trabalh|sair|projeto/i.test(item.title)).length
        + (tracker.waterMl > 0 && tracker.waterMl < tracker.waterGoalMl ? 1 : 0)
      : 0;
    return {
      done,
      inProgress,
      pending: Math.max(0, total - done - inProgress),
      total,
      progress: Math.round((done / Math.max(1, total)) * 100),
      label: "hábitos",
    };
  }

  const prefix = viewMode === "year" ? selectedDate.slice(0, 4) : selectedDate.slice(0, 7);
  const scores = Object.entries(tracker.history || {})
    .filter(([date]) => date.startsWith(prefix))
    .map(([, score]) => Number(score || 0));
  const done = scores.filter((score) => score >= 100).length;
  const inProgress = scores.filter((score) => score > 0 && score < 100).length;
  const pending = scores.filter((score) => score <= 0).length;
  return {
    done,
    inProgress,
    pending,
    total: scores.length,
    progress: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    label: "dias registrados",
  };
}

function updateRoutineHistoryScoreForDate(date) {
  const tracker = state.routineTracker;
  const habits = getRoutineHabits();
  tracker.habitHistory ||= {};
  tracker.habitHistory[date] ||= {};
  const dailyHistory = tracker.habitHistory[date];
  const done = habits.filter((item) => Boolean(dailyHistory[item.id])).length + (dailyHistory.__water ? 1 : 0);
  tracker.history[date] = Math.round((done / Math.max(1, habits.length + 1)) * 100);
}

function renderRoutineDashboard() {
  const tracker = state.routineTracker;
  ensureRoutineToday();
  const habits = getRoutineHabits();
  ensureRoutineDayRecord(todayISO());
  const selectedDate = tracker.selectedDate || todayISO();
  ensureRoutineDayRecord(selectedDate);
  const routineViewMode = tracker.viewMode || "day";
  const selected = new Date(`${selectedDate}T12:00:00`);
  const fullDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(selected);
  const selectedMonthKey = selectedDate.slice(0, 7);
  const selectedYear = selectedDate.slice(0, 4);
  const periodStats = getRoutinePeriodStats(tracker, habits, selectedDate, routineViewMode);
  const { done: doneCount, inProgress: progressCount, pending: pendingCount, total: totalCount, progress } = periodStats;
  const routineMonthInput = document.querySelector("#routine-month-input");
  routineMonthInput.value = selectedMonthKey;
  document.querySelector("#routine-period-label").textContent = routineViewMode === "year"
    ? selectedYear
    : routineViewMode === "month"
      ? new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(selected)
      : new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(selected);
  document.querySelector("#routine-toggle-view").textContent = routineViewMode === "day" ? "Ver mês" : routineViewMode === "month" ? "Ver ano" : "Ver dia";
  document.querySelector("#routine-date-subtitle").textContent = routineViewMode === "year"
    ? `Ano de ${selectedYear}`
    : routineViewMode === "month"
      ? new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(selected)
      : fullDate.charAt(0).toUpperCase() + fullDate.slice(1);
  document.querySelector(".routine-page-head h2").textContent = routineViewMode === "year"
    ? "Rotina do Ano"
    : routineViewMode === "month"
      ? "Rotina do Mês"
      : selectedDate === todayISO() ? "Rotina de Hoje" : "Rotina do Dia";
  document.querySelector(".routine-hero-copy > span").textContent = routineViewMode === "year"
    ? "Progresso do ano"
    : routineViewMode === "month"
      ? "Progresso do mês"
      : "Progresso do dia";
  document.querySelector("#routine-progress-percent").textContent = `${progress}%`;
  document.querySelector("#routine-progress-title").textContent = routineViewMode === "day"
    ? `${doneCount} de ${totalCount} hábitos concluídos`
    : `${doneCount} dias completos de ${totalCount} registrados`;
  document.querySelector("#routine-progress-message").textContent = progress === 100 ? "Dia completo. Excelente trabalho!" : progress >= 70 ? "Continue assim! Você está no caminho certo." : "Cada hábito concluído aproxima você da meta.";
  document.querySelector("#routine-progress-ring").style.background = `conic-gradient(#f5c542 ${progress}%, rgba(255,255,255,.09) 0)`;
  document.querySelector("#routine-done-count").textContent = doneCount;
  document.querySelector("#routine-progress-count").textContent = progressCount;
  document.querySelector("#routine-open-count").textContent = pendingCount;
  document.querySelector("#routine-total-count").textContent = totalCount;
  document.querySelector("#routine-total-count").nextElementSibling.textContent = periodStats.label;
  document.querySelector("#routine-score").textContent = `${progress}%`;
  document.querySelector("#routine-done-percent").textContent = `${progress}% do total`;
  document.querySelector("#routine-progress-percent-note").textContent = `${Math.round((progressCount / Math.max(1, totalCount)) * 100)}% do total`;
  document.querySelector("#routine-open-percent").textContent = `${Math.round((pendingCount / Math.max(1, totalCount)) * 100)}% do total`;
  document.querySelector("#routine-insight-score").textContent = `${progress}%`;
  document.querySelector("#routine-insight-done").textContent = doneCount;

  const historyDates = Object.entries(tracker.history).sort(([a], [b]) => b.localeCompare(a));
  let currentStreak = 0;
  for (const [, score] of historyDates) {
    if (score < 100) break;
    currentStreak += 1;
  }
  const perfectDates = historyDates.filter(([, score]) => score === 100).map(([date]) => date).sort();
  let bestStreak = 0;
  let runningStreak = 0;
  let previousDate = "";
  perfectDates.forEach((date) => {
    runningStreak = previousDate && addDays(previousDate, 1) === date ? runningStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, runningStreak);
    previousDate = date;
  });
  tracker.bestStreak = Math.max(tracker.bestStreak || 0, bestStreak);
  document.querySelector("#routine-current-streak").textContent = `${currentStreak} dias`;
  document.querySelector("#routine-best-streak").textContent = `${tracker.bestStreak} dias`;
  const perfectPeriodPrefix = routineViewMode === "year" ? selectedYear : routineViewMode === "month" ? selectedMonthKey : selectedDate;
  document.querySelector("#routine-perfect-days").textContent = perfectDates.filter((date) => date.startsWith(perfectPeriodPrefix)).length;
  document.querySelector("#routine-water-label").textContent = `${(tracker.waterMl / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}L / ${(tracker.waterGoalMl / 1000).toLocaleString("pt-BR")}L`;

  const monthKey = selectedMonthKey;
  const [calendarYear, calendarMonth] = monthKey.split("-").map(Number);
  const calendar = document.querySelector("#routine-calendar-grid");
  calendar.innerHTML = "";
  calendar.classList.toggle("routine-calendar-year-grid", routineViewMode === "year");
  document.querySelector(".routine-calendar-weekdays").hidden = routineViewMode === "year";
  if (routineViewMode === "year") {
    document.querySelector("#routine-calendar-title").textContent = selectedYear;
    Array.from({ length: 12 }, (_, index) => {
      const month = String(index + 1).padStart(2, "0");
      const yearMonth = `${selectedYear}-${month}`;
      const scores = Object.entries(tracker.history)
        .filter(([date]) => date.startsWith(yearMonth))
        .map(([, score]) => Number(score || 0));
      const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
      const monthButton = document.createElement("button");
      monthButton.type = "button";
      monthButton.dataset.routineCalendarMonth = yearMonth;
      monthButton.className = scores.length ? average >= 100 ? "complete" : average >= 50 ? "partial" : "missed" : "future";
      monthButton.innerHTML = `<strong>${new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(new Date(Number(selectedYear), index, 1))}</strong><small>${scores.length ? `${average}%` : "sem dados"}</small>`;
      calendar.append(monthButton);
    });
  } else {
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
    document.querySelector("#routine-calendar-title").textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(calendarYear, calendarMonth - 1, 1));
    Array.from({ length: firstDay }).forEach(() => calendar.append(document.createElement("span")));
    Array.from({ length: daysInMonth(monthKey) }, (_, index) => {
      const date = `${monthKey}-${String(index + 1).padStart(2, "0")}`;
      const score = tracker.history[date];
      const day = document.createElement("button");
      day.type = "button";
      day.dataset.routineCalendarDate = date;
      day.className = `${score === undefined ? "future" : score >= 100 ? "complete" : score >= 50 ? "partial" : "missed"}${date === selectedDate ? " selected" : ""}`;
      day.title = `${formatDate(date)}: ${score ?? 0}%`;
      day.textContent = index + 1;
      calendar.append(day);
    });
  }

  const selectedDayHistory = tracker.habitHistory?.[selectedDate] || {};
  const isSelectedToday = selectedDate === todayISO();
  const isItemDone = (item) => Boolean(selectedDayHistory[item.id]);
  const progressItems = isSelectedToday ? habits.filter((item) => !item.done && /sol|trabalh|sair|projeto/i.test(item.title)) : [];
  const displayWaterMl = isSelectedToday ? tracker.waterMl : selectedDayHistory.__water ? tracker.waterGoalMl : 0;
  const waterDone = displayWaterMl >= tracker.waterGoalMl;
  const groups = Object.fromEntries(state.routineCategories.map((category) => [
    category.id,
    habits.filter((item) => item.type === category.id),
  ]));
  Object.entries(groups).forEach(([type, items]) => {
    const list = document.querySelector(`#routine-${type}`);
    document.querySelector(`#routine-${type}-progress`).textContent = `${items.filter(isItemDone).length}/${items.length}`;
    list.innerHTML = items.length ? "" : `<div class="empty-state">Nenhum hábito cadastrado.</div>`;
    items.forEach((item) => {
      const done = isItemDone(item);
      const isProgress = !done && progressItems.some((progressItem) => progressItem.id === item.id);
      const row = document.createElement("article");
      row.className = `routine-item ${done ? "done" : isProgress ? "in-progress" : "pending"}`;
      row.draggable = true;
      row.dataset.routineHabitDrag = item.id;
      row.innerHTML = `<span class="routine-item-icon">${escapeHtml(item.emoji || inferRoutineEmoji(item.title))}</span><strong>${escapeHtml(item.title)}</strong>${type === "weekly" ? `<small>${/b12/i.test(item.title) ? "Sáb" : "Dom"}</small>` : ""}<button class="routine-status-dot" type="button" data-routine-check="${item.id}" title="Alterar status">${done ? "✓" : ""}</button><button class="routine-item-edit" type="button" data-generic-edit="routine:${item.id}" title="Editar">⋮</button>`;
      list.append(row);
    });
  });

  const waterRow = document.createElement("article");
  waterRow.className = `routine-item routine-water-row ${waterDone ? "done" : displayWaterMl ? "in-progress" : "pending"}`;
  waterRow.draggable = true;
  waterRow.dataset.routineHabitDrag = "__water";
  waterRow.innerHTML = `<span class="routine-item-icon">💧</span><strong>Água</strong><button type="button" data-routine-water-less>-500ml</button><span class="routine-water-visual">${Array.from({ length: 6 }, (_, index) => `<i class="${displayWaterMl >= (index + 1) * 500 ? "filled" : ""}">●</i>`).join("")}</span><small>${(displayWaterMl / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}L / ${(tracker.waterGoalMl / 1000).toLocaleString("pt-BR")}L</small><button type="button" data-routine-water-more>+500ml</button>`;
  const waterType = tracker.waterType || "required";
  const waterTarget = document.querySelector(`#routine-${waterType}`) || document.querySelector("#routine-required");
  waterTarget.append(waterRow);
  const waterGroupItems = groups[waterType] || groups.required;
  document.querySelector(`#routine-${waterType}-progress`).textContent = `${waterGroupItems.filter(isItemDone).length + (waterDone ? 1 : 0)}/${waterGroupItems.length + 1}`;

  const trackedDates = Object.keys(tracker.habitHistory || {})
    .filter((date) => date >= (tracker.consistencyStartDate || todayISO()) && date <= todayISO())
    .sort();
  const consistent = habits
    .map((item) => {
      const totals = trackedDates.reduce((acc, date) => {
        const dailyHistory = tracker.habitHistory?.[date] || {};
        if (!Object.prototype.hasOwnProperty.call(dailyHistory, item.id)) return acc;
        return {
          done: acc.done + (dailyHistory[item.id] ? 1 : 0),
          total: acc.total + 1,
        };
      }, { done: 0, total: 0 });
      return {
        title: item.title,
        percent: totals.total ? Math.round((totals.done / totals.total) * 100) : 0,
        done: totals.done,
        total: totals.total,
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.done - a.done || a.title.localeCompare(b.title, "pt-BR"))
    .slice(0, 4);
  document.querySelector("#routine-consistency-list").innerHTML = consistent.length
    ? consistent.map(({ title, percent, done, total }) => `<article><div class="routine-mini-ring" style="--routine-percent:${percent}%"><strong>${percent}%</strong></div><div><strong>${escapeHtml(title)}</strong><small>${done}/${total} ${total === 1 ? "dia" : "dias"}</small></div></article>`).join("")
    : `<div class="empty-state">A consistência começa a ser calculada a partir de hoje.</div>`;
  document.querySelector("#routine-due-list").innerHTML = `<article><span>⏱</span><strong>B12 1 semana</strong><small>Sábado</small></article><article><span>▣</span><strong>Limpeza geral</strong><small>Domingo</small></article>`;
}

let suppressNextNavClick = false;

navButtons.forEach((button) => button.addEventListener("click", (event) => {
  if (suppressNextNavClick) {
    event.preventDefault();
    return;
  }
  openSection(button.dataset.section);
}));

const sideNav = document.querySelector(".side-nav");
let draggedNavButton = null;
let pointerNavButton = null;
let pointerNavStart = null;
let pointerNavDragging = false;

function readNavLayoutFromDom() {
  state.navOrder = [...sideNav.querySelectorAll("button")].map((button) => button.dataset.section);
  state.navGroups = [...sideNav.querySelectorAll(".nav-items")].reduce((groups, list) => {
    list.querySelectorAll("button").forEach((button) => {
      groups[button.dataset.section] = list.dataset.navGroupItems;
    });
    return groups;
  }, {});
}

function moveNavButtonAtPoint(button, clientX, clientY) {
  button.classList.add("nav-pointer-dragging");
  const element = document.elementFromPoint(clientX, clientY);
  button.classList.remove("nav-pointer-dragging");
  const target = element?.closest?.(".side-nav button");
  const targetList = target?.closest(".nav-items") || element?.closest?.(".nav-items");
  if (!targetList) return;
  document.querySelectorAll(".nav-items").forEach((list) => {
    list.classList.toggle("nav-drop-target", list === targetList);
  });
  if (!target || target === button) {
    targetList.append(button);
    return;
  }
  const insertAfter = clientY > target.getBoundingClientRect().top + target.offsetHeight / 2;
  targetList.insertBefore(button, insertAfter ? target.nextSibling : target);
}

navButtons.forEach((button) => {
  button.draggable = true;

  button.addEventListener("dragstart", (event) => {
    draggedNavButton = button;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", button.dataset.section);
    requestAnimationFrame(() => button.classList.add("nav-dragging"));
  });

  button.addEventListener("dragend", () => {
    draggedNavButton?.classList.remove("nav-dragging");
    sideNav.classList.remove("nav-drag-active");
    document.querySelectorAll(".nav-items.nav-drop-target").forEach((list) => {
      list.classList.remove("nav-drop-target");
    });
    draggedNavButton = null;
  });

  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.button !== 0) return;
    pointerNavButton = button;
    pointerNavStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    pointerNavDragging = false;
    button.setPointerCapture?.(event.pointerId);
  });
});

document.addEventListener("pointermove", (event) => {
  if (!pointerNavButton || event.pointerId !== pointerNavStart?.pointerId) return;
  const distance = Math.hypot(event.clientX - pointerNavStart.x, event.clientY - pointerNavStart.y);
  if (!pointerNavDragging && distance < 8) return;
  if (!pointerNavDragging) {
    rememberUndo();
    pointerNavDragging = true;
    sideNav.classList.add("nav-drag-active");
    pointerNavButton.classList.add("nav-dragging");
  }
  event.preventDefault();
  moveNavButtonAtPoint(pointerNavButton, event.clientX, event.clientY);
}, { passive: false });

function finishPointerNavDrag(event) {
  if (!pointerNavButton || event.pointerId !== pointerNavStart?.pointerId) return;
  pointerNavButton.releasePointerCapture?.(event.pointerId);
  pointerNavButton.classList.remove("nav-dragging", "nav-pointer-dragging");
  document.querySelectorAll(".nav-items.nav-drop-target").forEach((list) => {
    list.classList.remove("nav-drop-target");
  });
  sideNav.classList.remove("nav-drag-active");
  if (pointerNavDragging) {
    readNavLayoutFromDom();
    commitChange();
    updateUndoButton();
    suppressNextNavClick = true;
    setTimeout(() => {
      suppressNextNavClick = false;
    }, 120);
  }
  pointerNavButton = null;
  pointerNavStart = null;
  pointerNavDragging = false;
}

document.addEventListener("pointerup", finishPointerNavDrag);
document.addEventListener("pointercancel", finishPointerNavDrag);

sideNav.addEventListener("dragover", (event) => {
  if (!draggedNavButton) return;
  event.preventDefault();
  sideNav.classList.add("nav-drag-active");
  const target = event.target.closest(".side-nav button");
  const targetList = target?.closest(".nav-items") || event.target.closest(".nav-items");
  if (!targetList) return;
  document.querySelectorAll(".nav-items").forEach((list) => {
    list.classList.toggle("nav-drop-target", list === targetList);
  });
  if (!target || target === draggedNavButton) {
    targetList.append(draggedNavButton);
    return;
  }
  const insertAfter = event.clientY > target.getBoundingClientRect().top + target.offsetHeight / 2;
  targetList.insertBefore(draggedNavButton, insertAfter ? target.nextSibling : target);
});

sideNav.addEventListener("drop", (event) => {
  if (!draggedNavButton) return;
  event.preventDefault();
  rememberUndo();
  readNavLayoutFromDom();
  commitChange();
  updateUndoButton();
});

document.querySelectorAll("[data-section-shortcut]").forEach((button) => {
  button.addEventListener("click", () => openSection(button.dataset.sectionShortcut));
});

document.querySelector(".menu-toggle").addEventListener("click", () => sidebar.classList.toggle("open"));
const themeToggleButton = document.querySelector("#theme-toggle");
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}
document.querySelector("#nav-edit-btn").addEventListener("click", () => {
  renderNavEditor();
  document.querySelector("#nav-edit-panel").classList.add("open");
  document.querySelector("#nav-edit-panel").setAttribute("aria-hidden", "false");
});
document.querySelector("#emoji-picker-grid").innerHTML = routineEmojiOptions
  .map((emoji) => `<button type="button" data-emoji-value="${emoji}" title="Usar ${emoji}">${emoji}</button>`)
  .join("");
document.querySelector("#emoji-picker-close").addEventListener("click", closeEmojiPicker);

const loginButton = document.querySelector("#login-btn");
if (loginButton) {
  loginButton.addEventListener("click", () => {
    if (!isSupabaseConfigured()) {
      openLoginPanel("Configure o arquivo supabase-config.js com a URL e anon key do seu projeto.");
      return;
    }
    openLoginPanel();
  });
}

document.querySelector("#login-saved-user").addEventListener("click", async () => {
  if (!currentUser) return;
  allowAuthAutoEnter = true;
  setAuthGate(false);
  closeLoginPanel();
  await loadRemoteState();
});

document.querySelector("#login-use-other").addEventListener("click", async () => {
  document.querySelector("#login-email").value = "";
  document.querySelector("#login-password").value = "";
  document.querySelector("#login-email").focus();
  document.querySelector("#login-message").textContent = "Entre com outra conta para trocar o acesso.";
});

document.querySelector("#nav-edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  rememberUndo();
  document.querySelectorAll("[data-nav-group-label]").forEach((input) => {
    state.navGroupLabels[input.dataset.navGroupLabel] = input.value.trim();
  });
  document.querySelectorAll("[data-nav-icon]").forEach((input) => {
    const section = input.dataset.navIcon;
    state.navIcons[section] = input.value.trim() || defaultNavMeta[section]?.icon || "•";
  });
  document.querySelectorAll("[data-nav-label]").forEach((input) => {
    const section = input.dataset.navLabel;
    state.navLabels[section] = input.value.trim() || defaultNavMeta[section]?.label || section;
  });
  commitChange();
  document.querySelector("#nav-edit-panel").classList.remove("open");
  document.querySelector("#nav-edit-panel").setAttribute("aria-hidden", "true");
});

document.querySelector("#nav-edit-reset").addEventListener("click", () => {
  rememberUndo();
  state.navLabels = { ...defaultState.navLabels };
  state.navIcons = { ...defaultState.navIcons };
  state.navGroupLabels = { ...defaultState.navGroupLabels };
  commitChange();
  renderNavEditor();
});

document.querySelector("#logout-btn").addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  updateAuthButtons();
  setAuthGate(true);
  setSyncStatus("Local", "local");
  openLoginPanel("Entre para acessar o painel online.");
});

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!initSupabaseClient()) {
    openLoginPanel("Configure o arquivo supabase-config.js antes de entrar.");
    return;
  }

  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value;
  const rememberLogin = document.querySelector("#login-remember").checked;
  const message = document.querySelector("#login-message");
  localStorage.setItem(authRememberKey, rememberLogin ? "true" : "false");
  message.textContent = "Entrando...";

  allowAuthAutoEnter = true;
  let result = await supabaseClient.auth.signInWithPassword({ email, password });

  if (result.error) {
    result = await supabaseClient.auth.signUp({ email, password });
  }

  if (result.error) {
    message.textContent = result.error.message;
    setSyncStatus("Erro login", "error");
    return;
  }

  currentUser = result.data.session?.user || result.data.user || null;
  updateAuthButtons();

  if (!result.data.session) {
    message.textContent = "Conta criada. Confirme o e-mail se o Supabase pedir confirmação.";
    setSyncStatus("Verifique email", "local");
    return;
  }

  setAuthGate(false);
  closeLoginPanel();
  await loadRemoteState();
  if (!rememberLogin) {
    window.addEventListener("beforeunload", () => {
      supabaseClient?.auth.signOut();
    }, { once: true });
  }
});

const avatarBtn = document.querySelector("#avatar-button") || document.querySelector("#dropdown-change-avatar");
if (avatarBtn) avatarBtn.addEventListener("click", () => {
  document.querySelector("#avatar-input").click();
});

document.querySelector("#avatar-input").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const image = new Image();
    image.addEventListener("load", () => {
      const size = 320;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
      const sourceX = (image.naturalWidth - sourceSize) / 2;
      const sourceY = (image.naturalHeight - sourceSize) / 2;
      context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
      rememberUndo();
      state.profilePhoto = canvas.toDataURL("image/jpeg", 0.82);
      event.target.value = "";
      commitChange();
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
});

const undoBtn = document.querySelector("#undo-btn");
if (undoBtn) undoBtn.addEventListener("click", () => {
  const previous = undoStack.pop();
  if (!previous) return;
  state = previous;
  saveState();
  render();
  updateUndoButton();
});

document.querySelector("#task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#task-input");
  const priority = document.querySelector("#task-priority");
  if (!input.value.trim()) return;
  rememberUndo();
  state.tasks.unshift({ id: crypto.randomUUID(), title: input.value.trim(), priority: priority.value, done: false });
  input.value = "";
  commitChange();
});

document.querySelector("#pending-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#pending-input");
  const type = document.querySelector("#pending-type");
  if (!input.value.trim()) return;
  rememberUndo();
  state.pending.unshift({ id: crypto.randomUUID(), title: input.value.trim(), type: type.value, done: false, subtasks: [] });
  input.value = "";
  commitChange();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-subtask-form]");
  if (!form) return;
  event.preventDefault();
  const taskId = form.dataset.subtaskForm;
  const input = form.querySelector("input");
  if (!input.value.trim()) return;
  rememberUndo();
  state.pending = state.pending.map((task) => task.id === taskId ? {
    ...task,
    subtasks: [
      ...task.subtasks,
      { id: crypto.randomUUID(), title: input.value.trim(), done: false },
    ],
  } : task);
  input.value = "";
  commitChange();
});

document.querySelector("#market-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#market-name");
  const category = document.querySelector("#market-category");
  const qty = Number(document.querySelector("#market-qty").value || 1);
  const price = Number(document.querySelector("#market-price").value || 0);
  if (!name.value.trim()) return;
  rememberUndo();
  state.market.unshift({ id: crypto.randomUUID(), name: name.value.trim(), category: category.value, qty, price, shopQty: qty, shopPrice: price, bought: false, inCart: false });
  name.value = "";
  document.querySelector("#market-qty").value = 1;
  document.querySelector("#market-price").value = "";
  commitChange();
});

document.querySelector("#market-shop-toggle").addEventListener("click", () => {
  marketShopMode = !marketShopMode;
  renderMarket();
});

document.querySelector("#market-shop-clear").addEventListener("click", () => {
  rememberUndo();
  state.market = state.market.map((item) => ({ ...item, inCart: false }));
  commitChange();
});

document.querySelector("#market-shop-finish").addEventListener("click", () => {
  const pickedItems = state.market.filter((item) => item.inCart);
  if (!pickedItems.length) return;
  rememberUndo();
  state.market = state.market.map((item) => item.inCart ? {
    ...item,
    qty: getMarketShopQty(item),
    price: getMarketShopPrice(item),
    bought: true,
    inCart: false,
  } : item);
  commitChange();
});

document.querySelector("#personal-save-btn")?.addEventListener("click", () => {
  rememberUndo();
  state.personal.info = {
    name: document.querySelector("#personal-name")?.value.trim() || "",
    phone: document.querySelector("#personal-phone")?.value.trim() || "",
    email: document.querySelector("#personal-email")?.value.trim() || "",
    address: document.querySelector("#personal-address")?.value.trim() || "",
    notes: document.querySelector("#personal-notes")?.value.trim() || "",
  };
  commitChange();
});

document.querySelector("#personal-goal-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#personal-goal-title");
  const area = document.querySelector("#personal-goal-area");
  if (!title?.value.trim()) return;
  rememberUndo();
  state.personal.goals.unshift({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    area: area.value,
    done: false,
  });
  title.value = "";
  commitChange();
});

document.querySelector("#personal-doc-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#personal-doc-title");
  const value = document.querySelector("#personal-doc-value");
  if (!title?.value.trim()) return;
  rememberUndo();
  state.personal.docs.unshift({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    value: value.value.trim(),
    done: false,
  });
  title.value = "";
  value.value = "";
  commitChange();
});

document.querySelector("#wishlist-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#wishlist-name");
  const category = document.querySelector("#wishlist-category");
  const priority = document.querySelector("#wishlist-priority");
  const price = Number(document.querySelector("#wishlist-price").value || 0);
  const link = document.querySelector("#wishlist-link");
  if (!name.value.trim()) return;
  rememberUndo();
  state.wishlist.unshift({
    id: crypto.randomUUID(),
    name: name.value.trim(),
    category: category.value,
    priority: priority.value,
    price,
    link: link.value.trim(),
    bought: false,
  });
  name.value = "";
  document.querySelector("#wishlist-price").value = "";
  link.value = "";
  commitChange();
});

document.querySelector("#routine-add-habit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#routine-add-habit-name");
  const emojiInput = document.querySelector("#routine-add-habit-emoji");
  const type = document.querySelector("#routine-add-habit-type").value;
  if (!input.value.trim()) return;
  rememberUndo();
  state.routine.unshift({ id: crypto.randomUUID(), title: input.value.trim(), emoji: emojiInput.value.trim() || inferRoutineEmoji(input.value.trim()), type, done: false });
  input.value = "";
  emojiInput.value = "";
  document.querySelector("#routine-add-habit-panel").classList.remove("open");
  document.querySelector("#routine-add-habit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#routine-add-card-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#routine-add-card-name");
  const name = input.value.trim();
  if (!name) return;
  const id = `custom-${crypto.randomUUID()}`;
  rememberUndo();
  state.routineCategories.push({ id, name, locked: false });
  state.routineLayout.push(id);
  input.value = "";
  document.querySelector("#routine-add-card-panel").classList.remove("open");
  document.querySelector("#routine-add-card-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#routine-water-more").addEventListener("click", () => {
  rememberUndo();
  const selectedDate = state.routineTracker.selectedDate || todayISO();
  if (selectedDate === todayISO()) {
    state.routineTracker.waterMl = Math.min(state.routineTracker.waterGoalMl, state.routineTracker.waterMl + 500);
    ensureRoutineDayRecord(selectedDate).__water = state.routineTracker.waterMl >= state.routineTracker.waterGoalMl;
  } else {
    setRoutineDayWater(selectedDate, true);
  }
  commitChange();
});

document.querySelector("#routine-water-less").addEventListener("click", () => {
  rememberUndo();
  const selectedDate = state.routineTracker.selectedDate || todayISO();
  if (selectedDate === todayISO()) {
    state.routineTracker.waterMl = Math.max(0, state.routineTracker.waterMl - 500);
    ensureRoutineDayRecord(selectedDate).__water = state.routineTracker.waterMl >= state.routineTracker.waterGoalMl;
  } else {
    setRoutineDayWater(selectedDate, false);
  }
  commitChange();
});

document.querySelector("#routine-new-item").addEventListener("click", () => {
  document.querySelector("#routine-add-card-panel").classList.add("open");
  document.querySelector("#routine-add-card-panel").setAttribute("aria-hidden", "false");
  document.querySelector("#routine-add-card-name").focus();
});

document.querySelector("#routine-add-card").addEventListener("click", () => {
  document.querySelector("#routine-add-card-panel").classList.add("open");
  document.querySelector("#routine-add-card-panel").setAttribute("aria-hidden", "false");
  document.querySelector("#routine-add-card-name").focus();
});

function moveRoutinePeriod(direction) {
  rememberUndo();
  const selectedDate = state.routineTracker.selectedDate || todayISO();
  const viewMode = state.routineTracker.viewMode || "day";
  if (viewMode === "day") {
    state.routineTracker.selectedDate = addDays(selectedDate, direction);
  } else if (viewMode === "year") {
    const [year, month, day] = selectedDate.split("-").map(Number);
    state.routineTracker.selectedDate = dateToISO(new Date(year + direction, month - 1, day));
  } else {
    state.routineTracker.selectedDate = addMonthsToDate(selectedDate, direction);
    state.routineTracker.viewMode = "month";
  }
  commitChange();
}

document.querySelector("#routine-date-prev").addEventListener("click", () => moveRoutinePeriod(-1));

document.querySelector("#routine-date-next").addEventListener("click", () => moveRoutinePeriod(1));

document.querySelector("#routine-toggle-view").addEventListener("click", () => {
  rememberUndo();
  const currentMode = state.routineTracker.viewMode || "day";
  state.routineTracker.viewMode = currentMode === "day" ? "month" : currentMode === "month" ? "year" : "day";
  commitChange();
});

document.querySelector("#routine-month-input").addEventListener("change", (event) => {
  if (!event.target.value) return;
  rememberUndo();
  const currentDay = String(state.routineTracker.selectedDate || todayISO()).slice(8, 10) || "01";
  state.routineTracker.selectedDate = `${event.target.value}-${String(Math.min(Number(currentDay), daysInMonth(event.target.value))).padStart(2, "0")}`;
  state.routineTracker.viewMode = "month";
  commitChange();
});

document.querySelectorAll("[data-routine-expand]").forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest(".routine-section");
    if (!section) {
      const insights = button.closest(".routine-insights");
      if (!insights) return;
      insights.classList.toggle("expanded");
      button.textContent = insights.classList.contains("expanded") ? "Fechar relatório" : "Ver relatório completo";
      return;
    }
    section.classList.toggle("expanded");
    button.textContent = section.classList.contains("expanded") ? "Mostrar menos" : "Ver todos";
  });
});

document.querySelector("#home-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#home-title");
  if (!input.value.trim()) return;
  rememberUndo();
  state.homeItems.push({ id: crypto.randomUUID(), title: input.value.trim(), done: false, photo: "" });
  input.value = "";
  commitChange();
});

document.querySelector("#wardrobe-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#wardrobe-name");
  const photoInput = document.querySelector("#wardrobe-photo");
  if (!name.value.trim()) return;
  const file = photoInput.files?.[0];
  const image = file ? await resizeImageFile(file, 640, 0.8) : "";
  rememberUndo();
  state.wardrobeItems.unshift({
    id: crypto.randomUUID(),
    name: name.value.trim(),
    category: document.querySelector("#wardrobe-category").value,
    color: document.querySelector("#wardrobe-color").value.trim(),
    style: document.querySelector("#wardrobe-style").value.trim(),
    notes: document.querySelector("#wardrobe-notes").value.trim(),
    image,
  });
  event.currentTarget.reset();
  commitChange();
});

["#wardrobe-filter-name", "#wardrobe-filter-category", "#wardrobe-filter-color"].forEach((selector) => {
  document.querySelector(selector).addEventListener("input", renderWardrobe);
  document.querySelector(selector).addEventListener("change", renderWardrobe);
});

document.querySelector("#wardrobe-favorites-only").addEventListener("change", renderWardrobe);

document.querySelector("#wardrobe-clear-selection").addEventListener("click", () => {
  rememberUndo();
  state.wardrobeSelection = [];
  commitChange();
});

document.addEventListener("change", (event) => {
  const wardrobeSelect = event.target.dataset.wardrobeSelect;
  if (!wardrobeSelect) return;
  rememberUndo();
  state.wardrobeSelection = event.target.checked
    ? [...new Set([...state.wardrobeSelection, wardrobeSelect])]
    : state.wardrobeSelection.filter((id) => id !== wardrobeSelect);
  commitChange();
});

document.querySelector("#cnh-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#cnh-title");
  const value = document.querySelector("#cnh-value");
  const date = document.querySelector("#cnh-date");
  if (!title.value.trim()) return;
  rememberUndo();
  state.cnh.steps.push({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    value: Number(value.value || 0),
    dueDate: date.value || "",
    done: false,
  });
  title.value = "";
  value.value = "";
  date.value = "";
  commitChange();
});

const el__finance_goal_form = document.querySelector("#finance-goal-form");
if (el__finance_goal_form) {
  el__finance_goal_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#finance-goal-title");
  const target = document.querySelector("#finance-goal-target");
  if (!title.value.trim()) return;
  rememberUndo();
  state.financeGoals.push({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    current: 0,
    target: Number(target.value || 0),
  });
  title.value = "";
  target.value = "";
  document.querySelector(".finance-goals-panel").classList.remove("show-goal-form");
  commitChange();
});
}

document.querySelector("#agenda-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#agenda-title");
  const date = document.querySelector("#agenda-date");
  const type = document.querySelector("#agenda-type");
  if (!title.value.trim()) return;
  rememberUndo();
  state.agenda.push({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    date: date.value || todayISO(),
    type: type.value,
    done: false,
  });
  title.value = "";
  date.value = "";
  commitChange();
});

document.querySelector("#wins-date").value = todayISO();

document.querySelector("#wins-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.querySelector("#wins-title");
  const date = document.querySelector("#wins-date");
  const photoInput = document.querySelector("#wins-photo");
  const file = photoInput.files?.[0];
  if (!title.value.trim() || !file) return;

  const photo = await resizeImageFile(file);
  rememberUndo();
  state.wins.push({
    id: crypto.randomUUID(),
    title: title.value.trim(),
    date: date.value || todayISO(),
    photo,
  });
  title.value = "";
  date.value = todayISO();
  photoInput.value = "";
  commitChange();
});

function moveAgendaMonth(direction) {
  const [year, month] = (state.agendaPlan?.month || todayISO().slice(0, 7)).split("-").map(Number);
  const target = new Date(year, month - 1 + direction, 1);
  rememberUndo();
  state.agendaPlan = {
    ...state.agendaPlan,
    month: `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`,
  };
  commitChange();
}

document.querySelector("#agenda-month-prev").addEventListener("click", () => moveAgendaMonth(-1));
document.querySelector("#agenda-month-next").addEventListener("click", () => moveAgendaMonth(1));
document.querySelector("#agenda-calendar-grid").addEventListener("click", (event) => {
  const day = event.target.closest("[data-agenda-day]");
  if (!day) return;
  document.querySelector("#agenda-date").value = day.dataset.agendaDay;
  document.querySelector("#agenda-title").focus();
});

const el__finance_form = document.querySelector("#finance-form");
if (el__finance_form) {
  el__finance_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#finance-title");
  const type = document.querySelector("#finance-type");
  const category = document.querySelector("#finance-category");
  const value = Number(document.querySelector("#finance-value").value || 0);
  const dateMode = document.querySelector("#finance-date-mode");
  const businessDay = Number(document.querySelector("#finance-business-day").value || 5);
  const repeat = document.querySelector("#finance-repeat");
  const repeatCount = Number(document.querySelector("#finance-repeat-count").value || 1);
  if (!title.value.trim()) return;
  rememberUndo();
  const baseDate = getFinanceDueDateFromForm();
  const normalizedRepeat = normalizeFinanceRepeat(repeat.value, repeatCount);
  const count = normalizedRepeat === "once" ? 1 : Math.max(1, repeatCount);
  const groupId = crypto.randomUUID();
  const entries = Array.from({ length: count }, (_, index) => {
    const dueDate = getFinanceOccurrenceDate(baseDate, index, dateMode.value, normalizedRepeat, businessDay);
    return {
      id: crypto.randomUUID(),
      groupId,
      title: count > 1 ? `${title.value.trim()} (${index + 1}/${count})` : title.value.trim(),
      baseTitle: title.value.trim(),
      type: type.value,
      category: category.value,
      value,
      dueDate,
      dateMode: dateMode.value,
      businessDay,
      repeat: normalizedRepeat,
      repeatCount: count,
      installment: index + 1,
      done: false,
      date: new Date().toLocaleDateString("pt-BR"),
    };
  });
  state.finance.unshift(...entries);
  title.value = "";
  document.querySelector("#finance-due-date").value = "";
  document.querySelector("#finance-value").value = "";
  document.querySelector("#finance-repeat").value = "once";
  document.querySelector("#finance-repeat-count").value = "1";
  document.querySelector("#finance").classList.remove("show-entry-form");
  commitChange();
});
}

const el__finance_repeat = document.querySelector("#finance-repeat");
if (el__finance_repeat) {
  el__finance_repeat.addEventListener("change", () => {
  const repeat = document.querySelector("#finance-repeat").value;
  const count = document.querySelector("#finance-repeat-count");
  count.value = repeat === "monthly" ? "12" : repeat === "biweekly" ? "2" : "1";
});
}

const el__finance_date_mode = document.querySelector("#finance-date-mode");
if (el__finance_date_mode) {
  el__finance_date_mode.addEventListener("change", () => {
  const isBusiness = document.querySelector("#finance-date-mode").value === "business";
  document.querySelector("#finance-due-date").hidden = isBusiness;
  document.querySelector("#finance-business-day").hidden = !isBusiness;
});
}

document.querySelector("#finance-edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.querySelector("#finance-edit-id").value;
  if (!id) return;
  const original = state.finance.find((item) => item.id === id);
  if (!original) return;
  rememberUndo();
  rebuildFinanceSeries(original, {
    title: document.querySelector("#finance-edit-title").value.trim() || original.title,
    type: document.querySelector("#finance-edit-type").value,
    category: document.querySelector("#finance-edit-category").value,
    dueDate: document.querySelector("#finance-edit-date").value || original.dueDate,
    value: Number(document.querySelector("#finance-edit-value").value || 0),
    repeat: document.querySelector("#finance-edit-repeat").value,
    repeatCount: Number(document.querySelector("#finance-edit-repeat-count").value || 1),
  });
  document.querySelector("#finance-edit-panel").classList.remove("open");
  document.querySelector("#finance-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#finance-edit-delete").addEventListener("click", () => {
  const id = document.querySelector("#finance-edit-id").value;
  if (!id || !window.confirm("Excluir este item?")) return;
  rememberUndo();
  state.finance = state.finance.filter((item) => item.id !== id);
  document.querySelector("#finance-edit-panel").classList.remove("open");
  document.querySelector("#finance-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#finance-edit-repeat").addEventListener("change", () => {
  const repeat = document.querySelector("#finance-edit-repeat").value;
  const count = document.querySelector("#finance-edit-repeat-count");
  count.value = repeat === "monthly" ? "12" : repeat === "biweekly" ? "2" : "1";
});

const el__finance_repeat_count = document.querySelector("#finance-repeat-count");
if (el__finance_repeat_count) {
  el__finance_repeat_count.addEventListener("change", (event) => {
  if (Number(event.target.value || 1) > 1 && document.querySelector("#finance-repeat").value === "once") {
    document.querySelector("#finance-repeat").value = "monthly";
  }
});
}

document.querySelector("#finance-edit-repeat-count").addEventListener("change", (event) => {
  if (Number(event.target.value || 1) > 1 && document.querySelector("#finance-edit-repeat").value === "once") {
    document.querySelector("#finance-edit-repeat").value = "monthly";
  }
});

document.querySelector("#budget-edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.querySelector("#budget-edit-id").value;
  const kind = document.querySelector("#budget-edit-kind").value;
  const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
  if (!id || !key) return;

  rememberUndo();
  state[key] = state[key].map((item) => {
    if (item.id !== id) return item;
    const next = {
      ...item,
      title: document.querySelector("#budget-edit-title").value.trim() || item.title,
      value: Number(document.querySelector("#budget-edit-value").value || 0),
    };
    if (kind === "fixed") {
      next.dueDay = Math.min(31, Math.max(1, Number(document.querySelector("#budget-edit-day").value || 1)));
    } else {
      next.dueDate = document.querySelector("#budget-edit-date").value || item.dueDate;
    }
    return next;
  });
  document.querySelector("#budget-edit-panel").classList.remove("open");
  document.querySelector("#budget-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#budget-edit-delete").addEventListener("click", () => {
  const id = document.querySelector("#budget-edit-id").value;
  const kind = document.querySelector("#budget-edit-kind").value;
  const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
  if (!id || !key || !window.confirm("Excluir este item?")) return;
  rememberUndo();
  state[key] = state[key].filter((item) => item.id !== id);
  document.querySelector("#budget-edit-panel").classList.remove("open");
  document.querySelector("#budget-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#generic-edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const entity = document.querySelector("#generic-edit-entity").value;
  const id = document.querySelector("#generic-edit-id").value;
  const config = genericEditConfigs[entity];
  if (!config || !id) return;

  const values = {};
  document.querySelectorAll("[data-generic-field]").forEach((input) => {
    values[input.dataset.genericField] = input.value;
  });

  rememberUndo();
  config.save(id, values);
  document.querySelector("#generic-edit-panel").classList.remove("open");
  document.querySelector("#generic-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

document.querySelector("#generic-edit-delete").addEventListener("click", () => {
  const entity = document.querySelector("#generic-edit-entity").value;
  const id = document.querySelector("#generic-edit-id").value;
  if (!genericEditConfigs[entity] || !id || !window.confirm("Excluir este item?")) return;
  rememberUndo();
  deleteGenericItem(entity, id);
  document.querySelector("#generic-edit-panel").classList.remove("open");
  document.querySelector("#generic-edit-panel").setAttribute("aria-hidden", "true");
  commitChange();
});

if (false) {
document.querySelector("#finance-clear-filter").addEventListener("click", () => {
  activeFinanceFilter = "all";
  renderFinance();
});

document.querySelector("#finance-new-entry").addEventListener("click", () => {
  document.querySelector("#finance").classList.toggle("show-entry-form");
  document.querySelector("#finance-title").focus();
});

document.querySelector("#finance-toggle-view").addEventListener("click", () => {
  rememberUndo();
  state.financePlan.viewMode = state.financePlan.viewMode === "year" ? "month" : "year";
  commitChange();
});

document.querySelector("#finance-inline-prev").addEventListener("click", () => {
  if (state.financePlan.viewMode === "year") moveFinanceYear(-1);
  else moveFinanceMonth(-1);
});

document.querySelector("#finance-inline-next").addEventListener("click", () => {
  if (state.financePlan.viewMode === "year") moveFinanceYear(1);
  else moveFinanceMonth(1);
});

document.querySelectorAll("[data-finance-bill-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    financeBillFilter = button.dataset.financeBillFilter;
    renderFinance();
  });
});

document.querySelector("#finance-new-goal").addEventListener("click", () => {
  document.querySelector(".finance-goals-panel").classList.toggle("show-goal-form");
  document.querySelector("#finance-goal-title").focus();
});

document.querySelectorAll("[data-finance-show-details]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#finance").classList.toggle("show-details");
  });
});

document.querySelector("[data-finance-new-subscription]").addEventListener("click", () => {
  document.querySelector("#finance").classList.add("show-entry-form");
  document.querySelector("#finance-type").value = "expense";
  document.querySelector("#finance-category").value = "Outros";
  document.querySelector("#finance-title").focus();
});

document.querySelector("#finance-month").addEventListener("change", () => {
  rememberUndo();
  state.financePlan = {
    ...state.financePlan,
    month: document.querySelector("#finance-month").value || todayISO().slice(0, 7),
    year: Number((document.querySelector("#finance-month").value || todayISO()).slice(0, 4)),
    viewMode: "month",
  };
  activeFinanceFilter = "all";
  commitChange();
});

document.querySelector("#finance-view-mode").addEventListener("change", () => {
  rememberUndo();
  state.financePlan = {
    ...state.financePlan,
    viewMode: document.querySelector("#finance-view-mode").value,
  };
  activeFinanceFilter = "all";
  commitChange();
});

document.querySelector("#finance-year").addEventListener("change", () => {
  rememberUndo();
  state.financePlan = {
    ...state.financePlan,
    year: Number(document.querySelector("#finance-year").value || todayISO().slice(0, 4)),
    viewMode: "year",
  };
  activeFinanceFilter = "all";
  commitChange();
});

function moveFinanceMonth(direction) {
  rememberUndo();
  const [year, month] = currentFinanceMonth().split("-").map(Number);
  const target = new Date(year, month - 1 + direction, 1);
  state.financePlan.month = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  state.financePlan.year = target.getFullYear();
  state.financePlan.viewMode = "month";
  activeFinanceFilter = "all";
  commitChange();
}

function moveFinanceYear(direction) {
  rememberUndo();
  state.financePlan.year = Number(state.financePlan.year || todayISO().slice(0, 4)) + direction;
  state.financePlan.viewMode = "year";
  activeFinanceFilter = "all";
  commitChange();
}

document.querySelector("#finance-month-prev").addEventListener("click", () => moveFinanceMonth(-1));
document.querySelector("#finance-month-next").addEventListener("click", () => moveFinanceMonth(1));
document.querySelector("#finance-year-prev").addEventListener("click", () => moveFinanceYear(-1));
document.querySelector("#finance-year-next").addEventListener("click", () => moveFinanceYear(1));

document.querySelector("#finance-reset-paid").addEventListener("click", () => {
  rememberUndo();
  state.fixedCosts = state.fixedCosts.map(clearBudgetPaidForCurrentMonth);
  state.variableCosts = state.variableCosts.map(clearBudgetPaidForCurrentMonth);
  commitChange();
});

document.querySelector("#fixed-add-btn").addEventListener("click", () => {
  rememberUndo();
  state.fixedCosts.push({ id: crypto.randomUUID(), title: "Novo custo fixo", value: 0, dueDay: 1, paidMonths: {}, paid: false });
  commitChange();
});

document.querySelector("#variable-add-btn").addEventListener("click", () => {
  rememberUndo();
  state.variableCosts.push({ id: crypto.randomUUID(), title: "Novo custo variável", value: 0, dueDate: `${currentFinanceMonth()}-01`, paidMonths: {}, paid: false });
  commitChange();
});

}

document.addEventListener("change", (event) => {
  const marketShopQty = event.target.dataset.marketShopQty;
  const marketShopPrice = event.target.dataset.marketShopPrice;
  if (marketShopQty || marketShopPrice) {
    rememberUndo();
    state.market = state.market.map((item) => {
      if (item.id !== (marketShopQty || marketShopPrice)) return item;
      if (marketShopQty) return { ...item, shopQty: Math.max(1, Number(event.target.value || 1)) };
      return { ...item, shopPrice: Number(event.target.value || 0) };
    });
    commitChange();
    return;
  }

  const personalInfo = event.target.dataset.personalInfo;
  if (personalInfo) {
    rememberUndo();
    state.personal.info = {
      ...state.personal.info,
      [personalInfo]: event.target.value.trim(),
    };
    saveState();
    updateUndoButton();
    return;
  }

  const titleTarget = event.target.dataset.budgetTitle;
  const valueTarget = event.target.dataset.budgetValue;
  const dueTarget = event.target.dataset.budgetDue;
  const budgetDate = event.target.dataset.budgetDate;
  const financeTitle = event.target.dataset.financeTitle;
  const financeType = event.target.dataset.financeType;
  const financeCategory = event.target.dataset.financeCategoryEdit;
  const financeValue = event.target.dataset.financeValue;
  const financeDue = event.target.dataset.financeDue;
  if (!titleTarget && !valueTarget && !dueTarget && !budgetDate && !financeTitle && !financeType && !financeCategory && !financeValue && !financeDue) return;

  rememberUndo();

  if (financeDue) {
    state.finance = state.finance.map((item) => item.id === financeDue ? { ...item, dueDate: event.target.value || item.dueDate, done: false } : item);
    commitChange();
    return;
  }

  if (financeTitle) {
    state.finance = state.finance.map((item) => item.id === financeTitle ? { ...item, title: event.target.value.trim() || item.title } : item);
  }

  if (financeType) {
    state.finance = state.finance.map((item) => item.id === financeType ? { ...item, type: event.target.value, done: false } : item);
  }

  if (financeCategory) {
    state.finance = state.finance.map((item) => item.id === financeCategory ? { ...item, category: event.target.value } : item);
  }

  if (financeValue) {
    const value = Number(event.target.value || 0);
    state.finance = state.finance.map((item) => item.id === financeValue ? { ...item, value } : item);
  }

  if (titleTarget) {
    const [kind, id] = titleTarget.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    state[key] = state[key].map((item) => item.id === id ? { ...item, title: event.target.value.trim() || item.title } : item);
  }

  if (valueTarget) {
    const [kind, id] = valueTarget.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    const value = Number(event.target.value || 0);
    state[key] = state[key].map((item) => item.id === id ? { ...item, value } : item);
  }

  if (dueTarget) {
    const [kind, id] = dueTarget.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    const value = Number(event.target.value || 1);
    state[key] = state[key].map((item) => item.id === id ? { ...item, dueDay: Math.min(31, Math.max(1, value)) } : item);
  }

  if (budgetDate) {
    const [kind, id] = budgetDate.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    state[key] = state[key].map((item) => item.id === id ? { ...item, dueDate: event.target.value || item.dueDate } : item);
  }

  commitChange();
});

document.querySelector("#note-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#note-input");
  if (!input.value.trim()) return;
  rememberUndo();
  state.notes.unshift({ id: crypto.randomUUID(), text: input.value.trim(), date: new Date().toLocaleDateString("pt-BR") });
  input.value = "";
  commitChange();
});

document.querySelector("#search-btn").addEventListener("click", () => {
  renderSearch();
  document.querySelector("#search-panel").classList.add("open");
  document.querySelector("#search-panel").setAttribute("aria-hidden", "false");
  document.querySelector("#global-search").focus();
});

document.querySelector("#global-search").addEventListener("input", (event) => renderSearch(event.target.value));

document.querySelector("#sidebar-global-search")?.addEventListener("input", (event) => {
  const value = event.target.value;
  const results = document.querySelector("#sidebar-search-results");
  if (results) results.hidden = !value.trim();
  renderSearch(value, "#sidebar-search-results", 8);
});

document.querySelector("#sidebar-global-search")?.addEventListener("focus", (event) => {
  const results = document.querySelector("#sidebar-search-results");
  if (results && event.target.value.trim()) {
    results.hidden = false;
    renderSearch(event.target.value, "#sidebar-search-results", 8);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  const emojiPickerButton = target.closest("[data-emoji-picker-target]");
  if (emojiPickerButton) {
    const input = document.querySelector(`#${emojiPickerButton.dataset.emojiPickerTarget}`);
    if (input) openEmojiPicker(input, emojiPickerButton);
    return;
  }
  const emojiValue = target.closest("[data-emoji-value]");
  if (emojiValue && activeEmojiInput) {
    const input = activeEmojiInput;
    input.value = emojiValue.dataset.emojiValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    closeEmojiPicker();
    input.focus();
    return;
  }
  if (!target.closest("#emoji-picker") && !target.closest("[data-emoji-picker-target]") && !document.querySelector("#emoji-picker").hidden) {
    closeEmojiPicker();
  }
  const routineAddType = target.closest("[data-routine-add-type]");
  if (routineAddType) {
    const category = state.routineCategories.find((item) => item.id === routineAddType.dataset.routineAddType);
    document.querySelector("#routine-add-habit-type").value = routineAddType.dataset.routineAddType;
    document.querySelector("#routine-add-habit-title").textContent = `Novo hábito em ${category?.name || "Rotina"}`;
    document.querySelector("#routine-add-habit-panel").classList.add("open");
    document.querySelector("#routine-add-habit-panel").setAttribute("aria-hidden", "false");
    document.querySelector("#routine-add-habit-name").focus();
    return;
  }
  const routineDeleteCard = target.closest("[data-routine-delete-card]");
  if (routineDeleteCard) {
    const categoryId = routineDeleteCard.dataset.routineDeleteCard;
    const category = state.routineCategories.find((item) => item.id === categoryId);
    if (!category || category.locked || !window.confirm(`Excluir o card "${category.name}" e seus hábitos?`)) return;
    rememberUndo();
    state.routineCategories = state.routineCategories.filter((item) => item.id !== categoryId);
    state.routineLayout = state.routineLayout.filter((item) => item !== categoryId);
    state.routine = state.routine.filter((item) => item.type !== categoryId);
    if (state.routineTracker.waterType === categoryId) state.routineTracker.waterType = "required";
    commitChange();
    return;
  }
  const routineWaterMore = target.closest("[data-routine-water-more]");
  if (routineWaterMore) {
    rememberUndo();
    const selectedDate = state.routineTracker.selectedDate || todayISO();
    if (selectedDate === todayISO()) {
      state.routineTracker.waterMl = Math.min(state.routineTracker.waterGoalMl, state.routineTracker.waterMl + 500);
      ensureRoutineDayRecord(selectedDate).__water = state.routineTracker.waterMl >= state.routineTracker.waterGoalMl;
    } else {
      setRoutineDayWater(selectedDate, true);
    }
    commitChange();
    return;
  }
  const routineWaterLess = target.closest("[data-routine-water-less]");
  if (routineWaterLess) {
    rememberUndo();
    const selectedDate = state.routineTracker.selectedDate || todayISO();
    if (selectedDate === todayISO()) {
      state.routineTracker.waterMl = Math.max(0, state.routineTracker.waterMl - 500);
      ensureRoutineDayRecord(selectedDate).__water = state.routineTracker.waterMl >= state.routineTracker.waterGoalMl;
    } else {
      setRoutineDayWater(selectedDate, false);
    }
    commitChange();
    return;
  }
  const routineCalendarDate = target.closest("[data-routine-calendar-date]");
  if (routineCalendarDate) {
    rememberUndo();
    state.routineTracker.selectedDate = routineCalendarDate.dataset.routineCalendarDate;
    state.routineTracker.viewMode = "day";
    commitChange();
    return;
  }
  const routineCalendarMonth = target.closest("[data-routine-calendar-month]");
  if (routineCalendarMonth) {
    rememberUndo();
    const currentDay = String(state.routineTracker.selectedDate || todayISO()).slice(8, 10) || "01";
    const monthKey = routineCalendarMonth.dataset.routineCalendarMonth;
    state.routineTracker.selectedDate = `${monthKey}-${String(Math.min(Number(currentDay), daysInMonth(monthKey))).padStart(2, "0")}`;
    state.routineTracker.viewMode = "month";
    commitChange();
    return;
  }
  const winPhoto = target.closest("[data-win-photo]");
  if (winPhoto) {
    document.querySelector("#wins-change-photo").dataset.winId = winPhoto.dataset.winPhoto;
    document.querySelector("#wins-change-photo").click();
    return;
  }
  const homePhoto = target.closest("[data-home-photo]");
  if (homePhoto) {
    document.querySelector("#home-change-photo").dataset.homeId = homePhoto.dataset.homePhoto;
    document.querySelector("#home-change-photo").click();
    return;
  }
  const wardrobePhoto = target.closest("[data-wardrobe-photo]");
  if (wardrobePhoto) {
    document.querySelector("#wardrobe-change-photo").dataset.wardrobeId = wardrobePhoto.dataset.wardrobePhoto;
    document.querySelector("#wardrobe-change-photo").click();
    return;
  }
  const wardrobeDelete = target.closest("[data-wardrobe-delete]");
  if (wardrobeDelete) {
    if (!window.confirm("Excluir esta roupa?")) return;
    rememberUndo();
    deleteGenericItem("wardrobe", wardrobeDelete.dataset.wardrobeDelete);
    commitChange();
    return;
  }
  const wardrobeSaveLook = target.closest("[data-wardrobe-save-look], [data-wardrobe-favorite-generated]");
  if (wardrobeSaveLook) {
    const index = Number(wardrobeSaveLook.dataset.wardrobeSaveLook ?? wardrobeSaveLook.dataset.wardrobeFavoriteGenerated);
    const pieces = getGeneratedWardrobeLooks()[index];
    if (!pieces) return;
    rememberUndo();
    state.wardrobeLooks.unshift({
      id: crypto.randomUUID(),
      name: `Look ${state.wardrobeLooks.length + 1}`,
      pieces,
      favorite: Boolean(wardrobeSaveLook.dataset.wardrobeFavoriteGenerated),
      createdAt: new Date().toISOString(),
    });
    commitChange();
    return;
  }
  const wardrobeFavoriteLook = target.closest("[data-wardrobe-favorite-look]");
  if (wardrobeFavoriteLook) {
    rememberUndo();
    state.wardrobeLooks = state.wardrobeLooks.map((look) => look.id === wardrobeFavoriteLook.dataset.wardrobeFavoriteLook ? { ...look, favorite: !look.favorite } : look);
    commitChange();
    return;
  }
  const wardrobeDeleteLook = target.closest("[data-wardrobe-delete-look]");
  if (wardrobeDeleteLook) {
    rememberUndo();
    state.wardrobeLooks = state.wardrobeLooks.filter((look) => look.id !== wardrobeDeleteLook.dataset.wardrobeDeleteLook);
    commitChange();
    return;
  }
  const wishlistCategoryJump = target.closest("[data-wishlist-category-jump]");
  if (wishlistCategoryJump) {
    document.querySelector(`#wishlist-category-${wishlistCategoryJump.dataset.wishlistCategoryJump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const closeOverlay = target.closest("[data-close-overlay]");
  if (closeOverlay) {
    if (closeOverlay.closest("#login-panel") && !currentUser) return;
    closeOverlay.closest(".overlay-panel").classList.remove("open");
    closeOverlay.closest(".overlay-panel").setAttribute("aria-hidden", "true");
    return;
  }
  const overlayBackdrop = target.classList?.contains("overlay-panel") ? target : null;
  if (overlayBackdrop) {
    if (overlayBackdrop.id === "login-panel" && !currentUser) return;
    overlayBackdrop.classList.remove("open");
    overlayBackdrop.setAttribute("aria-hidden", "true");
    return;
  }
  const searchOpen = target.closest("[data-search-open]");
  if (searchOpen) {
    document.querySelector("#search-panel").classList.remove("open");
    document.querySelector("#search-panel").setAttribute("aria-hidden", "true");
    document.querySelector("#sidebar-search-results").hidden = true;
    document.querySelector("#sidebar-global-search").value = "";
    openSection(searchOpen.dataset.searchOpen);
    return;
  }
  const marketJumpButton = target.closest("[data-market-jump]");
  if (marketJumpButton) {
    document.querySelector(`#market-${marketJumpButton.dataset.marketJump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const financeFilterButton = target.closest("[data-finance-filter]");
  if (financeFilterButton) {
    activeFinanceFilter = financeFilterButton.dataset.financeFilter;
    renderFinance();
    return;
  }
  const financeEditButton = target.closest("[data-finance-edit]");
  if (financeEditButton) {
    openFinanceEdit(financeEditButton.dataset.financeEdit);
    return;
  }
  const budgetEditButton = target.closest("[data-budget-edit]");
  if (budgetEditButton) {
    openBudgetEdit(budgetEditButton.dataset.budgetEdit);
    return;
  }
  const genericEditButton = target.closest("[data-generic-edit]");
  if (genericEditButton) {
    const [entity, ...idParts] = genericEditButton.dataset.genericEdit.split(":");
    const id = idParts.join(":");
    openGenericEdit(entity, id);
    return;
  }

  const taskCheck = target.closest("[data-task-check]")?.dataset.taskCheck;
  const taskDelete = target.closest("[data-task-delete]")?.dataset.taskDelete;
  const marketCheck = target.closest("[data-market-check]")?.dataset.marketCheck;
  const marketShopPick = target.closest("[data-market-shop-pick]")?.dataset.marketShopPick;
  const marketDelete = target.closest("[data-market-delete]")?.dataset.marketDelete;
  const routineCheckButton = target.closest("[data-routine-check]");
  const routineRowCheck = !target.closest("button, input, select, textarea, a")
    ? target.closest(".routine-item:not(.routine-water-row)")?.querySelector("[data-routine-check]")
    : null;
  const routineCheck = (routineCheckButton || routineRowCheck)?.dataset.routineCheck;
  const routineDelete = target.closest("[data-routine-delete]")?.dataset.routineDelete;
  const wishlistCheck = target.closest("[data-wishlist-check]")?.dataset.wishlistCheck;
  const wishlistDelete = target.closest("[data-wishlist-delete]")?.dataset.wishlistDelete;
  const cnhCheck = target.closest("[data-cnh-check]")?.dataset.cnhCheck;
  const cnhDelete = target.closest("[data-cnh-delete]")?.dataset.cnhDelete;
  const noteDelete = target.closest("[data-note-delete]")?.dataset.noteDelete;
  const agendaCheck = target.closest("[data-agenda-check]")?.dataset.agendaCheck;
  const agendaDelete = target.closest("[data-agenda-delete]")?.dataset.agendaDelete;
  const winDelete = target.closest("[data-win-delete]")?.dataset.winDelete;
  const homeCheck = target.closest("[data-home-check]")?.dataset.homeCheck;
  const homeDelete = target.closest("[data-home-delete]")?.dataset.homeDelete;
  const personalGoalCheck = target.closest("[data-personal-goal-check]")?.dataset.personalGoalCheck;
  const personalGoalDelete = target.closest("[data-personal-goal-delete]")?.dataset.personalGoalDelete;
  const personalDocCheck = target.closest("[data-personal-doc-check]")?.dataset.personalDocCheck;
  const personalDocDelete = target.closest("[data-personal-doc-delete]")?.dataset.personalDocDelete;
  const financeDelete = target.closest("[data-finance-delete]")?.dataset.financeDelete;
  const financeDone = target.closest("[data-finance-done]")?.dataset.financeDone;
  const financeDeleteGroup = target.closest("[data-finance-delete-group]")?.dataset.financeDeleteGroup;
  const financeDoneGroup = target.closest("[data-finance-done-group]")?.dataset.financeDoneGroup;
  const budgetDelete = target.closest("[data-budget-delete]")?.dataset.budgetDelete;
  const budgetPaid = target.closest("[data-budget-paid]")?.dataset.budgetPaid;
  const pendingCheck = target.closest("[data-pending-check]")?.dataset.pendingCheck;
  const pendingDelete = target.closest("[data-pending-delete]")?.dataset.pendingDelete;
  const pendingExpand = target.closest("[data-pending-expand]")?.dataset.pendingExpand;
  const subtaskCheck = target.closest("[data-subtask-check]")?.dataset.subtaskCheck;
  const subtaskDelete = target.closest("[data-subtask-delete]")?.dataset.subtaskDelete;

  const willChange = taskCheck || taskDelete || pendingCheck || pendingDelete || subtaskCheck || subtaskDelete || marketCheck || marketShopPick || marketDelete || routineCheck || routineDelete || wishlistCheck || wishlistDelete || cnhCheck || cnhDelete || noteDelete || agendaCheck || agendaDelete || winDelete || homeCheck || homeDelete || personalGoalCheck || personalGoalDelete || personalDocCheck || personalDocDelete || financeDelete || financeDone || financeDeleteGroup || financeDoneGroup || budgetDelete || budgetPaid;
  if (willChange) rememberUndo();

  if (taskCheck) state.tasks = state.tasks.map((task) => task.id === taskCheck ? { ...task, done: !task.done } : task);
  if (taskDelete) state.tasks = state.tasks.filter((task) => task.id !== taskDelete);
  if (pendingCheck) state.pending = state.pending.map((task) => task.id === pendingCheck ? { ...task, done: !task.done } : task);
  if (pendingDelete) state.pending = state.pending.filter((task) => task.id !== pendingDelete);
  if (pendingExpand) {
    if (expandedPending.has(pendingExpand)) {
      expandedPending.delete(pendingExpand);
    } else {
      expandedPending.add(pendingExpand);
    }
    render();
    return;
  }
  if (subtaskCheck) {
    const [taskId, subtaskId] = subtaskCheck.split(":");
    state.pending = state.pending.map((task) => task.id === taskId ? {
      ...task,
      subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask),
    } : task);
  }
  if (subtaskDelete) {
    const [taskId, subtaskId] = subtaskDelete.split(":");
    state.pending = state.pending.map((task) => task.id === taskId ? {
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    } : task);
  }
  if (marketCheck) state.market = state.market.map((item) => item.id === marketCheck ? { ...item, bought: !item.bought, inCart: false } : item);
  if (marketShopPick) state.market = state.market.map((item) => item.id === marketShopPick ? {
    ...item,
    shopQty: getMarketShopQty(item),
    shopPrice: getMarketShopPrice(item),
    inCart: !item.inCart,
  } : item);
  if (marketDelete) state.market = state.market.filter((item) => item.id !== marketDelete);
  if (routineCheck) {
    const selectedDate = state.routineTracker.selectedDate || todayISO();
    const record = ensureRoutineDayRecord(selectedDate);
    setRoutineDayHabit(selectedDate, routineCheck, !Boolean(record[routineCheck]));
  }
  if (routineDelete) state.routine = state.routine.filter((item) => item.id !== routineDelete);
  if (wishlistCheck) state.wishlist = state.wishlist.map((item) => item.id === wishlistCheck ? { ...item, bought: !item.bought } : item);
  if (wishlistDelete) state.wishlist = state.wishlist.filter((item) => item.id !== wishlistDelete);
  if (cnhCheck) state.cnh.steps = state.cnh.steps.map((item) => item.id === cnhCheck ? { ...item, done: !item.done } : item);
  if (cnhDelete) state.cnh.steps = state.cnh.steps.filter((item) => item.id !== cnhDelete);
  if (noteDelete) state.notes = state.notes.filter((item) => item.id !== noteDelete);
  if (agendaCheck) state.agenda = state.agenda.map((item) => item.id === agendaCheck ? { ...item, done: !item.done } : item);
  if (agendaDelete) state.agenda = state.agenda.filter((item) => item.id !== agendaDelete);
  if (winDelete) state.wins = state.wins.filter((item) => item.id !== winDelete);
  if (homeCheck) state.homeItems = state.homeItems.map((item) => item.id === homeCheck ? { ...item, done: !item.done } : item);
  if (homeDelete) state.homeItems = state.homeItems.filter((item) => item.id !== homeDelete);
  if (personalGoalCheck) state.personal.goals = state.personal.goals.map((item) => item.id === personalGoalCheck ? { ...item, done: !item.done } : item);
  if (personalGoalDelete) state.personal.goals = state.personal.goals.filter((item) => item.id !== personalGoalDelete);
  if (personalDocCheck) state.personal.docs = state.personal.docs.map((item) => item.id === personalDocCheck ? { ...item, done: !item.done } : item);
  if (personalDocDelete) state.personal.docs = state.personal.docs.filter((item) => item.id !== personalDocDelete);
  if (financeDone) state.finance = state.finance.map((item) => item.id === financeDone ? { ...item, done: !item.done } : item);
  if (financeDelete) state.finance = state.finance.filter((item) => item.id !== financeDelete);
  if (financeDoneGroup) {
    const groupItems = state.finance.filter((item) => getFinanceYearGroupKey(item) === financeDoneGroup);
    const nextDone = !groupItems.every((item) => item.done);
    state.finance = state.finance.map((item) => getFinanceYearGroupKey(item) === financeDoneGroup ? { ...item, done: nextDone } : item);
  }
  if (financeDeleteGroup) state.finance = state.finance.filter((item) => getFinanceYearGroupKey(item) !== financeDeleteGroup);
  if (budgetDelete) {
    const [kind, id] = budgetDelete.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    state[key] = state[key].filter((item) => item.id !== id);
  }
  if (budgetPaid) {
    const [kind, id] = budgetPaid.split(":");
    const key = kind === "fixed" ? "fixedCosts" : "variableCosts";
    state[key] = state[key].map((item) => item.id === id ? toggleBudgetPaid(item) : item);
  }

  if (willChange) {
    commitChange();
  }
});

document.querySelector("#wins-change-photo").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  const winId = event.target.dataset.winId;
  if (!file || !winId) return;
  const photo = await resizeImageFile(file);
  rememberUndo();
  state.wins = state.wins.map((item) => item.id === winId ? { ...item, photo } : item);
  event.target.value = "";
  commitChange();
});

document.querySelector("#home-change-photo").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  const homeId = event.target.dataset.homeId;
  if (!file || !homeId) return;
  const photo = await resizeImageFile(file, 520, 0.78);
  rememberUndo();
  state.homeItems = state.homeItems.map((item) => item.id === homeId ? { ...item, photo } : item);
  event.target.value = "";
  commitChange();
});

document.querySelector("#wardrobe-change-photo").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  const wardrobeId = event.target.dataset.wardrobeId;
  if (!file || !wardrobeId) return;
  const image = await resizeImageFile(file, 640, 0.8);
  rememberUndo();
  state.wardrobeItems = state.wardrobeItems.map((item) => item.id === wardrobeId ? { ...item, image } : item);
  event.target.value = "";
  commitChange();
});

document.addEventListener("dragstart", (event) => {
  const routineHabit = event.target.closest("[data-routine-habit-drag]");
  if (routineHabit && !event.target.closest("button, input, select, textarea, a")) {
    event.stopPropagation();
    event.dataTransfer.setData("application/x-routine-habit", routineHabit.dataset.routineHabitDrag);
    event.dataTransfer.effectAllowed = "move";
    routineHabit.classList.add("routine-habit-dragging");
    return;
  }

  const routineCard = event.target.closest("[data-routine-card]");
  if (routineCard) {
    if (event.target.closest("button, input, select, textarea, a")) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("application/x-routine-card", routineCard.dataset.routineCard);
    event.dataTransfer.effectAllowed = "move";
    routineCard.classList.add("routine-card-dragging");
    return;
  }

  const financeCard = event.target.closest("[data-finance-summary-card], [data-finance-dashboard-card]");
  if (financeCard) {
    if (event.target.closest("button, input, select, textarea, a")) {
      event.preventDefault();
      return;
    }
    const group = financeCard.dataset.financeSummaryCard ? "summary" : "dashboard";
    const key = financeCard.dataset.financeSummaryCard || financeCard.dataset.financeDashboardCard;
    event.dataTransfer.setData("application/x-finance-card", `${group}:${key}`);
    event.dataTransfer.effectAllowed = "move";
    financeCard.classList.add("finance-card-dragging");
    return;
  }

  const item = event.target.closest("[data-pending-drag]");
  if (!item) return;
  event.dataTransfer.setData("text/plain", item.dataset.pendingDrag);
  event.dataTransfer.effectAllowed = "move";
  item.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
  event.target.closest("[data-routine-habit-drag]")?.classList.remove("routine-habit-dragging");
  event.target.closest("[data-routine-card]")?.classList.remove("routine-card-dragging");
  event.target.closest("[data-finance-summary-card], [data-finance-dashboard-card]")?.classList.remove("finance-card-dragging");
  const item = event.target.closest("[data-pending-drag]");
  item?.classList.remove("dragging");
  document.querySelectorAll(".pending-list").forEach((list) => list.classList.remove("drag-over"));
  document.querySelectorAll("[data-routine-card]").forEach((card) => card.classList.remove("routine-habit-drop-target"));
});

document.querySelector(".routine-board").addEventListener("dragover", (event) => {
  if (Array.from(event.dataTransfer.types).includes("application/x-routine-habit")) {
    const targetCard = event.target.closest("[data-routine-card]");
    if (!targetCard) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    document.querySelectorAll("[data-routine-card]").forEach((card) => card.classList.toggle("routine-habit-drop-target", card === targetCard));
    return;
  }
  if (!Array.from(event.dataTransfer.types).includes("application/x-routine-card")) return;
  event.preventDefault();
  const board = event.currentTarget;
  const dragged = board.querySelector(".routine-card-dragging");
  const target = event.target.closest("[data-routine-card]");
  if (!dragged || !target || dragged === target) return;
  const rect = target.getBoundingClientRect();
  const placeAfter = event.clientY > rect.top + rect.height / 2
    || event.clientX > rect.left + rect.width / 2;
  board.insertBefore(dragged, placeAfter ? target.nextSibling : target);
});

document.querySelector(".routine-board").addEventListener("drop", (event) => {
  const routineHabitId = event.dataTransfer.getData("application/x-routine-habit");
  if (routineHabitId) {
    const targetCard = event.target.closest("[data-routine-card]");
    if (!targetCard) return;
    event.preventDefault();
    rememberUndo();
    const targetType = targetCard.dataset.routineCard;
    if (routineHabitId === "__water") {
      state.routineTracker.waterType = targetType;
    } else {
      state.routine = state.routine.map((item) => item.id === routineHabitId ? { ...item, type: targetType } : item);
    }
    document.querySelectorAll("[data-routine-card]").forEach((card) => card.classList.remove("routine-habit-drop-target"));
    commitChange();
    return;
  }
  if (!event.dataTransfer.getData("application/x-routine-card")) return;
  event.preventDefault();
  state.routineLayout = [...event.currentTarget.querySelectorAll("[data-routine-card]")].map((card) => card.dataset.routineCard);
  saveState();
  render();
});

document.querySelectorAll(".finance-summary, .finance-dashboard-grid").forEach((container) => {
  container.addEventListener("dragover", (event) => {
    if (!Array.from(event.dataTransfer.types).includes("application/x-finance-card")) return;
    event.preventDefault();
    const group = container.classList.contains("finance-summary") ? "summary" : "dashboard";
    const dragged = container.querySelector(".finance-card-dragging");
    const selector = group === "summary" ? "[data-finance-summary-card]" : "[data-finance-dashboard-card]";
    const target = event.target.closest(selector);
    if (!dragged || !target || dragged === target || target.parentElement !== container) return;
    const rect = target.getBoundingClientRect();
    const placeAfter = event.clientY > rect.top + rect.height / 2
      || event.clientX > rect.left + rect.width / 2;
    container.insertBefore(dragged, placeAfter ? target.nextSibling : target);
  });

  container.addEventListener("drop", (event) => {
    const transfer = event.dataTransfer.getData("application/x-finance-card");
    if (!transfer) return;
    event.preventDefault();
    const group = container.classList.contains("finance-summary") ? "summary" : "dashboard";
    const [sourceGroup] = transfer.split(":");
    if (group !== sourceGroup) return;
    const selector = group === "summary" ? "[data-finance-summary-card]" : "[data-finance-dashboard-card]";
    state.financeLayout[group] = [...container.querySelectorAll(selector)].map((card) => (
      group === "summary" ? card.dataset.financeSummaryCard : card.dataset.financeDashboardCard
    ));
    saveState();
    render();
  });
});

document.querySelectorAll("[data-pending-column]").forEach((column) => {
  const list = column.querySelector(".pending-list");
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    list.classList.add("drag-over");
  });
  column.addEventListener("dragleave", (event) => {
    if (!column.contains(event.relatedTarget)) list.classList.remove("drag-over");
  });
  column.addEventListener("drop", (event) => {
    event.preventDefault();
    list.classList.remove("drag-over");
    const taskId = event.dataTransfer.getData("text/plain");
    const nextType = column.dataset.pendingColumn;
    if (!taskId || !nextType) return;
    const currentTask = state.pending.find((task) => task.id === taskId);
    if (currentTask?.type === nextType) return;
    rememberUndo();
    state.pending = state.pending.map((task) => task.id === taskId ? { ...task, type: nextType } : task);
    commitChange();
  });
});

applyTheme(localStorage.getItem(themeStorageKey));
render();
updateUndoButton();
initAuth();

var todayDateEl = document.querySelector("#today-full-date");
if (todayDateEl) todayDateEl.textContent = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

// Profile Dropdown Menu Toggle and Actions
const profileTrigger = document.querySelector("#profile-trigger-btn");
const profileMenu = document.querySelector("#profile-menu-dropdown");
if (profileTrigger && profileMenu) {
  profileTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = profileMenu.hidden;
    profileMenu.hidden = !isHidden;
    profileTrigger.setAttribute("aria-expanded", isHidden ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!profileTrigger.contains(event.target) && !profileMenu.contains(event.target)) {
      profileMenu.hidden = true;
      profileTrigger.setAttribute("aria-expanded", "false");
    }
  });
}

const dropdownEditMenu = document.querySelector("#dropdown-edit-menu");
if (dropdownEditMenu) {
  dropdownEditMenu.addEventListener("click", () => {
    document.querySelector("#nav-edit-btn").click();
    if (profileMenu) profileMenu.hidden = true;
  });
}

const dropdownLogout = document.querySelector("#dropdown-logout");
if (dropdownLogout) {
  dropdownLogout.addEventListener("click", () => {
    document.querySelector("#logout-btn")?.click();
    if (profileMenu) profileMenu.hidden = true;
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("Falha ao registrar o service worker:", error);
    });
  });
}

function initFinanceInteractions() {
  // 1. Month bar: arrows, trigger dropdown, year nav
  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const monthNamesShort = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  let dropdownOpen = false;
  let dropdownYear = 0;

  function getCurrentMonthParts() {
    return (state.financePlan.month || new Date().toISOString().slice(0,7)).split('-').map(Number);
  }

  function setMonth(y, m) {
    const d = new Date(y, m - 1, 1);
    state.financePlan.month = d.toISOString().slice(0,7);
    calendarYear = d.getFullYear();
    saveState();
    renderFinance();
    updateMonthBarUI();
    renderYearCalendar();
  }

  function updateMonthBarUI() {
    const [y, m] = getCurrentMonthParts();
    const label = document.getElementById('finance-month-trigger-label');
    if (label) label.textContent = monthNamesShort[m-1] + '/' + y;
    const yearLabel = document.getElementById('finance-month-year-label');
    if (yearLabel) yearLabel.textContent = dropdownYear || y;
    const grid = document.getElementById('finance-month-grid');
    if (grid) {
      grid.innerHTML = '';
      monthNamesShort.forEach((name, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = name;
        if (i + 1 === m && (dropdownYear || y) === y) btn.classList.add('active');
        btn.addEventListener('click', () => {
          setMonth(dropdownYear || y, i + 1);
          closeDropdown();
        });
        grid.appendChild(btn);
      });
    }
  }

  function closeDropdown() {
    dropdownOpen = false;
    const panel = document.getElementById('finance-month-dropdown-panel');
    if (panel) panel.classList.remove('open');
  }

  const prevBtn = document.getElementById('finance-month-prev-btn');
  const nextBtn = document.getElementById('finance-month-next-btn');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    const [y,m] = getCurrentMonthParts();
    setMonth(y, m - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const [y,m] = getCurrentMonthParts();
    setMonth(y, m + 1);
  });

  const trigger = document.getElementById('finance-month-trigger');
  if (trigger) trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownOpen = !dropdownOpen;
    const panel = document.getElementById('finance-month-dropdown-panel');
    if (panel) panel.classList.toggle('open', dropdownOpen);
    if (dropdownOpen) {
      dropdownYear = getCurrentMonthParts()[0];
      updateMonthBarUI();
    }
  });

  const yearPrev = document.getElementById('finance-month-year-prev');
  const yearNext = document.getElementById('finance-month-year-next');
  if (yearPrev) yearPrev.addEventListener('click', () => { dropdownYear--; updateMonthBarUI(); });
  if (yearNext) yearNext.addEventListener('click', () => { dropdownYear++; updateMonthBarUI(); });

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('finance-month-dropdown-panel');
    if (panel && !panel.contains(e.target) && e.target !== trigger) closeDropdown();
  });

  updateMonthBarUI();

  // 2b. Year calendar card (4x3 grid)
  let calendarYear = getCurrentMonthParts()[0];
  const calendarMonthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  function renderYearCalendar() {
    const [curY, curM] = getCurrentMonthParts();
    const yearLabel = document.getElementById('finance-year-cal-label');
    const grid = document.getElementById('finance-year-month-grid');
    if (!yearLabel || !grid) return;
    yearLabel.textContent = calendarYear;
    grid.innerHTML = '';
    calendarMonthNames.forEach((name, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = name;
      if (calendarYear === curY && (i + 1) === curM) btn.classList.add('active');
      btn.addEventListener('click', () => {
        setMonth(calendarYear, i + 1);
        renderYearCalendar();
      });
      grid.appendChild(btn);
    });
  }

  const calPrev = document.getElementById('finance-year-cal-prev');
  const calNext = document.getElementById('finance-year-cal-next');
  if (calPrev) calPrev.addEventListener('click', () => { calendarYear--; renderYearCalendar(); });
  if (calNext) calNext.addEventListener('click', () => { calendarYear++; renderYearCalendar(); });

  renderYearCalendar();

  // 3. Tab navigation for internal finance sections
  const initFinanceTabs = () => {
    const tabs = document.querySelectorAll('[data-finance-tab]');
    const financeSections = [
      'section-resumo',
      'section-receber',
      'section-pagar',
      'section-assinaturas',
      'section-fixas',
      'section-historico'
    ];

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-finance-tab');
        tabs.forEach(t => t.classList.toggle('active', t === tab));

        const financePage = document.getElementById('finance');
        if (financePage) {
          financePage.setAttribute('data-active-tab', target);
        }

        const r2 = document.querySelector('.finance-row-2');
        const r3 = document.querySelector('.finance-row-3');
        const r4 = document.querySelector('.finance-row-4');
        const yearCal = document.getElementById('finance-year-calendar');

        if (target === 'section-resumo') {
          financeSections.forEach(secId => {
            const sec = document.getElementById(secId);
            if (sec) {
              sec.style.display = '';
              sec.style.gridColumn = '';
            }
          });
          if (r2) r2.style.display = '';
          if (r3) r3.style.display = '';
          if (r4) r4.style.display = '';
          if (yearCal) yearCal.style.display = '';
        } else {
          financeSections.forEach(secId => {
            const sec = document.getElementById(secId);
            if (sec) {
              if (secId === target) {
                sec.style.display = 'flex';
                sec.style.gridColumn = 'span 3';
              } else {
                sec.style.display = 'none';
                sec.style.gridColumn = '';
              }
            }
          });
          const isRow2 = ['section-resumo', 'section-pagar', 'section-receber'].includes(target);
          if (r2) r2.style.display = isRow2 ? 'grid' : 'none';
          if (r3) r3.style.display = !isRow2 ? 'grid' : 'none';
          if (r4) r4.style.display = 'none';
          if (yearCal) yearCal.style.display = 'none';
        }
      });
    });
  };
  initFinanceTabs();

    // 4. "Novo lançamento" button opens popup modal
  const btn = document.getElementById('btn-novo-lancamento');
  if(btn) {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('finance-add-panel');
      if (panel) {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        
        // Set default date input to today
        const dateInput = document.getElementById('finance-add-date');
        if (dateInput) dateInput.value = todayISO();
        
        document.getElementById('finance-add-title')?.focus();
      }
    });
  }

  // 5. New entry modal form submit
  const addForm = document.getElementById('finance-add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('finance-add-title')?.value.trim();
      const type = document.getElementById('finance-add-type')?.value;
      const category = document.getElementById('finance-add-category')?.value || 'Outros';
      const valStr = document.getElementById('finance-add-value')?.value;
      const date = document.getElementById('finance-add-date')?.value || todayISO();
      
      if(!title || !valStr || !type) {
        alert('Por favor, preencha todos os campos do lançamento.');
        return;
      }
      
      const val = parseFloat(valStr);
      if(isNaN(val) || val <= 0) {
        alert('Por favor, insira um valor válido maior que zero.');
        return;
      }
      
      rememberUndo();
      state.finance.push({
        id: crypto.randomUUID(),
        title,
        type,
        category,
        value: val,
        dueDate: date,
        done: false
      });
      
      commitChange();
      addForm.reset();
      
      const panel = document.getElementById('finance-add-panel');
      if (panel) {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
      }
      
      alert('Lançamento adicionado com sucesso!');
    });
  }
  // 6. Add fixed/variable cost or subscription modal open
  const btnAddSub = document.getElementById('btn-add-assinatura');
  if (btnAddSub) {
    btnAddSub.addEventListener('click', () => {
      const panel = document.getElementById('budget-add-panel');
      if (panel) {
        document.getElementById('budget-add-title-text').textContent = 'Nova Assinatura';
        document.getElementById('budget-add-title').placeholder = 'Ex: Netflix, Spotify, iCloud';
        document.getElementById('budget-add-kind').value = 'fixed';
        document.getElementById('budget-add-kind').dataset.subscription = 'true';
        document.getElementById('budget-add-day-label').style.display = 'grid';
        document.getElementById('budget-add-day').required = true;
        document.getElementById('budget-add-date-label').style.display = 'none';
        document.getElementById('budget-add-date').required = false;
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('budget-add-title').focus();
      }
    });
  }

  const btnAddFixed = document.getElementById('btn-add-conta-fixa');
  if (btnAddFixed) {
    btnAddFixed.addEventListener('click', () => {
      const panel = document.getElementById('budget-add-panel');
      if (panel) {
        document.getElementById('budget-add-title-text').textContent = 'Nova Conta Fixa';
        document.getElementById('budget-add-title').placeholder = 'Ex: Aluguel, Água, Internet';
        document.getElementById('budget-add-kind').value = 'fixed';
        document.getElementById('budget-add-kind').dataset.subscription = 'false';
        document.getElementById('budget-add-day-label').style.display = 'grid';
        document.getElementById('budget-add-day').required = true;
        document.getElementById('budget-add-date-label').style.display = 'none';
        document.getElementById('budget-add-date').required = false;
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('budget-add-title').focus();
      }
    });
  }

    // 7. Budget add form submit
  const budgetAddForm = document.getElementById('budget-add-form');
  if (budgetAddForm) {
    budgetAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('budget-add-title').value.trim();
      const valStr = document.getElementById('budget-add-value').value;
      const kind = document.getElementById('budget-add-kind').value;
      
      if (!title || !valStr) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      const value = parseFloat(valStr);
      if (isNaN(value) || value <= 0) {
        alert('Por favor, insira um valor válido maior que zero.');
        return;
      }
      
      rememberUndo();
      if (kind === 'fixed') {
        const dayStr = document.getElementById('budget-add-day').value;
        const dueDay = parseInt(dayStr);
        if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
          alert('Por favor, insira um dia de vencimento válido entre 1 e 31.');
          return;
        }
        const isSubscription = document.getElementById('budget-add-kind').dataset.subscription === 'true';
        state.fixedCosts.push({
          id: crypto.randomUUID(),
          title,
          value,
          dueDay,
          paidMonths: {},
          paid: false,
          isSubscription,
          createdAt: todayISO().slice(0, 7)
        });
      } else {
        const date = document.getElementById('budget-add-date').value || todayISO();
        state.variableCosts.push({
          id: crypto.randomUUID(),
          title,
          value,
          dueDate: date,
          paidMonths: {},
          paid: false
        });
      }
      
      commitChange();
      budgetAddForm.reset();
      document.getElementById('budget-add-kind').dataset.subscription = 'false';
      
      const panel = document.getElementById('budget-add-panel');
      if (panel) {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
      }
      
      alert('Item adicionado com sucesso!');
    });
  }

  // 8. Pre-select type when adding from specific panels
  const btnAddComp = document.getElementById('btn-add-compromisso');
  if (btnAddComp) {
    btnAddComp.addEventListener('click', () => {
      const panel = document.getElementById('finance-add-panel');
      if (panel) {
        document.getElementById('finance-add-type').value = '';
        document.getElementById('finance-add-date').value = todayISO();
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('finance-add-title').focus();
      }
    });
  }

  const btnAddReceber = document.getElementById('btn-add-conta-receber');
  if (btnAddReceber) {
    btnAddReceber.addEventListener('click', () => {
      const panel = document.getElementById('finance-add-panel');
      if (panel) {
        document.getElementById('finance-add-type').value = 'income';
        document.getElementById('finance-add-date').value = todayISO();
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('finance-add-title').focus();
      }
    });
  }

  // Redefine btnAddPagar click handler to open finance-add-panel with type='expense'
  const btnAddPagar = document.getElementById('btn-add-conta-pagar');
  if (btnAddPagar) {
    btnAddPagar.addEventListener('click', () => {
      const panel = document.getElementById('finance-add-panel');
      if (panel) {
        document.getElementById('finance-add-type').value = 'expense';
        document.getElementById('finance-add-date').value = todayISO();
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        document.getElementById('finance-add-title').focus();
      }
    });
  }

  // 9. Go to sub-tab delegation click handler
  document.addEventListener('click', (e) => {
    const goToTab = e.target.closest('[data-go-to-tab]');
    if (goToTab) {
      const tabName = goToTab.dataset.goToTab;
      const tabButton = document.querySelector(`[data-finance-tab="${tabName}"]`);
      if (tabButton) {
        tabButton.click();
      }
    }
  });

  // 10. Drag-and-drop to reorder cards
  function initDragAndDrop() {
    const STORAGE_KEY = 'painel-pessoal-card-order';
    let draggedCard = null;

    function saveOrder() {
      const order = {};
      ['finance-row-2', 'finance-row-3'].forEach(rowId => {
        const row = document.getElementById(rowId);
        if (!row) return;
        order[rowId] = Array.from(row.children)
          .filter(el => el.id)
          .map(el => el.id);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }

    function restoreOrder() {
      try {
        const order = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!order) return;
        Object.keys(order).forEach(rowId => {
          const row = document.getElementById(rowId);
          if (!row) return;
          order[rowId].forEach(id => {
            const el = document.getElementById(id);
            if (el) row.appendChild(el);
          });
        });
      } catch(e) {}
    }

    function initRow(rowId) {
      const row = document.getElementById(rowId);
      if (!row) return;
      row.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.draggable-card');
        if (!card) return;
        draggedCard = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', (e) => {
        const card = e.target.closest('.draggable-card');
        if (card) card.classList.remove('dragging');
        row.querySelectorAll('.draggable-card').forEach(c => c.classList.remove('drag-over'));
        draggedCard = null;
      });
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const target = e.target.closest('.draggable-card');
        if (target && target !== draggedCard) {
          row.querySelectorAll('.draggable-card').forEach(c => c.classList.remove('drag-over'));
          target.classList.add('drag-over');
        }
      });
      row.addEventListener('dragleave', (e) => {
        const target = e.target.closest('.draggable-card');
        if (target) target.classList.remove('drag-over');
      });
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        const target = e.target.closest('.draggable-card');
        if (!target || !draggedCard || target === draggedCard) return;
        const cards = Array.from(row.querySelectorAll('.draggable-card'));
        const fromIdx = cards.indexOf(draggedCard);
        const toIdx = cards.indexOf(target);
        if (fromIdx < toIdx) {
          row.insertBefore(draggedCard, target.nextSibling);
        } else {
          row.insertBefore(draggedCard, target);
        }
        target.classList.remove('drag-over');
        saveOrder();
      });
    }

    restoreOrder();
    initRow('finance-row-2');
    initRow('finance-row-3');
  }

  initDragAndDrop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFinanceInteractions);
} else {
  initFinanceInteractions();
}


/* ===================== JONATHAN - DOCUMENTOS ===================== */
(function() {
  const BUCKET = 'documentos';
  const MAX_SIZE = 10 * 1024 * 1024;
  const ACCEPTED = ['image/jpeg','image/png','image/webp','application/pdf'];
  const STORAGE_KEY = 'painel-pessoal-docs-data';

  const ICON_COLORS = {
    pessoais: 'rgba(59,130,246,0.12)', identificacao: 'rgba(239,68,68,0.12)',
    veiculos: 'rgba(168,85,247,0.12)', financeiros: 'rgba(34,197,94,0.12)',
    profissionais: 'rgba(245,158,11,0.12)', saude: 'rgba(236,72,153,0.12)',
    outros: 'rgba(107,114,128,0.12)',
  };
  const DEFAULT_DOCS = [
    { id: 'rg_cpf', name: 'RG / CPF', desc: 'Registro Geral e Cadastro de Pessoa F\u00edsica', icon: '\uD83E\uDEAA', cat: 'identificacao' },
    { id: 'comprovante_res', name: 'Comprovante de Resid\u00eancia', desc: 'Comprovante de Resid\u00eancia', icon: '\uD83C\uDFE0', cat: 'pessoais' },
    { id: 'reservista', name: 'Certificado Reservista', desc: 'Certificado de Servi\u00e7o Militar', icon: '\uD83C\uDF96\uFE0F', cat: 'identificacao' },
    { id: 'titulo_eleitor', name: 'T\u00edtulo de Eleitor', desc: 'T\u00edtulo de Eleitor', icon: '\uD83D\uDDF3\uFE0F', cat: 'identificacao' },
    { id: 'certidao_nasc', name: 'Certid\u00e3o de Nascimento', desc: 'Certid\u00e3o de Nascimento', icon: '\uD83D\uDC76', cat: 'identificacao' },
    { id: 'certidao_MEI', name: 'Certificado MEI', desc: 'Certificado de Microempreendedor Individual', icon: '\uD83C\uDFE2', cat: 'financeiros' },
    { id: 'cnh', name: 'CNH', desc: 'Carteira Nacional de Habilita\u00e7\u00e3o', icon: '\uD83D\uDE97', cat: 'veiculos' },
    { id: 'passaporte', name: 'Passaporte', desc: 'Passaporte Brasileiro', icon: '\u2708\uFE0F', cat: 'identificacao' },
    { id: 'antec_sp', name: 'Antecedentes Criminais SP', desc: 'Antecedentes Criminais \u2014 Estado de SP', icon: '\uD83D\uDD0D', cat: 'pessoais' },
    { id: 'antec_nacional', name: 'Antecedentes Criminais Nacional', desc: 'Antecedentes Criminais \u2014 \u00c2mbito Nacional', icon: '\uD83D\uDD0D', cat: 'pessoais' },
  ];
  function getSupabase() { return window.supabaseClient || (typeof supabaseClient !== 'undefined' ? supabaseClient : null); }
  function loadDocsData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; } }
  function saveDocsData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function getAllDocs() {
    const saved = loadDocsData();
    return [...DEFAULT_DOCS, ...(saved.customDocs || [])].map(d => ({
      ...d, favorite: saved[d.id] ? !!saved[d.id].favorite : false, updated_at: saved[d.id] ? saved[d.id].updated_at || null : null,
    }));
  }
  function fmtDate(iso) { if (!iso) return '\u2014'; return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  function fmtSize(b) { if (!b) return ''; if (b < 1024) return b+' B'; if (b < 1048576) return (b/1024).toFixed(1)+' KB'; return (b/1048576).toFixed(1)+' MB'; }
  async function getUserId() { var sb = getSupabase(); if (!sb) return null; var s = await sb.auth.getSession(); return s && s.data && s.data.session ? s.data.session.user.id : null; }
  async function listUserFiles() {
    var sb = getSupabase(); if (!sb) return {}; var userId = await getUserId(); if (!userId) return {};
    var result = await sb.storage.from(BUCKET).list(userId, { limit: 100 });
    var data = result.data, error = result.error;
    if (error || !data) return {}; var files = {};
    data.forEach(function(f) {
      var bn = f.name.split('.')[0], ld = bn.lastIndexOf('-');
      if (ld > 0) { var did = bn.substring(0, ld), st = bn.substring(ld + 1);
        if (st === 'pdf' || st === 'img') { if (!files[did]) files[did] = { pdf: null, img: null };
          files[did][st] = { path: userId+'/'+f.name, name:f.name, size:(f.metadata&&f.metadata.size)||0, type:(f.metadata&&f.metadata.mimetype)||'', created_at:f.created_at||f.updated_at||null }; } }
    }); return files;
  }
  async function uploadFile(docId, slotType, file) {
    var sb = getSupabase(); if (!sb) { alert('Supabase n\u00e3o conectado.'); return null; }
    if (ACCEPTED.indexOf(file.type) === -1) { alert('Tipo n\u00e3o aceito.'); return null; }
    if (file.size > MAX_SIZE) { alert('M\u00e1x. 10MB.'); return null; }
    var userId = await getUserId(); if (!userId) { alert('Fa\u00e7a login.'); return null; }
    var ext = file.name.split('.').pop(), path = userId+'/'+docId+'-'+slotType+'.'+ext;
    var result = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: true });
    if (result.error) { alert('Erro: '+result.error.message); return null; }
    var saved = loadDocsData(); if (!saved[docId]) saved[docId] = {};
    saved[docId].updated_at = new Date().toISOString(); saveDocsData(saved); return { path: path };
  }
  async function dlFile(path) { var sb = getSupabase(); if (!sb) return; var result = await sb.storage.from(BUCKET).download(path);
    if (result.error) { alert('Erro: '+result.error.message); return; } var url = URL.createObjectURL(result.data);
    var a = document.createElement('a'); a.href=url; a.download=path.split('/').pop();
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
  async function viewFile(path) { var sb = getSupabase(); if (!sb) return; var result = await sb.storage.from(BUCKET).download(path);
    if (result.error) { alert('Erro: '+result.error.message); return; } if (result.data) window.open(URL.createObjectURL(result.data),'_blank'); }
  async function delFile(path) { var sb = getSupabase(); if (!sb) return; var result = await sb.storage.from(BUCKET).remove([path]); if (result.error) alert('Erro: '+result.error.message); }

  var curFilter='all', curSort='recent', curView='grid', searchQ='', allFiles={};
  function getFiltered(docs) {
    var f = docs.slice();
    if (curFilter!=='all') f = f.filter(function(d){return d.cat===curFilter;});
    if (searchQ) { var q=searchQ.toLowerCase(); f = f.filter(function(d){return d.name.toLowerCase().indexOf(q)!==-1||d.desc.toLowerCase().indexOf(q)!==-1;}); }
    if (curSort==='recent') f.sort(function(a,b){
      if (a.updated_at && !b.updated_at) return -1;
      if (!a.updated_at && b.updated_at) return 1;
      return (b.updated_at||'').localeCompare(a.updated_at||'');
    });
    else if (curSort==='name') f.sort(function(a,b){ return a.name.localeCompare(b.name); });
    else if (curSort==='oldest') f.sort(function(a,b){
      if (a.updated_at && !b.updated_at) return -1;
      if (!a.updated_at && b.updated_at) return 1;
      return (a.updated_at||'').localeCompare(b.updated_at||'');
    });
    return f;
  }
  function renderCards(docs) {
    var grid = document.getElementById('jd-grid'), empty = document.getElementById('jd-empty');
    if (!grid) return; grid.innerHTML = ''; grid.className = 'jd-grid'+(curView==='list'?' list-view':'');
    if (!docs.length) { grid.style.display='none'; if(empty) empty.style.display=''; return; }
    if (empty) empty.style.display='none'; grid.style.display='';
    docs.forEach(function(doc) {
      var pdf=allFiles[doc.id]?allFiles[doc.id].pdf:null, img=allFiles[doc.id]?allFiles[doc.id].img:null;
      var bg=ICON_COLORS[doc.cat]||ICON_COLORS.outros, upd=doc.updated_at||(pdf?pdf.created_at:null)||(img?img.created_at:null);
      var card=document.createElement('div'); card.className='jd-card';
      card.innerHTML='<div class="jd-card-top"><div class="jd-card-icon" style="background:'+bg+'">'+doc.icon+'</div></div>'
        +'<h3 class="jd-card-name">'+doc.name+'</h3><p class="jd-card-desc">'+doc.desc+'</p>'
        +'<div class="jd-card-date">'+(upd?'Atualizado em '+fmtDate(upd):'Sem atualiza\u00e7\u00e3o')+'</div>'
        +'<div class="jd-card-actions"><button class="jd-card-btn primary" data-open="'+doc.id+'">Abrir</button><button class="jd-card-btn" data-dl="'+doc.id+'">Baixar</button>'
        +'<div class="jd-card-menu"><button class="jd-card-menu-btn" data-menu="'+doc.id+'">\u22EE</button><div class="jd-card-dropdown" id="dd-'+doc.id+'"><button data-edit="'+doc.id+'">Editar</button><button class="danger" data-del-doc="'+doc.id+'">Excluir</button></div></div></div>';
      grid.appendChild(card);
    });
  }
  function renderStats(docs) {
    var st=document.getElementById('jd-stats'); if(!st) return;
    var cats={}; docs.forEach(function(d){cats[d.cat]=1;}); var catCount=Object.keys(cats).length;
    var wa=new Date(Date.now()-7*864e5).toISOString(), recent=docs.filter(function(d){return d.updated_at&&d.updated_at>wa;}).length;
    st.innerHTML='<div class="jd-stat"><div class="jd-stat-icon" style="background:rgba(59,130,246,0.12)">\uD83D\uDCC1</div><div class="jd-stat-info"><div class="jd-stat-value">'+docs.length+'</div><div class="jd-stat-label">documentos salvos</div></div></div>'
      +'<div class="jd-stat"><div class="jd-stat-icon" style="background:rgba(168,85,247,0.12)">\uD83D\uDCC2</div><div class="jd-stat-info"><div class="jd-stat-value">'+catCount+'</div><div class="jd-stat-label">categorias diferentes</div></div></div>'
      +'<div class="jd-stat"><div class="jd-stat-icon" style="background:rgba(34,197,94,0.12)">\uD83D\uDD50</div><div class="jd-stat-info"><div class="jd-stat-value">'+recent+'</div><div class="jd-stat-label">atualizados esta semana</div></div></div>';
  }
  var CAT_LABELS = {pessoais:'Pessoais',identificacao:'Identifica\u00e7\u00e3o',veiculos:'Ve\u00edculos',financeiros:'Financeiros',profissionais:'Profissionais',saude:'Sa\u00fade',outros:'Outros'};
  function openDetail(docId) {
    var docs=getAllDocs(), doc=null; for(var i=0;i<docs.length;i++){if(docs[i].id===docId){doc=docs[i];break;}} if(!doc) return;
    var ov=document.getElementById('jd-detail-overlay'), pn=document.getElementById('jd-detail-panel');
    if(!ov||!pn) return;
    var pdf=allFiles[doc.id]?allFiles[doc.id].pdf:null, img=allFiles[doc.id]?allFiles[doc.id].img:null, bg=ICON_COLORS[doc.cat]||ICON_COLORS.outros;
    pn.innerHTML='<button class="jd-detail-back" id="jd-detail-back">\u2190 Voltar</button>'
      +'<div class="jd-detail-head"><div class="jd-detail-icon" style="background:'+bg+'">'+doc.icon+'</div><div><h3 class="jd-detail-name">'+doc.name+'</h3><p class="jd-detail-desc">'+doc.desc+'</p></div></div>'
      +'<div class="jd-detail-meta"><span>\uD83D\uDCC2 '+(CAT_LABELS[doc.cat]||'Outros')+'</span><span>\uD83D\uDCC5 '+(doc.updated_at?fmtDate(doc.updated_at):'Sem atualiza\u00e7\u00e3o')+'</span></div>'
      +'<div class="jd-detail-files">'
      +(pdf?'<div class="jd-detail-file"><div class="jd-detail-file-header"><span class="jd-detail-file-icon">\uD83D\uDCC4</span><span class="jd-detail-file-name">PDF</span><span class="jd-detail-file-size">'+fmtSize(pdf.size)+'</span></div><div class="jd-detail-file-actions"><button onclick="window.jdView(\''+pdf.path+'\')">Abrir</button><button onclick="window.jdDownload(\''+pdf.path+'\')">Baixar</button><button onclick="window.jdUpload(\''+doc.id+'\',\'pdf\')">Substituir</button><button class="danger" onclick="window.jdRemoveFile(\''+doc.id+'\',\'pdf\',\''+pdf.path+'\')">Remover</button></div></div>':'<div class="jd-detail-file-empty" onclick="window.jdUpload(\''+doc.id+'\',\'pdf\')"><p>\uD83D\uDCC4 Clique para enviar PDF</p></div>')
      +(img?'<div class="jd-detail-file"><div class="jd-detail-file-header"><span class="jd-detail-file-icon">\uD83D\uDDBC\uFE0F</span><span class="jd-detail-file-name">Imagem</span><span class="jd-detail-file-size">'+fmtSize(img.size)+'</span></div><div class="jd-detail-file-actions"><button onclick="window.jdView(\''+img.path+'\')">Abrir</button><button onclick="window.jdDownload(\''+img.path+'\')">Baixar</button><button onclick="window.jdUpload(\''+doc.id+'\',\'img\')">Substituir</button><button class="danger" onclick="window.jdRemoveFile(\''+doc.id+'\',\'img\',\''+img.path+'\')">Remover</button></div></div>':'<div class="jd-detail-file-empty" onclick="window.jdUpload(\''+doc.id+'\',\'img\')"><p>\uD83D\uDDBC\uFE0F Clique para enviar imagem</p></div>')
      +'</div>';
    ov.style.display='';
    pn.querySelector('#jd-detail-back').addEventListener('click',function(){ov.style.display='none';refreshAll();});
    ov.addEventListener('click',function(e){if(e.target===ov){ov.style.display='none';refreshAll();}});
  }
  function openAddModal() {
    var ov=document.getElementById('jd-modal-overlay'), md=document.getElementById('jd-modal');
    if(!ov||!md) return;
    var catOpts=''; Object.keys(CAT_LABELS).forEach(function(k){catOpts+='<option value="'+k+'">'+CAT_LABELS[k]+'</option>';});
    md.innerHTML='<h3>Adicionar documento</h3>'
      +'<div class="jd-modal-field"><label>Nome</label><input id="jd-m-name" placeholder="Ex: Cart\u00e3o de vacina\u00e7\u00e3o" /></div>'
      +'<div class="jd-modal-field"><label>Descri\u00e7\u00e3o</label><input id="jd-m-desc" placeholder="Descri\u00e7\u00e3o curta" /></div>'
      +'<div class="jd-modal-field"><label>Categoria</label><select id="jd-m-cat">'+catOpts+'</select></div>'
      +'<div class="jd-modal-field"><label>\u00cdcone (emoji)</label><input id="jd-m-icon" placeholder="Ex: \uD83D\uDCCB" maxlength="4" /></div>'
      +'<div class="jd-modal-actions"><button class="cancel" id="jd-m-cancel">Cancelar</button><button class="save" id="jd-m-save">Salvar</button></div>';
    ov.style.display='';
    md.querySelector('#jd-m-cancel').addEventListener('click',function(){ov.style.display='none';});
    md.querySelector('#jd-m-save').addEventListener('click',function(){
      var n=md.querySelector('#jd-m-name').value.trim(), d=md.querySelector('#jd-m-desc').value.trim();
      var c=md.querySelector('#jd-m-cat').value, ic=md.querySelector('#jd-m-icon').value.trim()||'\uD83D\uDCCB';
      if(!n){alert('Digite o nome.');return;}
      var saved=loadDocsData(); if(!saved.customDocs) saved.customDocs=[];
      saved.customDocs.push({id:'custom_'+Date.now(),name:n,desc:d,icon:ic,cat:c});
      saveDocsData(saved); ov.style.display='none'; refreshAll();
    });
    ov.addEventListener('click',function(e){if(e.target===ov) ov.style.display='none';});
  }
  function openEditModal(doc) {
    var ov=document.getElementById('jd-modal-overlay'), md=document.getElementById('jd-modal');
    if(!ov||!md) return;
    var catOpts=''; Object.keys(CAT_LABELS).forEach(function(k){catOpts+='<option value="'+k+'"'+(doc.cat===k?' selected':'')+'>'+CAT_LABELS[k]+'</option>';});
    md.innerHTML='<h3>Editar documento</h3>'
      +'<div class="jd-modal-field"><label>Nome</label><input id="jd-m-name" value="'+doc.name+'" /></div>'
      +'<div class="jd-modal-field"><label>Descri\u00e7\u00e3o</label><input id="jd-m-desc" value="'+doc.desc+'" /></div>'
      +'<div class="jd-modal-field"><label>Categoria</label><select id="jd-m-cat">'+catOpts+'</select></div>'
      +'<div class="jd-modal-field"><label>\u00cdcone (emoji)</label><input id="jd-m-icon" value="'+doc.icon+'" maxlength="4" /></div>'
      +'<div class="jd-modal-actions"><button class="cancel" id="jd-m-cancel">Cancelar</button><button class="save" id="jd-m-save">Salvar</button></div>';
    ov.style.display='';
    md.querySelector('#jd-m-cancel').addEventListener('click',function(){ov.style.display='none';});
    md.querySelector('#jd-m-save').addEventListener('click',function(){
      var n=md.querySelector('#jd-m-name').value.trim(), d=md.querySelector('#jd-m-desc').value.trim();
      var c=md.querySelector('#jd-m-cat').value, ic=md.querySelector('#jd-m-icon').value.trim()||'\uD83D\uDCCB';
      if(!n){alert('Digite o nome.');return;}
      var saved=loadDocsData(); var isDef=false;
      for(var i=0;i<DEFAULT_DOCS.length;i++){if(DEFAULT_DOCS[i].id===doc.id){isDef=true;break;}}
      if(isDef){if(!saved[doc.id]) saved[doc.id]={}; saved[doc.id].name=n; saved[doc.id].desc=d; saved[doc.id].cat=c; saved[doc.id].icon=ic;}
      else{var cus=saved.customDocs||[]; for(var j=0;j<cus.length;j++){if(cus[j].id===doc.id){cus[j].name=n;cus[j].desc=d;cus[j].cat=c;cus[j].icon=ic;break;}}}
      saveDocsData(saved); ov.style.display='none'; refreshAll();
    });
    ov.addEventListener('click',function(e){if(e.target===ov) ov.style.display='none';});
  }
  async function refreshAll() { allFiles=await listUserFiles(); var docs=getAllDocs(); renderCards(getFiltered(docs)); renderStats(docs); }
  window.jdView = function(p){viewFile(p);};
  window.jdDownload = function(p){dlFile(p);};
  window.jdUpload = function(docId,st){var inp=document.createElement('input');inp.type='file';inp.accept=st==='pdf'?'.pdf':'.jpg,.jpeg,.png,.webp';
    inp.addEventListener('change',function(){if(!inp.files.length)return;uploadFile(docId,st,inp.files[0]).then(async function(){await refreshAll();openDetail(docId);});});inp.click();};
  window.jdRemoveFile = function(docId,st,path){if(!confirm('Remover este arquivo?'))return;delFile(path).then(async function(){
    var s=loadDocsData();if(s[docId]){s[docId].updated_at=new Date().toISOString();saveDocsData(s);}await refreshAll();openDetail(docId);});};

  function initJD() {
    var dateEl = document.getElementById('jd-header-date');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase();
    var searchEl = document.getElementById('jd-search-input');
    if (searchEl) searchEl.addEventListener('input',function(e){searchQ=e.target.value;refreshAll();});
    document.querySelectorAll('.jd-filter').forEach(function(b){b.addEventListener('click',function(){
      document.querySelectorAll('.jd-filter').forEach(function(x){x.classList.remove('active');});b.classList.add('active');curFilter=b.dataset.cat;refreshAll();});});
    var sortEl = document.getElementById('jd-sort');
    if (sortEl) sortEl.addEventListener('change',function(e){curSort=e.target.value;refreshAll();});
    var gridBtn = document.getElementById('jd-view-grid');
    if (gridBtn) gridBtn.addEventListener('click',function(){curView='grid';gridBtn.classList.add('active');document.getElementById('jd-view-list').classList.remove('active');refreshAll();});
    var listBtn = document.getElementById('jd-view-list');
    if (listBtn) listBtn.addEventListener('click',function(){curView='list';listBtn.classList.add('active');document.getElementById('jd-view-grid').classList.remove('active');refreshAll();});
    var addBtn = document.getElementById('jd-add-btn');
    if (addBtn) addBtn.addEventListener('click',openAddModal);
    var gridEl = document.getElementById('jd-grid');
    if (gridEl) gridEl.addEventListener('click',function(e){
      var ob=e.target.closest('[data-open]');if(ob){var did4=ob.dataset.open;var f=allFiles[did4];if(f&&f.pdf){viewFile(f.pdf.path);}else{openDetail(did4);}return;}
      var db=e.target.closest('[data-dl]');if(db){e.stopPropagation();var did2=db.dataset.dl;var f2=allFiles[did2];if(f2&&f2.pdf){dlFile(f2.pdf.path);}else if(f2&&f2.img){dlFile(f2.img.path);}return;}
      var mb=e.target.closest('[data-menu]');if(mb){e.stopPropagation();openDetail(mb.dataset.menu);return;}
      var eb=e.target.closest('[data-edit]');if(eb){e.stopPropagation();var docs=getAllDocs();for(var i=0;i<docs.length;i++){if(docs[i].id===eb.dataset.edit){openEditModal(docs[i]);break;}}return;}
      var xb=e.target.closest('[data-del-doc]');if(xb){e.stopPropagation();if(!confirm('Excluir este documento e seus arquivos?'))return;var did3=xb.dataset.delDoc;
        var p2=allFiles[did3]?allFiles[did3].pdf:null,im2=allFiles[did3]?allFiles[did3].img:null;if(p2)delFile(p2.path);if(im2)delFile(im2.path);
        var s2=loadDocsData();delete s2[did3];s2.customDocs=(s2.customDocs||[]).filter(function(d){return d.id!==did3;});saveDocsData(s2);refreshAll();return;}
    });
    document.addEventListener('click',function(e){if(!e.target.closest('.jd-card-menu'))document.querySelectorAll('.jd-card-dropdown.open').forEach(function(d){d.classList.remove('open');});});
    refreshAll();
  }
  document.addEventListener('DOMContentLoaded', initJD);
})();
