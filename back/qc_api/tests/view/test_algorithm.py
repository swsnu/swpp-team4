"""
test_algorithm.py
"""
from django.test import TestCase, Client
from ..models import Algorithm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, APIClient
import json


class AlgorithmTestCase(TestCase):
    """
    Tests for Algorithm views
    """

    def setUp(self) -> None:
        """ Setup """
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def test_algorithm_list_api_no_login(self):
        """Test for /algo GET and POST in not logged in state"""
        client = APIClient()
        response = client.get('/api/algo')
        print(response.get("data"))
        self.assertEqual(response.status_code, 403)
