# Generated by Django 2.2.3 on 2019-07-19 08:39

import django.contrib.postgres.fields.jsonb
from django.db import migrations

import kaavish.core.utils.json_serializer


class Migration(migrations.Migration):

    dependencies = [("product", "0095_auto_20190618_0842")]

    operations = [
        migrations.AddField(
            model_name="producttype",
            name="private_meta",
            field=django.contrib.postgres.fields.jsonb.JSONField(
                blank=True,
                default=dict,
                encoder=kaavish.core.utils.json_serializer.CustomJsonEncoder,
            ),
        ),
        migrations.AlterField(
            model_name="producttype",
            name="meta",
            field=django.contrib.postgres.fields.jsonb.JSONField(
                blank=True,
                default=dict,
                encoder=kaavish.core.utils.json_serializer.CustomJsonEncoder,
            ),
        ),
    ]