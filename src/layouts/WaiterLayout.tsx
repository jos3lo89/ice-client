import { Button } from "@/components/ui/button";

import UserNavMenu from "@/components/UserNavMenu";
import WaiterMobileMenu from "@/components/WaiterMobileMenu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { ClipboardList, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const WaiterLayout = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Mesas",
      href: "/tables",
      icon: UtensilsCrossed,
      active: location.pathname === "/tables",
    },
    {
      name: "Mis Órdenes",
      href: "/orders",
      icon: ClipboardList,
      active: location.pathname === "/orders",
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <WaiterMobileMenu
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            logout={() => logout.mutate()}
            navigation={navigation}
          />

          <h1 className="text-lg font-bold">ICE MANKORA</h1>

          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button variant={item.active ? "secondary" : "ghost"} size="sm">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <UserNavMenu user={user} logout={() => logout.mutate()} />
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 md:pb-4">
        <Outlet />
      </main>
    </div>
  );
};
export default WaiterLayout;
