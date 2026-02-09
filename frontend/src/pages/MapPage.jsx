import { useState } from 'react'
import { GoogleMapsAutocomplete } from '../components/GoogleMapsAutocomplete'
import { Navbar } from '../components/Navbar'
import { MapPin, Navigation, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export function MapPage() {
    const [selectedPlace, setSelectedPlace] = useState(null)

    const handlePlaceSelected = (place) => {
        setSelectedPlace(place)
        console.log('Selected place:', place)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-20 pb-8 px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Location Search</h1>
                    </div>
                    <p className="text-slate-600">
                        Search for provider locations, verify addresses, and explore geographic data.
                    </p>
                </motion.div>

                {/* Map Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style={{ height: '600px' }}>
                            <GoogleMapsAutocomplete
                                onPlaceSelected={handlePlaceSelected}
                                placeholder="Search for a provider location..."
                                defaultCenter={{ lat: 23.2599, lng: 77.4126 }} // Bhopal, India
                                defaultZoom={12}
                            />
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Search className="h-5 w-5 text-slate-600" />
                                <h2 className="text-lg font-semibold text-slate-900">Selected Location</h2>
                            </div>

                            {selectedPlace ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</label>
                                        <p className="text-sm font-semibold text-slate-900 mt-1">{selectedPlace.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Address</label>
                                        <p className="text-sm text-slate-700 mt-1">{selectedPlace.address}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Coordinates</label>
                                        <div className="text-sm text-slate-700 mt-1 font-mono bg-slate-50 p-2 rounded-lg">
                                            <div>Lat: {selectedPlace.location?.lat?.toFixed(6)}</div>
                                            <div>Lng: {selectedPlace.location?.lng?.toFixed(6)}</div>
                                        </div>
                                    </div>

                                    {selectedPlace.placeId && (
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Place ID</label>
                                            <p className="text-xs text-slate-600 mt-1 font-mono bg-slate-50 p-2 rounded-lg break-all">
                                                {selectedPlace.placeId}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-200">
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-blue-500/20">
                                            <Navigation className="h-4 w-4" />
                                            Get Directions
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-12">
                                    <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">
                                        Search for a location to see details here
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Type any address to search</li>
                                <li>• Click on suggestions to select</li>
                                <li>• Marker shows exact location</li>
                                <li>• Use for provider verification</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
