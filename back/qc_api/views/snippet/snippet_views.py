from ...models import Snippet, SnippetSell, SnippetScope, SnippetBuy, SnippetAmount
from ...serializers import SnippetScopeSerializer, SnippetBuySerializer, SnippetSellSerializer, SnippetAmountSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def type_extract_and_delete(data):
    snippet_type = data.get("type")
    del data["type"]
    return snippet_type, data


@api_view(['GET', 'POST'])
def get_or_post_snippets(request):
    if request.method == 'POST':
        snippet_type, checked_data = type_extract_and_delete(request.data)

        if snippet_type == 'scope':
            serializer = SnippetScopeSerializer(checked_data)
        elif snippet_type == 'buy':
            serializer = SnippetBuySerializer(checked_data)
        elif snippet_type == 'sell':
            serializer = SnippetSellSerializer(checked_data)
        else:
            serializer = SnippetAmountSerializer(checked_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



