import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const doctorToken = localStorage.getItem("doctorToken");
    const storeAdminToken = localStorage.getItem("storeAdminToken");

    const isStoreAdminLoggedIn = Boolean(storeAdminToken);

    const storeAdminInfo = JSON.parse(
        localStorage.getItem("storeAdminInfo") || "null"
    );

    const doctorInfo = doctorToken
        ? JSON.parse(
              localStorage.getItem("doctorInfo") || "{}"
          )
        : null;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] =
        useState(false);

    const [showLoginMenu, setShowLoginMenu] =
        useState(false);

    const [showRegisterMenu, setShowRegisterMenu] =
        useState(false);


    // =========================
    // USER LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

        window.location.reload();
    };


    // =========================
    // DOCTOR LOGOUT
    // =========================

    const handleDoctorLogout = () => {

        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctorInfo");

        navigate("/");

        window.location.reload();
    };


    // =========================
    // STORE ADMIN LOGOUT
    // =========================

    const handleStoreAdminLogout = () => {

        localStorage.removeItem("storeAdminToken");
        localStorage.removeItem("storeAdminInfo");

        navigate("/");

        window.location.reload();
    };


    // =========================
    // FETCH NOTIFICATIONS
    // =========================

    const fetchNotifications = async () => {

        if (!token) {
            return;
        }

        try {

            const response =
                await api.get("/notifications/my");

            setNotifications(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch notifications:",
                error
            );
        }
    };


    // =========================
    // FETCH UNREAD COUNT
    // =========================

    const fetchUnreadCount = async () => {

        if (!token) {
            return;
        }

        try {

            const response =
                await api.get(
                    "/notifications/unread-count"
                );

            setUnreadCount(
                response.data.count
            );

        } catch (error) {

            console.error(
                "Failed to fetch unread count:",
                error
            );
        }
    };


    // =========================
    // LOAD NOTIFICATIONS
    // =========================

    useEffect(() => {

        if (!token) {
            return;
        }

        fetchNotifications();
        fetchUnreadCount();

        const interval =
            setInterval(() => {

                fetchUnreadCount();

            }, 30000);

        return () =>
            clearInterval(interval);

    }, [token]);


    // =========================
    // OPEN NOTIFICATIONS
    // =========================

    const handleNotificationClick = () => {

        setShowNotifications(
            !showNotifications
        );

        if (!showNotifications) {

            fetchNotifications();
        }
    };


    // =========================
    // MARK NOTIFICATION AS READ
    // =========================

    const handleMarkAsRead = async (
        notification
    ) => {

        if (notification.read) {
            return;
        }

        try {

            await api.put(
                `/notifications/${notification.id}/read`
            );

            setNotifications(
                (prevNotifications) =>
                    prevNotifications.map(
                        (item) =>
                            item.id ===
                            notification.id
                                ? {
                                      ...item,
                                      read: true
                                  }
                                : item
                    )
            );

            setUnreadCount(
                (prevCount) =>
                    Math.max(
                        prevCount - 1,
                        0
                    )
            );

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };


    // =========================
    // LOGIN MENU
    // =========================

    const handleLoginMenuClick = () => {

        setShowRegisterMenu(false);

        setShowLoginMenu(
            !showLoginMenu
        );
    };


    // =========================
    // REGISTER MENU
    // =========================

    const handleRegisterMenuClick = () => {

        setShowLoginMenu(false);

        setShowRegisterMenu(
            !showRegisterMenu
        );
    };


    return (

        <nav className="navbar">

            {/* =========================
                LOGO
            ========================= */}

            <div className="logo">

                <Link to="/">
                    Appointment
                </Link>

            </div>


            {/* =========================
                NAVIGATION LINKS
            ========================= */}

            <ul className="nav-links">

                <li>
                    <Link to="/">
                        Home
                    </Link>
                </li>


                <li>
                    <Link to="/doctors">
                        Doctors
                    </Link>
                </li>


                <li>
                    <Link to="/stores">
                        Medical Stores
                    </Link>
                </li>


                {/* =========================
                    PATIENT APPOINTMENTS
                ========================= */}

                {token && (

                    <li>
                        <Link to="/my-appointments">
                            My Appointments
                        </Link>
                    </li>

                )}


                {/* =========================
                    DOCTOR APPOINTMENTS
                ========================= */}

                {doctorToken && (

                    <li>
                        <Link to="/doctor-appointments">
                            My Appointments
                        </Link>
                    </li>

                )}


                <li>
                    <Link to="/about">
                        About
                    </Link>
                </li>


                <li>
                    <Link to="/contact">
                        Contact
                    </Link>
                </li>


                {/* =================================================
                    LOGGED IN PATIENT
                ================================================= */}

                {token && (

                    <>

                        {/* NOTIFICATIONS */}

                        <li className="notification-wrapper">

                            <button
                                className="notification-btn"
                                onClick={
                                    handleNotificationClick
                                }
                            >

                                🔔

                                {unreadCount > 0 && (

                                    <span className="notification-badge">

                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}

                                    </span>

                                )}

                            </button>


                            {showNotifications && (

                                <div className="notification-dropdown">

                                    <div className="notification-header">

                                        <h3>
                                            Notifications
                                        </h3>

                                        {unreadCount > 0 && (

                                            <span>
                                                {unreadCount} unread
                                            </span>

                                        )}

                                    </div>


                                    {notifications.length === 0 ? (

                                        <div className="no-notifications">

                                            <div>
                                                🔔
                                            </div>

                                            <p>
                                                No notifications
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="notification-list">

                                            {notifications.map(
                                                (notification) => (

                                                    <div
                                                        key={
                                                            notification.id
                                                        }
                                                        className={
                                                            `notification-item ${
                                                                !notification.read
                                                                    ? "unread"
                                                                    : ""
                                                            }`
                                                        }
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        <div className="notification-icon">
                                                            🔔
                                                        </div>


                                                        <div className="notification-content">

                                                            <p>
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <span>
                                                                {
                                                                    notification.createdAt
                                                                }
                                                            </span>

                                                        </div>


                                                        {!notification.read && (

                                                            <span className="unread-dot">
                                                            </span>

                                                        )}

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            )}

                        </li>


                        {/* PATIENT PROFILE */}

                        <li>

                            <Link to="/profile">

                                <button className="profile-btn">
                                    Profile
                                </button>

                            </Link>

                        </li>


                        {/* PATIENT LOGOUT */}

                        <li>

                            <button
                                className="profile-btn"
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </button>

                        </li>

                    </>

                )}


                {/* =================================================
                    LOGGED IN DOCTOR
                ================================================= */}

                {doctorToken && (

                    <>

                        <li>

                            <Link to="/doctor-dashboard">
                                Dashboard
                            </Link>

                        </li>


                        <li>

                            <Link to="/doctor-own-profile">

                                <button className="profile-btn">

                                    {doctorInfo?.name
                                        ? doctorInfo.name
                                        : "Doctor Profile"}

                                </button>

                            </Link>

                        </li>


                        <li>

                            <button
                                className="profile-btn"
                                onClick={
                                    handleDoctorLogout
                                }
                            >
                                Logout
                            </button>

                        </li>

                    </>

                )}


                {/* =================================================
                    LOGGED IN MEDICAL STORE
                ================================================= */}

                {isStoreAdminLoggedIn && (

                    <>

                        {/* STORE DASHBOARD */}

                        <li>

                            <Link to="/store-admin-dashboard">
                                Dashboard
                            </Link>

                        </li>


                        {/* STORE PROFILE */}

                        <li>

                            <button
                                className="profile-btn"
                                onClick={() =>
                                    navigate(
                                        "/store-admin-dashboard"
                                    )
                                }
                            >

                                {storeAdminInfo?.storeName
                                    ? storeAdminInfo.storeName
                                    : "Store Profile"}

                            </button>

                        </li>


                        {/* STORE LOGOUT */}

                        <li>

                            <button
                                className="profile-btn"
                                onClick={
                                    handleStoreAdminLogout
                                }
                            >
                                Logout
                            </button>

                        </li>

                    </>

                )}


                {/* =================================================
                    LOGGED OUT
                ================================================= */}

                {!token &&
                    !doctorToken &&
                    !isStoreAdminLoggedIn && (

                    <>

                        {/* LOGIN */}

                        <li className="login-wrapper">

                            <button
                                className="login-btn"
                                onClick={
                                    handleLoginMenuClick
                                }
                            >
                                Login
                            </button>


                            {showLoginMenu && (

                                <div className="login-dropdown">

                                    <Link
                                        to="/login"
                                        onClick={() =>
                                            setShowLoginMenu(false)
                                        }
                                    >
                                        Login as Patient
                                    </Link>


                                    <Link
                                        to="/doctor-login"
                                        onClick={() =>
                                            setShowLoginMenu(false)
                                        }
                                    >
                                        Login as Doctor
                                    </Link>


                                    <Link
                                        to="/medical-store-login"
                                        onClick={() =>
                                            setShowLoginMenu(false)
                                        }
                                    >
                                        Login as Medical Store
                                    </Link>

                                </div>

                            )}

                        </li>


                        {/* REGISTER */}

                        <li className="login-wrapper">

                            <button
                                className="register-btn"
                                onClick={
                                    handleRegisterMenuClick
                                }
                            >
                                Register
                            </button>


                            {showRegisterMenu && (

                                <div className="login-dropdown">

                                    <Link
                                        to="/register"
                                        onClick={() =>
                                            setShowRegisterMenu(false)
                                        }
                                    >
                                        Register as Patient
                                    </Link>


                                    <Link
                                        to="/doctor-register"
                                        onClick={() =>
                                            setShowRegisterMenu(false)
                                        }
                                    >
                                        Register as Doctor
                                    </Link>


                                    <Link
                                        to="/medical-store-register"
                                        onClick={() =>
                                            setShowRegisterMenu(false)
                                        }
                                    >
                                        Register as Medical Store
                                    </Link>

                                </div>

                            )}

                        </li>

                    </>

                )}

            </ul>

        </nav>
    );
}

export default Navbar;