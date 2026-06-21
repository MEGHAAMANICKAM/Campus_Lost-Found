import ItemListView from '../components/ItemListView'
import { useEffect, useState } from 'react'
import { getItems, updateItem, deleteItem } from '../api/items'

export default function Found() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('found')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await getItems({ type: 'found', category: category === 'all' ? undefined : category, status: 'all', search: query || undefined })
    setItems(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query])

  const onClaim = async (item) => {
    await updateItem(item.id, { ...item, status: 'claimed' })
    load()
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await deleteItem(id)
    load()
  }

  return (
    <div className="pageShell">
      <div className="pageHeader">
        <div className="pageKicker">Found</div>
        <h1 className="pageTitle">Found items feed</h1>
        <p className="pageDesc">Search, filter, and contact the reporter to help reunite items.</p>
      </div>

      <div className="contentSection">
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
      </div>
    </div>
  )
}

