import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getItems, updateItem, deleteItem } from '../api/items'

function ItemList() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // all | lost | found
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const params = filter === 'all' ? {} : { type: filter }
    const res = await getItems(params)
    setItems(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const markClaimed = async (item) => {
    await updateItem(item.id, { ...item, status: 'claimed' })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return
    await deleteItem(id)
    load()
  }

  return (
    <div>
      <div className="filters">
        {['all', 'lost', 'found'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p>No items yet. Be the first to post one!</p>}

      {items.map((item) => (
        <div className="card" key={item.id}>
          <div className="card-top">
            <Link to={`/items/${item.id}`}><strong>{item.title}</strong></Link>
            <div>
              <span className={`badge ${item.type}`}>{item.type}</span>{' '}
              {item.status === 'claimed' && <span className="badge claimed">claimed</span>}
            </div>
          </div>
          <div className="meta">
            {item.category} · {item.location} · {new Date(item.created_at).toLocaleDateString()}
          </div>
          {item.status === 'open' && (
            <div style={{ marginTop: 8 }}>
              <button className="link-btn" onClick={() => markClaimed(item)}>Mark as claimed</button>
              {' · '}
              <button className="link-btn" onClick={() => remove(item.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ItemList
