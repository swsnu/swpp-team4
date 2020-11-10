"""
    algorithm views
"""
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from qc_api.lib import SandBox
from qc_api.models import Algorithm
from qc_api.serializers import AlgorithmSerializer
from qc_api.util.decorator import catch_bad_request
from ...util.utility import parse_date


@api_view(['GET', 'POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@catch_bad_request
def get_or_post_algorithms(request: Request) -> Response:
    """api endpoint for algorithm lists"""
    if request.method == 'POST':
        data = request.data
        data.update({'author': request.user.id})
        serializer = AlgorithmSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        algorithms = Algorithm.objects.filter(**request.query_params)
        response = AlgorithmSerializer(algorithms, many=True)
        return Response(response.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def run_backtest(request: Request) -> Response:
    """
    Initialize sandbox and run backtests.
    Returns:
        HttpResponse: with status 200.
    """
    budget, start, end = request.data.get("budget"),\
                         parse_date(request.data.get("start")), \
    budget, start, end = request.data.get("budget"), parse_date(request.data.get("start")), \
                         parse_date(request.data.get("end"))
    sandbox = SandBox(budget=budget, start=start, end=end, algorithm=0)
    return Response(sandbox.date_rows, status=status.HTTP_200_OK)
