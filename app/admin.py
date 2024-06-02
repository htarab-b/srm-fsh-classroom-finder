from django.contrib import admin
from .models import *

# User:
admin.site.register(StaffUser)

# Models:
admin.site.register(Class)
admin.site.register(Staff)
admin.site.register(Subject)
admin.site.register(Period)
admin.site.register(DayOrder)