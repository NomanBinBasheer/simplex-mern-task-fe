import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../lib/api";
import { IProduct } from "@/types";

const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return { products, fetchProducts, handleDelete };
};

export default useProducts;
