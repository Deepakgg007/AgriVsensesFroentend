import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface MasterDataItem {
  _id: string;
  type: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

const AdminMasterData: React.FC = () => {
  const [masterData, setMasterData] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('state');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({ type: 'state', name: '' });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dataTypes = [
    { value: 'state', label: 'States', icon: 'fas fa-map-marker-alt' },
    { value: 'soil_type', label: 'Soil Types', icon: 'fas fa-mountain' },
    { value: 'water_source', label: 'Water Sources', icon: 'fas fa-tint' },
    { value: 'irrigation_method', label: 'Irrigation Methods', icon: 'fas fa-water' },
    { value: 'farming_practice', label: 'Farming Practices', icon: 'fas fa-tractor' },
    { value: 'season', label: 'Seasons', icon: 'fas fa-sun' },
    { value: 'problem', label: 'Problems', icon: 'fas fa-bug' },
    { value: 'language', label: 'Languages', icon: 'fas fa-language' },
    { value: 'ownership_type', label: 'Ownership Types', icon: 'fas fa-file-contract' },
    { value: 'communication_channel', label: 'Communication Channels', icon: 'fas fa-comments' },
    { value: 'gender', label: 'Genders', icon: 'fas fa-venus-mars' },
    { value: 'crop_category', label: 'Crop Categories', icon: 'fas fa-seedling' },
  ];

  useEffect(() => {
    fetchMasterData();
  }, [selectedType]);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMasterData({ type: selectedType });
      setMasterData(response.data.masterData || []);
    } catch (error: any) {
      console.error('Error fetching master data:', error);
      alert(error.response?.data?.message || 'Failed to fetch master data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ type: selectedType, name: '' });
    setErrorMessage('');
    setShowModal(true);
  };

  const openEditModal = (item: MasterDataItem) => {
    setEditingItem(item);
    setFormData({ type: item.type, name: item.name });
    setErrorMessage('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingItem) {
        console.log('Updating master data:', editingItem._id, { name: formData.name });
        const response = await adminAPI.updateMasterData(editingItem._id, {
          name: formData.name,
        });
        console.log('Update response:', response);
        alert('Master data updated successfully!');
      } else {
        const payload = {
          type: formData.type,
          name: formData.name,
        };
        console.log('Creating master data:', payload);
        const response = await adminAPI.createMasterData(payload);
        console.log('Create response:', response);
        alert('Master data added successfully!');
      }
      setShowModal(false);
      fetchMasterData();
    } catch (error: any) {
      console.error('Error saving master data:', error);
      console.error('Error details:', error.response?.data);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to save master data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteMasterData(id);
        alert('Master data deleted successfully!');
        fetchMasterData();
      } catch (error: any) {
        console.error('Error deleting master data:', error);
        alert(error.response?.data?.message || 'Failed to delete master data');
      }
    }
  };

  const handleToggleStatus = async (item: MasterDataItem) => {
    try {
      await adminAPI.updateMasterData(item._id, { isActive: !item.isActive });
      fetchMasterData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getCurrentTypeLabel = () => {
    return dataTypes.find((t) => t.value === selectedType)?.label || 'Items';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Master Data</h4>
          <p className="text-muted mb-0">Manage reference data for dropdowns and selections</p>
        </div>
        <button className="btn btn-success" onClick={openAddModal}>
          <i className="fas fa-plus me-2"></i>Add {getCurrentTypeLabel().slice(0, -1)}
        </button>
      </div>

      <div className="row">
        {/* Data Type Selector */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 py-3">
              <h6 className="fw-bold mb-0">Data Types</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {dataTypes.map((type) => (
                  <button
                    key={type.value}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      selectedType === type.value ? 'active bg-success border-success' : ''
                    }`}
                    onClick={() => setSelectedType(type.value)}
                    style={{ border: 'none' }}
                  >
                    <i className={`${type.icon} me-3`} style={{ width: '20px' }}></i>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">{getCurrentTypeLabel()}</h6>
                <span className="badge bg-secondary">{masterData.length} items</span>
              </div>
            </div>
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
                        <th className="border-0 px-4 py-3">Name</th>
                        <th className="border-0 py-3">Status</th>
                        <th className="border-0 py-3">Created</th>
                        <th className="border-0 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterData.length > 0 ? (
                        masterData.map((item) => (
                          <tr key={item._id}>
                            <td className="px-4 py-3">
                              <span className="fw-semibold">{item.name}</span>
                            </td>
                            <td className="py-3">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={item.isActive}
                                  onChange={() => handleToggleStatus(item)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            </td>
                            <td className="py-3 text-muted">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-center">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => openEditModal(item)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-5 text-muted">
                            <i className="fas fa-database fa-3x mb-3 d-block"></i>
                            No {getCurrentTypeLabel().toLowerCase()} found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editingItem ? 'Edit Item' : `Add ${getCurrentTypeLabel().slice(0, -1)}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errorMessage && (
                    <div className="alert alert-danger d-flex align-items-start" role="alert">
                      <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
                      <div>{errorMessage}</div>
                    </div>
                  )}
                  {!editingItem && (
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        disabled={!!editingItem}
                      >
                        {dataTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter name"
                      autoFocus
                    />
                    <small className="text-muted">Enter the display name for this item</small>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {editingItem ? 'Update' : 'Add'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMasterData;
