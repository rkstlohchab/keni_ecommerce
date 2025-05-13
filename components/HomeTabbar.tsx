"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
import { useState } from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {/* Mobile Dropdown */}
        <div className="md:hidden relative w-48">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between border border-shop_light_green/30 px-4 py-2 rounded-full bg-shop_light_green/10"
          >
            <span>{selectedTab}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-12 left-0 w-full bg-white border border-shop_light_green/30 rounded-lg shadow-lg z-50">
              {productType?.map((item) => (
                <button
                  key={item?.title}
                  onClick={() => {
                    onTabSelect(item?.title);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-shop_light_green/10 ${
                    selectedTab === item?.title ? "bg-shop_light_green/10" : ""
                  }`}
                >
                  {item?.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${
                selectedTab === item?.title
                  ? "bg-shop_light_green text-white border-shop_light_green"
                  : "bg-shop_light_green/10"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
