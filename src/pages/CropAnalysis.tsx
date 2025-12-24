import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import FooterOne from '../layouts/footers/FooterOne';

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  plotName: string;
  crops: string[];
  soilType: string;
  location: string;
}

interface SensorData {
  soilMoisture: number;
  soilTemperature: number;
  pH: number;
  ec: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  humidity: number;
  temperature: number;
}

const CropAnalysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deviceInfo = location.state as DeviceInfo;

  // If no device info, redirect to device setup
  if (!deviceInfo) {
    navigate('/device-setup');
    return null;
  }

  // Mock sensor data (in real app, this would come from API)
  const sensorData: SensorData = {
    soilMoisture: 42,
    soilTemperature: 28.5,
    pH: 6.8,
    ec: 1.2,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 68,
    humidity: 65,
    temperature: 29.8,
  };

  // Analysis logic based on sensor data
  const getOverallHealth = (): { status: string; color: string; percentage: number } => {
    let score = 0;
    let total = 0;

    // Soil Moisture (optimal: 40-60%)
    if (sensorData.soilMoisture >= 40 && sensorData.soilMoisture <= 60) score += 20;
    else if (sensorData.soilMoisture >= 30 && sensorData.soilMoisture <= 70) score += 15;
    else score += 5;
    total += 20;

    // pH (optimal: 6.0-7.0)
    if (sensorData.pH >= 6.0 && sensorData.pH <= 7.0) score += 20;
    else if (sensorData.pH >= 5.5 && sensorData.pH <= 7.5) score += 15;
    else score += 5;
    total += 20;

    // NPK levels (simplified check)
    if (sensorData.nitrogen >= 40 && sensorData.nitrogen <= 60) score += 10;
    else score += 5;
    if (sensorData.phosphorus >= 30 && sensorData.phosphorus <= 50) score += 10;
    else score += 5;
    if (sensorData.potassium >= 60 && sensorData.potassium <= 80) score += 10;
    else score += 5;
    total += 30;

    // Temperature (optimal: 20-30°C)
    if (sensorData.temperature >= 20 && sensorData.temperature <= 30) score += 15;
    else if (sensorData.temperature >= 15 && sensorData.temperature <= 35) score += 10;
    else score += 5;
    total += 15;

    // Humidity (optimal: 60-80%)
    if (sensorData.humidity >= 60 && sensorData.humidity <= 80) score += 15;
    else if (sensorData.humidity >= 50 && sensorData.humidity <= 90) score += 10;
    else score += 5;
    total += 15;

    const percentage = Math.round((score / total) * 100);

    if (percentage >= 80) return { status: 'Excellent', color: 'success', percentage };
    if (percentage >= 60) return { status: 'Good', color: 'primary', percentage };
    if (percentage >= 40) return { status: 'Fair', color: 'warning', percentage };
    return { status: 'Poor', color: 'danger', percentage };
  };

  const overallHealth = getOverallHealth();

  // Parameter analysis
  const parameterAnalysis = [
    {
      parameter: 'Soil Moisture',
      value: `${sensorData.soilMoisture}%`,
      status: sensorData.soilMoisture >= 40 && sensorData.soilMoisture <= 60 ? 'Optimal' : sensorData.soilMoisture < 40 ? 'Low' : 'High',
      color: sensorData.soilMoisture >= 40 && sensorData.soilMoisture <= 60 ? 'success' : 'warning',
      icon: 'fa-droplet',
      recommendation: sensorData.soilMoisture < 40 ? 'Increase irrigation frequency' : sensorData.soilMoisture > 60 ? 'Reduce watering to prevent root rot' : 'Maintain current irrigation schedule',
    },
    {
      parameter: 'Soil pH',
      value: sensorData.pH.toFixed(1),
      status: sensorData.pH >= 6.0 && sensorData.pH <= 7.0 ? 'Optimal' : sensorData.pH < 6.0 ? 'Acidic' : 'Alkaline',
      color: sensorData.pH >= 6.0 && sensorData.pH <= 7.0 ? 'success' : 'warning',
      icon: 'fa-vial',
      recommendation: sensorData.pH < 6.0 ? 'Apply lime to increase pH' : sensorData.pH > 7.0 ? 'Add sulfur or organic matter to lower pH' : 'pH level is optimal for most crops',
    },
    {
      parameter: 'Nitrogen (N)',
      value: `${sensorData.nitrogen} ppm`,
      status: sensorData.nitrogen >= 40 && sensorData.nitrogen <= 60 ? 'Optimal' : sensorData.nitrogen < 40 ? 'Low' : 'High',
      color: sensorData.nitrogen >= 40 && sensorData.nitrogen <= 60 ? 'success' : 'warning',
      icon: 'fa-n',
      recommendation: sensorData.nitrogen < 40 ? 'Apply nitrogen-rich fertilizer or compost' : sensorData.nitrogen > 60 ? 'Reduce nitrogen fertilization' : 'Nitrogen levels are adequate',
    },
    {
      parameter: 'Phosphorus (P)',
      value: `${sensorData.phosphorus} ppm`,
      status: sensorData.phosphorus >= 30 && sensorData.phosphorus <= 50 ? 'Optimal' : sensorData.phosphorus < 30 ? 'Low' : 'High',
      color: sensorData.phosphorus >= 30 && sensorData.phosphorus <= 50 ? 'success' : 'warning',
      icon: 'fa-p',
      recommendation: sensorData.phosphorus < 30 ? 'Add phosphate fertilizer or bone meal' : sensorData.phosphorus > 50 ? 'Reduce phosphorus application' : 'Phosphorus levels are good',
    },
    {
      parameter: 'Potassium (K)',
      value: `${sensorData.potassium} ppm`,
      status: sensorData.potassium >= 60 && sensorData.potassium <= 80 ? 'Optimal' : sensorData.potassium < 60 ? 'Low' : 'High',
      color: sensorData.potassium >= 60 && sensorData.potassium <= 80 ? 'success' : 'warning',
      icon: 'fa-k',
      recommendation: sensorData.potassium < 60 ? 'Apply potassium fertilizer or wood ash' : sensorData.potassium > 80 ? 'Reduce potassium fertilization' : 'Potassium levels are optimal',
    },
    {
      parameter: 'Temperature',
      value: `${sensorData.temperature}°C`,
      status: sensorData.temperature >= 20 && sensorData.temperature <= 30 ? 'Optimal' : sensorData.temperature < 20 ? 'Low' : 'High',
      color: sensorData.temperature >= 20 && sensorData.temperature <= 30 ? 'success' : 'warning',
      icon: 'fa-temperature-half',
      recommendation: sensorData.temperature < 20 ? 'Consider using row covers or mulch for warmth' : sensorData.temperature > 30 ? 'Provide shade or increase irrigation' : 'Temperature is ideal for growth',
    },
  ];

  // Crop-specific recommendations
  const getCropRecommendations = () => {
    const crops = deviceInfo.crops.join(', ');
    return [
      {
        title: 'Irrigation Schedule',
        icon: 'fa-clock',
        description: `For ${crops}, maintain soil moisture between 40-60%. Water early morning or late evening to minimize evaporation.`,
      },
      {
        title: 'Fertilization Plan',
        icon: 'fa-flask',
        description: 'Apply balanced NPK fertilizer every 2-3 weeks. Consider organic alternatives like compost or vermicompost.',
      },
      {
        title: 'Pest Management',
        icon: 'fa-bug',
        description: 'Monitor regularly for pests. Use integrated pest management (IPM) strategies. Consider neem oil as organic pesticide.',
      },
      {
        title: 'Soil Management',
        icon: 'fa-mountain',
        description: `${deviceInfo.soilType} requires proper drainage. Add organic matter to improve soil structure and water retention.`,
      },
      {
        title: 'Growth Stage Care',
        icon: 'fa-seedling',
        description: 'Monitor growth stages carefully. Adjust nutrient application based on vegetative vs reproductive growth phases.',
      },
    ];
  };

  const cropRecommendations = getCropRecommendations();

  return (
    <Wrapper>
      <section className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container-fluid">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-1">
                    <i className="fas fa-chart-pie text-success me-2"></i>
                    Crop Analysis & Recommendations
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {deviceInfo.plotName} • {deviceInfo.crops.join(', ')}
                  </p>
                </div>
                <div>
                  <button className="btn btn-secondary" onClick={() => navigate('/device-data', { state: deviceInfo })}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Health Score */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <div className="mb-3">
                        <i className="fas fa-heart-pulse text-danger" style={{ fontSize: '64px' }}></i>
                      </div>
                      <h3 className={`text-${overallHealth.color} mb-2`}>{overallHealth.status}</h3>
                      <h1 className={`text-${overallHealth.color} mb-0`}>{overallHealth.percentage}%</h1>
                      <p className="text-muted small mb-0">Overall Health Score</p>
                    </div>
                    <div className="col-md-9">
                      <h5 className="mb-3">Health Breakdown</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-droplet text-primary me-2"></i>
                            <div className="flex-grow-1">
                              <small className="text-muted d-block">Soil Moisture</small>
                              <div className="progress" style={{ height: '8px' }}>
                                <div className="progress-bar bg-primary" style={{ width: `${(sensorData.soilMoisture / 100) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-vial text-info me-2"></i>
                            <div className="flex-grow-1">
                              <small className="text-muted d-block">pH Balance</small>
                              <div className="progress" style={{ height: '8px' }}>
                                <div className="progress-bar bg-info" style={{ width: `${((sensorData.pH - 5) / 4) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-flask text-success me-2"></i>
                            <div className="flex-grow-1">
                              <small className="text-muted d-block">NPK Nutrients</small>
                              <div className="progress" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Parameter Analysis */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-microscope me-2"></i>
                    Parameter Analysis
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Parameter</th>
                          <th>Current Value</th>
                          <th>Status</th>
                          <th>Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameterAnalysis.map((param, index) => (
                          <tr key={index}>
                            <td>
                              <i className={`fas ${param.icon} me-2`}></i>
                              <strong>{param.parameter}</strong>
                            </td>
                            <td>{param.value}</td>
                            <td>
                              <span className={`badge bg-${param.color}`}>{param.status}</span>
                            </td>
                            <td>
                              <small className="text-muted">{param.recommendation}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="fas fa-list-check me-2"></i>
                    Immediate Action Plan
                  </h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Based on current sensor readings, here are the priority actions for the next 7 days:
                  </div>
                  <ol className="ps-3">
                    <li className="mb-2">
                      <strong>Day 1-2:</strong> Monitor soil moisture levels closely. Current level is {sensorData.soilMoisture}%.
                      {sensorData.soilMoisture < 40 && ' Increase irrigation immediately.'}
                    </li>
                    <li className="mb-2">
                      <strong>Day 3-4:</strong> Check NPK levels and apply balanced fertilizer if needed. Current N:{sensorData.nitrogen}, P:{sensorData.phosphorus}, K:{sensorData.potassium} ppm.
                    </li>
                    <li className="mb-2">
                      <strong>Day 5-6:</strong> Inspect crops for pest and disease signs. Apply preventive organic treatments.
                    </li>
                    <li className="mb-2">
                      <strong>Day 7:</strong> Review weekly sensor data trends and adjust care plan accordingly.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Crop-Specific Recommendations */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-leaf me-2"></i>
                    Crop Care Recommendations
                  </h5>
                </div>
                <div className="card-body">
                  {cropRecommendations.map((rec, index) => (
                    <div key={index} className="mb-4 pb-3 border-bottom">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-success bg-opacity-10 rounded-circle p-3 text-success">
                            <i className={`fas ${rec.icon}`} style={{ fontSize: '24px' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-2">{rec.title}</h6>
                          <p className="text-muted small mb-0">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Advisory */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-cloud-sun me-2"></i>
                    Environmental Advisory
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span><i className="fas fa-temperature-high text-danger me-2"></i>Temperature</span>
                      <strong>{sensorData.temperature}°C</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span><i className="fas fa-droplet text-primary me-2"></i>Humidity</span>
                      <strong>{sensorData.humidity}%</strong>
                    </div>
                  </div>
                  <div className="alert alert-warning mb-0">
                    <small>
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {sensorData.temperature > 30 ? 'High temperature detected. Consider providing shade or increasing irrigation.' :
                       sensorData.temperature < 20 ? 'Low temperature detected. Monitor for cold stress.' :
                       'Temperature is within optimal range for crop growth.'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export and Actions */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-outline-primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>
                  Print Analysis Report
                </button>
                <button className="btn btn-success" onClick={() => alert('Export functionality')}>
                  <i className="fas fa-download me-2"></i>
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </Wrapper>
  );
};

export default CropAnalysis;
