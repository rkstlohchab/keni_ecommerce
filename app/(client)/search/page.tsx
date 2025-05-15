import Container from "@/components/Container";
import NoProductAvailable from "@/components/NoProductAvailable";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";

interface SearchPageProps {
  searchParams: { q: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: searchQuery } = searchParams;

  const query = `*[_type == "product" && (name match $searchQuery || description match $searchQuery)] {
    ...,
    "categories": categories[]->title
  }`;

  const products = await client.fetch<Product[]>(query, {
    searchQuery: `*${searchQuery}*`,
  });

  return (
    <Container className="py-10">
      <Title className="mb-5">
        Search Results for: <span className="font-bold">{searchQuery}</span>
      </Title>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductAvailable 
          className="bg-white mt-0" 
          message={`No products found matching "${searchQuery}"`}
        />
      )}
    </Container>
  );
}