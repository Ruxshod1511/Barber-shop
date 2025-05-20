"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/components/Firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Drawer } from "vaul";
import Creatable from "react-select/creatable";

type Option = {
  value: string;
  label: string;
};

interface Master {
  id: string;
  name: string;
  createbil: string;
  phone: string;
}

const Page = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [createbil, setCreatebil] = useState<Option | null>(null);
  const [createbilOptions, setCreatebilOptions] = useState<Option[]>([]);
  const [data, setData] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMaster, setEditingMaster] = useState<null | {
    id: string;
    name: string;
    phone: string;
  }>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Createbil options
        const skillsSnap = await getDocs(collection(db, "skill"));
        const skillOptions = skillsSnap.docs.map((doc) => ({
          value: doc.data().value,
          label: doc.data().label,
        }));
        setCreatebilOptions(skillOptions);

        // Fetch Masters
        const masterSnap = await getDocs(collection(db, "master"));
        const masters = masterSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Master[];
        setData(masters);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!name || !phone || !createbil?.value) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const exists = createbilOptions.some(
        (opt) => opt.value === createbil.value
      );

      // Yangi skill qo‘shish
      if (!exists) {
        await addDoc(collection(db, "skill"), {
          label: createbil.value,
          value: createbil.value,
        });
        setCreatebilOptions((prev) => [
          ...prev,
          { label: createbil.value, value: createbil.value },
        ]);
      }

      if (editingMaster) {
        await updateDoc(doc(db, "master", editingMaster.id), {
          name,
          phone,
          createbil: createbil.value,
        });

        setData((prev) =>
          prev.map((item) =>
            item.id === editingMaster.id
              ? { ...item, name, phone, createbil: createbil.value }
              : item
          )
        );

        alert("Master updated!");
      } else {
        const docRef = await addDoc(collection(db, "master"), {
          name,
          phone,
          createbil: createbil.value,
        });

        setData((prev) => [
          ...prev,
          { id: docRef.id, name, phone, createbil: createbil.value },
        ]);

        alert("Master added!");
      }

      // Tozalash
      setName("");
      setPhone("");
      setCreatebil(null);
      setEditingMaster(null);
      setOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save master.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "master", id));
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("Deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete.");
    }
  };

  const handleEdit = (master: Master) => {
    setEditingMaster(master);
    setName(master.name);
    setCreatebil({ label: master.createbil, value: master.createbil });
    setPhone(master.phone);
    setOpen(true);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-48 mt-60">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="p-4 mt-10">
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 rounded-2xl text-white px-4 py-2"
          >
            <h1 className="text-center text-xl font-sans font-bold">
              Add Master
            </h1>
          </button>

          <div className="overflow-x-auto rounded-lg shadow-md mt-6">
            <table className="min-w-full text-sm text-left text-white bg-gray-900">
              <thead className="bg-gray-700 uppercase text-xs tracking-wider text-gray-300">
                <tr>
                  <th className="px-6 py-3">№</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Createbil</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((master, i) => (
                  <tr key={master.id} className="border-b border-gray-700">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4">{master.name}</td>
                    <td className="px-6 py-4">{master.createbil}</td>
                    <td className="px-6 py-4">{master.phone}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleDelete(master.id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEdit(master)}
                        className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-black"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Drawer modal */}
          <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4">
                <Drawer.Title className="text-lg text-center font-bold mb-4">
                  Add Master
                </Drawer.Title>

                <div className="mx-auto w-full md:w-1/2 lg:w-1/3 space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Createbil
                    </label>
                    <Creatable
                      value={createbil}
                      isClearable
                      onChange={(selected) => setCreatebil(selected)}
                      options={createbilOptions}
                      placeholder="Select or create Createbil"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="number"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      )}
    </>
  );
};

export default Page;
