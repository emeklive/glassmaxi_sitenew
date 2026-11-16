/**
 * Conteúdos editoriais iniciais, escritos com conhecimento técnico geral sobre vidro.
 * Não trazem dados de desempenho de produtos Glassmaxi. Revisar com a equipe técnica antes de publicar.
 */
export interface Article {
  slug: string;
  title: string;
  summary: string;
  topic: "Vidro" | "Arquitetura" | "Processamento" | "Aplicações";
  body: { h?: string; p: string[] }[];
}

export const articles: Article[] = [
  {
    slug: "temperado-ou-laminado",
    title: "Temperado ou laminado: qual a diferença?",
    summary: "Os dois são vidros de segurança, mas protegem de formas diferentes.",
    topic: "Vidro",
    body: [
      { p: ["Temperado e laminado são chamados de vidros de segurança porque reduzem o risco de ferimento quando quebram. A forma como cada um faz isso é o que define onde usar."] },
      { h: "O temperado", p: ["É uma lâmina única que passa por aquecimento e resfriamento controlado. O tratamento cria tensões internas que aumentam a resistência mecânica e térmica do vidro.", "Quando quebra, o temperado se desfaz em muitos fragmentos pequenos. Por isso, todo corte, furo ou recorte precisa ser feito antes do forno."] },
      { h: "O laminado", p: ["São duas ou mais lâminas unidas por uma película interna. Se o vidro quebra, a película segura os fragmentos e o vão continua fechado.", "É a escolha comum quando o vidro fica acima das pessoas ou protege contra quedas, como em coberturas e guarda-corpos."] },
      { h: "E os dois juntos?", p: ["É possível laminar lâminas temperadas para somar resistência e retenção de fragmentos. A composição certa depende do projeto e das normas técnicas, como a ABNT NBR 7199, que trata do vidro na construção civil."] },
    ],
  },
  {
    slug: "como-funciona-a-tempera",
    title: "Como funciona a têmpera do vidro",
    summary: "O que acontece dentro do forno e por que o temperado não pode ser cortado depois.",
    topic: "Processamento",
    body: [
      { p: ["A têmpera é um tratamento térmico. A peça, já cortada e lapidada, é aquecida por inteiro e depois resfriada rapidamente com jatos de ar."] },
      { h: "Compressão por fora, tração por dentro", p: ["As superfícies esfriam e endurecem primeiro. O interior esfria depois e, ao contrair, puxa as superfícies. O resultado é um vidro com as faces comprimidas e o núcleo tracionado.", "Essa compressão superficial é o que torna o temperado mais resistente a impactos e a variações de temperatura do que o vidro comum de mesma espessura."] },
      { h: "Por que não dá para cortar depois", p: ["Qualquer corte ou furo rompe o equilíbrio entre compressão e tração, e a peça inteira se fragmenta. Medidas, furos e recortes são definidos antes de o vidro entrar no forno."] },
      { h: "Norma", p: ["No Brasil, o vidro temperado segue a ABNT NBR 14698."] },
    ],
  },
  {
    slug: "vidro-em-fachadas",
    title: "O que observar ao especificar vidro para fachadas",
    summary: "Segurança, conforto e estética entram juntos na decisão.",
    topic: "Arquitetura",
    body: [
      { p: ["A fachada é onde o vidro mais trabalha: recebe sol, vento e chuva, e define a aparência do edifício."] },
      { h: "Segurança primeiro", p: ["O tipo de vidro depende da altura, do sistema de fixação e do risco de queda de fragmentos. O projeto deve seguir as normas técnicas aplicáveis."] },
      { h: "Controle solar e conforto", p: ["Vidros refletivos e composições laminadas ou insuladas ajudam a controlar a entrada de calor e de luz. O desempenho de cada produto está na ficha técnica: peça os dados ao fabricante antes de especificar."] },
      { h: "Tamanho das peças", p: ["Chapas maiores reduzem as emendas e mudam a leitura da fachada, mas pedem logística e instalação compatíveis. Converse com a indústria sobre as dimensões viáveis ainda na fase de projeto."] },
    ],
  },
  {
    slug: "como-pedir-orcamento-de-vidro",
    title: "Como pedir um orçamento de vidro sem idas e vindas",
    summary: "As informações que a fábrica precisa para responder rápido.",
    topic: "Aplicações",
    body: [
      { p: ["Um pedido completo evita retrabalho. Antes de enviar, separe estas informações."] },
      { h: "Para cada peça", p: ["Linha do vidro, cor, espessura ou composição, largura e altura em milímetros e quantidade.", "Se houver furos, recortes ou acabamento de borda específico, descreva ou envie o desenho."] },
      { h: "Sobre a obra", p: ["Cidade de entrega, tipo de aplicação e prazo desejado ajudam a equipe a orientar a melhor solução."] },
      { h: "Pelo site", p: ["O orçamento do site monta a lista de peças, soma a área e estima o peso. Ao final, o pedido segue pronto para o WhatsApp da equipe."] },
    ],
  },
];
