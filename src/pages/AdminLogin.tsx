import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10 && password) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.login({ mobileNumber: phoneNumber, password });
        if (response.data.success) {
          const { token, user } = response.data;

          // Verify user is admin
          if (user.role !== 'admin') {
            setError('Access denied. Admin credentials required.');
            setLoading(false);
            return;
          }

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/admin');
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }}></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-5">

                {/* Logo/Brand */}
                <div className="text-center mb-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 20px rgba(30, 58, 138, 0.3)'
                    }}
                  >
                    <i className="fas fa-shield-alt text-white" style={{ fontSize: '36px' }}></i>
                  </div>
                  <h3 className="fw-bold mb-2">Admin Portal</h3>
                  <p className="text-muted mb-0">Enter your admin credentials to continue</p>
                </div>

                <form onSubmit={handleAdminLogin}>
                  {/* Mobile Number */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Mobile Number</label>
                    <div className="input-group" style={{ height: '55px' }}>
                      <span
                        className="input-group-text bg-light border-end-0"
                        style={{ borderRadius: '12px 0 0 12px', fontSize: '16px' }}
                      >
                        <i className="fas fa-mobile-alt me-2 text-primary"></i>
                        +91
                      </span>
                      <input
                        type="tel"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        required
                        style={{
                          borderRadius: '0 12px 12px 0',
                          fontSize: '16px',
                          height: '100%'
                        }}
                      />
                    </div>
                    {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                      <small className="text-danger mt-1">Please enter a valid 10-digit mobile number</small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group" style={{ height: '55px' }}>
                      <span
                        className="input-group-text bg-light border-end-0"
                        style={{ borderRadius: '12px 0 0 12px' }}
                      >
                        <i className="fas fa-lock text-primary"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0 ps-0"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ fontSize: '16px', height: '100%', borderRadius: '0' }}
                      />
                      <span
                        className="input-group-text bg-light border-start-0"
                        style={{ cursor: 'pointer', borderRadius: '0 12px 12px 0' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-primary`}></i>
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger py-2 mb-3" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white mb-3"
                    disabled={phoneNumber.length !== 10 || !password || loading}
                    style={{
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '55px',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Admin Login
                      </>
                    )}
                  </button>

                  {/* Info Alert */}
                  <div className="alert alert-info py-2 mb-3" style={{ fontSize: '14px' }}>
                    <i className="fas fa-info-circle me-2"></i>
                    For admin access only. Farmers should use the <a href="/login" className="alert-link">Farmer Login</a>.
                  </div>

                  <div className="text-center">
                    <small className="text-muted">
                      Secured with enterprise-grade encryption
                    </small>
                  </div>
                </form>

              </div>
            </div>

            {/* Admin Features */}
            <div className="row g-3 mt-4">
              <div className="col-4">
                <div className="text-center text-white">
                  <i className="fas fa-users-cog mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                  <div><small>User Management</small></div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center text-white">
                  <i className="fas fa-chart-line mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                  <div><small>Analytics</small></div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center text-white">
                  <i className="fas fa-database mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                  <div><small>Data Control</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;