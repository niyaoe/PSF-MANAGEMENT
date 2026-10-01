import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div>
            <header>
                <h1>
                    PSF Management
                </h1>

                <div>
                    <span>
                        Welcome, {user?.name}
                    </span>

                    <span>
                        Role: {user?.role}
                    </span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <nav>
                <Link to="/dashboard">
                    Dashboard
                </Link>

                {user?.role === "admin" && (
                    <>
                        <Link to="/users">
                            Users
                        </Link>

                        <Link to="/branches">
                            Branches
                        </Link>

                        <Link to="/import">
                            Excel Import
                        </Link>
                    </>
                )}
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;