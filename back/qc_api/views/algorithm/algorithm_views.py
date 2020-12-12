"""
    algorithm views
"""
# pylint: disable=E0401, E5142, R1705, C0116,
import json

from celery import shared_task
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from django_celery_beat.models import PeriodicTask, IntervalSchedule

from qc_api.lib import SandBox
from qc_api.models import Algorithm, Report, Performance
from qc_api.serializers import AlgorithmSerializer, ReportSerializer
from qc_api.util.decorator import catch_bad_request
from celery import shared_task
from django.contrib.auth.models import User
from webpush import send_user_notification
import json
import datetime

from qc_api.util.utility import parse_date


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


@shared_task
def run_helper(budget, algo_id, start, end, user_id):
    print('start run_helper')
    algorithm = Algorithm.objects.get(pk=algo_id)
    algorithm_data = AlgorithmSerializer(algorithm).data
    algorithm_data["id"] = algorithm.id
    SandBox(budget=budget, start=start, end=end, algorithm=algorithm_data, mode='backtest', performance=None)
    user = User.objects.get(pk=user_id)
    payload = {'head': "Your Backtest is Over!!!", 'body': 'Click "view" to see detailed report of your backtest'}
    send_user_notification(user=user, payload=payload, ttl=100)


# @api_view(['GET'])
# def test_performance(request: Request):
#     run_daily_performance()
#     return Response("successfully tested performance", status=status.HTTP_200_OK)


# Check if performance task exists, and add it if it doesnt
try:
    PeriodicTask.objects.get(name='daily_performance_test')
except:
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=10,
        period=IntervalSchedule.SECONDS,
    )
    PeriodicTask.objects.create(
        interval=schedule,  # we created this above.
        name='daily_performance_test',  # simply describes this periodic task.
        task='qc_api.views.algorithm.algorithm_views.run_daily_performance',  # name of task.
    )

qwe = []


@shared_task
def run_daily_performance():
    print(len(qwe))
    q = datetime.datetime.strptime('2020-02-03', '%Y-%m-%d') + datetime.timedelta(days=len(qwe))
    qwe.append(True)
    for k in Algorithm.objects.all():
        daily_performance.delay(q.strftime('%Y-%m-%d'), k.id)


@shared_task
def daily_performance(performance_date, algorithm_id):
    print('daily_performance ' + performance_date)
    budget = 100000
    algorithm = Algorithm.objects.get(pk=algorithm_id)
    performance = None
    try:
        performance = Performance.objects.get(algorithm=algorithm)
    except:  # create performance
        performance = Performance.objects.create(
            algorithm=algorithm,
            name='',
            description='',
            alpha=0,
            profit=0,
            MDD=0,
            deposit=budget,
            curr_portfolio=json.dumps([]),
            transaction_log=json.dumps([]),
            max_min_dict=json.dumps({
                "regi": [100.0, "eq"],  # currVal>preVal=>gt, currVal<preVal=>lt, currVal=preVal=>eq
                "list": []
            }),
            profit_dict=json.dumps({}),
            scope=json.dumps([]),
        )
        performance.save()

    SandBox(budget=budget, start='2020-02-03', end=performance_date, algorithm=AlgorithmSerializer(algorithm).data,
            mode='performance', performance=performance)


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

    algo_id = request.data.get("algo_id")
    # algorithm = Algorithm.objects.get(pk=request.data.get("algo_id"))
    # algorithm_data = AlgorithmSerializer(algorithm).data
    # algorithm_data["id"] = algorithm.id
    # start, end = parse_date(request.data.get("start")), parse_date(request.data.get("end"))
    run_helper.delay(budget, algo_id, request.data.get("start"), request.data.get("end"), request.user.id)
    # SandBox(budget=budget, start=start, end=end, algorithm=algorithm_data)

    # report_data = sandbox.report
    # report_data["transaction_log"] = str(report_data["transaction_log"])
    # report_data["daily_profit"] = str(report_data["daily_profit"])
    # report_data.update({
    #     "algorithm": algorithm.id,
    #     "optional_stat": "N/A",
    #     "start_date": start,
    #     "end_date": end,
    #     "initial_budget": budget,
    #     "status": Report.BackTestStatus.DONE
    # })
    # serializer = ReportSerializer(data=report_data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    return Response("successfully running backtest", status=status.HTTP_200_OK)


# @shared_task
# def add_one_to_trillion():
#     array = []
#     for i in range(0, 100000000):
#         array.append(i)
#     sum_result = 0
#     for elm in array:
#         sum_result = sum_result+elm
#     print(sum_result)
#     user = User(username=sum_result, password=1234)
#     user.save()
#     return sum_result


# @api_view(['GET'])
# def sample_celery(request):
#     res = add_one_to_trillion.delay()
#     return Response(res.id, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def webpush_example(request):
#     user = User.objects.get(pk=request.user.id)
#     print(user)
#     print(request.data)
#     payload = {'head': "fuck yeah", 'body': 'test sucksexfull!!!!!'}
#     send_user_notification(user=user, payload=payload, ttl=1000)
#     return Response("notification sent!", status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def share_or_delete_algorithm(request: Request, algo_id=0) -> Response:
    if request.method == 'PUT':
        body = request.body.decode()
        public = json.loads(body)['public']
        algo = Algorithm.objects.get(id=algo_id)
        if public:
            algo.is_shared = True
        else:
            algo.is_shared = False
        algo.save()
        serializer = AlgorithmSerializer(algo)
        return Response(serializer.data, status.HTTP_200_OK)
    else:
        algo = Algorithm.objects.get(id=algo_id)
        algo.delete()
        return Response(status.HTTP_204_NO_CONTENT)
