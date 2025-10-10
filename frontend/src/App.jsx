import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/appContext";
import Loader from "./components/Loader";
import ReactivateAccount from "./pages/ReactivateAccount";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg, isLoading, isInactive } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      
      {isInactive && (
        <div className="p-4 bg-yellow-100 text-yellow-800 text-center">
          Tu cuenta está inactiva. <a href="/reactivate" className="underline">Reactivar ahora</a>
        </div>
      )}

      <div className="min-h-[70vh]">
        {isLoading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/loader/:nextUrl" element={<Loader />} />
            <Route path="/reactivate" element={<ReactivateAccount />} />
            <Route path="/owner" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add-room" element={<AddRoom />} />
              <Route path="list-room" element={<ListRoom />} />
            </Route>
          </Routes>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
