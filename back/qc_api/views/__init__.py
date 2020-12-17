""" views """
from .auth.auth_views import sign_in, sign_out, sign_up
from .snippet.snippet_views import get_or_post_liked_snippets, get_my_snippets, get_liked_snippets, \
    share_or_not_snippet, like_or_unlike_snippet, get_put_post_snippets
from .algorithm.algorithm_views import get_or_post_algorithms, run_backtest, get_my_algorithms, \
    share_or_delete_algorithm, run_optimization, get_sorted_algorithms
from .evaluation.report_views import get_reports_by_algo
from .evaluation.performance_views import get_performance_by_algo, get_all_performances
