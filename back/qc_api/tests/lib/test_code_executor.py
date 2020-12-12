""" Testcases for Defensive Code Executor"""
# pylint: disable=C0116
from unittest.mock import patch

from django.test import TestCase

from ...lib import DefensiveCodeExecutor
from ..utils import mock_algo_ser_data


class DefensiveCodeExecutorTestCase(TestCase):
    """
    Tests for DefensiveCodeExecutor
    """

    def setUp(self):
        return

    def test_initialization(self):
        executor = DefensiveCodeExecutor()
        self.assertIsInstance(executor, DefensiveCodeExecutor)

    def test_pre_validate(self):
        user_code = mock_algo_ser_data["snippet_scope_data"]["code"]
        try:
            DefensiveCodeExecutor.pre_validate(user_code)
        except AssertionError:
            self.fail("exception occured.")

    def test_execute_without_failure(self):
        user_code = "print(\"hello\")"
        try:
            DefensiveCodeExecutor.execute(user_code, {}, {})
        except AssertionError:
            self.fail("exception occured.")

    def test_execute_with_exception(self):
        user_code = "print(hello)"
        result = DefensiveCodeExecutor.execute(user_code, {}, {})
        self.assertEqual(result, {})

    @patch('qc_api.lib.DefensiveCodeExecutor.post_validate')
    def test_execute_success_post_validate_fail(self, mock_post):
        user_code = "print(\"T\")"
        mock_post.return_value = False
        result = DefensiveCodeExecutor.execute(user_code, {}, {})
        self.assertEqual(result, {})

    def test_post_validate_not_subset(self):
        result = DefensiveCodeExecutor.post_validate({'a': 'a'}, {'b': 'b'})
        self.assertEqual(result, False)

    def test_post_validate_different_value_type(self):
        result = DefensiveCodeExecutor.post_validate({'a': 'a'}, {'a': []})
        self.assertEqual(result, False)

    def test_post_validate_check_list_elm(self):
        result = DefensiveCodeExecutor.post_validate({'a': []}, {'a': [1, '2']})
        self.assertEqual(result, False)

    def test_post_validate_right_case(self):
        result = DefensiveCodeExecutor.post_validate({'a': []}, {'a': [1, 2]})
        self.assertEqual(result, True)
        result2 = DefensiveCodeExecutor.post_validate({'a': []}, {'a': []})
        self.assertEqual(result2, True)
