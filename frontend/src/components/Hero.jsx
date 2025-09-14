import React, { useState, useRef, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Hero = () => {
  const [form, setForm] = useState({
    destination: "",
    guests: 1,
  });
  const navigate = useNavigate();

  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef();

  // Cierra el calendario si el usuario hace click fuera
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

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const checkIn = dateRange[0].startDate
      ? dateRange[0].startDate.toISOString().split("T")[0]
      : "";
    const checkOut = dateRange[0].endDate
      ? dateRange[0].endDate.toISOString().split("T")[0]
      : "";
    navigate(
      `/rooms?destination=${form.destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${form.guests}`
    );
  };

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className="bg-primary/50 px-3.5 py-1 rounded-full mt-20">
        Diviertete a lo grande
      </p>
      <h1 className="font-playfair text-2xl md:text-6xl md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Comodidad como en casa
      </h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint neque
        animi beatae expedita ut nam. Tenetur temporibus unde necessitatibus
        officiis harum sit quisquam, quibusdam provident dolore, laborum nihil
        quod quidem.
      </p>
      <form
        className="bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto mt-8"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destination">Destination</label>
          </div>
          <input
            list="destinations"
            id="destination"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            required
            value={form.destination}
            onChange={handleChange}
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label>Dates</label>
          </div>
          <input
            type="text"
            readOnly
            value={
              dateRange[0].startDate && dateRange[0].endDate
                ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
                : "Select dates"
            }
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none cursor-pointer"
            onClick={() => setShowCalendar((prev) => !prev)}
          />
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow-lg"
            >
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                showDateDisplay={false}
                minDate={new Date('2022-12-31')} // Solo fechas desde hoy
                maxDate={new Date('2026-12-31')} // Solo hasta el 2026
              />
            </div>
          )}
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16"
            placeholder="0"
            value={form.guests}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          <img src={assets.searchIcon} alt="" className="h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
