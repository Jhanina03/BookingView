import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ReactivateAccount = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);

const handleReactivate = async () => {
  setLoading(true);
  try {
    const token = await getToken();
    const { data } = await axios.post(
      "/api/user/reactivate",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(data.message);
      // Navega a la ruta correcta
      navigate("/owner"); 
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Tu cuenta está inactiva
      </h1>
      <p className="mb-6 text-center">
        Para poder acceder nuevamente, debes reactivar tu cuenta.
      </p>
      <button
        onClick={handleReactivate}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Reactivando..." : "Reactivar cuenta"}
      </button>
    </div>
  );
};

export default ReactivateAccount;
