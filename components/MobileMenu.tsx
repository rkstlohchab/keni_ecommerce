/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AlignLeft, Logs } from "lucide-react";
import React, { useState } from "react";
import SideMenu from "./SideMenu";
// import SearchBar from "./SearchBar";
import FavoriteButton from "./FavoriteButton";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import SignIn from "./SignIn";
import { useRouter } from "next/navigation";

interface SerializedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  email: string;
}

interface MobileMenuProps {
  user: SerializedUser | null;
  orders: any[];
}

const MobileMenu = ({ user, orders }: MobileMenuProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    setIsSidebarOpen(false);
    router.push(href);
  };

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLinkClick={handleLinkClick}
        >
          <div className="flex flex-row items-center justify-between mt-6 gap-4 px-2">
            <FavoriteButton />
            {user && (
              <div
                onClick={() => handleLinkClick("/orders")}
                className="group relative hover:text-shop_light_green hoverEffect cursor-pointer"
              >
                <Logs />
                <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {orders?.length ? orders?.length : 0}
                </span>
              </div>
            )}
            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {!user && <SignIn />}
            </ClerkLoaded>
          </div>
        </SideMenu>
      </div>
    </>
  );
};

export default MobileMenu;
