# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-08 14:14
from __future__ import unicode_literals

import django.db.models.deletion
import django.utils.timezone
import django_countries.fields
from django.db import migrations, models

import kaavish.account.models


class Migration(migrations.Migration):

    dependencies = [("account", "0015_auto_20171213_0734")]

    replaces = [("userprofile", "0016_auto_20180108_0814")]

    operations = [
        migrations.AlterField(
            model_name="address",
            name="city",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="address",
            name="city_area",
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name="address",
            name="company_name",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="address",
            name="country",
            field=django_countries.fields.CountryField(max_length=2),
        ),
        migrations.AlterField(
            model_name="address",
            name="country_area",
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AlterField(
            model_name="address",
            name="first_name",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="address",
            name="last_name",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="address",
            name="phone",
            field=kaavish.account.models.PossiblePhoneNumberField(
                blank=True, default="", max_length=128
            ),
        ),
        migrations.AlterField(
            model_name="address",
            name="postal_code",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name="address",
            name="street_address_1",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="address",
            name="street_address_2",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AlterField(
            model_name="user",
            name="addresses",
            field=models.ManyToManyField(blank=True, to="account.Address"),
        ),
        migrations.AlterField(
            model_name="user",
            name="date_joined",
            field=models.DateTimeField(
                default=django.utils.timezone.now, editable=False
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="default_billing_address",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="account.Address",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="default_shipping_address",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="account.Address",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name="user", name="is_active", field=models.BooleanField(default=True)
        ),
        migrations.AlterField(
            model_name="user", name="is_staff", field=models.BooleanField(default=False)
        ),
    ]
