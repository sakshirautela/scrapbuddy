import React, { use } from "react";
import {
  Phone,
  Recycle,
  Newspaper,
  Monitor,
  Car,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DefaultHome.css"
const DefaultDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [steps, setSteps] = React.useState([
    "Product",
    "Mobile No.",
    "Address",
    "Schedule",
  ]);
    const [activeStep, setActiveStep] = useState(0);

  const [cities, setCities] = React.useState([
    "DELHI",
    "HARYANA",
    "UTTAR PRADESH",
  ]);
  const [city, setCity] = React.useState("");
  const handleSetCity = (e) => {
    setCity(e.target.innerText);
  };
  const [user, setUser] = JSON.parse(localStorage.getItem("user")) || [];
  return (
    <div className="hero-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-icon">
            <Recycle />
          </div>

          <div>
            <h1 className="logo-title">SCRAP</h1>
            <p className="logo-subtitle">
              Online Kabadiwala
            </p>
          </div>
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/">Why Us?</a>
          <a href="/">Scrap Rates</a>
          <a href="/">Services</a>
          <a href="/">Contact</a>
        </div>

        <div className="nav-right">
          <div className="phone-box">
            <input
              type="text"
              placeholder="+91 Enter Number"
            />

            <button>SEND</button>
          </div>
{user ? (
  <button className="login-btn" onClick={() => navigate("/user")}>
    {user?.name || "User"}
  </button>
) : (
  <button className="login-btn" onClick={() => navigate("/login")}>
    Login
  </button>
)}

        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>
            SELL YOUR{" "}
            <span>SCRAP</span> HERE !
          </h2>
          <p>
            Plastic - Newspaper - Electronics -
            Many More
          </p>
        </div>

        {/* Cities */}
        <div className="cities">
          {cities.map((c, index) => (
            <div key={index} className="city-card">
              {/* 2. Dynamically add the 'active' class if this city is selected */}
              <button
                className={`city-btn ${city === c ? 'active-step' : ''}`}
                onClick={() => setCity(c)}
              >
                {c}
              </button>
            </div>
          ))}
        </div>

        {/* Main Card */}
       <div className="main-card">

      {/* Steps */}
      <div className="steps-box">

        {steps.map((step, index) => (

          <div
            className="step-item"
            key={index}
            onClick={() => setActiveStep(index)}
          >

            <div
              className={`step-number ${
                activeStep === index ? "active-step" : ""
              }`}
            >
              0{index + 1}
            </div>

            <p>{step}</p>

          </div>
        ))}

      </div>

      {/* Dynamic Content */}

      <div className="step-content">

        {activeStep === 0 && (
          <div>
            <h2>Select Product</h2>

            <button>Plastic</button>
            <button>Paper</button>
            <button>Metal</button>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <h2>Enter Mobile Number</h2>

            <input
              type="text"
              placeholder="Enter phone number"
            />
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h2>Select Address</h2>

            <input
              type="text"
              placeholder="Enter city"
            />

            <input
              type="text"
              placeholder="Enter address"
            />
          </div>
        )}

        {activeStep === 3 && (
          <div>
            <h2>Schedule Pickup</h2>

            <input type="date" />

            <input type="time" />
          </div>
        )}

    </div>
          {/* Categories */}
          <div className="categories-grid">
            {categories.map((item, index) => (
              <div
                key={index}
                className={`category-card ${item.active
                  ? "active-category"
                  : ""
                  }`}
              >
                {item.icon}

                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Floating */}
      <div className="whatsapp-btn">
        <Phone />
      </div>

      <div className="help-box">
        <h3>Need Help</h3>

        <p>Contact our support team</p>
      </div>
    </div>
  );
};

export default DefaultDashboard;