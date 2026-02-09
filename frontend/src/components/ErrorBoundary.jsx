import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
                    <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-slate-400 mb-6">
                            The application encountered an unexpected error. Our team has been notified.
                        </p>
                        <div className="bg-black/30 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                            <code className="text-xs text-red-400 font-mono">
                                {this.state.error && this.state.error.toString()}
                            </code>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reload Page
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/'}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
