from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^in/$', 'django_cas.views.login', name='cas_in'),
    url(r'^out/$', 'django_cas.views.logout', name='cas_out'),
    url(r'^/?', include('consult.urls')),
)
