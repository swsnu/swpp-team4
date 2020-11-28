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
from qc_api.models import Algorithm, Report
from qc_api.serializers import AlgorithmSerializer, ReportSerializer
from qc_api.util.decorator import catch_bad_request
from ...util.utility import parse_date
import json


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def get_my_algorithms(request: Request) -> Response:
    """api endpoint for user-personalized algorithms"""
    my_algorithms = Algorithm.objects.filter(author=request.user.id)
    serializer = AlgorithmSerializer(my_algorithms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


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
    budget = request.data.get("budget")
    algorithm = Algorithm.objects.get(pk=request.data.get("algo_id"))
    algorithm_data = AlgorithmSerializer(algorithm).data
    start, end = parse_date(request.data.get("start")), parse_date(request.data.get("end"))
    sandbox = SandBox(budget=budget, start=start, end=end, algorithm=algorithm_data)
    report_data = sandbox.report
    report_data["transaction_log"] = str(report_data["transaction_log"])
    report_data["daily_profit"] = str(report_data["daily_profit"])
    report_data.update({
        "algorithm": algorithm.id,
        "optional_stat": "N/A",
        "start_date": start,
        "end_date": end,
        "initial_budget": budget
    })
    serializer = ReportSerializer(data=report_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
