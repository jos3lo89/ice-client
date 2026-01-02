import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import PinLogin from "../components/PinLogin";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  const [showPinDialog, setShowPinDialog] = useState(false);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">
              ICE
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">ICE MANKORA</CardTitle>
          <CardDescription>Sistema de Gestión</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                o continúa con
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPinDialog(true)}
          >
            <Hash className="mr-2 h-4 w-4" />
            Ingresar con PIN
          </Button>

          <PinLogin open={showPinDialog} onOpenChange={setShowPinDialog} />
        </CardContent>

        <div className="px-6 pb-6 text-center text-xs text-muted-foreground">
          <p>© 2026 ICE MANKORA - v1.0.0</p>
        </div>
      </Card>
    </div>
  );
};
export default LoginPage;
