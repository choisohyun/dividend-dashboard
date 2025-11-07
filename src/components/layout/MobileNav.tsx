"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Wallet,
  Upload,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "보유현황", href: "/holdings", icon: PieChart },
  { name: "배당내역", href: "/dividends", icon: TrendingUp },
  { name: "입출금", href: "/cash", icon: Wallet },
  { name: "데이터 임포트", href: "/import", icon: Upload },
  { name: "설정", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:hidden">
      <nav className="flex justify-around">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                isActive ? "text-gray-900" : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}



