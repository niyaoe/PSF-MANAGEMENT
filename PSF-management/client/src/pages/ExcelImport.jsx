import { useState } from "react";
import api from "../services/api";

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile || null);
    setMessage("");
    setResult(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select an Excel file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post("/import/excel", formData);

      setMessage(response.data.message);

      setResult(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Excel import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aero-page">
      {/* Page Header */}
      <div className="aero-page-header">
        <h1 className="aero-page-title">Excel Import</h1>

        <p className="aero-page-subtitle">
          Import PSF records from an Excel file
        </p>
      </div>

      {/* Import Panel */}
      <div className="aero-panel">
        <h2 className="aero-panel-title">Import Excel File</h2>

        <form className="aero-excel-form" onSubmit={handleUpload}>
          <div className="aero-form-group">
            <label>Select Excel File</label>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />

            <p className="aero-help-text">Supported formats: .xlsx and .xls</p>
          </div>

          <button className="aero-button" type="submit" disabled={loading}>
            {loading ? "Importing..." : "Import Excel"}
          </button>
        </form>
      </div>

      {/* Message */}
      {message && <p className="aero-message">{message}</p>}

      {/* Import Result */}
      {result && (
        <div className="aero-panel">
          <h2 className="aero-panel-title">Import Result</h2>

          <div className="aero-import-results">
            <div className="aero-result-item">
              <span>Total Rows</span>

              <strong>{result.totalRows}</strong>
            </div>

            <div className="aero-result-item">
              <span>Valid Rows</span>

              <strong>{result.importedRows}</strong>
            </div>

            <div className="aero-result-item">
              <span>Inserted</span>

              <strong>{result.insertedCount}</strong>
            </div>

            <div className="aero-result-item">
              <span>Matched</span>

              <strong>{result.matchedCount}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
