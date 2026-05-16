import { CatalogPage } from "@/app/_components/CatalogPage";

export const metadata = { title: "Брюки — MVXIII" };

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PantsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <CatalogPage categorySlug="pants" title="Брюки" searchParams={params} />
  );
}
