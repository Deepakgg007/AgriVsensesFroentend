import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';

interface DeviceInfo {
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
  location: string;
}

interface KYCPlot {
  plotId: string;
  plotNumber: string;
  plotName: string;
  totalArea: number;
  areaUnit: string;
  crops: string[];
  soilType: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  fullAddress: string;
}

const DeviceSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'tutorial' | 'scan' | 'form' | 'success'>('tutorial');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('new');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceId: '',
    deviceName: '',
    plotNumber: '',
    plotName: '',
    acres: '',
    crops: [],
    soilType: '',
    state: '',
    district: '',
    taluk: '',
    village: '',
    location: ''
  });

  // Mock KYC Plots Data (from farmer's KYC)
  const kycPlots: KYCPlot[] = [
    {
      plotId: 'PLOT-001',
      plotNumber: 'P-001',
      plotName: 'North Field A',
      totalArea: 5.5,
      areaUnit: 'acres',
      crops: ['Rice', 'Wheat'],
      soilType: 'Loamy Soil',
      state: 'Karnataka',
      district: 'Belgaum',
      taluk: 'Bailhongal',
      village: 'Managundi',
      fullAddress: 'Near Water Tank, Managundi Village, Bailhongal'
    },
    {
      plotId: 'PLOT-002',
      plotNumber: 'P-002',
      plotName: 'South Field B',
      totalArea: 3.2,
      areaUnit: 'acres',
      crops: ['Cotton', 'Sugarcane'],
      soilType: 'Black Soil',
      state: 'Karnataka',
      district: 'Belgaum',
      taluk: 'Bailhongal',
      village: 'Managundi',
      fullAddress: 'Near Main Road, Managundi Village, Bailhongal'
    }
  ];

  const cropOptions = [
    'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane',
    'Tomato', 'Potato', 'Onion', 'Cabbage', 'Carrot',
    'Beans', 'Peas', 'Cucumber', 'Lettuce', 'Spinach'
  ];

  const soilTypes = [
    'Clay Soil',
    'Sandy Soil',
    'Loamy Soil',
    'Silt Soil',
    'Peaty Soil',
    'Chalky Soil',
    'Black Soil',
    'Red Soil',
    'Alluvial Soil'
  ];

  const stateOptions = [
    'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh',
    'Telangana', 'Kerala', 'Gujarat', 'Rajasthan', 'Punjab',
    'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal', 'Other'
  ];

  const handleScanQR = () => {
    setShowScanner(true);
    // Simulate QR scan after 2 seconds
    setTimeout(() => {
      setDeviceInfo({
        ...deviceInfo,
        deviceId: 'DEV-001',
        deviceName: 'ESP32 Sensor Unit 1'
      });
      setShowScanner(false);
      setStep('form');
    }, 2000);
  };

  const handlePlotSelection = (plotId: string) => {
    setSelectedPlotId(plotId);

    if (plotId === 'new') {
      // Reset to empty form
      setDeviceInfo({
        ...deviceInfo,
        plotNumber: '',
        plotName: '',
        acres: '',
        crops: [],
        soilType: '',
        state: '',
        district: '',
        taluk: '',
        village: '',
        location: ''
      });
    } else {
      // Auto-fill from selected KYC plot
      const selectedPlot = kycPlots.find(plot => plot.plotId === plotId);
      if (selectedPlot) {
        setDeviceInfo({
          ...deviceInfo,
          plotNumber: selectedPlot.plotNumber,
          plotName: selectedPlot.plotName,
          acres: selectedPlot.totalArea.toString(),
          crops: [...selectedPlot.crops],
          soilType: selectedPlot.soilType,
          state: selectedPlot.state,
          district: selectedPlot.district,
          taluk: selectedPlot.taluk,
          village: selectedPlot.village,
          location: selectedPlot.fullAddress
        });
      }
    }
  };

  const handleCropToggle = (crop: string) => {
    setDeviceInfo(prev => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <Wrapper>
      <HeaderTwo />

      {/* Tutorial Section */}
      {step === 'tutorial' && (
          <section className="py-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-5">
                    <h2 className="mb-3">How to Register Your Device</h2>
                    <p className="text-muted">Follow these simple steps to set up your smart farming device</p>
                  </div>

                  {/* YouTube Video */}
                  <div className="ratio ratio-16x9 mb-5">
                    <iframe
                      src="https://www.youtube.com/watch?v=hXC7vCcg2xo"
                      title="Device Registration Tutorial"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: '10px' }}
                    ></iframe>
                  </div>

                  {/* Steps Info */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Registration Steps:</h5>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                1
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">Scan QR Code</h6>
                              <p className="text-muted mb-0 small">Use your camera to scan the QR code on your device</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                2
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">Device Detected</h6>
                              <p className="text-muted mb-0 small">Your device name will be automatically detected</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                3
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">Add Plot Details</h6>
                              <p className="text-muted mb-0 small">Enter your plot name, crops, soil type, and location</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                4
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">Start Monitoring</h6>
                              <p className="text-muted mb-0 small">Your device is ready to monitor your farm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scan Button */}
                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-lg px-5 py-3"
                      onClick={() => setStep('scan')}
                    >
                      <i className="fas fa-qrcode me-2"></i>
                      Start Device Setup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* QR Scanner Section */}
        {step === 'scan' && (
          <section className="py-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card text-center">
                    <div className="card-body p-5">
                      <div className="mb-4">
                        <i className="fas fa-qrcode" style={{ fontSize: '100px', color: '#10b981' }}></i>
                      </div>
                      <h3 className="mb-3">Scan Your Device QR Code</h3>
                      <p className="text-muted mb-4">Point your camera at the QR code on your device</p>

                      {!showScanner ? (
                        <button
                          className="btn btn-primary btn-lg px-5"
                          onClick={handleScanQR}
                        >
                          <i className="fas fa-camera me-2"></i>
                          Open Camera
                        </button>
                      ) : (
                        <div className="border rounded p-4 bg-light">
                          <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Scanning...</span>
                          </div>
                          <p className="mb-0">Scanning QR Code...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Form Section */}
        {step === 'form' && (
          <section className="py-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="card">
                    <div className="card-body p-4">
                      <div className="alert alert-success mb-4">
                        <i className="fas fa-check-circle me-2"></i>
                        Device Detected: <strong>{deviceInfo.deviceName}</strong>
                      </div>

                      <h4 className="mb-4">Add Plot Information</h4>

                      <form onSubmit={handleFormSubmit}>
                        {/* Device Info (Read-only) */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Device ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={deviceInfo.deviceId}
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Device Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={deviceInfo.deviceName}
                              disabled
                            />
                          </div>
                        </div>

                        {/* Plot Selection Dropdown */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Select Plot <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={selectedPlotId}
                            onChange={(e) => handlePlotSelection(e.target.value)}
                            style={{ borderRadius: '10px' }}
                          >
                            <option value="new">➕ Add New Plot (Enter Details Manually)</option>
                            {kycPlots.map((plot) => (
                              <option key={plot.plotId} value={plot.plotId}>
                                {plot.plotName} ({plot.plotNumber}) - {plot.totalArea} {plot.areaUnit} - {plot.crops.join(', ')}
                              </option>
                            ))}
                          </select>
                          {selectedPlotId !== 'new' && (
                            <small className="text-success d-block mt-2">
                              <i className="fas fa-info-circle me-1"></i>
                              Plot details loaded from your KYC. All fields are pre-filled and read-only.
                            </small>
                          )}
                        </div>

                        <hr className="mb-4" />

                        {/* Plot Number and Acres */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Plot Number <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., P-001"
                              value={deviceInfo.plotNumber}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, plotNumber: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Land Area (Acres) <span className="text-danger">*</span></label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              placeholder="e.g., 2.5"
                              value={deviceInfo.acres}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, acres: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            />
                          </div>
                        </div>

                        {/* Plot Name */}
                        <div className="mb-3">
                          <label className="form-label">Plot Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., North Field A"
                            value={deviceInfo.plotName}
                            onChange={(e) => setDeviceInfo({ ...deviceInfo, plotName: e.target.value })}
                            disabled={selectedPlotId !== 'new'}
                            required
                          />
                        </div>

                        {/* Crops Selection */}
                        <div className="mb-3">
                          <label className="form-label">Select Crops <span className="text-danger">*</span></label>
                          {selectedPlotId === 'new' ? (
                            <>
                              <p className="text-muted small mb-2">You can select multiple crops</p>
                              <div className="row g-2">
                                {cropOptions.map((crop) => (
                                  <div key={crop} className="col-md-4 col-6">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`crop-${crop}`}
                                        checked={deviceInfo.crops.includes(crop)}
                                        onChange={() => handleCropToggle(crop)}
                                      />
                                      <label className="form-check-label" htmlFor={`crop-${crop}`}>
                                        {crop}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {deviceInfo.crops.length === 0 && (
                                <small className="text-danger">Please select at least one crop</small>
                              )}
                            </>
                          ) : (
                            <div className="p-3 bg-light rounded">
                              {deviceInfo.crops.map((crop, idx) => (
                                <span key={idx} className="badge bg-success me-2 mb-1" style={{ fontSize: '14px' }}>
                                  <i className="fas fa-seedling me-1"></i>
                                  {crop}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Soil Type */}
                        <div className="mb-3">
                          <label className="form-label">Soil Type <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={deviceInfo.soilType}
                            onChange={(e) => setDeviceInfo({ ...deviceInfo, soilType: e.target.value })}
                            disabled={selectedPlotId !== 'new'}
                            required
                          >
                            <option value="">Select soil type...</option>
                            {soilTypes.map((soil) => (
                              <option key={soil} value={soil}>{soil}</option>
                            ))}
                          </select>
                        </div>

                        {/* Location Details */}
                        <h5 className="mb-3 mt-4">Location Details</h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">State <span className="text-danger">*</span></label>
                            <select
                              className="form-select"
                              value={deviceInfo.state}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, state: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            >
                              <option value="">Select state...</option>
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
                              placeholder="Enter district"
                              value={deviceInfo.district}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, district: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Taluk <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter taluk"
                              value={deviceInfo.taluk}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, taluk: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Village <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter village"
                              value={deviceInfo.village}
                              onChange={(e) => setDeviceInfo({ ...deviceInfo, village: e.target.value })}
                              disabled={selectedPlotId !== 'new'}
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label">Full Address/Landmark <span className="text-danger">*</span></label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter complete address with landmark"
                            value={deviceInfo.location}
                            onChange={(e) => setDeviceInfo({ ...deviceInfo, location: e.target.value })}
                            disabled={selectedPlotId !== 'new'}
                            required
                          ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setStep('scan')}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary flex-grow-1"
                            disabled={deviceInfo.crops.length === 0}
                          >
                            <i className="fas fa-check me-2"></i>
                            Register Device
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Success Section with Device Card */}
        {step === 'success' && (
          <section className="py-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  {/* Success Message */}
                  <div className="text-center mb-5">
                    <div className="mb-4">
                      <i className="fas fa-check-circle text-success" style={{ fontSize: '80px' }}></i>
                    </div>
                    <h2 className="mb-3">Device Registered Successfully!</h2>
                    <p className="text-muted">Your device is now monitoring your plot</p>
                  </div>

                  {/* Device Card */}
                  <div className="card shadow-lg border-0">
                    <div className="card-header bg-success text-white py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <i className="fas fa-microchip me-2"></i>
                          {deviceInfo.deviceName}
                        </h5>
                        <span className="badge bg-light text-success">
                          <i className="fas fa-circle me-1" style={{ fontSize: '8px' }}></i>
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-hashtag text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Device ID</small>
                              <strong>{deviceInfo.deviceId}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-tag text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Plot Number</small>
                              <strong>{deviceInfo.plotNumber}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-map-marked-alt text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Plot Name</small>
                              <strong>{deviceInfo.plotName}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-chart-area text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Land Area</small>
                              <strong>{deviceInfo.acres} Acres</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-seedling text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Crops</small>
                              <strong>{deviceInfo.crops.join(', ')}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-mountain text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Soil Type</small>
                              <strong>{deviceInfo.soilType}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-start">
                            <i className="fas fa-map-location-dot text-primary me-3 mt-1"></i>
                            <div>
                              <small className="text-muted d-block">Location</small>
                              <strong>{deviceInfo.state}, {deviceInfo.district}, {deviceInfo.taluk}, {deviceInfo.village}</strong>
                              <p className="mb-0 mt-1 text-muted small">{deviceInfo.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="card-footer bg-light">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary flex-grow-1"
                          onClick={() => navigate('/device-data', { state: deviceInfo })}
                        >
                          <i className="fas fa-chart-line me-2"></i>
                          View Device Data
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setStep('tutorial');
                            setDeviceInfo({
                              deviceId: '',
                              deviceName: '',
                              plotNumber: '',
                              plotName: '',
                              acres: '',
                              crops: [],
                              soilType: '',
                              state: '',
                              district: '',
                              taluk: '',
                              village: '',
                              location: ''
                            });
                          }}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Add Another Device
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      <FooterOne />
    </Wrapper>
  );
};

export default DeviceSetup;
