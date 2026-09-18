import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import StoreDoctorRequests from "../../component/StoreDoctorRequests/StoreDoctorRequests";
import "./StoreAdminDashboard.css";

function StoreAdminDashboard() {
    return (
        <>
            <Navbar />

            <div className="store-admin-dashboard">

                <div className="store-admin-header">
                    <h1>Medical Store Dashboard</h1>

                    <p>
                        Manage your medical store and doctor requests.
                    </p>
                </div>

                <StoreDoctorRequests />

            </div>

            <Footer />
        </>
    );
}

export default StoreAdminDashboard;