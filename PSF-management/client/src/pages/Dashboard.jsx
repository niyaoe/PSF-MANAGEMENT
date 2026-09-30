import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import DashboardFilters from "../components/DashboardFilters";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const [summary, setSummary] = useState({
    totalRecords: 0,
    openComplaints: 0,
    closedComplaints: 0,
    notConnected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [complaintStatus, setComplaintStatus] = useState("");
  const [notConnected, setNotConnected] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0,
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (complaintStatus) {
        params.complaintStatus = complaintStatus;
      }

      if (notConnected) {
        params.notConnected = notConnected;
      }

      if (fromDate) {
        params.fromDate = fromDate;
      }

      if (toDate) {
        params.toDate = toDate;
      }

      params.page = page;
      params.limit = limit;

      const response = await api.get("/psf/dashboard", {
        params,
      });

      setSummary(response.data.summary);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [page]);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <DashboardLayout>
      <h1>PSF Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <DashboardFilters
        search={search}
        setSearch={setSearch}
        complaintStatus={complaintStatus}
        setComplaintStatus={setComplaintStatus}
        notConnected={notConnected}
        setNotConnected={setNotConnected}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onSearch={fetchDashboard}
      />

      <div>
        <SummaryCard title="Total Records" value={summary.totalRecords} />

        <SummaryCard title="Open Complaints" value={summary.openComplaints} />

        <SummaryCard
          title="Closed Complaints"
          value={summary.closedComplaints}
        />

        <SummaryCard title="Not Connected" value={summary.notConnected} />
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
