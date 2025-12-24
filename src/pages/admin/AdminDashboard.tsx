import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalFarmers: number;
  pendingKYC: number;
  totalDevices: number;
  activeSubscriptions: number;
  totalCrops: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalFarmers: 0,
    pendingKYC: 0,
    totalDevices: 0,
    activeSubscriptions: 0,
    totalCrops: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<Array<{
    _id: string;
    fullName: string;
    mobileNumber: string;
    role: string;
    createdAt: string;
    kycStatus: string;
  }>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes] = await Promise.all([
        adminAPI.getDashboardAnalytics().catch(() => ({ data: {} })),
        adminAPI.getUsers({ limit: 5 }).catch(() => ({ data: { users: [] } })),
      ]);

      if (analyticsRes.data?.analytics) {
        const analytics = analyticsRes.data.analytics;
        setStats({
          totalUsers: analytics.users?.total || 0,
          totalFarmers: analytics.users?.total || 0,
          pendingKYC: analytics.users?.pendingKYC || 0,
          totalDevices: analytics.devices?.total || 0,
          activeSubscriptions: analytics.subscriptions?.active || 0,
          totalCrops: 0, // This would need a separate endpoint
        });
      }

      if (usersRes.data?.users) {
        // Filter out admin users from recent users list
        const filteredUsers = usersRes.data.users.filter((user: any) => user.role !== 'admin');
        setRecentUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: 'fas fa-users', color: '#10b981', link: '/admin/users' },
    { title: 'Total Farmers', value: stats.totalFarmers, icon: 'fas fa-tractor', color: '#3b82f6', link: '/admin/users?role=farmer' },
    { title: 'Pending KYC', value: stats.pendingKYC, icon: 'fas fa-id-card', color: '#f59e0b', link: '/admin/kyc' },
    { title: 'Total Devices', value: stats.totalDevices, icon: 'fas fa-microchip', color: '#8b5cf6', link: '/admin/devices' },
    { title: 'Active Subscriptions', value: stats.activeSubscriptions, icon: 'fas fa-credit-card', color: '#ec4899', link: '/admin/subscriptions' },
    { title: 'Crops in Library', value: stats.totalCrops, icon: 'fas fa-seedling', color: '#14b8a6', link: '/admin/crops' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard</h4>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your farm platform.</p>
        </div>
        <button className="btn btn-success" onClick={fetchDashboardData}>
          <i className="fas fa-sync-alt me-2"></i>Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {statCards.map((card, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <Link to={card.link} className="text-decoration-none">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: '16px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: `${card.color}20`,
                        borderRadius: '16px',
                      }}
                    >
                      <i className={card.icon} style={{ fontSize: '24px', color: card.color }}></i>
                    </div>
                    <div className="ms-3">
                      <h3 className="fw-bold mb-0" style={{ color: card.color }}>{card.value}</h3>
                      <p className="text-muted mb-0 small">{card.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        {/* Recent Users */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Users</h5>
                <Link to="/admin/users" className="btn btn-sm btn-outline-success">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">User</th>
                      <th className="border-0 py-3">Mobile</th>
                      <th className="border-0 py-3">Role</th>
                      <th className="border-0 py-3">KYC Status</th>
                      <th className="border-0 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle me-3"
                                style={{ width: '40px', height: '40px' }}
                              >
                                {user.fullName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span className="fw-semibold">{user.fullName}</span>
                            </div>
                          </td>
                          <td className="py-3">{user.mobileNumber}</td>
                          <td className="py-3">
                            <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-info'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge ${
                                user.kycStatus === 'verified'
                                  ? 'bg-success'
                                  : user.kycStatus === 'pending'
                                  ? 'bg-warning'
                                  : 'bg-secondary'
                              }`}
                            >
                              {user.kycStatus || 'Not Started'}
                            </span>
                          </td>
                          <td className="py-3 text-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <h5 className="fw-bold mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <Link to="/admin/users" className="btn btn-outline-primary d-flex align-items-center justify-content-start">
                  <i className="fas fa-user-plus me-3"></i>
                  Manage Users
                </Link>
                <Link to="/admin/kyc" className="btn btn-outline-warning d-flex align-items-center justify-content-start">
                  <i className="fas fa-id-card me-3"></i>
                  Verify KYC ({stats.pendingKYC} pending)
                </Link>
                <Link to="/admin/crops" className="btn btn-outline-success d-flex align-items-center justify-content-start">
                  <i className="fas fa-seedling me-3"></i>
                  Manage Crops
                </Link>
                <Link to="/admin/master-data" className="btn btn-outline-info d-flex align-items-center justify-content-start">
                  <i className="fas fa-database me-3"></i>
                  Master Data
                </Link>
                <Link to="/admin/devices" className="btn btn-outline-secondary d-flex align-items-center justify-content-start">
                  <i className="fas fa-microchip me-3"></i>
                  Register Device
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
