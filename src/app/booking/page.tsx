"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

type Booking = {
  id: string;
  day: string;
  services: string;
  time: string;
  master: string;
};

const Page = () => {
  const { user } = useUser(); // Clerkdan foydalanuvchi olish
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "book"),
          where("userId", "==", user.id) // faqat shu userga tegishli bronlar
        );

        const querySnapshot = await getDocs(q);
        const data: Booking[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Booking, "id">),
        }));

        setUserBookings(data);
      } catch (error) {
        console.error("Bronlarni olishda xatolik:", error);
      }
    };

    fetchUserBookings();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-amber-50">Mening bronlarim</h1>
      {userBookings.length === 0 ? (
        <p>Bron topilmadi.</p>
      ) : (
        <ul className="space-y-2">
          {userBookings.map((b) => (
            <li
              key={b.id}
              className="border p-4 rounded-lg bg-white shadow text-gray-800"
            >
              <p>
                <strong>Usta:</strong> {b.master}
              </p>
              <p>
                <strong>Sana:</strong> {b.day}
              </p>
              <p>
                <strong>Vaqt:</strong> {b.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
