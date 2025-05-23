"use client";

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
import { FcAbout } from "react-icons/fc";
import { IoHome } from "react-icons/io5";
import Link from "next/link";

const Navbar = () => {
  return (
    <ClerkProvider>
      {/* 📱 Mobile navbar */}
      <div className="flex z-[9999] md:hidden flex-col items-center justify-center w-full p-3">
        <div className="w-11/12 h-20 fixed bottom-5 rounded-3xl backdrop-blur-xl shadow-lg border border-gray-300 flex items-center justify-between px-6 bg-white/10">
          <Link
            prefetch
            href="/services"
            className="p-2 w-10 h-12 rounded-2xl bg-gradient-to-r  from-amber-100 to-amber-200   flex items-center gap-2 shadow-sm"
          >
            <RiMenu2Line size={24} className=" text-black" />
          </Link>

          <Link
            prefetch
            href="/"
            className="p-2 w-30 h-12 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center gap-2 shadow-sm"
          >
            <IoHome size={24} className="text-gray-700" />
            <h4 className="text-xl">Home</h4>
          </Link>

          <SignedOut>
            <div className="p-2 w-30 h-12 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center gap-4 shadow-sm">
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
            <Link
              prefetch
              href="/booking"
              className="p-2 w-30 h-12 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center gap-2 shadow-sm"
            >
              <UserButton />
              <span className="text-lg font-medium text-gray-700">Profile</span>
            </Link>
          </SignedIn>
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
          <div className="flex items-center text-center hover:scale-105 transition-all">
            <IoHome size={24} className="text-amber-400 mt-1 me-1" />
            <Link
              prefetch
              href="/"
              className="text-sm font-medium text-white mt-1"
            >
              Home
            </Link>
          </div>
          <div className="flex items-center text-center hover:scale-105 transition-all">
            <FcAbout size={24} className="text-amber-400 mt-1 me-1" />
            <Link
              prefetch
              href="/about"
              className="text-sm font-medium text-white mt-1"
            >
              About
            </Link>
          </div>
          <div className="flex items-center text-center hover:scale-105 transition-all">
            <RiMenu2Line size={24} className="text-amber-400 mt-1 me-1" />
            <Link
              prefetch
              href="/services"
              className="text-sm font-medium text-white mt-1"
            >
              Menu
            </Link>
          </div>

          <div className="flex items-center text-center hover:scale-105 transition-all">
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
