import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, Sparkles, Coffee, Sun, Moon, Flower2 } from 'lucide-react'
import AssessmentEngine from './components/AssessmentEngine'

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/60 backdrop-blur-md p-6 rounded-3xl hover:bg-white/90 transition-all duration-500 cursor-pointer group border border-white/50 text-center shadow-sm hover:shadow-xl hover:shadow-rose-100 ring-1 ring-white/60"
  >
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-6 h-6 text-rose-400 group-hover:text-rose-500 transition-colors" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-700 font-serif">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-sans">{description}</p>
  </motion.div>
)

function App() {
  const [showAssessment, setShowAssessment] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-sans bg-[#fdfbf7]">

      {/* Soft Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-rose-100/40 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-lavender-100/40 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-yellow-50/60 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation - Simplified & Centered */}
      <nav className="absolute top-0 left-0 w-full z-50 flex justify-center py-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowAssessment(false)}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-300 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-200/50 group-hover:scale-105 transition-transform duration-300">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-700 font-serif">MindHaven</span>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {showAssessment && (
          <AssessmentEngine />
        )}
      </AnimatePresence>

      {!showAssessment && (
        <main className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-screen-xl mx-auto px-4 py-20 min-h-screen">

          <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center mb-20">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-white mb-8 shadow-sm backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-slate-500 tracking-wide">温暖治愈的心灵栖息地</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight text-slate-800 font-serif"
            >
              <div className="flex flex-col items-center">
                <span className="block text-slate-600/80 text-4xl md:text-5xl mb-2 italic font-normal">Discover</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-br from-rose-400 via-rose-500 to-purple-500 py-2">
                  温柔的自己
                </span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl leading-loose font-sans"
            >
              在这个喧嚣的世界里，给自己留一段独处的空白。<br />
              通过 SCL-90 专业评测，倾听内心的声音，拥抱最真实的感受。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full"
            >
              <button
                onClick={() => setShowAssessment(true)}
                className="group px-10 py-4 rounded-full bg-slate-800 text-white font-medium text-lg flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[200px]"
              >
                开启疗愈之旅 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-4 rounded-full bg-white text-slate-700 font-medium text-lg border border-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2">
                <Coffee className="w-5 h-5 text-rose-300" /> 了解更多
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-2">
            <FeatureCard
              icon={Heart}
              title="SCL-90 专业版"
              description="包含90个细腻的情绪维度，帮助你全面了解当下的心理状态，不贴标签，只为理解。"
              delay={0.8}
            />
            <FeatureCard
              icon={Sun}
              title="温暖的洞察"
              description="像挚友一样，为你解读数据背后的情绪密码，提供温暖且有力量的建议。"
              delay={1.0}
            />
            <FeatureCard
              icon={Moon}
              title="晚安疗愈"
              description="基于你的状态，为你推荐睡前冥想和舒缓练习，愿你每晚好梦。"
              delay={1.2}
            />
          </div>
        </main>
      )}
    </div>
  )
}

export default App
