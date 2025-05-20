"use client";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/components/Firebase.config";
import { useEffect, useState } from "react";
import React from "react";
import { FaClock } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  time: string;
  price: string;
}

const Page = () => {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const serviceDocs = await getDocs(collection(db, "services"));
      const serviceData = serviceDocs.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          time: data.time || "",
          price: data.price || "",
        } as Service;
      });
      setData(serviceData);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-amber-300 mb-10 inline-block pb-2">
        Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-md"
              >
                <Skeleton height={24} width={`60%`} className="mb-3" />
                <Skeleton height={20} width={`80%`} className="mb-2" />
                <Skeleton height={20} width={`50%`} />
              </div>
            ))
          : data.map((service, index) => (
              <div
                key={index}
                onClick={() => router.push(`/book/${service.id}`)}
                className="cursor-pointer bg-white/20 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out text-white"
              >
                <h2 className="text-xl font-semibold mb-3">{service.name}</h2>
                <div className="flex justify-between items-center text-sm">
                  <p className="flex items-center gap-2">
                    <FaClock /> {service.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <RiMoneyDollarCircleFill size={20} /> {service.price}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Page;
