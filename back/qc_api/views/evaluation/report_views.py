""" Views regarding report model """
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from qc_api.models import Report
from qc_api.serializers import ReportSerializer
from qc_api.util.decorator import catch_bad_request


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@catch_bad_request
def get_report(request: Request, algo_id: int) -> Response:
    """
    Given an algorithm, returns the backtest reports corresponding to it.
    Parameters:
        request: HTTP Request.
        algo_id: Algorithm Id to query.
    Returns:
        An HTTP Response containing list of serialized Report model
        (type: List[Dict[str: ANY]]) as its data.
    """
    reports = Report.objects.filter(**request.query_params, algorithm=algo_id)
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
