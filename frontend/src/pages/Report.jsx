import { useLocation, useNavigate } from 'react-router-dom'
import AddItemForm from '../components/AddItemForm'
import { createItem } from '../api/items'

export default function Report() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialType = params.get('type') === 'found' ? 'found' : 'lost'

  return (
    <AddItemForm
      initialType={initialType}
      onSubmit={async (data) => {
        await createItem(data)
        navigate('/')
      }}
    />
  )
}

