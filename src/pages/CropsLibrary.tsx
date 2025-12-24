import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';

interface Crop {
  id: string;
  name: string;
  icon: string;
  category: string;
  season: string;
  duration: string;
  description: string;
}

const cropsData: Crop[] = [
  {
    id: 'rice',
    name: 'Rice',
    icon: '🌾',
    category: 'Cereal',
    season: 'Kharif/Rabi',
    duration: '120-150 days',
    description: 'Major staple food crop grown in wetland conditions',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    category: 'Cereal',
    season: 'Rabi',
    duration: '110-130 days',
    description: 'Important cereal crop for bread and flour production',
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '🌸',
    category: 'Fiber',
    season: 'Kharif',
    duration: '150-180 days',
    description: 'Major fiber crop known as White Gold',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    category: 'Vegetable',
    season: 'Year-round',
    duration: '90-120 days',
    description: 'Popular vegetable crop rich in vitamins',
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: '🌽',
    category: 'Cereal',
    season: 'Kharif',
    duration: '90-120 days',
    description: 'Versatile cereal crop for food and feed',
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    category: 'Cash Crop',
    season: 'Year-round',
    duration: '10-12 months',
    description: 'Major source of sugar and jaggery production',
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    category: 'Vegetable',
    season: 'Rabi',
    duration: '90-120 days',
    description: 'Important tuber crop with high nutritional value',
  },
  {
    id: 'onion',
    name: 'Onion',
    icon: '🧅',
    category: 'Vegetable',
    season: 'Rabi/Kharif',
    duration: '120-150 days',
    description: 'Essential vegetable crop used in cooking',
  },
];

export default function CropsLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cereal', 'Vegetable', 'Fiber', 'Cash Crop'];

  const filteredCrops = cropsData.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Wrapper>
      <HeaderTwo />

      <section style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#f0f4f8' }}>
        <div className="container">
          {/* Page Header */}
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h1 className="fw-bold mb-3" style={{ color: '#1f4e3d' }}>
                <i className="fa-solid fa-book-open me-3"></i>
                Crops Knowledge Library
              </h1>
              <p className="lead text-muted">
                Comprehensive information about crops, cultivation practices, pest & disease management
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="input-group">
                        <span
                          className="input-group-text bg-white border-end-0"
                          style={{ borderRadius: '12px 0 0 12px' }}
                        >
                          <i className="fa-solid fa-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search crops..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: '0 12px 12px 0' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-2 flex-wrap">
                        {categories.map((category) => (
                          <button
                            key={category}
                            className={`btn ${
                              selectedCategory === category ? 'btn-success' : 'btn-outline-success'
                            }`}
                            onClick={() => setSelectedCategory(category)}
                            style={{ borderRadius: '25px' }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crops Grid */}
          <div className="row">
            {filteredCrops.length > 0 ? (
              filteredCrops.map((crop) => (
                <div key={crop.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <Link to={`/crops/${crop.id}`} className="text-decoration-none">
                    <div
                      className="card border-0 shadow-sm h-100 crop-card"
                      style={{
                        borderRadius: '15px',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                      }}
                    >
                      <div
                        className="card-header text-center py-4"
                        style={{
                          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                          borderRadius: '15px 15px 0 0',
                          border: 'none',
                        }}
                      >
                        <div style={{ fontSize: '64px' }}>{crop.icon}</div>
                      </div>
                      <div className="card-body p-3">
                        <h5 className="fw-bold mb-2" style={{ color: '#1f4e3d' }}>
                          {crop.name}
                        </h5>
                        <div className="mb-2">
                          <span className="badge bg-success-subtle text-success me-2">
                            {crop.category}
                          </span>
                        </div>
                        <p className="text-muted small mb-3">{crop.description}</p>
                        <div className="d-flex justify-content-between text-muted small">
                          <div>
                            <i className="fa-solid fa-calendar me-1 text-success"></i>
                            {crop.season}
                          </div>
                          <div>
                            <i className="fa-solid fa-clock me-1 text-success"></i>
                            {crop.duration}
                          </div>
                        </div>
                      </div>
                      <div className="card-footer bg-white border-0 p-3" style={{ borderRadius: '0 0 15px 15px' }}>
                        <div className="d-grid">
                          <button className="btn btn-success btn-sm" style={{ borderRadius: '10px' }}>
                            View Details
                            <i className="fa-solid fa-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="card-body text-center py-5">
                    <i
                      className="fa-solid fa-search mb-3"
                      style={{ fontSize: '48px', color: '#10b981' }}
                    ></i>
                    <h5 className="fw-semibold mb-2">No Crops Found</h5>
                    <p className="text-muted">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="row mt-5">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm text-white"
                style={{
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #1f4e3d 0%, #2d7a5e 50%, #3ea876 100%)',
                }}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4 className="fw-bold mb-2">
                        <i className="fa-solid fa-circle-info me-2"></i>
                        Can't Find Your Crop?
                      </h4>
                      <p className="mb-0 opacity-75">
                        We're constantly adding more crops to our library. Request information about a specific crop and our experts will add it soon.
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <button className="btn btn-light btn-lg" style={{ borderRadius: '25px' }}>
                        <i className="fa-solid fa-plus-circle me-2"></i>
                        Request Crop Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </Wrapper>
  );
}
