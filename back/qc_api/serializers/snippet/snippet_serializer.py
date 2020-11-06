from rest_framework import serializers
from ...models import Snippet


class SnippetSerializer(serializers.ModelSerializer):
    """Serializer class for snippets"""
    class Meta:
        model = Snippet
        fields = []

