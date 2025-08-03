import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, Download, TrendingUp, DollarSign } from 'lucide-react'

const Relatorios = () => {
  const [relatorioVendas, setRelatorioVendas] = useState(null)
  const [relatorioFinanceiro, setRelatorioFinanceiro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    data_fim: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchRelatorios()
  }, [filtros])

  const fetchRelatorios = async () => {
    try {
      const [vendasRes, financeiroRes] = await Promise.all([
        fetch(`/api/relatorios/vendas?data_inicio=${filtros.data_inicio}&data_fim=${filtros.data_fim}`),
        fetch(`/api/relatorios/financeiro?data_inicio=${filtros.data_inicio}&data_fim=${filtros.data_fim}`)
      ])

      const [vendasData, financeiroData] = await Promise.all([
        vendasRes.json(),
        financeiroRes.json()
      ])

      setRelatorioVendas(vendasData)
      setRelatorioFinanceiro(financeiroData)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltroChange = (field, value) => {
    setFiltros(prev => ({ ...prev, [field]: value }))
  }

  // Preparar dados para gráficos
  const vendasChartData = relatorioVendas ? Object.entries(relatorioVendas.vendas_por_produto).map(([produto, dados]) => ({
    produto: produto.length > 15 ? produto.substring(0, 15) + '...' : produto,
    quantidade: dados.quantidade,
    valor: dados.valor_total
  })) : []

  const financeiroChartData = relatorioFinanceiro ? Object.entries(relatorioFinanceiro.vendas_por_mes).map(([mes, dados]) => ({
    mes,
    entradas: dados.entradas,
    saidas: dados.saidas,
    lucro: dados.entradas - dados.saidas
  })) : []

  const pieChartData = vendasChartData.slice(0, 5).map((item, index) => ({
    ...item,
    fill: `hsl(${index * 72}, 70%, 50%)`
  }))

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  if (loading) {
    return <div className="p-6">Carregando relatórios...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Análise de vendas e performance financeira</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Label htmlFor="data_inicio">De:</Label>
            <Input
              id="data_inicio"
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => handleFiltroChange('data_inicio', e.target.value)}
              className="w-auto"
            />
            <Label htmlFor="data_fim">Até:</Label>
            <Input
              id="data_fim"
              type="date"
              value={filtros.data_fim}
              onChange={(e) => handleFiltroChange('data_fim', e.target.value)}
              className="w-auto"
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {relatorioVendas?.total_vendas?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">no período selecionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Vendidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relatorioVendas?.total_itens_vendidos || 0}
            </div>
            <p className="text-xs text-muted-foreground">unidades vendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              R$ {relatorioFinanceiro?.resumo?.total_entradas?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">entradas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (relatorioFinanceiro?.resumo?.lucro || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              R$ {relatorioFinanceiro?.resumo?.lucro?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">lucro no período</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas por Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendasChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="produto" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Top 5 Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produtos por Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ produto, percent }) => `${produto} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Fluxo de Caixa */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financeiroChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Entradas"
                />
                <Line 
                  type="monotone" 
                  dataKey="saidas" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Saídas"
                />
                <Line 
                  type="monotone" 
                  dataKey="lucro" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Lucro"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Relatorios

