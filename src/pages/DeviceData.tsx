import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import FooterOne from '../layouts/footers/FooterOne';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  plotName: string;
  crops: string[];
  soilType: string;
  location: string;
}

const DeviceData: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deviceInfo = location.state as DeviceInfo;

  // If no device info, redirect to device setup
  if (!deviceInfo) {
    navigate('/device-setup');
    return null;
  }

  // Temperature data (24 hours)
  const temperatureData = [
    { time: '00:00', temp: 22.5 },
    { time: '02:00', temp: 21.8 },
    { time: '04:00', temp: 20.5 },
    { time: '06:00', temp: 21.2 },
    { time: '08:00', temp: 24.5 },
    { time: '10:00', temp: 27.3 },
    { time: '12:00', temp: 29.8 },
    { time: '14:00', temp: 31.2 },
    { time: '16:00', temp: 30.5 },
    { time: '18:00', temp: 28.3 },
    { time: '20:00', temp: 25.7 },
    { time: '22:00', temp: 23.8 },
  ];

  // Humidity data (24 hours)
  const humidityData = [
    { time: '00:00', humidity: 75 },
    { time: '02:00', humidity: 78 },
    { time: '04:00', humidity: 80 },
    { time: '06:00', humidity: 82 },
    { time: '08:00', humidity: 70 },
    { time: '10:00', humidity: 65 },
    { time: '12:00', humidity: 60 },
    { time: '14:00', humidity: 55 },
    { time: '16:00', humidity: 58 },
    { time: '18:00', humidity: 62 },
    { time: '20:00', humidity: 68 },
    { time: '22:00', humidity: 72 },
  ];

  // Soil Moisture data (24 hours)
  const soilMoistureData = [
    { time: '00:00', moisture: 42 },
    { time: '02:00', moisture: 41 },
    { time: '04:00', moisture: 40 },
    { time: '06:00', moisture: 39 },
    { time: '08:00', moisture: 38 },
    { time: '10:00', moisture: 37 },
    { time: '12:00', moisture: 36 },
    { time: '14:00', moisture: 35 },
    { time: '16:00', moisture: 40 },
    { time: '18:00', moisture: 42 },
    { time: '20:00', moisture: 43 },
    { time: '22:00', moisture: 42 },
  ];

  // NPK data (weekly trend)
  const npkData = [
    { day: 'Mon', N: 45, P: 32, K: 68 },
    { day: 'Tue', N: 46, P: 33, K: 67 },
    { day: 'Wed', N: 44, P: 31, K: 69 },
    { day: 'Thu', N: 45, P: 32, K: 68 },
    { day: 'Fri', N: 47, P: 34, K: 70 },
    { day: 'Sat', N: 45, P: 32, K: 68 },
    { day: 'Sun', N: 46, P: 33, K: 69 },
  ];

  // Gauge component
  const GaugeCircle = ({ value, max, label, unit, color }: { value: number; max: number; label: string; unit: string; color: string }) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="text-center">
        <svg width="120" height="120" className="mx-auto mb-3">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#e0e0e0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="bold" fill={color}>
            {value}
          </text>
          <text x="60" y="80" textAnchor="middle" fontSize="12" fill="#666">
            {unit}
          </text>
        </svg>
        <div className="fw-bold">{label}</div>
        <small className="text-muted">Max: {max}{unit}</small>
      </div>
    );
  };

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
                    <i className="fas fa-microchip text-success me-2"></i>
                    {deviceInfo.deviceName}
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {deviceInfo.plotName} • {deviceInfo.location}
                  </p>
                </div>
                <div>
                  <button className="btn btn-secondary me-2" onClick={() => navigate('/device-setup')}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  <span className="badge bg-success px-3 py-2" style={{ fontSize: '14px' }}>
                    <i className="fas fa-circle me-1" style={{ fontSize: '8px' }}></i>
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {/* LEFT SIDE - Gauges and Value Boxes */}
            <div className="col-lg-5">
              {/* Soil Gauges */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-gauge me-2"></i>
                    Soil Sensors
                  </h6>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <GaugeCircle value={42} max={100} label="Soil Moisture" unit="%" color="#0d6efd" />
                    </div>
                    <div className="col-6">
                      <GaugeCircle value={28.5} max={50} label="Soil Temperature" unit="°C" color="#dc3545" />
                    </div>
                  </div>
                </div>
              </div>

              {/* NPK Values */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-success text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-flask me-2"></i>
                    NPK Nutrients
                  </h6>
                </div>
                <div className="card-body p-3">
                  <div className="row g-2">
                    <div className="col-4">
                      <div className="text-center p-3 bg-light rounded">
                        <i className="fas fa-n text-primary mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small text-muted">Nitrogen (N)</div>
                        <h4 className="mb-0 text-primary">45</h4>
                        <small className="text-muted">ppm</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center p-3 bg-light rounded">
                        <i className="fas fa-p text-warning mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small text-muted">Phosphorus (P)</div>
                        <h4 className="mb-0 text-warning">32</h4>
                        <small className="text-muted">ppm</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center p-3 bg-light rounded">
                        <i className="fas fa-k text-danger mb-2" style={{ fontSize: '24px' }}></i>
                        <div className="small text-muted">Potassium (K)</div>
                        <h4 className="mb-0 text-danger">68</h4>
                        <small className="text-muted">ppm</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* pH and Conductivity */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-flask-vial me-2"></i>
                    Soil Properties
                  </h6>
                </div>
                <div className="card-body p-3">
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <i className="fas fa-vial text-info mb-2" style={{ fontSize: '32px' }}></i>
                        <div className="small text-muted">pH Level</div>
                        <h3 className="mb-0 text-info">6.8</h3>
                        <small className="text-success">
                          <i className="fas fa-check-circle"></i> Optimal
                        </small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <i className="fas fa-bolt text-warning mb-2" style={{ fontSize: '32px' }}></i>
                        <div className="small text-muted">EC (Conductivity)</div>
                        <h3 className="mb-0 text-warning">1.2</h3>
                        <small className="text-muted">mS/cm</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Moisture Status */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-dark text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-droplet me-2"></i>
                    Overall Moisture Status
                  </h6>
                </div>
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <i className="fas fa-tint text-primary" style={{ fontSize: '64px' }}></i>
                  </div>
                  <h2 className="text-primary mb-2">65%</h2>
                  <div className="progress mb-3" style={{ height: '25px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: '65%' }}
                      aria-valuenow={65}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      65%
                    </div>
                  </div>
                  <span className="badge bg-success px-3 py-2">
                    <i className="fas fa-check-circle me-1"></i>
                    Good Condition
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Graphs */}
            <div className="col-lg-7">
              {/* Temperature Graph */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-line me-2 text-danger"></i>
                    Temperature Trend (24 Hours)
                  </h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temp" stroke="#dc3545" strokeWidth={2} name="Temperature (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Humidity Graph */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-area me-2 text-info"></i>
                    Humidity Trend (24 Hours)
                  </h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={humidityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="humidity" stroke="#0dcaf0" fill="#0dcaf0" fillOpacity={0.6} name="Humidity (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Soil Moisture Graph */}
              <div className="card mb-3 border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-bar me-2 text-primary"></i>
                    Soil Moisture Trend (24 Hours)
                  </h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={soilMoistureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="moisture" fill="#0d6efd" name="Soil Moisture (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* NPK Levels Graph */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-column me-2 text-success"></i>
                    NPK Levels (Weekly Trend)
                  </h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={npkData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="N" fill="#0d6efd" name="Nitrogen (N)" />
                      <Bar dataKey="P" fill="#ffc107" name="Phosphorus (P)" />
                      <Bar dataKey="K" fill="#dc3545" name="Potassium (K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-primary" onClick={() => navigate('/crop-analysis', { state: deviceInfo })}>
                  <i className="fas fa-chart-pie me-2"></i>
                  Analyze Crop Condition
                </button>
                <button className="btn btn-outline-primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>
                  Print Report
                </button>
                <button className="btn btn-success" onClick={() => alert('Export functionality')}>
                  <i className="fas fa-download me-2"></i>
                  Export Data
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

export default DeviceData;
