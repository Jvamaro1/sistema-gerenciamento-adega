import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, TrendingUp, TrendingDown, Package } from 'lucide-react'

const Estoque = () => {
  const [produtos, setProdutos] = useState([])
  const [estoqueAtual, setEstoqueAtual] = useState([])
  const [entradas, setEntradas] = useState([])
  const [saidas, setSaidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEntradaDialogOpen, setIsEntradaDialogOpen] = useState(false)
  const [isSaidaDialogOpen, setIsSaidaDialogOpen] = useState(false)
  
  const [entradaForm, setEntradaForm] = useState({
    produto_id: '',
    data: new Date().toISOString().split('T')[0],
    quantidade: '',
    valor_compra: ''
  })
  
  const [saidaForm, setSaidaForm] = useState({
    produto_id: '',
    data: new Date().toISOString().split('T')[0],
    quantidade: '',
    valor_venda: '',
    descricao: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [produtosRes, estoqueRes, entradasRes, saidasRes] = await Promise.all([
        fetch('/api/produtos'),
        fetch('/api/estoque/atual'),
        fetch('/api/estoque/entradas'),
        fetch('/api/estoque/saidas')
      ])

      const [produtosData, estoqueData, entradasData, saidasData] = await Promise.all([
        produtosRes.json(),
        estoqueRes.json(),
        entradasRes.json(),
        saidasRes.json()
      ])

      setProdutos(produtosData)
      setEstoqueAtual(estoqueData)
      setEntradas(entradasData)
      setSaidas(saidasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEntradaSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/estoque/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entradaForm)
      })

      if (response.ok) {
        fetchData()
        setIsEntradaDialogOpen(false)
        setEntradaForm({
          produto_id: '',
          data: new Date().toISOString().split('T')[0],
          quantidade: '',
          valor_compra: ''
        })
      }
    } catch (error) {
      console.error('Erro ao registrar entrada:', error)
    }
  }

  const handleSaidaSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/estoque/saidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saidaForm)
      })

      if (response.ok) {
        fetchData()
        setIsSaidaDialogOpen(false)
        setSaidaForm({
          produto_id: '',
          data: new Date().toISOString().split('T')[0],
          quantidade: '',
          valor_venda: '',
          descricao: ''
        })
      }
    } catch (error) {
      console.error('Erro ao registrar saída:', error)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie entradas, saídas e estoque atual</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isEntradaDialogOpen} onOpenChange={setIsEntradaDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Entrada de Estoque</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEntradaSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="produto_entrada">Produto</Label>
                  <Select
                    value={entradaForm.produto_id}
                    onValueChange={(value) => setEntradaForm({...entradaForm, produto_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_entrada">Data</Label>
                    <Input
                      id="data_entrada"
                      type="date"
                      value={entradaForm.data}
                      onChange={(e) => setEntradaForm({...entradaForm, data: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade_entrada">Quantidade</Label>
                    <Input
                      id="quantidade_entrada"
                      type="number"
                      value={entradaForm.quantidade}
                      onChange={(e) => setEntradaForm({...entradaForm, quantidade: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="valor_compra">Valor de Compra (R$)</Label>
                  <Input
                    id="valor_compra"
                    type="number"
                    step="0.01"
                    value={entradaForm.valor_compra}
                    onChange={(e) => setEntradaForm({...entradaForm, valor_compra: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEntradaDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Entrada</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isSaidaDialogOpen} onOpenChange={setIsSaidaDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <TrendingDown className="mr-2 h-4 w-4" />
                Saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Saída de Estoque</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaidaSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="produto_saida">Produto</Label>
                  <Select
                    value={saidaForm.produto_id}
                    onValueChange={(value) => setSaidaForm({...saidaForm, produto_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_saida">Data</Label>
                    <Input
                      id="data_saida"
                      type="date"
                      value={saidaForm.data}
                      onChange={(e) => setSaidaForm({...saidaForm, data: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade_saida">Quantidade</Label>
                    <Input
                      id="quantidade_saida"
                      type="number"
                      value={saidaForm.quantidade}
                      onChange={(e) => setSaidaForm({...saidaForm, quantidade: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="valor_venda">Valor de Venda (R$)</Label>
                  <Input
                    id="valor_venda"
                    type="number"
                    step="0.01"
                    value={saidaForm.valor_venda}
                    onChange={(e) => setSaidaForm({...saidaForm, valor_venda: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao_saida">Descrição</Label>
                  <Input
                    id="descricao_saida"
                    value={saidaForm.descricao}
                    onChange={(e) => setSaidaForm({...saidaForm, descricao: e.target.value})}
                    placeholder="Ex: Venda para cliente João"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsSaidaDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Saída</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="atual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atual">Estoque Atual</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="saidas">Saídas</TabsTrigger>
        </TabsList>

        <TabsContent value="atual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Estoque Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade Atual</TableHead>
                    <TableHead>Total Entradas</TableHead>
                    <TableHead>Total Saídas</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estoqueAtual.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.produto.nome}</TableCell>
                      <TableCell>{item.produto.tipo_bebida}</TableCell>
                      <TableCell>{item.quantidade_atual}</TableCell>
                      <TableCell>{item.total_entradas}</TableCell>
                      <TableCell>{item.total_saidas}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.quantidade_atual < 10 
                            ? 'bg-red-100 text-red-800' 
                            : item.quantidade_atual < 50 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.quantidade_atual < 10 ? 'Estoque Baixo' : 
                           item.quantidade_atual < 50 ? 'Estoque Médio' : 'Estoque OK'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entradas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Entradas de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor de Compra</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entradas.slice(0, 10).map((entrada) => (
                    <TableRow key={entrada.id}>
                      <TableCell>{entrada.data}</TableCell>
                      <TableCell>{entrada.produto?.nome || 'N/A'}</TableCell>
                      <TableCell>{entrada.quantidade}</TableCell>
                      <TableCell>R$ {entrada.valor_compra.toFixed(2)}</TableCell>
                      <TableCell>R$ {(entrada.quantidade * entrada.valor_compra).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saidas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Saídas de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor de Venda</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saidas.slice(0, 10).map((saida) => (
                    <TableRow key={saida.id}>
                      <TableCell>{saida.data}</TableCell>
                      <TableCell>{saida.produto?.nome || 'N/A'}</TableCell>
                      <TableCell>{saida.quantidade}</TableCell>
                      <TableCell>R$ {saida.valor_venda.toFixed(2)}</TableCell>
                      <TableCell>R$ {(saida.quantidade * saida.valor_venda).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Estoque

