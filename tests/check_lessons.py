"""Run lesson code with Python, NumPy, pandas and Matplotlib. --real also downloads UCI Iris."""
import contextlib
import io
import json
import os
import subprocess
import sys
import warnings
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
os.environ['MPLBACKEND'] = 'Agg'
warnings.filterwarnings('ignore')
script = "import {coreLessons,realProjects} from './core-lessons.js'; console.log(JSON.stringify({coreLessons,realProjects}))"
result = subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT)
data = json.loads(result.decode('utf-8'))


def execute(code, name):
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(compile(code, name, 'exec'), {})
    return output.getvalue()


for name, lesson in data['coreLessons'].items():
    output = execute(lesson['code'], name)
    if name == 'numpy':
        assert '(3, 2)' in output and '[3. 4.]' in output and '0.9' in output
    elif name == 'pandas':
        assert '73.0' in output and 'NaN' in output
    elif name == 'sql':
        assert "('A', 3, 2)" in output
    elif name == 'stat':
        assert output.split() == ['4','2','19']
    elif name == 'sampling':
        values = list(map(float,output.split()))
        assert len(values) == 2 and 68 <= values[0] <= values[1] <= 74
    elif name == 'regression':
        assert output.split() == ['4.6667','-9.3333','1.9333']
    elif name == 'classification':
        assert output.split() == ['1','1','1','0.5','0.5']
    print(name, 'virtual example OK')

if '--real' in sys.argv:
    import urllib.request
    import pandas as pd
    url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
    with urllib.request.urlopen(url,timeout=20) as response:
        source = response.read()
    original = pd.read_csv
    def cached(input, *args, **kwargs):
        return original(io.BytesIO(source) if input == url else input, *args, **kwargs)
    pd.read_csv = cached
    for name, project in data['realProjects'].items():
        output = execute(project['code'], name+'-iris')
        if name == 'numpy':
            assert '(150, 4)' in output
        elif name == 'sql':
            assert 'Iris-setosa' in output and '50' in output
        elif name == 'regression':
            assert '120 30' in output
        elif name == 'classification':
            assert 'precision:' in output and 'recall:' in output
        print(name, 'Iris project OK')
