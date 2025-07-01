import React, { useEffect, useState } from "react";
import axios from "axios";
import backgroundFrame from "../../assets/frontend_assets/BestSellers/Frame1.jpeg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/newarrivals"
        );
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="mt-20 text-center font-[poppins]">
      <h1 className="text-4xl font-extrabold mb-2">New Arrivals</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
        Fresh designs for every space, curated to elevate your home decor
      </p>

      <div
        className="relative w-full h-[40rem] bg-cover bg-center bg-fixed mt-10 px-8 z-0"
        style={{
          backgroundImage: `url(${backgroundFrame})`,
        }}
      >
        {/* Manual Slider Controls */}
        <div className="absolute z-10 top-1/2 -translate-y-1/2 left-4">
          <button className="swiper-button-prev bg-white p-3 rounded-full shadow hover:bg-orange-700 transition border-1">
            ◀
          </button>
        </div>
        <div className="absolute z-10 top-1/2 -translate-y-1/2 right-4">
          <button className="swiper-button-next bg-white p-3 rounded-full shadow hover:bg-orange-700 transition border-1">
            ▶
          </button>
        </div>

        {loading ? (
          <p className="text-white text-xl mt-10">Loading...</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {items.map((item, index) => {
              const firstSize =
                item.sizes && item.sizes.length > 0 ? item.sizes[0] : null;

              return (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 mt-18 flex flex-col items-center text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.content}</p>
                    <div className="flex justify-center items-center mt-2">
                      <span className="text-yellow-500">
                        {"★".repeat(Math.round(item.rating || 4))}
                      </span>
                      <span className="text-gray-500 ml-2">
                        {item.rating || 4} out of 5 stars
                      </span>
                    </div>
                    <div className="flex justify-center items-center mt-2">
                      {firstSize ? (
                        <>
                          <span className="text-4xl text-yellow-500">
                            ₹{firstSize.price}
                          </span>
                          <span className="text-gray-500 ml-2 line-through">
                            ₹{firstSize.original}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-500 text-lg">
                          No sizes available
                        </span>
                      )}
                    </div>

                    <Link to={`/newarrivalorderpage/${item._id}`}>
                      <button className="mt-4 bg-orange-400 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Buy Now
                      </button>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
