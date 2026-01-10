import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorRequestAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Error al cargar datos. Intenta nuevamente.
      </AlertDescription>
    </Alert>
  )
}
export default ErrorRequestAlert