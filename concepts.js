export const concepts = [
  {
    "id": "data",
    "name": "데이터",
    "category": "데이터 기초",
    "summary": "관찰하거나 측정한 사실을 분석할 수 있도록 기록한 것입니다.",
    "why": "행과 열이 무엇을 나타내는지 알아야 요약과 비교가 의미를 갖습니다.",
    "source": "Wickham, Tidy Data (2014)",
    "url": "https://doi.org/10.18637/jss.v059.i10",
    "layer": "foundation",
    "english": "Data"
  },
  {
    "id": "variable",
    "name": "변수",
    "category": "Python 기초",
    "summary": "값을 가리키는 이름입니다. 예를 들어 score = 72는 점수 72에 이름을 붙입니다.",
    "why": "이름을 사용하면 데이터를 다시 사용하고 코드의 의미를 읽기 쉽습니다.",
    "source": "Python 공식 문서, An Informal Introduction to Python",
    "url": "https://docs.python.org/3/tutorial/introduction.html",
    "layer": "foundation",
    "english": "Variable"
  },
  {
    "id": "derivative",
    "name": "편미분",
    "category": "수학 기초",
    "summary": "여러 변수가 있는 함수에서 하나의 변수에 따른 변화율을 살펴봅니다.",
    "why": "모델의 각 가중치가 바뀔 때 손실이 어떻게 변하는지 계산하는 데 쓰입니다.",
    "source": "OpenStax, Calculus Volume 3, Partial Derivatives",
    "url": "https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives",
    "layer": "foundation",
    "english": "Partial Derivative"
  },
  {
    "id": "matrix",
    "name": "벡터·행렬",
    "category": "수학 기초",
    "summary": "벡터는 값의 묶음이고 행렬은 값을 행과 열로 배열한 것입니다.",
    "why": "데이터와 신경망의 가중치를 표현하고 한 번에 계산하는 데 쓰입니다.",
    "source": "NumPy 공식 문서, Linear algebra",
    "url": "https://numpy.org/doc/stable/reference/routines.linalg.html",
    "layer": "foundation",
    "english": "Vectors & Matrices"
  },
  {
    "id": "array",
    "name": "배열",
    "category": "NumPy",
    "summary": "같은 종류의 데이터를 여러 차원으로 담아 계산하기 위한 구조입니다.",
    "why": "NumPy 배열은 데이터와 행렬 연산을 간결하게 표현할 수 있습니다.",
    "source": "Harris et al., Array programming with NumPy (2020)",
    "url": "https://doi.org/10.1038/s41586-020-2649-2",
    "layer": "foundation",
    "english": "Array"
  },
  {
    "id": "list",
    "name": "리스트",
    "category": "Python 기초",
    "summary": "여러 값을 순서대로 담는 Python 자료형입니다.",
    "why": "여러 관측값을 함께 보관하고 순서에 따라 꺼내는 데 사용합니다.",
    "source": "Python 공식 문서, Data Structures",
    "url": "https://docs.python.org/3/tutorial/datastructures.html",
    "layer": "foundation",
    "english": "List"
  },
  {
    "id": "mean",
    "name": "평균",
    "category": "기초 통계",
    "summary": "값을 모두 더해 개수로 나눈 대표값입니다.",
    "why": "집단을 요약해 비교할 때 편리하지만 극단적인 값에 영향을 받습니다.",
    "source": "NIST, Measures of Location",
    "url": "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm",
    "layer": "foundation",
    "english": "Mean"
  },
  {
    "id": "group",
    "name": "GROUP BY",
    "category": "SQL",
    "summary": "같은 값을 가진 행을 묶어 그룹별 집계를 할 수 있게 합니다.",
    "why": "예를 들어 지역별 평균이나 고객별 주문 횟수를 계산할 수 있습니다.",
    "source": "PostgreSQL 공식 문서, GROUP BY",
    "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP",
    "layer": "foundation",
    "english": "SQL GROUP BY"
  },
  {
    "id": "loss",
    "name": "손실함수",
    "category": "머신러닝",
    "summary": "모델의 예측과 실제 값 사이의 차이를 수치화하는 함수입니다.",
    "why": "학습 과정에서 어떤 방향으로 모델을 개선할지 판단하는 기준이 됩니다.",
    "source": "Google, Machine Learning Crash Course: Loss",
    "url": "https://developers.google.com/machine-learning/crash-course/linear-regression/loss",
    "layer": "principle",
    "english": "Loss Function"
  },
  {
    "id": "optimization",
    "name": "최적화",
    "english": "Optimization",
    "layer": "principle",
    "summary": "목적함수의 값을 가장 작게 또는 크게 만드는 매개변수를 찾는 과정입니다.",
    "why": "모델의 손실을 줄이는 학습 문제를 수학적으로 표현하고 해결할 때 사용합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 4 (2016)",
    "url": "https://www.deeplearningbook.org/contents/numerical.html",
    "category": "머신러닝"
  },
  {
    "id": "neuron",
    "name": "퍼셉트론",
    "category": "딥러닝",
    "summary": "입력에 가중치를 곱해 합하고 출력하는 기본적인 인공 뉴런 모형입니다.",
    "why": "신경망에서 입력, 가중치, 편향이 어떻게 연결되는지 이해하는 출발점입니다.",
    "source": "Rosenblatt, The Perceptron (1958)",
    "url": "https://doi.org/10.1037/h0042519",
    "layer": "principle",
    "english": "Perceptron"
  },
  {
    "id": "gradient",
    "name": "경사하강법",
    "category": "머신러닝",
    "summary": "손실함수의 기울기를 이용해 손실이 작아지는 방향으로 매개변수를 조정하는 방법입니다.",
    "why": "선형회귀와 신경망 등 여러 모델의 학습에 사용됩니다.",
    "source": "Google, Machine Learning Crash Course: Gradient descent",
    "url": "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent",
    "layer": "principle",
    "english": "Gradient Descent"
  },
  {
    "id": "backprop",
    "name": "역전파",
    "category": "딥러닝",
    "summary": "연쇄법칙을 이용해 신경망의 각 가중치에 대한 손실의 기울기를 계산합니다.",
    "why": "계산한 기울기를 경사하강법 등에 전달해 가중치를 갱신합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 6 (2016)",
    "url": "https://www.deeplearningbook.org/contents/mlp.html",
    "layer": "principle",
    "english": "Backpropagation"
  },
  {
    "id": "regularization",
    "name": "정규화",
    "english": "Regularization",
    "layer": "principle",
    "summary": "새로운 데이터에서도 잘 작동하도록 학습 방법이나 모델에 제약을 더하는 방법입니다.",
    "why": "가중치에 벌점을 주거나 학습을 일찍 멈추는 방법 등으로 과적합을 줄입니다. 데이터의 스케일을 바꾸는 정규화와는 다른 의미입니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 7 (2016)",
    "url": "https://www.deeplearningbook.org/contents/regularization.html",
    "category": "머신러닝"
  },
  {
    "id": "overfit",
    "name": "과적합·과소적합",
    "english": "Overfitting & Underfitting",
    "layer": "principle",
    "summary": "과적합은 학습 데이터에 지나치게 맞춘 상태이고, 과소적합은 학습 데이터의 패턴도 충분히 익히지 못한 상태입니다.",
    "why": "학습 데이터와 검증 데이터의 오차를 함께 비교해 모델의 복잡도와 학습 방법을 조절합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 5 (2016)",
    "url": "https://www.deeplearningbook.org/contents/ml.html",
    "category": "머신러닝"
  },
  {
    "id": "evaluation",
    "name": "모델 평가",
    "category": "머신러닝",
    "summary": "학습하지 않은 데이터에서 모델이 얼마나 잘 작동하는지 살펴봅니다.",
    "why": "목적에 맞는 지표를 선택해야 실제 사용 가능성을 판단할 수 있습니다.",
    "source": "Google, Machine Learning Crash Course: Classification",
    "url": "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall",
    "layer": "principle",
    "english": "Model Evaluation"
  },
  {
    "id": "weights",
    "name": "가중치",
    "english": "Weights",
    "layer": "application",
    "summary": "각 입력이 모델의 출력에 얼마나 영향을 주는지 결정하는 학습 가능한 매개변수입니다.",
    "why": "신경망은 입력에 가중치를 곱해 더합니다. 학습 중에는 손실의 기울기를 이용해 가중치를 갱신합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 6 (2016)",
    "url": "https://www.deeplearningbook.org/contents/mlp.html",
    "category": "딥러닝"
  },
  {
    "id": "training",
    "name": "모델 학습",
    "english": "Model Training",
    "layer": "application",
    "summary": "데이터를 이용해 모델의 예측이 목표에 가까워지도록 매개변수를 조정하는 과정입니다.",
    "why": "학습용 데이터로 손실을 줄이고, 별도의 검증 데이터로 새로운 데이터에 대한 성능을 확인합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 5 (2016)",
    "url": "https://www.deeplearningbook.org/contents/ml.html",
    "category": "머신러닝"
  },
  {
    "id": "network",
    "name": "신경망",
    "category": "딥러닝",
    "summary": "여러 연산 단위를 층으로 연결해 입력에서 출력을 만드는 모델입니다.",
    "why": "가중치를 학습해 데이터의 복잡한 관계를 표현할 수 있습니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 6 (2016)",
    "url": "https://www.deeplearningbook.org/contents/mlp.html",
    "layer": "application",
    "english": "Neural Network"
  },
  {
    "id": "deep",
    "name": "딥러닝",
    "english": "Deep Learning",
    "layer": "application",
    "summary": "여러 층의 신경망을 이용해 데이터의 표현을 단계적으로 학습하는 방법입니다.",
    "why": "이미지와 텍스트처럼 복잡한 데이터에서 특징을 학습해 분류나 예측에 활용합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 6 (2016)",
    "url": "https://www.deeplearningbook.org/contents/mlp.html",
    "category": "딥러닝"
  },
  {
    "id": "image",
    "name": "이미지 분류",
    "english": "Image Classification",
    "layer": "application",
    "summary": "이미지를 입력받아 고양이, 자동차 등 정해진 범주 중 하나로 분류하는 문제입니다.",
    "why": "합성곱 신경망 등으로 시각적 특징을 학습하고, 학습에 사용하지 않은 이미지로 성능을 평가합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 9 (2016)",
    "url": "https://www.deeplearningbook.org/contents/convnets.html",
    "category": "컴퓨터 비전"
  },
  {
    "id": "nlp",
    "name": "자연어 처리",
    "english": "Natural Language Processing",
    "layer": "application",
    "summary": "사람의 언어로 된 텍스트나 음성을 컴퓨터가 다루도록 하는 분야입니다.",
    "why": "문서 분류, 번역, 언어 모델링 등에서 단어나 문장의 표현과 관계를 학습합니다.",
    "source": "Goodfellow et al., Deep Learning, Chapter 12 (2016)",
    "url": "https://www.deeplearningbook.org/contents/applications.html",
    "category": "자연어 처리"
  }
];

// Educational relationships; not directed execution steps.
export const edges = [
  [
    "data",
    "variable",
    "데이터를 이름으로 표현"
  ],
  [
    "variable",
    "list",
    "여러 값을 순서대로 보관"
  ],
  [
    "list",
    "array",
    "수치 계산에 맞게 확장"
  ],
  [
    "array",
    "matrix",
    "벡터와 행렬로 표현"
  ],
  [
    "data",
    "mean",
    "데이터의 대표값 계산"
  ],
  [
    "data",
    "group",
    "같은 값을 가진 행 집계"
  ],
  [
    "group",
    "mean",
    "그룹별 평균 계산"
  ],
  [
    "matrix",
    "neuron",
    "입력과 가중치의 곱 계산"
  ],
  [
    "matrix",
    "network",
    "층마다 행렬 연산"
  ],
  [
    "derivative",
    "gradient",
    "기울기(편미분) 계산"
  ],
  [
    "loss",
    "gradient",
    "손실 감소 방향 탐색"
  ],
  [
    "gradient",
    "optimization",
    "최적화를 수행하는 방법"
  ],
  [
    "neuron",
    "network",
    "신경망의 기본 연산 단위"
  ],
  [
    "network",
    "loss",
    "예측 오차를 수치화"
  ],
  [
    "network",
    "backprop",
    "각 가중치의 기울기 계산"
  ],
  [
    "backprop",
    "gradient",
    "계산한 기울기로 갱신"
  ],
  [
    "gradient",
    "weights",
    "가중치 업데이트"
  ],
  [
    "gradient",
    "training",
    "손실을 줄이며 학습"
  ],
  [
    "gradient",
    "network",
    "신경망의 매개변수 학습"
  ],
  [
    "network",
    "evaluation",
    "학습하지 않은 데이터로 확인"
  ],
  [
    "weights",
    "neuron",
    "입력의 영향력 조절"
  ],
  [
    "regularization",
    "overfit",
    "과적합을 줄이는 제약"
  ],
  [
    "regularization",
    "training",
    "일반화 성능을 위한 학습 조절"
  ],
  [
    "overfit",
    "evaluation",
    "학습·검증 오차 비교"
  ],
  [
    "network",
    "deep",
    "여러 층으로 표현 학습"
  ],
  [
    "gradient",
    "deep",
    "기울기를 이용한 매개변수 학습"
  ],
  [
    "deep",
    "image",
    "이미지의 시각적 특징 학습"
  ],
  [
    "deep",
    "nlp",
    "언어의 표현과 관계 학습"
  ],
  [
    "evaluation",
    "image",
    "분류 결과의 성능 확인"
  ],
  [
    "data",
    "training",
    "학습 데이터 준비"
  ]
];
