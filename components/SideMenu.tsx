import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "@/hooks";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: (href: string) => void;
  children?: React.ReactNode;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose, onLinkClick, children }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop_light_green flex flex-col gap-6"
      >
        <div className="flex items-center justify-between gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button
            onClick={onClose}
            className="hover:text-shop_light_green hoverEffect"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {headerData?.map((item) => (
            <div
              key={item?.title}
              onClick={() => onLinkClick(item?.href)}
              className={`hover:text-shop_light_green hoverEffect cursor-pointer ${
                pathname === item?.href && "text-white"
              }`}
            >
              {item?.title}
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};

export default SideMenu;
