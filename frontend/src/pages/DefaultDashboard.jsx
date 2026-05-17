import React, { useState } from "react";
import {
  Phone,
  Recycle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../styles/DefaultHome.css";

import orderApi from "../api/orderApi";

const DefaultDashboard = () => {

  const navigate = useNavigate();

  // SAFE USER PARSE
  let user = null;

  try {

    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {
      user = JSON.parse(storedUser);
    }

  } catch (error) {
    console.error(error);
  }

  // STATES
  const [activeStep, setActiveStep] =
    useState(0);

  const [steps] = useState([
    "Product",
    "Mobile No.",
    "Address",
    "Schedule",
  ]);

  const [cities] = useState([
    "DELHI",
    "HARYANA",
    "UTTAR PRADESH",
  ]);

  const [city, setCity] = useState("");

  const [categories] = useState([
    {
      id: 1,
      title: "Plastic",
    },
    {
      id: 2,
      title: "Paper",
    },
    {
      id: 3,
      title: "Metal",
    },
  ]);

  // ORDER FORM STATE
  const [orderData, setOrderData] =
    useState({
      categoryID: "",
      phone: "",
      address: "",
      pickupDate: "",
      pickupTime: "",
    });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });

  };

  // SUBMIT ORDER
  const handleSubmitOrder = async () => {

    try {

      const payload = {

        status: true,

        pickupDate:
          `${orderData.pickupDate}T${orderData.pickupTime}:00`,

        addressID: 1,

        userId: user?.id,

        categoryID:
          orderData.categoryID,

        subCategoryID: 1,
      };

      console.log(payload);

      await orderApi.createOrder(
        payload
      );

      alert(
        "Pickup scheduled successfully"
      );

      setOrderData({
        categoryID: "",
        phone: "",
        address: "",
        pickupDate: "",
        pickupTime: "",
      });

      setActiveStep(0);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to schedule pickup"
      );

    }
  };

  return (

    <div className="hero-container">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo-section">

          <div className="logo-icon">
            <Recycle />
          </div>

          <div>
            <h1 className="logo-title">
              SCRAP
            </h1>

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

            <button>
              SEND
            </button>

          </div>

          {user ? (

            <button
              className="login-btn"
              onClick={() =>
                navigate("/user")
              }
            >
              {user?.username || "User"}
            </button>

          ) : (

            <button
              className="login-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          )}

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <h2>
            SELL YOUR{" "}
            <span>SCRAP</span> HERE !
          </h2>

          <p>
            Plastic - Newspaper -
            Electronics - Many More
          </p>

        </div>

        {/* CITY SECTION */}
        <div className="cities">

          {cities.map((c, index) => (

            <div
              key={index}
              className="city-card"
            >

              <button
                className={`city-btn ${
                  city === c
                    ? "active-step"
                    : ""
                }`}
                onClick={() =>
                  setCity(c)
                }
              >
                {c}
              </button>

            </div>

          ))}

        </div>

        {/* MAIN CARD */}
        <div className="main-card">

          {/* STEP NAVIGATION */}
          <div className="steps-box">

            {steps.map(
              (step, index) => (

                <div
                  className="step-item"
                  key={index}
                  onClick={() =>
                    setActiveStep(index)
                  }
                >

                  <div
                    className={`step-number ${
                      activeStep === index
                        ? "active-step"
                        : ""
                    }`}
                  >
                    0{index + 1}
                  </div>

                  <p>{step}</p>

                </div>

              )
            )}

          </div>

          {/* STEP CONTENT */}
          <div className="step-content">

            {/* STEP 1 */}
            {activeStep === 0 && (

              <div>

                <h2>
                  Select Product
                </h2>

                <div className="product-buttons">

                  {categories.map(
                    (category) => (

                      <button
                        key={category.id}
                        className={
                          orderData.categoryID ===
                          category.id
                            ? "active-product"
                            : ""
                        }
                        onClick={() =>
                          setOrderData({
                            ...orderData,
                            categoryID:
                              category.id,
                          })
                        }
                      >
                        {category.title}
                      </button>

                    )
                  )}

                </div>

              </div>

            )}

            {/* STEP 2 */}
            {activeStep === 1 && (

              <div>

                <h2>
                  Enter Mobile Number
                </h2>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={orderData.phone}
                  onChange={handleChange}
                />

              </div>

            )}

            {/* STEP 3 */}
            {activeStep === 2 && (

              <div>

                <h2>
                  Select Address
                </h2>

                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={orderData.address}
                  onChange={handleChange}
                />

              </div>

            )}

            {/* STEP 4 */}
            {activeStep === 3 && (

              <div>

                <h2>
                  Schedule Pickup
                </h2>

                <input
                  type="date"
                  name="pickupDate"
                  value={
                    orderData.pickupDate
                  }
                  onChange={handleChange}
                />

                <input
                  type="time"
                  name="pickupTime"
                  value={
                    orderData.pickupTime
                  }
                  onChange={handleChange}
                />

                <button
                  className="submit-order-btn"
                  onClick={
                    handleSubmitOrder
                  }
                >
                  Schedule Pickup
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* FLOATING BUTTON */}
      <div className="whatsapp-btn">
        <Phone />
      </div>

      {/* HELP BOX */}
      <div className="help-box">

        <h3>
          Need Help
        </h3>

        <p>
          Contact our support team
        </p>

      </div>

    </div>
  );
};

export default DefaultDashboard;