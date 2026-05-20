import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/DefaultHome.css";

import CategoriesWithSubCat from "../components/input/CategoriesWithSubCat";
import AddressForm from "../components/input/Address";
import orderApi from "../api/orderApi";
import cityApi from "../api/cityApi";
import addressApi from "../api/addressApi";
import { useAuth } from "../context/AuthContext";

const serviceCards = [
 {
 title: "Paper and Cartons",
 text: "Daily newspapers, books, office paper, cartons, and packaging board.",
 icon: "01",
 },
 {
 title: "Metals",
 text: "Iron, steel, brass, copper, aluminium, and household metal scrap.",
 icon: "02",
 },
 {
 title: "Plastic",
 text: "PET bottles, containers, clean mixed plastic, and reusable packaging.",
 icon: "03",
 },
 {
 title: "Electronics",
 text: "Old appliances, wires, chargers, small devices, and e-waste pickups.",
 icon: "04",
 },
];

const rateCards = [
 { item: "Newspaper", rate: "From Rs. 14/kg" },
 { item: "Cardboard", rate: "From Rs. 8/kg" },
 { item: "Iron", rate: "From Rs. 28/kg" },
 { item: "Plastic", rate: "From Rs. 10/kg" },
];

const steps = ["Category", "Mobile", "Address", "Schedule"];

const requiredAddressFields = [
 "receiverFirstName",
 "receiverLastName",
 "receiverPhone",
 "receiverEmail",
 "apartment",
 "city",
 "state",
 "zip",
 "country",
];

const isAddressComplete = (address) => {
 if (!address) return false;

 return requiredAddressFields.every((field) => {
 const value = address[field];
 return typeof value === "string" && value.trim().length > 0;
 });
};

const getSavedAddressLabel = (address) => {
 const name = [address.receiverFirstName, address.receiverLastName]
 .filter(Boolean)
 .join(" ");
 const location = [address.apartment, address.city, address.state]
 .filter(Boolean)
 .join(", ");

 return [name, location].filter(Boolean).join(" - ") || "Saved address";
};

const toOrderAddress = (address) => ({
 id: address?.id,
 apartment: address?.apartment || "",
 city: address?.city || "",
 state: address?.state || "",
 zip: address?.zip || "",
 country: address?.country || "",
 receiverFirstName: address?.receiverFirstName || "",
 receiverLastName: address?.receiverLastName || "",
 receiverPhone: address?.receiverPhone || "",
 receiverEmail: address?.receiverEmail || "",
 countryCode: address?.countryCode || "+91",
});

const getErrorMessage = (error) => {
 return (
 error?.response?.data?.error ||
 error?.response?.data?.message ||
 error?.response?.data ||
 error?.message ||
 "Failed to create order"
 );
};

const DefaultDashboard = () => {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [activeStep, setActiveStep] = useState(0);
 const [cities, setCities] = useState([]);
 const [city, setCity] = useState("");
 const [cityError, setCityError] = useState("");
 const [quickPhone, setQuickPhone] = useState("");
 const [savedAddresses, setSavedAddresses] = useState([]);
 const [savedAddressError, setSavedAddressError] = useState("");
 const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
 const [isSavingAddress, setIsSavingAddress] = useState(false);

 const [orderData, setOrderData] = useState({
 categoryID: "",
 subCategoryID: "",
 phone: "",
 address: null,
 pickupDate: "",
 startRange: "",
 endRange: "",
 });

 useEffect(() => {
 let isMounted = true;

 const fetchCities = async () => {
 try {
 const cityData = await cityApi.getCities();

 if (!isMounted) {
 return;
 }

 setCities(cityData);
 setCity((currentCity) => currentCity || cityData[0]?.name || "");
 setCityError("");
 } catch {
 if (isMounted) {
 setCities([]);
 setCity("");
 setCityError("Cities are not available right now.");
 }
 }
 };

 fetchCities();

 return () => {
 isMounted = false;
 };
 }, []);

 useEffect(() => {
 let isMounted = true;

 const fetchSavedAddresses = async () => {
 if (!user) {
 setSavedAddresses([]);
 setSelectedSavedAddressId("");
 return;
 }

 try {
 const addresses = await addressApi.getMyAddresses();

 if (!isMounted) {
 return;
 }

 setSavedAddresses(addresses);
 setSavedAddressError("");

 if (addresses.length > 0) {
 const firstAddress = addresses[0];
 setSelectedSavedAddressId(String(firstAddress.id));
 setOrderData((prev) => ({
 ...prev,
 address: toOrderAddress(firstAddress),
 phone: prev.phone || firstAddress.receiverPhone || "",
 }));
 setQuickPhone((prev) => prev || firstAddress.receiverPhone || "");
 }
 } catch {
 if (isMounted) {
 setSavedAddresses([]);
 setSelectedSavedAddressId("");
 setSavedAddressError("Saved addresses are not available right now.");
 }
 }
 };

 fetchSavedAddresses();

 return () => {
 isMounted = false;
 };
 }, [user]);

 const handleChange = (e) => {
 setOrderData({
 ...orderData,
 [e.target.name]: e.target.value,
 });
 };

 const handleCategorySelect = (data) => {
 setOrderData((prev) => ({
 ...prev,
 categoryID: data.categoryID,
 subCategoryID: data.subCategoryID,
 }));
 };

 const handleAddressSelect = (address) => {
 setOrderData((prev) => ({
 ...prev,
 address,
 }));
 };

 const handleSavedAddressChange = (event) => {
 const addressId = event.target.value;
 setSelectedSavedAddressId(addressId);

 if (!addressId) {
 setOrderData((prev) => ({
 ...prev,
 address: null,
 }));
 return;
 }

 const selectedAddress = savedAddresses.find(
 (address) => String(address.id) === addressId
 );

 if (selectedAddress) {
 setOrderData((prev) => ({
 ...prev,
 address: toOrderAddress(selectedAddress),
 phone: prev.phone || selectedAddress.receiverPhone || "",
 }));
 }
 };

 const applySavedAddress = (savedAddress) => {
 const normalizedAddress = toOrderAddress(savedAddress);

 setSavedAddresses((prev) => {
 const existingIndex = prev.findIndex(
 (address) => address.id === savedAddress.id
 );

 if (existingIndex >= 0) {
 return prev.map((address) =>
 address.id === savedAddress.id ? savedAddress : address
 );
 }

 return [...prev, savedAddress];
 });

 setSelectedSavedAddressId(String(savedAddress.id));
 setOrderData((prev) => ({
 ...prev,
 address: normalizedAddress,
 phone: prev.phone || savedAddress.receiverPhone || "",
 }));
 };

 const saveCurrentAddressIfNeeded = async () => {
 if (!user || orderData.address?.id) {
 return true;
 }

 try {
 setIsSavingAddress(true);
 setSavedAddressError("");

 const savedAddress = await addressApi.createAddress(orderData.address);
 applySavedAddress(savedAddress);

 return true;
 } catch (error) {
 setSavedAddressError(
 error?.message ||
 "Failed to save address."
 );
 return false;
 } finally {
 setIsSavingAddress(false);
 }
 };

 const handleAddressNext = async () => {
 if (!isAddressComplete(orderData.address)) {
 alert("Complete address details");
 return;
 }

 const canContinue = await saveCurrentAddressIfNeeded();

 if (canContinue) {
 setActiveStep(3);
 }
 };

 const goToBooking = () => {
 document.getElementById("pickup")?.scrollIntoView({ behavior: "smooth" });
 };

 const handleQuickPhoneSubmit = (e) => {
 e.preventDefault();
 setOrderData((prev) => ({
 ...prev,
 phone: quickPhone,
 }));
 setActiveStep(1);
 goToBooking();
 };

 const handleSubmitOrder = async () => {
 try {
 if (!orderData.categoryID) {
 alert("Select category");
 setActiveStep(0);
 return;
 }

 if (!orderData.subCategoryID) {
 alert("Select subcategory");
 setActiveStep(0);
 return;
 }

 if (!orderData.phone) {
 alert("Enter mobile number");
 setActiveStep(1);
 return;
 }

 if (!isAddressComplete(orderData.address)) {
 alert("Complete address details");
 setActiveStep(2);
 return;
 }

 if (!orderData.pickupDate || !orderData.startRange || !orderData.endRange) {
 alert("Select pickup date and time range");
 setActiveStep(3);
 return;
 }

 if (orderData.endRange <= orderData.startRange) {
 alert("End time must be after start time");
 setActiveStep(3);
 return;
 }

 const payload = {
 status: "Created",
 pickupDate: `${orderData.pickupDate}T${orderData.startRange}:00`,
 startRange: `${orderData.startRange}:00`,
 endRange: `${orderData.endRange}:00`,
 address: orderData.address,
 categoryID: Number(orderData.categoryID),
 subCategoryID: Number(orderData.subCategoryID),
 };

 await orderApi.createOrder(payload);

 alert("Pickup scheduled successfully");

 setOrderData({
 categoryID: "",
 subCategoryID: "",
 phone: "",
 address: savedAddresses[0] ? toOrderAddress(savedAddresses[0]) : null,
 pickupDate: "",
 startRange: "",
 endRange: "",
 });
 setSelectedSavedAddressId(savedAddresses[0]?.id ? String(savedAddresses[0].id) : "");
 setQuickPhone(savedAddresses[0]?.receiverPhone || "");
 setActiveStep(0);
 } catch (error) {
 console.error(error);
 alert(getErrorMessage(error));
 }
 };

 return (
 <main className="junkbox-site">
 <nav className="site-navbar">
 <button className="brand-lockup" onClick={goToBooking}>
 <span className="brand-mark">JB</span>
 <span>
 <strong>JunkBox</strong>
 <small>Online Kabadiwala</small>
 </span>
 </button>

 <div className="site-links" aria-label="Primary navigation">
 <a href="#services">Services</a>
 <a href="#rates">Rates</a>
 <a href="#pickup">Book Pickup</a>
 <a href="#contact">Contact</a>
 </div>

 <div className="nav-actions">
 {user ? (
 <button className="ghost-action" onClick={() => navigate("/user")}>
 {user?.username || "Dashboard"}
 </button>
 ) : (
 <button className="ghost-action" onClick={() => navigate("/login")}>
 Login
 </button>
 )}
 <button className="primary-action" onClick={goToBooking}>
 Schedule
 </button>
 </div>
 </nav>

 <section className="hero-panel">
 <div className="hero-copy">
 <p className="eyebrow">Doorstep scrap collection</p>
 <h1>Sell scrap from home at fair daily rates.</h1>
 <p className="hero-text">
 JunkBox picks up paper, metal, plastic, and e-waste across NCR with
 transparent pricing, verified collectors, and quick payments.
 </p>

 <form className="quick-book" onSubmit={handleQuickPhoneSubmit}>
 <input
 type="tel"
 placeholder="+91 mobile number"
 value={quickPhone}
 onChange={(e) => setQuickPhone(e.target.value)}
 aria-label="Mobile number"
 />
 <button type="submit">Get a Callback</button>
 </form>

 <div className="hero-stats" aria-label="Service highlights">
 <span>
 <strong>24 hr</strong>
 pickup slots
 </span>
 <span>
 <strong>4.8/5</strong>
 customer rating
 </span>
 <span>
 <strong>12k+</strong>
 pickups served
 </span>
 </div>
 </div>
 </section>

 <section className="city-strip" aria-label="Available cities">
 <p>Now serving</p>
 <div>
 {cityError ? <span className="city-error">{cityError}</span> : null}
 {!cityError && cities.length === 0 ? <span>No cities configured</span> : null}
 {cities.map((item) => (
 <button
 key={item.id || item.name}
 className={city === item.name ? "selected-city" : ""}
 onClick={() => setCity(item.name)}
 >
 {item.name || "Unnamed city"}
 </button>
 ))}
 </div>
 </section>

 <section className="section-shell" id="services">
 <div className="section-heading">
 <p className="eyebrow">What we collect</p>
 <h2>Sorted pickup for homes, shops, and offices.</h2>
 </div>

 <div className="service-grid">
 {serviceCards.map((card) => (
 <article className="service-card" key={card.title}>
 <span>{card.icon}</span>
 <h3>{card.title}</h3>
 <p>{card.text}</p>
 </article>
 ))}
 </div>
 </section>

 <section className="rates-band" id="rates">
 <div className="section-heading">
 <p className="eyebrow">Sample rates</p>
 <h2>Simple prices before we arrive.</h2>
 </div>

 <div className="rate-list">
 {rateCards.map((card) => (
 <div className="rate-row" key={card.item}>
 <span>{card.item}</span>
 <strong>{card.rate}</strong>
 </div>
 ))}
 </div>
 </section>

 <section className="booking-section" id="pickup">
 <div className="booking-intro">
 <p className="eyebrow">Book a pickup</p>
 <h2>Choose your scrap, add address, and pick a slot.</h2>
 <p>
 Complete the steps below and our team will confirm your collection
 window. You can sign in first, or continue with the pickup details.
 </p>
 </div>

 <div className="booking-tool">
 <div className="steps-box">
 {steps.map((step, index) => (
 <button
 className={`step-item ${activeStep === index ? "active" : ""}`}
 key={step}
 onClick={() => setActiveStep(index)}
 >
 <span>0{index + 1}</span>
 {step}
 </button>
 ))}
 </div>

 <div className="step-content">
 {activeStep === 0 && (
 <div>
 <h3>Select Product</h3>
 <CategoriesWithSubCat onSelect={handleCategorySelect} />
 <button className="next-btn" onClick={() => setActiveStep(1)}>
 Next
 </button>
 </div>
 )}

 {activeStep === 1 && (
 <div className="field-step">
 <h3>Enter Mobile Number</h3>
 <input
 type="tel"
 name="phone"
 placeholder="Enter mobile number"
 value={orderData.phone}
 onChange={handleChange}
 />
 <button className="next-btn" onClick={() => setActiveStep(2)}>
 Next
 </button>
 </div>
 )}

 {activeStep === 2 && (
 <div>
 <h3>Select Address</h3>
 {savedAddressError ? (
 <p className="saved-address-error">{savedAddressError}</p>
 ) : null}
 {savedAddresses.length > 0 ? (
 <div className="saved-address-panel">
 <label htmlFor="saved-address">Use saved address</label>
 <select
 id="saved-address"
 value={selectedSavedAddressId}
 onChange={handleSavedAddressChange}
 >
 {savedAddresses.map((address) => (
 <option key={address.id} value={address.id}>
 {getSavedAddressLabel(address)}
 </option>
 ))}
 <option value="">Enter a different address</option>
 </select>
 </div>
 ) : null}
 <AddressForm
 initialAddress={orderData.address}
 onSelectAddress={handleAddressSelect}
 />
 <button
 className="next-btn"
 onClick={handleAddressNext}
 disabled={isSavingAddress}
 >
 {isSavingAddress ? "Saving..." : "Next"}
 </button>
 </div>
 )}

 {activeStep === 3 && (
 <div className="field-step">
 <h3>Schedule Pickup</h3>
 <div className="schedule-grid">
 <input
 type="date"
 name="pickupDate"
 value={orderData.pickupDate}
 onChange={handleChange}
 />
 <input
 type="time"
 name="startRange"
 value={orderData.startRange}
 onChange={handleChange}
 aria-label="Pickup start time"
 />
 <input
 type="time"
 name="endRange"
 value={orderData.endRange}
 onChange={handleChange}
 aria-label="Pickup end time"
 />
 </div>
 <button className="submit-order-btn" onClick={handleSubmitOrder}>
 Schedule Pickup
 </button>
 </div>
 )}
 </div>
 </div>
 </section>

 <footer className="site-footer" id="contact">
 <div>
 <strong>JunkBox</strong>
 <p>Cleaner homes, fair rates, responsible recycling.</p>
 </div>
 <a href="tel:+919999999999">+91 99999 99999</a>
 </footer>
 </main>
 );
};

export default DefaultDashboard;
