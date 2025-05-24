"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import team from "../components/jamoa.png"; // Adjust the path as necessary

const About = () => {
  return (
    <div
      className="min-h-screen mt-10 bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/about-bg.png')", // Rasmni public papkaga joylashtiring
      }}
    >
      <div className=" bg-opacity-70 min-h-screen px-4 md:px-16 py-16">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 drop-shadow">
            About MyBarber
          </h1>
          <p className="mt-4 text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            MyBarber is more than just a barbershop — it’s a community of style,
            precision, and care. Discover our story, our mission, and the
            talented hands behind every haircut.
          </p>
        </section>

        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-semibold text-amber-300 mb-4">
              Our Story
            </h2>
            <p className="text-amber-100 leading-relaxed">
              Founded in 2022, MyBarber was built with the vision of bringing
              timeless style and modern grooming together. We started as a
              small, passionate team dedicated to quality cuts, personalized
              service, and building long-lasting relationships with our clients.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-300">
            <Image
              src={team.src} // bu rasmni ham public papkaga qo‘ying
              alt="Our Team"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center text-amber-300 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Quality First",
                desc: "We never compromise on the quality of service and haircare products.",
              },
              {
                title: "Customer Connection",
                desc: "Your experience matters. Every cut is tailored to you.",
              },
              {
                title: "Continuous Growth",
                desc: "Our barbers are constantly improving their skills to serve you better.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-black bg-opacity-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-2xl font-bold text-amber-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-amber-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-block px-8 py-3 bg-amber-400 text-black font-semibold rounded-xl shadow-md hover:bg-amber-500 transition"
          >
            Explore Our Services
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 mb-10 py-6 px-8 text-center text-amber-200">
          <p className="mb-2">&copy; 2025 MyBarber. Crafted with passion.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
