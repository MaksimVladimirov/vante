import { CatalogPage } from "@/app/_components/CatalogPage";

export const metadata = { title: "Аксессуары — MVXIII" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccessoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CatalogPage
      categorySlug="accessories"
      title="Аксессуары"
      searchParams={params}
    />
  );
}
