"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { FaCalendarAlt } from "react-icons/fa";
import Select from "react-select";
import { useRouter } from "next/navigation";

// 🔁 7 kunlik o'zbekcha hafta kunlari
const weekDays = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];

// ✅ Bugungi kun + 2 kunni olish
const getNextThreeDays = (): string[] => {
  const todayIndex = new Date().getDay(); // 0 = Yakshanba
  const uzTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const result: string[] = [];

  for (let i = 0; i < 3; i++) {
    const index = (uzTodayIndex + i) % 7;
    result.push(weekDays[index]);
  }

  return result;
};

type Booking = {
  userId: string;
  serviceId: string;
  service: string;
  day: string;
  master: string;
  time: string;
  name: string;
  phone: string;
};

const Page = () => {
  const [days] = useState<string[]>(getNextThreeDays());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [masters, setMasters] = useState<string[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceOptions, setServiceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedService, setSelectedService] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useUser();
  const router = useRouter();

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

    const serviceSnap = await getDocs(collection(db, "services"));
    const serviceData = serviceSnap.docs.map((doc) => {
      const data = doc.data() as { name: string };
      return { label: data.name, value: doc.id };
    });
    setServiceOptions(serviceData);
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
    if (!selectedDay || !selectedMaster || !selectedTime || !selectedService)
      return;

    if (!userName || !phoneNumber) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    const duplicate = bookings.find(
      (b) =>
        b.day === selectedDay &&
        b.master === selectedMaster &&
        b.time === selectedTime &&
        b.serviceId === selectedService.value
    );

    if (duplicate) {
      toast.error("❌ Bu vaqtda siz allaqachon bron qilgansiz.");
      return;
    }

    await addDoc(collection(db, "book"), {
      userId: user?.id || "",
      serviceId: selectedService.value,
      service: selectedService.label,
      day: selectedDay,
      master: selectedMaster,
      time: selectedTime,
      name: userName,
      phone: phoneNumber,
    });

    toast.success("✅ Bron muvaffaqiyatli amalga oshirildi!");
    router.push("/");
    fetchInitialData();
    setSelectedTime(null);
    setUserName("");
    setPhoneNumber("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black w-full h-full text-white p-6 flex items-center flex-wrap justify-center">
      <Toaster />
      <div className="flex flex-col mb-10 gap-10 lg:w-1/2 mt-20 text-white">
        <h1 className="uppercase text-4xl lg:text-6xl font-bold leading-tight">
          Reserve your spot, pamper yourself
        </h1>

        <p className="text-base lg:text-lg max-w-full lg:max-w-xl text-gray-300">
          Whether you're looking for a precise haircut, a luxurious shave, or
          expert beard grooming, our team is here to craft the perfect style
          just for you. Secure your spot today and experience the difference!
        </p>

        {/* Business Hours */}
        <div className="flex flex-col gap-5">
          <h2 className="uppercase text-2xl lg:text-3xl font-bold text-white">
            Business Hours
          </h2>

          <div>
            <span className="block text-sm text-gray-400">Mon - Fri:</span>
            <div className="w-full lg:w-[350px]">
              <h3 className="text-3xl lg:text-4xl font-bold border-b border-gray-700 pb-3 lg:pb-5">
                9AM - 8PM
              </h3>
            </div>
          </div>

          <div>
            <span className="block text-sm text-gray-400">Sat:</span>
            <div className="w-full lg:w-[350px]">
              <h3 className="text-3xl lg:text-4xl font-bold border-b border-gray-700 pb-3 lg:pb-5">
                9AM - 6PM
              </h3>
            </div>
          </div>

          <div>
            <span className="block text-sm text-gray-400">Sun:</span>
            <div className="w-full lg:w-[350px]">
              <h3 className="text-3xl lg:text-4xl font-bold border-b border-gray-700 pb-3 lg:pb-5">
                10AM - 5PM
              </h3>
            </div>
          </div>
        </div>

        {/* Booking Number */}
        <div>
          <h2 className="uppercase text-2xl lg:text-3xl font-bold text-white">
            Booking Number
          </h2>
          <p className="text-[#F87C32] text-2xl lg:text-3xl font-bold mt-3">
            +998 999 999 99
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl p-6 bg-[#1f1f1f] mb-30 rounded-xl shadow-xl border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-center">Book an Appointment</h2>

        <div className="grid grid-cols-3 gap-2">
          {days
            .filter((day) => !isDayFullyBooked(day))
            .map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-2 rounded-full text-sm transition border font-medium ${
                  selectedDay === day
                    ? "bg-[#9C74FF] text-white border-transparent shadow"
                    : "bg-[#2c2c2c] text-white border-gray-600 hover:bg-[#3a3a3a]"
                }`}
              >
                <FaCalendarAlt className="inline-block mr-1" />
                {day}
              </button>
            ))}
        </div>

        <div className="flex flex-col gap-1 ">
          <label className="text-sm text-gray-400">Select Master</label>
          <select
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
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

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Select Time</label>
          <select
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-600"
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

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Select Service</label>
          <Select
            className="text-black"
            options={serviceOptions}
            value={selectedService}
            onChange={(option) => setSelectedService(option)}
            placeholder="Xizmatni tanlang"
          />
        </div>

        <button
          onClick={openModal}
          disabled={!selectedTime || !selectedService}
          className="w-full py-2 rounded font-semibold transition bg-[#55BE9D] hover:bg-[#47ab8a] text-white"
        >
          Book Now
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold text-center text-black">
              Ma'lumotlaringiz
            </h3>
            <input
              type="text"
              placeholder="Ismingiz..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 text-black border border-gray-300 rounded placeholder:text-gray-500"
            />
            <div className="flex gap-2">
              <span className="p-2 bg-gray-200 rounded text-black">+998</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-black p-2 border border-gray-300 rounded placeholder:text-gray-500"
                placeholder="90 123 45 67"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-[#55BE9D] text-white rounded font-semibold"
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
