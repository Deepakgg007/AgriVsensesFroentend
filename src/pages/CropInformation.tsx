import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Wrapper from '../layouts/Wrapper';
import HeaderTwo from '../layouts/headers/HeaderTwo';
import FooterOne from '../layouts/footers/FooterOne';

interface CropData {
  name: string;
  scientificName: string;
  image: string;
  category: string;
  description: string;
  climate: {
    temperature: string;
    rainfall: string;
    humidity: string;
    season: string;
  };
  soil: {
    type: string;
    ph: string;
    preparation: string[];
  };
  cultivation: {
    seedRate: string;
    spacing: string;
    depth: string;
    method: string;
    duration: string;
  };
  irrigation: {
    frequency: string;
    method: string;
    criticalStages: string[];
  };
  fertilization: {
    basalDose: string;
    topDressing: string[];
    organic: string[];
  };
  pests: {
    name: string;
    symptoms: string;
    control: string[];
  }[];
  diseases: {
    name: string;
    symptoms: string;
    control: string[];
  }[];
  harvesting: {
    time: string;
    method: string;
    yield: string;
    storage: string;
  };
  tips: string[];
}

const cropDatabase: { [key: string]: CropData } = {
  rice: {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    image: '🌾',
    category: 'Cereal Crop',
    description: 'Rice is a staple food crop grown primarily in wetland conditions. It is one of the most important cereal crops, feeding more than half of the world\'s population.',
    climate: {
      temperature: '20-35°C (optimum 25-30°C)',
      rainfall: '100-200 cm annually',
      humidity: '50-90%',
      season: 'Kharif (June-November) and Rabi (November-April)',
    },
    soil: {
      type: 'Clay loam, Silty clay loam',
      ph: '5.5-7.0',
      preparation: [
        'Plough the field 2-3 times to puddle the soil',
        'Level the field properly for uniform water distribution',
        'Apply FYM or compost @ 10-12 tonnes/hectare',
        'Ensure proper drainage channels',
      ],
    },
    cultivation: {
      seedRate: '20-25 kg/hectare for transplanting, 60-80 kg/hectare for direct seeding',
      spacing: '20 x 15 cm for transplanting',
      depth: '2-3 cm for direct seeding',
      method: 'Transplanting or Direct Seeding',
      duration: '120-150 days depending on variety',
    },
    irrigation: {
      frequency: 'Keep 2-5 cm standing water throughout the season',
      method: 'Flooding method',
      criticalStages: [
        'Tillering stage (20-30 days after transplanting)',
        'Panicle initiation (45-55 days)',
        'Flowering stage (65-75 days)',
        'Grain filling stage (80-100 days)',
      ],
    },
    fertilization: {
      basalDose: 'N:P:K = 120:60:40 kg/hectare',
      topDressing: [
        '50% N at transplanting',
        '25% N at tillering stage',
        '25% N at panicle initiation',
      ],
      organic: [
        'Green manure crops (Dhaincha, Sunhemp)',
        'Vermicompost @ 5 tonnes/hectare',
        'Azolla as biofertilizer',
      ],
    },
    pests: [
      {
        name: 'Stem Borer',
        symptoms: 'Dead hearts in vegetative stage, white ears in reproductive stage, visible holes in stems',
        control: [
          'Use resistant varieties',
          'Remove and destroy egg masses and damaged tillers',
          'Apply Cartap Hydrochloride 4G @ 10 kg/hectare',
          'Use light traps to attract and kill moths',
          'Spray Chlorantraniliprole 18.5% SC @ 150 ml/hectare',
        ],
      },
      {
        name: 'Brown Plant Hopper (BPH)',
        symptoms: 'Yellowing and drying of plants (hopper burn), stunted growth, sooty mold on plants',
        control: [
          'Avoid excessive use of nitrogen fertilizers',
          'Maintain proper plant spacing',
          'Spray Imidacloprid 17.8% SL @ 100 ml/hectare',
          'Use neem oil @ 5 ml/liter of water',
          'Drain water from field for 2-3 days',
        ],
      },
      {
        name: 'Leaf Folder',
        symptoms: 'Longitudinal folding of leaves, white patches on leaves, reduced photosynthesis',
        control: [
          'Hand picking and destroying larvae',
          'Spray Chlorpyrifos 20% EC @ 1250 ml/hectare',
          'Use pheromone traps',
          'Apply Fipronil 5% SC @ 1000 ml/hectare',
        ],
      },
    ],
    diseases: [
      {
        name: 'Blast Disease',
        symptoms: 'Spindle-shaped lesions on leaves, neck rot, panicle blast, reduced grain filling',
        control: [
          'Use resistant varieties',
          'Treat seeds with Carbendazim @ 2g/kg of seeds',
          'Spray Tricyclazole 75% WP @ 300g/hectare',
          'Maintain proper spacing for air circulation',
          'Avoid excessive nitrogen application',
        ],
      },
      {
        name: 'Bacterial Leaf Blight',
        symptoms: 'Water-soaked lesions on leaf tips, yellowing of leaves, kresek (wilting of seedlings)',
        control: [
          'Use disease-free seeds',
          'Spray Streptocycline @ 200 ppm + Copper oxychloride @ 2.5g/liter',
          'Drain water periodically',
          'Apply balanced fertilization',
          'Remove infected plants and burn them',
        ],
      },
      {
        name: 'Sheath Blight',
        symptoms: 'Oval or elliptical greenish-gray lesions on leaf sheaths, water-soaked appearance',
        control: [
          'Spray Validamycin 3% L @ 2.5 liters/hectare',
          'Use Hexaconazole 5% EC @ 1 liter/hectare',
          'Ensure proper drainage',
          'Avoid dense planting',
        ],
      },
    ],
    harvesting: {
      time: '120-150 days after transplanting when 80% grains turn golden yellow',
      method: 'Manual harvesting with sickle or mechanical combine harvester',
      yield: '4-6 tonnes/hectare (average), up to 8-10 tonnes with good management',
      storage: 'Dry to 12-14% moisture, store in clean, dry, well-ventilated godowns',
    },
    tips: [
      'Use certified seeds of high-yielding varieties',
      'Adopt System of Rice Intensification (SRI) for better yields with less water',
      'Implement Integrated Pest Management (IPM) practices',
      'Rotate crops to break pest and disease cycles',
      'Use laser land leveling for uniform water distribution',
      'Adopt direct seeded rice (DSR) to save water and labor',
      'Monitor fields regularly for pests and diseases',
      'Harvest at proper maturity to avoid grain shattering',
    ],
  },
  wheat: {
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    image: '🌾',
    category: 'Cereal Crop',
    description: 'Wheat is a major cereal crop grown in the Rabi season. It is the second most important staple food crop after rice.',
    climate: {
      temperature: '10-25°C (optimum 20-22°C)',
      rainfall: '50-75 cm annually',
      humidity: 'Moderate (50-70%)',
      season: 'Rabi (October-March)',
    },
    soil: {
      type: 'Loamy soil, Well-drained clay loam',
      ph: '6.5-7.5',
      preparation: [
        'Deep ploughing in summer to expose soil to sunlight',
        'Apply FYM @ 10-15 tonnes/hectare before sowing',
        'Level the field properly',
        'Prepare fine seedbed with 2-3 ploughings',
      ],
    },
    cultivation: {
      seedRate: '100-125 kg/hectare',
      spacing: '20-25 cm between rows',
      depth: '4-5 cm',
      method: 'Drilling or Broadcasting',
      duration: '110-130 days',
    },
    irrigation: {
      frequency: '4-6 irrigations during crop season',
      method: 'Furrow or Sprinkler irrigation',
      criticalStages: [
        'Crown root initiation (20-25 days after sowing)',
        'Tillering stage (40-45 days)',
        'Jointing stage (60-65 days)',
        'Flowering stage (80-85 days)',
        'Milk stage (100-105 days)',
        'Dough stage (115-120 days)',
      ],
    },
    fertilization: {
      basalDose: 'N:P:K = 120:60:40 kg/hectare',
      topDressing: [
        '50% N + full P and K at sowing',
        '25% N at first irrigation (21 days)',
        '25% N at second irrigation (40 days)',
      ],
      organic: [
        'FYM @ 10-15 tonnes/hectare',
        'Vermicompost @ 5 tonnes/hectare',
        'Azotobacter as biofertilizer',
      ],
    },
    pests: [
      {
        name: 'Termite',
        symptoms: 'Damaged roots, wilting of plants, yellowing, drying of plants',
        control: [
          'Apply Chlorpyrifos 20% EC @ 2.5 liters/hectare in soil',
          'Seed treatment with Imidacloprid @ 5 ml/kg seeds',
          'Use resistant varieties',
          'Remove crop residues',
        ],
      },
      {
        name: 'Aphid',
        symptoms: 'Curling of leaves, yellowing, stunted growth, honeydew secretion',
        control: [
          'Spray Dimethoate 30% EC @ 500 ml/hectare',
          'Use yellow sticky traps',
          'Conserve natural enemies like ladybird beetles',
          'Spray neem oil @ 5 ml/liter',
        ],
      },
    ],
    diseases: [
      {
        name: 'Rust (Yellow, Brown, Black)',
        symptoms: 'Pustules on leaves and stems, yellow/brown/black colored spores',
        control: [
          'Grow resistant varieties',
          'Spray Propiconazole 25% EC @ 500 ml/hectare',
          'Early sowing to avoid favorable conditions',
          'Remove alternate hosts',
        ],
      },
      {
        name: 'Loose Smut',
        symptoms: 'Black powder mass in ear heads, entire spike converted to black spores',
        control: [
          'Seed treatment with Carboxin 37.5% + Thiram 37.5% @ 3g/kg seeds',
          'Use disease-free seeds',
          'Hot water treatment at 49°C for 1 hour',
        ],
      },
    ],
    harvesting: {
      time: '110-130 days when grains become hard and golden yellow',
      method: 'Manual or combine harvester',
      yield: '4-5 tonnes/hectare',
      storage: 'Dry to 10-12% moisture, store in moisture-proof bags',
    },
    tips: [
      'Sow at optimal time (November)',
      'Use zero-till seed drill for better establishment',
      'Apply pre-emergence herbicide for weed control',
      'Monitor for diseases regularly',
      'Harvest at physiological maturity',
    ],
  },
  cotton: {
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    image: '🌸',
    category: 'Fiber Crop',
    description: 'Cotton is a major fiber crop known as "White Gold". It is grown for its fiber and cottonseed oil.',
    climate: {
      temperature: '21-35°C',
      rainfall: '50-100 cm',
      humidity: 'Moderate',
      season: 'Kharif (May-October)',
    },
    soil: {
      type: 'Black cotton soil, Well-drained loamy soil',
      ph: '6.0-8.0',
      preparation: [
        'Deep ploughing during summer',
        'Apply FYM @ 10-15 tonnes/hectare',
        'Prepare raised beds in heavy rainfall areas',
        'Level the field properly',
      ],
    },
    cultivation: {
      seedRate: '12-15 kg/hectare',
      spacing: '60 x 30 cm or 90 x 45 cm',
      depth: '3-5 cm',
      method: 'Dibbling or Ridge and Furrow',
      duration: '150-180 days',
    },
    irrigation: {
      frequency: '6-8 irrigations',
      method: 'Drip or Furrow irrigation',
      criticalStages: [
        'Flowering stage',
        'Boll formation stage',
        'Boll development stage',
      ],
    },
    fertilization: {
      basalDose: 'N:P:K = 80:40:40 kg/hectare',
      topDressing: [
        '50% N at sowing',
        '25% N at square formation (35-40 days)',
        '25% N at flowering (60-65 days)',
      ],
      organic: [
        'FYM @ 10-15 tonnes/hectare',
        'Neem cake @ 500 kg/hectare',
        'Azospirillum and Phosphobacteria',
      ],
    },
    pests: [
      {
        name: 'Bollworm Complex',
        symptoms: 'Damaged bolls, entry holes in bolls, larvae inside bolls',
        control: [
          'Grow Bt cotton varieties',
          'Install pheromone traps @ 5/acre',
          'Spray Chlorantraniliprole 18.5% SC @ 150 ml/hectare',
          'Release egg parasitoid Trichogramma @ 50,000/hectare',
          'Apply Bacillus thuringiensis (Bt)',
        ],
      },
      {
        name: 'Aphid',
        symptoms: 'Curling of leaves, honeydew secretion, sooty mold',
        control: [
          'Spray Imidacloprid 17.8% SL @ 100 ml/hectare',
          'Use yellow sticky traps',
          'Spray neem oil @ 5 ml/liter',
        ],
      },
      {
        name: 'Whitefly',
        symptoms: 'Yellowing of leaves, honeydew, leaf curl virus',
        control: [
          'Spray Diafenthiuron 50% WP @ 1000 g/hectare',
          'Use yellow sticky traps',
          'Avoid monoculture',
          'Spray neem-based insecticides',
        ],
      },
    ],
    diseases: [
      {
        name: 'Wilt',
        symptoms: 'Yellowing and wilting of leaves, vascular browning',
        control: [
          'Grow resistant varieties',
          'Seed treatment with Carbendazim @ 2g/kg',
          'Crop rotation with cereals',
          'Soil application of Trichoderma',
        ],
      },
      {
        name: 'Leaf Spot',
        symptoms: 'Circular brown spots on leaves, defoliation',
        control: [
          'Spray Mancozeb 75% WP @ 2g/liter',
          'Remove infected leaves',
          'Maintain proper spacing',
        ],
      },
    ],
    harvesting: {
      time: '150-180 days when bolls open and fiber becomes white',
      method: 'Hand picking in 3-4 pickings',
      yield: '15-20 quintals/hectare',
      storage: 'Store in dry place, protect from moisture',
    },
    tips: [
      'Adopt High Density Planting System (HDPS)',
      'Practice intercropping with pulses',
      'Use drip irrigation for water saving',
      'Remove pink bollworms from field',
      'Pick cotton at proper maturity',
    ],
  },
  tomato: {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    image: '🍅',
    category: 'Vegetable Crop',
    description: 'Tomato is a popular vegetable crop rich in vitamins and minerals. It can be grown year-round with proper management.',
    climate: {
      temperature: '18-27°C (day), 10-20°C (night)',
      rainfall: '60-150 cm',
      humidity: '60-80%',
      season: 'Kharif, Rabi, and Summer',
    },
    soil: {
      type: 'Well-drained sandy loam to clay loam',
      ph: '6.0-7.0',
      preparation: [
        'Plough field 3-4 times',
        'Apply FYM @ 20-25 tonnes/hectare',
        'Prepare raised beds of 15 cm height',
        'Install drip irrigation system',
      ],
    },
    cultivation: {
      seedRate: '300-400 g/hectare for transplanting',
      spacing: '60 x 45 cm or 75 x 60 cm',
      depth: '1-2 cm in nursery',
      method: 'Transplanting 25-30 day old seedlings',
      duration: '90-120 days depending on variety',
    },
    irrigation: {
      frequency: 'Daily or alternate days through drip',
      method: 'Drip irrigation preferred',
      criticalStages: [
        'Transplanting stage',
        'Flowering stage',
        'Fruit development stage',
      ],
    },
    fertilization: {
      basalDose: 'N:P:K = 100:80:80 kg/hectare',
      topDressing: [
        '50% N at planting',
        '25% N at 30 days',
        '25% N at 50 days',
      ],
      organic: [
        'FYM @ 20-25 tonnes/hectare',
        'Vermicompost @ 5 tonnes/hectare',
        'Neem cake @ 500 kg/hectare',
      ],
    },
    pests: [
      {
        name: 'Fruit Borer',
        symptoms: 'Holes in fruits, larvae inside fruits, damaged fruits',
        control: [
          'Install pheromone traps @ 10/hectare',
          'Spray Spinosad 45% SC @ 200 ml/hectare',
          'Hand pick and destroy damaged fruits',
          'Apply Bacillus thuringiensis',
          'Use bird perches',
        ],
      },
      {
        name: 'Whitefly',
        symptoms: 'Yellowing of leaves, leaf curl, honeydew',
        control: [
          'Use yellow sticky traps',
          'Spray Imidacloprid 17.8% SL @ 100 ml/hectare',
          'Spray neem oil @ 5 ml/liter',
          'Remove infected plants',
        ],
      },
      {
        name: 'Leaf Miner',
        symptoms: 'Serpentine mines on leaves, reduced photosynthesis',
        control: [
          'Spray Abamectin 1.9% EC @ 500 ml/hectare',
          'Remove and destroy affected leaves',
          'Use sticky traps',
        ],
      },
    ],
    diseases: [
      {
        name: 'Early Blight',
        symptoms: 'Dark brown spots with concentric rings on older leaves',
        control: [
          'Spray Mancozeb 75% WP @ 2g/liter',
          'Remove infected leaves',
          'Crop rotation',
          'Use resistant varieties',
        ],
      },
      {
        name: 'Late Blight',
        symptoms: 'Water-soaked lesions on leaves and fruits, white fungal growth',
        control: [
          'Spray Metalaxyl 8% + Mancozeb 64% @ 2.5g/liter',
          'Avoid overhead irrigation',
          'Improve air circulation',
          'Use resistant varieties',
        ],
      },
      {
        name: 'Bacterial Wilt',
        symptoms: 'Sudden wilting without yellowing, vascular browning',
        control: [
          'Use disease-free seedlings',
          'Crop rotation with non-solanaceous crops',
          'Soil solarization',
          'Remove and destroy infected plants',
        ],
      },
    ],
    harvesting: {
      time: '60-90 days after transplanting when fruits reach breaker stage',
      method: 'Hand picking with stalk',
      yield: '40-60 tonnes/hectare',
      storage: 'Store at 10-15°C with 85-90% humidity',
    },
    tips: [
      'Use hybrid varieties for better yield',
      'Mulch with plastic or organic material',
      'Stake or cage plants for support',
      'Remove suckers regularly',
      'Harvest at proper maturity stage',
      'Practice crop rotation',
      'Monitor for pests and diseases daily',
    ],
  },
};

export default function CropInformation() {
  const { cropName } = useParams<{ cropName: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'cultivation' | 'pests' | 'diseases' | 'harvesting'>('overview');

  const cropKey = cropName?.toLowerCase() || 'rice';
  const crop = cropDatabase[cropKey] || cropDatabase['rice'];

  return (
    <Wrapper>
      <HeaderTwo />

      <section style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#f0f4f8' }}>
        <div className="container">
          {/* Back Button */}
          <div className="row mb-3">
            <div className="col-12">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-success"
                style={{ borderRadius: '25px' }}
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>

          {/* Crop Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div
                  className="card-header text-white p-4"
                  style={{ background: 'linear-gradient(135deg, #1f4e3d 0%, #2d7a5e 50%, #3ea876 100%)' }}
                >
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ fontSize: '60px' }}>{crop.image}</div>
                        <div>
                          <h1 className="mb-2 fw-bold">{crop.name}</h1>
                          <p className="mb-1 opacity-75">
                            <i className="fa-solid fa-flask me-2"></i>
                            {crop.scientificName}
                          </p>
                          <span className="badge bg-white text-success px-3 py-2" style={{ fontSize: '14px' }}>
                            {crop.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <button className="btn btn-light btn-lg" style={{ borderRadius: '25px' }}>
                        <i className="fa-solid fa-bookmark me-2"></i>
                        Save Crop Info
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <p className="lead text-muted mb-0">{crop.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-3">
                  <ul className="nav nav-pills nav-fill gap-2">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '500',
                          border: activeTab === 'overview' ? 'none' : '2px solid #e5e7eb',
                          backgroundColor: activeTab === 'overview' ? '#10b981' : 'transparent',
                          color: activeTab === 'overview' ? 'white' : '#6b7280',
                        }}
                      >
                        <i className="fa-solid fa-info-circle me-2"></i>Overview
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'cultivation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cultivation')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '500',
                          border: activeTab === 'cultivation' ? 'none' : '2px solid #e5e7eb',
                          backgroundColor: activeTab === 'cultivation' ? '#10b981' : 'transparent',
                          color: activeTab === 'cultivation' ? 'white' : '#6b7280',
                        }}
                      >
                        <i className="fa-solid fa-seedling me-2"></i>Cultivation
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'pests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pests')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '500',
                          border: activeTab === 'pests' ? 'none' : '2px solid #e5e7eb',
                          backgroundColor: activeTab === 'pests' ? '#10b981' : 'transparent',
                          color: activeTab === 'pests' ? 'white' : '#6b7280',
                        }}
                      >
                        <i className="fa-solid fa-bug me-2"></i>Pest Control
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'diseases' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diseases')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '500',
                          border: activeTab === 'diseases' ? 'none' : '2px solid #e5e7eb',
                          backgroundColor: activeTab === 'diseases' ? '#10b981' : 'transparent',
                          color: activeTab === 'diseases' ? 'white' : '#6b7280',
                        }}
                      >
                        <i className="fa-solid fa-virus me-2"></i>Disease Management
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'harvesting' ? 'active' : ''}`}
                        onClick={() => setActiveTab('harvesting')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: '500',
                          border: activeTab === 'harvesting' ? 'none' : '2px solid #e5e7eb',
                          backgroundColor: activeTab === 'harvesting' ? '#10b981' : 'transparent',
                          color: activeTab === 'harvesting' ? 'white' : '#6b7280',
                        }}
                      >
                        <i className="fa-solid fa-tractor me-2"></i>Harvesting
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="row">
            <div className="col-12">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="row">
                  {/* Climate Requirements */}
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-cloud-sun me-2"></i>Climate Requirements
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-muted">
                              <i className="fa-solid fa-temperature-half me-2 text-danger"></i>Temperature
                            </span>
                          </div>
                          <p className="mb-0">{crop.climate.temperature}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-muted">
                              <i className="fa-solid fa-cloud-rain me-2 text-primary"></i>Rainfall
                            </span>
                          </div>
                          <p className="mb-0">{crop.climate.rainfall}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-muted">
                              <i className="fa-solid fa-droplet me-2 text-info"></i>Humidity
                            </span>
                          </div>
                          <p className="mb-0">{crop.climate.humidity}</p>
                        </div>
                        <hr />
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-muted">
                              <i className="fa-solid fa-calendar me-2 text-warning"></i>Season
                            </span>
                          </div>
                          <p className="mb-0">{crop.climate.season}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Soil Requirements */}
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-mountain me-2"></i>Soil Requirements
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Soil Type</span>
                          <p className="mb-0">{crop.soil.type}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Soil pH</span>
                          <p className="mb-0">{crop.soil.ph}</p>
                        </div>
                        <hr />
                        <div>
                          <span className="fw-semibold text-muted d-block mb-3">Soil Preparation</span>
                          <ul className="list-unstyled">
                            {crop.soil.preparation.map((step, index) => (
                              <li key={index} className="mb-2">
                                <i className="fa-solid fa-check-circle text-success me-2"></i>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Growing Tips */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-lightbulb me-2"></i>Pro Tips for Success
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="row">
                          {crop.tips.map((tip, index) => (
                            <div key={index} className="col-md-6 mb-3">
                              <div className="d-flex align-items-start">
                                <div
                                  className="flex-shrink-0 text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{ width: '32px', height: '32px', background: '#10b981' }}
                                >
                                  {index + 1}
                                </div>
                                <p className="mb-0">{tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cultivation Tab */}
              {activeTab === 'cultivation' && (
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-seed me-2"></i>Sowing Details
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Seed Rate</span>
                          <p className="mb-0">{crop.cultivation.seedRate}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Spacing</span>
                          <p className="mb-0">{crop.cultivation.spacing}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Sowing Depth</span>
                          <p className="mb-0">{crop.cultivation.depth}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Method</span>
                          <p className="mb-0">{crop.cultivation.method}</p>
                        </div>
                        <hr />
                        <div>
                          <span className="fw-semibold text-muted d-block mb-2">Crop Duration</span>
                          <p className="mb-0">{crop.cultivation.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-tint me-2"></i>Irrigation Management
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Frequency</span>
                          <p className="mb-0">{crop.irrigation.frequency}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Method</span>
                          <p className="mb-0">{crop.irrigation.method}</p>
                        </div>
                        <hr />
                        <div>
                          <span className="fw-semibold text-muted d-block mb-3">Critical Stages</span>
                          <ul className="list-unstyled">
                            {crop.irrigation.criticalStages.map((stage, index) => (
                              <li key={index} className="mb-2">
                                <i className="fa-solid fa-droplet text-primary me-2"></i>
                                {stage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-flask-vial me-2"></i>Fertilization
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-2">Basal Dose</span>
                          <p className="mb-0">{crop.fertilization.basalDose}</p>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <span className="fw-semibold text-muted d-block mb-3">Top Dressing</span>
                          <ul className="list-unstyled">
                            {crop.fertilization.topDressing.map((dose, index) => (
                              <li key={index} className="mb-2">
                                <i className="fa-solid fa-arrow-right text-success me-2"></i>
                                {dose}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <hr />
                        <div>
                          <span className="fw-semibold text-muted d-block mb-3">Organic Options</span>
                          <ul className="list-unstyled">
                            {crop.fertilization.organic.map((option, index) => (
                              <li key={index} className="mb-2">
                                <i className="fa-solid fa-leaf text-success me-2"></i>
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pests Tab */}
              {activeTab === 'pests' && (
                <div className="row">
                  {crop.pests.map((pest, index) => (
                    <div key={index} className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div
                          className="card-header text-white"
                          style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', borderRadius: '15px 15px 0 0' }}
                        >
                          <h5 className="mb-0 fw-semibold">
                            <i className="fa-solid fa-bug me-2"></i>{pest.name}
                          </h5>
                        </div>
                        <div className="card-body p-4">
                          <div className="mb-4">
                            <h6 className="text-danger mb-3">
                              <i className="fa-solid fa-triangle-exclamation me-2"></i>Symptoms
                            </h6>
                            <p className="text-muted">{pest.symptoms}</p>
                          </div>
                          <div>
                            <h6 className="text-success mb-3">
                              <i className="fa-solid fa-shield-halved me-2"></i>Control Measures
                            </h6>
                            <ul className="list-unstyled">
                              {pest.control.map((measure, idx) => (
                                <li key={idx} className="mb-2">
                                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                                  {measure}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Diseases Tab */}
              {activeTab === 'diseases' && (
                <div className="row">
                  {crop.diseases.map((disease, index) => (
                    <div key={index} className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div
                          className="card-header text-white"
                          style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #e36209 100%)', borderRadius: '15px 15px 0 0' }}
                        >
                          <h5 className="mb-0 fw-semibold">
                            <i className="fa-solid fa-virus me-2"></i>{disease.name}
                          </h5>
                        </div>
                        <div className="card-body p-4">
                          <div className="mb-4">
                            <h6 className="text-warning mb-3">
                              <i className="fa-solid fa-triangle-exclamation me-2"></i>Symptoms
                            </h6>
                            <p className="text-muted">{disease.symptoms}</p>
                          </div>
                          <div>
                            <h6 className="text-success mb-3">
                              <i className="fa-solid fa-kit-medical me-2"></i>Control Measures
                            </h6>
                            <ul className="list-unstyled">
                              {disease.control.map((measure, idx) => (
                                <li key={idx} className="mb-2">
                                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                                  {measure}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Harvesting Tab */}
              {activeTab === 'harvesting' && (
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="mb-0 fw-semibold">
                          <i className="fa-solid fa-tractor me-2"></i>Harvesting & Post-Harvest Management
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: '48px', height: '48px', background: '#10b981' }}
                            >
                              <i className="fa-solid fa-clock"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">Harvesting Time</h6>
                              <p className="mb-0 text-muted">{crop.harvesting.time}</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: '48px', height: '48px', background: '#10b981' }}
                            >
                              <i className="fa-solid fa-hand"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">Harvesting Method</h6>
                              <p className="mb-0 text-muted">{crop.harvesting.method}</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: '48px', height: '48px', background: '#10b981' }}
                            >
                              <i className="fa-solid fa-weight-scale"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">Expected Yield</h6>
                              <p className="mb-0 text-muted">{crop.harvesting.yield}</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div>
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className="text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{ width: '48px', height: '48px', background: '#10b981' }}
                            >
                              <i className="fa-solid fa-warehouse"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">Storage Guidelines</h6>
                              <p className="mb-0 text-muted">{crop.harvesting.storage}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="mb-3 fw-semibold" style={{ color: '#059669' }}>
                    <i className="fa-solid fa-phone-volume me-2"></i>
                    Need Expert Guidance?
                  </h5>
                  <p className="text-muted mb-3">Our agricultural experts are available 24/7 to help you with any crop-related queries</p>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <button className="btn btn-success" style={{ borderRadius: '25px' }}>
                      <i className="fa-solid fa-headset me-2"></i>
                      Call Expert
                    </button>
                    <button className="btn btn-outline-success" style={{ borderRadius: '25px' }}>
                      <i className="fa-solid fa-comments me-2"></i>
                      Chat Now
                    </button>
                    <button className="btn btn-outline-success" style={{ borderRadius: '25px' }}>
                      <i className="fa-solid fa-download me-2"></i>
                      Download PDF Guide
                    </button>
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
