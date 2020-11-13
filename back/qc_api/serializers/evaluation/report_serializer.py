""" Serialization utils for report model."""
from rest_framework import serializers
from qc_api.models import Report


class ReportSerializer(serializers.ModelSerializer):
    """ Serializer for Report Model"""

    def __init__(self, *args, **kwargs):
        super(ReportSerializer, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].read_only = True

    class Meta:
        model = Report
        fields = '__all__'
