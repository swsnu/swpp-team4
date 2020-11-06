from rest_framework import serializers
from ...models import SnippetScope, SnippetAmount, SnippetBuy, SnippetSell


class SnippetScopeSerializer(serializers.ModelSerializer):
    """Serializer class for snippet scope"""

    class Meta:
        model = SnippetScope
        fields = ['code', 'name', 'author', 'is_shared']
        read_only_fields = ('create_at', 'update_at')


class SnippetBuySerializer(serializers.ModelSerializer):
    """Serializer class for snippet buy"""

    class Meta:
        model = SnippetBuy
        fields = ['code', 'name', 'author', 'is_shared']
        read_only_fields = ('create_at', 'update_at')


class SnippetSellSerializer(serializers.ModelSerializer):
    """Serializer class for snippet sell"""

    class Meta:
        model = SnippetSell
        fields = ['code', 'name', 'author', 'is_shared']
        read_only_fields = ('create_at', 'update_at')


class SnippetAmountSerializer(serializers.ModelSerializer):
    """Serializer class for snippet sell"""

    class Meta:
        model = SnippetAmount
        fields = ['code', 'name', 'author', 'is_shared']
        read_only_fields = ('create_at', 'update_at')
