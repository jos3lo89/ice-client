import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg dark:border-slate-800">
        <CardHeader className="text-center">
          {/* Ilustración SVG integrada */}
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
            <Ghost className="h-16 w-16 text-slate-400 transition-transform duration-500 hover:scale-110 hover:text-slate-600 dark:hover:text-slate-200" />
          </div>

          <CardTitle className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">
            404
          </CardTitle>
          <CardDescription className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            ¡Uy! Página no encontrada
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Parece que te has perdido en el ciberespacio. La página que buscas
            no existe o ha sido movida.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {/* Botón Volver */}
            <Button
              variant="link"
              className="w-full sm:w-auto"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Button>

            {/* Botón Inicio */}
            <Button asChild className="w-full sm:w-auto">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
