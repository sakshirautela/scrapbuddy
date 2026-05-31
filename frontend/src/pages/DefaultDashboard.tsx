// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/DefaultHome.css";
import recyclePickupHero from "../assets/image.png";

import PublicFooter from "../components/common/PublicFooter/PublicFooter";

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

const DefaultDashboard = () => {
 const navigate = useNavigate();

 return (
 <main className="scrapify-site">
 <section className="hero-panel" style={{ "--hero-image": `url(${recyclePickupHero})` }}>
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
 <a className="hero-secondary" href="#/price-list">View Prices</a>
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
 <a className="price-list-link" href="#/price-list">View Full Price List →</a>
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


 <section className="assurance-band" aria-label="Why customers choose Scrapify">
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

 <PublicFooter
 className="site-footer"
 brandClassName="footer-brand"
 brandText="India's trusted platform to sell scrap online. Clean homes, fair rates, greener cities."
 companyLinks={[
 { label: "About Us", href: "#services" },
 { label: "How It Works", href: "#how-it-works" },
 { label: "Price List", href: "#/price-list" },
 ]}
 serviceLinks={[
 { label: "Schedule Pickup", href: "#/schedule-pickup" },
 { label: "Track Order", href: "#/track-order" },
 { label: "Bulk Pickup", href: "#/" },
 ]}
 showHelp={false}
 id="contact"
 />
 </main>
 );
};

export default DefaultDashboard;
