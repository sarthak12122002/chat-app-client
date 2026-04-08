// import { base44 } from '@/api/client.js';

// const BIOTECH_KEYWORDS = [
//   'drug', 'pharma', 'clinical', 'trial', 'fda', 'pipeline', 'molecule',
//   'protein', 'gene', 'biotech', 'therapeutic', 'oncology', 'immunology',
//   'vaccine', 'antibody', 'rna', 'dna', 'crispr', 'genomic', 'cell therapy',
//   'biologic', 'biosimilar', 'compound', 'preclinical', 'phase', 'approval',
//   'revenue', 'market cap', 'r&d', 'research', 'patent', 'company', 'companies',
//   'top', 'highest', 'lowest', 'average', 'total', 'count', 'growth', 'funding',
//   'ipo', 'acquisition', 'merger', 'collaboration', 'licensing', 'indication',
//   'endpoint', 'efficacy', 'safety', 'adverse', 'regulatory', 'ema', 'who',
//   'biomarker', 'diagnostic', 'therapeutic area', 'rare disease', 'orphan',
//   'biologics', 'small molecule', 'peptide', 'monoclonal', 'recombinant',
//   'fermentation', 'downstream', 'upstream', 'bioreactor', 'cmo', 'cdmo',
//   'show', 'list', 'how many', 'what', 'which', 'compare', 'trend',
//   'sales', 'employees', 'headcount', 'valuation', 'stock', 'share',
// ];

// export function isBiotechRelated(question) {
//   const lower = question.toLowerCase();
//   return BIOTECH_KEYWORDS.some(kw => lower.includes(kw));
// }

// const SAMPLE_SCHEMA = `
// DATABASE SCHEMA (Biotech Analytics):

// Table: companies
// - id (INT, PK)
// - name (VARCHAR) - Company name
// - ticker (VARCHAR) - Stock ticker
// - market_cap_b (DECIMAL) - Market cap in billions USD
// - revenue_m (DECIMAL) - Annual revenue in millions USD
// - rd_spend_m (DECIMAL) - R&D spending in millions USD
// - employees (INT)
// - founded_year (INT)
// - hq_location (VARCHAR)
// - therapeutic_focus (VARCHAR) - Primary therapeutic area
// - stage (VARCHAR) - Company stage: 'Large Cap', 'Mid Cap', 'Small Cap', 'Pre-Revenue'

// Table: clinical_trials
// - id (INT, PK)
// - company_id (INT, FK → companies.id)
// - drug_name (VARCHAR)
// - indication (VARCHAR)
// - phase (VARCHAR) - 'Phase 1', 'Phase 2', 'Phase 3', 'Approved'
// - status (VARCHAR) - 'Active', 'Completed', 'Suspended', 'Terminated'
// - start_date (DATE)
// - expected_completion (DATE)
// - enrollment (INT) - Number of patients enrolled

// Table: pipeline_drugs
// - id (INT, PK)
// - company_id (INT, FK → companies.id)
// - drug_name (VARCHAR)
// - molecule_type (VARCHAR) - 'Small Molecule', 'Monoclonal Antibody', 'Gene Therapy', 'Cell Therapy', 'mRNA', 'Peptide'
// - therapeutic_area (VARCHAR)
// - development_stage (VARCHAR)
// - peak_sales_estimate_m (DECIMAL)

// Table: financials_quarterly
// - id (INT, PK)
// - company_id (INT, FK → companies.id)
// - quarter (VARCHAR) - 'Q1 2024', 'Q2 2024', etc.
// - revenue_m (DECIMAL)
// - net_income_m (DECIMAL)
// - rd_expense_m (DECIMAL)
// - cash_position_m (DECIMAL)

// Table: fda_approvals
// - id (INT, PK)
// - drug_name (VARCHAR)
// - company_id (INT, FK → companies.id)
// - approval_date (DATE)
// - indication (VARCHAR)
// - molecule_type (VARCHAR)
// - is_first_in_class (BOOLEAN)
// - is_orphan_drug (BOOLEAN)
// `;

// // Simulated biotech dataset
// const BIOTECH_DATA = {
//   companies: [
//     { id: 1, name: 'Amgen', ticker: 'AMGN', market_cap_b: 148.5, revenue_m: 27200, rd_spend_m: 4800, employees: 26500, founded_year: 1980, hq_location: 'Thousand Oaks, CA', therapeutic_focus: 'Oncology', stage: 'Large Cap' },
//     { id: 2, name: 'Gilead Sciences', ticker: 'GILD', market_cap_b: 105.2, revenue_m: 27100, rd_spend_m: 5400, employees: 17000, founded_year: 1987, hq_location: 'Foster City, CA', therapeutic_focus: 'Virology', stage: 'Large Cap' },
//     { id: 3, name: 'Regeneron', ticker: 'REGN', market_cap_b: 112.8, revenue_m: 13120, rd_spend_m: 4100, employees: 12300, founded_year: 1988, hq_location: 'Tarrytown, NY', therapeutic_focus: 'Immunology', stage: 'Large Cap' },
//     { id: 4, name: 'Vertex Pharmaceuticals', ticker: 'VRTX', market_cap_b: 98.6, revenue_m: 9870, rd_spend_m: 3200, employees: 10200, founded_year: 1989, hq_location: 'Boston, MA', therapeutic_focus: 'Rare Disease', stage: 'Large Cap' },
//     { id: 5, name: 'Moderna', ticker: 'MRNA', market_cap_b: 42.3, revenue_m: 6700, rd_spend_m: 4500, employees: 5800, founded_year: 2010, hq_location: 'Cambridge, MA', therapeutic_focus: 'mRNA Therapeutics', stage: 'Large Cap' },
//     { id: 6, name: 'BioNTech', ticker: 'BNTX', market_cap_b: 28.1, revenue_m: 3800, rd_spend_m: 2800, employees: 5600, founded_year: 2008, hq_location: 'Mainz, Germany', therapeutic_focus: 'Oncology', stage: 'Mid Cap' },
//     { id: 7, name: 'Illumina', ticker: 'ILMN', market_cap_b: 33.5, revenue_m: 4500, rd_spend_m: 1200, employees: 9200, founded_year: 1998, hq_location: 'San Diego, CA', therapeutic_focus: 'Genomics', stage: 'Mid Cap' },
//     { id: 8, name: 'Alnylam Pharmaceuticals', ticker: 'ALNY', market_cap_b: 29.8, revenue_m: 2100, rd_spend_m: 1100, employees: 2800, founded_year: 2002, hq_location: 'Cambridge, MA', therapeutic_focus: 'RNAi Therapeutics', stage: 'Mid Cap' },
//     { id: 9, name: 'CRISPR Therapeutics', ticker: 'CRSP', market_cap_b: 5.2, revenue_m: 280, rd_spend_m: 620, employees: 1200, founded_year: 2013, hq_location: 'Zug, Switzerland', therapeutic_focus: 'Gene Editing', stage: 'Small Cap' },
//     { id: 10, name: 'Beam Therapeutics', ticker: 'BEAM', market_cap_b: 3.1, revenue_m: 45, rd_spend_m: 380, employees: 680, founded_year: 2017, hq_location: 'Cambridge, MA', therapeutic_focus: 'Base Editing', stage: 'Pre-Revenue' },
//     { id: 11, name: 'Intellia Therapeutics', ticker: 'NTLA', market_cap_b: 4.8, revenue_m: 120, rd_spend_m: 480, employees: 850, founded_year: 2014, hq_location: 'Cambridge, MA', therapeutic_focus: 'Gene Editing', stage: 'Small Cap' },
//     { id: 12, name: 'Sarepta Therapeutics', ticker: 'SRPT', market_cap_b: 12.4, revenue_m: 1860, rd_spend_m: 890, employees: 3400, founded_year: 1980, hq_location: 'Cambridge, MA', therapeutic_focus: 'Gene Therapy', stage: 'Mid Cap' },
//   ],
//   clinical_trials: [
//     { id: 1, company_id: 1, drug_name: 'AMG 510 (Sotorasib)', indication: 'NSCLC', phase: 'Approved', status: 'Completed', enrollment: 3400 },
//     { id: 2, company_id: 1, drug_name: 'Tarlatamab', indication: 'Small Cell Lung Cancer', phase: 'Phase 3', status: 'Active', enrollment: 1200 },
//     { id: 3, company_id: 2, drug_name: 'Lenacapavir', indication: 'HIV Prevention', phase: 'Phase 3', status: 'Active', enrollment: 5300 },
//     { id: 4, company_id: 2, drug_name: 'Magrolimab', indication: 'AML', phase: 'Phase 3', status: 'Suspended', enrollment: 800 },
//     { id: 5, company_id: 3, drug_name: 'Dupixent', indication: 'COPD', phase: 'Phase 3', status: 'Active', enrollment: 3600 },
//     { id: 6, company_id: 3, drug_name: 'Odronextamab', indication: 'DLBCL', phase: 'Phase 2', status: 'Active', enrollment: 750 },
//     { id: 7, company_id: 4, drug_name: 'Casgevy', indication: 'Sickle Cell Disease', phase: 'Approved', status: 'Completed', enrollment: 280 },
//     { id: 8, company_id: 4, drug_name: 'VX-548', indication: 'Acute Pain', phase: 'Phase 3', status: 'Active', enrollment: 1600 },
//     { id: 9, company_id: 5, drug_name: 'mRNA-4157', indication: 'Melanoma', phase: 'Phase 3', status: 'Active', enrollment: 1100 },
//     { id: 10, company_id: 5, drug_name: 'mRNA-1283', indication: 'COVID-19', phase: 'Phase 3', status: 'Active', enrollment: 4200 },
//     { id: 11, company_id: 6, drug_name: 'BNT211', indication: 'Solid Tumors', phase: 'Phase 1', status: 'Active', enrollment: 320 },
//     { id: 12, company_id: 9, drug_name: 'Exagamglogene (exa-cel)', indication: 'Beta-Thalassemia', phase: 'Approved', status: 'Completed', enrollment: 190 },
//     { id: 13, company_id: 10, drug_name: 'BEAM-101', indication: 'Sickle Cell Disease', phase: 'Phase 1', status: 'Active', enrollment: 60 },
//     { id: 14, company_id: 11, drug_name: 'NTLA-2002', indication: 'HAE', phase: 'Phase 3', status: 'Active', enrollment: 480 },
//     { id: 15, company_id: 12, drug_name: 'Elevidys', indication: 'DMD', phase: 'Approved', status: 'Completed', enrollment: 350 },
//     { id: 16, company_id: 8, drug_name: 'Patisiran', indication: 'hATTR', phase: 'Approved', status: 'Completed', enrollment: 520 },
//   ],
//   pipeline_drugs: [
//     { id: 1, company_id: 1, drug_name: 'AMG 193', molecule_type: 'Small Molecule', therapeutic_area: 'Oncology', development_stage: 'Phase 2', peak_sales_estimate_m: 2400 },
//     { id: 2, company_id: 2, drug_name: 'Lenacapavir', molecule_type: 'Small Molecule', therapeutic_area: 'Virology', development_stage: 'Phase 3', peak_sales_estimate_m: 8500 },
//     { id: 3, company_id: 3, drug_name: 'Fianlimab', molecule_type: 'Monoclonal Antibody', therapeutic_area: 'Oncology', development_stage: 'Phase 3', peak_sales_estimate_m: 4200 },
//     { id: 4, company_id: 4, drug_name: 'VX-548', molecule_type: 'Small Molecule', therapeutic_area: 'Pain', development_stage: 'Phase 3', peak_sales_estimate_m: 5000 },
//     { id: 5, company_id: 5, drug_name: 'mRNA-4157', molecule_type: 'mRNA', therapeutic_area: 'Oncology', development_stage: 'Phase 3', peak_sales_estimate_m: 6800 },
//     { id: 6, company_id: 6, drug_name: 'BNT211', molecule_type: 'Cell Therapy', therapeutic_area: 'Oncology', development_stage: 'Phase 1', peak_sales_estimate_m: 3200 },
//     { id: 7, company_id: 9, drug_name: 'CTX310', molecule_type: 'Gene Therapy', therapeutic_area: 'Cardiovascular', development_stage: 'Phase 1', peak_sales_estimate_m: 1800 },
//     { id: 8, company_id: 10, drug_name: 'BEAM-101', molecule_type: 'Gene Therapy', therapeutic_area: 'Hematology', development_stage: 'Phase 1', peak_sales_estimate_m: 2200 },
//     { id: 9, company_id: 11, drug_name: 'NTLA-2002', molecule_type: 'Gene Therapy', therapeutic_area: 'Immunology', development_stage: 'Phase 3', peak_sales_estimate_m: 3500 },
//     { id: 10, company_id: 12, drug_name: 'SRP-9001', molecule_type: 'Gene Therapy', therapeutic_area: 'Neurology', development_stage: 'Approved', peak_sales_estimate_m: 4500 },
//   ],
//   fda_approvals: [
//     { id: 1, drug_name: 'Sotorasib (Lumakras)', company_id: 1, approval_date: '2021-05-28', indication: 'NSCLC', molecule_type: 'Small Molecule', is_first_in_class: true, is_orphan_drug: false },
//     { id: 2, drug_name: 'Lenacapavir (Sunlenca)', company_id: 2, approval_date: '2022-12-22', indication: 'HIV', molecule_type: 'Small Molecule', is_first_in_class: true, is_orphan_drug: false },
//     { id: 3, drug_name: 'Dupixent', company_id: 3, approval_date: '2017-03-28', indication: 'Atopic Dermatitis', molecule_type: 'Monoclonal Antibody', is_first_in_class: true, is_orphan_drug: false },
//     { id: 4, drug_name: 'Casgevy', company_id: 4, approval_date: '2023-12-08', indication: 'Sickle Cell Disease', molecule_type: 'Gene Therapy', is_first_in_class: true, is_orphan_drug: true },
//     { id: 5, drug_name: 'Spikevax', company_id: 5, approval_date: '2022-01-31', indication: 'COVID-19', molecule_type: 'mRNA', is_first_in_class: false, is_orphan_drug: false },
//     { id: 6, drug_name: 'Elevidys', company_id: 12, approval_date: '2023-06-22', indication: 'DMD', molecule_type: 'Gene Therapy', is_first_in_class: true, is_orphan_drug: true },
//     { id: 7, drug_name: 'Onpattro (Patisiran)', company_id: 8, approval_date: '2018-08-10', indication: 'hATTR', molecule_type: 'RNAi', is_first_in_class: true, is_orphan_drug: true },
//     { id: 8, drug_name: 'Exagamglogene autotemcel', company_id: 9, approval_date: '2023-12-08', indication: 'Beta-Thalassemia', molecule_type: 'Gene Therapy', is_first_in_class: true, is_orphan_drug: true },
//   ],
// };

// export async function processQuery(question) {
//   if (!isBiotechRelated(question)) {
//     return {
//       status: 'rejected',
//       response_text: "I can only answer biotech industry data questions. Please ask something related to biotech companies, clinical trials, drug pipelines, FDA approvals, or biotech financials.",
//       visualization_type: null,
//       result_data: null,
//       generated_sql: null,
//     };
//   }

//   const result = await base44.integrations.Core.InvokeLLM({
//     prompt: `You are BioQuery AI, a biotech industry analytics SQL assistant.

// ${SAMPLE_SCHEMA}

// SAMPLE DATA SUMMARY:
// - 12 biotech companies (Amgen, Gilead, Regeneron, Vertex, Moderna, BioNTech, Illumina, Alnylam, CRISPR Therapeutics, Beam, Intellia, Sarepta)
// - 16 clinical trials across various phases
// - 10 pipeline drugs
// - 8 FDA approvals

// USER QUESTION: "${question}"

// INSTRUCTIONS:
// 1. Generate a valid SQL SELECT query for this question.
// 2. Determine the best visualization type based on the data shape.
// 3. Simulate executing the query against the sample data and return realistic results.
// 4. Provide a clear, professional explanation of the results.

// RULES:
// - Only generate SELECT statements (no INSERT, UPDATE, DELETE, DROP).
// - Choose the most appropriate visualization: "table", "bar_chart", "pie_chart", "line_chart", or "metric".
// - For aggregated counts/comparisons → bar_chart
// - For proportions/distributions → pie_chart  
// - For time series data → line_chart
// - For single values → metric
// - For raw row data → table
// - Provide result_data as an array of objects matching the query columns.
// - For metric type, return a single object with "label" and "value" fields.

// Return JSON with this exact structure:
// {
//   "sql": "SELECT ...",
//   "visualization_type": "table|bar_chart|pie_chart|line_chart|metric",
//   "explanation": "Clear explanation of the findings...",
//   "result_data": [...],
//   "chart_config": {
//     "x_key": "column for x-axis (for charts)",
//     "y_key": "column for y-axis (for charts)",
//     "title": "Chart title"
//   }
// }`,
//     response_json_schema: {
//       type: "object",
//       properties: {
//         sql: { type: "string" },
//         visualization_type: { type: "string", enum: ["table", "bar_chart", "pie_chart", "line_chart", "metric"] },
//         explanation: { type: "string" },
//         result_data: { type: "array", items: { type: "object" } },
//         chart_config: {
//           type: "object",
//           properties: {
//             x_key: { type: "string" },
//             y_key: { type: "string" },
//             title: { type: "string" }
//           }
//         }
//       },
//       required: ["sql", "visualization_type", "explanation", "result_data"]
//     }
//   });

//   return {
//     status: 'completed',
//     generated_sql: result.sql,
//     visualization_type: result.visualization_type,
//     response_text: result.explanation,
//     result_data: result.result_data,
//     chart_config: result.chart_config,
//   };
// }

// export function getSuggestedQueries() {
//   return [
//     "Show me the top 5 biotech companies by market cap",
//     "How many clinical trials are in each phase?",
//     "What is the total R&D spending across all companies?",
//     "Which therapeutic areas have the most pipeline drugs?",
//     "List all FDA-approved first-in-class drugs",
//     "Compare revenue vs R&D spending for large cap companies",
//     "Show me all active Phase 3 clinical trials",
//     "What's the distribution of molecule types in the pipeline?",
//   ];
// }







import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bioquery_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('bioquery_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

const BIOTECH_KEYWORDS = [
  'drug', 'pharma', 'clinical', 'trial', 'fda', 'pipeline', 'molecule',
  'protein', 'gene', 'biotech', 'therapeutic', 'oncology', 'immunology',
  'vaccine', 'antibody', 'rna', 'dna', 'crispr', 'genomic', 'cell therapy',
  'biologic', 'biosimilar', 'compound', 'preclinical', 'phase', 'approval',
  'revenue', 'market cap', 'r&d', 'research', 'patent', 'company', 'companies',
  'top', 'highest', 'lowest', 'average', 'total', 'count', 'growth', 'funding',
  'ipo', 'acquisition', 'merger', 'collaboration', 'licensing', 'indication',
  'endpoint', 'efficacy', 'safety', 'adverse', 'regulatory', 'ema', 'who',
  'biomarker', 'diagnostic', 'therapeutic area', 'rare disease', 'orphan',
  'biologics', 'small molecule', 'peptide', 'monoclonal', 'recombinant',
  'fermentation', 'downstream', 'upstream', 'bioreactor', 'cmo', 'cdmo',
  'show', 'list', 'how many', 'what', 'which', 'compare', 'trend',
  'sales', 'employees', 'headcount', 'valuation', 'stock', 'share',
  'longevity', 'aging', 'lifespan', 'healthspan', 'senescence',
  'asset', 'development', 'candidate', 'target', 'modality', 'validation'
];

export function isBiotechRelated(question) {
  const lower = question.toLowerCase();
  return BIOTECH_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Authenticate user and get token
 */
export async function login(email = 'test@example.com', password = 'password123') {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });

    if (response.data.token) {
      localStorage.setItem('bioquery_token', response.data.token);
      localStorage.setItem('bioquery_user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Auto-login with test credentials if no token exists
 */
async function ensureAuthenticated() {
  const token = localStorage.getItem('bioquery_token');
  
  if (!token) {
    console.log('No token found, authenticating with test credentials...');
    await login();
  }
  
  return localStorage.getItem('bioquery_token');
}

/**
 * Process a query against the backend API
 */
export async function processQuery(question) {
  try {
    // Ensure we have a valid token
    await ensureAuthenticated();

    // Client-side domain check (optional - backend also validates)
    if (!isBiotechRelated(question)) {
      return {
        status: 'rejected',
        response_text: "I can only answer biotech industry data questions. Please ask something related to biotech companies, clinical trials, drug pipelines, FDA approvals, or biotech financials.",
        visualization_type: null,
        result_data: null,
        generated_sql: null,
        chart_config: null,
      };
    }

    // Call the backend API
    const response = await apiClient.post('/chat/query', {
      question
    });

    // Backend returns this structure:
    // {
    //   status: 'completed',
    //   query_id: 42,
    //   generated_sql: "SELECT ...",
    //   response_text: "explanation",
    //   visualization_type: "bar_chart",
    //   result_data: [...],
    //   chart_config: {...},
    //   token_usage: {...}
    // }

    return {
      status: response.status,
      generated_sql: response.generated_sql,
      visualization_type: response.visualization_type,
      response_text: response.response_text,
      result_data: response.result_data,
      chart_config: response.chart_config,
      query_id: response.query_id,
      token_usage: response.token_usage, // NEW: Token usage data
      auto_fixed: response.auto_fixed, // NEW: Whether SQL was auto-fixed
    };

  } catch (error) {
    console.error('Query processing error:', error);
    
    // Handle different error types
    if (error.error === 'Schema too large for selected model') {
      return {
        status: 'error',
        response_text: 'The query is too complex for the current model. Please try a simpler question.',
        visualization_type: null,
        result_data: null,
        generated_sql: null,
        chart_config: null,
      };
    }

    if (error.status === 'error') {
      return {
        status: 'error',
        response_text: error.response_text || 'Failed to process query. Please try again.',
        visualization_type: null,
        result_data: null,
        generated_sql: error.generated_sql || null,
        chart_config: null,
      };
    }

    return {
      status: 'error',
      response_text: 'An unexpected error occurred. Please try again.',
      visualization_type: null,
      result_data: null,
      generated_sql: null,
      chart_config: null,
    };
  }
}

/**
 * Get suggested queries from backend
 */
export function getSuggestedQueries() {
  return [
    "Show me top 5 companies by number of employees",
    "How many clinical trials are in each phase?",
    "What is the total R&D spending across all companies?",
    "Top 10 most funded biotech companies",
    "Show me all active Phase 3 clinical trials",
    "What's the distribution of molecule types in the pipeline?",
  ];
}

/**
 * Logout user
 */
export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('bioquery_token');
    localStorage.removeItem('bioquery_user');
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  try {
    const response = await apiClient.get('/auth/me');
    return response.user;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

/**
 * Get query history
 */
export async function getQueryHistory(limit = 100) {
  try {
    const response = await apiClient.get(`/queries?sort=-created_date&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}

/**
 * Get saved queries
 */
export async function getSavedQueries(limit = 100) {
  try {
    const response = await apiClient.get(`/queries?is_saved=true&sort=-created_date&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch saved queries:', error);
    return [];
  }
}

/**
 * Toggle saved status of a query
 */
export async function toggleSaveQuery(queryId, currentlySaved) {
  try {
    const response = await apiClient.patch(`/queries/${queryId}`, {
      is_saved: !currentlySaved
    });
    return response;
  } catch (error) {
    console.error('Failed to toggle save:', error);
    throw error;
  }
}

/**
 * Delete a query from history
 */
export async function deleteQuery(queryId) {
  try {
    await apiClient.delete(`/queries/${queryId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete query:', error);
    throw error;
  }
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary() {
  try {
    const response = await apiClient.get('/analytics/summary');
    return response;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return {
      total: 0,
      completed: 0,
      rejected: 0,
      saved: 0,
      queries_per_day: [],
      top_visualizations: []
    };
  }
}

/**
 * Get token usage analytics
 */
export async function getTokenUsage(days = 30) {
  try {
    const response = await apiClient.get(`/analytics/token-usage?days=${days}`);
    return response;
  } catch (error) {
    console.error('Failed to fetch token usage:', error);
    return {
      period_days: days,
      totals: {
        total_tokens: 0,
        total_cost: 0,
        total_queries: 0
      },
      by_date: [],
      by_provider: []
    };
  }
}

// Export the API client for direct use if needed
export { apiClient };