import { React } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/footer";
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

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg, inactiveUser, handleReactivate } = useAppContext();

  return (
    <div>
      <Toaster />
      {/* Modal de usuario inactivo */}
      {inactiveUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">Tu cuenta está inactiva. ¿Deseas reactivarla?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReactivate}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Sí
              </button>
              <button
                onClick={() => alert("No puedes ingresar hasta reactivar la cuenta.")}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
