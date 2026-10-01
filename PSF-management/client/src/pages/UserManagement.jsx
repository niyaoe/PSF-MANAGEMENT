import { useEffect, useState } from "react";
import api from "../services/api";

const UserManagement = () => {
  const [branches, setBranches] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [selectedBranches, setSelectedBranches] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserBranches, setSelectedUserBranches] = useState([]);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/branches");

      setBranches(response.data.branches);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load branches");
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchUsers();
  }, []);

  const handleBranchChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions);

    const branchIds = selectedOptions.map((option) => option.value);

    setSelectedBranches(branchIds);
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await api.get("/users");

      setUsers(response.data.users);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
        role,
        branchIds: selectedBranches,
      });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setRole("employee");
      setSelectedBranches([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

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
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
        </div>

        <div>
          <label>Role</label>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
            }}
          >
            <option value="employee">Employee</option>

            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label>Branches</label>

          <select
            multiple
            value={selectedBranches}
            onChange={handleBranchChange}
            required
          >
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>

          <p>Hold Ctrl and select multiple branches.</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && <p>{message}</p>}
      <h2>Existing Users</h2>

      {usersLoading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branches</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>
                  {user.branchIds.map((branch) => branch.name).join(", ")}
                </td>

                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedUserBranches(
                        user.branchIds.map((branch) => branch._id),
                      );
                    }}
                  >
                    Edit Branches
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedUser && (
        <div>
          <h2>Edit Branches</h2>

          <p>User: {selectedUser.name}</p>

          <select
            multiple
            value={selectedUserBranches}
            onChange={(event) => {
              const selectedOptions = Array.from(event.target.selectedOptions);

              const branchIds = selectedOptions.map((option) => option.value);

              setSelectedUserBranches(branchIds);
            }}
          >
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>

          <p>Hold Ctrl and select multiple branches.</p>
          <button
            onClick={async () => {
              try {
                setMessage("");

                const response = await api.put(
                  `/users/${selectedUser._id}/branches`,
                  {
                    branchIds: selectedUserBranches,
                  },
                );

                setMessage(response.data.message);

                setSelectedUser(null);
                setSelectedUserBranches([]);

                await fetchUsers();
              } catch (error) {
                setMessage(
                  error.response?.data?.message ||
                    "Failed to update user branches",
                );
              }
            }}
          >
            Save Branches
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
