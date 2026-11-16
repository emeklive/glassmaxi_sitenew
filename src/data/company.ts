/**
 * Dados institucionais da Glassmaxi. Cada campo traz a fonte de onde saiu.
 * Nada aqui foi estimado: o que não tem fonte confirmada fica em `pendentes` e NÃO é exibido no site.
 * Auditoria realizada em 12/11/2026 — ver docs/AUDITORIA.md.
 */
export const company = {
  name: "Glassmaxi",
  fullName: "Glassmaxi Indústria",
  slogan: "Engenharia, tecnologia e precisão em cada detalhe.",
  subSlogan: "Soluções em vidro para transformar projetos em grandes realizações.",
  city: "Fortaleza",
  state: "CE",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://glassmaxi.com.br",

  // Fonte: glassmaxi.com.br (link wa.me e bloco de contato), conferido em 12/11/2026.
  whatsapp: { number: "5585996659608", display: "(85) 99665-9608" },
  email: "atendimento@glassmaxi.com.br",
  // Fonte: artes oficiais da empresa (carrosséis "Vidro Laminado" e "Por trás do vidro"),
  // perfil no Google Maps e cadastro de associada da Abravidro.
  phone: { number: "+558534740613", display: "(85) 3474-0613" },
  // Fonte: incorporação do Instagram no site oficial e assinatura das artes (@glassmaxividros).
  instagram: { handle: "@glassmaxividros", url: "https://www.instagram.com/glassmaxividros/" },

  // Fonte: perfil da empresa no Google Maps, cadastro da Abravidro e registros públicos de CNPJ (mesmo logradouro e CEP).
  // O bairro aparece como "Barroso" no Google Maps e "Cajazeiras" nos cadastros: confirmar com a empresa.
  address: {
    street: "Rua Jornalista Antônio Pontes Tavares, 809",
    district: "Cajazeiras",
    city: "Fortaleza",
    state: "CE",
    zip: "60864-590",
    geo: { lat: -3.8136421, lng: -38.5066265 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Glassmaxi%2C+Rua+Jornalista+Ant%C3%B4nio+Pontes+Tavares%2C+809%2C+Fortaleza+-+CE",
    embedUrl: "https://www.google.com/maps?q=-3.8136421,-38.5066265&z=16&output=embed",
  },
  // Fonte: perfil da empresa no Google Maps (12/11/2026). Confirmar com a empresa antes de publicar.
  hours: { label: "Segunda a sexta, das 8h às 17h", schema: "Mo-Fr 08:00-17:00" },

  // Fonte: glassmaxi.com.br, seção "Sobre".
  structure: [
    { title: "Fornos de vidro temperado", text: "Têmpera feita em fornos próprios." },
    { title: "Forno de vidro laminado sob medida", text: "Laminação conforme a medida de cada projeto." },
    { title: "Mesas de corte automatizadas", text: "Corte preciso em cada peça." },
    { title: "Acabamento de alto padrão", text: "Lapidação para projetos personalizados." },
  ],
  services: [
    { title: "Corte e lapidação", text: "Precisão milimétrica e acabamento para projetos personalizados e de alto padrão." },
    { title: "Vidro temperado", text: "Alta resistência térmica e mecânica, para portas, fachadas, boxes e áreas externas." },
    { title: "Vidro laminado", text: "Segurança reforçada com película interna, proteção acústica e controle solar." },
    { title: "Fachadas e estruturas", text: "Projetos para edifícios, com design arquitetônico e durabilidade." },
  ],

  timeline: [
    {
      year: "2008",
      title: "Início das operações no Ceará",
      text: "A fábrica de Fortaleza começa a operar em outubro de 2008, com fabricação, processamento e distribuição de vidros.",
      source: "Diário do Nordeste, 11/12/2008; Abravidro, cadastro de associada",
    },
    {
      year: "2018",
      title: "Exportação",
      text: "A empresa inicia a exportação de vidros de alto valor agregado.",
      source: "Abravidro, cadastro de associada",
    },
    {
      year: "2020",
      title: "Certificação Inmetro dos temperados",
      text: "Os vidros temperados de 4, 6, 8 e 10 mm recebem a certificação Inmetro, conforme a ABNT NBR 14698.",
      source: "Abravidro / revista O Vidroplano, 27/01/2020",
    },
  ],

  certification: {
    title: "Vidros temperados com certificação Inmetro",
    text: "Em janeiro de 2020 a Abravidro registrou a certificação Inmetro dos vidros temperados Glassmaxi de 4, 6, 8 e 10 mm, com referência na norma ABNT NBR 14698.",
    source: "Abravidro, “Glassmaxi (CE) recebe certificação do Inmetro”, 27/01/2020",
    sourceUrl: "https://abravidro.org.br/noticia/glassmaxi-ce-recebe-certificacao-do-inmetro",
  },

  // Fonte: Google Play. A descrição da loja fala em aplicativo de gestão; não cita recursos para vidraceiros.
  app: {
    name: "Glassmaxi conceito",
    store: "Google Play",
    url: "https://play.google.com/store/apps/details?id=com.glassmaxi",
    storeDescription: "Aplicativo de gestão publicado pela Glassmaxi na Google Play.",
  },

  /** Informações que existem em fontes antigas ou de terceiros e precisam de confirmação. Não são exibidas. */
  pendentes: [
    "Área industrial (12.800 m² em reportagem de 2008; “mais de 12.000 m²” no cadastro da Abravidro)",
    "Número de colaboradores (“cerca de 200” no cadastro da Abravidro)",
    "Escopo e validade atuais da certificação Inmetro (número do certificado, organismo certificador)",
    "Bairro do endereço: Barroso (Google Maps) ou Cajazeiras (cadastros)",
    "Horário de atendimento (hoje vem só do perfil no Google Maps)",
    "Razão social e CNPJ a exibir na política de privacidade",
    "Recursos do aplicativo para vidraceiros (orçamento, cadastro de clientes, consulta de medidas)",
  ],
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${company.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
