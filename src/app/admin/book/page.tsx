"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { FaUserTie, FaCalendarAlt, FaClock } from "react-icons/fa";

// Bron ma'lumotlari uchun to'liq tip
type Booking = {
  id: string;
  day: string;
  time: string;
  master: string;
  name?: string;
  phone?: string;
};

const AdminBookPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); // ✅ any o‘rniga Booking[]

  useEffect(() => {
    const fetchBookings = async () => {
      const snap = await getDocs(collection(db, "book"));
      const data: Booking[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));
      setBookings(data);
    };

    fetchBookings();
  }, []);

  function handleDelete(id: string) {
    const barberDocRef = doc(db, "book", id);
    deleteDoc(barberDocRef)
      .then(() => {
        setBookings((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
        alert("Failed to delete booking.");
      });
  }

  return (
    <div className="min-h-screen mt-10 p-6">
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">
          Hech qanday bron mavjud emas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b, i) => (
            <div
              key={b.id}
              className="cursor-pointer bg-white/20 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out text-white"
            >
              <p className="text-sm text-amber-50 mb-2">ID: {i + 1}</p>
              <p className="flex items-center gap-2 text-lg font-semibold text-amber-50">
                <FaUserTie /> {b.master}
              </p>
              <p className="flex items-center gap-2 text-amber-50">
                <FaCalendarAlt /> {b.day}
              </p>
              <p className="flex items-center gap-2 text-amber-50">
                <FaClock /> {b.time}
              </p>
              <p className="mt-2 text-sm text-amber-50">
                👤 <strong>Ism:</strong> {b.name || "—"}
              </p>
              <p className="text-sm text-amber-50">
                📞 <strong>Telefon:</strong> {b.phone || "—"}
              </p>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-amber-300 active:bg-amber-800 active:text-amber-50 w-10 bg-amber-950 text-center rounded-2xl mt-3"
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookPage;
