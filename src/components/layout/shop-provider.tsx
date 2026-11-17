"use client";
import { useEffect } from "react";
import { useShop } from "@/stores/shop";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useShop(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return <>{children}<CartDrawer /><Toaster position="bottom-center" closeButton /></>;
}
