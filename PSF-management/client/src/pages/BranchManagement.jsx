import { useEffect, useState } from "react";
import api from "../services/api";

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchBranches = async () => {
        try {
            const response = await api.get("/branches");

            setBranches(
                response.data.branches
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to load branches"
            );
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await api.post(
                "/branches",
                {
                    name,
                    code
                }
            );

            setMessage(
                response.data.message
            );

            setName("");
            setCode("");

            await fetchBranches();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to create branch"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>
                Branch Management
            </h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Branch Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        required
                    />
                </div>

                <div>
                    <label>
                        Branch Code
                    </label>

                    <input
                        type="text"
                        value={code}
                        onChange={(event) => {
                            setCode(event.target.value);
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Branch"}
                </button>
            </form>

            {message && (
                <p>
                    {message}
                </p>
            )}

            <h2>
                Existing Branches
            </h2>

            {branches.length === 0 ? (
                <p>
                    No branches found.
                </p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>
                                Branch Name
                            </th>

                            <th>
                                Code
                            </th>

                            <th>
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {branches.map((branch) => (
                            <tr key={branch._id}>
                                <td>
                                    {branch.name}
                                </td>

                                <td>
                                    {branch.code}
                                </td>

                                <td>
                                    {branch.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BranchManagement;