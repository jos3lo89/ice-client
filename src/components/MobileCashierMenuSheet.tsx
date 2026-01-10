import { Menu, type LucideIcon } from "lucide-react";
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
  navigation: Array<{
    name: string;
    href: string;
    active: boolean;
    icon: LucideIcon;
  }>;
  open: boolean;
  setOpen: (value: boolean) => void;
};

const MobileCashierMenuSheet = ({ navigation, open, setOpen }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Lista de rutas</SheetDescription>
        </SheetHeader>
        <nav className="space-y-2 px-4">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} onClick={() => setOpen(false)}>
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
      </SheetContent>
    </Sheet>
  );
};
export default MobileCashierMenuSheet;
