import React from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const AllRooms = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-playfair text-4xl md:text-[40px]">Rooms</h1>
        <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
          Take advantage of our limited-time offers and special packages to
          enhance your stay and create unforgettable memories
        </p>
      </div>

      {/* Content: Rooms (left) + Filters (right) */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Rooms list */}
        <div className="flex flex-col gap-8 w-full lg:w-2/3">
          {roomsDummyData.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              {/* Room Image */}
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt="room-img"
                title="View Room Details"
                className="max-h-65 rounded-xl shadow-lg object-cover cursor-pointer"
              />

              {/* Room Info */}
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-800">{room.hotel.city}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel.name}
                </p>

                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{room.hotel.address}</span>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-3 gap-4">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Room Price per Night */}
                <p className="text-xl font-medium text-gray-700">
                  ${room.pricePerNight} / night
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="w-full lg:w-1/3">
          <div className="p-6 border border-gray-300 rounded-lg shadow-md bg-white text-gray-600">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Filters</p>
              <button className="text-sm text-blue-600 hover:underline">
                Clear
              </button>
            </div>
            {/* Aquí agregarás tus controles de filtro */}
            <div className="text-sm text-gray-500">
              <p>Price Range</p>
              <p>Amenities</p>
              <p>Room Type</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
