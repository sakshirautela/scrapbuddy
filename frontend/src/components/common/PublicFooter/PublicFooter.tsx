// @ts-nocheck
import React from "react";
import { getSupportEmailHref, getSupportPhoneHref, getSupportSettings } from "../../../utils/supportSettings";

const defaultCopyItems = [
  "© 2026 Scrapify. All rights reserved.",
  "Proudly made in India 🇮🇳",
  "A small step towards a better tomorrow ♻",
];

const defaultCompanyLinks = [
  { label: "About Us", href: "#/" },
  { label: "Careers", href: "#/" },
  { label: "Privacy Policy", href: "#/" },
];

const defaultServiceLinks = [
  { label: "Schedule Pickup", href: "#/schedule-pickup" },
  { label: "Price List", href: "#/price-list" },
  { label: "Track Order", href: "#/track-order" },
];

const defaultHelpLinks = [
  { label: "FAQ", href: "#/" },
  { label: "How It Works", href: "#/" },
  { label: "Blog", href: "#/" },
];

const renderLinks = (links) =>
  links.map((link) => (
    <a href={link.href} key={`${link.label}-${link.href}`}>
      {link.label}
    </a>
  ));

const PublicFooter = ({
  className,
  copybarClassName,
  brandClassName,
  brandText = "India's trusted platform to sell scrap online. Clean India, green India.",
  companyLinks = defaultCompanyLinks,
  serviceLinks = defaultServiceLinks,
  helpLinks = defaultHelpLinks,
  showHelp = true,
  showAddress = true,
  id,
}) => {
  const support = getSupportSettings();

  return (
    <>
      <footer className={className} id={id}>
        <div className={brandClassName}>
          <strong>
            <span>♻</span> Scrapify
          </strong>
          <p>{brandText}</p>
        </div>

        <div>
          <h3>Company</h3>
          {renderLinks(companyLinks)}
        </div>

        <div>
          <h3>Services</h3>
          {renderLinks(serviceLinks)}
        </div>

        {showHelp && (
          <div>
            <h3>Help</h3>
            {renderLinks(helpLinks)}
          </div>
        )}

        <div>
          <h3>Contact Us</h3>
          <a href={getSupportPhoneHref(support.phone)}>{support.phone}</a>
          <a href={getSupportEmailHref(support.email)}>{support.email}</a>
          {showAddress && <p>{support.address}</p>}
        </div>
      </footer>

      {copybarClassName && (
        <div className={copybarClassName}>
          {defaultCopyItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default PublicFooter;
