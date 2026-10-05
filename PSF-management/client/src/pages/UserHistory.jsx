import { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/BackButton";
import "../styles/userHistory.css";

const UserHistory = () => {
  const [history, setHistory] = useState([]);

  const [summary, setSummary] = useState({
    freshCallsToday: 0,
    freshCallsThisMonth: 0,
    followUpCallsToday: 0,
    followUpCallsThisMonth: 0,
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (fromDate) {
        params.fromDate = fromDate;
      }

      if (toDate) {
        params.toDate = toDate;
      }

      const response = await api.get("/psf/user-history", {
        params,
      });

      setSummary(response.data.summary);

      setHistory(response.data.history);
    } catch (error) {
      console.error("Fetch user history error:", error);

      setError(error.response?.data?.message || "Failed to fetch user history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const handleApplyFilter = () => {
    fetchUserHistory();
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");

    setTimeout(() => {
      fetchUserHistory();
    }, 0);
  };

  if (loading) {
    return <div className="user-history-loading">Loading User History...</div>;
  }

  return (
    <div className="user-history-page">
      {/* Header */}

      <div className="user-history-header">
        <BackButton className="user-history-back-button" />

        <div className="user-history-header-content">
          <h1 className="user-history-title">User History</h1>

          <p className="user-history-subtitle">
            Track fresh calls and follow-up calls
          </p>
        </div>
      </div>

      {/* Error */}

      {error && <div className="user-history-error">{error}</div>}

      {/* Filters */}

      <div className="user-history-filter-panel">
        <div className="user-history-filter-group">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
            }}
          />
        </div>

        <div className="user-history-filter-group">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
            }}
          />
        </div>

        <div className="user-history-filter-actions">
          <button
            type="button"
            className="user-history-button"
            onClick={handleApplyFilter}
          >
            Apply Filter
          </button>

          <button
            type="button"
            className="user-history-button"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Summary */}

      <div className="user-history-summary-grid">
        <div className="user-history-summary-card">
          <div className="user-history-summary-title">Fresh Calls Today</div>

          <div className="user-history-summary-value">
            {summary.freshCallsToday}
          </div>
        </div>

        <div className="user-history-summary-card">
          <div className="user-history-summary-title">
            Fresh Calls This Month
          </div>

          <div className="user-history-summary-value">
            {summary.freshCallsThisMonth}
          </div>
        </div>

        <div className="user-history-summary-card">
          <div className="user-history-summary-title">
            Follow-up Calls Today
          </div>

          <div className="user-history-summary-value">
            {summary.followUpCallsToday}
          </div>
        </div>

        <div className="user-history-summary-card">
          <div className="user-history-summary-title">
            Follow-up Calls This Month
          </div>

          <div className="user-history-summary-value">
            {summary.followUpCallsThisMonth}
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="user-history-table-panel">
        <div className="user-history-table-wrapper">
          <table className="user-history-table">
            <thead>
              <tr>
                <th>Name</th>

                <th>Branches</th>

                <th>Today</th>

                <th>Total Calls</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="user-history-empty">
                    No user history found
                  </td>
                </tr>
              ) : (
                history.map((user) => (
                  <tr key={user.name}>
                    <td>{user.name}</td>

                    <td>{user.branches?.join(", ") || "-"}</td>

                    <td>{user.today}</td>

                    <td>{user.totalCalls}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserHistory;
