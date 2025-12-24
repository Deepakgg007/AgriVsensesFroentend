import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface MasterDataItem {
  _id: string;
  type: string;
  name: string;
  code?: string;
  isActive: boolean;
  createdAt: string;
}

const AdminMasterData: React.FC = () => {
  const [masterData, setMasterData] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('state');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({ type: 'state', name: '', code: '' });
  const [saving, setSaving] = useState(false);

  const dataTypes = [
    { value: 'state', label: 'States', icon: 'fas fa-map-marker-alt' },
    { value: 'soil_type', label: 'Soil Types', icon: 'fas fa-mountain' },
    { value: 'water_source', label: 'Water Sources', icon: 'fas fa-tint' },
    { value: 'irrigation_method', label: 'Irrigation Methods', icon: 'fas fa-water' },
    { value: 'farming_practice', label: 'Farming Practices', icon: 'fas fa-tractor' },
    { value: 'season', label: 'Seasons', icon: 'fas fa-sun' },
    { value: 'problem', label: 'Problems', icon: 'fas fa-bug' },
    { value: 'language', label: 'Languages', icon: 'fas fa-language' },
  ];

  useEffect(() => {
    fetchMasterData();
  }, [selectedType]);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMasterData({ type: selectedType });
      setMasterData(response.data.masterData || []);
    } catch (error) {
      console.error('Error fetching master data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ type: selectedType, name: '', code: '' });
    setShowModal(true);
  };

  const openEditModal = (item: MasterDataItem) => {
    setEditingItem(item);
    setFormData({ type: item.type, name: item.name, code: item.code || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await adminAPI.updateMasterData(editingItem._id, {
          name: formData.name,
        });
      } else {
        await adminAPI.createMasterData({
          type: formData.type,
          name: formData.name,
          code: formData.code || undefined,
        });
      }
      setShowModal(false);
      fetchMasterData();
    } catch (error) {
      console.error('Error saving master data:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteMasterData(id);
        fetchMasterData();
      } catch (error) {
        console.error('Error deleting master data:', error);
      }
    }
  };

  const handleToggleStatus = async (item: MasterDataItem) => {
    try {
      await adminAPI.updateMasterData(item._id, { isActive: !item.isActive });
      fetchMasterData();
    } catch (error) {
      console.error('Error updating status:', error);
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
                        <th className="border-0 py-3">Code</th>
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
                              {item.code ? (
                                <code className="bg-light px-2 py-1 rounded">{item.code}</code>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
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
                          <td colSpan={5} className="text-center py-5 text-muted">
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
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter name"
                    />
                  </div>
                  {!editingItem && (
                    <div className="mb-3">
                      <label className="form-label">Code (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="Enter code (e.g., KA for Karnataka)"
                      />
                    </div>
                  )}
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
