from django.conf.urls import patterns, include, url


urlpatterns = patterns('consult.views',
    url(r'^/?$', 'index', name='index'),
)
