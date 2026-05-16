import { CatalogPage } from "@/app/_components/CatalogPage";

export const metadata = { title: "Костюмы — MVXIII" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuitsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CatalogPage categorySlug="suits" title="Костюмы" searchParams={params} />
  );
}
