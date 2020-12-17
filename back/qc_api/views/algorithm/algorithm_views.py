"""
    algorithm views
"""
# pylint: disable=E0401, E5142, R1705, C0116, W0702, C0103

import datetime
import json

from functools import reduce
from celery import shared_task
from django.contrib.auth.models import User
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from webpush import send_user_notification

from qc_api.lib import SandBox
from qc_api.lib.optimizer import extract_offsets, optimize, insert_params_non_global
from qc_api.models import Algorithm, Performance, Snippet
from qc_api.serializers import AlgorithmSerializer
from qc_api.util.decorator import catch_bad_request


def parse_sorted_algos(algo: dict, perf: dict, index: int) -> dict:
    user = User.objects.filter(id=algo['author_id']).values()
    return {
        "rank": index,
        "id": algo["id"],
        "name": algo["name"],
        "author": user[0]["username"], # TODO need to have author name instead
        "description": algo["description"],
        "profit": perf["profit"]
    }

@api_view(['GET'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
def get_sorted_algorithms(request: Request) -> Response:
    """
    Get list of sorted algorithm for leaderboard display.
    Sorting criteria:
    """
    public_algos = Algorithm.objects.filter(is_public=True).order_by("id").values()
    performances = Performance.objects.filter(algorithm__is_public=True).order_by("algorithm_id").values()
    print(public_algos[0])
    print(performances[0]["profit"])
    sorted_list = [(algo, perf) for perf, algo in
                   sorted(zip(performances, public_algos), key=lambda pair: pair[0]['profit'], reverse=True)]
    response = [parse_sorted_algos(pair[0], pair[1], index) for index, pair in enumerate(sorted_list)]
    return Response(response, status=status.HTTP_200_OK)


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
        variables = list(Snippet.objects.filter(pk__in=[
            data.get("snippet_scope"), data.get("snippet_buy"), data.get("snippet_sell"), data.get("snippet_amount")
        ]).values_list("variables"))  # [('["var1", "var2", "var3",...]',),...]
        variables = [json.loads(var[0]) for var in variables]
        variables = reduce(lambda x, y: x+y, variables)
        data.update({'author': request.user.id, 'variables': json.dumps(variables)})
        serializer = AlgorithmSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        response = AlgorithmSerializer(Algorithm.objects.all(), many=True)
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


@shared_task
def opt_helper(algo_id: int, req_data: str, user_id: int):
    algorithm = Algorithm.objects.get(pk=algo_id)
    algorithm.optimization = "pending"
    algorithm.save()
    algorithm_data = AlgorithmSerializer(algorithm).data
    algorithm_data["id"] = algo_id
    var_scopes = list(json.loads(req_data).values())
    preprocessed_code, offsets = extract_offsets(algorithm_data["snippet_scope_data"]["code"])
    print("offsets at opt helper!!!!!!!!!!!!!!!!!!!!!", offsets)
    algorithm_data["snippet_scope_data"]["code"] = preprocessed_code
    # offsets: [...(offset: @의 위치)...] , snippet_scope 의 @뒤 숫자들은 모두 삭제된 상태.
    best, loss = optimize(offsets, var_scopes, algorithm_data)
    new_code = insert_params_non_global(offsets, list(best.values()), preprocessed_code)
    optimization = {
        "parameters": json.dumps(best),
        "profit": json.dumps(loss),
        "new_code": json.dumps(new_code)
    }
    algorithm.optimization = str(optimization)
    algorithm.save()
    user = User.objects.get(pk=user_id)
    payload = {'head': "Optimization is Over!!!", 'body': 'Click "view" to see detailed report of your backtest'}
    send_user_notification(user=user, payload=payload, ttl=100)


@api_view(['GET', 'POST'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def run_optimization(request: Request, algo_id) -> Response:
    if request.method == 'POST':
        print("algo_id", algo_id)
        print(request.data)
        # sandbox 에 넘겨주기 전에 algorithm_data를 손봐주자!

        opt_helper.delay(algo_id, json.dumps(request.data), request.user.id)
        # var_scopes = list(request.data.values())
        # opt_helper.delay(json.dumps(offsets), json.dumps(var_scopes), code)
        #
        return Response("optimization successfully initiated", status=status.HTTP_200_OK)
    else:
        algorithm = Algorithm.objects.get(pk=algo_id)
        return Response(algorithm.optimization, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def test_performance(request: Request):
#     run_daily_performance()
#     return Response("successfully tested performance", status=status.HTTP_200_OK)


# Check if performance task exists, and add it if it doesnt
try:
    PeriodicTask.objects.get(name='daily_performance_test')
    kk = PeriodicTask.objects.get(name='daily_performance_test')
    kk.interval.every = 600
    kk.interval.save()
except:
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=600,
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
    run_helper.delay(budget, algo_id, request.data.get("start"), request.data.get("end"), request.user.id)
    return Response("successfully running backtest", status=status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
def share_or_delete_algorithm(request: Request, algo_id) -> Response:
    if request.method == 'PUT':
        body = request.body.decode()
        public = json.loads(body)['public']
        algo = Algorithm.objects.get(id=algo_id)
        print(algo.is_public)
        algo.is_public = not algo.is_public
        #if public:
        #    algo.is_public = True
        #else:
        #    algo.is_public = False
        algo.save()
        algo2 = Algorithm.objects.get(id=algo_id)
        print(algo2.is_public)
        serializer = AlgorithmSerializer(algo)
        return Response(serializer.data, status.HTTP_200_OK)
    else:
        algo = Algorithm.objects.get(id=algo_id)
        algo.delete()
        return Response(status.HTTP_204_NO_CONTENT)
