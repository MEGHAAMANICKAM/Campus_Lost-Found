import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export default function LocationPicker({ value, onChange, onError }) {
  const [geolocationStatus, setGeolocationStatus] = useState('idle')

  const hasValue = useMemo(() => !!(value && String(value).trim()), [value])

  useEffect(() => {
    if (!hasValue) setGeolocationStatus('idle')
  }, [hasValue])

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported in this browser.')
      return
    }

    setGeolocationStatus('requesting')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        // Keep it simple: store coords. If you later add reverse-geocoding, swap this.
        const loc = `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`
        onChange?.(loc)
        setGeolocationStatus('ready')
      },
      (err) => {
        setGeolocationStatus('error')
        onError?.(err.message || 'Failed to get location.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }

  return (
    <div className="field">
      <div className="label">Location</div>

      <div className="grid2" style={{ gridTemplateColumns: '1fr 0.75fr' }}>
        <div>
          <div className="floating">
            <input
              id="location"
              name="location"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder=" "
              className="input"
              aria-invalid={false}
            />
            <label htmlFor="location" className={['floatingLabel', value ? 'floatingLabelUp' : ''].join(' ')}>
              Enter location manually
            </label>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ display: 'grid', gap: 10, alignContent: 'start' }}
        >
          <button type="button" className="secondaryBtn" onClick={useCurrentLocation}>
            Use Current Location
          </button>
          <div className="formHelp" style={{ marginTop: 0 }}>
            {geolocationStatus === 'requesting'
              ? 'Requesting permission…'
              : geolocationStatus === 'ready'
                ? 'Location captured.'
                : geolocationStatus === 'error'
                  ? 'Location unavailable.'
                  : 'Or grant permission and auto-fill.'}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

