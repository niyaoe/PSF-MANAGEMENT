const DashboardLayout = ({ children }) => {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <div>
            <header>
                <h1>PSF Management</h1>

                <div>
                    <span>
                        Welcome, {user?.name}
                    </span>

                    <span>
                        Role: {user?.role}
                    </span>
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;