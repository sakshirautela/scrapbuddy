import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesWithSubCat from "../components/input/CategoriesWithSubCat";
import NavBar from "../components/common/NavBar/NavBar";
import orderApi from "../api/orderApi";
import cityApi from "../api/cityApi";
import addressApi from "../api/addressApi";
import { useAuth } from "../context/AuthContext";
import orderPickupImage from "../assets/order.pickup.png";
import "../styles/SchedulePickup.css";

const steps = [
  "Address Details",
  "Scrap Category",
  "Preferred Date & Time",
  "Review & Confirm",
];

const benefits = [
  { title: "Free Doorstep Pickup", text: "No hidden charges", icon: "▣" },
  { title: "Digital Payments", text: "UPI / Cashless", icon: "▰" },
  { title: "Verified Executive", text: "Trained & background verified", icon: "♙" },
  { title: "Eco Friendly", text: "We recycle responsibly", icon: "♧" },
];

const bottomBenefits = [
  { title: "Free doorstep pickup", text: "We come to you, at no extra cost", icon: "▣" },
  { title: "Digital payment", text: "UPI / Cashless for a smooth experience", icon: "▰" },
  { title: "Verified executive", text: "Trained, polite and background verified", icon: "♙" },
  { title: "Eco responsible", text: "We segregate and recycle to protect our planet", icon: "♧" },
];

const formatAddress = (address) =>
  [address.fullAddress, address.landmark, address.city, address.pincode]
    .filter(Boolean)
    .join(", ") || "Pickup address not added";

const formatSavedAddress = (address) =>
  [address.apartment, address.city, address.state, address.zip, address.country]
    .filter(Boolean)
    .join(", ");

const getSavedAddressLabel = (address) => {
  const name = [address.receiverFirstName, address.receiverLastName]
    .filter(Boolean)
    .join(" ");
  const addressText = formatSavedAddress(address);

  return [name || "Saved Address", addressText]
    .filter(Boolean)
    .join(" - ");
};

const SchedulePickup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMode, setPaymentMode] = useState("UPI / Cashless");

  const [cities, setCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityList, setShowCityList] = useState(false);

  const [selectedScraps, setSelectedScraps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [formData, setFormData] = useState({
    fullAddress: "",
    landmark: "",
    city: "",
    pincode: "",
    mobile: "",
    email: user?.email || "",
    pickupDate: "",
    startRange: "",
    endRange: "",
    estimateWeight: "",
  });

  const getCitiesFromLocalStorage = () => {
    try {
      const storedCities = localStorage.getItem("cities");
      return storedCities ? JSON.parse(storedCities) : null;
    } catch (error) {
      console.error("Failed to read cities from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const localCities = getCitiesFromLocalStorage();

        if (localCities && localCities.length > 0) {
          setCities(localCities);
          return;
        }

        const apiCities = await cityApi.getCities();

        setCities(apiCities || []);
        localStorage.setItem("cities", JSON.stringify(apiCities || []));
      } catch (error) {
        console.error("Failed to load cities:", error);
        setCities([]);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!user?.id) {
        setSavedAddresses([]);
        setSelectedSavedAddressId("");
        return;
      }

      try {
        setIsLoadingAddresses(true);
        const addresses = await addressApi.getMyAddresses();
        setSavedAddresses(addresses);
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
        setSavedAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadSavedAddresses();
  }, [user?.id]);

  const cityOptions = cities.map((city) => city.name || city.cityName || city);

  const filteredCities = cityOptions.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedSavedAddressId("");
    setFormData((current) => ({
      ...current,
      city,
    }));

    setCitySearch("");
    setShowCityList(false);
  };

  const estimatedPrice = useMemo(() => {
    const weight = Number(formData.estimateWeight);

    if (!Number.isFinite(weight) || weight <= 0 || selectedScraps.length === 0) {
      return 0;
    }

    const totalRate = selectedScraps.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    return Math.round(weight * totalRate);
  }, [formData.estimateWeight, selectedScraps]);

  const selectedItems =
    selectedScraps.length > 0
      ? selectedScraps.map((item) => ({
          icon: "♻",
          name: `${item.categoryName} - ${item.subCategoryName}`,
          quantity: formData.estimateWeight
            ? `${formData.estimateWeight} kg`
            : "Qty/Est.",
          price: item.price ? `Rs ${item.price}/kg` : "-",
        }))
      : [
          {
            icon: "♻",
            name: "Select scrap item",
            quantity: "Qty/Est.",
            price: "-",
          },
        ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSelectedSavedAddressId("");
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSavedAddressSelect = (address) => {
    setSelectedSavedAddressId(String(address.id));
    setFormData((current) => ({
      ...current,
      fullAddress: address.apartment || "",
      landmark: "",
      city: address.city || "",
      pincode: address.zip || "",
      mobile: address.receiverPhone || "",
      email: address.receiverEmail || user?.email || current.email,
    }));
    setShowCityList(false);
  };

  const handleSavedAddressMenuChange = (event) => {
    const addressId = event.target.value;

    if (!addressId) {
      setSelectedSavedAddressId("");
      return;
    }

    const selectedAddress = savedAddresses.find((address) => String(address.id) === addressId);

    if (selectedAddress) {
      handleSavedAddressSelect(selectedAddress);
    }
  };

  const handleCategorySelect = (items) => {
    setSelectedScraps(items);
  };

  const buildCategorySubcategoryMap = () =>
    selectedScraps.reduce((result, item) => {
      const categoryId = Number(item.categoryID);
      const subCategoryId = Number(item.subCategoryID);

      if (!Number.isFinite(categoryId) || !Number.isFinite(subCategoryId)) {
        return result;
      }

      const key = String(categoryId);
      result[key] = [...(result[key] || []), subCategoryId];
      return result;
    }, {});

  const goNext = () => {
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const validate = () => {
    if (!formData.fullAddress.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      window.alert("Please complete address details");
      setActiveStep(0);
      return false;
    }

    if (!cityOptions.includes(formData.city)) {
      window.alert("Please select city from the list");
      setActiveStep(0);
      return false;
    }

    if (!formData.mobile.trim()) {
      window.alert("Please enter mobile number");
      setActiveStep(0);
      return false;
    }

    if (selectedScraps.length === 0) {
      window.alert("Please select at least one scrap item");
      setActiveStep(1);
      return false;
    }

    if (!formData.pickupDate || !formData.startRange || !formData.endRange) {
      window.alert("Please select pickup date and time");
      setActiveStep(2);
      return false;
    }

    if (!formData.estimateWeight || Number(formData.estimateWeight) <= 0) {
      window.alert("Please enter estimated weight");
      setActiveStep(2);
      return false;
    }

    if (formData.endRange <= formData.startRange) {
      window.alert("End time must be after start time");
      setActiveStep(2);
      return false;
    }

    return true;
  };

  const handleConfirmPickup = async () => {
    if (isSubmitting) {
      return;
    }

    if (!validate()) {
      return;
    }

    const [firstName = "Guest", ...lastNameParts] = (
      user?.firstName ||
      user?.username ||
      "Guest Customer"
    ).split(" ");

    const lastName = user?.lastName || lastNameParts.join(" ") || "Customer";

    const payload = {
      status: "Created",
      pickupDate: `${formData.pickupDate}T${formData.startRange}:00`,
      startRange: `${formData.startRange}:00`,
      endRange: `${formData.endRange}:00`,
      estimateWeight: Number(formData.estimateWeight),

      categoryIDsWithSubcatIDs: buildCategorySubcategoryMap(),

      address: {
        id: selectedSavedAddressId ? Number(selectedSavedAddressId) : null,
        apartment: formData.fullAddress,
        city: formData.city,
        state: "Uttar Pradesh",
        zip: formData.pincode,
        country: "India",
        receiverFirstName: firstName,
        receiverLastName: lastName,
        receiverPhone: formData.mobile,
        receiverEmail: formData.email || user?.email || "customer@scrapify.in",
        countryCode: "+91",
      },
    };

    try {
      setIsSubmitting(true);
      await orderApi.createOrder(payload);
      window.alert("Pickup scheduled successfully");
    } catch (error) {
      window.alert(error?.message || "Failed to schedule pickup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="schedule-page">
      <NavBar activePage="Schedule Pickup" />

      <section className="schedule-hero">
        <div className="schedule-hero-image" style={{ "--schedule-hero-image": `url(${orderPickupImage})` }} />

        <div className="schedule-hero-copy">
          <div>
            <h1>
              Schedule <span>Pickup</span>
            </h1>
            <p>
              Book a free pickup at your convenience. Our verified executive will arrive on time
              and handle everything.
            </p>
          </div>

          <div className="schedule-benefits">
            {benefits.map((item) => (
              <article key={item.title}>
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="schedule-shell">
        <div className="schedule-main">
          <div className="schedule-steps">
            {steps.map((step, index) => (
              <button
                className={`schedule-step ${activeStep === index ? "active" : ""}`}
                key={step}
                type="button"
                onClick={() => setActiveStep(index)}
              >
                <span>{index + 1}</span>
                {step}
              </button>
            ))}
          </div>

          <div className="schedule-card">
            {activeStep === 0 ? (
              <>
                <section>
                  <h2>Address Details</h2>

                  {user?.id ? (
                    <div className="saved-address-panel">
                      <div className="saved-address-header">
                        <strong>Saved Addresses</strong>
                        <span>{isLoadingAddresses ? "Loading..." : `${savedAddresses.length} saved`}</span>
                      </div>

                      {savedAddresses.length > 0 ? (
                        <label className="saved-address-menu">
                          Choose saved address
                          <select value={selectedSavedAddressId} onChange={handleSavedAddressMenuChange}>
                            <option value="">Enter a new address</option>
                            {savedAddresses.map((address) => (
                              <option key={address.id} value={address.id}>
                                {getSavedAddressLabel(address)}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <p className="saved-address-empty">
                          {isLoadingAddresses ? "Loading saved addresses..." : "No saved addresses yet. Add one below."}
                        </p>
                      )}
                    </div>
                  ) : null}

                  <div className="schedule-form-grid">
                    <label className="schedule-field full">
                      Full Address
                      <input
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        placeholder="221B, 2nd Main Road"
                      />
                    </label>

                    <label className="schedule-field full">
                      Landmark <small>(Optional)</small>
                      <input
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="Near metro station"
                      />
                    </label>

                    <label className="schedule-field city-dropdown-wrapper">
                      City

                      <div className="city-dropdown">
                        <button
                          type="button"
                          className="city-selected"
                          onClick={() => setShowCityList((current) => !current)}
                        >
                          {formData.city || "Select City"}
                        </button>

                        {showCityList ? (
                          <div className="city-dropdown-menu">
                            <input
                              type="text"
                              value={citySearch}
                              onChange={(event) => setCitySearch(event.target.value)}
                              placeholder="Search city"
                              className="city-search-input"
                            />

                            <div className="city-list">
                              {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                  <button
                                    key={city}
                                    type="button"
                                    className="city-option"
                                    onClick={() => handleCitySelect(city)}
                                  >
                                    {city}
                                  </button>
                                ))
                              ) : (
                                <p className="city-no-result">No city found</p>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </label>

                    <label className="schedule-field">
                      Pincode
                      <input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="201310"
                      />
                    </label>

                    <label className="schedule-field">
                      Mobile Number
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                    </label>

                    <label className="schedule-field">
                      Email
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>
                </section>

                <aside className="schedule-payment">
                  <h3>Payment Preference</h3>

                  {["UPI / Cashless", "Cash on Pickup"].map((mode) => (
                    <button
                      className={`payment-option ${paymentMode === mode ? "active" : ""}`}
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                    >
                      <span />

                      <span>
                        <strong>{mode}</strong>
                        <small>
                          {mode === "UPI / Cashless"
                            ? "Pay digitally after pickup"
                            : "Pay in cash to our executive"}
                        </small>
                      </span>

                      <b>{mode === "UPI / Cashless" ? "UPI" : "₹"}</b>
                    </button>
                  ))}

                  <div className="safe-box">
                    <span>♢</span>

                    <div>
                      <strong>Your data is safe with us</strong>
                      <small>We never share your information with anyone.</small>
                    </div>
                  </div>
                </aside>

                <div className="schedule-actions">
                  <button className="schedule-next" type="button" onClick={goNext}>
                    Save & Continue →
                  </button>
                </div>
              </>
            ) : null}

            {activeStep === 1 ? (
              <section className="schedule-category-step">
                <h2>Scrap Category</h2>

                <CategoriesWithSubCat onSelect={handleCategorySelect} />

                <div className="schedule-actions">
                  <button className="schedule-next" type="button" onClick={goNext}>
                    Continue →
                  </button>
                </div>
              </section>
            ) : null}

            {activeStep === 2 ? (
              <section>
                <h2>Preferred Date & Time</h2>

                <div className="schedule-form-grid">
                  <label className="schedule-field">
                    Pickup Date
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="schedule-field">
                    Start Time
                    <input
                      type="time"
                      name="startRange"
                      value={formData.startRange}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="schedule-field">
                    End Time
                    <input
                      type="time"
                      name="endRange"
                      value={formData.endRange}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="schedule-field">
                    Estimated Weight
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      name="estimateWeight"
                      value={formData.estimateWeight}
                      onChange={handleChange}
                      placeholder="25 kg"
                    />
                  </label>
                </div>

                <div className="schedule-actions">
                  <button className="schedule-next" type="button" onClick={goNext}>
                    Review Order →
                  </button>
                </div>
              </section>
            ) : null}

            {activeStep === 3 ? (
              <section>
                <h2>Review & Confirm</h2>

                <p>
                  Review your address, selected scrap item, estimated weight, and pickup slot
                  before confirming.
                </p>

                <button className="schedule-confirm" type="button" onClick={handleConfirmPickup} disabled={isSubmitting}>
                  {isSubmitting ? "Confirming..." : "Confirm Pickup →"}
                </button>
              </section>
            ) : null}
          </div>
        </div>

        <aside className="schedule-summary">
          <h2>Your Order Summary</h2>

          <div className="summary-address">
            <span>●</span>
            <p>{formatAddress(formData)}</p>

            <button type="button" onClick={() => setActiveStep(0)}>
              Edit
            </button>
          </div>

          <div className="summary-list">
            {selectedItems.map((item, index) => (
              <div className="summary-row" key={`${item.name}-${index}`}>
                <span>{item.icon}</span>

                <span>
                  <strong>{item.name}</strong>
                  <small>{item.quantity}</small>
                </span>

                <b>{item.price}</b>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div>
              <span>Total Selected Items</span>
              <b>{selectedScraps.length}</b>
            </div>

            <div>
              <span>Total Estimated Weight</span>
              <b>{formData.estimateWeight || "-"} kg</b>
            </div>

            <div>
              <span>Expected Price</span>
              <strong>Rs {estimatedPrice || "-"}</strong>
            </div>

            <div>
              <span>Pickup Fee</span>
              <strong>FREE</strong>
            </div>

            <div className="summary-payable">
              <b>Total Payable</b>
              <strong>Rs {estimatedPrice || "-"}</strong>
            </div>
          </div>

          <p className="summary-note">
            Final price may vary based on actual weight and quality at pickup.
          </p>

          <button className="schedule-confirm" type="button" onClick={handleConfirmPickup} disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm Pickup →"}
          </button>

          <p className="summary-secure">✓ 100% Secure · No hidden charges</p>
        </aside>
      </section>

      <section className="schedule-bottom-strip">
        {bottomBenefits.map((item) => (
          <article key={item.title}>
            <span>{item.icon}</span>

            <div>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </div>
          </article>
        ))}
      </section>

      <footer className="schedule-footer">
        <div>
          <strong>♻ Scrapify</strong>
          <p>India&apos;s trusted platform to sell scrap online. Clean India, green India.</p>
        </div>

        <div>
          <h3>Company</h3>
          <a href="/">About Us</a>
          <a href="/">Careers</a>
          <a href="/">Privacy Policy</a>
        </div>

        <div>
          <h3>Services</h3>
          <a href="/schedule-pickup">Schedule Pickup</a>
          <a href="/price-list">Price List</a>
          <a href="/track-order">Track Order</a>
        </div>

        <div>
          <h3>Help</h3>
          <a href="/">FAQ</a>
          <a href="/">How It Works</a>
          <a href="/">Blog</a>
        </div>

        <div>
          <h3>Contact Us</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@scrapify.in">hello@scrapify.in</a>
          <p>Greater Noida, Uttar Pradesh</p>
        </div>
      </footer>

      <div className="schedule-copybar">
        <span>© 2026 Scrapify. All rights reserved.</span>
        <span>Proudly made in India 🇮🇳</span>
        <span>A small step towards a better tomorrow ♻</span>
      </div>
    </main>
  );
};

export default SchedulePickup;
