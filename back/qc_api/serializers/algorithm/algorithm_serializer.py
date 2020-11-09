from rest_framework import serializers
from ...models import Snippet, SnippetScope, SnippetAmount, SnippetBuy, SnippetSell, Algorithm


class AlgorithmSerializer(serializers.ModelSerializer):
    """Serializer class for Algorithm"""
    class Meta:
        model = Algorithm
        fields = ['name', 'description', 'author', 'is_public', 'snippet_scope', 'snippet_sell', 'snippet_buy',
                  'snippet_amount', 'create_at', 'update_at']
        read_only_fields = ('create_at', 'update_at')
