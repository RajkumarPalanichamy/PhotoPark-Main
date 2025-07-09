"use client";

import { useState } from "react";
import Image1 from "../../assets/frontend_assets/BacklightPhotoFrames/LandScape.jpeg";

const faqs = [
  {
    question: "What materials are used in your frames?",
    answer:
      "We use high-quality acrylic, canvas, and wooden materials to ensure durability and aesthetic appeal.",
  },
  {
    question: "Can I customize the size of the frame?",
    answer:
      "Yes, you can choose from preset sizes or enter custom dimensions while placing your order.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually processed within 2–3 business days and delivered within 5–7 business days.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes, we offer a 7-day return/exchange window for any damaged or defective products.",
  },
  {
    question: "How do I mount the frame?",
    answer:
      "Each frame comes with mounting hardware and instructions. Installation is straightforward and typically requires basic tools.",
  },
  {
    question: "Is the backlight adjustable?",
    answer:
      "Currently, the backlight brightness is fixed, designed to provide optimal illumination for the artwork. We are exploring options for adjustable brightness in future models.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close the answer if it's already open
    } else {
      setOpenIndex(index); // Open the selected answer
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start font-[poppins]">
      {/* Image Section */}
      <div className="relative w-full h-full md:h-[450px] rounded-lg overflow-hidden shadow-lg mt-18 hidden sm:block">
        <img
          src={Image1} // Replace with your actual image
          alt="Custom Frame"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 md:p-8">
          <p className="text-white text-xl md:text-2xl font-semibold text-center pb-4">
            Find Answers to Your Questions
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full">
        <h2 className="text-3xl font-bold text-foreground mb-6 md:mb-8 text-center md:text-left">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span className="text-xl">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
