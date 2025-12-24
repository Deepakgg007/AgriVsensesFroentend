import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Users' },
    { path: '/admin/kyc', icon: 'fas fa-id-card', label: 'KYC Verification' },
    { path: '/admin/crops', icon: 'fas fa-seedling', label: 'Crops Library' },
    { path: '/admin/master-data', icon: 'fas fa-database', label: 'Master Data' },
    { path: '/admin/devices', icon: 'fas fa-microchip', label: 'Devices' },
    { path: '/admin/subscriptions', icon: 'fas fa-credit-card', label: 'Subscriptions' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white ${sidebarOpen ? '' : 'd-none d-md-block'}`}
        style={{
          width: sidebarOpen ? '260px' : '70px',
          minHeight: '100vh',
          transition: 'width 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div className="p-3 border-bottom border-secondary">
          <Link to="/admin" className="text-decoration-none d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
              }}
            >
              <i className="fas fa-leaf text-white" style={{ fontSize: '20px' }}></i>
            </div>
            {sidebarOpen && (
              <span className="ms-3 fw-bold text-white" style={{ fontSize: '20px' }}>
                FarmHub
              </span>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="mt-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex align-items-center px-3 py-3 text-decoration-none ${
                isActive(item.path, item.exact)
                  ? 'bg-success text-white'
                  : 'text-white-50 hover-bg-secondary'
              }`}
              style={{
                transition: 'all 0.2s ease',
                borderLeft: isActive(item.path, item.exact) ? '4px solid #10b981' : '4px solid transparent',
              }}
            >
              <i className={`${item.icon}`} style={{ width: '24px', textAlign: 'center' }}></i>
              {sidebarOpen && <span className="ms-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
          >
            <i className="fas fa-sign-out-alt"></i>
            {sidebarOpen && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '260px' : '70px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Top Navbar */}
        <nav
          className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4"
          style={{ height: '70px' }}
        >
          <button
            className="btn btn-link text-dark p-0 me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`fas ${sidebarOpen ? 'fa-bars' : 'fa-bars'}`} style={{ fontSize: '20px' }}></i>
          </button>

          <div className="ms-auto d-flex align-items-center">
            {/* Notifications */}
            <button className="btn btn-link text-dark position-relative me-3">
              <i className="fas fa-bell" style={{ fontSize: '20px' }}></i>
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '10px' }}
              >
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="dropdown">
              <button
                className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <div
                  className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle me-2"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="fas fa-user"></i>
                </div>
                <span className="fw-semibold">{user?.fullName || 'Admin'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/admin/profile">
                    <i className="fas fa-user me-2"></i>Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/settings">
                    <i className="fas fa-cog me-2"></i>Settings
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 70px)' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
