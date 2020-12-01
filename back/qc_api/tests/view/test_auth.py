"""
test_auth.py
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase

from ..utils import get_signed_in_client


class AlgorithmTestCase(TestCase):
    """
    Tests for Auth views
    """

    def tearDown(self) -> None:
        """ tearDown: called after every test:
                delete all previously generated mock users
            """
        User.objects.all().delete()

    def test_signup(self):
        """test signup"""
        response = self.client.post('/api/sign_up',
                                    json.dumps({'username': 'test', 'password': 'test', 'email': 'test'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_signin_before_signup(self):
        """test signin without signing up"""
        response = self.client.post('/api/sign_in', json.dumps({'username': 'test', 'password': 'test'})
                                    , content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_signin_after_signup(self):
        """test signin with signing up"""
        client = get_signed_in_client(username='test', password='test')
        response = client.post('/api/sign_in', json.dumps({'username': 'test', 'password': 'test'})
                               , content_type='application/json')
        self.assertEqual(response.status_code, 204)

    def test_logout(self):
        """test logout"""
        client = get_signed_in_client(username='test', password='test')
        response = client.get('/api/sign_out')
        self.assertEqual(response.status_code, 204)
