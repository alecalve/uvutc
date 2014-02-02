#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

    
@login_required
def index(request):
    return render(request, 'consult/index.html', locals())

@login_required
def help(request):
    return render(request, 'consult/help.html', locals())

@login_required
def demeter(request, num, spec, date):
    return render(request, 'demeter.html', locals())
