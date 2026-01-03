import { Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type Props = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  logout: () => void;
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
  }[];
};

const WaiterMobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  logout,
  navigation,
}: Props) => {
  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}

          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
export default WaiterMobileMenu;
