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
import RescheduleAppointment from "./pages/RescheduleAppointment/RescheduleAppointment";

import Profile from "./pages/Profile/Profile";
import MedicalHistory from "./pages/MedicalHistory/MedicalHistory";
import PatientMedicalHistory from "./pages/PatientMedicalHistory/PatientMedicalHistory";

import DoctorLogin from "./pages/DoctorLogin/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister/DoctorRegister";
import DoctorAppointments from "./pages/DoctorAppointments/DoctorAppointments";
import DoctorOwnProfile from "./pages/DoctorOwnProfile/DoctorOwnProfile";
import DoctorDashboard from "./pages/DoctorDashboard/DoctorDashboard";

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

import MedicalStores from "./pages/MedicalStores/MedicalStores";
import MedicalStoreDetails from "./pages/MedicalStoreDetails/MedicalStoreDetails";

import StoreAdminDashboard from "./pages/StoreAdminDashboard/StoreAdminDashboard";

import MedicalStoreRegister
    from "./pages/MedicalStoreRegister/MedicalStoreRegister";

import MedicalStoreLogin from "./pages/MedicalStoreLogin/MedicalStoreLogin";    


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================================
                    GENERAL PAGES
                ========================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />


                {/* ==========================================
                    DOCTORS
                ========================================== */}

                <Route
                    path="/doctors"
                    element={<Doctors />}
                />

                <Route
                    path="/doctor/:id"
                    element={<DoctorProfile />}
                />


                {/* ==========================================
                    PATIENT APPOINTMENTS
                ========================================== */}

                <Route
                    path="/appointment"
                    element={<Appointment />}
                />

                <Route
                    path="/appointment-success"
                    element={<AppointmentSuccess />}
                />

                <Route
                    path="/my-appointments"
                    element={<MyAppointments />}
                />

                <Route
                    path="/reschedule-appointment/:id"
                    element={<RescheduleAppointment />}
                />


                {/* ==========================================
                    PATIENT PROFILE / MEDICAL HISTORY
                ========================================== */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/medical-history"
                    element={<MedicalHistory />}
                />

                <Route
                    path="/doctor/patient/:patientId/medical-history"
                    element={<PatientMedicalHistory />}
                />


                {/* ==========================================
                    DOCTOR AUTHENTICATION
                ========================================== */}

                <Route
                    path="/doctor-login"
                    element={<DoctorLogin />}
                />

                <Route
                    path="/doctor-register"
                    element={<DoctorRegister />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* ==========================================
                    DOCTOR DASHBOARD
                ========================================== */}

                <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/doctor-appointments"
                    element={<DoctorAppointments />}
                />

                <Route
                    path="/doctor-own-profile"
                    element={<DoctorOwnProfile />}
                />


                {/* ==========================================
                    MEDICAL STORES
                ========================================== */}

                <Route
                    path="/stores"
                    element={<MedicalStores />}
                />

                <Route
                    path="/stores/:id"
                    element={<MedicalStoreDetails />}
                />


                {/* ==========================================
                    MEDICAL STORE ADMIN
                ========================================== */}

                <Route
                    path="/store-admin-dashboard"
                    element={<StoreAdminDashboard />}
                />

                <Route
                    path="/medical-store-register"
                    element={<MedicalStoreRegister />}
                />
                <Route
                    path="/medical-store-login"
                    element={<MedicalStoreLogin />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;