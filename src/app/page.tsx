"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  getProducts,
  createProduct,
  uploadFile,
  deleteProduct,
  updateProduct, 
} from "../lib/api";
import { IFormData, IProduct } from "@/types";
import { Badge } from "@/components/ui/badge";


const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: keyof IFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
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
      } catch (error) {
        console.error("Error uploading file:", error);
      }
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

  const handleFormSubmit = async () => {
    try {
      if (isUpdate && selectedProduct) {
        const updatedFields: Partial<IFormData> = {};
        (Object.keys(formData) as Array<keyof IFormData>).forEach((key) => {
          if (formData[key] !== selectedProduct[key as keyof IProduct]) {
            if (typeof formData[key] === typeof selectedProduct[key as keyof IProduct]) {
              updatedFields[key] = formData[key] as any;
            }
          }
        });
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
  };

  const openAddDialog = () => {
    resetFormData();
    setIsUpdate(false);
    setIsOpen(true);
  };

  const openUpdateDialog = (product: IProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      priority: product.priority,
      description: product.description,
    });
    setIsUpdate(true);
    setIsOpen(true);
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-10 gap-4 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold text-center">Products CRUD App</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={openAddDialog}>Add Product</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isUpdate ? "Update a Product" : "Add a new product"}</DialogTitle>
            <DialogDescription>
            {isUpdate ? "Update the product details." : "Provide the product details. Click Add when you're done."}
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
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
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
                onChange={handleFileChange}
                className="col-span-3"
                type="file"
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
                placeholder="Type your message here."
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

      <section className="p-4 rounded-xl grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full ">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex flex-col justify-between col-span-1"
          >
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
        ))}
      </section>
    </main>
  );
};

export default Home;
