import { Badge } from "@/components/ui/badge";
import { TableStatus } from "@/types/table.types";
import { cn } from "@/lib/utils";

interface TableStatusBadgeProps {
  status: TableStatus;
  className?: string;
}

export default function TableStatusBadge({
  status,
  className,
}: TableStatusBadgeProps) {
  const variants = {
    [TableStatus.LIBRE]: {
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600",
      label: "Libre",
    },
    [TableStatus.OCUPADA]: {
      variant: "destructive" as const,
      className: "bg-red-500 hover:bg-red-600",
      label: "Ocupada",
    },
    [TableStatus.RESERVADA]: {
      variant: "default" as const,
      className: "bg-yellow-500 hover:bg-yellow-600",
      label: "Reservada",
    },
    [TableStatus.LIMPIEZA]: {
      variant: "secondary" as const,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      label: "Limpieza",
    },
  };

  const config = variants[status as TableStatus] || variants[TableStatus.LIBRE];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
