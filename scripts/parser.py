# -*- coding: utf-8 -*-

import json
import os
import sys

class hashabledict(dict):
    def __hash__(self):
        it = list()
        for i in self.items():
            if type(i[1]) == list:
                i = list(i)
                i[1] = tuple(i[1])
                i = tuple(i)
            it.append(i)
        return hash(tuple(sorted(it)))
        
forbidden = ['TC00', 'ZT90']

def clean_date(date):
    dates = date.split("-")
    date0 = dates[0].split(":")
    date1 = dates[1].split(":")
    diff = int(date1[0])*60 + int(date1[1]) - (int(date0[0])*60 + int(date0[1]))
    if len(dates[0]) <5:
        dates[0] = "0"+dates[0]
    return  dates[0], diff

def dump(content, model, filename, fk=True):
    dump = []
    
    for num, element in enumerate(content):
        temp = {}
        temp['pk'] = num if fk else None
        temp['model'] = model
        fields = element
        temp['fields'] = fields
        dump.append(temp)

    content = json.dumps(dump, indent=4, separators=(' , ', ' : '))
    out = open(filename, "w")
    out.write(content)
    out.close()

def contents(directory, extension):
    """ Générateur donnant le contenu des fichiers du répertoire à parser """
    for path, dirs, files in os.walk(directory):
        for ind, login in enumerate(files):
            if login.endswith(extension):
                with open(os.path.join(path, login), "r") as edt:
                        data = edt.read()
                        edt.close()
                yield {"data": data, "filename": login}
