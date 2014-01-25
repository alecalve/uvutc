#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import json
from parser import contents

"""Q 1 Clarté des objectifs et du programme de l'UV
Q 2 Ma maîtrise des antécédents et pré-requis nécessaires Oui
Q 3 Qualité pédagogique de l'équipe enseignante Oui
préparation, clarté, efficacité, interêt, disponibilité, ...
Q 4 Articulation et cohérence des activités
Q 5 Qualité des supports pédagogiques
Q 6 Adéquation des moyens matériels
Q 7 Adéquation des contrôles et des évaluations
Q 8 Quantité de travail demandée
Q 9 Mon appréciation globale de l'UV """

#Here be dragons

def chunk(liste, length):
    for i in range(0,len(liste), length):
        yield liste[i:i+length]


def clean(data):
    return map(str.strip, data.split(";"))

def ponderate(i):
    if i > 1:
        return i-1
    else:
        return i-2

def note(question):
    notes = question[3:]
    assert(len(notes) %2 == 0)
    n = 0
    for i, part in enumerate(chunk(notes, 2)):
        percent = float(part[1][:-1])/100
        n += ponderate(i)*percent*5
        
    n = 10 + round(n, 2)
    return n

def parse(data, uvs):
    questions = map(clean, data)
    fields = {}
    fields["uv"] = questions[0][0]
    if fields["uv"] not in uvs:
        return None
    fields["reponses"] = questions[0][2]
    fields["clarte"] = round(note(questions[0]), 2)
    fields["prerequis"] = round(note(questions[1]), 2)
    fields["equipe"] = round(note(questions[2]), 2)
    fields["coherence"] = round(note(questions[3]), 2)
    fields["supports"] = round(note(questions[4]), 2)
    fields["moyens"] = round(note(questions[5]), 2)
    fields["evaluation"] = round(note(questions[6]), 2)
    fields["travail"] = round(note(questions[7]), 2)
    fields["appreciation"] = round(note(questions[8]), 2)
    return fields
        
def comp_semestre(x, y):
    a = "".join([x.split('.')[0][-5], x.split('.')[0][-2:]])
    b = "".join([y.split('.')[0][-5], y.split('.')[0][-2:]])
    return _comp_semestre(a, b)

def _comp_semestre(x, y):
    ax = int(x[-2:])
    ay = int(y[-2:])
    if (ax == ay):
        if x[0] == "P":
            return -1
        else:
            return 1
    else:
        return cmp(ax, ay)

def parse_evals(uvs, directory):
    evals = []
    for content in contents(directory, ".CSV"):
        semestre = "".join([content['filename'].split('.')[0][-5], content['filename'].split('.')[0][-2:]])
        data = filter(None, content["data"].split("\n")[1:])
        n = len(data)/9.
        for uv in chunk(data, 9):
            ev = parse(uv, uvs)
            if ev is not None:
                ev["semestre"] = semestre
                evals.append(ev)
    return evals
