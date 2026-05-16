import { CatalogPage } from "@/app/_components/CatalogPage";

export const metadata = { title: "Рубашки — MVXIII" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShirtsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CatalogPage categorySlug="shirts" title="Рубашки" searchParams={params} />
  );
}
