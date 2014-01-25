from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'uvutc.views.home', name='home'),
    url(r'^consult/', include('consult.urls')),

    url(r'^in/$', 'django_cas.views.login', name='cas_in'),
    url(r'^out/$', 'django_cas.views.logout', name='cas_out'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
