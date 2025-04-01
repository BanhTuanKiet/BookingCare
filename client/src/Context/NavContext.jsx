import { createContext, useEffect, useState } from "react";
import axios from "../Util/AxiosConfig";
import images from "../Image/Specialty/Index";
import { useNavigate } from "react-router-dom";

const NavContext = createContext();

const NavProvider = ({ children }) => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([])
  const [services, setServices] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const GetAllSpecialties = async () => {
      try {
        const response = await axios.get("/specialties");

        const mergedSpecialties = response.data.map((spec) => ({
          id: spec.specialtyId,
          name: spec.name,
          src: images[spec.name],
        }));

        setSpecialties(mergedSpecialties);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
      }
    };

    GetAllSpecialties();
  }, []);

  useEffect(() => {
    const GetAllServices = async () => {
      try {
        const response = await axios.get(`/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    GetAllServices();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      }
    };

    fetchDoctors();
  }, []);

  const HandleNavigation = (type, specialtyName) => {
    navigate(`/${type}/${specialtyName}`);
  };

  console.log(doctors);

  return (
    <NavContext.Provider
      value={{
        specialties,
        services,
        doctors,
        HandleNavigation,
        // isAuthenticated,
        // userName,
        // login,
        // logout,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export { NavContext, NavProvider };
