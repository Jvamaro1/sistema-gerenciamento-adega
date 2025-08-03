import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Produtos from './components/Produtos'
import Estoque from './components/Estoque'
import Caixa from './components/Caixa'
import Relatorios from './components/Relatorios'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'produtos':
        return <Produtos />
      case 'estoque':
        return <Estoque />
      case 'caixa':
        return <Caixa />
      case 'relatorios':
        return <Relatorios />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
