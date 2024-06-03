import dotenv from "dotenv";
dotenv.config();

import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    config => {
      const token = process.env.NEXT_PUBLIC_JWT_TOKEN as string;
      console.log(token);
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

export const getProducts = async () => {
  const response = await api.get('/products/getAllProducts');
  
  return response.data.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/getOneProduct/${id}`);
  return response.data;
};

export const createProduct = async (item: any) => {
  const response = await api.post('/products/createProduct', item);
  return response.data;
};

export const updateProduct = async (id: number, item: any) => {
  const response = await api.patch(`/products/updateProduct/${id}`, item);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/deleteProduct/${id}`);
  return response.data;
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const response = await api.post('/products/uploadProductImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};
