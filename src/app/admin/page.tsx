"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const AdminPage = () => {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // foydalanuvchi hali yuklanmagan bo‘lsa, kutish

    const isAdmin = user?.emailAddresses?.some(
      (email) => email.emailAddress === "ruxshodinte@gmail.com"
    );

    if (!isAdmin) {
      router.push("/"); // admin bo‘lmasa bosh sahifaga yuborish
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <div>Loading...</div>; // yuklanish holati
  }

  return <div>Admin Page</div>;
};

export default AdminPage;
