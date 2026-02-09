import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Play, CheckCircle, XCircle, Loader2, AlertTriangle, Download, Send,
    ShieldCheck, Database, Activity, FileText, Mail, Pause
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { api } from '../services/api'

export function AgentAutomation() {
    // Provider selection
    const [providers, setProviders] = useState([])
    const [selectedProviders, setSelectedProviders] = useState([])
    const [loadingProviders, setLoadingProviders] = useState(true)

    // Validation Agent State
    const [validationRunning, setValidationRunning] = useState(false)
    const [validationLogs, setValidationLogs] = useState([])
    const [validationResults, setValidationResults] = useState([])

    // Enrichment Agent State
    const [enrichmentRunning, setEnrichmentRunning] = useState(false)
    const [enrichmentLogs, setEnrichmentLogs] = useState([])
    const [enrichmentResults, setEnrichmentResults] = useState([])

    // Monitoring Agent State
    const [monitoringActive, setMonitoringActive] = useState(false)
    const [monitoringStatus, setMonitoringStatus] = useState(null)
    const [detectedChanges, setDetectedChanges] = useState([])
    const [checkingChanges, setCheckingChanges] = useState(false)

    // Compliance Agent State
    const [exportingCompliance, setExportingCompliance] = useState(false)
    const [complianceResult, setComplianceResult] = useState(null)

    // Outreach Agent State
    const [sendingEmails, setSendingEmails] = useState(false)
    const [emailResult, setEmailResult] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState('validation_report')

    // Load providers on mount
    useEffect(() => {
        loadProviders()
        loadMonitoringStatus()
    }, [])

    const loadProviders = async () => {
        try {
            const response = await api.getProviders()
            setProviders(response.providers || [])
            // Select first 5 by default for batch operations
            if (response.providers && response.providers.length > 0) {
                setSelectedProviders(response.providers.slice(0, 5))
            }
        } catch (error) {
            console.error('Failed to load providers:', error)
        } finally {
            setLoadingProviders(false)
        }
    }

    const loadMonitoringStatus = async () => {
        try {
            const status = await api.getMonitoringStatus()
            setMonitoringActive(status.active)
            setMonitoringStatus(status)
            if (status.recent_changes) {
                setDetectedChanges(status.recent_changes)
            }
        } catch (err) {
            console.error('Failed to load monitoring status:', err)
        }
    }

    // ===============================
    // VALIDATION AGENT - REAL BACKEND EXECUTION
    // ===============================
    const runValidation = async () => {
        if (selectedProviders.length === 0) {
            alert('Please select providers to validate')
            return
        }

        setValidationRunning(true)
        setValidationLogs([])
        setValidationResults([])

        try {
            addValidationLog(`🚀 Starting validation for ${selectedProviders.length} providers...`, 'info')

            const results = []

            // Process each provider through REAL backend validation agent
            for (let i = 0; i < selectedProviders.length; i++) {
                const provider = selectedProviders[i]

                addValidationLog(`[${i + 1}/${selectedProviders.length}] Validating ${provider.name}...`, 'info')

                try {
                    // REAL API CALL TO BACKEND /api/validate-provider
                    const response = await api.validateProvider(provider)

                    if (response.status === 'success') {
                        addValidationLog(`✅ ${provider.name} validated successfully`, 'success')
                        results.push({
                            provider: provider.name,
                            ...response.data
                        })
                    } else {
                        addValidationLog(`❌ ${provider.name} validation failed`, 'error')
                    }
                } catch (error) {
                    addValidationLog(`❌ Error validating ${provider.name}: ${error.message}`, 'error')
                }
            }

            setValidationResults(results)
            addValidationLog(`✅ Validation complete! Processed ${results.length}/${selectedProviders.length} providers`, 'success')

        } catch (error) {
            addValidationLog(`❌ Critical error: ${error.message}`, 'error')
        } finally {
            setValidationRunning(false)
        }
    }

    const addValidationLog = (message, type = 'info') => {
        setValidationLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
    }

    // ===============================
    // ENRICHMENT AGENT - REAL BACKEND EXECUTION
    // ===============================
    const runEnrichment = async () => {
        if (selectedProviders.length === 0) {
            alert('Please select providers to enrich')
            return
        }

        setEnrichmentRunning(true)
        setEnrichmentLogs([])
        setEnrichmentResults([])

        try {
            addEnrichmentLog(`🚀 Starting enrichment for ${selectedProviders.length} providers...`, 'info')

            const results = []

            // Process each provider through REAL backend enrichment agent
            for (let i = 0; i < selectedProviders.length; i++) {
                const provider = selectedProviders[i]

                addEnrichmentLog(`[${i + 1}/${selectedProviders.length}] Enriching ${provider.name}...`, 'info')

                try {
                    // REAL API CALL TO BACKEND /api/enrich-provider
                    const response = await api.enrichProvider(provider)

                    if (response.status === 'success') {
                        addEnrichmentLog(`✅ ${provider.name} enriched successfully`, 'success')
                        results.push({
                            provider: provider.name,
                            ...response.data
                        })
                    } else {
                        addEnrichmentLog(`❌ ${provider.name} enrichment failed`, 'error')
                    }
                } catch (error) {
                    addEnrichmentLog(`❌ Error enriching ${provider.name}: ${error.message}`, 'error')
                }
            }

            setEnrichmentResults(results)
            addEnrichmentLog(`✅ Enrichment complete! Processed ${results.length}/${selectedProviders.length} providers`, 'success')

        } catch (error) {
            addEnrichmentLog(`❌ Critical error: ${error.message}`, 'error')
        } finally {
            setEnrichmentRunning(false)
        }
    }

    const addEnrichmentLog = (message, type = 'info') => {
        setEnrichmentLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }])
    }

    // ===============================
    // MONITORING AGENT - REAL BACKEND EXECUTION
    // ===============================
    const startMonitoring = async () => {
        try {
            // REAL API CALL TO BACKEND /api/agents/monitor/start
            const result = await api.startMonitoring(60)
            setMonitoringActive(true)
            setMonitoringStatus(result)
        } catch (error) {
            console.error('Error starting monitoring:', error)
            alert(`Failed to start monitoring: ${error.message}`)
        }
    }

    const stopMonitoring = async () => {
        try {
            // REAL API CALL TO BACKEND /api/agents/monitor/stop
            await api.stopMonitoring()
            setMonitoringActive(false)
        } catch (error) {
            console.error('Error stopping monitoring:', error)
            alert(`Failed to stop monitoring: ${error.message}`)
        }
    }

    const checkChanges = async () => {
        setCheckingChanges(true)
        try {
            // REAL API CALL TO BACKEND /api/agents/monitor/check
            const result = await api.checkForChanges()
            setDetectedChanges(result.changes || [])
        } catch (error) {
            console.error('Error checking changes:', error)
            alert(`Failed to check for changes: ${error.message}`)
        } finally {
            setCheckingChanges(false)
        }
    }

    // ===============================
    // COMPLIANCE AGENT - REAL BACKEND EXECUTION
    // ===============================
    const exportCompliance = async (format) => {
        setExportingCompliance(true)
        try {
            // REAL API CALL TO BACKEND /api/reports/export
            const result = await api.exportData({ format })
            setComplianceResult({ format, success: true, timestamp: new Date().toISOString() })

            // Download the file
            if (result.content) {
                const blob = new Blob([result.content], { type: result.media_type || 'text/plain' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = result.filename || `compliance_report.${format}`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }

        } catch (error) {
            console.error('Export error:', error)
            setComplianceResult({ format, success: false, error: error.message })
        } finally {
            setExportingCompliance(false)
        }
    }

    // ===============================
    // OUTREACH AGENT - REAL BACKEND EXECUTION
    // ===============================
    const sendBulkEmails = async () => {
        if (selectedProviders.length === 0) {
            alert('Please select providers for outreach')
            return
        }

        setSendingEmails(true)
        try {
            // REAL API CALL TO BACKEND /api/reports/email
            const result = await api.sendBulkEmails(selectedTemplate, selectedProviders)
            setEmailResult(result)
        } catch (error) {
            console.error('Email error:', error)
            setEmailResult({ success: false, error: error.message })
        } finally {
            setSendingEmails(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Automation Center</h2>
                    <p className="text-slate-400 mt-1">Execute real business actions with AI agents</p>
                </div>
            </div>

            {/* Provider Selection */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-3">Select Providers for Batch Operations</h3>
                <p className="text-sm text-slate-400 mb-4">
                    {selectedProviders.length} of {providers.length} providers selected
                </p>
                {loadingProviders ? (
                    <div className="text-slate-400">Loading providers...</div>
                ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {providers.slice(0, 10).map((provider, idx) => (
                            <label key={idx} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:bg-slate-700/30 p-2 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedProviders.some(p => p.name === provider.name)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedProviders(prev => [...prev, provider])
                                        } else {
                                            setSelectedProviders(prev => prev.filter(p => p.name !== provider.name))
                                        }
                                    }}
                                    className="rounded"
                                />
                                <span>{provider.name} - {provider.specialty}</span>
                            </label>
                        ))}
                    </div>
                )}
            </Card>

            {/* Validation Agent */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Validation Agent</h3>
                        <p className="text-sm text-slate-400">Real backend validation via Google Maps + NPI Registry</p>
                    </div>
                </div>

                <Button
                    onClick={runValidation}
                    disabled={validationRunning || selectedProviders.length === 0}
                    className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
                >
                    {validationRunning ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Running Real Validation Agent...</>
                    ) : (
                        <><Play className="h-4 w-4 mr-2" /> Execute Validation Agent</>
                    )}
                </Button>

                {validationLogs.length > 0 && (
                    <div className="bg-slate-950 rounded-lg p-4 space-y-1 max-h-64 overflow-y-auto font-mono text-xs mb-4">
                        {validationLogs.map((log, i) => (
                            <div key={i} className={`${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                        log.type === 'warning' ? 'text-amber-400' :
                                            'text-blue-300'
                                }`}>
                                <span className="text-slate-600">{log.timestamp}</span> {log.message}
                            </div>
                        ))}
                    </div>
                )}

                {validationResults.length > 0 && (
                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-emerald-400 mb-2">
                            ✅ Real Backend Results ({validationResults.length} providers):
                        </div>
                        {validationResults.map((result, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <div className="font-semibold text-white mb-2">{result.provider}</div>
                                <div className="text-xs space-y-1 text-slate-300">
                                    {result.validated_data && (
                                        <div>Validation Status: <span className="text-emerald-400">✓ Validated</span></div>
                                    )}
                                    {result.google_result && (
                                        <div>Google Maps: <span className="text-blue-400">{JSON.stringify(result.google_result).substring(0, 100)}...</span></div>
                                    )}
                                    {result.npi_result && (
                                        <div>NPI Registry: <span className="text-purple-400">{JSON.stringify(result.npi_result).substring(0, 100)}...</span></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Enrichment Agent */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Database className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Enrichment Agent</h3>
                        <p className="text-sm text-slate-400">Real backend enrichment with metadata fetching</p>
                    </div>
                </div>

                <Button
                    onClick={runEnrichment}
                    disabled={enrichmentRunning || selectedProviders.length === 0}
                    className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
                >
                    {enrichmentRunning ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Running Real Enrichment Agent...</>
                    ) : (
                        <><Play className="h-4 w-4 mr-2" /> Execute Enrichment Agent</>
                    )}
                </Button>

                {enrichmentLogs.length > 0 && (
                    <div className="bg-slate-950 rounded-lg p-4 space-y-1 max-h-64 overflow-y-auto font-mono text-xs mb-4">
                        {enrichmentLogs.map((log, i) => (
                            <div key={i} className={`${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-emerald-400' :
                                        'text-purple-300'
                                }`}>
                                <span className="text-slate-600">{log.timestamp}</span> {log.message}
                            </div>
                        ))}
                    </div>
                )}

                {enrichmentResults.length > 0 && (
                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-emerald-400 mb-2">
                            ✅ Real Backend Results ({enrichmentResults.length} providers):
                        </div>
                        {enrichmentResults.map((result, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <div className="font-semibold text-white mb-2">{result.provider}</div>
                                <div className="text-xs space-y-1 text-slate-300">
                                    {result.enriched_data && (
                                        <div>Enrichment Status: <span className="text-emerald-400">✓ Enriched</span></div>
                                    )}
                                    {result.enrichment_result && (
                                        <div>Data: <span className="text-purple-400">{JSON.stringify(result.enrichment_result).substring(0, 150)}...</span></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Monitoring Agent */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Activity className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">Monitoring Agent</h3>
                        <p className="text-sm text-slate-400">Real backend periodic checks and change detection</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${monitoringActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                        }`}>
                        {monitoringActive ? 'Active' : 'Inactive'}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                        onClick={monitoringActive ? stopMonitoring : startMonitoring}
                        className={`${monitoringActive ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                    >
                        {monitoringActive ? (
                            <><Pause className="h-4 w-4 mr-2" /> Stop Monitoring</>
                        ) : (
                            <><Play className="h-4 w-4 mr-2" /> Start Monitoring</>
                        )}
                    </Button>
                    <Button
                        onClick={checkChanges}
                        disabled={checkingChanges}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                    >
                        {checkingChanges ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Checking...</>
                        ) : (
                            <><AlertTriangle className="h-4 w-4 mr-2" /> Check Now</>
                        )}
                    </Button>
                </div>

                {detectedChanges.length > 0 && (
                    <div className="bg-slate-950 rounded-lg p-4 space-y-2">
                        <div className="text-sm font-semibold text-white mb-2">Real Backend Detected Changes:</div>
                        {detectedChanges.map((change, i) => (
                            <div key={i} className="text-xs border-l-2 border-amber-500 pl-3 py-1">
                                <div className="text-white font-medium">{change.provider_name}</div>
                                <div className="text-slate-400">
                                    {change.field_changed}: <span className="text-red-400 line-through">{change.old_value}</span> →{' '}
                                    <span className="text-emerald-400">{change.new_value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Compliance Agent */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <FileText className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Compliance Agent</h3>
                        <p className="text-sm text-slate-400">Real backend report generation and export</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={() => exportCompliance('csv')}
                        disabled={exportingCompliance}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                    <Button
                        onClick={() => exportCompliance('json')}
                        disabled={exportingCompliance}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Download className="h-4 w-4 mr-2" /> Export JSON
                    </Button>
                </div>

                {complianceResult && (
                    <div className={`mt-4 p-4 rounded-lg ${complianceResult.success
                            ? 'bg-emerald-900/20 border border-emerald-500/30'
                            : 'bg-red-900/20 border border-red-500/30'
                        }`}>
                        <div className={`flex items-center gap-2 mb-2 ${complianceResult.success ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {complianceResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            <span className="font-semibold">
                                {complianceResult.success ? 'Real Backend Export Successful' : 'Export Failed'}
                            </span>
                        </div>
                        <div className="text-sm text-slate-300">
                            {complianceResult.success
                                ? `${complianceResult.format.toUpperCase()} report generated by backend and downloaded`
                                : complianceResult.error
                            }
                        </div>
                    </div>
                )}
            </Card>

            {/* Outreach Agent */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-500/20 rounded-lg">
                        <Mail className="h-6 w-6 text-rose-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Outreach Agent</h3>
                        <p className="text-sm text-slate-400">Real backend email sending with confirmations</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Template</label>
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                        <option value="validation_report">Validation Report</option>
                        <option value="compliance_alert">Compliance Alert</option>
                        <option value="onboarding_welcome">Onboarding Welcome</option>
                    </select>
                </div>

                <Button
                    onClick={sendBulkEmails}
                    disabled={sendingEmails || selectedProviders.length === 0}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                >
                    {sendingEmails ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending via Backend...</>
                    ) : (
                        <><Send className="h-4 w-4 mr-2" /> Send Bulk Emails</>
                    )}
                </Button>

                {emailResult && (
                    <div className={`mt-4 p-4 rounded-lg ${emailResult.success !== false
                            ? 'bg-emerald-900/20 border border-emerald-500/30'
                            : 'bg-red-900/20 border border-red-500/30'
                        }`}>
                        <div className={`flex items-center gap-2 mb-2 ${emailResult.success !== false ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {emailResult.success !== false ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            <span className="font-semibold">
                                {emailResult.success !== false ? 'Real Backend Emails Sent' : 'Email Failed'}
                            </span>
                        </div>
                        {emailResult.success !== false && (
                            <div className="text-sm text-slate-300 space-y-1">
                                <div>Template: <span className="text-white font-semibold">{selectedTemplate}</span></div>
                                <div>Recipients: <span className="text-white font-semibold">{selectedProviders.length}</span></div>
                            </div>
                        )}
                        {emailResult.error && (
                            <div className="text-sm text-slate-300">{emailResult.error}</div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}
