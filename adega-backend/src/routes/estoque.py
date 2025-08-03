from flask import Blueprint, request, jsonify
from src.models.adega import db, EntradaEstoque, SaidaEstoque, Produto, TransacaoCaixa
from datetime import datetime
from sqlalchemy import func

estoque_bp = Blueprint('estoque', __name__)

@estoque_bp.route('/estoque/entradas', methods=['GET'])
def get_entradas():
    try:
        entradas = EntradaEstoque.query.all()
        return jsonify([entrada.to_dict() for entrada in entradas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@estoque_bp.route('/estoque/entradas', methods=['POST'])
def create_entrada():
    try:
        data = request.get_json()
        
        entrada = EntradaEstoque(
            produto_id=int(data['produto_id']),
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            quantidade=int(data['quantidade']),
            valor_compra=float(data['valor_compra'])
        )
        
        db.session.add(entrada)
        db.session.commit()
        
        return jsonify(entrada.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@estoque_bp.route('/estoque/saidas', methods=['GET'])
def get_saidas():
    try:
        saidas = SaidaEstoque.query.all()
        return jsonify([saida.to_dict() for saida in saidas])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@estoque_bp.route('/estoque/saidas', methods=['POST'])
def create_saida():
    try:
        data = request.get_json()
        
        # Criar saída de estoque
        saida = SaidaEstoque(
            produto_id=int(data['produto_id']),
            data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
            quantidade=int(data['quantidade']),
            valor_venda=float(data['valor_venda'])
        )
        
        # Criar transação de caixa (entrada)
        transacao = TransacaoCaixa(
            tipo='entrada',
            descricao=f'Venda - {data.get("descricao", "Produto")}',
            valor=float(data['valor_venda']) * int(data['quantidade']),
            data=datetime.strptime(data['data'], '%Y-%m-%d').date()
        )
        
        db.session.add(saida)
        db.session.add(transacao)
        db.session.commit()
        
        return jsonify(saida.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@estoque_bp.route('/estoque/atual', methods=['GET'])
def get_estoque_atual():
    try:
        # Calcular estoque atual por produto
        produtos = Produto.query.all()
        estoque_atual = []
        
        for produto in produtos:
            # Somar entradas
            total_entradas = db.session.query(func.sum(EntradaEstoque.quantidade)).filter_by(produto_id=produto.id).scalar() or 0
            
            # Somar saídas
            total_saidas = db.session.query(func.sum(SaidaEstoque.quantidade)).filter_by(produto_id=produto.id).scalar() or 0
            
            quantidade_atual = total_entradas - total_saidas
            
            estoque_atual.append({
                'produto': produto.to_dict(),
                'quantidade_atual': quantidade_atual,
                'total_entradas': total_entradas,
                'total_saidas': total_saidas
            })
        
        return jsonify(estoque_atual)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

