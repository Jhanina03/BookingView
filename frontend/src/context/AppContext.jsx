import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isInactive, setIsInactive] = useState(false);

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

const fetchUser = async () => {
  setIsLoading(true);
  try {
    const { data } = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    if (data.success) {
      setIsOwner(data.role === "hotelOwner");
      setSearchedCities(data.recentSearchedCities);
      setIsInactive(false); // usuario activo
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      if (
        error.response.data.message ===
        "Tu cuenta está inactiva. ¿Deseas reactivarla?"
      ) {
        setIsInactive(true); // usuario inactivo
      } else {
        toast.error(error.response.data.message);
      }
    } else if (error.response && error.response.status === 401) {
      toast.error("No autenticado");
    } else {
      toast.error(error.message);
    }
  } finally {
    setIsLoading(false); // siempre termina
  }
};

  // Effects
  useEffect(() => {
    if (user) fetchUser();
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    isLoading,
    isInactive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
