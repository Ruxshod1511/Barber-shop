"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHome, FaBars } from "react-icons/fa";
import { FaAddressBook, FaUserSecret } from "react-icons/fa6";
import { MdMedicalServices } from "react-icons/md";
import { LuSettings } from "react-icons/lu";
import { LiaTimesSolid } from "react-icons/lia";

const navItems = [
  { href: "/admin/book", label: "Book", icon: <FaAddressBook /> },
  { href: "/admin/master", label: "Masters", icon: <FaUserSecret /> },
  { href: "/admin/services", label: "Services", icon: <MdMedicalServices /> },
  { href: "/admin/settings", label: "Settings", icon: <LuSettings /> },
  { href: "/", label: "Home", icon: <FaHome /> },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setAnimateSidebar(false);
      setTimeout(() => setIsMobileMenuOpen(false), 300);
    } else {
      setIsMobileMenuOpen(true);
      setTimeout(() => setAnimateSidebar(true), 10);
    }
  };

  return (
    <div className="flex h-dvh  relative dark:bg-gray-900">
      <div className="md:hidden fixed top-4 left-4">
        <button
          onClick={toggleMobileMenu}
          className="bg-gray-800 text-white p-2 rounded-md shadow-md text-decoration-none"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-lg z-40"
            onClick={toggleMobileMenu}
          />
          <aside
            className={`fixed -top-1 left-0 bottom-0 w-64 bg-gray-900 shadow-2xl shadow-cyan-800 text-white p-6 z-50 rounded-tr-2xl rounded-br-2xl
        transform transition-transform duration-300 ease-in-out
        ${animateSidebar ? "translate-x-0" : "-translate-x-full"}
      `}
          >
            <div className="flex justify-center items-center ">
              <h2 className="text-2xl font-sans font-semibold mb-7 text-center text-blue-400">
                Barber shop
              </h2>
              <h1>
                <LiaTimesSolid
                  className="text-2xl cursor-pointer  ml-10 -mt-6"
                  onClick={toggleMobileMenu}
                />
              </h1>
            </div>
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      prefetch
                      href={item.href}
                      className="flex items-center py-3 px-4 mb-2 text-base font-medium rounded-lg hover:bg-blue-600 transition-all"
                      onClick={toggleMobileMenu}
                    >
                      <span className="mr-3 text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}

      <aside className="hidden md:block w-64 bg-gradient-to-b mt-15 from-gray-800 to-gray-900 text-white p-6 shadow-lg rounded-r-3xl fixed -top-15.5 left-0 bottom-0">
        <h2 className="text-2xl  font-semibold mb-8 text-center text-blue-400">
          Barber shop
        </h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  prefetch
                  href={item.href}
                  className="flex items-center py-3 px-4 mb-4 text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  <span className="mr-3 text-2xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1  dark:bg-gray-900 pt-24 md:pt-6 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
