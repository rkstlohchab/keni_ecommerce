"use client";
import React, { useEffect, useState } from "react";
import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import { Category, BRANDS_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import Container from "@/components/Container";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

const ShopPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BRANDS_QUERYResult>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories directly using client
        const categoriesQuery = `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;
        const categoriesData = await client.fetch(categoriesQuery);
        setCategories(categoriesData || []);

        // Fetch brands directly using client
        const brandsQuery = `*[_type=='brand'] | order(name asc)`;
        const brandsData = await client.fetch(brandsQuery);
        setBrands(brandsData || []);
      } catch (err) {
        console.error("Error loading shop data:", err);
        setError("Failed to load shop data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
          <p className="mt-4 text-lg">Loading Shop...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            className="mt-4 px-6 py-2 bg-shop_dark_green text-white rounded-md hover:bg-shop_light_green"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-white">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
