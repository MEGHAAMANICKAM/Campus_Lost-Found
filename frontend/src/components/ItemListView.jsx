import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ItemCard from './ItemCard'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18.5C14.6421 18.5 18 15.1421 18 11C18 6.85786 14.6421 3.5 10.5 3.5C6.35786 3.5 3 6.85786 3 11C3 15.1421 6.35786 18.5 10.5 18.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function ItemListView({
  items,
  loading,
  filterType,
  setFilterType,
  query,
  setQuery,
  category,
  setCategory,
  onClaim,
  onDelete,
}) {
  const [date, setDate] = useState('')

  const categories = useMemo(() => {
    const set = new Set()
    items.forEach((i) => {
      if (i.category) set.add(i.category)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false
      if (category !== 'all' && item.category !== category) return false
      if (date) {
        const itemDate = new Date(item.created_at).toISOString().slice(0, 10)
        if (itemDate < date) return false
      }
      if (!q) return true
      const hay = `${item.title ?? ''} ${item.category ?? ''} ${item.location ?? ''} ${item.description ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [items, filterType, query, category, date])

  return (
    <section className="listSection">
      <div className="listHeader">
        <div>
          <div className="sectionKicker">Feed controls</div>
          <h2 className="sectionTitle">Search, filter and discover</h2>
        </div>
        <div className="resultCount">{filtered.length} items</div>
      </div>

      <div className="listControls">
        <div className="searchWrap">
          <SearchIcon />
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items, categories, locations…"
            aria-label="Search items"
          />
        </div>

        <div className="filtersRow">
          <div className="chipGroup" role="group" aria-label="Type filters">
            {[
              { key: 'all', label: 'All' },
              { key: 'lost', label: 'Lost' },
              { key: 'found', label: 'Found' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                className={['chip', filterType === t.key ? 'chipActive' : ''].filter(Boolean).join(' ')}
                onClick={() => setFilterType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="selectWrap">
            <span className="srOnly">Category</span>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="selectWrap selectDate">
            <span className="srOnly">Posted since</span>
            <input
              className="select"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Filter by date"
            />
          </label>

          {date ? (
            <button type="button" className="ghostBtn" onClick={() => setDate('')}>
              Clear date
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="emptyState">
          <motion.div
            className="emptyCard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="spinner" aria-label="Loading" />
            <div className="emptyText">Loading items…</div>
          </motion.div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="emptyState">
          <motion.div
            className="emptyCard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="emptyIllustration" aria-hidden="true">
              <div className="emptyEmoji">🔎</div>
            </div>
            <div className="emptyTitle">No matches found</div>
            <div className="emptyDesc">Try changing your search or filters.</div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="itemGrid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onClaim={onClaim} onDelete={onDelete} />
          ))}
        </motion.div>
      )}
    </section>
  )
}

