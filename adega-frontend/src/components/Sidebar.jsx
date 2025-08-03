import { Wine, Package, DollarSign, BarChart3, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'produtos', label: 'Produtos', icon: Wine },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'caixa', label: 'Caixa', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Wine className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Wine Cellar</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar

