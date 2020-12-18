# pylint: disable=R0201
""" Serialization utils for algorithm """
from typing import Dict, Any

from rest_framework import serializers

from qc_api.models import Algorithm
from qc_api.serializers import SnippetScopeSerializer, SnippetBuySerializer, \
    SnippetSellSerializer, SnippetAmountSerializer


class AlgorithmSerializer(serializers.ModelSerializer):
    """ Serializer class for Algorithm """
    #author_name = serializers.SerializerMethodField()
    snippet_scope_data = serializers.SerializerMethodField()
    snippet_sell_data = serializers.SerializerMethodField()
    snippet_buy_data = serializers.SerializerMethodField()
    snippet_amount_data = serializers.SerializerMethodField()
    snippet_scope_name = serializers.SerializerMethodField()
    snippet_sell_name = serializers.SerializerMethodField()
    snippet_buy_name = serializers.SerializerMethodField()
    snippet_amount_name = serializers.SerializerMethodField()

    class Meta:
        model = Algorithm
        fields = ['id', 'name', 'description', 'author', 'is_public', 'snippet_scope', 'snippet_sell', 'snippet_buy',
                  'snippet_amount', 'create_at', 'update_at', 'snippet_scope_data', 'snippet_sell_data',
                  'snippet_buy_data', 'snippet_amount_data', 'variables', 'optimization',
                  'snippet_scope_name', 'snippet_sell_name', 'snippet_buy_name', 'snippet_amount_name']
        read_only_fields = ('id','create_at', 'update_at', 'snippet_scope_data', 'snippet_sell_data',
                            'snippet_buy_data', 'snippet_amount_data')

    def get_snippet_scope_data(self, obj: Algorithm) -> Dict[str, Any]:
        """relational representation for snippet_scope"""
        return SnippetScopeSerializer(obj.snippet_scope).data

    def get_snippet_sell_data(self, obj: Algorithm) -> Dict[str, Any]:
        """relational representation for snippet_sell"""
        return SnippetSellSerializer(obj.snippet_sell).data

    def get_snippet_buy_data(self, obj: Algorithm) -> Dict[str, Any]:
        """relational representation for snippet_buy"""
        return SnippetBuySerializer(obj.snippet_buy).data

    def get_snippet_amount_data(self, obj: Algorithm) -> Dict[str, Any]:
        """relational representation for snippet_amount"""
        return SnippetAmountSerializer(obj.snippet_amount).data

    def get_snippet_scope_name(self, obj: Algorithm) -> str:
        """relational representation for snippet_scope"""
        return obj.snippet_scope.name

    def get_snippet_sell_name(self, obj: Algorithm) -> str:
        """relational representation for snippet_sell"""
        return obj.snippet_sell.name

    def get_snippet_buy_name(self, obj: Algorithm) -> str:
        """relational representation for snippet_buy"""
        return obj.snippet_buy.name

    def get_snippet_amount_name(self, obj: Algorithm) -> str:
        """relational representation for snippet_amount"""
        return obj.snippet_amount.name

    #def get_author_name(self, obj: Algorithm) -> str:
    #    """relational representation for author_name"""
    #    return obj.author.username
