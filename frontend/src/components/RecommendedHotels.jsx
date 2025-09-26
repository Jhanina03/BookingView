import React, { useState,useEffect } from "react";
import HotelCard from "../components/HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/appContext";
import { set } from "date-fns";
import { fi } from "date-fns/locale";

const RecommendedHotels = () => {
  const {rooms, searchedCities} = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels =()=>{
    const filteredHotels = rooms.slice().filter(room => searchedCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
  }

  useEffect(() => {

    filterHotels();
  },    [rooms, searchedCities]);

  return recommended.length > 0 && (
    <div className="flex flex-col items-center mt-10 px-6 md:px-16 lg:px-24 bg-slate-50">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked section of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index}></HotelCard>
        ))}
      </div>
    </div>
  );
};

export default RecommendedHotels;
