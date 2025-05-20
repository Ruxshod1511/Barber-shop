"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { FaCalendarAlt, FaClock, FaUserTie } from "react-icons/fa";

// Booking type
type Booking = {
  userId: string;
  serviceId: string;
  day: string;
  master: string;
  time: string;
  name: string;
  phone: string;
};

const Page = () => {
  const { id } = useParams();
  const [days] = useState<string[]>(["Dushanba", "Seshanba", "Chorshanba"]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [masters, setMasters] = useState<string[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); // ✅ tip qo‘shildi

  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useUser();

  const TIME_OPTIONS = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterAvailableTimes();
  }, [selectedDay, selectedMaster, bookings]);

  const fetchInitialData = async () => {
    const bookingSnap = await getDocs(collection(db, "book"));
    const bookingData: Booking[] = bookingSnap.docs.map(
      (doc) => doc.data() as Booking
    );
    setBookings(bookingData);

    const masterSnap = await getDocs(collection(db, "master"));
    const masterData: string[] = masterSnap.docs.map((doc) => {
      const data = doc.data() as { name: string };
      return data.name;
    });
    setMasters(masterData);
  };

  const filterAvailableTimes = () => {
    if (!selectedDay || !selectedMaster) {
      setTimes([]);
      return;
    }
    const filtered = bookings.filter(
      (b) => b.day === selectedDay && b.master === selectedMaster
    );
    const booked = filtered.map((b) => b.time);
    setTimes(TIME_OPTIONS.filter((t) => !booked.includes(t)));
  };

  const isDayFullyBooked = (day: string) => {
    const bookedCount = bookings.filter((b) => b.day === day).length;
    return bookedCount >= 6;
  };

  const openModal = () => {
    if (selectedTime) setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedDay || !selectedMaster || !selectedTime) return;

    if (!userName || !phoneNumber) {
      toast.error("❌ Iltimos, barcha maydonlarni to‘ldiring.", {
        position: "top-center",
      });
      return;
    }

    const duplicate = bookings.find(
      (b) =>
        b.day === selectedDay &&
        b.master === selectedMaster &&
        b.time === selectedTime &&
        b.serviceId === id
    );

    if (duplicate) {
      toast.error("❌ Bu vaqtda siz allaqachon bron qilgansiz.", {
        position: "top-center",
      });
      return;
    }

    await addDoc(collection(db, "book"), {
      userId: user?.id || "",
      serviceId: id,
      day: selectedDay,
      master: selectedMaster,
      time: selectedTime,
      name: userName,
      phone: phoneNumber,
    });

    toast.success("✅ Bron muvaffaqiyatli amalga oshirildi!", {
      position: "top-center",
    });

    fetchInitialData();
    setSelectedTime(null);
    setUserName("");
    setPhoneNumber("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-6">
      <Toaster />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#F8CB47]">
          Xizmat Band Qilish
        </h1>

        <div className="overflow-y-auto space-y-4">
          {days
            .filter((day) => !isDayFullyBooked(day))
            .map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedDay === day
                    ? "bg-[#9C74FF] text-white"
                    : "bg-white text-[#2A2A2A]"
                } hover:scale-105 transition font-semibold`}
              >
                <FaCalendarAlt className="inline mr-2" />
                {day}
              </button>
            ))}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <FaUserTie className="absolute left-3 top-3 text-[#55BE9D]" />
            <select
              className="w-full pl-10 p-3 rounded bg-white text-[#2A2A2A] font-medium"
              value={selectedMaster || ""}
              onChange={(e) => setSelectedMaster(e.target.value)}
            >
              <option value="">Master tanlang</option>
              {masters.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaClock className="absolute left-3 top-3 text-[#55BE9D]" />
            <select
              className="w-full pl-10 p-3 rounded bg-white text-[#2A2A2A] font-medium"
              value={selectedTime || ""}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedMaster}
            >
              <option value="">Vaqt tanlang</option>
              {times.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={openModal}
          disabled={!selectedTime}
          className={`w-full py-3 rounded font-semibold text-lg transition ${
            selectedTime
              ? "bg-[#55BE9D] hover:bg-[#47ab8a]"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Book
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-[#2A2A2A] space-y-4">
            <h2 className="text-xl font-bold text-center">Malumotlaringiz</h2>
            <input
              type="text"
              placeholder="Ismingiz"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 rounded border border-gray-300"
            />
            <input
              type="tel"
              placeholder="Telefon raqamingiz"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 rounded border border-gray-300"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 rounded bg-[#55BE9D] text-white font-semibold"
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
