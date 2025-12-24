import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface KYCRecord {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    mobileNumber: string;
    farmerId: string;
  };
  identityDetails: {
    aadhaarNumber: string;
    panNumber?: string;
  };
  contactDetails: {
    email: string;
    alternatePhone?: string;
  };
  addressDetails: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  farmPlots: Array<{
    plotName: string;
    area: number;
    areaUnit: string;
    soilType: string;
    waterSource: string;
  }>;
  status: string;
  submittedAt: string;
  verifiedAt?: string;
  remarks?: string;
}

const AdminKYC: React.FC = () => {
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKYC, setSelectedKYC] = useState<KYCRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingKYC();
      setKycRecords(response.data.kycRecords || []);
    } catch (error) {
      console.error('Error fetching KYC records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!selectedKYC) return;

    try {
      setVerifyLoading(true);
      await adminAPI.verifyKYC(selectedKYC._id, {
        status,
        remarks: remarks || undefined,
      });
      setShowModal(false);
      setSelectedKYC(null);
      setRemarks('');
      fetchPendingKYC();
    } catch (error) {
      console.error('Error verifying KYC:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const openVerifyModal = (kyc: KYCRecord) => {
    setSelectedKYC(kyc);
    setRemarks('');
    setShowModal(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">KYC Verification</h4>
          <p className="text-muted mb-0">Review and verify farmer KYC applications</p>
        </div>
        <button className="btn btn-success" onClick={fetchPendingKYC}>
          <i className="fas fa-sync-alt me-2"></i>Refresh
        </button>
      </div>

      {/* KYC Cards */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : kycRecords.length > 0 ? (
        <div className="row g-4">
          {kycRecords.map((kyc) => (
            <div key={kyc._id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#f59e0b20',
                        color: '#f59e0b',
                      }}
                    >
                      <i className="fas fa-id-card"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{kyc.userId?.fullName || 'Unknown'}</h6>
                      <small className="text-muted">{kyc.userId?.farmerId || 'No Farmer ID'}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Mobile:</span>
                      <span className="fw-semibold small">{kyc.userId?.mobileNumber}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Aadhaar:</span>
                      <span className="fw-semibold small">
                        XXXX-XXXX-{kyc.identityDetails?.aadhaarNumber?.slice(-4) || 'XXXX'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">State:</span>
                      <span className="fw-semibold small">{kyc.addressDetails?.state || '-'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Farm Plots:</span>
                      <span className="fw-semibold small">{kyc.farmPlots?.length || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Submitted:</span>
                      <span className="fw-semibold small">
                        {new Date(kyc.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary flex-fill btn-sm"
                      onClick={() => openVerifyModal(kyc)}
                    >
                      <i className="fas fa-eye me-1"></i>Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body text-center py-5">
            <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
            <h5 className="fw-bold">All Caught Up!</h5>
            <p className="text-muted mb-0">No pending KYC applications to review.</p>
          </div>
        </div>
      )}

      {/* KYC Review Modal */}
      {showModal && selectedKYC && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">KYC Review</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* User Info */}
                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#10b98120',
                        color: '#10b981',
                      }}
                    >
                      <i className="fas fa-user fa-lg"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{selectedKYC.userId?.fullName}</h5>
                      <p className="text-muted mb-0">
                        {selectedKYC.userId?.farmerId} | {selectedKYC.userId?.mobileNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Identity Details */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-id-badge me-2 text-primary"></i>Identity Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Aadhaar Number</label>
                      <p className="fw-semibold mb-0">{selectedKYC.identityDetails?.aadhaarNumber}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">PAN Number</label>
                      <p className="fw-semibold mb-0">{selectedKYC.identityDetails?.panNumber || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-phone me-2 text-success"></i>Contact Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Email</label>
                      <p className="fw-semibold mb-0">{selectedKYC.contactDetails?.email}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Alternate Phone</label>
                      <p className="fw-semibold mb-0">{selectedKYC.contactDetails?.alternatePhone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>Address Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small">State</label>
                      <p className="fw-semibold mb-0">{selectedKYC.addressDetails?.state}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">District</label>
                      <p className="fw-semibold mb-0">{selectedKYC.addressDetails?.district}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Village</label>
                      <p className="fw-semibold mb-0">{selectedKYC.addressDetails?.village}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Pincode</label>
                      <p className="fw-semibold mb-0">{selectedKYC.addressDetails?.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Farm Plots */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-seedling me-2 text-warning"></i>Farm Plots ({selectedKYC.farmPlots?.length || 0})
                  </h6>
                  {selectedKYC.farmPlots?.map((plot, index) => (
                    <div key={index} className="bg-light rounded-3 p-3 mb-2">
                      <div className="row g-2">
                        <div className="col-md-4">
                          <label className="text-muted small">Plot Name</label>
                          <p className="fw-semibold mb-0">{plot.plotName}</p>
                        </div>
                        <div className="col-md-2">
                          <label className="text-muted small">Area</label>
                          <p className="fw-semibold mb-0">{plot.area} {plot.areaUnit}</p>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small">Soil Type</label>
                          <p className="fw-semibold mb-0">{plot.soilType}</p>
                        </div>
                        <div className="col-md-3">
                          <label className="text-muted small">Water Source</label>
                          <p className="fw-semibold mb-0">{plot.waterSource}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remarks */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Remarks (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Add any remarks for the farmer..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={verifyLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleVerify('rejected')}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="fas fa-times me-2"></i>
                  )}
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleVerify('verified')}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="fas fa-check me-2"></i>
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYC;
