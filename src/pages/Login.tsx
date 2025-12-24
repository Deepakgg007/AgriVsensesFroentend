import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'login' | 'otp' | 'forgot-password'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [resetOtpSent, setResetOtpSent] = useState(false);

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

  const [error, setError] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [resetTempToken, setResetTempToken] = useState('');

  // Handle password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10 && password) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.login({ mobileNumber: phoneNumber, password });
        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle OTP login - send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.loginOtp({ mobileNumber: phoneNumber });
        if (response.data.success) {
          setTempToken(response.data.tempToken);
          setStep('otp');
          startTimer();
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
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
        const response = await authAPI.verifyLoginOtp({ tempToken, otp: otpValue });
        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
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
      try {
        const response = await authAPI.loginOtp({ mobileNumber: phoneNumber });
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

  // Change phone number
  const handleChangeNumber = () => {
    setStep('login');
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
  };

  // Handle Forgot Password - Send OTP
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPhone.length === 10) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.forgotPassword({ mobileNumber: resetPhone });
        if (response.data.success) {
          setResetTempToken(response.data.tempToken);
          setResetOtpSent(true);
          startTimer();
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Reset OTP input
  const handleResetOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...resetOtp];
      newOtp[index] = value;
      setResetOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`reset-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetOtp.join('').length === 6 && newPassword && newPassword === confirmPassword) {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.resetPassword({
          tempToken: resetTempToken,
          otp: resetOtp.join(''),
          newPassword
        });
        if (response.data.success) {
          alert('Password reset successfully!');
          setStep('login');
          setResetPhone('');
          setNewPassword('');
          setConfirmPassword('');
          setResetOtp(['', '', '', '', '', '']);
          setResetOtpSent(false);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
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

                  {/* Login Step */}
                  {step === 'login' && (
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
                          <i className="fas fa-seedling text-white" style={{ fontSize: '36px' }}></i>
                        </div>
                        <h3 className="fw-bold mb-2">Welcome Farmer</h3>
                        <p className="text-muted mb-0">
                          {loginMethod === 'password' ? 'Enter your credentials to continue' : 'Enter your mobile number to get OTP'}
                        </p>
                      </div>

                      {/* Login Method Toggle */}
                      <div className="d-flex gap-2 mb-4">
                        <button
                          type="button"
                          className={`btn flex-fill ${loginMethod === 'password' ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => setLoginMethod('password')}
                          style={{ borderRadius: '10px', fontWeight: '600' }}
                        >
                          <i className="fas fa-lock me-2"></i>
                          Password
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill ${loginMethod === 'otp' ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => setLoginMethod('otp')}
                          style={{ borderRadius: '10px', fontWeight: '600' }}
                        >
                          <i className="fas fa-mobile-alt me-2"></i>
                          OTP
                        </button>
                      </div>

                      {/* Password Login Form */}
                      {loginMethod === 'password' && (
                        <form onSubmit={handlePasswordLogin}>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Mobile Number</label>
                            <div className="input-group" style={{ height: '55px' }}>
                              <span
                                className="input-group-text bg-light border-end-0"
                                style={{ borderRadius: '12px 0 0 12px', fontSize: '16px' }}
                              >
                                <i className="fas fa-mobile-alt me-2 text-success"></i>
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

                          <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="input-group" style={{ height: '55px' }}>
                              <span
                                className="input-group-text bg-light border-end-0"
                                style={{ borderRadius: '12px 0 0 12px' }}
                              >
                                <i className="fas fa-lock text-success"></i>
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
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-success`}></i>
                              </span>
                            </div>
                          </div>

                          {/* Forgot Password Link */}
                          <div className="text-end mb-3">
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => setStep('forgot-password')}
                              style={{ color: '#10b981', fontSize: '14px' }}
                            >
                              <i className="fas fa-key me-1"></i>
                              Forgot Password?
                            </button>
                          </div>

                          {/* Error Message */}
                          {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                              <i className="fas fa-exclamation-circle me-2"></i>
                              {error}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="btn btn-lg w-100 text-white mb-3"
                            disabled={phoneNumber.length !== 10 || !password || loading}
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
                                Logging in...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Login
                              </>
                            )}
                          </button>

                          <div className="text-center">
                            <small className="text-muted">
                              By continuing, you agree to our Terms & Privacy Policy
                            </small>
                          </div>
                        </form>
                      )}

                      {/* OTP Login Form */}
                      {loginMethod === 'otp' && (
                        <form onSubmit={handleSendOTP}>
                          <div className="mb-4">
                            <label className="form-label fw-semibold">Mobile Number</label>
                            <div className="input-group" style={{ height: '55px' }}>
                              <span
                                className="input-group-text bg-light border-end-0"
                                style={{ borderRadius: '12px 0 0 12px', fontSize: '16px' }}
                              >
                                <i className="fas fa-mobile-alt me-2 text-success"></i>
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

                          {/* Error Message */}
                          {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                              <i className="fas fa-exclamation-circle me-2"></i>
                              {error}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="btn btn-lg w-100 text-white mb-3"
                            disabled={phoneNumber.length !== 10 || loading}
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
                                <i className="fas fa-paper-plane me-2"></i>
                                Send OTP
                              </>
                            )}
                          </button>

                          <div className="text-center">
                            <small className="text-muted">
                              By continuing, you agree to our Terms & Privacy Policy
                            </small>
                          </div>
                        </form>
                      )}

                      {/* Registration Link */}
                      <div className="text-center mt-4 pt-3 border-top">
                        <p className="mb-0">
                          <small className="text-muted">Don't have an account? </small>
                          <button
                            type="button"
                            onClick={() => navigate('/farmer-registration')}
                            className="btn btn-link p-0 text-decoration-none fw-semibold"
                            style={{ color: '#10b981' }}
                          >
                            Register as Farmer
                          </button>
                        </p>
                      </div>
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
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <label className="form-label fw-semibold mb-0">Enter OTP</label>
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 text-decoration-none"
                              onClick={handleChangeNumber}
                            >
                              <i className="fas fa-edit me-1"></i>
                              Change Number
                            </button>
                          </div>
                          <div className="alert alert-light border mb-3">
                            <small className="text-muted">
                              <i className="fas fa-mobile-alt me-2 text-success"></i>
                              OTP sent to +91 {phoneNumber}
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
                              Verify & Login
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}

                  {/* Forgot Password Step */}
                  {step === 'forgot-password' && (
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
                          <i className="fas fa-key text-white" style={{ fontSize: '36px' }}></i>
                        </div>
                        <h3 className="fw-bold mb-2">Reset Password</h3>
                        <p className="text-muted mb-0">Enter your mobile number and create new password</p>
                      </div>

                      <form onSubmit={!resetOtpSent ? handleForgotPasswordSubmit : handleResetPassword}>
                        {!resetOtpSent ? (
                          <>
                            {/* Phone Number Input */}
                            <div className="mb-4">
                              <label className="form-label fw-semibold">Mobile Number</label>
                              <div className="input-group" style={{ height: '55px' }}>
                                <span
                                  className="input-group-text bg-light border-end-0"
                                  style={{ borderRadius: '12px 0 0 12px', fontSize: '16px' }}
                                >
                                  <i className="fas fa-mobile-alt me-2 text-success"></i>
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  className="form-control border-start-0 ps-0"
                                  placeholder="Enter 10-digit mobile number"
                                  value={resetPhone}
                                  onChange={(e) => setResetPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  maxLength={10}
                                  required
                                  style={{
                                    borderRadius: '0 12px 12px 0',
                                    fontSize: '16px',
                                    height: '100%'
                                  }}
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-lg w-100 text-white mb-3"
                              disabled={resetPhone.length !== 10 || loading}
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                height: '55px',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Sending OTP...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-paper-plane me-2"></i>
                                  Send OTP
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            {/* OTP Verification */}
                            <div className="alert alert-light border mb-3">
                              <small className="text-muted">
                                <i className="fas fa-mobile-alt me-2 text-success"></i>
                                OTP sent to +91 {resetPhone}
                              </small>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-semibold">Enter OTP</label>
                              <div className="d-flex justify-content-between gap-2">
                                {resetOtp.map((digit, index) => (
                                  <input
                                    key={index}
                                    id={`reset-otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control text-center fw-bold"
                                    value={digit}
                                    onChange={(e) => handleResetOtpChange(index, e.target.value)}
                                    maxLength={1}
                                    style={{
                                      width: '45px',
                                      height: '50px',
                                      fontSize: '20px',
                                      borderRadius: '10px',
                                      border: digit ? '2px solid #10b981' : '2px solid #e0e0e0'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-semibold">New Password</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ height: '50px', borderRadius: '12px' }}
                              />
                            </div>

                            <div className="mb-4">
                              <label className="form-label fw-semibold">Confirm Password</label>
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ height: '50px', borderRadius: '12px' }}
                              />
                              {confirmPassword && newPassword !== confirmPassword && (
                                <small className="text-danger">Passwords do not match</small>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="btn btn-lg w-100 text-white mb-3"
                              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || resetOtp.join('').length !== 6 || loading}
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                height: '55px',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Resetting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check-circle me-2"></i>
                                  Reset Password
                                </>
                              )}
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          className="btn btn-link w-100 p-0 text-decoration-none"
                          onClick={() => {
                            setStep('login');
                            setResetPhone('');
                            setResetOtp(['', '', '', '', '', '']);
                            setNewPassword('');
                            setConfirmPassword('');
                            setResetOtpSent(false);
                          }}
                          style={{ color: '#10b981' }}
                        >
                          <i className="fas fa-arrow-left me-1"></i>
                          Back to Login
                        </button>
                      </form>
                    </>
                  )}

                  {/* Additional Options */}
                  {step !== 'forgot-password' && (
                    <div className="text-center mt-4 pt-3 border-top">
                      <small className="text-muted">
                        Need help? <a href="/contact" className="text-decoration-none fw-semibold">Contact Support</a>
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="row g-3 mt-4">
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-shield-alt mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Secure Login</small></div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-bolt mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Quick Access</small></div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center text-white">
                    <i className="fas fa-user-check mb-2" style={{ fontSize: '24px', opacity: 0.9 }}></i>
                    <div><small>Easy Verify</small></div>
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

export default Login;
