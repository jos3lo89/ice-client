import { Button } from "@/components/ui/button";

import UserNavMenu from "@/components/UserNavMenu";
import WaiterMobileMenu from "@/components/WaiterMobileMenu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { ClipboardList, User, UtensilsCrossed } from "lucide-react";
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
    <div className="min-h-screen bg-background">
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

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="h-auto w-full flex-col gap-1 py-2"
                size="sm"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Button>
            </Link>
          ))}

          <Button
            variant="ghost"
            className="h-auto flex-col gap-1 py-2"
            size="sm"
            onClick={() => logout.mutate()}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};
export default WaiterLayout;
