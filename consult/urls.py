from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('consult.views',
    url(r'^/?$', 'index', name='index'),
    url(r'^help?$', 'help', name='help'),
    url(r'^admin/', include(admin.site.urls)),
)
