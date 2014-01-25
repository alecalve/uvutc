#!/usr/bin/env python
# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
from parser import contents

def parse_uv(directory):
    uvs = {}

    for content in contents(directory, ".show"):
        
        branche = content['filename'].split('.')[0][:-1]
        semestre = "automne" if content['filename'].split('.')[0][-1] == 'A' else "printemps"
        soup = BeautifulSoup(content["data"])
        father = soup.tbody
        luvs = father.find_all('tr')
        for uv in luvs:
            cells = uv.find_all('td')
            if not uvs.has_key(uv.td.text):
                fields = {}
                fields['code'] = uv.td.text
                fields['places'] = cells[1].text
                fields['nom'] = cells[4].text
                fields['ects'] = "0" if len(cells[5].text) == 0 else cells[5].text.replace("-", "0")
                fields['cours'] = float(cells[6].text.replace("-", "0").replace(",", ".")) 
                fields['td'] = float(cells[7].text.replace("-", "0").replace(",", ".")) 
                fields['tp'] = "oui" if float(cells[8].text.replace("-", "0").replace(",", ".")) else "non"
                fields['final'] = "oui" if cells[9].text == 'Oui' else "non"
                fields['cat'] = cells[10].text
                fields['resp'] = cells[11].text
                fields['branches'] = [branche]
                fields['semestres'] = [semestre]
                uvs[fields['code']] = fields
            else:
                uv = uvs[uv.td.text]
                if branche not in uv['branches']:
                    uv['branches'].append(branche)
                if semestre not in uv['semestres']:
                    uv['semestres'].append(semestre)
    return uvs

