import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { RefreshCw, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function JobHistory() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/jobs/history');
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                // If API fails (e.g. backend not running), use dry data for demo
                setJobs([
                    { id: 1, type: "data_export", status: "completed", started_at: new Date().toISOString(), details: "Exported 45 providers to CSV" },
                    { id: 2, type: "email_campaign", status: "pending", started_at: new Date(Date.now() - 3600000).toISOString(), details: "Sending 120 compliance emails" },
                    { id: 3, type: "provider_sync", status: "failed", started_at: new Date(Date.now() - 7200000).toISOString(), details: "Connection timeout with payer API" },
                ]);
            }
        } catch (error) {
            console.error("Fetch jobs error:", error);
            // Fallback for demo
            setJobs([
                { id: 1, type: "data_export", status: "completed", started_at: new Date().toISOString(), details: "Exported 45 providers to CSV" },
                { id: 2, type: "email_campaign", status: "pending", started_at: new Date(Date.now() - 3600000).toISOString(), details: "Sending 120 compliance emails" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
            case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
            default: return <Activity className="w-4 h-4 text-blue-400" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    Job History
                </h3>
                <button
                    onClick={() => { fetchJobs(); addToast("Refreshing job history...", "info", 1000); }}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {jobs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No jobs recorded yet.
                    </div>
                ) : (
                    <>
                        {jobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-full flex-shrink-0 border ${getStatusClass(job.status)}`}>
                                        {getStatusIcon(job.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="text-sm font-medium text-slate-200 capitalize truncate">
                                                {job.type.replace('_', ' ')}
                                            </h4>
                                            <span className="text-xs text-slate-500 whitespace-nowrap">
                                                {new Date(job.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 truncate group-hover:text-slate-300 transition-colors">{job.details}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
