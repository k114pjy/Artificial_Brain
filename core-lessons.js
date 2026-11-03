const commonSources = {
 numpy:['NumPy 공식 문서, Quickstart','https://numpy.org/doc/stable/user/quickstart.html'],
 pandas:['pandas 공식 문서, DataFrame 시작하기','https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html'],
 sql:['PostgreSQL 공식 문서, 테이블과 GROUP BY','https://www.postgresql.org/docs/current/queries-table-expressions.html'],
 viz:['Matplotlib 공식 문서, Pyplot tutorial','https://matplotlib.org/stable/tutorials/pyplot.html'],
 stat:['NIST/SEMATECH, 통계 핸드북: 대표값','https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm'],
 sampling:['NIST/SEMATECH, 통계 핸드북: 부트스트랩','https://www.itl.nist.gov/div898/handbook/eda/section3/bootplot.htm'],
 regression:['Google, Machine Learning Crash Course: Loss','https://developers.google.com/machine-learning/crash-course/linear-regression/loss'],
 classification:['Google, Machine Learning Crash Course: Accuracy, precision, recall','https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall'],
};

const irisSetup = `import pandas as pd
url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
columns = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']
iris = pd.read_csv(url, header=None, names=columns)`;
export const realProjects = {
 numpy: {task:'네 수치 열을 배열로 바꾸어 각 열의 평균과 배열의 차원을 확인합니다.', code:`${irisSetup}\nX = iris.iloc[:, :4].to_numpy()\nprint(X.shape)\nprint(X.mean(axis=0))`},
 pandas: {task:'결측값 수를 확인하고 품종별 꽃받침 길이 평균을 비교합니다. 단위는 cm입니다.', code:`${irisSetup}\nprint(iris.isna().sum())\nprint(iris.groupby('species')['sepal_length'].mean())`},
 sql: {task:'공개 자료를 임시 SQLite 테이블에 옮겨 품종별 관측 수와 평균을 SQL로 구합니다.', code:`${irisSetup}\nimport sqlite3\ncon = sqlite3.connect(':memory:')\niris.to_sql('iris', con, index=False)\nquery = 'SELECT species, COUNT(*), AVG(sepal_length) FROM iris GROUP BY species'\nprint(con.execute(query).fetchall())`},
 viz: {task:'전체 꽃받침 길이 분포를 그립니다. 축 단위와 구간 수를 바꾸었을 때의 차이도 확인하세요.', code:`${irisSetup}\nimport matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.hist(iris['sepal_length'], bins=10, edgecolor='black')\nax.set_xlabel('sepal length (cm)')\nax.set_ylabel('number of flowers')\nplt.show()`},
 stat: {task:'전체 자료의 꽃받침 길이에 대해 평균, 중앙값, 표본표준편차를 함께 살펴봅니다.', code:`${irisSetup}\nx = iris['sepal_length']\nprint('count:', x.count())\nprint('mean:', x.mean(), 'median:', x.median())\nprint('sample standard deviation:', x.std(ddof=1))`},
 sampling: {task:'Iris 관측값의 평균을 복원 추출해 봅니다. 편의상 수집된 이 자료가 임의의 붓꽃 모집단을 대표한다고 가정하지 마세요.', code:`${irisSetup}\nimport random\nfrom statistics import mean\nrandom.seed(42)\nsample = iris['sepal_length'].tolist()\nestimates = sorted(mean(random.choices(sample, k=len(sample))) for _ in range(1000))\nprint('sample mean:', mean(sample))\nprint('bootstrap interval:', estimates[24], estimates[974])`},
 regression: {task:'꽃잎 길이로 꽃받침 길이를 예측합니다. 무작위로 나눈 학습 자료에서만 계수를 구하고 별도 평가 자료의 MSE를 출력합니다.', code:`${irisSetup}\niris = iris.sample(frac=1, random_state=42).reset_index(drop=True)\ntrain, test = iris.iloc[:120], iris.iloc[120:]\nx, y = train['petal_length'], train['sepal_length']\nxbar, ybar = x.mean(), y.mean()\nslope = ((x-xbar)*(y-ybar)).sum() / ((x-xbar)**2).sum()\nintercept = ybar - slope*xbar\npred = intercept + slope*test['petal_length']\nmse = ((pred-test['sepal_length'])**2).mean()\nprint('train/test:', len(train), len(test))\nprint('slope:', slope, 'intercept:', intercept, 'test MSE:', mse)`},
 classification: {task:'두 품종을 고르고 꽃잎 길이 2.5cm를 미리 정한 구분 기준으로 사용합니다. 분리한 평가 자료에서 정밀도와 재현율을 계산합니다.', code:`${irisSetup}\nsubset = iris[iris['species'].isin(['Iris-setosa','Iris-versicolor'])]\nsubset = subset.sample(frac=1, random_state=42).reset_index(drop=True)\ntest = subset.iloc[80:]\nactual = test['species'] == 'Iris-versicolor'\npredicted = test['petal_length'] >= 2.5\ntp = (predicted & actual).sum()\nfp = (predicted & ~actual).sum()\nfn = (~predicted & actual).sum()\nprint('TP, FP, FN:', tp, fp, fn)\nprint('precision:', tp/(tp+fp) if tp+fp else None)\nprint('recall:', tp/(tp+fn) if tp+fn else None)`},
};

export const coreLessons = {
 numpy:{month:'03',title:'NumPy 배열과 벡터의 계산',lead:'여러 관측을 한 번에 계산하고, 벡터의 내적이 모델의 입력과 연결되는 과정을 이해합니다.',
 basics:'배열은 같은 자료형의 값을 여러 축에 배치한 구조입니다. 2차원 배열의 shape가 (3, 2)라면 3개 행과 2개 열입니다. 행은 관측, 열은 특성으로 두는 경우가 많지만 항상 그런 것은 아니므로 데이터의 정의를 먼저 확인합니다.',
 mechanics:'벡터의 내적은 같은 위치의 값을 곱해 더합니다. 예를 들어 [1, 2] · [0.5, 0.2] = 1×0.5 + 2×0.2 = 0.9입니다. 모델에서 관측값에 가중치를 적용하는 기본 연산입니다. 각 특성의 단위가 다르면 가중치 크기만 비교하기 어렵습니다.',
 code:`import numpy as np\n\nX = np.array([[1., 2.], [3., 4.], [5., 6.]])\nw = np.array([0.5, 0.2])\nprint(X.shape)\nprint(X.mean(axis=0))\nprint(X[0] @ w)`,
 reading:'shape는 (3, 2), axis=0 평균은 [3. 4.], 첫 행과 w의 내적은 0.9입니다. axis=0은 행 방향으로 값을 모아 열마다 하나씩 결과를 냅니다. @는 행렬 곱 또는 내적이며, *는 같은 위치끼리 곱합니다.',
 experiment:'선택 실험: axis=0을 axis=1로 바꾸고 출력의 길이가 왜 2에서 3으로 바뀌는지 예측하세요.',links:['array','matrix','weights'],source:'numpy'},
 pandas:{month:'04',title:'Pandas로 표를 읽고 정리하기',lead:'작은 표를 만들고 결측값과 그룹별 평균을 살피며 실제 데이터를 다룰 준비를 합니다.',
 basics:'DataFrame은 행과 열에 이름을 붙인 표입니다. 각 행이 무엇을 의미하는지 정한 뒤 열의 자료형, 단위, 결측과 중복을 확인해야 집계가 의미를 갖습니다. 결측값은 0과 같지 않으며 측정되지 않았거나 기록되지 않은 상태일 수 있습니다.',
 mechanics:'그룹별 평균은 각 그룹에서 관측된 값의 합을 관측된 값의 개수로 나눕니다. 결측값을 무조건 전체 평균으로 채우면 집단 차이와 분산이 왜곡될 수 있습니다. 모델 학습이라면 대체에 필요한 기준은 학습 자료에서만 계산합니다.',
 code:`import pandas as pd\n\ndf = pd.DataFrame({'group':['A','B','A'], 'score':[72, None, 74]})\nprint(df['score'].isna().sum())\nprint(df.groupby('group')['score'].mean())`,
 reading:'isna().sum()은 결측값 1개를 셉니다. A의 평균은 73이며 B는 관측된 점수가 없어 NaN으로 나타납니다. mean은 결측값을 제외하지만 관측이 없는 그룹의 평균을 임의로 0으로 만들지는 않습니다.',
 experiment:'선택 실험: B의 None을 68로 바꾼 뒤 B의 평균과 전체 평균이 어떻게 바뀌는지 비교하세요.',links:['data','mean','group'],source:'pandas'},
 sql:{month:'05',title:'SQL로 관측 단위에 맞게 집계하기',lead:'주문 행과 주문 번호가 다를 수 있음을 이해하고 COUNT와 GROUP BY를 읽습니다.',
 basics:'SQL은 테이블에서 필요한 행을 고르고 묶는 언어입니다. SELECT는 결과 열, FROM은 원본, WHERE는 묶기 전 행의 조건, GROUP BY는 집계 단위를 지정합니다. 같은 주문에 여러 상품 행이 있으면 행 수와 주문 수가 다릅니다.',
 mechanics:'COUNT(*)는 그룹 안의 모든 행을 세고, COUNT(DISTINCT order_id)는 서로 다른 주문 번호를 셉니다. JOIN으로 행이 늘어난 뒤 COUNT(*)를 쓰면 의도보다 큰 값이 나올 수 있으므로 원래 관측 단위와 키를 확인해야 합니다.',
 code:`import sqlite3\n\ncon = sqlite3.connect(':memory:')\ncon.execute('CREATE TABLE orders (order_id INTEGER, customer TEXT)')\ncon.executemany('INSERT INTO orders VALUES (?, ?)', [(1,'A'),(2,'A'),(2,'A')])\nquery = '''SELECT customer, COUNT(*) AS rows,\n COUNT(DISTINCT order_id) AS orders\n FROM orders GROUP BY customer'''\nprint(con.execute(query).fetchall())`,
 reading:'결과는 [(\'A\', 3, 2)]입니다. A의 상품 행은 세 개지만 고유 주문 번호는 두 개입니다. Python의 sqlite3는 학습용 메모리 데이터베이스를 만들고 query에 들어 있는 SQL을 실행합니다.',
 experiment:'선택 실험: 주문 번호 3인 A 행을 하나 추가하면 행 수와 주문 수가 각각 어떻게 변할까요?',links:['data','group','mean'],source:'sql'},
 viz:{month:'06',title:'시각화로 분포와 차이 살피기',lead:'숫자를 그래프로 바꿀 때 축, 관측 단위와 분포를 함께 확인합니다.',
 basics:'시각화는 숫자의 크기, 분포와 관계를 살펴보는 도구입니다. 평균 하나만으로는 관측값이 비슷하게 모였는지 또는 큰 이상치가 있는지 알기 어렵습니다. 막대그래프와 히스토그램은 서로 다른 질문을 다룹니다.',
 mechanics:'히스토그램은 값을 구간으로 나누어 각 구간의 관측 수를 셉니다. 구간 폭을 바꾸면 모양이 달라지므로 단일 그래프만으로 집단 수나 이상치를 단정하지 마세요. 축의 단위와 결측 처리도 명시합니다.',
 code:`import matplotlib.pyplot as plt\n\nscores = [68, 72, 74, 90]\nfig, ax = plt.subplots()\nax.hist(scores, bins=[60, 70, 80, 100], edgecolor='black')\nax.set_xlabel('score')\nax.set_ylabel('count')\nplt.show()`,
 reading:'60–70 구간에 1개, 70–80 구간에 2개, 80–100 구간에 1개가 들어갑니다. 마지막 구간은 폭이 넓으므로 막대 높이만으로 밀도를 직접 비교할 때 주의합니다. 단순 빈도와 밀도 정규화는 다른 개념입니다.',
 experiment:'선택 실험: bins를 [60, 80, 100]으로 바꾸어 같은 자료가 어떻게 다르게 보이는지 확인하세요.',links:['data','mean'],source:'viz'},
 stat:{month:'07',title:'대표값과 산포를 함께 읽기',lead:'평균, 중앙값과 분산을 비교하여 값의 분포를 더 정확하게 설명합니다.',
 basics:'평균은 값의 합을 개수로 나눈 값이고, 중앙값은 정렬했을 때 가운데 값입니다. 극단값은 평균을 크게 움직일 수 있지만 중앙값에는 상대적으로 덜 영향을 줄 수 있습니다. 대표값의 선택은 데이터와 질문에 따라 달라집니다.',
 mechanics:'분산은 값과 평균의 차이를 제곱해 평균한 산포의 지표입니다. 표본분산은 제곱 차이의 합을 n−1로 나누고, 모집단 전체의 분산은 n으로 나눕니다. 원자료 단위로 해석하고 싶으면 분산의 제곱근인 표준편차를 살펴봅니다.',
 code:`from statistics import mean, median, variance\n\nvalues = [1, 2, 9]\nprint(mean(values))\nprint(median(values))\nprint(variance(values))`,
 reading:'평균은 4, 중앙값은 2, 표본분산은 19입니다. 평균에서의 편차 제곱 합은 9 + 4 + 25 = 38이고 n−1 = 2로 나눕니다. 값 9가 평균과 중앙값의 차이에 영향을 줍니다.',
 experiment:'선택 실험: 9를 3으로 바꾸면 평균과 중앙값, 분산이 각각 어떻게 달라질까요?',links:['mean','data'],source:'stat'},
 sampling:{month:'08',title:'표본과 불확실성: 부트스트랩',lead:'관측된 표본에서 여러 번 재표집해 평균의 변동을 탐색합니다.',
 basics:'모집단 전체를 측정하기 어려우므로 표본으로 특성을 추정합니다. 표본이 작거나 선택 과정이 편향되면 추정값이 달라질 수 있습니다. 계산 결과에 소수점이 많다는 사실은 그만큼 정확하다는 뜻이 아닙니다.',
 mechanics:'부트스트랩은 관측된 표본에서 같은 크기로 복원 추출하여 통계량을 반복 계산합니다. 이 예시의 분위수 구간은 관측 표본이 모집단을 대표하고 관측이 적절히 독립적이라는 가정 등에 민감합니다. 세 값만 있는 예시를 실제 신뢰할 수 있는 조사로 해석하면 안 됩니다.',
 code:`import random\nfrom statistics import mean\n\nrandom.seed(42)\nsample = [68, 72, 74]\nestimates = []\nfor _ in range(1000):\n    resample = random.choices(sample, k=len(sample))\n    estimates.append(mean(resample))\nestimates.sort()\nprint(round(estimates[24], 2), round(estimates[974], 2))`,
 reading:'매 반복마다 세 값을 중복을 허용해 뽑고 평균을 구합니다. 정렬된 1000개 결과의 25번째와 975번째 값을 대략적인 2.5%·97.5% 분위수로 살핍니다. 난수 시드는 같은 환경에서 실험을 재현하기 위한 설정입니다.',
 experiment:'선택 실험: sample에 새로운 관측값을 추가하거나 시드를 바꾸고 결과가 어떻게 변하는지 비교하세요.',links:['data','mean'],source:'sampling'},
 regression:{month:'09',title:'회귀 손실과 데이터 누수',lead:'선형 예측의 평균제곱오차와 기울기를 계산하고, 평가 데이터를 분리하는 이유를 이해합니다.',
 basics:'회귀는 연속적인 값을 예측하는 문제입니다. 여기서는 편향을 생략한 단순 모델 ŷ = wx를 사용합니다. 잔차는 예측과 실제 값의 차이이며, 평균제곱오차 MSE = Σ(ŷ − y)²/n은 그 차이의 제곱 평균입니다.',
 mechanics:'이 예제에서 ∂MSE/∂w = (2/n)Σ(wx − y)x입니다. 경사하강법은 w에서 학습률과 이 기울기의 곱을 뺍니다. 특성 선택, 결측값 대체와 스케일 기준을 평가 데이터까지 이용해 정하면 데이터 누수로 성능이 낙관적으로 보일 수 있습니다.',
 code:`x = [1, 2, 3]\ny = [2, 4, 6]\nw = 1.0\nerrors = [w * a - b for a, b in zip(x, y)]\nmse = sum(e ** 2 for e in errors) / len(errors)\ngrad = 2 * sum(e * a for e, a in zip(errors, x)) / len(x)\nw = w - 0.1 * grad\nprint(round(mse, 4), round(grad, 4), round(w, 4))`,
 reading:'오차는 −1, −2, −3이므로 MSE는 14/3 ≈ 4.6667입니다. 기울기는 −28/3 ≈ −9.3333이고, 한 번 갱신하면 w ≈ 1.9333입니다. 이것은 학습 데이터에서의 계산일 뿐 일반화 성능 평가가 아닙니다.',
 experiment:'선택 실험: 학습률 0.1을 바꾸고 갱신 후 손실을 별도로 계산해 비교하세요.',links:['loss','gradient','evaluation','overfit'],source:'regression'},
 classification:{month:'10',title:'분류 임계값과 평가 지표',lead:'정확도만 보지 않고 정밀도와 재현율이 어떤 오류를 세는지 이해합니다.',
 basics:'이진 분류는 두 범주를 구분합니다. 모델 점수가 임계값 이상이면 양성으로 예측한다고 합시다. 실제 양성을 양성으로 맞힌 수가 TP, 실제 음성을 양성으로 틀린 수가 FP, 실제 양성을 음성으로 놓친 수가 FN입니다.',
 mechanics:'정밀도는 TP/(TP+FP), 재현율은 TP/(TP+FN)입니다. 임계값을 내리면 더 많은 사례를 양성으로 표시하는 경향이 있지만, 실제 변화는 점수 분포에 달려 있습니다. 분모가 0인 경우에는 지표를 계산할 수 없으므로 별도 처리합니다.',
 code:`actual = [1, 0, 1, 0]\nscores = [0.9, 0.8, 0.4, 0.2]\nthreshold = 0.5\npredicted = [int(score >= threshold) for score in scores]\ntp = sum(p == 1 and y == 1 for p, y in zip(predicted, actual))\nfp = sum(p == 1 and y == 0 for p, y in zip(predicted, actual))\nfn = sum(p == 0 and y == 1 for p, y in zip(predicted, actual))\nprecision = tp / (tp + fp) if tp + fp else None\nrecall = tp / (tp + fn) if tp + fn else None\nprint(tp, fp, fn, precision, recall)`,
 reading:'임계값 0.5에서 TP=1, FP=1, FN=1이므로 정밀도와 재현율은 각각 0.5입니다. 이 네 관측은 가상 예제이며 의료 판단에 사용하지 않습니다. 실제로는 오류의 비용과 별도 평가 자료를 고려해야 합니다.',
 experiment:'선택 실험: 임계값을 0.3으로 낮추면 TP=2, FP=1, FN=0이 됩니다. 정밀도와 재현율을 다시 계산해 보세요.',links:['evaluation','overfit','loss'],source:'classification'},
};

function escape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function coreLessonPage(id, concepts){
 const l=coreLessons[id];if(!l)return '';
 const links=l.links.map(id=>concepts.find(c=>c.id===id)).filter(Boolean).map(c=>`<a class="pill" href="#map/${c.id}">${escape(c.name)}</a>`).join('');
 const [label,url]=commonSources[l.source];
 const project=realProjects[id];
 return `<section class="page case-detail"><a class="link" href="#roadmap">← 1년 목차로 돌아가기</a><br><br><span class="tag">${l.month}단계 · 핵심 학습</span><h1>${escape(l.title)}</h1><p class="intro">${escape(l.lead)}</p><div class="panel"><h2>무엇이고 왜 필요한가요?</h2><p>${escape(l.basics)}</p><div class="related-list">${links}</div></div><div class="panel"><h2>어떻게 작동하나요?</h2><p>${escape(l.mechanics)}</p></div><div class="panel"><h2>수식과 코드 연결하기</h2><p>준비된 코드를 읽고 결과를 먼저 예측해 보세요.</p><pre><code>${escape(l.code)}</code></pre><p>${escape(l.reading)}</p><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><p>코드의 각 줄이 결과에 어떤 영향을 주는지 먼저 말해 보세요. AI 연결이 없다면 위 설명을 다시 확인할 수 있습니다.</p></div></div><div class="panel"><h2>선택 실험</h2><p>${escape(l.experiment)}</p></div><div class="panel"><h2>실제 공개 데이터 프로젝트</h2><p>Fisher의 Iris 자료는 150개 꽃의 네 측정값과 품종으로 구성됩니다. 각 행은 한 꽃이며 길이의 단위는 cm입니다. ${escape(project.task)}</p><p>아래 예제는 인터넷과 pandas가 필요합니다. NumPy·그래프 예제는 각각 numpy·matplotlib도 필요합니다. 결과를 실행해 확인하고, 수집된 표본이 모든 붓꽃을 대표한다고 단정하지 마세요.</p><pre><code>${escape(project.code)}</code></pre><button class="outline" data-check-code>이 코드 이해도 확인하기 →</button><label class="project-notes-label">실행 결과와 해석<textarea data-project-notes="${id}" rows="4" maxlength="3000" placeholder="직접 실행한 결과와 해석을 기록하세요."></textarea></label><p class="meta">입력한 내용은 이 브라우저에 저장되고, 노션이 연결되면 학습 기록에도 전달됩니다.</p><p>UCI는 원본 자료의 한 측정값이 Fisher 논문의 값과 다르다고 밝히고 있습니다. 출처와 데이터 버전을 확인하세요.</p><a class="source" href="${url}" target="_blank" rel="noopener noreferrer">${escape(label)} · 발행연도 미표시, 확인 2026-11-03 ↗</a><br><a class="source" href="https://doi.org/10.24432/C56C76" target="_blank" rel="noopener noreferrer">Fisher (1936), Iris [데이터셋], UCI ↗</a></div></section>`;
}
