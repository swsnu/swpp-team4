from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from ...models import Snippet
from ...serializers import SnippetSerializer, SnippetScopeSerializer, SnippetBuySerializer, SnippetSellSerializer, SnippetAmountSerializer
from ...util.decorator import catch_bad_request
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from typing import Dict, Any


def type_extract(data) -> (str, Dict[str, Any]):
    """get request data and extract type"""
    try:
        snippet_type = data.get("type")
        return snippet_type, data
    except KeyError:
        raise KeyError


def check_type_and_serialize_request(snippet_type: str, data: dict) -> Any:
    """get snippet type and return snippet type"""
    if snippet_type == 'scope':
        serializer = SnippetScopeSerializer(data=data)
    elif snippet_type == 'buy':
        serializer = SnippetBuySerializer(data=data)
    elif snippet_type == 'sell':
        serializer = SnippetSellSerializer(data=data)
    else:
        serializer = SnippetAmountSerializer(data=data)
    return serializer


@api_view(['GET', 'POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@catch_bad_request
def get_or_post_snippets(request: Any) -> Any:
    """api endpoint for snippet lists"""
    if request.method == 'POST':
        snippet_type, checked_data = type_extract(request.data)
        checked_data.update({'author': request.user.id})
        serializer = check_type_and_serialize_request(snippet_type=snippet_type, data=checked_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        snippets = Snippet.objects.filter(**request.query_params)
        response = SnippetSerializer(snippets, many=True)
        return Response(response.data, status=status.HTTP_200_OK)
