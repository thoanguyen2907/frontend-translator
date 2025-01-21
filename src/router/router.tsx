import { createBrowserRouter } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import EditItemForm from '../pages/EditItemForm'
import Root from '../pages/Root'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/translator/edit/:id',
        element: <EditItemForm />
      }
    ]
  }
])
