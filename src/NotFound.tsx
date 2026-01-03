import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <div className="relative mb-8">
        {/* Círculo de fondo decorativo */}
        <div className="absolute inset-0 scale-150 blur-3xl opacity-10 bg-primary rounded-full" />

        <FileQuestion className="relative h-24 w-24 text-muted-foreground animate-pulse" />
      </div>

      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
        404 - Página no encontrada
      </h1>

      <p className="mt-4 max-w-[500px] text-muted-foreground md:text-xl">
        Lo sentimos, la página que estás buscando no existe o ha sido movida a
        otra ubicación.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>

        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Ir al Inicio
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        Código de error: <span className="font-mono">ERR_PAGE_NOT_FOUND</span>
      </div>
    </div>
  );
};
export default NotFound;
