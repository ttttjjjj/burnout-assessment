import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  // MBI-GS 中文量表题目
  const questions = [
    // 情绪衰竭维度
    {
      id: 1,
      text: '工作让我感觉身心疲惫',
      dimension: 'emotionalExhaustion'
    },
    {
      id: 2,
      text: '下班的时候我感觉筋疲力尽',
      dimension: 'emotionalExhaustion'
    },
    {
      id: 3,
      text: '早晨起床不得不去面对一天的工作时，我感觉非常累',
      dimension: 'emotionalExhaustion'
    },
    {
      id: 4,
      text: '整天工作对我来说确实压力很大',
      dimension: 'emotionalExhaustion'
    },
    {
      id: 5,
      text: '工作让我有快要崩溃的感觉',
      dimension: 'emotionalExhaustion'
    },
    // 工作态度维度
    {
      id: 6,
      text: '自从开始干这份工作，我对工作越来越不感兴趣',
      dimension: 'cynicism'
    },
    {
      id: 7,
      text: '我对工作不像以前那样热心了',
      dimension: 'cynicism'
    },
    {
      id: 8,
      text: '我怀疑自己所做工作的意义',
      dimension: 'cynicism'
    },
    {
      id: 9,
      text: '我对自己所做工作是否有贡献越来越不关心',
      dimension: 'cynicism'
    },
    // 成就感维度（反向计分）
    {
      id: 10,
      text: '我能有效解决工作中出现的问题',
      dimension: 'accomplishment',
      reverse: true
    },
    {
      id: 11,
      text: '我觉得我在为公司作有用的贡献',
      dimension: 'accomplishment',
      reverse: true
    },
    {
      id: 12,
      text: '在我看来，我擅长自己的工作',
      dimension: 'accomplishment',
      reverse: true
    },
    {
      id: 13,
      text: '当完成工作上的一些事情时，我感到很有成就感',
      dimension: 'accomplishment',
      reverse: true
    },
    {
      id: 14,
      text: '我对自己的工作表现感到满意',
      dimension: 'accomplishment',
      reverse: true
    },
    {
      id: 15,
      text: '我能胜任工作上的各项要求',
      dimension: 'accomplishment',
      reverse: true
    }
  ]

  // 选项
  const options = [
    { value: 0, label: '从不' },
    { value: 1, label: '很少' },
    { value: 2, label: '偶尔' },
    { value: 3, label: '经常' },
    { value: 4, label: '频繁' },
    { value: 5, label: '非常频繁' },
    { value: 6, label: '每天' }
  ]

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('burnoutHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 保存历史记录
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('burnoutHistory', JSON.stringify(history))
    }
  }, [history])

  // 处理答案选择
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // 计算得分
  const calculateScore = () => {
    let totalScore = 0
    let emotionalExhaustionScore = 0
    let cynicismScore = 0
    let accomplishmentScore = 0

    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        if (question.reverse) {
          // 反向计分
          totalScore += (6 - answer)
          if (question.dimension === 'accomplishment') {
            accomplishmentScore += (6 - answer)
          }
        } else {
          totalScore += answer
          if (question.dimension === 'emotionalExhaustion') {
            emotionalExhaustionScore += answer
          } else if (question.dimension === 'cynicism') {
            cynicismScore += answer
          }
        }
      }
    })

    // 转换为100分制
    const standardScore = Math.round((totalScore / 90) * 100)
    setScore(standardScore)

    // 生成结果评价
    let evaluation = ''
    if (standardScore < 50) {
      evaluation = '工作状态良好'
    } else if (standardScore < 75) {
      evaluation = '存在一定程度的职业倦怠，需进行自我心理调节'
    } else if (standardScore < 100) {
      evaluation = '职业倦怠比较严重，建议离开工作岗位一段时间进行调整'
    } else {
      evaluation = '职业倦怠非常严重，建议咨询心理医生或考虑换工作环境'
    }

    setResult({
      score: standardScore,
      evaluation,
      emotionalExhaustion: emotionalExhaustionScore,
      cynicism: cynicismScore,
      accomplishment: accomplishmentScore
    })

    // 保存到历史记录
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN'),
      score: standardScore,
      evaluation
    }
    setHistory(prev => [newRecord, ...prev].slice(0, 10)) // 只保存最近10条
  }

  // 提交问卷
  const handleSubmit = (e) => {
    e.preventDefault()
    calculateScore()
    setCurrentStep(3)
  }

  // 重新测试
  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setScore(null)
    setResult(null)
  }

  // 渲染问卷
  const renderQuestionnaire = () => {
    return (
      <div className="questionnaire">
        <h2>职业倦怠量表 (MBI-GS)</h2>
        <p className="instruction">请根据过去12个月内您的实际感受，选择最符合您的一项：</p>
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={question.id} className="question">
              <p className="question-number">{index + 1}. {question.text}</p>
              <div className="options">
                {options.map(option => (
                  <label key={option.value} className="option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswerChange(question.id, option.value)}
                      required
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-btn">提交测试</button>
        </form>
      </div>
    )
  }

  // 渲染结果
  const renderResult = () => {
    if (!result) return null

    return (
      <div className="result">
        <h2>测试结果</h2>
        <div className="score-card">
          <div className="score">{result.score}</div>
          <div className="score-label">总分 (100分制)</div>
        </div>
        <div className="evaluation">
          <h3>评价</h3>
          <p>{result.evaluation}</p>
        </div>
        <div className="dimensions">
          <h3>各维度得分</h3>
          <div className="dimension-item">
            <span>情绪衰竭：</span>
            <span>{result.emotionalExhaustion}/30</span>
          </div>
          <div className="dimension-item">
            <span>工作态度：</span>
            <span>{result.cynicism}/24</span>
          </div>
          <div className="dimension-item">
            <span>成就感：</span>
            <span>{result.accomplishment}/36</span>
          </div>
        </div>
        <div className="suggestions">
          <h3>建议与资源</h3>
          {result.score < 50 && (
            <div>
              <p>• 继续保持良好的工作状态</p>
              <p>• 定期进行自我评估，预防职业倦怠</p>
              <p>• 保持健康的生活方式和工作平衡</p>
            </div>
          )}
          {result.score >= 50 && result.score < 75 && (
            <div>
              <p>• 适当调整工作节奏，避免过度劳累</p>
              <p>• 学习压力管理技巧，如深呼吸、冥想等</p>
              <p>• 增加体育锻炼，保持良好的身体状态</p>
              <p>• 与同事或朋友交流，分享工作感受</p>
            </div>
          )}
          {result.score >= 75 && (
            <div>
              <p>• 考虑申请休假，给自己充分的休息时间</p>
              <p>• 寻求专业心理咨询师的帮助</p>
              <p>• 重新评估职业目标和工作环境</p>
              <p>• 培养兴趣爱好，丰富业余生活</p>
            </div>
          )}
        </div>
        <div className="buttons">
          <button onClick={handleReset} className="reset-btn">重新测试</button>
          <button onClick={() => setCurrentStep(4)} className="history-btn">查看历史记录</button>
        </div>
      </div>
    )
  }

  // 渲染历史记录
  const renderHistory = () => {
    return (
      <div className="history">
        <h2>测试历史记录</h2>
        {history.length === 0 ? (
          <p>暂无测试记录</p>
        ) : (
          <div className="history-list">
            {history.map(record => (
              <div key={record.id} className="history-item">
                <div className="history-date">{record.date}</div>
                <div className="history-score">{record.score}分</div>
                <div className="history-evaluation">{record.evaluation}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setCurrentStep(0)} className="back-btn">返回首页</button>
      </div>
    )
  }

  // 渲染首页
  const renderHome = () => {
    return (
      <div className="home">
        <h1>职业倦怠测量</h1>
        <p className="description">
          本测试基于国际通用的MBI-GS量表，帮助您评估自己的职业倦怠程度。
          测试包含15个问题，大约需要5-10分钟完成。
        </p>
        <div className="buttons">
          <button onClick={() => setCurrentStep(1)} className="start-btn">开始测试</button>
          <button onClick={() => setCurrentStep(4)} className="history-btn">查看历史记录</button>
        </div>
      </div>
    )
  }

  // 根据当前步骤渲染不同内容
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return renderHome()
      case 1:
        return renderQuestionnaire()
      case 3:
        return renderResult()
      case 4:
        return renderHistory()
      default:
        return renderHome()
    }
  }

  return (
    <div className="app">
      {renderContent()}
    </div>
  )
}

export default App
