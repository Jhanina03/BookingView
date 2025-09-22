import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState(""); // ⚡ Para validar
  const calendarRef = useRef();

  useEffect(() => {
    const room = roomsDummyData.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [id]);

  // Cerrar calendario si hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Calcular diferencia de días
  const getDayDifference = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Validación al enviar
  const handleSubmit = (e) => {
    e.preventDefault();
    const days = getDayDifference();

    if (days < 2) {
      setError("⚠️ La estancia mínima es de 2 noches (3 días).");
      return;
    }

    //setError("")
    //alert(`Reserva confirmada para ${days} noches ✅`)
    // enviar al backend
  };

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Room Address */}
        <div>
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room Image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Room Image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="felx flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
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
          </div>
          {/* Room Price */}
          <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
        </div>

        {/* CheckIn CheckOut Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-4xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            {/* Dates selector */}
            <div className="relative flex flex-col">
              <label className="font-medium">Dates</label>
              <input
                type="text"
                readOnly
                value={
                  dateRange[0].startDate && dateRange[0].endDate
                    ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
                    : "Select dates"
                }
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none cursor-pointer"
                onClick={() => setShowCalendar((prev) => !prev)}
              />
              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="absolute z-50 mt-2 bg-white p-4 rounded shadow-lg"
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    showDateDisplay={false}
                    minDate={new Date("2022-12-31")}
                    maxDate={new Date("2026-12-31")}
                  />
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                min={1}
                max={4}
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90
          hover:animate-scale active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
          >
            Book Now
          </button>
        </form>

        {/* Mensaje de error */}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* Common Specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Room description... Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Architecto, in alias molestiae impedit aliquam vel
            doloribus, esse culpa dolorem totam, doloremque dolor cumque?
            Eveniet saepe iste, ducimus asperiores vitae quisquam.
          </p>
        </div>

        {/* Hosted By */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner.image}
              alt="Host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted By {room.hotel.name}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
