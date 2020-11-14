""" Views regarding snippet model"""
from typing import Dict, Any

from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from qc_api.models import Snippet
from qc_api.serializers import SnippetSerializer, SnippetScopeSerializer, \
    SnippetBuySerializer, SnippetSellSerializer, SnippetAmountSerializer
from ...util.decorator import catch_bad_request


def type_extract(data) -> (str, Dict[str, Any]):
    """get request data and extract type"""
    try:
        snippet_type = data["type"]
        return snippet_type, data
    except KeyError:
        raise KeyError


def check_type_and_serialize_request(snippet_type: str, data: dict) -> ModelSerializer:
    """get snippet type and return snippet type"""
    if snippet_type == 'scope':
        serializer = SnippetScopeSerializer(data=data)
    elif snippet_type == 'buy':
        serializer = SnippetBuySerializer(data=data)
    elif snippet_type == 'sell':
        serializer = SnippetSellSerializer(data=data)
    else:  # snippet_type == amount
        serializer = SnippetAmountSerializer(data=data)
    return serializer


@api_view(['GET', 'POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@catch_bad_request
def get_or_post_snippets(request: Request) -> Response:
    """api endpoint for snippet lists"""
    if request.method == 'POST':
        snippet_type, checked_data = type_extract(request.data)
        checked_data.update({'author': request.user.id})
        serializer = check_type_and_serialize_request(snippet_type=snippet_type, data=checked_data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        snippets = Snippet.objects.filter(**request.query_params)
        response = SnippetSerializer(snippets, many=True)
        return Response(response.data, status=status.HTTP_200_OK)
