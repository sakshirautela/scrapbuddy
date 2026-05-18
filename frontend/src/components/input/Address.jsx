import React, { useState } from "react";

import "../../styles/AddressForm.css";

const AddressForm = ({
  onSelectAddress,
}) => {

  const [formData, setFormData] =
    useState({

      apartment: "",

      city: "",

      state: "",

      zip: "",

      country: "",

      receiverFirstName: "",

      receiverLastName: "",

      receiverPhone: "",

      receiverEmail: "",

      countryCode: "+91",

    });

  const [errors, setErrors] =
    useState({});

  // VALIDATION
  const validateField = (
    name,
    value
  ) => {

    let error = "";

    if (!value?.trim()) {

      error = "This field is required";

    }

    if (
      name === "receiverEmail" &&
      value
    ) {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {

        error =
          "Enter valid email";

      }

    }

    if (
      name === "receiverPhone" &&
      value
    ) {

      const phoneRegex =
        /^[0-9]{10}$/;

      if (!phoneRegex.test(value)) {

        error =
          "Enter valid 10 digit number";

      }

    }

    setErrors((prev) => ({

      ...prev,

      [name]: error,

    }));

  };

  // HANDLE CHANGE
  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;

    const updatedForm = {

      ...formData,

      [name]: value,

    };

    setFormData(updatedForm);

    validateField(
      name,
      value
    );

    // SEND DATA TO PARENT
    if (onSelectAddress) {

      onSelectAddress(
        updatedForm
      );

    }

  };

  return (

    <div className="address-form">

      <h2>
        Add Address
      </h2>

      <div className="address-grid">

        {/* FIRST NAME */}
        <div className="address-input-group">

          <label>
            First Name
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="receiverFirstName"
            placeholder="Enter first name"
            value={
              formData.receiverFirstName
            }
            onChange={
              handleChange
            }
            className={
              errors.receiverFirstName
                ? "input-error"
                : ""
            }
            required
          />

          {errors.receiverFirstName && (

            <p className="error-text">

              {
                errors.receiverFirstName
              }

            </p>

          )}

        </div>

        {/* LAST NAME */}
        <div className="address-input-group">

          <label>
            Last Name
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="receiverLastName"
            placeholder="Enter last name"
            value={
              formData.receiverLastName
            }
            onChange={
              handleChange
            }
            className={
              errors.receiverLastName
                ? "input-error"
                : ""
            }
            required
          />

          {errors.receiverLastName && (

            <p className="error-text">

              {
                errors.receiverLastName
              }

            </p>

          )}

        </div>

        {/* PHONE */}
        <div className="address-input-group">

          <label>
            Phone Number
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="receiverPhone"
            placeholder="Enter phone number"
            value={
              formData.receiverPhone
            }
            onChange={
              handleChange
            }
            className={
              errors.receiverPhone
                ? "input-error"
                : ""
            }
            required
          />

          {errors.receiverPhone && (

            <p className="error-text">

              {
                errors.receiverPhone
              }

            </p>

          )}

        </div>

        {/* EMAIL */}
        <div className="address-input-group">

          <label>
            Email
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="email"
            name="receiverEmail"
            placeholder="Enter email"
            value={
              formData.receiverEmail
            }
            onChange={
              handleChange
            }
            className={
              errors.receiverEmail
                ? "input-error"
                : ""
            }
            required
          />

          {errors.receiverEmail && (

            <p className="error-text">

              {
                errors.receiverEmail
              }

            </p>

          )}

        </div>

        {/* APARTMENT */}
        <div className="address-input-group full-width">

          <label>
            Apartment / House
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="apartment"
            placeholder="Enter apartment or house no."
            value={
              formData.apartment
            }
            onChange={
              handleChange
            }
            className={
              errors.apartment
                ? "input-error"
                : ""
            }
            required
          />

          {errors.apartment && (

            <p className="error-text">

              {
                errors.apartment
              }

            </p>

          )}

        </div>

        {/* CITY */}
        <div className="address-input-group">

          <label>
            City
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="city"
            placeholder="Enter city"
            value={
              formData.city
            }
            onChange={
              handleChange
            }
            className={
              errors.city
                ? "input-error"
                : ""
            }
            required
          />

          {errors.city && (

            <p className="error-text">

              {
                errors.city
              }

            </p>

          )}

        </div>

        {/* STATE */}
        <div className="address-input-group">

          <label>
            State
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="state"
            placeholder="Enter state"
            value={
              formData.state
            }
            onChange={
              handleChange
            }
            className={
              errors.state
                ? "input-error"
                : ""
            }
            required
          />

          {errors.state && (

            <p className="error-text">

              {
                errors.state
              }

            </p>

          )}

        </div>

        {/* ZIP */}
        <div className="address-input-group">

          <label>
            ZIP Code
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="zip"
            placeholder="Enter ZIP code"
            value={
              formData.zip
            }
            onChange={
              handleChange
            }
            className={
              errors.zip
                ? "input-error"
                : ""
            }
            required
          />

          {errors.zip && (

            <p className="error-text">

              {
                errors.zip
              }

            </p>

          )}

        </div>

        {/* COUNTRY */}
        <div className="address-input-group">

          <label>
            Country
            <span className="required-star">
              *
            </span>
          </label>

          <input
            type="text"
            name="country"
            placeholder="Enter country"
            value={
              formData.country
            }
            onChange={
              handleChange
            }
            className={
              errors.country
                ? "input-error"
                : ""
            }
            required
          />

          {errors.country && (

            <p className="error-text">

              {
                errors.country
              }

            </p>

          )}

        </div>

      </div>

      {/* PREVIEW */}
      <div className="address-preview">

        <h3>
          Address Preview
        </h3>

        <p>

          {formData.receiverFirstName}{" "}
          {formData.receiverLastName}

        </p>

        <p>
          {formData.apartment}
        </p>

        <p>

          {formData.city},{" "}
          {formData.state} -{" "}
          {formData.zip}

        </p>

        <p>
          {formData.country}
        </p>

        <p>
          {formData.receiverPhone}
        </p>

      </div>

    </div>
  );
};

export default AddressForm;