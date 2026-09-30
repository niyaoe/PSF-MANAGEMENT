const DashboardFilters = ({
    search,
    setSearch,
    complaintStatus,
    setComplaintStatus,
    notConnected,
    setNotConnected,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    onSearch
}) => {
    return (
        <div>
            <div>
                <label>Search</label>

                <input
                    type="text"
                    placeholder="RO, customer, registration, chassis..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                    }}
                />
            </div>

            <div>
                <label>Complaint Status</label>

                <select
                    value={complaintStatus}
                    onChange={(event) => {
                        setComplaintStatus(
                            event.target.value
                        );
                    }}
                >
                    <option value="">
                        All
                    </option>

                    <option value="Open">
                        Open
                    </option>

                    <option value="Closed">
                        Closed
                    </option>
                </select>
            </div>

            <div>
                <label>Connection Status</label>

                <select
                    value={notConnected}
                    onChange={(event) => {
                        setNotConnected(
                            event.target.value
                        );
                    }}
                >
                    <option value="">
                        All
                    </option>

                    <option value="true">
                        Not Connected
                    </option>

                    <option value="false">
                        Connected
                    </option>
                </select>
            </div>

            <div>
                <label>Bill Date From</label>

                <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => {
                        setFromDate(event.target.value);
                    }}
                />
            </div>

            <div>
                <label>Bill Date To</label>

                <input
                    type="date"
                    value={toDate}
                    onChange={(event) => {
                        setToDate(event.target.value);
                    }}
                />
            </div>

            <button onClick={onSearch}>
                Apply Filters
            </button>
        </div>
    );
};

export default DashboardFilters;