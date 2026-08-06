import Navbar from "../components/Navbar";
import "../styles/Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>Explore The World With TripVault ✈️</h1>

        <p>
          Plan your journeys, organize your trips and make unforgettable
          memories.
        </p>

        <button>Get Started</button>
      </section>
    </>
  );
}

export default Home;