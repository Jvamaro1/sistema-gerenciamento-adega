from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Produto(db.Model):
    __tablename__ = 'produtos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    tipo_bebida = db.Column(db.String(50), nullable=False)
    fornecedor = db.Column(db.String(100), nullable=False)
    custo = db.Column(db.Float, nullable=False)
    valor_venda = db.Column(db.Float, nullable=False)
    validade = db.Column(db.Date, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'tipo_bebida': self.tipo_bebida,
            'fornecedor': self.fornecedor,
            'custo': self.custo,
            'valor_venda': self.valor_venda,
            'validade': self.validade.isoformat() if self.validade else None
        }

class EntradaEstoque(db.Model):
    __tablename__ = 'entradas_estoque'
    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    data = db.Column(db.Date, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    valor_compra = db.Column(db.Float, nullable=False)
    
    produto = db.relationship('Produto', backref='entradas')

    def to_dict(self):
        return {
            'id': self.id,
            'produto_id': self.produto_id,
            'data': self.data.isoformat(),
            'quantidade': self.quantidade,
            'valor_compra': self.valor_compra,
            'produto': self.produto.to_dict() if self.produto else None
        }

class SaidaEstoque(db.Model):
    __tablename__ = 'saidas_estoque'
    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    data = db.Column(db.Date, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    valor_venda = db.Column(db.Float, nullable=False)
    
    produto = db.relationship('Produto', backref='saidas')

    def to_dict(self):
        return {
            'id': self.id,
            'produto_id': self.produto_id,
            'data': self.data.isoformat(),
            'quantidade': self.quantidade,
            'valor_venda': self.valor_venda,
            'produto': self.produto.to_dict() if self.produto else None
        }

class TransacaoCaixa(db.Model):
    __tablename__ = 'transacoes_caixa'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)  # 'entrada' ou 'saida'
    descricao = db.Column(db.String(200), nullable=True)
    valor = db.Column(db.Float, nullable=False)
    data = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'valor': self.valor,
            'data': self.data.isoformat()
        }

