import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface User {
  _id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  role: string;
  farmerId?: string;
  isActive: boolean;
  kycStatus: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({
        page: currentPage,
        limit: 10,
        role: roleFilter || undefined,
        search: searchTerm || undefined,
      });
      // Filter out admin users from the list
      const filteredUsers = (response.data.users || []).filter((user: User) => user.role !== 'admin');
      setUsers(filteredUsers);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await adminAPI.updateUserStatus(user._id, { isActive: !user.isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">User Management</h4>
          <p className="text-muted mb-0">Manage all registered users and farmers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by name or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Users</option>
                  <option value="farmer">Farmers Only</option>
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100">
                  <i className="fas fa-search me-2"></i>Search
                </button>
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('');
                    setCurrentPage(1);
                    fetchUsers();
                  }}
                >
                  <i className="fas fa-redo me-2"></i>Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
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
                    <th className="border-0 px-4 py-3">User</th>
                    <th className="border-0 py-3">Mobile</th>
                    <th className="border-0 py-3">Role</th>
                    <th className="border-0 py-3">Farmer ID</th>
                    <th className="border-0 py-3">KYC Status</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Joined</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: user.role === 'admin' ? '#3b82f620' : '#10b98120',
                                color: user.role === 'admin' ? '#3b82f6' : '#10b981',
                              }}
                            >
                              <i className={`fas ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{user.fullName}</div>
                              {user.email && <small className="text-muted">{user.email}</small>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{user.mobileNumber}</td>
                        <td className="py-3">
                          <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          {user.farmerId || <span className="text-muted">-</span>}
                        </td>
                        <td className="py-3">
                          <span
                            className={`badge ${
                              user.kycStatus === 'verified'
                                ? 'bg-success'
                                : user.kycStatus === 'pending'
                                ? 'bg-warning'
                                : user.kycStatus === 'rejected'
                                ? 'bg-danger'
                                : 'bg-secondary'
                            }`}
                          >
                            {user.kycStatus || 'Not Started'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={user.isActive}
                              onChange={() => handleStatusToggle(user)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => viewUserDetails(user)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-5 text-muted">
                        <i className="fas fa-users fa-3x mb-3 d-block"></i>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-0 py-3">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#10b98120',
                      color: '#10b981',
                    }}
                  >
                    <i className="fas fa-user fa-2x"></i>
                  </div>
                  <h5 className="fw-bold mb-1">{selectedUser.fullName}</h5>
                  <span className={`badge ${selectedUser.role === 'admin' ? 'bg-primary' : 'bg-info'}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small">Mobile Number</label>
                    <p className="fw-semibold mb-0">{selectedUser.mobileNumber}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Email</label>
                    <p className="fw-semibold mb-0">{selectedUser.email || '-'}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Farmer ID</label>
                    <p className="fw-semibold mb-0">{selectedUser.farmerId || '-'}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">KYC Status</label>
                    <p className="mb-0">
                      <span
                        className={`badge ${
                          selectedUser.kycStatus === 'verified'
                            ? 'bg-success'
                            : selectedUser.kycStatus === 'pending'
                            ? 'bg-warning'
                            : 'bg-secondary'
                        }`}
                      >
                        {selectedUser.kycStatus || 'Not Started'}
                      </span>
                    </p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Account Status</label>
                    <p className="mb-0">
                      <span className={`badge ${selectedUser.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Joined Date</label>
                    <p className="fw-semibold mb-0">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
