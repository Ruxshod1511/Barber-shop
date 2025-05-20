import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkProvider,
} from "@clerk/nextjs";
import { RiMenu2Line } from "react-icons/ri";
import { CiBookmarkCheck } from "react-icons/ci";
import Link from "next/link";

const Navbar = () => {
  return (
    <ClerkProvider>
      {/* 📱 Mobile navbar */}
      <div className="flex md:hidden flex-col items-center justify-center w-full p-3">
        <div className="w-11/12 h-20 fixed bottom-5 rounded-3xl backdrop-blur-xl shadow-lg border border-gray-300 flex items-center justify-between px-6 bg-white/10">
          <Link
            prefetch
            href="/services"
            className="p-2 w-30 h-12 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center gap-2 shadow-sm"
          >
            <RiMenu2Line size={24} className="text-gray-700" />
            <span className="text-2xl font-medium text-gray-700 mb-0.5">
              Menu
            </span>
          </Link>
          <Link
            prefetch
            href="/profile"
            className="p-2 w-30 h-12 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-between shadow-sm"
          >
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="text-lg text-gray-700 font-medium">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-lg text-gray-700 font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
                <span className="text-lg font-medium text-gray-700">
                  Profile
                </span>
              </div>
            </SignedIn>
          </Link>
        </div>
      </div>

      {/* 💻 Desktop navbar */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 h-16 px-8 bg-white/10 backdrop-blur-md border-b border-gray-300 shadow-md z-50 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            prefetch
            href="/"
            className="text-xl font-semibold text-amber-50"
          >
            My<span className="text-amber-300">Barber</span>
          </Link>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex  items-center text-center hover:scale-105 transition-all">
            <RiMenu2Line size={24} className="text-amber-400 mt-1 me-1" />
            <Link
              prefetch
              href="/services"
              className="text-sm font-medium text-white mt-1"
            >
              Menu
            </Link>
          </div>
          <div className="flex  items-center text-center hover:scale-105 transition-all">
            <CiBookmarkCheck size={24} className="text-amber-400 mt-1 me-1" />
            <Link
              prefetch
              href="/booking"
              className="text-sm font-medium text-white mt-1 cursor-pointer"
            >
              Bookings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default Navbar;
