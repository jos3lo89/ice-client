import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "../components/ProductGrid";
import AddItemDialog from "../components/AddItemDialog";
import OrderSummarySheet from "../components/OrderSummarySheet";
import { OrderItemStatus } from "@/types/orders.types";
import type { Product } from "@/types/products.types";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { useCategories } from "@/hooks/useCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import CategorySheet from "../components/CategorySheet";
import { formatDateTime } from "@/utils/formatDateTime";
export default function OrderPage() {
  const navigate = useNavigate();
  const { orderId, tableId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSummarySheet, setShowSummarySheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToCancel, setItemToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const {
    useOrderById,
    useOrderByTable,
    addItem,
    sendToKitchen,
    deleteItem,
    cancelItem,
  } = useOrders();

  const { listCategoriesQuery } = useCategories();
  const { listProductsQry } = useProducts();

  // Determinar si es nueva orden o existente
  const isNewOrder = !!tableId && !orderId;
  const currentOrderId = orderId || null;

  // Queries
  const orderByIdQuery = useOrderById(currentOrderId || "");
  const orderByTableQuery = useOrderByTable(tableId || "");

  // Determinar la orden actual
  const order = isNewOrder
    ? orderByTableQuery.data?.data
    : orderByIdQuery.data?.data;

  if (orderByIdQuery.isLoading || orderByTableQuery.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            No tiene una orden arctiva para esta mesa
          </span>
        </div>
      </div>
    );
  }

  const products = listProductsQry.data?.data || [];
  const categories = listCategoriesQuery.data?.data || [];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategoryId === "ALL" ||
      product.category_id === selectedCategoryId;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddDialog(true);
  };

  const handleAddItem = (
    productId: string,
    quantity: number,
    variants?: string,
    notes?: string
  ) => {
    const variantsArray = variants ? JSON.parse(variants) : [];

    addItem.mutate({
      orderId: order.id,
      values: {
        product_id: productId,
        quantity,
        variants: variantsArray,
        notes,
      },
    });
  };

  const handleSendToKitchen = () => {
    const pendingItemIds = order.order_items
      .filter(
        (item) =>
          item.status === OrderItemStatus.PENDIENTE && !item.is_cancelled
      )
      .map((item) => item.id);

    if (pendingItemIds.length === 0) {
      toast.error("No hay items pendientes para enviar");
      return;
    }

    console.log(pendingItemIds);

    sendToKitchen.mutate({
      order_id: order.id,
      item_ids: pendingItemIds,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      deleteItem.mutate(
        { itemId: itemToDelete, orderId: order.id },
        {
          onSuccess: () => {
            setShowDeleteDialog(false);
            setItemToDelete(null);
          },
        }
      );
    }
  };

  const handleCancelItem = (itemId: string) => {
    setItemToCancel(itemId);
    setShowCancelDialog(true);
  };

  const confirmCancelItem = () => {
    if (itemToCancel && cancelReason.trim()) {
      cancelItem.mutate(
        {
          itemId: itemToCancel,
          values: { reason: cancelReason },
          orderId: order.id,
        },
        {
          onSuccess: () => {
            setShowCancelDialog(false);
            setItemToCancel(null);
            setCancelReason("");
          },
        }
      );
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/tables")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>

          <div className="text-center">
            <h2 className="text-sm font-bold">Orden #{order.daily_number}</h2>
            <p className="text-xs text-muted-foreground">
              Mesa {order.table.number} - {order.table.floor_name}
            </p>
            <p className="text-xs text-muted-foreground">
              Hora: {formatDateTime(order.created_at, "time")}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              onClick={() => setSelectedCategoryId("ALL")}
              className="cursor-pointer"
              variant="outline"
            >
              Todos
            </Button>
            <CategorySheet
              open={openFilter}
              onOpenChange={setOpenFilter}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              categories={categories}
            />

            <OrderSummarySheet
              open={showSummarySheet}
              onOpenChange={setShowSummarySheet}
              order={order}
              onDeleteItem={handleDeleteItem}
              onCancelItem={handleCancelItem}
              onSendToKitchen={handleSendToKitchen}
              isSending={sendToKitchen.isPending}
            />
          </div>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar helado, plato..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ProductGrid
          onSelectProduct={handleSelectProduct}
          products={filteredProducts}
        />
      </div>

      {/* Dialog: Agregar Item */}
      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        product={selectedProduct}
        onAdd={handleAddItem}
        isAdding={addItem.isPending}
      />

      {/* Dialog: Eliminar Item */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Item</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar este item? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteItem}
              disabled={deleteItem.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Cancelar Item */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Item</AlertDialogTitle>
            <AlertDialogDescription>
              Este item ya fue enviado a cocina. Debes proporcionar un motivo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="cancel-item-reason">
              Motivo de cancelación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-item-reason"
              placeholder="Ingresa el motivo..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
              }}
            >
              Volver
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelItem}
              disabled={!cancelReason.trim() || cancelItem.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {cancelItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
