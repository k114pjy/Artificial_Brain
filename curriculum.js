export const curriculum = [
 ['01','질문과 데이터 읽기',['분석 질문과 의사결정','관측 단위·행·열·변수','자료형·결측값·단위','가상 자료에서 평균 읽기']],
 ['02','처음 만나는 Python',['변수와 자료형','리스트·인덱싱','조건문과 반복문','함수·반환값·오류 읽기']],
 ['03','NumPy와 선형대수',['배열과 차원','벡터·행렬과 내적','브로드캐스팅','평균과 축']],
 ['04','Pandas 데이터 정리',['DataFrame과 열 선택','조건 필터링','자료형과 날짜','결측·중복 처리와 결합']],
 ['05','SQL과 데이터 가져오기',['SELECT·WHERE','GROUP BY·집계','JOIN과 중복','분석 단위와 쿼리 검증']],
 ['06','시각화와 탐색',['분포와 이상치','막대·히스토그램·산점도','집단 비교와 교란','시각화의 축과 오해']],
 ['07','기초 통계',['평균·중앙값·분산','확률과 조건부 확률','상관과 인과','분포와 표본']],
 ['08','표본과 추정',['표본 추출과 편향','표준오차와 신뢰구간','부트스트랩','가설검정과 효과 크기']],
 ['09','회귀와 평가',['선형회귀와 잔차','손실함수와 평균제곱오차','훈련·검증·테스트','데이터 누수와 과적합']],
 ['10','분류와 실무 판단',['로지스틱 회귀','혼동행렬·정밀도·재현율','불균형 데이터','임계값과 비용']],
 ['11','퍼셉트론과 신경망',['입력·가중치·편향과 내적','활성화 함수','입력층·은닉층·출력층','순전파와 손실']],
 ['12','학습과 프로젝트',['편미분과 연쇄법칙','역전파·경사하강법·가중치 갱신','검증·정규화','공개 데이터 분석 보고서']],
];

export const lesson = {
 title:'첫 분석: 한 행은 무엇을 뜻할까?',
 summary:'작은 가상 데이터로 분석 질문을 정의하고 관측 단위, 변수, 평균을 코드와 연결합니다.',
 code:`scores = [72, 68, 74]\ncount = len(scores)\ntotal = sum(scores)\naverage = total / count\nprint(average)`,
 result:'71.33333333333333',
};

export function lessonPage() {
 return `<section class="page case-detail"><a class="link" href="#roadmap">← 1년 목차로 돌아가기</a><br><br><span class="tag">1단계 · 실제 학습</span><h1>${lesson.title}</h1><p class="intro">${lesson.summary}</p>
 <div class="panel"><h2>1. 질문과 관측 단위</h2><p>두 지역의 세 관측값을 살펴보려 합니다. 아래 각 행은 한 지역의 한 해를 뜻하는 가상 관측입니다. 값을 비교하기 전, 점수의 단위와 산출 방식이 같은지 확인해야 합니다. 이 자료만으로 차이의 원인을 알 수는 없습니다.</p><table><thead><tr><th>지역</th><th>연도</th><th>가상 점수</th></tr></thead><tbody><tr><td>A</td><td>2024</td><td>72</td></tr><tr><td>B</td><td>2024</td><td>68</td></tr><tr><td>A</td><td>2025</td><td>74</td></tr></tbody></table><p>행은 관측 하나, 열은 관측의 속성입니다. A가 두 행인 것은 같은 지역을 서로 다른 해에 관측했기 때문입니다.</p><p><a class="pill" href="#map/data">데이터의 뜻과 연결 개념 ↗</a></p></div>
 <div class="panel"><h2>2. Python 코드를 한 줄씩 읽기</h2><p><code>scores</code>는 세 숫자를 순서대로 담은 리스트입니다. <code>len</code>은 값의 개수, <code>sum</code>은 합계를 구하고, <code>=</code>는 오른쪽 결과에 이름을 붙입니다.</p><pre><code>${lesson.code}</code></pre><p>합계 214를 개수 3으로 나누므로 평균은 약 71.33입니다. <code>print</code>는 결과를 화면에 보여줍니다. 평균 = 합계 ÷ 관측 수라는 수식이 마지막 두 줄의 계산으로 연결됩니다.</p><p>관측 단위가 지역·연도이므로 이 평균은 세 지역연도 관측값의 평균입니다. 두 지역의 평균이라고 해석하면 안 됩니다.</p><div class="related-list"><a class="pill" href="#map/variable">변수</a><a class="pill" href="#map/list">리스트</a><a class="pill" href="#map/mean">평균</a></div><br><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><p>72를 82로 바꾸면 평균은 얼마나 변할까요? AI가 연결되지 않은 경우 직접 합계를 다시 구해 보세요.</p><details><summary>설명과 정답</summary><p>합계가 10 늘어나므로 평균은 10/3만큼 늘어 약 74.67이 됩니다.</p></details></div></div>
 <div class="panel"><h2>3. 선택 실험과 실제 데이터</h2><p>선택 실험: 74를 100으로 바꾸고 평균의 변화를 예측한 뒤 코드를 실행해 보세요. 평균이 극단적인 값의 영향을 받는 이유를 생각합니다.</p><p>실제 데이터: Fisher의 Iris 자료에는 붓꽃 150개체의 네 측정값과 품종이 있습니다. 한 행이 한 식물이라는 점과 측정 단위를 확인한 뒤 특성별 평균을 비교해 보세요. 분석 목표가 품종 예측이면 나중에는 평가용 데이터를 학습 전에 분리해야 합니다.</p><h3>공개 데이터 바로 읽기</h3><p>다음 코드는 UCI 원본을 내려받고, 쉼표로 나눈 첫 번째 열(꽃받침 길이, cm)을 숫자로 바꾸어 평균을 구합니다. 인터넷 연결이 필요합니다. 리스트 안의 반복문은 이후 Python 단원에서 더 자세히 배웁니다.</p><pre><code>from urllib.request import urlopen
import csv
url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
with urlopen(url) as response:
    lines = response.read().decode('utf-8').splitlines()
rows = [row for row in csv.reader(lines) if row]
lengths = [float(row[0]) for row in rows]
print(len(lengths), sum(lengths) / len(lengths))</code></pre><button class="outline" data-check-code>이 코드 이해도 확인하기 →</button><label class="project-notes-label">실행 결과와 해석<textarea data-project-notes="first" rows="4" maxlength="3000" placeholder="직접 실행한 결과와 해석을 기록하세요."></textarea></label><p class="meta">입력한 내용은 이 브라우저에 저장되고, 노션이 연결되면 학습 기록에도 전달됩니다.</p><p>예상 결과: 150개, 평균 약 5.843 cm. 이 값은 자료의 관측값 평균이며 모든 붓꽃의 평균을 보장하지 않습니다.</p><a class="source" href="https://doi.org/10.24432/C56C76" target="_blank" rel="noopener noreferrer">Fisher, R. A. (1936), Iris [데이터셋], UCI ↗</a><br><a class="source" href="https://docs.python.org/3/tutorial/introduction.html" target="_blank" rel="noopener noreferrer">Python Software Foundation, Python 공식 튜토리얼 ↗</a><p><a class="link" href="#case/health">비슷한 실무 문제로 이동 →</a></p></div></section>`;
}

export function pythonLessonPage() {
 return `<section class="page case-detail"><a class="link" href="#roadmap">← 1년 목차로 돌아가기</a><br><br><span class="tag">2단계 · 실제 학습</span><h1>Python으로 값과 반복 읽기</h1><p class="intro">준비된 코드를 읽으며 이름, 자료형, 리스트, 반복과 함수를 분석 문제에 연결합니다.</p>
 <div class="panel"><h2>1. 이름과 값</h2><p>변수는 값을 다시 사용하기 위한 이름입니다. <code>=</code>는 수학의 등호처럼 양쪽이 항상 같다는 선언이 아니라, 오른쪽에서 계산한 결과를 왼쪽 이름에 연결합니다. 다음 두 줄이 차례로 실행되면 <code>total</code>은 15가 됩니다.</p><pre><code>total = 10
total = total + 5
print(total)</code></pre><p>오른쪽의 <code>total + 5</code>를 기존 값 10으로 계산한 후 새 결과 15를 이름에 연결합니다. 숫자 <code>3</code>과 글자 <code>'3'</code>은 자료형이 달라 계산에서 다르게 작동합니다. 사용자 입력이나 파일은 문자로 읽힐 수 있으므로 숫자로 바꾸기 전 형식을 확인하세요.</p><a class="pill" href="#map/variable">변수 개념 보기 ↗</a></div>
 <div class="panel"><h2>2. 리스트와 반복</h2><p>리스트는 순서 있는 값의 모음입니다. Python에서 첫 원소의 위치는 0이므로 <code>scores[0]</code>은 72이고 <code>scores[-1]</code>은 마지막 값 74입니다. 없는 위치를 선택하면 오류가 납니다.</p><pre><code>scores = [72, 68, 74]
total = 0
for score in scores:
    total = total + score
average = total / len(scores)
print(total, average)</code></pre><p>각 반복에서 <code>score</code>는 72, 68, 74로 차례로 바뀝니다. 누적 합계는 0 → 72 → 140 → 214가 됩니다. 들여쓴 줄만 반복되고, 반복이 끝난 뒤 개수 3으로 나눕니다. 실행 결과는 <code>214 71.33333333333333</code>입니다.</p><p>빈 리스트라면 개수가 0이라 나눗셈이 실패합니다. 실제 분석에서는 값이 없는 집단을 별도로 확인해야 합니다.</p><div class="related-list"><a class="pill" href="#map/list">리스트</a><a class="pill" href="#map/mean">평균</a></div><br><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><p>리스트에 86을 추가하면 합계와 개수는 각각 얼마일까요?</p><details><summary>설명과 정답</summary><p>합계는 300, 개수는 4, 평균은 75입니다.</p></details></div></div>
 <div class="panel"><h2>3. 함수와 반환값</h2><p>함수는 반복해서 쓸 계산에 이름을 붙입니다. <code>return</code>은 결과를 호출한 위치에 돌려주고, <code>print</code>는 화면에 표시합니다. 빈 자료는 평균을 계산할 수 없으므로 여기서는 <code>None</code>으로 구분합니다.</p><pre><code>def mean(values):
    if len(values) == 0:
        return None
    return sum(values) / len(values)

result = mean([72, 68, 74])
print(result)</code></pre><p>조건이 참이면 첫 번째 <code>return</code>에서 함수가 끝납니다. 그렇지 않으면 합계를 개수로 나눕니다. 함수가 돌려준 값을 <code>result</code>에 저장해 출력하므로, 나중에 다른 분석에서도 재사용할 수 있습니다.</p></div>
 <div class="panel"><h2>선택 실험과 공개 데이터 연결</h2><p>선택 실험: 반복문에서 시작값 <code>total = 0</code>을 10으로 바꾸면 합계와 평균이 얼마나 달라지는지 예측하고 실행해 보세요. 시작값이 0이 아니면 데이터에 없는 값이 합계에 포함됩니다.</p><p>앞 단원의 Iris 예제에서 <code>lengths</code> 역시 숫자 리스트입니다. 같은 <code>mean(lengths)</code> 함수를 사용해 꽃받침 길이의 평균을 구할 수 있습니다. 아래 코드는 인터넷 연결이 필요합니다.</p><pre><code>from urllib.request import urlopen
import csv

def mean(values):
    if len(values) == 0:
        return None
    return sum(values) / len(values)

url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
with urlopen(url) as response:
    rows = list(csv.reader(response.read().decode('utf-8').splitlines()))
lengths = [float(row[0]) for row in rows if row]
print(len(lengths), mean(lengths))</code></pre><p>빈 행은 제외합니다. 150개 관측값의 평균은 약 5.843 cm입니다. 실제 자료의 수집 방식과 대표성도 살펴보세요.</p><button class="outline" data-check-code>이 코드 이해도 확인하기 →</button><label class="project-notes-label">실행 결과와 해석<textarea data-project-notes="python" rows="4" maxlength="3000" placeholder="직접 실행한 결과와 해석을 기록하세요."></textarea></label><p class="meta">입력한 내용은 이 브라우저에 저장되고, 노션이 연결되면 학습 기록에도 전달됩니다.</p><a class="source" href="https://docs.python.org/3/tutorial/controlflow.html" target="_blank" rel="noopener noreferrer">Python Software Foundation, 제어 흐름 도구 공식 문서 ↗</a><br><a class="source" href="https://doi.org/10.24432/C56C76" target="_blank" rel="noopener noreferrer">Fisher (1936), Iris [데이터셋], UCI ↗</a></div></section>`;
}

export function neuralLessonPage() {
 return `<section class="page case-detail"><a class="link" href="#roadmap">← 1년 목차로 돌아가기</a><br><br><span class="tag">11–12단계 · 원리와 코드</span><h1>퍼셉트론에서 가중치 갱신까지</h1><p class="intro">입력 두 개와 출력 하나인 작은 모델을 손으로 계산하고 Python 코드로 확인합니다.</p>
 <div class="panel"><h2>1. 입력, 가중치, 편향이 하는 일</h2><p>예를 들어 두 측정값을 입력으로 받아 두 범주 중 하나일 가능성을 살펴본다고 합시다. 각 측정값의 영향은 같지 않을 수 있으므로 입력 x₁, x₂에 가중치 w₁, w₂를 각각 곱합니다. 편향 b는 입력이 모두 0일 때의 기준을 조정합니다.</p><p><strong>z = w₁x₁ + w₂x₂ + b = w · x + b</strong></p><p>여기서 두 벡터의 내적은 같은 위치의 수를 곱해 더한 값입니다. x = [2, 3], w = [0.1, −0.2], b = 0.4이면 z = 0.1×2 − 0.2×3 + 0.4 = 0입니다. 단위가 다른 특성의 크기를 그대로 비교할 수 없으므로 실제 데이터에서는 전처리와 학습·평가 데이터 분리도 필요합니다.</p><p>고전적인 퍼셉트론은 이 합에 문턱 함수를 적용합니다. 아래 학습 예제는 미분이 가능한 시그모이드 함수를 사용하는 하나의 뉴런으로, 확률적 출력과 기울기 계산을 설명합니다.</p><div class="related-list"><a class="pill" href="#map/matrix">벡터·행렬</a><a class="pill" href="#map/neuron">퍼셉트론</a><a class="pill" href="#map/weights">가중치</a></div></div>
 <div class="panel"><h2>2. 활성화 함수와 층</h2><p>시그모이드는 σ(z) = 1 / (1 + e<sup>−z</sup>)이며 출력을 0과 1 사이로 바꿉니다. z = 0이면 출력 p = 0.5입니다. 활성화 함수가 없으면 여러 선형 변환을 이어도 하나의 선형 변환으로 합쳐지므로 복잡한 비선형 관계를 표현하는 데 한계가 있습니다.</p><p>입력층은 특성을 전달하고, 은닉층은 중간 표현을 만들며, 출력층은 예측을 만듭니다. 각 층에서 앞 층의 출력에 가중치와 편향을 적용하는 과정을 입력에서 출력 방향으로 계산하는 것이 순전파입니다. 이 예제에는 은닉층이 없고 출력 뉴런 하나만 있습니다.</p><a class="pill" href="#map/network">신경망의 층과 연결 ↗</a></div>
 <div class="panel"><h2>3. 손실, 편미분, 역전파</h2><p>실제 정답 y = 1이고 예측 p = 0.5라고 합시다. 이해를 위해 한 관측의 제곱 오차에 1/2를 곱한 손실 L = ½(p − y)²을 사용하면 L = 0.125입니다. 실제 이진 분류에서는 교차 엔트로피도 널리 사용합니다. 하나의 예시가 모든 모델의 표준 손실은 아닙니다.</p><p>가중치가 바뀔 때 손실이 얼마나 바뀌는지는 연쇄법칙으로 계산합니다. ∂L/∂p = p − y, ∂p/∂z = p(1 − p), ∂z/∂wᵢ = xᵢ이므로 <strong>∂L/∂wᵢ = (p − y)p(1 − p)xᵢ</strong>입니다. 편향에는 xᵢ 대신 1이 곱해집니다. 이 예에서 ∂L/∂z = −0.125, 두 가중치의 기울기는 −0.25와 −0.375입니다.</p><p>역전파는 출력 쪽에서 계산한 기울기를 계산 그래프를 따라 앞쪽으로 전달하는 방법입니다. 경사하강법은 그 기울기를 이용해 <strong>w ← w − 학습률 × ∂L/∂w</strong>로 매개변수를 갱신합니다. 역전파의 기울기 계산과 경사하강법의 갱신은 서로 다른 단계입니다.</p><div class="related-list"><a class="pill" href="#map/derivative">편미분</a><a class="pill" href="#map/loss">손실함수</a><a class="pill" href="#map/backprop">역전파</a><a class="pill" href="#map/gradient">경사하강법</a></div></div>
 <div class="panel"><h2>4. 코드를 읽고 결과 예측하기</h2><pre><code>from math import exp

x = [2.0, 3.0]
w = [0.1, -0.2]
b = 0.4
y = 1.0
learning_rate = 0.1

z = sum(weight * value for weight, value in zip(w, x)) + b
p = 1 / (1 + exp(-z))
loss = 0.5 * (p - y) ** 2
dz = (p - y) * p * (1 - p)
dw = [dz * value for value in x]
w = [weight - learning_rate * grad for weight, grad in zip(w, dw)]
b = b - learning_rate * dz
print(round(p, 3), round(loss, 3), w, round(b, 4))</code></pre><p><code>zip(w, x)</code>는 같은 위치의 가중치와 입력을 짝짓습니다. <code>dz</code>가 연쇄법칙으로 구한 ∂L/∂z이고, <code>dw</code>의 각 원소가 가중치별 기울기입니다. 예측 출력은 0.5, 손실은 0.125이며 갱신 후 가중치는 약 [0.125, −0.1625], 편향은 0.4125입니다. 부동소수점 표시는 약간 다를 수 있습니다.</p><button class="outline" id="check-understanding">이해도 확인하기 →</button><div id="check-content" hidden><p>x₁을 0으로 바꾸면 첫 번째 가중치의 기울기는 어떻게 될까요?</p><details><summary>설명과 답</summary><p>∂L/∂w₁ = (∂L/∂z)x₁이므로 0입니다. 이 한 관측의 갱신에서 w₁은 바뀌지 않습니다.</p></details></div></div>
 <div class="panel"><h2>선택 실험</h2><p>학습률을 0.1에서 1 또는 10으로 바꾼 뒤 갱신 전후 손실을 각각 계산해 보세요. 학습률이 너무 크면 일반적으로 손실이 줄어드는 방향을 지나칠 수 있으나, 특정 예제의 결과는 직접 확인해야 합니다.</p></div>
 <div class="panel"><h2>실제 데이터 프로젝트: 두 품종 구분하기</h2><p>Iris의 두 품종에서 꽃잎 길이와 폭을 입력으로 사용합니다. 자료를 먼저 섞어 학습 80개와 평가 20개로 나누고, 평균과 표준편차는 학습 자료에서만 계산해 양쪽에 적용합니다. 이후 시그모이드 출력과 제곱 오차의 기울기로 가중치를 반복 갱신합니다. 인터넷과 pandas, NumPy가 필요합니다.</p><pre><code>import numpy as np
import pandas as pd

url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
cols = ['sepal_length','sepal_width','petal_length','petal_width','species']
iris = pd.read_csv(url, header=None, names=cols)
data = iris[iris['species'].isin(['Iris-setosa','Iris-versicolor'])]
data = data.sample(frac=1, random_state=42).reset_index(drop=True)
train, test = data.iloc[:80], data.iloc[80:]
features = ['petal_length','petal_width']
center = train[features].mean()
scale = train[features].std(ddof=0)
X = ((train[features]-center)/scale).to_numpy()
y = (train['species']=='Iris-versicolor').to_numpy().astype(float)
X_test = ((test[features]-center)/scale).to_numpy()
y_test = (test['species']=='Iris-versicolor').to_numpy().astype(float)

w = np.zeros(2)
b = 0.0
for _ in range(200):
    p = 1 / (1 + np.exp(-(X @ w + b)))
    dz = (p-y)*p*(1-p)
    w = w - 0.1*(X.T @ dz)/len(X)
    b = b - 0.1*dz.mean()
test_p = 1 / (1 + np.exp(-(X_test @ w + b)))
print('train/test:', len(train), len(test))
print('test accuracy:', ((test_p >= 0.5)==y_test).mean())</code></pre><p><code>X @ w</code>는 각 관측의 내적을 한 번에 구하고, <code>X.T @ dz</code>는 각 특성의 기울기를 관측 전체에 걸쳐 합합니다. 평가는 사용하지 않은 20개 행으로 계산합니다. 작은 특정 데이터의 결과를 다른 품종이나 실제 현장에 대한 성능으로 일반화하지 마세요. UCI는 원본의 한 값이 Fisher 논문과 다르다고 밝히고 있습니다.</p><button class="outline" data-check-code>이 코드 이해도 확인하기 →</button><label class="project-notes-label">실행 결과와 해석<textarea data-project-notes="neural" rows="4" maxlength="3000" placeholder="직접 실행한 결과와 해석을 기록하세요."></textarea></label><p class="meta">입력한 내용은 이 브라우저에 저장되고, 노션이 연결되면 학습 기록에도 전달됩니다.</p><a class="source" href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noopener noreferrer">Goodfellow, Bengio &amp; Courville (2016), Deep Learning, Chapter 6 ↗</a><br><a class="source" href="https://doi.org/10.24432/C56C76" target="_blank" rel="noopener noreferrer">Fisher (1936), Iris [데이터셋], UCI ↗</a></div></section>`;
}
