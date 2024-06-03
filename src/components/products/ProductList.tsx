"use client";

import { IProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ProductListProps {
  products: IProduct[];
  openUpdateDialog: (product: IProduct) => void;
  handleDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  openUpdateDialog,
  handleDelete,
}) => {

  const router = useRouter();

  const checkAuth = (callback: () => void) => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    } else {
      callback();
    }
  };
  return (
    <section className="p-4 rounded-xl grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full ">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          openUpdateDialog={openUpdateDialog}
          handleDelete={handleDelete}
          checkAuth={checkAuth}
        />
      ))}
    </section>
  );
};

export default ProductList;
