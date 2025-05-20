"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Barber {
  id?: string;
  barberName: string;
  barberPhone: string;
  barberLocation: string;
}

const BarberSettingsPage = () => {
  const [barber, setBarber] = useState<Barber>({
    barberName: "",
    barberPhone: "",
    barberLocation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasBarber, setHasBarber] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBarber = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "barberinfo"));
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setBarber({
            id: doc.id,
            barberName: doc.data().barberName,
            barberPhone: doc.data().barberPhone,
            barberLocation: doc.data().barberLocation,
          });
          setHasBarber(true);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching barber:", error);
        alert("Failed to load barber information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarber();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarber((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!barber.barberName || !barber.barberPhone || !barber.barberLocation) {
        alert("Iltimos, barcha maydonlarni to'ldiring");
        return;
      }

      if (hasBarber && barber.id) {
        await updateDoc(doc(db, "barberinfo", barber.id), {
          barberName: barber.barberName,
          barberPhone: barber.barberPhone,
          barberLocation: barber.barberLocation,
        });
        alert("Sartarosh ma'lumotlari yangilandi!");
        setIsEditing(false);
      } else {
        const docRef = await addDoc(collection(db, "barberinfo"), {
          barberName: barber.barberName,
          barberPhone: barber.barberPhone,
          barberLocation: barber.barberLocation,
        });
        setBarber((prev) => ({ ...prev, id: docRef.id }));
        setHasBarber(true);
        alert("Yangi sartarosh qo'shildi!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving barber:", error);
      alert("Sartarosh ma'lumotlarini saqlashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete barber
  const handleDelete = async () => {
    if (!hasBarber || !barber.id) return;

    if (!confirm("Haqiqatan ham bu sartaroshni o'chirmoqchimisiz?")) return;

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "barberinfo", barber.id));
      setBarber({
        barberName: "",
        barberPhone: "",
        barberLocation: "",
      });
      setHasBarber(false);
      alert("Sartarosh ma'lumotlari o'chirildi!");
    } catch (error) {
      console.error("Error deleting barber:", error);
      alert("Sartaroshni o'chirishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  // Enable editing
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    if (hasBarber && barber.id) {
      setIsEditing(false);
    } else {
      setBarber({
        barberName: "",
        barberPhone: "",
        barberLocation: "",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-sans font-semibold mb-7 text-center text-blue-400">
        Sozlamalar
      </h1>
      <div className="mt-2 w-200 mx-auto card rounded-2xl p-3 border-2 border-gray-300 shadow-md bg-gray-900 text-white">
        <h2 className="text-2xl font-sans font-semibold text-amber-50">
          Barber info
        </h2>
        <hr className="bg-cyan-500 mb-2 mt-2" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2 mt-4">
            <input
              disabled={isEditing && hasBarber}
              name="barberName"
              value={barber.barberName}
              onChange={handleChange}
              type="text"
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Barber name"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <input
              disabled={isEditing && hasBarber}
              name="barberPhone"
              value={barber.barberPhone}
              onChange={handleChange}
              type="number"
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Barber phone number"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <input
              disabled={isEditing && hasBarber}
              name="barberLocation"
              value={barber.barberLocation}
              onChange={handleChange}
              type="text"
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="barber location"
              required
            />
          </div>

          <div className="flex gap-2">
            {hasBarber ? (
              <>
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-700 disabled:bg-blue-400"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Bekor qilish
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={enableEditing}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-700"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? "Qo'shilmoqda..." : "Qo'shish"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberSettingsPage;
