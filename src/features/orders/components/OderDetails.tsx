import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  User,
  Users,
  FileText,
  ChefHat,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import { OrderStatus, OrderItemStatus } from "@/types/orders.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatDistanceTime } from "@/utils/formatDistanceTime";
import { formatDateTime } from "@/utils/formatDateTime";

interface OrderDetailsDialogProps {
  id: string;
  open: boolean;
  onOpen: (value: boolean) => void;
}

const getStatusBadge = (status: OrderStatus) => {
  const config = {
    [OrderStatus.ABIERTA]: {
      variant: "default" as const,
      className: "bg-blue-500",
      label: "Abierta",
    },
    [OrderStatus.CERRADA]: {
      variant: "secondary" as const,
      className: "bg-orange-500 text-white",
      label: "Cerrada",
    },
    [OrderStatus.PARCIALMENTE_PAGADA]: {
      variant: "default" as const,
      className: "bg-yellow-500",
      label: "Parcial",
    },
    [OrderStatus.PAGADA]: {
      variant: "default" as const,
      className: "bg-green-500",
      label: "Pagada",
    },
    [OrderStatus.CANCELADA]: {
      variant: "destructive" as const,
      className: "",
      label: "Cancelada",
    },
    [OrderStatus.EN_PAGO_DIVIDIDO]: {
      variant: "secondary" as const,
      className: "bg-purple-500 text-white",
      label: "Pago Dividido",
    },
  };

  return config[status] || config[OrderStatus.ABIERTA];
};

const getItemStatusBadge = (status: OrderItemStatus) => {
  const config = {
    [OrderItemStatus.PENDIENTE]: {
      variant: "secondary" as const,
      className: "bg-gray-500",
      label: "Pendiente",
    },
    [OrderItemStatus.ENVIADO]: {
      variant: "default" as const,
      className: "bg-blue-500",
      label: "Enviado",
    },
    [OrderItemStatus.EN_PREPARACION]: {
      variant: "default" as const,
      className: "bg-yellow-500",
      label: "Preparando",
    },
    [OrderItemStatus.LISTO]: {
      variant: "default" as const,
      className: "bg-purple-500",
      label: "Listo",
    },
    [OrderItemStatus.ENTREGADO]: {
      variant: "default" as const,
      className: "bg-green-500",
      label: "Entregado",
    },
  };

  return config[status] || config[OrderItemStatus.PENDIENTE];
};

export default function OrderDetailsDialog({
  id,
  onOpen,
  open,
}: OrderDetailsDialogProps) {
  const { useOrderById } = useOrders();
  const orderById = useOrderById(id);
  const data = orderById.data?.data;

  if (orderById.isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargando detalles</DialogTitle>
            <DialogDescription>
              Espere mientras se obtienen los datos
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return (
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No hay detalles de la orden</AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  const statusConfig = getStatusBadge(data.status);

  // Parse variants snapshot
  const parseVariants = (variantsString: string | null) => {
    if (!variantsString) return [];
    try {
      return JSON.parse(variantsString);
    } catch {
      return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-start">
            <div>
              <DialogTitle className="text-2xl">
                Orden #{data.daily_number}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {formatDateTime(data.created_at, "date")}
              </DialogDescription>
            </div>
            <Badge
              variant={statusConfig.variant}
              className={`${statusConfig.className} mr-4`}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4 ">
          <div className="space-y-6 pb-4">
            {/* Información general */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Mesa
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      Mesa {data.table.number}
                    </p>
                    {data.table.name && (
                      <p className="text-sm text-muted-foreground">
                        {data.table.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {data.table.floor_name}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Mesero
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{data.user.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{data.diners_count} comensales</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Hace{" "}
                        {formatDistanceTime(data.created_at)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notas */}
            {data.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{data.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Items de la orden */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items de la Orden ({data.order_items.length})
                </CardTitle>

                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.order_items.map((item) => {
                  const itemStatusConfig = getItemStatusBadge(item.status);
                  const variants = parseVariants(item.variants_snapshot);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 ${
                        item.is_cancelled
                          ? "bg-red-50 border-red-200"
                          : item.is_paid
                          ? "bg-green-50 border-green-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header del item */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                              {item.quantity}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                {item.product_name}
                              </h4>
                              {item.product_short_name && (
                                <p className="text-xs text-muted-foreground">
                                  {item.product_short_name}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={itemStatusConfig.variant}
                              className={itemStatusConfig.className}
                            >
                              {itemStatusConfig.label}
                            </Badge>
                          </div>

                          {/* Variantes */}
                          {variants.length > 0 && (
                            <div className="ml-11 mb-2 space-y-1">
                              {variants.map(
                                (
                                  variant: {
                                    group_name: string;
                                    option_name: string;
                                    price_modifier: number;
                                  },
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <ChefHat className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {variant.group_name}:
                                    </span>
                                    <span className="font-medium">
                                      {variant.option_name}
                                    </span>
                                    {variant.price_modifier !== 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        (+S/ {variant.price_modifier})
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Notas del item */}
                          {item.notes && (
                            <div className="ml-11 mb-2">
                              <p className="text-sm text-muted-foreground italic">
                                📝 {item.notes}
                              </p>
                            </div>
                          )}

                          {/* Info adicional */}
                          <div className="ml-11 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ChefHat className="h-3 w-3" />
                              {item.area_preparacion}
                            </div>

                            {item.sent_to_kitchen_at && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Enviado{" "}
                                {formatDistanceTime(item.sent_to_kitchen_at)}
                              </div>
                            )}

                            {item.is_paid && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                Pagado
                              </div>
                            )}

                            {item.is_cancelled && (
                              <div className="flex items-center gap-1 text-red-600">
                                <XCircle className="h-3 w-3" />
                                Cancelado
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="text-right ml-4">
                          <p className="text-sm text-muted-foreground">
                            S/ {Number(item.unit_price).toFixed(2)} c/u
                          </p>
                          {item.variants_total > 0 && (
                            <p className="text-xs text-muted-foreground">
                              + S/ {Number(item.variants_total).toFixed(2)}
                            </p>
                          )}
                          <p className="text-lg font-bold mt-1">
                            S/ {Number(item.line_total).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Resumen de totales */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Totales</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">
                    S/ {Number(data.subtotal).toFixed(2)}
                  </span>
                </div>

                {data.total_cancelled > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Items cancelados:</span>
                    <span>-S/ {Number(data.total_cancelled).toFixed(2)}</span>
                  </div>
                )}

                {data.total_paid > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total pagado:</span>
                    <span>-S/ {Number(data.total_paid).toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pendiente:</span>
                  <span className="text-primary">
                    S/ {Number(data.total_pending).toFixed(2)}
                  </span>
                </div>

                {data.is_split_payment && (
                  <div className="rounded-md bg-muted p-2 text-center text-sm">
                    Pago dividido ({data.split_payment_count} pagos)
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Información Temporal
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Creada:</span>
                  <span>
                    {format(new Date(data.created_at), "PPpp", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Última actualización:
                  </span>
                  <span>
                    {format(new Date(data.updated_at), "PPpp", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo abierto:</span>
                  <span>
                    {formatDistanceTime(data.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
