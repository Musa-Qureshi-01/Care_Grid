import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const api = {
    // Agent Endpoints
    validateProvider: (data) => apiClient.post('/validate-provider', data).then(res => res.data),
    enrichProvider: (data) => apiClient.post('/enrich-provider', data).then(res => res.data),
    scoreProvider: (data) => apiClient.post('/score-provider', data).then(res => res.data),
    updateDirectory: (data) => apiClient.post('/generate-directory', data).then(res => res.data),

    // Batch
    runBatch: (data) => apiClient.post('/batch', data).then(res => res.data),

    // Analytics & System
    getAnalytics: () => apiClient.get('/analytics').then(res => res.data),
    getAgentStatus: () => apiClient.get('/agent-status').then(res => res.data),

    // Research Agent
    researchQuery: (data) => apiClient.post('/research/query', data).then(res => res.data),

    // NEW: Real Pipeline
    /**
     * Trigger Data Export
     * POST /api/reports/export
     */
    exportData: async (requestData) => {
        // We expect a file blob return for real exports, but for JSON we might get text.
        // For this MVP, let's assume it returns data we can download.
        const response = await fetch(`${API_URL}/reports/export`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) throw new Error("Export failed");
        return await response.json(); // Consuming JSON from backend
    },

    runFullPipeline: (data) => apiClient.post('/run-pipeline', data).then(res => res.data),
    getProviders: () => apiClient.get('/providers').then(res => res.data),

    // NEW: Bulk Automation APIs
    validateBulk: (data) => apiClient.post('/agents/validate-bulk', data).then(res => res.data),
    enrichBulk: (data) => apiClient.post('/agents/enrich-bulk', data).then(res => res.data),

    // Monitoring APIs
    startMonitoring: (interval_minutes = 60) => apiClient.post(`/agents/monitor/start?interval_minutes=${interval_minutes}`).then(res => res.data),
    stopMonitoring: () => apiClient.post('/agents/monitor/stop').then(res => res.data),
    getMonitoringStatus: () => apiClient.get('/agents/monitor/status').then(res => res.data),
    checkForChanges: () => apiClient.post('/agents/monitor/check').then(res => res.data),

    // Job History
    getJobHistory: (limit = 50) => apiClient.get(`/jobs/history?limit=${limit}`).then(res => res.data),

    // Outreach
    sendBulkEmails: (template_id, providers) => apiClient.post('/reports/email', {
        template_id,
        recipients: providers.map(p => p.email || `${p.name}@example.com`),
        data: { providers }
    }).then(res => res.data)
}
