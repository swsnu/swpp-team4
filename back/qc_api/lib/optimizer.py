import json
import re
from typing import List, Any
from hyperopt import fmin, tpe, hp, Trials
from celery import shared_task
from copy import copy
from ..lib.sandbox import SandBox
from ..models import Algorithm
from ..serializers import AlgorithmSerializer

algorithm_data = None


def extract_offsets(code: str) -> List[Any]:
    # code: AlgorithmSerializer(Algorithm.objects.get(pk=algo_id)).data
    # .get("snippet_scope_data").get("code")
    offsets = [(i.start(), i.end()) for i in re.finditer(r'@([0-9.]*)', code)]
    len_list = [(i[1] - i[0] - 1) for i in offsets]
    offsets = [offset[0] for offset in offsets]

    cnt = 0
    offset_update = 0
    for offset in offsets:
        code = code[:offset + 1 - offset_update] + code[offset + 1 + len_list[cnt] - offset_update:]
        offsets[cnt] = offset - offset_update
        offset_update = offset_update + len_list[cnt]
        cnt = cnt + 1

    return [code, offsets]


def insert_params_to_code(params):  # params: {offset: num}
    global algorithm_data
    snippet_scope = algorithm_data["snippet_scope_data"]["code"]
    offset_update = 0
    for item in params.items():
        snippet_scope = snippet_scope[:int(item[0]) + 1 + offset_update] + str(item[1]) + \
                        snippet_scope[int(item[0]) + 1 + offset_update:]
        offset_update = offset_update + len(str(item[1]))
    algorithm_data["snippet_scope_data"]["code"] = snippet_scope


def insert_params_non_global(offsets, params, code):
    offset_update = 0
    for index, param in enumerate(params):
        code = code[:int(offsets[index]) + 1 + offset_update] + str(param) + \
                        code[int(offsets[index]) + 1 + offset_update:]
        offset_update = offset_update + len(str(param))
    return code


def pre_change_global():
    global algorithm_data
    algorithm_data = AlgorithmSerializer(Algorithm.objects.get(pk=2)).data


def change_global():
    global algorithm_data
    algorithm_data["snippet_scope_data"]["code"] = "dick_length>@ and dick_width<@"


def post_global():
    print(algorithm_data["snippet_scope_data"]["code"])


def objective_func(params):
    # params = {
    #     'x': params['x'],
    #     'y': params['y']
    # }
    #  offsets = params.keys()
    global algorithm_data
    prev_snippet_scope = algorithm_data["snippet_scope_data"]["code"]
    insert_params_to_code(params)
    sandbox = SandBox(budget=1000000, start='2020-07-05', end='2020-08-05', algorithm=algorithm_data,
                      mode='optimization', performance=None)
    algorithm_data["snippet_scope_data"]["code"] = prev_snippet_scope  # reset the snippet_scope
    print("loss at obj func!!!!!!!!!!!!!!", sandbox.get_opt_loss())
    return sandbox.get_opt_loss()


def optimize(offsets: List[int], var_scopes: List[int], algo_data: AlgorithmSerializer.data):
    global algorithm_data
    algorithm_data = algo_data

    if 2 * len(offsets) != len(var_scopes):  # When the number of search space doesn't match the number of variables
        # set opt_status to ERROR
        return

    # Build search space dictionary out of var scope
    space = {}
    for i in range(len(offsets)):
        space[str(offsets[i])] = hp.uniform(str(offsets[i]), var_scopes[i], var_scopes[i + 1])
    print("space!!!!!", space)
    # Initialize Trials instance for optimization logging
    trials = Trials()

    n_iter = 15

    best = fmin(fn=objective_func,  # function to optimize
                space=space,
                algo=tpe.suggest,  # optimization algorithm, hyperotp will select its parameters automatically
                max_evals=n_iter,  # maximum number of iterations
                trials=trials,  # logging
                )

    print(best)
    return best, (-1)*min([result['loss'] for result in trials.results])

