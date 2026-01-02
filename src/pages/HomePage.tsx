import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { Link } from "react-router-dom";

export interface Products {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<Products[]>("/products");

      // ✅ Validar que la respuesta sea un array
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Response is not an array:", response.data);
        setError("La respuesta de la API no es válida");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error al cargar los productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>

      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={getProducts}
        >
          Get Products
        </button>
        <Link
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          to="/about"
        >
          About page
        </Link>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Mostrar loading */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* ✅ Validar que products sea un array y tenga elementos */}
          {products.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay productos disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col items-center border p-4 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-28 h-28 object-contain"
                  />
                  <h2 className="mt-2 text-sm font-semibold text-center line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
