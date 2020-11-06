from ...models import Snippet, SnippetSell, SnippetScope, SnippetBuy, SnippetAmount
from ...serializers import SnippetScopeSerializer, SnippetBuySerializer, SnippetSellSerializer, SnippetAmountSerializer
from ...util.decorator import catch_bad_request
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def type_extract_and_delete(data):
    try:
        snippet_type = data.get("type")
        del data["type"]
        return snippet_type, data
    except KeyError:
        raise KeyError


@api_view(['GET', 'POST'])
@catch_bad_request
def get_or_post_snippets(request):
    if request.method == 'POST':
        snippet_type, checked_data = type_extract_and_delete(request.data)

        if snippet_type == 'scope':
            serializer = SnippetScopeSerializer(data=checked_data)
        elif snippet_type == 'buy':
            serializer = SnippetBuySerializer(data=checked_data)
        elif snippet_type == 'sell':
            serializer = SnippetSellSerializer(data=checked_data)
        else:
            serializer = SnippetAmountSerializer(data=checked_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



