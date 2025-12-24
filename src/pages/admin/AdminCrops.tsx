import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface Crop {
  _id: string;
  cropId: string;
  cropName: string;
  icon: string;
  category: string;
  season: string[];
  duration: string;
  description: string;
  details?: {
    scientificName?: string;
    climate?: {
      temperature?: string;
      rainfall?: string;
      humidity?: string;
    };
    soil?: string[];
    cultivation?: {
      seedRate?: string;
      spacing?: string;
      depth?: string;
    };
  };
  isActive: boolean;
}

const AdminCrops: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState({
    cropId: '',
    cropName: '',
    icon: '',
    category: 'Cereal',
    season: [] as string[],
    duration: '',
    description: '',
    scientificName: '',
    temperature: '',
    rainfall: '',
    humidity: '',
    soil: [] as string[],
    seedRate: '',
    spacing: '',
    depth: '',
  });
  const [saving, setSaving] = useState(false);

  const categories = ['Cereal', 'Vegetable', 'Fruit', 'Cash Crop', 'Oilseed', 'Fiber', 'Spice', 'Pulse'];
  const seasons = ['Kharif', 'Rabi', 'Summer', 'Perennial'];
  const soilTypes = ['Clay', 'Loamy', 'Sandy', 'Black', 'Red', 'Alluvial'];

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCrops();
      setCrops(response.data.crops || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCrop(null);
    setFormData({
      cropId: '',
      cropName: '',
      icon: '',
      category: 'Cereal',
      season: [],
      duration: '',
      description: '',
      scientificName: '',
      temperature: '',
      rainfall: '',
      humidity: '',
      soil: [],
      seedRate: '',
      spacing: '',
      depth: '',
    });
    setShowModal(true);
  };

  const openEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      cropId: crop.cropId,
      cropName: crop.cropName,
      icon: crop.icon,
      category: crop.category,
      season: crop.season,
      duration: crop.duration,
      description: crop.description,
      scientificName: crop.details?.scientificName || '',
      temperature: crop.details?.climate?.temperature || '',
      rainfall: crop.details?.climate?.rainfall || '',
      humidity: crop.details?.climate?.humidity || '',
      soil: crop.details?.soil || [],
      seedRate: crop.details?.cultivation?.seedRate || '',
      spacing: crop.details?.cultivation?.spacing || '',
      depth: crop.details?.cultivation?.depth || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cropData = {
        cropId: formData.cropId,
        cropName: formData.cropName,
        icon: formData.icon,
        category: formData.category,
        season: formData.season,
        duration: formData.duration,
        description: formData.description,
        details: {
          scientificName: formData.scientificName,
          climate: {
            temperature: formData.temperature,
            rainfall: formData.rainfall,
            humidity: formData.humidity,
          },
          soil: formData.soil,
          cultivation: {
            seedRate: formData.seedRate,
            spacing: formData.spacing,
            depth: formData.depth,
          },
        },
      };

      if (editingCrop) {
        await adminAPI.updateCrop(editingCrop.cropId, cropData);
      } else {
        await adminAPI.createCrop(cropData);
      }

      setShowModal(false);
      fetchCrops();
    } catch (error) {
      console.error('Error saving crop:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cropId: string) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await adminAPI.deleteCrop(cropId);
        fetchCrops();
      } catch (error) {
        console.error('Error deleting crop:', error);
      }
    }
  };

  const toggleSeason = (season: string) => {
    setFormData((prev) => ({
      ...prev,
      season: prev.season.includes(season)
        ? prev.season.filter((s) => s !== season)
        : [...prev.season, season],
    }));
  };

  const toggleSoil = (soil: string) => {
    setFormData((prev) => ({
      ...prev,
      soil: prev.soil.includes(soil)
        ? prev.soil.filter((s) => s !== soil)
        : [...prev.soil, soil],
    }));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Crops Library</h4>
          <p className="text-muted mb-0">Manage crop information and details</p>
        </div>
        <button className="btn btn-success" onClick={openAddModal}>
          <i className="fas fa-plus me-2"></i>Add Crop
        </button>
      </div>

      {/* Crops Grid */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#10b98120',
                        color: '#10b981',
                      }}
                    >
                      <i className="fas fa-seedling fa-lg"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{crop.cropName}</h6>
                      <small className="text-muted">{crop.cropId}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="badge bg-primary me-1">{crop.category}</span>
                    {crop.season.map((s) => (
                      <span key={s} className="badge bg-info me-1">{s}</span>
                    ))}
                  </div>

                  <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                    {crop.description?.substring(0, 80)}
                    {crop.description?.length > 80 ? '...' : ''}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>{crop.duration}
                    </small>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => openEditModal(crop)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(crop.cropId)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {crops.length === 0 && (
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body text-center py-5">
                  <i className="fas fa-seedling fa-4x text-muted mb-3"></i>
                  <h5 className="fw-bold">No Crops Found</h5>
                  <p className="text-muted mb-3">Start by adding crops to your library.</p>
                  <button className="btn btn-success" onClick={openAddModal}>
                    <i className="fas fa-plus me-2"></i>Add First Crop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Basic Info */}
                  <h6 className="fw-bold mb-3">Basic Information</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Crop ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cropId}
                        onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                        required
                        disabled={!!editingCrop}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Crop Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 120-150 days"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Season</label>
                      <div className="d-flex flex-wrap gap-2">
                        {seasons.map((season) => (
                          <button
                            key={season}
                            type="button"
                            className={`btn btn-sm ${
                              formData.season.includes(season) ? 'btn-success' : 'btn-outline-secondary'
                            }`}
                            onClick={() => toggleSeason(season)}
                          >
                            {season}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  {/* Climate Info */}
                  <h6 className="fw-bold mb-3">Climate Requirements</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label">Temperature</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 20-35°C"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Rainfall</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 1000-2000 mm"
                        value={formData.rainfall}
                        onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Humidity</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 60-80%"
                        value={formData.humidity}
                        onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Suitable Soil Types</label>
                      <div className="d-flex flex-wrap gap-2">
                        {soilTypes.map((soil) => (
                          <button
                            key={soil}
                            type="button"
                            className={`btn btn-sm ${
                              formData.soil.includes(soil) ? 'btn-success' : 'btn-outline-secondary'
                            }`}
                            onClick={() => toggleSoil(soil)}
                          >
                            {soil}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cultivation Info */}
                  <h6 className="fw-bold mb-3">Cultivation Details</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Seed Rate</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 40-50 kg/ha"
                        value={formData.seedRate}
                        onChange={(e) => setFormData({ ...formData, seedRate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Spacing</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 20x15 cm"
                        value={formData.spacing}
                        onChange={(e) => setFormData({ ...formData, spacing: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Sowing Depth</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 2-3 cm"
                        value={formData.depth}
                        onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                      />
                    </div>
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
                        {editingCrop ? 'Update Crop' : 'Add Crop'}
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

export default AdminCrops;
