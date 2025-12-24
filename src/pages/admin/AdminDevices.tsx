import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { QRCodeSVG } from 'qrcode.react';

interface Device {
  _id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  isActive: boolean;
  is_claimed: boolean;
  claimed_by?: {
    fullName: string;
    farmerId: string;
    mobileNumber: string;
  };
  claimed_at?: string;
  createdAt: string;
}

const AdminDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceName: '',
    deviceType: 'ESP32',
  });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrDevice, setQrDevice] = useState<Device | null>(null);

  const deviceTypes = ['ESP32', 'ESP8266', 'Arduino', 'Raspberry Pi', 'Other'];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDevices();
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setSaving(true);
      const response = await adminAPI.registerDevice(formData);
      const registeredDevice = response.data.device;
      setShowModal(false);
      setFormData({ deviceId: '', deviceName: '', deviceType: 'ESP32' });
      fetchDevices();

      // Show QR code modal after successful registration
      setQrDevice(registeredDevice);
      setShowQRModal(true);
    } catch (error: any) {
      console.error('Error registering device:', error);
      if (error.response?.data?.error?.type === 'DUPLICATE_DEVICE') {
        const { message, error: errorDetails } = error.response.data;
        const { details, suggestion } = errorDetails;
        setErrorMessage(
          `${message}\n\nDevice Name: ${details.deviceName}\nRegistered By: ${details.registeredBy}\nRegistered On: ${new Date(details.registeredOn).toLocaleString()}\n\n${suggestion}`
        );
      } else {
        setErrorMessage(error.response?.data?.message || 'Failed to register device. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (isClaimed: boolean, isActive: boolean) => {
    if (!isActive) return 'bg-danger';
    if (isClaimed) return 'bg-info';
    return 'bg-warning';
  };

  const getStatusText = (isClaimed: boolean, isActive: boolean) => {
    if (!isActive) return 'Inactive';
    if (isClaimed) return 'Claimed';
    return 'Unclaimed';
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      deviceId: device.device_id,
      deviceName: device.device_name,
      deviceType: device.device_type,
    });
    setErrorMessage('');
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;

    setErrorMessage('');
    try {
      setSaving(true);
      await adminAPI.updateDevice(editingDevice._id, {
        device_name: formData.deviceName,
        device_type: formData.deviceType,
      });
      setShowModal(false);
      setEditingDevice(null);
      setFormData({ deviceId: '', deviceName: '', deviceType: 'ESP32' });
      fetchDevices();
    } catch (error: any) {
      console.error('Error updating device:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update device. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (device: Device) => {
    setDeviceToDelete(device);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deviceToDelete) return;

    try {
      setDeleting(true);
      await adminAPI.deleteDevice(deviceToDelete._id);
      setShowDeleteModal(false);
      setDeviceToDelete(null);
      fetchDevices();
    } catch (error: any) {
      console.error('Error deleting device:', error);
      alert(error.response?.data?.message || 'Failed to delete device. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingDevice(null);
    setFormData({ deviceId: '', deviceName: '', deviceType: 'ESP32' });
    setErrorMessage('');
  };

  const handleShowQR = (device: Device) => {
    setQrDevice(device);
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    if (!qrDevice) return;
    const svg = document.getElementById('device-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${qrDevice.device_id}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Device Management</h4>
          <p className="text-muted mb-0">Register and manage IoT devices</p>
        </div>
        <button className="btn btn-success" onClick={() => {
          setShowModal(true);
          setErrorMessage('');
        }}>
          <i className="fas fa-plus me-2"></i>Register Device
        </button>
      </div>

      {/* Devices Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">Device</th>
                    <th className="border-0 py-3">Device ID</th>
                    <th className="border-0 py-3">Type</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Assigned To</th>
                    <th className="border-0 py-3">Last Seen</th>
                    <th className="border-0 py-3">Registered</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <tr key={device._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: '#8b5cf620',
                                color: '#8b5cf6',
                              }}
                            >
                              <i className="fas fa-microchip"></i>
                            </div>
                            <span className="fw-semibold">{device.device_name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <code className="bg-light px-2 py-1 rounded">{device.device_id}</code>
                        </td>
                        <td className="py-3">{device.device_type}</td>
                        <td className="py-3">
                          <span className={`badge ${getStatusBadge(device.is_claimed, device.isActive)}`}>
                            {getStatusText(device.is_claimed, device.isActive)}
                          </span>
                        </td>
                        <td className="py-3">
                          {device.claimed_by ? (
                            <span>
                              {device.claimed_by.fullName}
                              <br />
                              <small className="text-muted">{device.claimed_by.farmerId}</small>
                            </span>
                          ) : (
                            <span className="text-muted">Not claimed</span>
                          )}
                        </td>
                        <td className="py-3 text-muted">
                          {device.claimed_at
                            ? new Date(device.claimed_at).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(device.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => handleShowQR(device)}
                            title="View QR Code"
                          >
                            <i className="fas fa-qrcode"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(device)}
                            title="Edit device"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(device)}
                            title="Delete device"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-5 text-muted">
                        <i className="fas fa-microchip fa-3x mb-3 d-block"></i>
                        No devices registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Register/Edit Device Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editingDevice ? 'Edit Device' : 'Register New Device'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <form onSubmit={editingDevice ? handleUpdate : handleSubmit}>
                <div className="modal-body">
                  {errorMessage && (
                    <div className="alert alert-danger d-flex align-items-start" role="alert">
                      <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
                      <div style={{ whiteSpace: 'pre-line' }}>{errorMessage}</div>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Device ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.deviceId}
                      onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                      required
                      placeholder="Enter unique device ID"
                      disabled={!!editingDevice}
                    />
                    {editingDevice && (
                      <small className="text-muted">Device ID cannot be changed</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Device Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.deviceName}
                      onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                      required
                      placeholder="Enter device name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Device Type</label>
                    <select
                      className="form-select"
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    >
                      {deviceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleModalClose}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {editingDevice ? 'Updating...' : 'Registering...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${editingDevice ? 'fa-save' : 'fa-plus'} me-2`}></i>
                        {editingDevice ? 'Update Device' : 'Register Device'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deviceToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Confirm Delete
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Are you sure you want to delete this device?</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1"><strong>Device Name:</strong> {deviceToDelete.device_name}</p>
                  <p className="mb-1"><strong>Device ID:</strong> {deviceToDelete.device_id}</p>
                  <p className="mb-0"><strong>Device Type:</strong> {deviceToDelete.device_type}</p>
                </div>
                <div className="alert alert-warning mt-3 mb-0">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  This action cannot be undone!
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-2"></i>
                      Delete Device
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrDevice && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-qrcode me-2 text-success"></i>
                  Device QR Code
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowQRModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="alert alert-success mb-4">
                  <i className="fas fa-check-circle me-2"></i>
                  Device registered successfully!
                </div>

                <div className="bg-light p-4 rounded mb-4">
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">{qrDevice.device_name}</h6>
                    <code className="bg-white px-3 py-2 rounded d-inline-block">
                      {qrDevice.device_id}
                    </code>
                  </div>

                  <div className="d-flex justify-content-center mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <QRCodeSVG
                        id="device-qr-code"
                        value={qrDevice.device_id}
                        size={200}
                        level="H"
                        marginSize={4}
                      />
                    </div>
                  </div>

                  <p className="text-muted small mb-0">
                    Scan this QR code to claim the device
                  </p>
                </div>

                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <small>
                    Farmers can scan this QR code from their mobile app to claim and configure this device.
                  </small>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowQRModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleDownloadQR}
                >
                  <i className="fas fa-download me-2"></i>
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDevices;
