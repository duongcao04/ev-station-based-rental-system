import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './AppRouter'
import './index.css'
import { setQueryClient } from './stores/useAuthStore'

const queryClient = new QueryClient()

// Set queryClient cho useAuthStore để có thể invalidate cache khi đăng xuất
setQueryClient(queryClient)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}><AppRouter /></QueryClientProvider>
  </StrictMode>,
)
