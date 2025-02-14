import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Energy Management System</h1>
        <p>Monitorizează și gestionează consumul de energie cu ușurință.</p>
        <button onClick={handleLoginClick} className="button">
          Login / Sign-up
        </button>
      </header>
      <section className="infoSection">
        <h2>Despre sistem</h2>
        <p>
          Acest sistem de management al energiei permite administratorilor să
          gestioneze utilizatorii și dispozitivele de măsurare a consumului de
          energie, oferind o platformă eficientă pentru monitorizarea consumului
          și optimizarea resurselor energetice.
        </p>
        <p>
          Utilizatorii pot vizualiza dispozitivele asociate și pot monitoriza
          consumul lor în timp real, beneficiind de o interfață simplă și
          intuitivă.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
