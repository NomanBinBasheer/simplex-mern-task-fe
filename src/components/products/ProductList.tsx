"use client";

import { IProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard";

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
  return (
    <section className="p-4 rounded-xl grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full ">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          openUpdateDialog={openUpdateDialog}
          handleDelete={handleDelete}
        />
      ))}
    </section>
  );
};

export default ProductList;
