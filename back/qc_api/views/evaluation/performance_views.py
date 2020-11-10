""" Views regarding Performance model """
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from qc_api.models import Performance
from qc_api.serializers import PerformanceSerializer
from qc_api.util.decorator import catch_bad_request


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@catch_bad_request
def get_all_performances(request: Request) -> Response:
    """
    Return all performances registered in the server.
    Parameters:
        request: HTTP Request.
    Returns:
        An HTTP Response containing the list of performances of all algorithms
        The algorithm should be declared 'public' to be returned.
        Filtered algorithms are sorted in the descending order by the value of alpha.
    """
    performances = Performance.objects\
        .filter(**request.query_params, algorithm__is_public=True) \
        .order_by('-alpha')
    serializer = PerformanceSerializer(performances, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@catch_bad_request
def get_performance_by_algo(request: Request, algo_id: int) -> Response:
    """
    Given an algorithm, returns the simulation performance corresponding to it.
    Parameters:
        request: HTTP Request.
        algo_id: Algorithm Id to query.
    Returns:
        An HTTP Response containing list of serialized Performance model
        (type: Dict[str: ANY]) as its data.
    """
    try:
        performance = Performance.objects.get(**request.query_params, algorithm=algo_id)
    except Performance.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = PerformanceSerializer(performance)
    return Response(serializer.data, status=status.HTTP_200_OK)
