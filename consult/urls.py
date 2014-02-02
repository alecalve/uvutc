from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('consult.views',
    url(r'^/?$', 'index', name='index'),
    url(r'^help$', 'help', name='help'),
    url(r'^(?P<num>\d{1,5})/(?P<spec>\d{2,4})/(?P<date>\d{6})/$', 'demeter', name='demeter'),
    url(r'^admin/', include(admin.site.urls)),
)
