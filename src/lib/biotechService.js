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
 * Process a query against the backend API
 */
export async function processQuery(question) {
  try {

    // Call the backend API
    const response = await apiClient.post('/chat/query', {
      question,
      history,      // Conversation context
      //session_id: sessionId, // Link to session
    });

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
 * OPTIONAL: Fetch all sessions for history sidebar
 * @returns {Promise<Array>} List of sessions
 */
export async function fetchSessions() {
  try {
    const response = await apiClient.get('/sessions');
    
    return response?.sessions; // Array of { id, title, created_at, query_count }
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return [];
  }
}

/**
 * OPTIONAL: Delete a session
 * @param {string} sessionId 
 * @returns {Promise<boolean>}
 */
export async function deleteSession(sessionId) {
  try {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    
    return response.ok;
  } catch (error) {
    console.error('Failed to delete session:', error);
    return false;
  }
}

/**
 * Get suggested queries from backend
 */
export function getSuggestedQueries() {
  return [
      "Show me the top 5 biotech companies by market cap",
      "How many clinical trials are in each phase?",
      "What is the total R&D spending across all companies?",
      "Which therapeutic areas have the most pipeline drugs?",
      "Which companies are publicly listed vs. privately held?",
      "Show me all active Phase 3 clinical trials",
      "What's the distribution of molecule types in the pipeline?",
      "What assets target mitochondrial dysfunction in biotech?"
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