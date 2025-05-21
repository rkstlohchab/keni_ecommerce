"use client";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import NoProductAvailable from "@/components/NoProductAvailable";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const DealPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        const query = `*[_type == 'product' && (status == 'hot' || status == 'sale')] | order(name asc){
          ...,
          "categories": categories[]->title,
          "brand": brand->title
        }`;
        
        const response = await client.fetch(query);
        setProducts(response || []);
      } catch (error) {
        console.error("Error fetching deal products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealProducts();
  }, []);

  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>
        
        {loading ? (
          <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white rounded-lg">
            <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
            <p className="font-semibold tracking-wide text-base">
              Loading hot deals...
            </p>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable className="bg-white mt-0" />
        )}
      </Container>
    </div>
  );
};

export default DealPage;
