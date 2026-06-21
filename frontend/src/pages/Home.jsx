import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getItems, getDashboard, updateItem, deleteItem } from '../api/items'
import ItemListView from '../components/ItemListView'

const stats = [
  { key: 'totalLost', label: 'Total Lost Items', icon: '🧳' },
  { key: 'totalFound', label: 'Total Found Items', icon: '📍' },
  { key: 'totalClaimed', label: 'Successfully Returned', icon: '✅' },
]

export default function Home() {
  const [items, setItems] = useState([])
  const [dashboard, setDashboard] = useState({ totalLost: 0, totalFound: 0, totalClaimed: 0 })
  const [filterType, setFilterType] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const loadItems = async () => {
    setLoading(true)
    try {
      const res = await getItems({ status: 'all' })
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true)
      try {
        const [itemsRes, dashboardRes] = await Promise.all([getItems({ status: 'all' }), getDashboard()])
        setItems(itemsRes.data)
        setDashboard(dashboardRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  const onClaim = async (item) => {
    await updateItem(item.id, { ...item, status: 'claimed' })
    loadItems()
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await deleteItem(id)
    loadItems()
  }

  return (
    <div className="homeWrap">
      <section className="hero">
        <motion.div
          className="heroContent"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="heroKicker">Reunite campus possessions with clarity.</div>
          <h1 className="heroTitle">The modern lost &amp; found experience built for campus life.</h1>
          <p className="heroDesc">
            Post lost or found items, filter by category, and connect through quick contact tools.
            Everything is optimized for students and staff on the move.
          </p>

          <div className="heroSearchCard">
            <div className="heroSearchHead">
              <div>
                <div className="heroSearchTitle">Search the campus feed</div>
                <div className="heroSearchSub">Find items with one search, then filter by status and category.</div>
              </div>
            </div>
            <div className="searchWrap heroSearch">
              <span className="searchIcon" aria-hidden="true">🔎</span>
              <input
                className="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lost and found reports"
                aria-label="Search campus items"
              />
            </div>
          </div>

          <div className="heroActions">
            <Link to="/report?type=lost" className="primaryBtn">
              Report Lost Item
            </Link>
            <Link to="/report?type=found" className="secondaryBtn">
              Report Found Item
            </Link>
            <Link to="/lost" className="ghostBtn">
              Browse Lost
            </Link>
            <Link to="/found" className="ghostBtn">
              Browse Found
            </Link>
          </div>

          <div className="heroStats">
            {stats.map((stat) => (
              <motion.div
                key={stat.key}
                className="statTile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.04 }}
              >
                <div className="statTileIcon">{stat.icon}</div>
                <div>
                  <div className="statTileLabel">{stat.label}</div>
                  <div className="statTileValue">{dashboard[stat.key] ?? 0}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="heroVisual"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
        >
          <div className="heroCard">
            <div className="heroCardTop">
              <span className="heroDot dotIndigo" />
              <span className="heroDot dotCyan" />
              <span className="heroDot dotGreen" />
            </div>
            <div className="heroLines">
              <div className="heroLine w70" />
              <div className="heroLine w90" />
              <div className="heroLine w55" />
            </div>
            <div className="heroTags">
              <span className="heroTag">Lost</span>
              <span className="heroTag heroTagCyan">Found</span>
              <span className="heroTag heroTagGreen">Returned</span>
            </div>
            <div className="heroPreview">
              <div className="previewRow previewRowTop">
                <div className="previewBubble">New report</div>
                <div className="previewBadge">Live</div>
              </div>
              <div className="previewRow">
                <div className="previewCardMini">
                  <div className="previewDot previewLost" />
                  <div>
                    <div className="previewLabel">Black Backpack</div>
                    <div className="previewMeta">Library · Lost</div>
                  </div>
                </div>
                <div className="previewCardMini">
                  <div className="previewDot previewFound" />
                  <div>
                    <div className="previewLabel">Smartphone</div>
                    <div className="previewMeta">Cafeteria · Found</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="browse" className="contentSection">
        <div className="sectionHeader">
          <div>
            <div className="sectionKicker">Campus feed</div>
            <h2 className="sectionTitle">Browse recent items</h2>
          </div>
          <div className="sectionMeta">Search by name, category, location, or status.</div>
        </div>

        <ItemListView
          items={items}
          loading={loading}
          filterType={filterType}
          setFilterType={setFilterType}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          onClaim={onClaim}
          onDelete={onDelete}
        />
      </section>
    </div>
  )
}

