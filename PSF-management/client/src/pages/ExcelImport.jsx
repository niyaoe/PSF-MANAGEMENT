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

            formData.append(
                "file",
                file
            );

            const response = await api.post(
                "/import/excel",
                formData
            );

            setMessage(
                response.data.message
            );

            setResult(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Excel import failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>
                Excel Import
            </h1>

            <form onSubmit={handleUpload}>
                <div>
                    <label>
                        Select Excel File
                    </label>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Importing..."
                        : "Import Excel"}
                </button>
            </form>

            {message && (
                <p>
                    {message}
                </p>
            )}

            {result && (
                <div>
                    <h2>
                        Import Result
                    </h2>

                    <p>
                        Total Rows:{" "}
                        {result.totalRows}
                    </p>

                    <p>
                        Valid Rows:{" "}
                        {result.importedRows}
                    </p>

                    <p>
                        Inserted:{" "}
                        {result.insertedCount}
                    </p>

                    <p>
                        Matched:{" "}
                        {result.matchedCount}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExcelImport;