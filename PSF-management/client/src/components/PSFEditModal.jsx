import { useState } from "react";
import api from "../services/api";
const PSFEditModal = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    ownerMobile: record.ownerMobile || "",
    firstCallDate: record.firstCallDate
      ? record.firstCallDate.substring(0, 10)
      : "",
    secondFollowUpDate: record.secondFollowUpDate
      ? record.secondFollowUpDate.substring(0, 10)
      : "",
    thirdFollowUpDate: record.thirdFollowUpDate
      ? record.thirdFollowUpDate.substring(0, 10)
      : "",
    whatsAppBot: record.whatsAppBot || "",
    rating: record.rating || "",
    serviceAdvisorBehaviour: record.serviceAdvisorBehaviour || "",
    advisorExplanation: record.advisorExplanation || "",
    vehicleCleanliness: record.vehicleCleanliness || "",
    qualityOfWork: record.qualityOfWork || "",
    waitingAreaFacilities: record.waitingAreaFacilities || "",
    deliveryAtPromisedTime: record.deliveryAtPromisedTime || "",
    voc: record.voc || "",
    typeOfConcern: record.typeOfConcern || "",
    callDate: record.callDate ? record.callDate.substring(0, 10) : "",
    complaintStatus: record.complaintStatus || "",
    crmCxmRemarks: record.crmCxmRemarks || "",
    messageToBeSent: record.messageToBeSent || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

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
        zIndex: 1000,
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
          borderRadius: "8px",
        }}
      >
        <div>
          <h2>PSF Record</h2>

          <button onClick={onClose}>Close</button>
        </div>

        <div>
          <p>
            <strong>RO Number:</strong> {record.roNumber}
          </p>

          <p>
            <strong>Customer:</strong> {record.customerName}
          </p>

          <p>
            <strong>Registration:</strong> {record.registrationNumber}
          </p>

          <p>
            <strong>Branch:</strong> {record.branchId?.name}
          </p>

          <p>
            <strong>Model:</strong> {record.model}
          </p>

          <p>
            <strong>Service Type:</strong> {record.serviceType}
          </p>

          <p>
            <strong>Complaint Status:</strong> {record.complaintStatus}
          </p>
        </div>
        <div>
          <div>
            <label>Owner Mobile</label>

            <input type="text" defaultValue={record.ownerMobile || ""} />
          </div>
          <div>
            <label>1st Call Date</label>

            <input
              type="date"
              defaultValue={
                record.firstCallDate
                  ? record.firstCallDate.substring(0, 10)
                  : ""
              }
            />
          </div>

          <div>
            <label>2nd Follow-up Date</label>

            <input
              type="date"
              defaultValue={
                record.secondFollowUpDate
                  ? record.secondFollowUpDate.substring(0, 10)
                  : ""
              }
            />
          </div>

          <div>
            <label>3rd Follow-up Date</label>

            <input
              type="date"
              defaultValue={
                record.thirdFollowUpDate
                  ? record.thirdFollowUpDate.substring(0, 10)
                  : ""
              }
            />
          </div>

          <div>
            <label>WhatsApp Bot</label>

            <input type="text" defaultValue={record.whatsAppBot || ""} />
          </div>

          <div>
            <label>Rating</label>

            <input type="text" defaultValue={record.rating || ""} />
          </div>

          <div>
            <label>Service Advisor Behaviour</label>

            <input
              type="text"
              defaultValue={record.serviceAdvisorBehaviour || ""}
            />
          </div>

          <div>
            <label>Advisor Explanation</label>

            <textarea defaultValue={record.advisorExplanation || ""} />
          </div>

          <div>
            <label>Vehicle Cleanliness</label>

            <input type="text" defaultValue={record.vehicleCleanliness || ""} />
          </div>

          <div>
            <label>Quality of Work</label>

            <input type="text" defaultValue={record.qualityOfWork || ""} />
          </div>

          <div>
            <label>Waiting Area Facilities</label>

            <input
              type="text"
              defaultValue={record.waitingAreaFacilities || ""}
            />
          </div>

          <div>
            <label>Delivery at Promised Time</label>

            <input
              type="text"
              defaultValue={record.deliveryAtPromisedTime || ""}
            />
          </div>

          <div>
            <label>VOC</label>

            <textarea defaultValue={record.voc || ""} />
          </div>

          <div>
            <label>Type of Concern</label>

            <input type="text" defaultValue={record.typeOfConcern || ""} />
          </div>

          <div>
            <label>Call Date</label>

            <input
              type="date"
              defaultValue={
                record.callDate ? record.callDate.substring(0, 10) : ""
              }
            />
          </div>

          <div>
            <label>Complaint Status</label>

            <select defaultValue={record.complaintStatus || ""}>
              <option value="">Select Status</option>

              <option value="Open">Open</option>

              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label>CRM/CXM Remarks</label>

            <textarea defaultValue={record.crmCxmRemarks || ""} />
          </div>

          <div>
            <label>Message to be Sent</label>

            <textarea defaultValue={record.messageToBeSent || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSFEditModal;
