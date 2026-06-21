import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PhotoDropzone({
  value,
  onChange,
  onError,
  accept = 'image/jpeg,image/png,image/webp',
  maxBytes = 5 * 1024 * 1024,
}) {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null)
      return
    }

    if (typeof value === 'string') {
      setPreviewUrl(value)
      return
    }

    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const validateAndSet = (file) => {
    if (!file) return

    if (!accept.split(',').includes(file.type)) {
      onError?.('Only JPG, PNG, and WEBP images are allowed.')
      return
    }

    if (file.size > maxBytes) {
      onError?.(`Image is too large. Max allowed: ${formatBytes(maxBytes)}.`)
      return
    }

    onChange?.(file)
  }

  const onPickFile = () => inputRef.current?.click()

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0]
    validateAndSet(file)
    // allow selecting the same file again
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    validateAndSet(file)
  }

  const onRemove = () => {
    setPreviewUrl(null)
    onChange?.(null)
    onError?.(undefined)
  }

  return (
    <div>
      <div className="field">
        <div className="label">Upload Photo</div>

        <motion.div
          className="dropzone"
          onClick={onPickFile}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onPickFile()
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="dropzoneInner">
            <div className="dropzoneIcon" aria-hidden="true">
              🖼️
            </div>
            <div className="dropzoneText">
              Drag &amp; drop or browse
              <div className="dropzoneSub">JPG/JPEG/PNG/WEBP · Max {formatBytes(maxBytes)}</div>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="srOnly"
            accept={accept}
            onChange={onFileInputChange}
            aria-label="Upload photo"
          />
        </motion.div>

        {previewUrl ? (
          <div className="previewCard">
            {/* Use a plain img tag; if URL is local object URL, it works fine */}
            <img src={previewUrl} alt="Preview" className="previewImg" />
            <button type="button" className="secondaryBtn" onClick={onRemove}>
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

