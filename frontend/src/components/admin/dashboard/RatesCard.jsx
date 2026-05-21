import React from "react";
import { formatMoney } from "../../../utils/adminOverview";

const RatesCard = ({ rates = [], onManageRates }) => (
  <section className="admin-dashboard-card rates-card">
    <div className="admin-card-title compact">
      <h2>Scrap Categories & Rates <span>(₹/kg)</span></h2>
    </div>
    <div className="rates-table">
      <div className="rates-row header">
        <span>Category</span>
        <strong>Rate</strong>
      </div>
      {(rates.length ? rates : [{ name: "No rates added", category: "Add categories", rate: 0 }]).map((rate) => (
        <div className="rates-row" key={`${rate.category}-${rate.name}`}>
          <span>
            <i aria-hidden="true" />
            {rate.name}
          </span>
          <strong>{rate.rate ? `${formatMoney(rate.rate)} / kg` : "-"}</strong>
        </div>
      ))}
    </div>
    <button className="admin-link-button" type="button" onClick={onManageRates}>
      Manage Rates <span>→</span>
    </button>
  </section>
);

export default RatesCard;
