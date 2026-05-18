import React, { useState } from "react";

import {
  Phone,
  Recycle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/DefaultHome.css";

import CategoriesWithSubCat
  from "../components/input/CategoriesWithSubCat";

import AddressForm
  from "../components/input/Address";

import orderApi
  from "../api/orderApi";

const DefaultDashboard = () => {

  const navigate = useNavigate();

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

  // STEPS
  const [activeStep,
    setActiveStep] =
    useState(0);

  const steps = [
    "Product",
    "Mobile No.",
    "Address",
    "Schedule",
  ];

  // CITY
  const [city,
    setCity] =
    useState("");

  const cities = [
    "DELHI",
    "HARYANA",
    "UTTAR PRADESH",
  ];

  // ORDER DATA
  const [orderData,
    setOrderData] =
    useState({

      categoryID: "",

      subCategoryID: "",

      phone: "",

      address: null,

      pickupDate: "",

      pickupTime: "",

    });

  // INPUT CHANGE
  const handleChange = (e) => {

    setOrderData({

      ...orderData,

      [e.target.name]:
        e.target.value,

    });

  };

  // CATEGORY SELECT
  const handleCategorySelect = (
    data
  ) => {

    console.log("CATEGORY DATA:", data);

    setOrderData((prev) => ({

      ...prev,

      categoryID:
        data.categoryID,

      subCategoryID:
        data.subCategoryID,

    }));

  };

  // ADDRESS SELECT
  const handleAddressSelect = (
    address
  ) => {


    setOrderData((prev) => ({

      ...prev,

      address: address,

    }));

  };

  // CREATE ORDER
  const handleSubmitOrder =
    async () => {

      try {

        if (
          !orderData.categoryID
        ) {

          alert(
            "Select category"
          );

          return;

        }

        if (
          !orderData.subCategoryID
        ) {

          alert(
            "Select subcategory"
          );

          return;

        }

        if (
          !orderData.phone
        ) {

          alert(
            "Enter mobile number"
          );

          return;

        }

        if (
          !orderData.address
        ) {

          alert(
            "Select address"
          );

          return;

        }

        if (
          !orderData.pickupDate ||
          !orderData.pickupTime
        ) {

          alert(
            "Select pickup date & time"
          );

          return;

        }

        // PAYLOAD
        const payload = {

          status: true,

          pickupDate:
            `${orderData.pickupDate}T${orderData.pickupTime}:00`,

          address:
            orderData.address,

          categoryID:
            Number(
              orderData.categoryID
            ),

          subCategoryID:
            Number(
              orderData.subCategoryID
            ),

        };

        console.log(
          "ORDER PAYLOAD:",
          payload
        );

        await orderApi.createOrder(
          payload
        );

        alert(
          "Pickup Scheduled Successfully"
        );

        // RESET
        setOrderData({

          categoryID: "",

          subCategoryID: "",

          phone: "",

          address: null,

          pickupDate: "",

          pickupTime: "",

        });

        setActiveStep(0);

      } catch (error) {

        console.error(error);

        alert(
          "Failed to create order"
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

          <a href="/">
            Home
          </a>

          <a href="/">
            Why Us?
          </a>

          <a href="/">
            Scrap Rates
          </a>

          <a href="/">
            Services
          </a>

          <a href="/">
            Contact
          </a>

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

              {user?.username ||
                "User"}

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

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <h2>

            SELL YOUR{" "}

            <span>
              SCRAP
            </span>

            {" "}HERE !

          </h2>

          <p>

            Plastic -
            Newspaper -
            Electronics -
            Many More

          </p>

        </div>

        {/* CITIES */}
        <div className="cities">

          {cities.map(
            (c, index) => (

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

            )
          )}

        </div>

        {/* MAIN CARD */}
        <div className="main-card">

          {/* STEPS */}
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

                  <p>
                    {step}
                  </p>

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

                <CategoriesWithSubCat
                  onSelect={
                    handleCategorySelect
                  }
                />

                <button
                  className="next-btn"
                  onClick={() =>
                    setActiveStep(1)
                  }
                >

                  Next

                </button>

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
                  placeholder="Enter mobile number"
                  value={
                    orderData.phone
                  }
                  onChange={
                    handleChange
                  }
                />

                <button
                  className="next-btn"
                  onClick={() =>
                    setActiveStep(2)
                  }
                >

                  Next

                </button>

              </div>

            )}

            {/* STEP 3 */}
            {activeStep === 2 && (

              <div>

                <h2>
                  Select Address
                </h2>

                <AddressForm
                  onSelectAddress={
                    handleAddressSelect
                  }
                />

                <button
                  className="next-btn"
                  onClick={() =>
                    setActiveStep(3)
                  }
                >

                  Next

                </button>

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
                  onChange={
                    handleChange
                  }
                />

                <input
                  type="time"
                  name="pickupTime"
                  value={
                    orderData.pickupTime
                  }
                  onChange={
                    handleChange
                  }
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