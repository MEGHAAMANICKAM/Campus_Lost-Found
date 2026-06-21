import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PhotoDropzone from './PhotoDropzone'
import LocationPicker from './LocationPicker'

const CATEGORIES = [
  'Mobile Phone',
  'Laptop',
  'Wallet',
  'ID Card',
  'Keys',
  'Bag',
  'Water Bottle',
  'Books',
  'Electronics',
  'Accessories',
  'Other',
]

function Field({
  id,
  type = 'text',
  label,
  value,
  onChange,
  required,
  hint,
  error,
  as = 'input',
  children,
}) {
  const inputId = id
  return (
    <div className="field">
      <div className="floating">
        {as === 'textarea' ? (
          <>
            <textarea
              id={inputId}
              name={id}
              value={value}
              onChange={onChange}
              rows={4}
              placeholder=" "
              required={required}
              aria-invalid={!!error}
              className={['input', error ? 'inputError' : ''].filter(Boolean).join(' ')}
            >
              {children}
            </textarea>
          </>
        ) : (
          <>
            <input
              id={inputId}
              name={id}
              type={type}
              value={value}
              onChange={onChange}
              placeholder=" "
              required={required}
              aria-invalid={!!error}
              className={['input', error ? 'inputError' : ''].filter(Boolean).join(' ')}
            />
          </>
        )}
        <label htmlFor={inputId} className={['floatingLabel', value ? 'floatingLabelUp' : ''].filter(Boolean).join(' ')}>
          {label}
          {required ? ' *' : ''}
        </label>
      </div>
      {hint ? <div className="fieldHint">{hint}</div> : null}
      {error ? <div className="fieldError">{error}</div> : null}
    </div>
  )
}

export default function AddItemForm({ initialType = 'lost', onSubmit }) {
  const [form, setForm] = useState({
    type: initialType,
    title: '',
    description: '',
    category: '',
    location: '',
    contact_info: '',
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [photoError, setPhotoError] = useState(undefined)

  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const e = {}
    if (!form.title.trim()) e.title = 'Item name is required.'
    if (form.title.trim().length < 3) e.title = 'Item name must be at least 3 characters.'

    if (!form.category.trim()) e.category = 'Category is required.'

    if (!form.location.trim()) e.location = 'Location is required.'

    if (!form.contact_info.trim()) e.contact_info = 'Contact info is required.'
    if (form.contact_info.trim().length < 5) e.contact_info = 'Contact info looks too short.'

    return e
  }, [form])

  const isValid = Object.keys(errors).length === 0 && !photoError

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const visibleErrors = (name) => (touched[name] ? errors[name] : undefined)

  const submit = async (ev) => {
    ev.preventDefault()
    setTouched({ title: true, category: true, location: true, contact_info: true })
    if (!isValid) return

    const fd = new FormData()
    fd.append('type', form.type)
    fd.append('title', form.title)
    fd.append('description', form.description || '')
    fd.append('category', form.category)
    fd.append('location', form.location)
    fd.append('contact_info', form.contact_info)

    if (photoFile) fd.append('image', photoFile)

    await onSubmit?.(fd)
  }

  return (
    <motion.div
      className="pageShell"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="pageHeader">
        <div className="pageKicker">Report Item</div>
        <h1 className="pageTitle">Help someone reunite with their belongings</h1>
        <p className="pageDesc">Add clear details, pick a category, and upload a photo to improve matching.</p>
      </div>

      <form className="formCard" onSubmit={submit}>
        <div className="grid2">
          <div className="field">
            <label className="label">Item Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="select"
              aria-label="Item type"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="field" />
        </div>

        <Field
          id="title"
          label="Item Name"
          value={form.title}
          onChange={handleChange}
          required
          error={visibleErrors('title')}
        />

        <Field
          id="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          as="textarea"
          hint="Add distinguishing details (optional)"
        />

        <div className="field">
          <label className="label">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={['select', visibleErrors('category') ? 'inputError' : ''].filter(Boolean).join(' ')}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {visibleErrors('category') ? <div className="fieldError">{visibleErrors('category')}</div> : null}
        </div>

        <LocationPicker
          value={form.location}
          onChange={(loc) => setForm((f) => ({ ...f, location: loc }))}
          onError={(msg) => setPhotoError(msg)}
        />

        <Field
          id="contact_info"
          label="Contact Information"
          value={form.contact_info}
          onChange={handleChange}
          required
          error={visibleErrors('contact_info')}
          hint="Email or phone number"
        />

        <div className="field" style={{ marginTop: 10 }}>
          <PhotoDropzone
            value={photoFile}
            onChange={(file) => {
              setPhotoFile(file)
              setPhotoError(undefined)
            }}
            onError={(msg) => setPhotoError(msg)}
          />
          {photoError ? <div className="fieldError">{photoError}</div> : null}
        </div>

        <div className="formActions">
          <button type="submit" className="primaryBtn">
            Submit report
          </button>
          <div className="formHelp">After resolution, the post can be marked as claimed.</div>
        </div>
      </form>
    </motion.div>
  )
}


