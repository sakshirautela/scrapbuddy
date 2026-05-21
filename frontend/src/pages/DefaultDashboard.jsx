import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/DefaultHome.css";

import NavBar from "../components/common/NavBar/NavBar";
import orderApi from "../api/orderApi";
import cityApi from "../api/cityApi";
import addressApi from "../api/addressApi";
import { useAuth } from "../context/AuthContext";

const serviceCards = [
 {
 title: "Newspaper",
 text: "Rs 10 - Rs 22 / kg",
 icon: "📰",
 },
 {
 title: "Plastic",
 text: "Rs 12 - Rs 30 / kg",
 icon: "♻",
 },
 {
 title: "Metal",
 text: "Rs 20 - Rs 70 / kg",
 icon: "⚙",
 },
 {
 title: "E-waste",
 text: "Rs 10 - Rs 200 / kg",
 icon: "💻",
 },
 {
 title: "Cardboard",
 text: "Rs 8 - Rs 20 / kg",
 icon: "📦",
 },
 {
 title: "Batteries",
 text: "Rs 15 - Rs 150 / kg",
 icon: "🔋",
 },
];


const processCards = [
 {
 title: "Select scrap",
 text: "Choose the type of scrap you want to sell.",
 icon: "☑",
 },
 {
 title: "Schedule pickup",
 text: "Pick a convenient date and time slot.",
 icon: "▣",
 },
 {
 title: "Get paid",
 text: "Weight is checked and payment is completed.",
 icon: "₹",
 },
];

const assuranceCards = [
 { title: "Verified Buyers", text: "Trusted pickup partners", icon: "✓" },
 { title: "Digital Payments", text: "UPI and cash", icon: "▰" },
 { title: "Easy Pickup", text: "Fast pickup across active cities", icon: "▣" },
 { title: "Eco Impact", text: "Every pickup supports recycling", icon: "♧" },
];

const testimonials = [
 {
 name: "Neha Sharma",
 city: "Bengaluru",
 quote: "Very convenient service. The pickup arrived on time and the rate was fair.",
 avatar: "NS",
 },
 {
 name: "Arjun Mehta",
 city: "Pune",
 quote: "Booking was simple, and the status updates made the process clear.",
 avatar: "AM",
 },
 {
 name: "Ramesh Iyer",
 city: "Chennai",
 quote: "Selling scrap from home is much easier now. Clean and professional.",
 avatar: "RI",
 },
];

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
 estimateWeight: "",
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

 const goToBookingStep = (step) => {
 setActiveStep(step);
 goToBooking();
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

 if (!orderData.estimateWeight || Number(orderData.estimateWeight) <= 0) {
 alert("Enter estimated weight");
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
 estimateWeight: Number(orderData.estimateWeight),
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
 estimateWeight: "",
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
 <NavBar activePage="Home" />

 <section className="hero-panel">
 <div className="hero-copy">
 <p className="eyebrow">Free doorstep scrap collection</p>
 <h1>Sell Your Scrap the <span>Smart Way</span></h1>
 <p className="hero-text">
 Book a free pickup, get the best prices, and help build a cleaner city.
 </p>

 <div className="hero-stats" aria-label="Service highlights">
 <span>
 <strong>4.7/5</strong>
 customer rating
 </span>
 <span>
 <strong>10,000+</strong>
 happy customers
 </span>
 </div>

 <div className="hero-actions">
 <button className="hero-primary" type="button" onClick={() => navigate("/schedule-pickup")}>
 Book Pickup <span>→</span>
 </button>
 <a className="hero-secondary" href="/price-list">View Prices</a>
 </div>
 </div>

 </section>

 <section className="section-shell price-preview" id="services">
 <div className="section-heading">
 <h2>What do you want to sell?</h2>
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
 <a className="price-list-link" href="/price-list">View Full Price List →</a>
 </section>

 <section className="process-section" id="how-it-works">
 <div className="section-heading">
 <h2>How It Works</h2>
 </div>
 <div className="process-grid">
 {processCards.map((card) => (
 <article className="process-card" key={card.title}>
 <span>{card.icon}</span>
 <h3>{card.title}</h3>
 <p>{card.text}</p>
 </article>
 ))}
 </div>
 </section>


 <section className="assurance-band" aria-label="Why customers choose JunkBox">
 {assuranceCards.map((item) => (
 <article key={item.title}>
 <span>{item.icon}</span>
 <div>
 <strong>{item.title}</strong>
 <small>{item.text}</small>
 </div>
 </article>
 ))}
 </section>

 <section className="reviews-section" id="reviews">
 <div className="section-heading">
 <h2>What Our Customers Say</h2>
 </div>
 <div className="reviews-grid">
 {testimonials.map((review) => (
 <article className="review-card" key={review.name}>
 <span>{review.avatar}</span>
 <div>
 <p>“{review.quote}”</p>
 <strong>{review.name}</strong>
 <small>{review.city} · ★★★★★</small>
 </div>
 </article>
 ))}
 </div>
 </section>

 <footer className="site-footer" id="contact">
 <div className="footer-brand">
 <strong><span>♻</span> JunkBox</strong>
 <p>India's trusted platform to sell scrap online. Clean homes, fair rates, greener cities.</p>
 </div>
 <div>
 <h3>Company</h3>
 <a href="#services">About Us</a>
 <a href="#how-it-works">How It Works</a>
 <a href="/price-list">Price List</a>
 </div>
 <div>
 <h3>Services</h3>
 <a href="/schedule-pickup">Schedule Pickup</a>
 <a href="/track-order">Track Order</a>
 <a href="/bulk-pickup">Bulk Pickup</a>
 </div>
 <div>
 <h3>Contact Us</h3>
 <a href="tel:+919999999999">+91 99999 99999</a>
 <a href="mailto:hello@junkbox.in">hello@junkbox.in</a>
 <p>Greater Noida, Uttar Pradesh</p>
 </div>
 </footer>
 </main>
 );
};

export default DefaultDashboard;
