from flask import Blueprint, request, jsonify
from src.models.adega import db, TransacaoCaixa
from datetime import datetime
from sqlalchemy import func

caixa_bp = Blueprint('caixa', __name__)

@caixa_bp.route('/caixa/transacoes', methods=['GET'])
def get_transacoes():
    try:
        transacoes = TransacaoCaixa.query.order_by(TransacaoCaixa.data.desc()).all()
        return jsonify([transacao.to_dict() for transacao in transacoes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@caixa_bp.route('/caixa/transacoes', methods=['POST'])
def create_transacao():
    try:
        data = request.get_json()
        
        transacao = TransacaoCaixa(
            tipo=data['tipo'],  # 'entrada' ou 'saida'
            descricao=data.get('descricao', ''),
            valor=float(data['valor']),
            data=datetime.strptime(data['data'], '%Y-%m-%d').date()
        )
        
        db.session.add(transacao)
        db.session.commit()
        
        return jsonify(transacao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@caixa_bp.route('/caixa/saldo', methods=['GET'])
def get_saldo():
    try:
        # Calcular saldo total
        entradas = db.session.query(func.sum(TransacaoCaixa.valor)).filter_by(tipo='entrada').scalar() or 0
        saidas = db.session.query(func.sum(TransacaoCaixa.valor)).filter_by(tipo='saida').scalar() or 0
        saldo_total = entradas - saidas
        
        return jsonify({
            'entradas': entradas,
            'saidas': saidas,
            'saldo_total': saldo_total
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@caixa_bp.route('/caixa/fluxo', methods=['GET'])
def get_fluxo_caixa():
    try:
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        query = TransacaoCaixa.query
        
        if data_inicio:
            query = query.filter(TransacaoCaixa.data >= datetime.strptime(data_inicio, '%Y-%m-%d').date())
        
        if data_fim:
            query = query.filter(TransacaoCaixa.data <= datetime.strptime(data_fim, '%Y-%m-%d').date())
        
        transacoes = query.order_by(TransacaoCaixa.data.desc()).all()
        
        # Calcular totais do período
        entradas = sum(t.valor for t in transacoes if t.tipo == 'entrada')
        saidas = sum(t.valor for t in transacoes if t.tipo == 'saida')
        
        return jsonify({
            'transacoes': [transacao.to_dict() for transacao in transacoes],
            'resumo': {
                'entradas': entradas,
                'saidas': saidas,
                'saldo_periodo': entradas - saidas
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

