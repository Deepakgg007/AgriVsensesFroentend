import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';

interface FarmerData {
  personalInfo: {
    fullName: string;
    mobileNumber: string;
    email: string;
    farmerId: string;
  };
  kycDetails: {
    status: 'Completed' | 'Pending' | 'Not Started';
    aadharNumber: string;
    panNumber: string;
    bankAccountNumber: string;
    ifscCode: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  devices: {
    deviceId: string;
    deviceName: string;
    plotNumber: string;
    plotName: string;
    acres: string;
    crops: string[];
    soilType: string;
    state: string;
    district: string;
    taluk: string;
    village: string;
    purchaseDate: string;
    status: 'Active' | 'Inactive';
  }[];
  subscription: {
    planType: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Expiring Soon';
    price: string;
    features: string[];
  };
}

export default function FarmerProfile() {
  // Mock data - In real app, this would come from API/context
  const [farmerData] = useState<FarmerData>({
    personalInfo: {
      fullName: 'Rajesh Kumar',
      mobileNumber: '+91 98765 43210',
      email: 'rajesh.kumar@example.com',
      farmerId: 'FH2024001',
    },
    kycDetails: {
      status: 'Completed',
      aadharNumber: 'XXXX XXXX 1234',
      panNumber: 'ABCDE1234F',
      bankAccountNumber: 'XXXX XXXX 5678',
      ifscCode: 'SBIN0001234',
      address: '123 Village Road',
      city: 'Mysore',
      state: 'Karnataka',
      pincode: '570001',
    },
    devices: [
      {
        deviceId: 'DEV001',
        deviceName: 'Smart Soil Sensor Pro',
        plotNumber: 'P-101',
        plotName: 'North Field',
        acres: '5',
        crops: ['Rice', 'Wheat'],
        soilType: 'Loamy',
        state: 'Karnataka',
        district: 'Mysore',
        taluk: 'Mysore',
        village: 'Hemmige',
        purchaseDate: '2024-01-15',
        status: 'Active',
      },
      {
        deviceId: 'DEV002',
        deviceName: 'Weather Station',
        plotNumber: 'P-102',
        plotName: 'South Field',
        acres: '3',
        crops: ['Cotton'],
        soilType: 'Clay',
        state: 'Karnataka',
        district: 'Mysore',
        taluk: 'Mysore',
        village: 'Hemmige',
        purchaseDate: '2024-02-20',
        status: 'Active',
      },
    ],
    subscription: {
      planType: 'Premium',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      price: '₹12,000/year',
      features: [
        'Unlimited Device Monitoring',
        'Real-time Alerts',
        'Weather Predictions',
        'Crop Advisory',
        'Market Price Updates',
        '24/7 Support',
      ],
    },
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'subscription' | 'kyc'>('overview');

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
        return 'badge bg-success';
      case 'Expired':
      case 'Not Started':
        return 'badge bg-danger';
      case 'Expiring Soon':
      case 'Pending':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(farmerData.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Wrapper>
      <HeaderTwo />

      <section className="farmer-profile-section" style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#f0f4f8' }}>
        <div className="container">
        {/* Profile Header with Cover */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
              {/* Cover Image */}
              <div
                className="profile-cover"
                style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #1f4e3d 0%, #2d7a5e 50%, #3ea876 100%)',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '40px',
                  zIndex: 10
                }}>
                  <div
                    className="profile-avatar bg-white shadow-lg d-flex align-items-center justify-content-center"
                    style={{
                      width: '120px',
                      height: '120px',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      border: '5px solid white',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white'
                    }}
                  >
                    {farmerData.personalInfo.fullName.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="card-body pt-5 px-4 pb-4" style={{ marginTop: '50px' }}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="mb-2 fw-bold" style={{ color: '#1f4e3d' }}>
                      {farmerData.personalInfo.fullName}
                    </h2>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <span className="text-muted">
                        <i className="fa-solid fa-id-card me-2" style={{ color: '#10b981' }}></i>
                        ID: <strong>{farmerData.personalInfo.farmerId}</strong>
                      </span>
                      <span className="text-muted">
                        <i className="fa-solid fa-phone me-2" style={{ color: '#10b981' }}></i>
                        {farmerData.personalInfo.mobileNumber}
                      </span>
                      <span className="text-muted">
                        <i className="fa-solid fa-envelope me-2" style={{ color: '#10b981' }}></i>
                        {farmerData.personalInfo.email}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="d-flex flex-column gap-2 align-items-md-end">
                      <span className={getStatusBadgeClass(farmerData.kycDetails.status) + ' px-3 py-2'} style={{ fontSize: '14px', borderRadius: '25px' }}>
                        <i className="fa-solid fa-shield-check me-2"></i>
                        KYC {farmerData.kycDetails.status}
                      </span>
                      <span className={getStatusBadgeClass(farmerData.subscription.status) + ' px-3 py-2'} style={{ fontSize: '14px', borderRadius: '25px' }}>
                        <i className="fa-solid fa-crown me-2"></i>
                        {farmerData.subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-3">
                <ul className="nav nav-pills nav-fill gap-2">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: activeTab === 'overview' ? 'none' : '2px solid #e5e7eb',
                        backgroundColor: activeTab === 'overview' ? '#10b981' : 'transparent',
                        color: activeTab === 'overview' ? 'white' : '#6b7280',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fa-solid fa-home me-2"></i>Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`}
                      onClick={() => setActiveTab('devices')}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: activeTab === 'devices' ? 'none' : '2px solid #e5e7eb',
                        backgroundColor: activeTab === 'devices' ? '#10b981' : 'transparent',
                        color: activeTab === 'devices' ? 'white' : '#6b7280',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fa-solid fa-microchip me-2"></i>Devices ({farmerData.devices.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'subscription' ? 'active' : ''}`}
                      onClick={() => setActiveTab('subscription')}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: activeTab === 'subscription' ? 'none' : '2px solid #e5e7eb',
                        backgroundColor: activeTab === 'subscription' ? '#10b981' : 'transparent',
                        color: activeTab === 'subscription' ? 'white' : '#6b7280',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fa-solid fa-crown me-2"></i>Subscription
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'kyc' ? 'active' : ''}`}
                      onClick={() => setActiveTab('kyc')}
                      style={{
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: activeTab === 'kyc' ? 'none' : '2px solid #e5e7eb',
                        backgroundColor: activeTab === 'kyc' ? '#10b981' : 'transparent',
                        color: activeTab === 'kyc' ? 'white' : '#6b7280',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fa-solid fa-file-contract me-2"></i>KYC Details
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                      <h5 className="mb-0 fw-semibold"><i className="fa-solid fa-chart-line me-2"></i>Quick Stats</h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row text-center g-3">
                        <div className="col-6">
                          <div className="stat-box p-3 shadow-sm" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981' }}>
                            <h3 className="fw-bold mb-1" style={{ color: '#059669' }}>{farmerData.devices.length}</h3>
                            <p className="text-muted mb-0 small fw-medium">Active Devices</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="stat-box p-3 shadow-sm" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981' }}>
                            <h3 className="fw-bold mb-1" style={{ color: '#059669' }}>
                              {farmerData.devices.reduce((sum, device) => sum + parseFloat(device.acres), 0)}
                            </h3>
                            <p className="text-muted mb-0 small fw-medium">Total Acres</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="stat-box p-3 shadow-sm" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981' }}>
                            <h3 className="fw-bold mb-1" style={{ color: '#059669' }}>{calculateDaysRemaining()}</h3>
                            <p className="text-muted mb-0 small fw-medium">Days Remaining</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="stat-box p-3 shadow-sm" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981' }}>
                            <h3 className="fw-bold mb-1" style={{ color: '#059669' }}>
                              {[...new Set(farmerData.devices.flatMap(d => d.crops))].length}
                            </h3>
                            <p className="text-muted mb-0 small fw-medium">Crop Types</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0"><i className="fa-solid fa-seedling me-2"></i>Crops Overview</h5>
                    </div>
                    <div className="card-body">
                      <div className="crops-list">
                        {[...new Set(farmerData.devices.flatMap(d => d.crops))].map((crop, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                            <div>
                              <h6 className="mb-1">{crop}</h6>
                              <small className="text-muted">
                                {farmerData.devices
                                  .filter(d => d.crops.includes(crop))
                                  .reduce((sum, d) => sum + parseFloat(d.acres), 0)} acres
                              </small>
                            </div>
                            <span className="badge bg-success-subtle text-success">Growing</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0"><i className="fa-solid fa-bell me-2"></i>Recent Activity</h5>
                    </div>
                    <div className="card-body">
                      <div className="activity-item d-flex align-items-start mb-3 pb-3 border-bottom">
                        <div className="activity-icon bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Device Setup Completed</h6>
                          <p className="text-muted mb-0 small">Weather Station added to South Field</p>
                          <small className="text-muted">2 days ago</small>
                        </div>
                      </div>
                      <div className="activity-item d-flex align-items-start mb-3 pb-3 border-bottom">
                        <div className="activity-icon bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                          <i className="fa-solid fa-file-circle-check"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">KYC Verified</h6>
                          <p className="text-muted mb-0 small">Your KYC documents have been verified successfully</p>
                          <small className="text-muted">1 week ago</small>
                        </div>
                      </div>
                      <div className="activity-item d-flex align-items-start">
                        <div className="activity-icon bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                          <i className="fa-solid fa-crown"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Subscription Renewed</h6>
                          <p className="text-muted mb-0 small">Premium plan renewed for 12 months</p>
                          <small className="text-muted">1 month ago</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && (
              <div className="row">
                {farmerData.devices.map((device, index) => (
                  <div key={index} className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0"><i className="fa-solid fa-microchip me-2"></i>{device.deviceName}</h5>
                        <span className={getStatusBadgeClass(device.status)}>{device.status}</span>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Device ID</p>
                            <p className="fw-semibold mb-0">{device.deviceId}</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Purchase Date</p>
                            <p className="fw-semibold mb-0">{new Date(device.purchaseDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <hr />

                        <h6 className="text-success mb-3">Plot Information</h6>
                        <div className="row mb-2">
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Plot Number</p>
                            <p className="mb-0">{device.plotNumber}</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Plot Name</p>
                            <p className="mb-0">{device.plotName}</p>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Area</p>
                            <p className="mb-0">{device.acres} acres</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted mb-1 small">Soil Type</p>
                            <p className="mb-0">{device.soilType}</p>
                          </div>
                        </div>

                        <hr />

                        <h6 className="text-success mb-3">Location</h6>
                        <p className="mb-1">{device.village}, {device.taluk}</p>
                        <p className="mb-0">{device.district}, {device.state}</p>

                        <hr />

                        <h6 className="text-success mb-2">Crops</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {device.crops.map((crop, idx) => (
                            <span key={idx} className="badge bg-success-subtle text-success">{crop}</span>
                          ))}
                        </div>
                      </div>
                      <div className="card-footer bg-white border-top-0">
                        <Link to="/device-setup" className="btn btn-outline-success btn-sm w-100">
                          <i className="fa-solid fa-pen-to-square me-2"></i>Edit Device
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-6 mb-4">
                  <Link to="/device-setup" className="text-decoration-none">
                    <div className="card shadow-sm border-2 border-success border-dashed h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '400px', cursor: 'pointer' }}>
                      <div className="text-center p-4">
                        <i className="fa-solid fa-plus-circle text-success mb-3" style={{ fontSize: '60px' }}></i>
                        <h5 className="text-success mb-2">Add New Device</h5>
                        <p className="text-muted">Set up a new device for your farm</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="row">
                <div className="col-md-8 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0"><i className="fa-solid fa-crown me-2"></i>Subscription Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                          <h3 className="mb-2">{farmerData.subscription.planType} Plan</h3>
                          <p className="text-muted mb-0">{farmerData.subscription.price}</p>
                        </div>
                        <span className={getStatusBadgeClass(farmerData.subscription.status) + ' fs-6'}>
                          {farmerData.subscription.status}
                        </span>
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">Start Date</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-calendar-plus me-2 text-success"></i>
                            {new Date(farmerData.subscription.startDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">End Date</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-calendar-xmark me-2 text-danger"></i>
                            {new Date(farmerData.subscription.endDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="alert alert-info border-0" role="alert">
                        <i className="fa-solid fa-info-circle me-2"></i>
                        Your subscription will expire in <strong>{calculateDaysRemaining()} days</strong>
                      </div>

                      <hr />

                      <h6 className="text-success mb-3">Plan Features</h6>
                      <div className="features-list">
                        {farmerData.subscription.features.map((feature, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <i className="fa-solid fa-circle-check text-success me-3"></i>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <button className="btn btn-success w-100">
                        <i className="fa-solid fa-rotate me-2"></i>Renew Subscription
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 mb-3">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0"><i className="fa-solid fa-receipt me-2"></i>Billing History</h6>
                    </div>
                    <div className="card-body">
                      <div className="billing-item mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">₹12,000</span>
                          <span className="badge bg-success">Paid</span>
                        </div>
                        <small className="text-muted">Jan 1, 2024</small>
                      </div>
                      <div className="billing-item mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">₹12,000</span>
                          <span className="badge bg-success">Paid</span>
                        </div>
                        <small className="text-muted">Jan 1, 2023</small>
                      </div>
                      <button className="btn btn-outline-secondary btn-sm w-100">View All Invoices</button>
                    </div>
                  </div>

                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0"><i className="fa-solid fa-arrow-up-right-dots me-2"></i>Upgrade Plan</h6>
                    </div>
                    <div className="card-body">
                      <p className="small mb-3">Upgrade to Enterprise plan for advanced features and priority support.</p>
                      <button className="btn btn-info btn-sm w-100">Explore Plans</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="row">
                <div className="col-md-8 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0"><i className="fa-solid fa-file-contract me-2"></i>KYC Information</h5>
                      <span className={getStatusBadgeClass(farmerData.kycDetails.status)}>
                        {farmerData.kycDetails.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <h6 className="text-success mb-3">Personal Documents</h6>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">Aadhar Number</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-id-card me-2 text-success"></i>
                            {farmerData.kycDetails.aadharNumber}
                          </p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">PAN Number</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-id-card-clip me-2 text-success"></i>
                            {farmerData.kycDetails.panNumber}
                          </p>
                        </div>
                      </div>

                      <hr />

                      <h6 className="text-success mb-3">Bank Details</h6>
                      <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">Account Number</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-building-columns me-2 text-success"></i>
                            {farmerData.kycDetails.bankAccountNumber}
                          </p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <p className="text-muted mb-1 small">IFSC Code</p>
                          <p className="fw-semibold mb-0">
                            <i className="fa-solid fa-code me-2 text-success"></i>
                            {farmerData.kycDetails.ifscCode}
                          </p>
                        </div>
                      </div>

                      <hr />

                      <h6 className="text-success mb-3">Address</h6>
                      <div className="row">
                        <div className="col-12 mb-2">
                          <p className="mb-1">{farmerData.kycDetails.address}</p>
                        </div>
                        <div className="col-md-4 mb-2">
                          <p className="text-muted mb-1 small">City</p>
                          <p className="mb-0">{farmerData.kycDetails.city}</p>
                        </div>
                        <div className="col-md-4 mb-2">
                          <p className="text-muted mb-1 small">State</p>
                          <p className="mb-0">{farmerData.kycDetails.state}</p>
                        </div>
                        <div className="col-md-4 mb-2">
                          <p className="text-muted mb-1 small">Pincode</p>
                          <p className="mb-0">{farmerData.kycDetails.pincode}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <Link to="/kyc-update" className="btn btn-outline-success w-100">
                        <i className="fa-solid fa-pen-to-square me-2"></i>Update KYC Details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="card shadow-sm border-0 mb-3">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0"><i className="fa-solid fa-shield-halved me-2"></i>Verification Status</h6>
                    </div>
                    <div className="card-body">
                      <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                        <span>
                          <i className="fa-solid fa-id-card me-2 text-success"></i>
                          Aadhar
                        </span>
                        <i className="fa-solid fa-circle-check text-success"></i>
                      </div>
                      <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                        <span>
                          <i className="fa-solid fa-id-card-clip me-2 text-success"></i>
                          PAN Card
                        </span>
                        <i className="fa-solid fa-circle-check text-success"></i>
                      </div>
                      <div className="verification-item d-flex justify-content-between align-items-center mb-3">
                        <span>
                          <i className="fa-solid fa-building-columns me-2 text-success"></i>
                          Bank Account
                        </span>
                        <i className="fa-solid fa-circle-check text-success"></i>
                      </div>
                      <div className="verification-item d-flex justify-content-between align-items-center">
                        <span>
                          <i className="fa-solid fa-phone me-2 text-success"></i>
                          Mobile Number
                        </span>
                        <i className="fa-solid fa-circle-check text-success"></i>
                      </div>
                    </div>
                  </div>

                  <div className="card shadow-sm border-0">
                    <div className="card-body text-center">
                      <i className="fa-solid fa-shield-halved text-success mb-3" style={{ fontSize: '48px' }}></i>
                      <h6 className="mb-2">Your data is secure</h6>
                      <p className="small text-muted mb-0">All your KYC information is encrypted and stored securely.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      <FooterOne />
    </Wrapper>
  );
}
