import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";

axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    
    const currency = import.meta.env.VITE_CURRENCY || "$"
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([])
    const [rooms, setRooms] = useState([])

    const fetchRooms = async () => {
        try {
            const {data} = await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }}catch (error) {
            toast.error(error.message)
        }
    }
const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    if (data.success) {
      setIsOwner(data.role === "hotelOwner");
      setSearchedCities(data.recentSearchedCities);
    } else if (data.inactive) {
      // Usuario inactivo -> preguntar si desea reactivar
      const reactivar = window.confirm("Tu cuenta está inactiva. ¿Deseas reactivarla?");
      if (reactivar) {
        await axios.post(
          "/api/user/reactivate",
          {},
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        toast.success("Cuenta reactivada. Ingresa nuevamente.");
        window.location.reload(); // refrescar estado
      } else {
        toast.error("No puedes ingresar hasta reactivar tu cuenta.");
      }
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user])

    useEffect(() => {
    
            fetchRooms();
        
    }, [])

    
    
    const value = {
        currency, navigate, user, getToken, isOwner, setIsOwner, axios,
        showHotelReg, setShowHotelReg, searchedCities, setSearchedCities,rooms, setRooms
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);