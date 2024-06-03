"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import useProducts from "@/hooks/useProducts";
import { IProduct } from "@/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const { products, fetchProducts, handleDelete } = useProducts();

  const router = useRouter();

  const openAddDialog = () => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }
    setSelectedProduct(null);
    setIsUpdate(false);
    setIsOpen(true);
  };

  const openUpdateDialog = (product: IProduct) => {
    setSelectedProduct(product);
    setIsUpdate(true);
    setIsOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 gap-4 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold text-center">Products CRUD App</h1>
      <Button onClick={openAddDialog}>Add Product</Button>
      <ProductForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isUpdate={isUpdate}
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
      />
      <ProductList
        products={products}
        openUpdateDialog={openUpdateDialog}
        handleDelete={handleDelete}
      />
    </main>
  );
};

export default Home;
