import Link from "next/link";
import { PageHero } from "@/components/site/Blocks";

export default function NotFound() {
  return (
    <PageHero title="Página não encontrada." lede="O endereço pode ter mudado. Volte ao início ou vá direto aos produtos.">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        <Link className="btn btn-primary" href="/">Ir para o início</Link>
        <Link className="btn btn-ghost-light" href="/produtos/">Ver produtos</Link>
      </div>
    </PageHero>
  );
}
