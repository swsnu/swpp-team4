""" Serialization utils for Snippet models """
from rest_framework import serializers
from ...models import Snippet, SnippetScope, SnippetAmount, SnippetBuy, SnippetSell


class SnippetSerializer(serializers.ModelSerializer):
    """Serializer class for generic snippet class"""
    class Meta:
        model = Snippet
        fields = ['id', 'code', 'name', 'description', 'author', 'is_shared', 'type', 'create_at', 'update_at']
        read_only_fields = ('id', 'create_at', 'update_at')


class SnippetScopeSerializer(serializers.ModelSerializer):
    """Serializer class for snippet scope"""

    class Meta:
        model = SnippetScope
        fields = ['id', 'code', 'name', 'description', 'author', 'is_shared', 'type']
        read_only_fields = ('id', 'create_at', 'update_at')


class SnippetBuySerializer(serializers.ModelSerializer):
    """Serializer class for snippet buy"""

    class Meta:
        model = SnippetBuy
        fields = ['id', 'code', 'name', 'description', 'author', 'is_shared', 'type']
        read_only_fields = ('id', 'create_at', 'update_at')


class SnippetSellSerializer(serializers.ModelSerializer):
    """Serializer class for snippet sell"""

    class Meta:
        model = SnippetSell
        fields = ['id', 'code', 'name', 'description', 'author', 'is_shared', 'type']
        read_only_fields = ('id', 'create_at', 'update_at')


class SnippetAmountSerializer(serializers.ModelSerializer):
    """Serializer class for snippet sell"""

    class Meta:
        model = SnippetAmount
        fields = ['id', 'code', 'name', 'description', 'author', 'is_shared', 'type']
        read_only_fields = ('id', 'create_at', 'update_at')
