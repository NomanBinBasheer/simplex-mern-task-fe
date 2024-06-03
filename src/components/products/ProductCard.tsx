"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { IProduct } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: IProduct;
  openUpdateDialog: (product: IProduct) => void;
  handleDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  openUpdateDialog,
  handleDelete,
}) => {
  return (
    <Card className="flex flex-col justify-between col-span-1">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={100}
        className="w-full h-[180px] object-cover rounded-t-xl"
      />
      <CardContent>
        <Badge>{product.category}</Badge>
        <h3 className="text-md font-medium mt-1">{product.name}</h3>
        <div className="flex justify-between">
          <h4 className="text-lg font-bold">${product.price}</h4>
          <div className="flex flex-col gap-1 justify-end items-end">
            <span className="text-sm font-extrabold">{product.size}</span>
            <span className="text-[12px]">{product.quantity} Left</span>
          </div>
        </div>
        <p className="text-sm">{product.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => openUpdateDialog(product)}>Update</Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => handleDelete(product.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
