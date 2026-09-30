const PSFEditModal = ({
    record,
    onClose
}) => {
    if (!record) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    width: "500px",
                    maxWidth: "90%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    borderRadius: "8px"
                }}
            >
                <div>
                    <h2>
                        PSF Record
                    </h2>

                    <button onClick={onClose}>
                        Close
                    </button>
                </div>

                <div>
                    <p>
                        <strong>RO Number:</strong>{" "}
                        {record.roNumber}
                    </p>

                    <p>
                        <strong>Customer:</strong>{" "}
                        {record.customerName}
                    </p>

                    <p>
                        <strong>Registration:</strong>{" "}
                        {record.registrationNumber}
                    </p>

                    <p>
                        <strong>Branch:</strong>{" "}
                        {record.branchId?.name}
                    </p>

                    <p>
                        <strong>Model:</strong>{" "}
                        {record.model}
                    </p>

                    <p>
                        <strong>Service Type:</strong>{" "}
                        {record.serviceType}
                    </p>

                    <p>
                        <strong>Complaint Status:</strong>{" "}
                        {record.complaintStatus}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PSFEditModal;