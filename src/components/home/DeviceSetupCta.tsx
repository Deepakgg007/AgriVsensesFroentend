import { Link } from 'react-router-dom';

export default function DeviceSetupCta() {
  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="text-white">
              <div className="mb-3">
                <span className="badge bg-white text-primary px-3 py-2 rounded-pill mb-3">
                  <i className="fas fa-microchip me-2"></i>
                  Smart Farming
                </span>
              </div>
              <h2 className="text-white mb-3 fw-bold">Setup Your Smart Device Today!</h2>
              <p className="text-white opacity-75 mb-4 fs-5">
                Connect your IoT sensors and start monitoring your farm in real-time.
                Get instant alerts, track soil moisture, temperature, and optimize your crop yield.
              </p>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="d-flex align-items-center text-white">
                  <i className="fas fa-check-circle me-2 fs-5"></i>
                  <span>Easy QR Setup</span>
                </div>
                <div className="d-flex align-items-center text-white">
                  <i className="fas fa-check-circle me-2 fs-5"></i>
                  <span>Real-time Monitoring</span>
                </div>
                <div className="d-flex align-items-center text-white">
                  <i className="fas fa-check-circle me-2 fs-5"></i>
                  <span>Smart Alerts</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <Link
              to="/device-setup"
              className="btn btn-light btn-lg px-5 py-3 shadow-lg"
              style={{
                borderRadius: '50px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-qrcode me-2"></i>
              Setup Device Now
            </Link>
            <div className="mt-3">
              <small className="text-white opacity-75">
                <i className="fas fa-clock me-1"></i>
                Takes only 2 minutes
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
