import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';
import { authAPI } from '../services/api';

interface BasicRegistrationData {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
}

const FarmerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'otp' | 'welcome'>('register');
  const [registrationData, setRegistrationData] = useState<BasicRegistrationData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [tempToken, setTempToken] = useState('');

  // Start countdown timer
  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle registration form submission
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register({
        fullName: registrationData.fullName,
        mobileNumber: registrationData.mobileNumber,
        password: registrationData.password
      });
      if (response.data.success) {
        setTempToken(response.data.tempToken);
        setStep('otp');
        startTimer();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle OTP input keydown (backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle OTP paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp.slice(0, 6));
      const lastIndex = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${lastIndex}`)?.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.verifyOtp({
          tempToken: tempToken,
          otp: otpValue
        });
        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setStep('welcome');
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (canResend) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.register({
          fullName: registrationData.fullName,
          mobileNumber: registrationData.mobileNumber,
          password: registrationData.password
        });
        if (response.data.success) {
          setTempToken(response.data.tempToken);
          setOtp(['', '', '', '', '', '']);
          startTimer();
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to resend OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Complete KYC
  const handleCompleteKYC = () => {
    navigate('/kyc-update');
  };

  // Handle Maybe Later
  const handleMaybeLater = () => {
    navigate('/');
  };

  return (
    <Wrapper>
      <HeaderTwo />

      <section
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '80px'
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

                  {/* Registration Step */}
                  {step === 'register' && (
                    <>
                      {/* Logo/Brand */}
                      <div className="text-center mb-4">
                        <div
                          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '20px',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <i className="fas fa-user-plus text-white" style={{ fontSize: '36px' }}></i>
                        </div>
                        <h3 className="fw-bold mb-2">Farmer Registration</h3>
                        <p className="text-muted mb-0">Create your account to get started</p>
                      </div>

                      <form onSubmit={handleRegistrationSubmit}>
                        {/* Full Name */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Full Name</label>
                          <div className="input-group" style={{ height: '50px' }}>
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                              <i className="fas fa-user text-success"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Enter your full name"
                              value={registrationData.fullName}
                              onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                              required
                              style={{ borderRadius: '0 12px 12px 0', fontSize: '15px', height: '100%' }}
                            />
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Mobile Number</label>
                          <div className="input-group" style={{ height: '50px' }}>
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                              <i className="fas fa-mobile-alt me-2 text-success"></i>
                              +91
                            </span>
                            <input
                              type="tel"
                              className="form-control border-start-0 ps-0"
                              placeholder="Enter 10-digit mobile number"
                              value={registrationData.mobileNumber}
                              onChange={(e) => setRegistrationData({
                                ...registrationData,
                                mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
                              })}
                              maxLength={10}
                              required
                              style={{ borderRadius: '0 12px 12px 0', fontSize: '15px', height: '100%' }}
                            />
                          </div>
                          {registrationData.mobileNumber.length > 0 && registrationData.mobileNumber.length < 10 && (
                            <small className="text-danger mt-1">Please enter a valid 10-digit mobile number</small>
                          )}
                        </div>

                        {/* Email (Optional) */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Email <span className="text-muted">(Optional)</span></label>
                          <div className="input-group" style={{ height: '50px' }}>
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                              <i className="fas fa-envelope text-success"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control border-start-0 ps-0"
                              placeholder="Enter your email"
                              value={registrationData.email}
                              onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                              style={{ borderRadius: '0 12px 12px 0', fontSize: '15px', height: '100%' }}
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Password</label>
                          <div className="input-group" style={{ height: '50px' }}>
                            <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                              <i className="fas fa-lock text-success"></i>
                            </span>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="form-control border-start-0 border-end-0 ps-0"
                              placeholder="Create a password"
                              value={registrationData.password}
                              onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                              required
                              minLength={6}
                              style={{ fontSize: '15px', height: '100%', borderRadius: '0' }}
                            />
                            <span
                              className="input-group-text bg-light border-start-0"
                              style={{ cursor: 'pointer', borderRadius: '0 12px 12px 0' }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-success`}></i>
                            </span>
                          </div>
                          <small className="text-muted">Password must be at least 6 characters</small>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-lg w-100 text-white mb-3"
                          disabled={registrationData.mobileNumber.length !== 10 || !registrationData.fullName || !registrationData.password || loading}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            height: '55px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-check me-2"></i>
                              Register & Send OTP
                            </>
                          )}
                        </button>

                        <div className="text-center">
                          <small className="text-muted">
                            By registering, you agree to our Terms & Privacy Policy
                          </small>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-4 pt-3 border-top">
                          <p className="mb-0">
                            <small className="text-muted">Already have an account? </small>
                            <button
                              type="button"
                              onClick={() => navigate('/login')}
                              className="btn btn-link p-0 text-decoration-none fw-semibold"
                              style={{ color: '#10b981' }}
                            >
                              Login Here
                            </button>
                          </p>
                        </div>
                      </form>
                    </>
                  )}

                  {/* OTP Verification Step */}
                  {step === 'otp' && (
                    <>
                      <div className="text-center mb-4">
                        <div
                          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '20px',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <i className="fas fa-shield-alt text-white" style={{ fontSize: '36px' }}></i>
                        </div>
                        <h3 className="fw-bold mb-2">Verify OTP</h3>
                        <p className="text-muted mb-0">Enter the code sent to your mobile</p>
                      </div>

                      <form onSubmit={handleVerifyOTP}>
                        <div className="mb-4">
                          <div className="alert alert-light border mb-3">
                            <small className="text-muted">
                              <i className="fas fa-mobile-alt me-2 text-success"></i>
                              OTP sent to +91 {registrationData.mobileNumber}
                            </small>
                          </div>

                          {/* OTP Input Boxes */}
                          <div className="d-flex justify-content-between gap-2 mb-3" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                className="form-control text-center fw-bold"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                style={{
                                  width: '50px',
                                  height: '55px',
                                  fontSize: '24px',
                                  borderRadius: '12px',
                                  border: digit ? '2px solid #10b981' : '2px solid #e0e0e0',
                                  transition: 'all 0.2s ease'
                                }}
                              />
                            ))}
                          </div>

                          {/* Timer and Resend */}
                          <div className="text-center mb-3">
                            {!canResend ? (
                              <small className="text-muted">
                                <i className="fas fa-clock me-1"></i>
                                Resend OTP in <span className="fw-bold text-success">{timer}s</span>
                              </small>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={handleResendOTP}
                              >
                                <i className="fas fa-redo me-1"></i>
                                Resend OTP
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-lg w-100 text-white"
                          disabled={otp.join('').length !== 6 || loading}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            height: '55px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Verifying...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check-circle me-2"></i>
                              Verify OTP
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}

                  {/* Welcome Step */}
                  {step === 'welcome' && (
                    <>
                      <div className="text-center mb-4">
                        <div
                          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '100px',
                            height: '100px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '50%',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <i className="fas fa-check-circle text-white" style={{ fontSize: '50px' }}></i>
                        </div>
                        <h3 className="fw-bold mb-3">Welcome, {registrationData.fullName}!</h3>
                        <p className="text-muted mb-4">
                          Your account has been created successfully
                        </p>
                      </div>

                      <div className="alert alert-info mb-4">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Complete your KYC to unlock all features</strong>
                        <p className="mb-0 mt-2 small">
                          Add your personal details, farm information, and location to access full benefits of the platform
                        </p>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-lg text-white"
                          onClick={handleCompleteKYC}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            height: '55px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <i className="fas fa-file-alt me-2"></i>
                          Complete KYC Now
                        </button>

                        <button
                          className="btn btn-outline-secondary btn-lg"
                          onClick={handleMaybeLater}
                          style={{
                            borderRadius: '12px',
                            height: '55px',
                            fontWeight: '600'
                          }}
                        >
                          <i className="fas fa-clock me-2"></i>
                          Maybe Later
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <small className="text-muted">
                          You can complete KYC anytime from your profile
                        </small>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Features */}
              <div className="row g-3 mt-4">
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-shield-alt mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Secure Data</small></div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-bolt mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Quick Setup</small></div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-leaf mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Smart Farming</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </Wrapper>
  );
};

export default FarmerRegistration;
