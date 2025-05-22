"use client";
import React from "react";
import Image from "next/image";
import {
  RiScissors2Line,
  RiUser3Line,
  RiCalendarCheckLine,
  RiInstagramLine,
  RiFacebookBoxLine,
} from "react-icons/ri";
import img from "./components/IMG_5348.jpg";
import img1 from "./components/l.jpg";
import img2 from "./components/02.jpg";
import Link from "next/link";

const Home = () => {
  return (
    <div
      className="container mx-auto min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: 'url("/components/your-barbershop-bg.png")' }}
    >
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center pt-32 h-170 px-4 md:px-16 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-100 drop-shadow-lg">
          Welcome to MyBarber
        </h1>
        <p className="mt-4 text-lg md:text-xl text-amber-50">
          Premium grooming experience. Classic cuts. Modern style.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/services"
            className="px-6 py-3 rounded-xl bg-amber-300 text-black font-semibold shadow-md hover:bg-amber-400 transition"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 rounded-xl border border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-black transition"
          >
            Services
          </Link>
        </div>
      </main>

      {/* Our Work Section */}
      <section className="py-16 rounded-3xl px-4 md:px-16 bg-black bg-opacity-60 mt-20">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-amber-200">
          Our Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[img, img1, img2].map((image, index) => (
            <div className="relative group" key={index}>
              <Image
                src={image}
                alt={`cut${index + 1}`}
                className="rounded-xl shadow-md h-100 object-cover transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={300}
              />
              <div className="absolute inset-0 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                <p className="text-white text-lg font-semibold">
                  {["Classic Cut", "Modern Style", "Sharp Look"][index]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 md:px-16 text-center animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-amber-100 transition-all duration-500 ease-in-out">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              Icon: RiScissors2Line,
              title: "Professional Cuts",
              desc: "Top-level barbers with years of experience.",
            },
            {
              Icon: RiUser3Line,
              title: "Personalized Style",
              desc: "Each haircut tailored to your look.",
            },
            {
              Icon: RiCalendarCheckLine,
              title: "Easy Booking",
              desc: "Schedule appointments online anytime.",
            },
          ].map(({ Icon, title, desc }, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-all duration-500 ease-in-out hover:shadow-2xl group"
            >
              <div className="bg-amber-200 rounded-full p-4 transition-transform group-hover:rotate-12">
                <Icon size={64} className="text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mt-6 text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="mt-3 text-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-16 bg-white bg-opacity-10 text-center rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-emerald-950">
          What Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Great atmosphere and top-notch service! Highly recommended.",
              author: "— Alex M.",
            },
            {
              quote:
                "The best haircut I’ve had in years. Clean, professional and stylish.",
              author: "— Jamie R.",
            },
            {
              quote:
                "Easy booking and amazing results. I'll definitely be coming back.",
              author: "— Sam T.",
            },
          ].map(({ quote, author }, i) => (
            <div key={i} className="bg-black bg-opacity-30 p-6 rounded-xl">
              <p>{quote}</p>
              <span className="block mt-4 font-bold">{author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-8 bg-black bg-opacity-70 text-center text-amber-200 mt-12">
        <p className="mb-2">&copy; 2025 MyBarber. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
