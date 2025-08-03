from flask import Blueprint, request, jsonify
from src.models.adega import db, Produto, SaidaEstoque, TransacaoCaixa
from datetime import datetime, timedelta
from sqlalchemy import func, extract

relatorios_bp = Blueprint('relatorios', __name__)

@relatorios_bp.route('/relatorios/vendas', methods=['GET'])
def get_relatorio_vendas():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = SaidaEstoque.query
        
        if data_inicio:
            query = query.filter(SaidaEstoque.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        
        if data_fim:
            query = query.filter(SaidaEstoque.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        
        vendas = query.all()
        
        # Agrupar vendas por produto
        vendas_por_produto = {}
        total_vendas = 0
        
        for venda in vendas:
            produto_nome = venda.produto.nome if venda.produto else f'Produto ID {venda.produto_id}'
            valor_total = venda.valor_venda * venda.quantidade
            
            if produto_nome not in vendas_por_produto:
                vendas_por_produto[produto_nome] = {
                    'quantidade': 0,
                    'valor_total': 0
                }
            
            vendas_por_produto[produto_nome]['quantidade'] += venda.quantidade
            vendas_por_produto[produto_nome]['valor_total'] += valor_total
            total_vendas += valor_total
        
        return jsonify({
            'vendas_por_produto': vendas_por_produto,
            'total_vendas': total_vendas,
            'total_itens_vendidos': sum(v['quantidade'] for v in vendas_por_produto.values())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/relatorios/financeiro', methods=['GET'])
def get_relatorio_financeiro():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = TransacaoCaixa.query
        
        if data_inicio:
            query = query.filter(TransacaoCaixa.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        
        if data_fim:
            query = query.filter(TransacaoCaixa.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        
        transacoes = query.all()
        
        # Calcular totais
        entradas = sum(t.valor for t in transacoes if t.tipo == 'entrada')
        saidas = sum(t.valor for t in transacoes if t.tipo == 'saida')
        lucro = entradas - saidas
        
        # Agrupar por mês
        vendas_por_mes = {}
        for transacao in transacoes:
            mes_ano = f"{transacao.data.year}-{transacao.data.month:02d}"
            if mes_ano not in vendas_por_mes:
                vendas_por_mes[mes_ano] = {'entradas': 0, 'saidas': 0}
            
            if transacao.tipo == 'entrada':
                vendas_por_mes[mes_ano]['entradas'] += transacao.valor
            else:
                vendas_por_mes[mes_ano]['saidas'] += transacao.valor
        
        return jsonify({
            'resumo': {
                'total_entradas': entradas,
                'total_saidas': saidas,
                'lucro': lucro
            },
            'vendas_por_mes': vendas_por_mes
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@relatorios_bp.route('/relatorios/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        # Estatísticas gerais
        total_produtos = Produto.query.count()
        
        # Vendas do mês atual
        hoje = datetime.now().date()
        inicio_mes = hoje.replace(day=1)
        vendas_mes = db.session.query(func.sum(SaidaEstoque.valor_venda * SaidaEstoque.quantidade)).filter(
            SaidaEstoque.data >= inicio_mes
        ).scalar() or 0
        
        # Saldo atual do caixa
        entradas = db.session.query(func.sum(TransacaoCaixa.valor)).filter_by(tipo='entrada').scalar() or 0
        saidas = db.session.query(func.sum(TransacaoCaixa.valor)).filter_by(tipo='saida').scalar() or 0
        saldo_caixa = entradas - saidas
        
        # Últimas transações
        ultimas_transacoes = TransacaoCaixa.query.order_by(TransacaoCaixa.data.desc()).limit(5).all()
        
        # Produtos com estoque baixo (menos de 10 unidades)
        from src.models.adega import EntradaEstoque
        produtos_estoque_baixo = []
        produtos = Produto.query.all()
        
        for produto in produtos:
            total_entradas = db.session.query(func.sum(EntradaEstoque.quantidade)).filter_by(produto_id=produto.id).scalar() or 0
            total_saidas = db.session.query(func.sum(SaidaEstoque.quantidade)).filter_by(produto_id=produto.id).scalar() or 0
            estoque_atual = total_entradas - total_saidas
            
            if estoque_atual < 10:
                produtos_estoque_baixo.append({
                    'produto': produto.to_dict(),
                    'estoque_atual': estoque_atual
                })
        
        return jsonify({
            'estatisticas': {
                'total_produtos': total_produtos,
                'vendas_mes': vendas_mes,
                'saldo_caixa': saldo_caixa,
                'produtos_estoque_baixo': len(produtos_estoque_baixo)
            },
            'ultimas_transacoes': [t.to_dict() for t in ultimas_transacoes],
            'produtos_estoque_baixo': produtos_estoque_baixo
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

