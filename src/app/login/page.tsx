"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      
      const { token } = response.data;
      Cookies.set('token', token, { expires: 7 }); 
      if(response.statusCode === 200){
        router.push('/');   
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
          <CardDescription className="text-center">Enter your details to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between mt-8">
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </main>

  );
};

export default LoginPage;
