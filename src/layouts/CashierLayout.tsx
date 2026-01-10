import LogOutAlert from "@/components/LogOutAlert";
import MobileCashierMenuSheet from "@/components/MobileCashierMenuSheet";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import {
  DollarSign,
  FileText,
  Home,
  LogOut,
  Receipt,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const CashierLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Inicio",
      href: "/cashier",
      icon: Home,
      active: location.pathname === "/cashier",
    },
    {
      name: "Caja",
      href: "/cashier/cash-register",
      icon: DollarSign,
      active: location.pathname === "/cashier/cash-register",
    },
    {
      name: "Cobrar",
      href: "/cashier/orders",
      icon: Receipt,
      active: location.pathname === "/cashier/orders",
    },
    {
      name: "Ventas",
      href: "/cashier/sales",
      icon: FileText,
      active: location.pathname === "/cashier/sales",
    },

    {
      name: "Mesas",
      href: "/cashier/mesas",
      icon: UtensilsCrossed,
      active: location.pathname === "/cashier/mesas",
    },
    {
      name: "Movimientos",
      href: "/cashier/movements",
      icon: TrendingUp,
      active: location.pathname === "/cashier/movements",
    },
  ];
  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden h-screen w-64 border-r bg-card md:block">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b p-6">
            <h1 className="text-xl font-bold">ICE MANKORA</h1>
            <p className="text-sm text-muted-foreground">Gestión de caja</p>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="border-t p-4 shrink-0">
            <div className="mb-2 space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>

            <LogOutAlert>
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </LogOutAlert>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b bg-background md:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <MobileCashierMenuSheet
              navigation={navigation}
              open={mobileMenuOpen}
              setOpen={setMobileMenuOpen}
            />

            <h1 className="text-lg font-bold">ICE MANKORA</h1>

            <LogOutAlert>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </LogOutAlert>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default CashierLayout;
