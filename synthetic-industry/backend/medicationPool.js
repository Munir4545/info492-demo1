// Medication Pool - Matching pharma-attack-sim structure

const medicationCategories = {
  critical: [
    'Insulin (Humalog)',
    'EpiPen (0.3mg)',
    'Chemotherapy Adjunct Kit',
    'Oncology Trial Medication',
    'Epinephrine (EpiPen)',
    'Insulin (Lantus)',
    'Emergency Cardiovascular Kit',
    'Dialysis Supplies (Critical)',
    'Pediatric Emergency Meds'
  ],
  high: [
    'Blood Pressure Meds (Lisinopril)',
    'Antiretroviral Therapy',
    'Dialysis Supplies',
    'Respiratory Support Kit',
    'Chemotherapy (Taxol)',
    'Immunosuppressants',
    'Clinical Trial Samples',
    'Pediatric Antibiotics',
    'Heart Medication (Digoxin)',
    'Thyroid Medication'
  ],
  medium: [
    'Beta Blockers',
    'Pediatric Antibiotics',
    'Routine Prescription Refill',
    'Antibiotic (Amoxicillin)',
    'Pain Management (Oxycodone)',
    'Antidepressant (Zoloft)',
    'Cholesterol Medication',
    'Diabetes Management Kit'
  ],
  standard: [
    'Routine Prescription',
    'Medical Supplies',
    'Over-the-Counter Medications',
    'Vitamin Supplements',
    'First Aid Supplies',
    'Allergy Medication'
  ]
};

// Patient name pool
const patientNames = [
  'Sarah Chen',
  'James Rodriguez',
  'Maria Thompson',
  'Tina Alvarez',
  'Ian Brooks',
  'Derrick Cole',
  'Oliver Lee',
  'Emma Thompson',
  'John Martinez',
  'Lisa Anderson',
  'David Park',
  'Maria Gonzalez',
  'Robert Wilson',
  'Jennifer Lee',
  'Thomas Brown',
  'Michael Roberts',
  'Anna Peterson',
  'Carlos Hernandez',
  'Grace Kim',
  'Samuel Johnson',
  'Pediatric Oncology Ward',
  'Transplant Recovery Unit',
  'UW Medicine Research Lab',
  'St. Anne Hospital',
  'Mercer Pediatrics',
  'Seattle Children\'s ICU'
];

// Pharmacy pool
const pharmacies = [
  { name: 'Walgreens Capitol Hill', coords: { lat: 47.6205, lng: -122.3493 } },
  { name: 'CVS University District', coords: { lat: 47.6575, lng: -122.3107 } },
  { name: 'Rite Aid Downtown', coords: { lat: 47.6097, lng: -122.3331 } },
  { name: 'Bartell Drugs Queen Anne', coords: { lat: 47.6364, lng: -122.3573 } },
  { name: 'Walgreens Rainier Beach', coords: { lat: 47.5118, lng: -122.2527 } },
  { name: 'CVS Bellevue Downtown', coords: { lat: 47.6101, lng: -122.2015 } },
  { name: 'Fred Meyer Ballard', coords: { lat: 47.6699, lng: -122.3761 } },
  { name: 'Seattle Children\'s Pharmacy', coords: { lat: 47.6624, lng: -122.316 } },
  { name: 'Costco Pharmacy SoDo', coords: { lat: 47.5765, lng: -122.3323 } },
  { name: 'Bartell Drugs South Lake Union', coords: { lat: 47.6221, lng: -122.3362 } }
];

/**
 * Assign random cargo (medication) with weighted criticality
 * 30% critical, 40% high, 20% medium, 10% standard
 */
function assignCargo() {
  const rand = Math.random();
  let category;
  
  if (rand < 0.30) {
    category = 'critical';
  } else if (rand < 0.70) {
    category = 'high';
  } else if (rand < 0.90) {
    category = 'medium';
  } else {
    category = 'standard';
  }
  
  const medications = medicationCategories[category];
  const medication = medications[Math.floor(Math.random() * medications.length)];
  
  // Map criticality to urgency (with some variation)
  let urgency;
  if (category === 'critical') {
    urgency = Math.random() < 0.8 ? 'critical' : 'high';
  } else if (category === 'high') {
    urgency = Math.random() < 0.6 ? 'high' : 'medium';
  } else if (category === 'medium') {
    urgency = Math.random() < 0.7 ? 'medium' : 'low';
  } else {
    urgency = 'low';
  }
  
  return {
    medication,
    criticality: category,
    urgency
  };
}

/**
 * Get random patient name
 */
function getRandomPatient() {
  return patientNames[Math.floor(Math.random() * patientNames.length)];
}

/**
 * Get random pharmacy
 */
function getRandomPharmacy() {
  return pharmacies[Math.floor(Math.random() * pharmacies.length)];
}

module.exports = {
  medicationCategories,
  patientNames,
  pharmacies,
  assignCargo,
  getRandomPatient,
  getRandomPharmacy
};
