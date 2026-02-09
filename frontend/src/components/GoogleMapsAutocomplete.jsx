import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function GoogleMapsAutocomplete({
    onPlaceSelected,
    defaultCenter = { lat: 40.749933, lng: -73.98633 },
    defaultZoom = 13,
    placeholder = "Enter an address",
    className = ""
}) {
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const placePickerRef = useRef(null)
    const infowindowRef = useRef(null)

    useEffect(() => {
        const initMap = async () => {
            // Wait for custom elements to be defined
            await customElements.whenDefined('gmp-map')

            const map = mapRef.current
            const marker = markerRef.current
            const placePicker = placePickerRef.current

            if (!map || !marker || !placePicker) return

            // Initialize infowindow
            infowindowRef.current = new google.maps.InfoWindow()

            // Configure map
            map.innerMap.setOptions({
                mapTypeControl: false
            })

            // Handle place selection
            placePicker.addEventListener('gmpx-placechange', () => {
                const place = placePicker.value

                if (!place.location) {
                    window.alert(`No details available for input: '${place.name}'`)
                    infowindowRef.current.close()
                    marker.position = null
                    return
                }

                // Adjust map view
                if (place.viewport) {
                    map.innerMap.fitBounds(place.viewport)
                } else {
                    map.center = place.location
                    map.zoom = 17
                }

                // Update marker
                marker.position = place.location

                // Show info window
                infowindowRef.current.setContent(`
          <div style="padding: 8px;">
            <strong style="font-size: 14px; color: #1e293b;">${place.displayName}</strong><br>
            <span style="font-size: 12px; color: #64748b;">${place.formattedAddress}</span>
          </div>
        `)
                infowindowRef.current.open(map.innerMap, marker)

                // Callback with place data
                if (onPlaceSelected) {
                    onPlaceSelected({
                        name: place.displayName,
                        address: place.formattedAddress,
                        location: place.location,
                        placeId: place.id
                    })
                }
            })
        }

        // Load the script if not already loaded
        if (!document.querySelector('script[src*="@googlemaps/extended-component-library"]')) {
            const script = document.createElement('script')
            script.type = 'module'
            script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js'
            document.head.appendChild(script)

            script.onload = () => {
                initMap()
            }
        } else {
            initMap()
        }
    }, [onPlaceSelected])

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative w-full h-full ${className}`}
        >
            {/* API Loader */}
            <gmpx-api-loader
                key={apiKey}
                solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
            />

            {/* Map Container */}
            <gmp-map
                ref={mapRef}
                center={`${defaultCenter.lat},${defaultCenter.lng}`}
                zoom={defaultZoom}
                map-id="DEMO_MAP_ID"
                style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
            >
                {/* Place Picker Control */}
                <div slot="control-block-start-inline-start" className="p-4">
                    <gmpx-place-picker
                        ref={placePickerRef}
                        placeholder={placeholder}
                        style={{
                            width: '320px',
                            fontSize: '14px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Marker */}
                <gmp-advanced-marker ref={markerRef} />
            </gmp-map>
        </motion.div>
    )
}
