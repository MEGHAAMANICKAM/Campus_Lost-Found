import { useNavigate } from 'react-router-dom'
import AddItemForm from '../components/AddItemForm'
import { createItem } from '../api/items'

export default function AddItem() {
  const navigate = useNavigate()

  return (
    <AddItemForm
      onSubmit={async (data) => {
        await createItem(data)
        navigate('/')
      }}
    />
  )
}



