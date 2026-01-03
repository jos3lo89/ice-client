// import { create } from "zustand";
// import type {
//   AddOrderItemRequest,
//   VariantSelection,
// } from "@/types/orders.types";
// import type { Product } from "@/types/products.types";

// interface CartItem extends AddOrderItemRequest {
//   tempId: string; // ID temporal para el carrito
//   product: Product;
//   calculated_total: number;
// }

// interface OrderState {
//   // Estado actual
//   currentOrderId: string | null;
//   currentTableId: string | null;
//   pendingItems: CartItem[];

//   // Actions
//   setCurrentOrder: (orderId: string, tableId: string) => void;
//   clearCurrentOrder: () => void;

//   // Carrito (items pendientes antes de enviar)
//   addToCart: (
//     product: Product,
//     quantity: number,
//     variants?: VariantSelection[],
//     notes?: string,
//   ) => void;
//   updateCartItem: (tempId: string, quantity: number) => void;
//   removeFromCart: (tempId: string) => void;
//   clearCart: () => void;

//   // Computed
//   getCartTotal: () => number;
//   getCartItemsCount: () => number;
// }

// export const useOrderStore = create<OrderState>((set, get) => ({
//   currentOrderId: null,
//   currentTableId: null,
//   pendingItems: [],

//   setCurrentOrder: (orderId, tableId) =>
//     set({ currentOrderId: orderId, currentTableId: tableId }),

//   clearCurrentOrder: () =>
//     set({ currentOrderId: null, currentTableId: null, pendingItems: [] }),

//   addToCart: (product, quantity, variants = [], notes) => {
//     const variantsTotal = variants.reduce(
//       (sum, v) => sum + v.price_modifier,
//       0,
//     );
//     const calculatedTotal = (product.price + variantsTotal) * quantity;

//     const newItem: CartItem = {
//       tempId: `temp-${Date.now()}-${Math.random()}`,
//       product_id: product.id,
//       quantity,
//       variants,
//       notes,
//       product,
//       calculated_total: calculatedTotal,
//     };

//     set((state) => ({
//       pendingItems: [...state.pendingItems, newItem],
//     }));
//   },

//   updateCartItem: (tempId, quantity) => {
//     set((state) => ({
//       pendingItems: state.pendingItems.map((item) => {
//         if (item.tempId === tempId) {
//           const variantsTotal =
//             item.variants?.reduce((sum, v) => sum + v.price_modifier, 0) || 0;
//           const calculatedTotal =
//             (item.product.price + variantsTotal) * quantity;
//           return { ...item, quantity, calculated_total: calculatedTotal };
//         }
//         return item;
//       }),
//     }));
//   },

//   removeFromCart: (tempId) => {
//     set((state) => ({
//       pendingItems: state.pendingItems.filter((item) => item.tempId !== tempId),
//     }));
//   },

//   clearCart: () => set({ pendingItems: [] }),

//   getCartTotal: () => {
//     return get().pendingItems.reduce(
//       (sum, item) => sum + item.calculated_total,
//       0,
//     );
//   },

//   getCartItemsCount: () => {
//     return get().pendingItems.reduce((sum, item) => sum + item.quantity, 0);
//   },
// }));
