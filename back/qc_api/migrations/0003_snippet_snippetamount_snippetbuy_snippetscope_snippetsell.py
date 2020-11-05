# Generated by Django 3.1.2 on 2020-11-05 15:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
        ('qc_api', '0002_auto_20201105_0417'),
    ]

    operations = [
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.TextField()),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('is_shared', models.BooleanField(default=False)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='snippets', to=settings.AUTH_USER_MODEL)),
                ('liker', models.ManyToManyField(related_name='liked_snippets', to=settings.AUTH_USER_MODEL)),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_qc_api.snippet_set+', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='SnippetAmount',
            fields=[
                ('snippet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='qc_api.snippet')),
            ],
            options={
                'db_table': 'snippet_amount',
            },
            bases=('qc_api.snippet',),
        ),
        migrations.CreateModel(
            name='SnippetBuy',
            fields=[
                ('snippet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='qc_api.snippet')),
            ],
            options={
                'db_table': 'snippet_buy',
            },
            bases=('qc_api.snippet',),
        ),
        migrations.CreateModel(
            name='SnippetScope',
            fields=[
                ('snippet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='qc_api.snippet')),
            ],
            options={
                'db_table': 'snippet_scope',
            },
            bases=('qc_api.snippet',),
        ),
        migrations.CreateModel(
            name='SnippetSell',
            fields=[
                ('snippet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='qc_api.snippet')),
            ],
            options={
                'db_table': 'snippet_sell',
            },
            bases=('qc_api.snippet',),
        ),
    ]
