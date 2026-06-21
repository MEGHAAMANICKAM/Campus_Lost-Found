import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function formatStatus(item) {
  // Backend uses type: lost/found and status: open/claimed
  if (!item) return { text: '', className: '' }
  if (item.status === 'claimed') return { text: 'Claimed', className: 'badgeClaimed' }
  return {
    text: item.type === 'lost' ? 'Lost' : 'Found',
    className: item.type === 'lost' ? 'badgeLost' : 'badgeFound',
  }
}

export default function ItemCard({ item, onClaim, onDelete }) {
  const status = formatStatus(item)
  const imgSrc = item.image_url ? `${item.image_url}` : null

  return (
    <motion.article
      className="itemCard"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="itemCardTop">
        <div className="itemThumb" aria-hidden="true">
          {imgSrc ? (
            <img src={imgSrc} alt="" className="thumbImg" loading="lazy" />
          ) : (
            <>
              <div className="thumbGlow" />
              <div className="thumbIcon">🧳</div>
            </>
          )}

        </div>

        <div className="itemHeading">
          <Link to={`/item/${item.id}`} className="itemTitleLink">
            <h3 className="itemTitle">{item.title}</h3>
          </Link>

          <div className="itemMetaRow">
            <span className={`statusBadge ${status.className}`}>{status.text}</span>
            <span className="metaSep">·</span>
            <span className="itemDate">{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="itemBody">
        <div className="itemLine">
          <span className="itemLabel">Category</span>
          <span className="itemValue">{item.category}</span>
        </div>
        <div className="itemLine">
          <span className="itemLabel">Location</span>
          <span className="itemValue">{item.location}</span>
        </div>

        {item.description ? (
          <p className="itemDescription">{item.description}</p>
        ) : (
          <p className="itemDescription itemDescriptionMuted">No description</p>
        )}
      </div>

      <div className="itemCardActions">
        <button
          type="button"
          className="ghostBtn"
          onClick={() => {
            const contact = item.contact_info || ''
            if (!contact) return alert('No contact info provided.')
            navigator.clipboard?.writeText?.(contact)
            alert(`Contact copied: ${contact}`)
          }}
        >
          Contact
        </button>

        <Link to={`/item/${item.id}`} className="secondaryBtn" style={{ textAlign: 'center' }}>
          View Details
        </Link>

        {item.status === 'open' ? (
          <>
            <div className="itemCardActions" style={{ gridColumn: '1 / -1' }}>
              <button type="button" className="ghostBtn" onClick={() => onClaim?.(item)}>
                Mark claimed
              </button>
              <button type="button" className="dangerBtn" onClick={() => onDelete?.(item.id)}>
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="claimedNote">Resolved. Thanks for helping!</div>
        )}
      </div>
    </motion.article>
  )
}


