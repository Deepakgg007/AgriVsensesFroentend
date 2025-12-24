import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface Subscription {
  _id: string;
  userId: {
    fullName: string;
    mobileNumber: string;
    farmerId: string;
  };
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  paymentHistory: Array<{
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string;
  }>;
}

const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSubscriptions();
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'premium':
        return 'bg-warning text-dark';
      case 'standard':
        return 'bg-info';
      case 'basic':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'expired':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Subscription Management</h4>
          <p className="text-muted mb-0">View and manage farmer subscriptions</p>
        </div>
        <button className="btn btn-success" onClick={fetchSubscriptions}>
          <i className="fas fa-sync-alt me-2"></i>Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#10b98120',
                    borderRadius: '12px',
                    color: '#10b981',
                  }}
                >
                  <i className="fas fa-check-circle fa-lg"></i>
                </div>
                <div className="ms-3">
                  <h4 className="fw-bold mb-0">
                    {subscriptions.filter((s) => s.status === 'active').length}
                  </h4>
                  <small className="text-muted">Active Subscriptions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f59e0b20',
                    borderRadius: '12px',
                    color: '#f59e0b',
                  }}
                >
                  <i className="fas fa-crown fa-lg"></i>
                </div>
                <div className="ms-3">
                  <h4 className="fw-bold mb-0">
                    {subscriptions.filter((s) => s.plan.toLowerCase() === 'premium').length}
                  </h4>
                  <small className="text-muted">Premium Plans</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#ef444420',
                    borderRadius: '12px',
                    color: '#ef4444',
                  }}
                >
                  <i className="fas fa-exclamation-circle fa-lg"></i>
                </div>
                <div className="ms-3">
                  <h4 className="fw-bold mb-0">
                    {subscriptions.filter((s) => s.status === 'expired').length}
                  </h4>
                  <small className="text-muted">Expired</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">Farmer</th>
                    <th className="border-0 py-3">Plan</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Amount</th>
                    <th className="border-0 py-3">Start Date</th>
                    <th className="border-0 py-3">End Date</th>
                    <th className="border-0 py-3">Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length > 0 ? (
                    subscriptions.map((sub) => (
                      <tr key={sub._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: '#ec489920',
                                color: '#ec4899',
                              }}
                            >
                              <i className="fas fa-user"></i>
                            </div>
                            <div>
                              <span className="fw-semibold">{sub.userId?.fullName || 'Unknown'}</span>
                              <br />
                              <small className="text-muted">{sub.userId?.farmerId}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${getPlanBadge(sub.plan)}`}>
                            {sub.plan}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${getStatusBadge(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 fw-semibold">Rs. {sub.amount}</td>
                        <td className="py-3 text-muted">
                          {new Date(sub.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(sub.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className="badge bg-light text-dark">
                            {sub.paymentHistory?.length || 0} payments
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        <i className="fas fa-credit-card fa-3x mb-3 d-block"></i>
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
