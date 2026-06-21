import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDashboard } from '../api/items'

function StatCard({ label, value, icon }) {
  return (
    <motion.div
      className="statCard"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="statIcon" aria-hidden="true">
        {icon}
      </div>
      <div className="statMeta">
        <div className="statLabel">{label}</div>
        <div className="statValue">{value}</div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await getDashboard()
        setData(res.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="pageShell">
        <div className="emptyState">
          <div className="spinner" aria-label="Loading" />
        </div>
      </div>
    )
  }

  const recentItems = data?.recentItems || []

  return (
    <div className="pageShell">
      <div className="pageHeader">
        <div className="pageKicker">Dashboard</div>
        <h1 className="pageTitle">Campus activity at a glance</h1>
        <p className="pageDesc">Track lost &amp; found outcomes and recent posts across the campus.</p>
      </div>

      <div className="dashboardGrid">
        <StatCard label="Total Lost Items" value={data?.totalLost ?? 0} icon="🧳" />
        <StatCard label="Total Found Items" value={data?.totalFound ?? 0} icon="📍" />
        <StatCard label="Claimed Items" value={data?.totalClaimed ?? 0} icon="✅" />
      </div>

      <div className="detailCard" style={{ marginTop: 14 }}>
        <div className="dashboardSectionHeader">
          <div className="dashboardSectionTitle">Recent Activity</div>
          <div className="muted">Latest posts</div>
        </div>

        {recentItems.length === 0 ? (
          <div className="emptyState" style={{ padding: 18 }}>
            <div className="emptyIllustration" aria-hidden="true">
              <div className="emptyEmoji">🕒</div>
            </div>
            <div className="emptyTitle" style={{ marginTop: 10 }}>
              No activity yet
            </div>
          </div>
        ) : (
          <div className="recentList">
            {recentItems.map((item) => (
              <motion.div
                key={item.id}
                className="recentRow"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="recentMain">
                  <div className="recentTitle">
                    {item.title}
                    <span className="metaSep">·</span>
                    <span className="itemDate">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="recentSub">
                    <span className="statusBadge badgeLost" style={{ display: 'inline-flex' }}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                    {item.status === 'claimed' ? (
                      <span className="statusBadge badgeClaimed" style={{ marginLeft: 8 }}>
                        Claimed
                      </span>
                    ) : null}
                  </div>
                </div>

                <a className="secondaryBtn" href={`/item/${item.id}`} style={{ whiteSpace: 'nowrap' }}>
                  View
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

