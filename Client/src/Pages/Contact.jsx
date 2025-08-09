import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import contact from "../assets/frontend_assets/Contact/Contact-banner-image.jpg";
import {
  FaSquareEnvelope,
  FaSquarePhone,
  FaSquareInstagram,
} from "react-icons/fa6";

const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const backgroundStyle = {
    backgroundImage: `url(${contact})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "60vh",
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_2udw4si", // ✅ Wrap all these in quotes
        "template_cfs794h",
        form.current,
        "E18ixUzrdeFZEoTww"
      )
      .then(
        () => {
          setIsSent(true);
          setError("");
          form.current.reset();
        },
        (err) => {
          console.error(err.text);
          setError("Failed to send message. Please try again later.");
        }
      );
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div style={backgroundStyle} className="flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center bg-black/40 px-4 py-6 rounded-xl">
          Contact to PhotoParkk
        </h1>
      </div>

      {/* Contact Info and Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-4 md:p-16 rounded-2xl shadow-lg max-w-6xl mx-auto mt-16">
        {/* Left - Info */}
        <div className="space-y-8 text-gray-800 mt-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Customer Care
            </h2>
            <div className="space-y-3 text-base md:text-lg">
              <p className="flex items-center gap-3">
                <FaSquareEnvelope className="text-blue-600 text-xl" />
                photoparkk.prints@gmail.com
              </p>
              <p className="flex items-center gap-3">
                <FaSquarePhone className="text-blue-600 text-xl" />
                +91 96296 74444
              </p>
              <p className="flex items-center gap-3">
                <FaSquareInstagram className="text-pink-500 text-xl" />
                photoparkk
              </p>
            </div>
          </div>
          <hr className="border-t border-gray-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Branch Location
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-sm">
              501, Miller bus stop, P.N.Road Tiruppur - 641 602
            </p>
          </div>
          <hr className="border-t border-gray-300" />
        </div>

        {/* Right - Form */}
        <div className="flex items-center justify-center">
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-xl space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Contact Us
            </h2>

            {isSent && (
              <p className="text-green-600 font-semibold">
                ✅ Message sent successfully!
              </p>
            )}
            {error && <p className="text-red-500 font-semibold">❌ {error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="user_name"
                required
                placeholder="Your Name"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="user_email"
                required
                placeholder="Your Email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Message
              </label>
              <textarea
                rows="4"
                name="message"
                required
                placeholder="Your Message"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-20 px-4 md:px-0">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-md">
          <iframe
            title="Google Map"
            className="w-full h-[300px] md:h-[450px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.9916362002655!2d77.33937968962991!3d11.11400047244468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907ac16503cdb%3A0x89de1ccc00465422!2sPhoto%20Parkk!5e0!3m2!1sen!2sin!4v1745472636881!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
