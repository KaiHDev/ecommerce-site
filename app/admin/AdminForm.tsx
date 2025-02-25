import AdminGuard from "./AdminGuard";

const AdminDashboard = () => {
    return (
        <AdminGuard>
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p>Welcome, Admin! Manage your products here.</p>
                {/* Here we'll add forms for adding/editing products in the next steps */}
            </div>
        </AdminGuard>
    );
};

export default AdminDashboard;