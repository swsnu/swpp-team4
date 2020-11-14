""" Test apps """
from django.apps import apps
from django.test import TestCase
from qc_api.apps import QcApiConfig


class QcApiConfigTest(TestCase):
    """ Test configurations. """
    def test_apps(self):
        """ Default testing method. """
        self.assertEqual(QcApiConfig.name, 'qc_api')
        self.assertEqual(apps.get_app_config('qc_api').name, 'qc_api')
