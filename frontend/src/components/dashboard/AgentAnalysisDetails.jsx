import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Search, Activity, FileJson } from "lucide-react"

export function AgentAnalysisDetails({ open, onOpenChange, data }) {
    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <Activity className="text-blue-500" />
                        Agent Analysis Report
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Detailed internal trace of the multi-agent pipeline execution.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="validation" className="h-full flex flex-col">
                        <div className="px-6 pt-4 bg-slate-900/30 border-b border-slate-800">
                            <TabsList className="bg-slate-800 text-slate-400">
                                <TabsTrigger value="validation">Validation Agent</TabsTrigger>
                                <TabsTrigger value="enrichment">Enrichment Agent</TabsTrigger>
                                <TabsTrigger value="qa">QA Agent</TabsTrigger>
                                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <TabsContent value="validation" className="m-0 space-y-6">
                                <Section title="Primary Verification" icon={CheckCircle2} color="text-indigo-400">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoCard label="NPI Status" value={data.npi_result?.license_status || 'Unknown'} />
                                        <InfoCard label="License Number" value={data.npi_result?.npi_license || 'N/A'} />
                                        <InfoCard label="Specialty Match" value={data.npi_result?.npi_specialty} />
                                        <InfoCard label="Source Reliability" value={`${(data.npi_result?.source_reliability * 100)?.toFixed(0)}%`} />
                                    </div>
                                </Section>

                                <Section title="Real-Time Web Search" icon={Search} color="text-blue-400">
                                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 font-mono text-sm text-slate-300">
                                        <div className="mb-2 text-xs text-slate-500 uppercase tracking-widest">Search Snippet</div>
                                        {data.google_result?.search_snippet || "No search snippet available."}
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <InfoCard label="Web Phone" value={data.google_result?.google_phone} />
                                        <InfoCard label="Web Address" value={data.google_result?.google_address} />
                                    </div>
                                </Section>
                            </TabsContent>

                            <TabsContent value="enrichment" className="m-0 space-y-6">
                                <Section title="Enhanced Profile Data" icon={Activity} color="text-purple-400">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-400 mb-2">Education & Training</h4>
                                            <div className="grid gap-2">
                                                {data.npi_result?.education?.map((edu, i) => (
                                                    <div key={i} className="bg-slate-900/50 p-3 rounded border border-slate-800 flex justify-between">
                                                        <span>{edu.school}</span>
                                                        <span className="text-slate-500">{edu.degree}</span>
                                                    </div>
                                                )) || <div className="text-slate-600">No education data found.</div>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-slate-400 mb-2">Accepted Insurances</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {data.npi_result?.accepted_insurances?.map((ins, i) => (
                                                    <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                                                        {ins}
                                                    </Badge>
                                                )) || <div className="text-slate-600">No insurance data found.</div>}
                                            </div>
                                        </div>
                                    </div>
                                </Section>
                            </TabsContent>

                            <TabsContent value="qa" className="m-0 space-y-6">
                                <Section title="Quality Assurance Audit" icon={AlertTriangle} color="text-emerald-400">
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                                            <div className="text-3xl font-bold text-white mb-1">{data.quality_data?.confidence_scores?.overall || 0}</div>
                                            <div className="text-xs text-slate-500 uppercase">Confidence Score</div>
                                        </div>
                                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                                            <div className="text-3xl font-bold text-white mb-1">{data.quality_data?.risk_level || 'N/A'}</div>
                                            <div className="text-xs text-slate-500 uppercase">Risk Level</div>
                                        </div>
                                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                                            <div className="text-3xl font-bold text-white mb-1">{data.quality_data?.fraud_score || 0}%</div>
                                            <div className="text-xs text-slate-500 uppercase">Fraud Prob.</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-slate-400 mb-2">Active Flags</h4>
                                        <div className="space-y-2">
                                            {data.quality_data?.fraud_flags?.map((flag, i) => (
                                                <div key={i} className="flex items-center gap-2 text-red-400 bg-red-950/20 p-2 rounded border border-red-900/30">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="text-sm font-medium capitalize">{flag.replace(/_/g, ' ')}</span>
                                                </div>
                                            ))}
                                            {(!data.quality_data?.fraud_flags || data.quality_data.fraud_flags.length === 0) && (
                                                <div className="text-emerald-500 flex items-center gap-2 p-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    No flags detected.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Section>
                            </TabsContent>

                            <TabsContent value="raw" className="m-0">
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs overflow-auto">
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Section({ title, icon: Icon, children, color }) {
    return (
        <div className="space-y-4">
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${color}`}>
                <Icon className="w-5 h-5" />
                {title}
            </h3>
            {children}
        </div>
    )
}

function InfoCard({ label, value }) {
    return (
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase mb-1">{label}</div>
            <div className="font-medium text-slate-200 truncate" title={value}>{value}</div>
        </div>
    )
}
