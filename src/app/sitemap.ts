import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { families } from "@/data/families";
import { articles } from "@/data/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/a-glassmaxi/", "/produtos/", "/catalogo/", "/tecnologia-e-processos/", "/experiencia-3d/", "/aplicacoes/", "/obras/", "/qualidade/", "/app/", "/orcamento/", "/trabalhe-conosco/", "/contato/", "/conteudos/", "/politica-de-privacidade/", "/politica-de-cookies/",
    ...families.map((f) => `/produtos/${f.id}/`), ...articles.map((a) => `/conteudos/${a.slug}/`)];
  return paths.map((p) => ({ url: `${company.siteUrl}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : p.startsWith("/produtos") ? 0.9 : 0.6 }));
}
