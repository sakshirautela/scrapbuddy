import React, { useMemo } from "react";
import { buildAdminOverview } from "../../../utils/adminOverview";
import DashboardTableCard from "./DashboardTableCard";
import LineChartCard from "./LineChartCard";
import RatesCard from "./RatesCard";
import StatCard from "./StatCard";
import StatusDonutCard from "./StatusDonutCard";
import { EcoImpactCard, KycCard, ServiceAreaCard } from "./SummaryCards";

const requestColumns = [
  { key: "id", label: "Request ID" },
  { key: "customer", label: "Customer" },
  { key: "scrapType", label: "Scrap Type" },
  { key: "address", label: "Address" },
  { key: "slot", label: "Slot" },
  { key: "executive", label: "Assigned Executive" },
  { key: "status", label: "Status", badge: true },
];

const executiveColumns = [
  { key: "name", label: "Executive" },
  { key: "area", label: "Area" },
  { key: "pickups", label: "Pickups" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Status", badge: true },
];

const transactionColumns = [
  { key: "id", label: "Txn ID" },
  { key: "date", label: "Date" },
  { key: "vendor", label: "Executive / Vendor" },
  { key: "amount", label: "Amount" },
  { key: "mode", label: "Mode" },
  { key: "account", label: "UPI / Account" },
  { key: "status", label: "Status", badge: true },
];

const ticketColumns = [
  { key: "id", label: "Ticket ID" },
  { key: "customer", label: "Customer" },
  { key: "issue", label: "Issue" },
  { key: "status", label: "Status", badge: true },
];

const AdminOverview = ({ orders, categories, admins, addresses, cities, onManageRates }) => {
  const overview = useMemo(
    () => buildAdminOverview({ orders, categories, admins, addresses, cities }),
    [orders, categories, admins, addresses, cities]
  );

  return (
    <div className="admin-overview">
      <section className="admin-stats-grid">
        {overview.stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="admin-main-grid">
        <LineChartCard series={overview.weeklySeries} />
        <StatusDonutCard items={overview.statusCounts} />
      </section>

      <section className="admin-work-grid">
        <DashboardTableCard title="Recent Pickup Requests" columns={requestColumns} rows={overview.recentRequests} className="wide" />
        <DashboardTableCard title="Field Executive Performance" columns={executiveColumns} rows={overview.executives} />
        <DashboardTableCard title="Transactions / Payouts" columns={transactionColumns} rows={overview.transactions} className="wide" />
        <DashboardTableCard title="Support Tickets" columns={ticketColumns} rows={overview.supportTickets} />
      </section>

      <aside className="admin-side-insights">
        <RatesCard rates={overview.rates} onManageRates={onManageRates} />
        <KycCard data={overview.kyc} />
        <EcoImpactCard data={overview.ecoImpact} />
        <ServiceAreaCard area={overview.serviceArea} />
      </aside>
    </div>
  );
};

export default AdminOverview;
