# Generated by Django 3.1.2 on 2020-11-04 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qc_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Kosdaq',
            fields=[
                ('date', models.DateField(primary_key=True, serialize=False)),
                ('close', models.DecimalField(decimal_places=3, max_digits=8)),
                ('open', models.DecimalField(decimal_places=3, max_digits=8)),
                ('high', models.DecimalField(decimal_places=3, max_digits=8)),
                ('low', models.DecimalField(decimal_places=3, max_digits=8)),
                ('volume', models.FloatField()),
                ('d1_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
            ],
            options={
                'db_table': 'kosdaq',
                'ordering': ['-pk'],
            },
        ),
        migrations.CreateModel(
            name='StockData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('code', models.CharField(max_length=10)),
                ('code_name', models.CharField(max_length=50)),
                ('d1_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('close', models.IntegerField()),
                ('open', models.IntegerField()),
                ('high', models.IntegerField()),
                ('low', models.IntegerField()),
                ('volume', models.IntegerField()),
                ('clo5', models.IntegerField()),
                ('clo10', models.IntegerField()),
                ('clo20', models.IntegerField()),
                ('clo40', models.IntegerField()),
                ('clo60', models.IntegerField()),
                ('clo80', models.IntegerField()),
                ('clo100', models.IntegerField()),
                ('clo120', models.IntegerField()),
                ('clo5_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo10_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo20_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo40_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo60_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo80_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo100_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('clo120_diff_rate', models.DecimalField(decimal_places=3, max_digits=6)),
                ('yes_clo_5', models.IntegerField()),
                ('yes_clo_10', models.IntegerField()),
                ('yes_clo_20', models.IntegerField()),
                ('yes_clo_40', models.IntegerField()),
                ('yes_clo_60', models.IntegerField()),
                ('yes_clo_80', models.IntegerField()),
                ('yes_clo_100', models.IntegerField()),
                ('yes_clo_120', models.IntegerField()),
                ('vol5', models.IntegerField()),
                ('vol10', models.IntegerField()),
                ('vol20', models.IntegerField()),
                ('vol40', models.IntegerField()),
                ('vol60', models.IntegerField()),
                ('vol80', models.IntegerField()),
                ('vol100', models.IntegerField()),
                ('vol120', models.IntegerField()),
            ],
            options={
                'db_table': 'stock_data',
                'ordering': ['-pk'],
            },
        ),
        migrations.RemoveField(
            model_name='kospi',
            name='id',
        ),
        migrations.AlterField(
            model_name='kospi',
            name='date',
            field=models.DateField(primary_key=True, serialize=False),
        ),
    ]
