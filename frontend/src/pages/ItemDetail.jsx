import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItem, updateItem, deleteItem } from '../api/items'

function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(() => {
    getItem(id).then((res) => setItem(res.data))
  }, [id])

  if (!item)
    return (
      <div className="emptyState">
        <div className="spinner" aria-label="Loading" />
      </div>
    )


  const markClaimed = async () => {
    await updateItem(item.id, { ...item, status: 'claimed' })
    setItem({ ...item, status: 'claimed' })
  }

  const remove = async () => {
    if (!confirm('Delete this post?')) return
    await deleteItem(item.id)
    navigate('/')
  }

  const statusText = item.status === 'claimed' ? 'Claimed' : item.type === 'lost' ? 'Lost' : 'Found'

  return (
    <div className="pageShell">
      <div className="pageHeader">
        <div className="pageKicker">Item detail</div>
        <h1 className="pageTitle">{item.title}</h1>
        <div className="pageTagRow">
          <span className={`statusBadge ${item.status === 'claimed' ? 'badgeClaimed' : item.type === 'lost' ? 'badgeLost' : 'badgeFound'}`}>
            {statusText}
          </span>
          <span className="muted">{new Date(item.created_at).toLocaleString()}</span>
        </div>
      </div>

      <div className="detailGrid">
        <div className="detailCard">
          <div className="detailThumb" aria-hidden="true">
            {item.image_url ? (
              <img src={item.image_url} alt="" className="detailThumbImg" />
            ) : (
              <>
                <div className="thumbGlow" />
                <div className="thumbIcon">🧾</div>
              </>
            )}
          </div>

          <p className="detailDescription">
            {item.description || 'No description provided.'}
          </p>


          <div className="detailLines">
            <div className="itemLine"><span className="itemLabel">Category</span><span className="itemValue">{item.category}</span></div>
            <div className="itemLine"><span className="itemLabel">Location</span><span className="itemValue">{item.location}</span></div>
            <div className="itemLine"><span className="itemLabel">Contact</span><span className="itemValue">{item.contact_info}</span></div>
            <div className="itemLine"><span className="itemLabel">Status</span><span className="itemValue">{item.status}</span></div>
          </div>
        </div>

        <div className="detailActions">
          {item.status === 'open' ? (
            <button type="button" className="primaryBtn" onClick={markClaimed}>
              Mark as claimed
            </button>
          ) : (
            <div className="successPanel">This post is resolved.</div>
          )}

          <button type="button" className="dangerBtn" onClick={remove}>
            Delete
          </button>

          <button type="button" className="secondaryBtn" onClick={() => navigate('/') }>
            Back to browse
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail

