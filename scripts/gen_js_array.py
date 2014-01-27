#!/usr/bin/env python
# -*- coding: utf-8 -*-

from parse_uv import parse_uv
from parse_evals import parse_evals
import sys
import json
import codecs

uvs = parse_uv(sys.argv[1])
evals = parse_evals(uvs.keys(), sys.argv[2])
        
def getevals(uv):
    return [evaluation for evaluation in evals if evaluation["uv"] == uv]
            
for uv in uvs:
    uvs[uv]["evaluations"] = getevals(uv)

with codecs.open(sys.argv[3], "w") as f:
    f.write("var uvs = " + json.dumps(uvs) + ";")


