# Generated by Django 2.2.6 on 2019-11-28 17:44

from django.db import migrations
import versatileimagefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0112_auto_20191128_2158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='background_image',
            field=versatileimagefield.fields.VersatileImageField(blank=True, null=True, upload_to='brand-backgrounds'),
        ),
    ]