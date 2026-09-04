import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Doctors from "./pages/Doctors/Doctors";
import DoctorProfile from "./pages/DoctorProfile/DoctorProfile";
import Appointment from "./pages/Appointment/Appointment";
import MyAppointments from "./pages/MyAppointments/MyAppointments";
import AppointmentSuccess from "./pages/AppointmentSuccess/AppointmentSuccess";
import Profile from "./pages/Profile/Profile";
import DoctorLogin from "./pages/DoctorLogin/DoctorLogin";
import DoctorAppointments from "./pages/DoctorAppointments/DoctorAppointments";
import DoctorRegister from "./pages/DoctorRegister/DoctorRegister";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import DoctorOwnProfile from "./pages/DoctorOwnProfile/DoctorOwnProfile";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";
import MedicalHistory from "./pages/MedicalHistory/MedicalHistory";
import RescheduleAppointment from "./pages/RescheduleAppointment/RescheduleAppointment";
import PatientMedicalHistory from "./pages/PatientMedicalHistory/PatientMedicalHistory";
import MedicalStores from "./pages/MedicalStores/MedicalStores";
import MedicalStoreDetails from "./pages/MedicalStoreDetails/MedicalStoreDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment-success" element={<AppointmentSuccess />}/>
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctor-own-profile" element={<DoctorOwnProfile />}/>
        <Route path="/doctor-dashboard" element={<DoctorDashboard />}/>
        <Route path="/medical-history" element={<MedicalHistory />}/>
        <Route path="/reschedule-appointment/:id" element={<RescheduleAppointment />}/>
        <Route path="/stores" element={<MedicalStores />}/>
        <Route path="/doctor/patient/:patientId/medical-history" element={<PatientMedicalHistory />} />
        <Route path="/stores/:id"  element={<MedicalStoreDetails />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;