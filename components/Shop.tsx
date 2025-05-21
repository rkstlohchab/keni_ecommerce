"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  useEffect(() => {
    // Using the same approach as the working ProductGrid component
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Start with a basic query
        let baseQuery = `*[_type == "product"`;
        
        // Add filter conditions
        let conditions = [];
        
        // Category filter
        if (selectedCategory) {
          conditions.push(`count(categories[]->[slug.current=="${selectedCategory}"]) > 0`);
        }
        
        // Brand filter
        if (selectedBrand) {
          conditions.push(`brand->slug.current=="${selectedBrand}"`);
        }
        
        // Price filter
        if (selectedPrice) {
          const [min, max] = selectedPrice.split("-").map(Number);
          const maxPrice = max === 1000 ? 10000 : max; // Handle "1000+" case
          conditions.push(`price >= ${min} && price <= ${maxPrice}`);
        }
        
        // Complete the query
        let query = baseQuery;
        if (conditions.length > 0) {
          query += ` && ${conditions.join(" && ")}`;
        }
        query += `] | order(name asc) {
          ...,
          "categories": categories[]->title,
          "brand": brand->title
        }`;
        
        console.log("Executing query:", query);
        
        // Fetch products with a simplified approach
        const data = await client.fetch(query);
        console.log("Products found:", data?.length || 0);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products.map((product) => (
                    <AnimatePresence key={product._id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <ProductCard key={product._id} product={product} />
                      </motion.div>
                    </AnimatePresence>
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
