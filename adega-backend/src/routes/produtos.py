from flask import Blueprint, request, jsonify
from src.models.adega import db, Produto
from datetime import datetime

produtos_bp = Blueprint('produtos', __name__)

@produtos_bp.route('/produtos', methods=['GET'])
def get_produtos():
    try:
        produtos = Produto.query.all()
        return jsonify([produto.to_dict() for produto in produtos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def get_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        return jsonify(produto.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos', methods=['POST'])
def create_produto():
    try:
        data = request.get_json()
        
        produto = Produto(
            nome=data['nome'],
            tipo_bebida=data['tipo_bebida'],
            fornecedor=data['fornecedor'],
            custo=float(data['custo']),
            valor_venda=float(data['valor_venda']),
            validade=datetime.strptime(data['validade'], '%Y-%m-%d').date() if data.get('validade') else None
        )
        
        db.session.add(produto)
        db.session.commit()
        
        return jsonify(produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def update_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        data = request.get_json()
        
        produto.nome = data.get('nome', produto.nome)
        produto.tipo_bebida = data.get('tipo_bebida', produto.tipo_bebida)
        produto.fornecedor = data.get('fornecedor', produto.fornecedor)
        produto.custo = float(data.get('custo', produto.custo))
        produto.valor_venda = float(data.get('valor_venda', produto.valor_venda))
        
        if data.get('validade'):
            produto.validade = datetime.strptime(data['validade'], '%Y-%m-%d').date()
        
        db.session.commit()
        return jsonify(produto.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def delete_produto(produto_id):
    try:
        produto = Produto.query.get_or_404(produto_id)
        db.session.delete(produto)
        db.session.commit()
        return jsonify({'message': 'Produto deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

