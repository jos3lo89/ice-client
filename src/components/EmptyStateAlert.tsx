import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const EmptyStateAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No tienes datos en este momento
      </AlertDescription>
    </Alert>
  )
}
export default EmptyStateAlert