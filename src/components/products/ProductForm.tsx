// components/ProductForm.tsx
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct, uploadFile } from "../../lib/api";
import { IFormData, IProduct } from "@/types";

interface ProductFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isUpdate: boolean;
  selectedProduct: IProduct | null;
  fetchProducts: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  setIsOpen,
  isUpdate,
  selectedProduct,
  fetchProducts,
}) => {
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    category: "",
    size: "",
    price: 0,
    quantity: 0,
    image: "",
    priority: 0,
    description: "",
  });
  const [updatedFields, setUpdatedFields] = useState<Partial<IFormData>>({});

  useEffect(() => {
    if (isUpdate && selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        category: selectedProduct.category,
        size: selectedProduct.size,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity,
        image: selectedProduct.image,
        priority: selectedProduct.priority,
        description: selectedProduct.description,
      });
    } else {
      resetFormData();
    }
    setUpdatedFields({});
  }, [isOpen, isUpdate, selectedProduct]);

  const resetFormData = () => {
    setFormData({
      name: "",
      category: "",
      size: "",
      price: 0,
      quantity: 0,
      image: "",
      priority: 0,
      description: "",
    });
    setUpdatedFields({});
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: keyof IFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setUpdatedFields((prevFields) => ({
      ...prevFields,
      [id]: value,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const response = await uploadFile(file);

        setFormData((prevData) => ({
          ...prevData,
          image: response.data,
        }));
        setUpdatedFields((prevFields) => ({
          ...prevFields,
          image: response.data,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (isUpdate && selectedProduct) {
        await updateProduct(selectedProduct.id, updatedFields);
      } else {
        await createProduct(formData);
      }
      fetchProducts();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding/updating item:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update a Product" : "Add a new product"}</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update the product details."
              : "Provide the product details. Click Add when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product Categories</SelectLabel>
                  <SelectItem value="Smartphones">Smartphones</SelectItem>
                  <SelectItem value="Laptops">Laptops</SelectItem>
                  <SelectItem value="Headphones">Headphones</SelectItem>
                  <SelectItem value="Microphones">Microphones</SelectItem>
                  <SelectItem value="Chargers">Chargers</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <Select
              value={formData.size}
              onValueChange={(value) => handleSelectChange("size", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product Sizes</SelectLabel>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              value={formData.price}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Picture
            </Label>
            <Input
              id="picture"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Input
              id="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleFormSubmit}>
            {isUpdate ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
