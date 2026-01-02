import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';
import { kycAPI } from '../services/api';

interface FarmerIdentity {
  fullName: string;
  gender: string;
}

interface ContactDetails {
  alternateMobile: string;
  whatsappNumber: string;
  email: string;
  preferredLanguage: string;
  preferredCommunication: string[];
}

interface AddressDetails {
  state: string;
  district: string;
  taluk: string;
  village: string;
  fullAddress: string;
  pinCode: string;
  homeGeoLocation: { lat: string; lng: string };
}

interface CropInfo {
  cropName: string;
  variety: string;
  season: string;
  harvestWindow: string;
  majorProblems: string[];
  isPrimary: boolean;
}

interface FarmPlot {
  plotId: string;
  ownershipType: string;
  totalArea: number;
  areaUnit: string;
  irrigatedArea: number;
  rainfedArea: number;
  waterSource: string[];
  irrigationMethod: string[];
  soilType: string;
  soilTestingDone: boolean;
  lastSoilTestDate: string;
  soilTestReport: string;
  crops: CropInfo[];
}

interface KYCData {
  identity: FarmerIdentity;
  contact: ContactDetails;
  address: AddressDetails;
  farmPlots: FarmPlot[];
}

const KYCUpdate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingKYC, setExistingKYC] = useState<any>(null);

  const [registrationData, setRegistrationData] = useState<KYCData>({
    identity: {
      fullName: '',
      gender: '',
    },
    contact: {
      alternateMobile: '',
      whatsappNumber: '',
      email: '',
      preferredLanguage: '',
      preferredCommunication: [],
    },
    address: {
      state: '',
      district: '',
      taluk: '',
      village: '',
      fullAddress: '',
      pinCode: '',
      homeGeoLocation: { lat: '', lng: '' },
    },
    farmPlots: [],
  });

  const [currentPlot, setCurrentPlot] = useState<FarmPlot>({
    plotId: '',
    ownershipType: '',
    totalArea: 0,
    areaUnit: 'acres',
    irrigatedArea: 0,
    rainfedArea: 0,
    waterSource: [],
    irrigationMethod: [],
    soilType: '',
    crops: [],
    soilTestingDone: false,
    lastSoilTestDate: '',
    soilTestReport: '',
  });

  // Master Data
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const ageGroups = ['18-30', '31-45', '46-60', '61-75', 'Above 75'];
  const languageOptions = ['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Marathi'];
  const communicationChannels = ['SMS', 'WhatsApp', 'Phone Call', 'In-App Notification', 'Email'];

  const stateOptions = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Other'];
  const ownershipTypes = ['Owner', 'Tenant', 'Lease', 'Sharecropper'];
  const waterSources = ['Borewell', 'Canal', 'Open Well', 'River', 'Pond', 'Tanker', 'Rainwater Harvesting'];
  const irrigationMethods = ['Flood', 'Furrow', 'Drip', 'Sprinkler', 'Rain-gun'];
  const soilTypes = ['Red Soil', 'Black Soil', 'Loamy Soil', 'Sandy Soil', 'Laterite Soil', 'Alluvial Soil', 'Clay Soil'];

  // Crop-related master data
  const cropOptions = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Corn', 'Tomato', 'Potato', 'Onion', 'Banana', 'Groundnut', 'Soybean', 'Chili', 'Other'];
  const seasonOptions = ['Kharif', 'Rabi', 'Summer', 'Perennial'];
  const farmingPracticeOptions = ['Organic', 'Conventional', 'Integrated'];
  const problemOptions = ['Pest Attack', 'Disease', 'Water Scarcity', 'Excess Water', 'Nutrition Deficiency', 'Low Market Price', 'Labor Shortage', 'Seed Quality', 'Weather Damage', 'Weed Problem'];

  // State for current crop being added
  const [currentCrop, setCurrentCrop] = useState<CropInfo>({
    cropName: '',
    variety: '',
    season: '',
    harvestWindow: '',
    majorProblems: [],
    isPrimary: false,
  });

  // State for multiple crop selection
  const [selectedCropNames, setSelectedCropNames] = useState<string[]>([]);

  // Load existing KYC data on component mount
  useEffect(() => {
    const loadKYCData = async () => {
      try {
        setLoading(true);
        const response = await kycAPI.getMyKYC();
        const kycData = response.data.kyc;

        if (kycData) {
          setExistingKYC(kycData);
          // Populate form with existing data
          if (kycData.identity) {
            setRegistrationData((prev) => ({
              ...prev,
              identity: kycData.identity,
            }));
          }
          if (kycData.contact) {
            setRegistrationData((prev) => ({
              ...prev,
              contact: kycData.contact,
            }));
          }
          if (kycData.address) {
            setRegistrationData((prev) => ({
              ...prev,
              address: kycData.address,
            }));
          }
          if (kycData.farmPlots && kycData.farmPlots.length > 0) {
            setRegistrationData((prev) => ({
              ...prev,
              farmPlots: kycData.farmPlots,
            }));
          }
        }
      } catch (error: any) {
        console.log('No existing KYC data found or error loading:', error);
        // If no KYC found, continue with empty form
      } finally {
        setLoading(false);
      }
    };

    loadKYCData();
  }, []);

  const handleIdentityChange = (field: keyof FarmerIdentity, value: string) => {
    setRegistrationData({
      ...registrationData,
      identity: { ...registrationData.identity, [field]: value },
    });
  };

  const handleContactChange = (field: keyof ContactDetails, value: string | string[]) => {
    setRegistrationData({
      ...registrationData,
      contact: { ...registrationData.contact, [field]: value },
    });
  };

  const handleAddressChange = (field: keyof AddressDetails, value: any) => {
    setRegistrationData({
      ...registrationData,
      address: { ...registrationData.address, [field]: value },
    });
  };

  const handlePlotChange = (field: keyof FarmPlot, value: any) => {
    setCurrentPlot({ ...currentPlot, [field]: value });
  };

  const handleCommunicationToggle = (channel: string) => {
    const current = registrationData.contact.preferredCommunication;
    if (current.includes(channel)) {
      handleContactChange('preferredCommunication', current.filter(c => c !== channel));
    } else {
      handleContactChange('preferredCommunication', [...current, channel]);
    }
  };

  const handleArrayToggle = (field: 'waterSource' | 'irrigationMethod', value: string) => {
    const current = currentPlot[field];
    if (current.includes(value)) {
      handlePlotChange(field, current.filter(v => v !== value));
    } else {
      handlePlotChange(field, [...current, value]);
    }
  };

  // Crop management handlers
  const handleCropChange = (field: keyof CropInfo, value: any) => {
    setCurrentCrop({ ...currentCrop, [field]: value });
  };

  const handleProblemToggle = (problem: string) => {
    const current = currentCrop.majorProblems;
    if (current.includes(problem)) {
      handleCropChange('majorProblems', current.filter(p => p !== problem));
    } else {
      handleCropChange('majorProblems', [...current, problem]);
    }
  };

  const handleCropNameToggle = (cropName: string) => {
    if (selectedCropNames.includes(cropName)) {
      setSelectedCropNames(selectedCropNames.filter(c => c !== cropName));
    } else {
      setSelectedCropNames([...selectedCropNames, cropName]);
    }
  };

  const addCropToPlot = () => {
    if (selectedCropNames.length > 0 && currentCrop.season) {
      // Add each selected crop with the common details
      const newCrops = selectedCropNames.map(cropName => ({
        ...currentCrop,
        cropName: cropName,
      }));

      setCurrentPlot({
        ...currentPlot,
        crops: [...currentPlot.crops, ...newCrops],
      });

      // Reset current crop and selected names
      setCurrentCrop({
        cropName: '',
        variety: '',
        season: '',
        harvestWindow: '',
        majorProblems: [],
        isPrimary: false,
      });
      setSelectedCropNames([]);
    } else {
      alert('Please select at least one crop and season before adding');
    }
  };

  const removeCropFromPlot = (index: number) => {
    setCurrentPlot({
      ...currentPlot,
      crops: currentPlot.crops.filter((_, i) => i !== index),
    });
  };

  const addFarmPlot = () => {
    if (currentPlot.totalArea > 0 && currentPlot.ownershipType) {
      setRegistrationData({
        ...registrationData,
        farmPlots: [...registrationData.farmPlots, { ...currentPlot, plotId: `PLOT-${Date.now()}` }],
      });
      // Reset current plot
      setCurrentPlot({
        plotId: '',
        ownershipType: '',
        landDocumentRef: '',
        totalArea: 0,
        areaUnit: 'acres',
        irrigatedArea: 0,
        rainfedArea: 0,
        waterSource: [],
        irrigationMethod: [],
        soilType: '',
        crops: [],
        soilTestingDone: false,
        lastSoilTestDate: '',
        soilTestReport: '',
      });
      // Reset current crop and selected names
      setCurrentCrop({
        cropName: '',
        variety: '',
        season: '',
        areaUnderCrop: 0,
        sowingDate: '',
        harvestWindow: '',
        farmingPractice: '',
        majorProblems: [],
        isPrimary: false,
      });
      setSelectedCropNames([]);
    }
  };

  const removeFarmPlot = (plotId: string) => {
    setRegistrationData({
      ...registrationData,
      farmPlots: registrationData.farmPlots.filter(plot => plot.plotId !== plotId),
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Submit or update KYC based on whether it exists
      if (existingKYC && existingKYC._id) {
        // Update existing KYC
        await kycAPI.updateKYC(existingKYC._id, registrationData);
        alert('KYC updated successfully!');
      } else {
        // Submit new KYC
        await kycAPI.submitKYC(registrationData);
        alert('KYC submitted successfully!');
      }

      navigate('/farmer-profile');
    } catch (error: any) {
      console.error('Error submitting KYC:', error);
      alert(error.response?.data?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal & Contact Details';
      case 2: return 'Address & Location';
      case 3: return 'Farm & Land Details';
      case 4: return 'Review & Submit';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <HeaderTwo />
        <section className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 col-xl-9">
                <div className="text-center py-5">
                  <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Loading KYC information...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterOne />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderTwo />

      <section className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              {/* Modern Progress Bar */}
              <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="text-center position-relative" style={{ flex: 1 }}>
                        <div
                          className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center position-relative ${
                            currentStep >= step ? 'bg-gradient text-white' : 'bg-light text-muted'
                          }`}
                          style={{
                            width: '50px',
                            height: '50px',
                            background: currentStep >= step ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '',
                            boxShadow: currentStep >= step ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '',
                            transition: 'all 0.3s ease',
                            zIndex: 2
                          }}
                        >
                          {currentStep > step ? (
                            <i className="fas fa-check" style={{ fontSize: '18px' }}></i>
                          ) : (
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{step}</span>
                          )}
                        </div>
                        {step < 4 && (
                          <div
                            className="position-absolute"
                            style={{
                              top: '24px',
                              left: '50%',
                              width: '100%',
                              height: '3px',
                              background: currentStep > step ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : '#e0e0e0',
                              zIndex: 1,
                              transition: 'all 0.3s ease'
                            }}
                          ></div>
                        )}
                        <small className={`d-block mt-2 ${currentStep >= step ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                          {step === 1 ? 'Personal' : step === 2 ? 'Address' : step === 3 ? 'Farm Details' : 'Review'}
                        </small>
                      </div>
                    ))}
                  </div>
                  <div className="progress" style={{ height: '6px', borderRadius: '10px', backgroundColor: '#f0f0f0' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(currentStep / totalSteps) * 100}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: '10px',
                        transition: 'width 0.4s ease'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Modern Form Card */}
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-body p-5" style={{ backgroundColor: '#ffffff' }}>
                  {/* Section Title */}
                  <div className="mb-4 pb-3 border-bottom">
                    <h4 className="mb-1 fw-bold text-success">{getStepTitle()}</h4>
                    <small className="text-muted">Step {currentStep} of {totalSteps}</small>
                  </div>
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal & Contact Details */}
                    {currentStep === 1 && (
                      <div>
                        <h6 className="text-success mb-3">
                          <i className="fas fa-user me-2"></i>Personal Information
                        </h6>
                        <div className="row g-3 mb-4">
                          <div className="col-md-12">
                            <label className="form-label">Full Name (as per Aadhaar/Land Record) <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationData.identity.fullName}
                              onChange={(e) => handleIdentityChange('fullName', e.target.value)}
                              placeholder="Enter full legal name"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Gender <span className="text-danger">*</span></label>
                            <select
                              className="form-select"
                              value={registrationData.identity.gender}
                              onChange={(e) => handleIdentityChange('gender', e.target.value)}
                              required
                            >
                              <option value="">Select gender</option>
                              {genderOptions.map((gender) => (
                                <option key={gender} value={gender}>{gender}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <h6 className="text-success mb-3">
                          <i className="fas fa-phone me-2"></i>Contact Information
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Alternate Mobile (Family Member)</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={registrationData.contact.alternateMobile}
                              onChange={(e) => handleContactChange('alternateMobile', e.target.value)}
                              placeholder="+91 XXXXX-XXXXX"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">WhatsApp Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={registrationData.contact.whatsappNumber}
                              onChange={(e) => handleContactChange('whatsappNumber', e.target.value)}
                              placeholder="+91 XXXXX-XXXXX (if different)"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              value={registrationData.contact.email}
                              onChange={(e) => handleContactChange('email', e.target.value)}
                              placeholder="farmer@example.com"
                            />
                            <small className="text-muted">Optional</small>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Preferred Language <span className="text-danger">*</span></label>
                            <select
                              className="form-select"
                              value={registrationData.contact.preferredLanguage}
                              onChange={(e) => handleContactChange('preferredLanguage', e.target.value)}
                              required
                            >
                              <option value="">Select language</option>
                              {languageOptions.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-12">
                            <label className="form-label">Preferred Communication Channels <span className="text-danger">*</span></label>
                            <div className="row g-2">
                              {communicationChannels.map((channel) => (
                                <div key={channel} className="col-md-4">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`channel-${channel}`}
                                      checked={registrationData.contact.preferredCommunication.includes(channel)}
                                      onChange={() => handleCommunicationToggle(channel)}
                                    />
                                    <label className="form-check-label" htmlFor={`channel-${channel}`}>
                                      {channel}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Address & Location */}
                    {currentStep === 2 && (
                      <div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">State <span className="text-danger">*</span></label>
                            <select
                              className="form-select"
                              value={registrationData.address.state}
                              onChange={(e) => handleAddressChange('state', e.target.value)}
                              required
                            >
                              <option value="">Select state</option>
                              {stateOptions.map((state) => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">District <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationData.address.district}
                              onChange={(e) => handleAddressChange('district', e.target.value)}
                              placeholder="Enter district"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Taluk / Tehsil <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationData.address.taluk}
                              onChange={(e) => handleAddressChange('taluk', e.target.value)}
                              placeholder="Enter taluk/tehsil"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Village <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationData.address.village}
                              onChange={(e) => handleAddressChange('village', e.target.value)}
                              placeholder="Enter village name"
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">PIN Code <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              value={registrationData.address.pinCode}
                              onChange={(e) => handleAddressChange('pinCode', e.target.value)}
                              placeholder="XXXXXX"
                              maxLength={6}
                              required
                            />
                          </div>

                          <div className="col-md-12">
                            <label className="form-label">Full Postal Address <span className="text-danger">*</span></label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={registrationData.address.fullAddress}
                              onChange={(e) => handleAddressChange('fullAddress', e.target.value)}
                              placeholder="Enter complete address"
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Farm & Land Details */}
                    {currentStep === 3 && (
                      <div>
                        <div className="alert alert-info mb-4">
                          <i className="fas fa-info-circle me-2"></i>
                          <strong>How it works:</strong> Add plot details (area, water source, soil type) and then add multiple crops to that plot. Each plot can have multiple crops with different seasons and areas. You can add multiple plots if needed.
                        </div>

                        {/* Added Farm Plots List */}
                        {registrationData.farmPlots.length > 0 && (
                          <div className="mb-4">
                            <h6 className="mb-3">Added Farm Plots ({registrationData.farmPlots.length})</h6>
                            {registrationData.farmPlots.map((plot, index) => (
                              <div key={plot.plotId} className="card mb-3 border-success">
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <strong className="text-success">Plot {index + 1}</strong> - {plot.totalArea} {plot.areaUnit} ({plot.ownershipType})
                                      <br />
                                      <small className="text-muted">
                                        Irrigated: {plot.irrigatedArea} {plot.areaUnit}, Rainfed: {plot.rainfedArea} {plot.areaUnit}
                                        {plot.soilType && ` • Soil: ${plot.soilType}`}
                                      </small>

                                      {/* Display Crops for this Plot */}
                                      {plot.crops && plot.crops.length > 0 && (
                                        <div className="mt-2 pt-2 border-top">
                                          <small className="fw-semibold text-success">
                                            <i className="fas fa-seedling me-1"></i>
                                            Crops in this plot ({plot.crops.length}):
                                          </small>
                                          <div className="mt-1">
                                            {plot.crops.map((crop, cropIdx) => (
                                              <span key={cropIdx} className={`badge ${crop.isPrimary ? 'bg-warning text-dark' : 'bg-success-subtle text-success'} me-1 mb-1`}>
                                                {crop.isPrimary && <i className="fas fa-star me-1"></i>}
                                                {crop.cropName}
                                                {crop.variety && ` (${crop.variety})`}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger ms-2"
                                      onClick={() => removeFarmPlot(plot.plotId)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Plot Form */}
                        <div className="border rounded p-3 bg-light">
                          <h6 className="mb-3">Add Farm Plot</h6>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">Ownership Type <span className="text-danger">*</span></label>
                              <select
                                className="form-select"
                                value={currentPlot.ownershipType}
                                onChange={(e) => handlePlotChange('ownershipType', e.target.value)}
                              >
                                <option value="">Select ownership</option>
                                {ownershipTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-4">
                              <label className="form-label">Total Cultivated Area <span className="text-danger">*</span></label>
                              <input
                                type="number"
                                className="form-control"
                                value={currentPlot.totalArea}
                                onChange={(e) => handlePlotChange('totalArea', parseFloat(e.target.value))}
                                step="0.01"
                              />
                            </div>

                            <div className="col-md-2">
                              <label className="form-label">Unit</label>
                              <select
                                className="form-select"
                                value={currentPlot.areaUnit}
                                onChange={(e) => handlePlotChange('areaUnit', e.target.value)}
                              >
                                <option value="acres">Acres</option>
                                <option value="hectares">Hectares</option>
                              </select>
                            </div>

                            <div className="col-md-3">
                              <label className="form-label">Irrigated Area</label>
                              <input
                                type="number"
                                className="form-control"
                                value={currentPlot.irrigatedArea}
                                onChange={(e) => handlePlotChange('irrigatedArea', parseFloat(e.target.value))}
                                step="0.01"
                              />
                            </div>

                            <div className="col-md-3">
                              <label className="form-label">Rainfed Area</label>
                              <input
                                type="number"
                                className="form-control"
                                value={currentPlot.rainfedArea}
                                onChange={(e) => handlePlotChange('rainfedArea', parseFloat(e.target.value))}
                                step="0.01"
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label">Water Source(s)</label>
                              <div className="row g-2">
                                {waterSources.map((source) => (
                                  <div key={source} className="col-6">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`water-${source}`}
                                        checked={currentPlot.waterSource.includes(source)}
                                        onChange={() => handleArrayToggle('waterSource', source)}
                                      />
                                      <label className="form-check-label" htmlFor={`water-${source}`}>
                                        <small>{source}</small>
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label">Irrigation Method(s)</label>
                              <div className="row g-2">
                                {irrigationMethods.map((method) => (
                                  <div key={method} className="col-6">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`irrigation-${method}`}
                                        checked={currentPlot.irrigationMethod.includes(method)}
                                        onChange={() => handleArrayToggle('irrigationMethod', method)}
                                      />
                                      <label className="form-check-label" htmlFor={`irrigation-${method}`}>
                                        <small>{method}</small>
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label">Soil Type</label>
                              <select
                                className="form-select"
                                value={currentPlot.soilType}
                                onChange={(e) => handlePlotChange('soilType', e.target.value)}
                              >
                                <option value="">Select soil type</option>
                                {soilTypes.map((soil) => (
                                  <option key={soil} value={soil}>{soil}</option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label">Soil Testing Done?</label>
                              <div className="form-check form-switch mt-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={currentPlot.soilTestingDone}
                                  onChange={(e) => handlePlotChange('soilTestingDone', e.target.checked)}
                                />
                                <label className="form-check-label">
                                  {currentPlot.soilTestingDone ? 'Yes' : 'No'}
                                </label>
                              </div>
                            </div>

                            {currentPlot.soilTestingDone && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label">Last Soil Test Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={currentPlot.lastSoilTestDate}
                                    onChange={(e) => handlePlotChange('lastSoilTestDate', e.target.value)}
                                  />
                                </div>

                                <div className="col-md-6">
                                  <label className="form-label">Soil Test Report Number</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={currentPlot.soilTestReport}
                                    onChange={(e) => handlePlotChange('soilTestReport', e.target.value)}
                                    placeholder="Report reference number"
                                  />
                                </div>
                              </>
                            )}

                            {/* Crops & Farming Practices Section */}
                            <div className="col-12 mt-4">
                              <hr />
                              <h6 className="mb-3 text-success">
                                <i className="fas fa-seedling me-2"></i>
                                Crops & Farming Practices
                              </h6>

                              {/* Added Crops List */}
                              {currentPlot.crops.length > 0 && (
                                <div className="mb-3">
                                  <p className="small fw-semibold mb-2">Crops Added ({currentPlot.crops.length}):</p>
                                  {currentPlot.crops.map((crop, index) => (
                                    <div key={index} className="card mb-2 border-success">
                                      <div className="card-body p-2">
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <strong>{crop.cropName}</strong>
                                            {crop.variety && <span className="text-muted"> ({crop.variety})</span>}
                                            {crop.isPrimary && (
                                              <span className="badge bg-warning text-dark ms-2">
                                                <i className="fas fa-star me-1"></i>Primary
                                              </span>
                                            )}
                                            <br />
                                            <small className="text-muted">
                                              {crop.season}
                                            </small>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeCropFromPlot(index)}
                                          >
                                            <i className="fas fa-times"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Add Crop Form */}
                              <div className="border border-success rounded p-3 bg-light">
                                <p className="small mb-3 text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  Select multiple crops and add common details for all selected crops
                                </p>

                                <div className="row g-2">
                                  <div className="col-12">
                                    <label className="form-label small">Select Crop(s) <span className="text-danger">*</span></label>
                                    <div className="row g-2">
                                      {cropOptions.map((crop) => (
                                        <div key={crop} className="col-md-3 col-6">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`crop-${crop}`}
                                              checked={selectedCropNames.includes(crop)}
                                              onChange={() => handleCropNameToggle(crop)}
                                            />
                                            <label className="form-check-label small" htmlFor={`crop-${crop}`}>
                                              {crop}
                                            </label>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {selectedCropNames.length > 0 && (
                                      <div className="mt-2">
                                        <small className="text-success fw-semibold">
                                          <i className="fas fa-check-circle me-1"></i>
                                          {selectedCropNames.length} crop{selectedCropNames.length > 1 ? 's' : ''} selected: {selectedCropNames.join(', ')}
                                        </small>
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-md-4">
                                    <label className="form-label small">Variety / Hybrid</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={currentCrop.variety}
                                      onChange={(e) => handleCropChange('variety', e.target.value)}
                                      placeholder="e.g., BG-1, IR-64"
                                    />
                                  </div>

                                  <div className="col-md-4">
                                    <label className="form-label small">Season <span className="text-danger">*</span></label>
                                    <select
                                      className="form-select form-select-sm"
                                      value={currentCrop.season}
                                      onChange={(e) => handleCropChange('season', e.target.value)}
                                    >
                                      <option value="">Select season</option>
                                      {seasonOptions.map((season) => (
                                        <option key={season} value={season}>{season}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="col-md-6">
                                    <label className="form-label small">Typical Harvest Window</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={currentCrop.harvestWindow}
                                      onChange={(e) => handleCropChange('harvestWindow', e.target.value)}
                                      placeholder="e.g., March-April"
                                    />
                                  </div>

                                  <div className="col-md-12">
                                    <div className="form-check form-switch">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isPrimarySwitch"
                                        checked={currentCrop.isPrimary}
                                        onChange={(e) => handleCropChange('isPrimary', e.target.checked)}
                                      />
                                      <label className="form-check-label small" htmlFor="isPrimarySwitch">
                                        <i className="fas fa-star text-warning me-1"></i>
                                        <strong>Mark as Primary Crop</strong>
                                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                                          Primary crop is the main crop grown for commercial purposes
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-12">
                                    <label className="form-label small">Major Problems Faced</label>
                                    <div className="row g-2">
                                      {problemOptions.map((problem) => (
                                        <div key={problem} className="col-md-4 col-6">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`problem-${problem}`}
                                              checked={currentCrop.majorProblems.includes(problem)}
                                              onChange={() => handleProblemToggle(problem)}
                                            />
                                            <label className="form-check-label small" htmlFor={`problem-${problem}`}>
                                              {problem}
                                            </label>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="col-12">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-success"
                                      onClick={addCropToPlot}
                                      disabled={selectedCropNames.length === 0}
                                    >
                                      <i className="fas fa-plus me-1"></i>
                                      Add {selectedCropNames.length > 0 ? `${selectedCropNames.length} Crop${selectedCropNames.length > 1 ? 's' : ''}` : 'Crops'}
                                    </button>
                                    {selectedCropNames.length === 0 && (
                                      <small className="text-warning d-block mt-2">
                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                        Please select at least one crop above
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 mt-3">
                              <hr />
                              <button
                                type="button"
                                className="btn btn-success btn-lg"
                                onClick={addFarmPlot}
                                disabled={!currentPlot.ownershipType || currentPlot.totalArea <= 0}
                              >
                                <i className="fas fa-plus me-2"></i>
                                Save Plot
                                {currentPlot.crops.length > 0 && ` with ${currentPlot.crops.length} Crop${currentPlot.crops.length > 1 ? 's' : ''}`}
                              </button>
                              <div className="mt-2">
                                {currentPlot.crops.length === 0 ? (
                                  <small className="text-warning">
                                    <i className="fas fa-exclamation-triangle me-1"></i>
                                    No crops added yet. Add at least one crop above before saving the plot.
                                  </small>
                                ) : (
                                  <small className="text-success">
                                    <i className="fas fa-check-circle me-1"></i>
                                    {currentPlot.crops.length} crop{currentPlot.crops.length > 1 ? 's' : ''} will be saved with this plot. You can add more crops before saving.
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {registrationData.farmPlots.length === 0 && (
                          <div className="alert alert-warning mt-3 mb-0">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Please add at least one farm plot to continue
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                      <div>
                        <div className="alert alert-success mb-4">
                          <i className="fas fa-check-circle me-2"></i>
                          Please review all the information before updating your KYC
                        </div>

                        {/* Identity Review */}
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Farmer Identity</h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <small className="text-muted">Full Name:</small>
                                <div><strong>{registrationData.identity.fullName}</strong></div>
                              </div>
                              <div className="col-md-6 mb-2">
                                <small className="text-muted">Gender:</small>
                                <div>{registrationData.identity.gender}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Review */}
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Contact Details</h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <small className="text-muted">Preferred Language:</small>
                                <div>{registrationData.contact.preferredLanguage}</div>
                              </div>
                              <div className="col-md-12 mb-2">
                                <small className="text-muted">Communication Channels:</small>
                                <div>{registrationData.contact.preferredCommunication.join(', ')}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Address Review */}
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Address & Location</h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 mb-2">
                                <small className="text-muted">Address:</small>
                                <div>{registrationData.address.fullAddress}</div>
                              </div>
                              <div className="col-md-4 mb-2">
                                <small className="text-muted">Village:</small>
                                <div>{registrationData.address.village}</div>
                              </div>
                              <div className="col-md-4 mb-2">
                                <small className="text-muted">Taluk:</small>
                                <div>{registrationData.address.taluk}</div>
                              </div>
                              <div className="col-md-4 mb-2">
                                <small className="text-muted">District:</small>
                                <div>{registrationData.address.district}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Farm Plots Review */}
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Farm Plots ({registrationData.farmPlots.length})</h6>
                          </div>
                          <div className="card-body">
                            {registrationData.farmPlots.map((plot, index) => (
                              <div key={plot.plotId} className="border-bottom pb-3 mb-3">
                                <strong>Plot {index + 1}</strong>
                                <div className="row mt-2">
                                  <div className="col-md-4">
                                    <small className="text-muted">Ownership:</small>
                                    <div>{plot.ownershipType}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <small className="text-muted">Total Area:</small>
                                    <div>{plot.totalArea} {plot.areaUnit}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <small className="text-muted">Soil Type:</small>
                                    <div>{plot.soilType || 'Not specified'}</div>
                                  </div>
                                </div>

                                {/* Crops Information */}
                                {plot.crops && plot.crops.length > 0 && (
                                  <div className="mt-3">
                                    <small className="text-muted fw-semibold">
                                      <i className="fas fa-seedling me-1"></i>
                                      Crops Grown ({plot.crops.length}):
                                    </small>
                                    <div className="mt-2">
                                      {plot.crops.map((crop, cropIndex) => (
                                        <div key={cropIndex} className="bg-light p-2 rounded mb-2">
                                          <div className="row small">
                                            <div className="col-md-4">
                                              <strong>{crop.cropName}</strong>
                                              {crop.variety && <span className="text-muted"> ({crop.variety})</span>}
                                              {crop.isPrimary && (
                                                <span className="badge bg-warning text-dark ms-1">
                                                  <i className="fas fa-star"></i>
                                                </span>
                                              )}
                                            </div>
                                            <div className="col-md-2">
                                              <span className="badge bg-success-subtle text-success">{crop.season}</span>
                                            </div>
                                            <div className="col-md-6">
                                              {crop.majorProblems.length > 0 && (
                                                <span className="text-muted">
                                                  Problems: {crop.majorProblems.slice(0, 2).join(', ')}
                                                  {crop.majorProblems.length > 2 && ` +${crop.majorProblems.length - 2}`}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modern Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-5"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        style={{
                          borderRadius: '30px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Previous
                      </button>

                      {currentStep < totalSteps ? (
                        <button
                          type="button"
                          className="btn btn-lg px-5 text-white"
                          onClick={handleNext}
                          disabled={
                            (currentStep === 4 && registrationData.farmPlots.length === 0)
                          }
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '30px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Next Step
                          <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-lg px-5 text-white"
                          disabled={submitting}
                          style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            border: 'none',
                            borderRadius: '30px',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check-circle me-2"></i>
                              {existingKYC ? 'Update KYC' : 'Submit KYC'}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
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

export default KYCUpdate;
