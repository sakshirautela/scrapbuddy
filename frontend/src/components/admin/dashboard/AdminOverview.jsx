import React, { useMemo } from "react";
import { buildAdminOverview } from "../../../utils/adminOverview";
import DashboardTableCard from "./DashboardTableCard";
import LineChartCard from "./LineChartCard";
import StatCard from "./StatCard";
import StatusDonutCard from "./StatusDonutCard";

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

const ticketColumns = [
  { key: "id", label: "Ticket ID" },
  { key: "customer", label: "Customer" },
  { key: "issue", label: "Issue" },
  { key: "status", label: "Status", badge: true },
];

const AdminOverview = ({ orders, categories, admins, addresses, cities }) => {
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
        <DashboardTableCard title="Support Tickets" columns={ticketColumns} rows={overview.supportTickets} />
      </section>

    </div>
  );
};

export default AdminOverview;
