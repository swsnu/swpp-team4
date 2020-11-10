""" views """
from .auth.auth_views import sign_in, sign_out, sign_up
from .snippet.snippet_views import get_or_post_snippets
from .algorithm.algorithm_views import get_or_post_algorithms, run_backtest
from .evaluation.report_views import get_reports_by_algo
from .evaluation.performance_views import get_performance_by_algo, get_all_performances
