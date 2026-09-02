import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-left">
          <h1>Book Your Doctor Appointment Easily</h1>

          <p>
            Find trusted doctors from nearby medical stores
            and book appointments online in just a few clicks.
          </p>
        </div>

        <div className="hero-right">
          <img
            src="https://livingwithfibromyalgia.org/wp-content/uploads/2025/05/image-85.jpeg"
            alt="Doctor"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;