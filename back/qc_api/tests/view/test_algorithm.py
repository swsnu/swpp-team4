"""
test_algorithm.py
"""
from django.test import TestCase, Client
from ...models import Algorithm
from ..utils import get_mock_algo
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import json


class AlgorithmTestCase(TestCase):
    """
    Tests for Algorithm views
    """

    def setUp(self) -> None:
        """ Setup """
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def tearDown(self) -> None:
        """ tearDown: called after every test:
                delete all previously generated mock algorithms
            """
        Algorithm.objects.all().delete()

    def test_algorithm_list_api_not_logged_in(self):
        """Test for /algo GET in not logged in state"""
        new_client = Client()
        response = new_client.get('/api/algo')
        self.assertEqual(response.status_code, 403)

    def test_algorithm_list_api_logged_in(self):
        """Test for /algo GET in logged in state"""
        algorithm = get_mock_algo(name="mock_algo")
        algorithm.save()
        response = self.client.get('/api/algo')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get("name"), "mock_algo")

    def test_algorithm_list_valid_post(self):
        """Test for /algo POST with valid """