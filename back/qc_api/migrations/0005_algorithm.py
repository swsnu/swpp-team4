# Generated by Django 3.1.2 on 2020-11-09 17:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('qc_api', '0004_snippet_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Algorithm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('is_public', models.BooleanField(default=False)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='algorithms', to=settings.AUTH_USER_MODEL)),
                ('snippet_amount', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='algorithms', to='qc_api.snippetamount')),
                ('snippet_buy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='algorithms', to='qc_api.snippetbuy')),
                ('snippet_scope', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='algorithms', to='qc_api.snippetscope')),
                ('snippet_sell', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='algorithms', to='qc_api.snippetsell')),
            ],
        ),
    ]