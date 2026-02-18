import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, RotateCcw, Home, Sparkles, ArrowLeft, Heart, CloudSun, Smile, Zap, Battery, BookOpen, Flower2, Share2, PlayCircle, Lock, Smartphone, CreditCard, Copy, Check, ExternalLink } from 'lucide-react';
import { scl90Data, calculateSCL90Result } from '../data/questions';

// Helper to detect mobile device
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Background Animation Component
const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="hidden md:block">
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] bg-rose-100/40 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        y: [0, 60, 0],
                        x: [0, -30, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] bg-lavender-100/40 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-yellow-50/30 rounded-full blur-[150px]"
                />
            </div>
            <div className="md:hidden">
                <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-rose-100/30 rounded-full blur-[60px]" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-lavender-100/20 rounded-full blur-[60px]" />
            </div>
        </div>
    );
};

// --- Unlock Screen Component ---
const UnlockScreen = ({ mode, onUnlock, onClose }) => {
    // Shared State
    const [status, setStatus] = useState('idle'); // idle, awaiting_return, scanning, completed
    const [selectedPayment, setSelectedPayment] = useState(null); // 'wechat' | 'alipay'

    // Smart Share Logic (Mobile - Minimal)
    useEffect(() => {
        if (mode !== 'minimal') return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && status === 'awaiting_return') {
                setStatus('completed');
                setTimeout(onUnlock, 800);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [mode, status, onUnlock]);

    const handleCopyLink = () => {
        const shareText = `我刚刚做了一个超准的专业心理体检，免费解锁！你也来测测看？\n${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            setStatus('awaiting_return');
        });
    };

    // Trust Mode Payment Logic
    const handlePayClick = (type) => {
        setSelectedPayment(type);
        setStatus('scanning');
    };

    const handleConfirmPayment = () => {
        setStatus('completed');
        setTimeout(onUnlock, 1500);
    };

    const renderContent = () => {
        // 1. Minimal Mode: Smart Share
        if (mode === 'minimal') {
            return (
                <div className="text-center">
                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <Share2 className="w-10 h-10 text-rose-500" />
                        {status === 'completed' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </motion.div>
                        )}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">推荐给朋友们</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                        为了让更多人关注心理健康，<br />
                        <span className="text-rose-500 font-medium">请将本站分享到微信群或朋友圈，让温暖传递。</span>
                    </p>

                    {status === 'idle' && (
                        <button
                            onClick={handleCopyLink}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-full shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Copy className="w-5 h-5" /> 复制推荐语去分享
                        </button>
                    )}

                    {status === 'awaiting_return' && (
                        <div className="space-y-4">
                            <div className="bg-orange-50 text-orange-600 px-4 py-3 rounded-xl text-sm border border-orange-100 flex items-center gap-2 animate-pulse font-medium">
                                <ExternalLink className="w-4 h-4" /> 链接已复制！请前往微信粘贴分享
                            </div>
                            <p className="text-xs text-slate-400">
                                分享成功后，深度报告将自动为您呈现...
                            </p>
                            <button className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-full flex items-center justify-center gap-2 cursor-wait">
                                等待分享完成...
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // 2 & 3. Rapid & Full (Trust Mode Payment)
        const price = '9.90'; // User requested 9.90 Yuan

        // Render Payment QR Screen if selected
        if (status === 'scanning' || status === 'completed') {
            return (
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <button onClick={() => setStatus('idle')} className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <span className="text-lg font-bold text-slate-700">信任支付</span>
                        <div className="w-6" />
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6 inline-block">
                        {selectedPayment === 'wechat' ? (
                            <div className="w-48 h-48 bg-green-50 flex flex-col items-center justify-center border-2 border-green-100 rounded-xl relative overflow-hidden">
                                <img src="/wechat.jpg" alt="微信收款码" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-green-50 text-green-600 p-4 text-center">
                                    <Smartphone className="w-10 h-10 mb-2" />
                                    <span className="text-xs font-bold">请放入微信收款码图片<br />(wechat.jpg)</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-blue-50 flex flex-col items-center justify-center border-2 border-blue-100 rounded-xl relative overflow-hidden">
                                <img src="/alipay.jpg" alt="支付宝收款码" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-blue-50 text-blue-600 p-4 text-center">
                                    <Smartphone className="w-10 h-10 mb-2" />
                                    <span className="text-xs font-bold">请放入支付宝收款码图片<br />(alipay.jpg)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-2xl font-bold text-slate-800 mb-2">¥ {price}</div>
                    <p className="text-slate-500 text-sm mb-6">
                        这是一次基于信任的支付。<br />您的支持将帮助我们持续改进算法，温暖更多人心。
                    </p>

                    {status === 'completed' ? (
                        <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> 感谢您的信任与支持！
                        </div>
                    ) : (
                        <button
                            onClick={handleConfirmPayment}
                            className={`w-full font-bold py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white ${selectedPayment === 'wechat' ? 'bg-[#09BB07] hover:bg-[#08a806] shadow-green-200' : 'bg-[#1677FF] hover:bg-[#1366db] shadow-blue-200'
                                }`}
                        >
                            <Check className="w-5 h-5" /> 我已完成支付，查看报告
                        </button>
                    )}
                </div>
            );
        }

        // Render Selection Screen (Warm Trust Message)
        return (
            <div className="text-center">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-lg shadow-rose-100/50">
                    <Heart className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">我们需要您的帮助</h3>

                <div className="bg-orange-50/50 rounded-2xl p-5 mb-8 text-left border border-orange-100">
                    <p className="text-slate-600 text-sm leading-relaxed mb-3 font-sans">
                        MindHaven 致力于为每个人提供温暖的心理支持。为了维持服务器运行和持续优化算法，我们需要一点点来自您的力量。
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed font-bold">
                        这是一次 <span className="text-rose-500">“信任支付”</span>。
                    </p>

                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handlePayClick('wechat')}
                        className="bg-[#09BB07] hover:bg-[#08a806] text-white py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                    >
                        微信支持
                    </button>
                    <button
                        onClick={() => handlePayClick('alipay')}
                        className="bg-[#1677FF] hover:bg-[#1366db] text-white py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                    >
                        支付宝支持
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 text-slate-400 text-sm hover:text-slate-600 transition-colors"
                >
                    再看看刚才的分析
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {renderContent()}
            </motion.div>
        </div>
    );
};


const AssessmentEngine = () => {
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [direction, setDirection] = useState(0);

    // Unlock Logic State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    const [testMode, setTestMode] = useState('full');
    const [activeQuestions, setActiveQuestions] = useState([]);

    useEffect(() => {
        let indices = [];
        if (testMode === 'full') {
            indices = scl90Data.questions.map((_, i) => i);
        } else if (testMode === 'rapid') {
            indices = scl90Data.subset50;
        } else if (testMode === 'minimal') {
            indices = scl90Data.subset15;
        }

        const selectedQuestions = indices.map(i => scl90Data.questions[i]);
        setActiveQuestions(selectedQuestions);
    }, [testMode]);

    useEffect(() => {
        if (showResult && testMode === 'minimal' && !isMobileDevice()) {
            setIsUnlocked(true);
        }
    }, [showResult, testMode]);

    const currentQuestion = activeQuestions[currentQuestionIndex];
    const progress = activeQuestions.length > 0 ? ((currentQuestionIndex + 1) / activeQuestions.length) * 100 : 0;

    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentQuestionIndex, started, showResult]);

    const handleStart = (mode) => {
        setTestMode(mode);
        setStarted(true);
        setCurrentQuestionIndex(0);
        setScores({});
        setIsUnlocked(false);
        setShowResult(false);
    };

    const handleAnswer = (score) => {
        setScores(prev => ({ ...prev, [currentQuestion.id]: score }));
        setDirection(1);

        if (currentQuestionIndex < activeQuestions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
        } else {
            setShowResult(true);
        }
    };

    const handleReset = () => {
        setStarted(false);
        setCurrentQuestionIndex(0);
        setScores({});
        setIsUnlocked(false);
        setShowResult(false);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const result = showResult ? calculateSCL90Result(scores) : null;


    // 1. Selection Screen
    if (!started) {
        return (
            <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#fdfbf7] flex flex-col overflow-y-auto">
                <AmbientBackground />

                <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen relative z-10">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-5xl flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-rose-50/50 shadow-lg shadow-rose-100"
                        >
                            <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-slate-800 tracking-wide text-center drop-shadow-sm">
                            选择适合您的测试
                        </h2>

                        <p className="text-slate-500 mb-12 text-center max-w-lg mx-auto">
                            无论您是想快速了解状态，还是进行深度的自我探索，我们都为您准备了合适的方案。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 px-2 md:px-0">
                            {/* Minimal */}
                            <div
                                onClick={() => handleStart('minimal')}
                                className="bg-white/60 hover:bg-white p-8 rounded-3xl cursor-pointer border border-transparent hover:border-rose-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">极简体验</h3>
                                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-4">15 题 · 基础自查</div>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    筛选了最核心的症状指标，适合快速自查。
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                                    <span className="text-xs text-rose-500 flex items-center justify-center gap-1 font-medium bg-rose-50 py-1 px-2 rounded-lg">
                                        <ChevronRight className="w-3 h-3" /> 立即开始
                                    </span>
                                </div>
                            </div>

                            {/* Full */}
                            <div
                                onClick={() => handleStart('full')}
                                className="bg-white border-2 border-rose-100 p-8 rounded-[2rem] cursor-pointer shadow-xl shadow-rose-100/50 relative overflow-hidden flex flex-col items-center text-center transform scale-105 z-10 hover:scale-110 transition-transform duration-300 ring-4 ring-rose-50/50"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-300 to-purple-300" />
                                <div className="absolute top-4 right-4 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">推荐</div>

                                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">完整专业版</h3>
                                <div className="px-3 py-1 bg-rose-100 rounded-full text-xs font-bold text-rose-600 mb-4">90 题 · 深度报告</div>
                                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                                    包含 10 个心理维度的深度评估，提供最精准的分析报告。
                                </p>
                                <div className="mt-auto pt-4 border-t border-rose-50 w-full">
                                    <span className="text-xs text-rose-600 flex items-center justify-center gap-1 font-bold bg-rose-50 py-1 px-2 rounded-lg">
                                        <ChevronRight className="w-3 h-3" /> 立即开始
                                    </span>
                                </div>
                            </div>

                            {/* Rapid */}
                            <div
                                onClick={() => handleStart('rapid')}
                                className="bg-white/60 hover:bg-white p-8 rounded-3xl cursor-pointer border border-transparent hover:border-purple-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4 group-hover:bg-purple-100 group-hover:text-purple-500 transition-colors">
                                    <Battery className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">快速测试</h3>
                                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-4">50 题 · 基础报告</div>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    精简了重复性问题，保留核心维度，平衡时间与精度。
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                                    <span className="text-xs text-purple-600 flex items-center justify-center gap-1 bg-purple-50 py-1 px-2 rounded-lg font-bold">
                                        <ChevronRight className="w-3 h-3" /> 立即开始
                                    </span>
                                </div>
                            </div>

                        </div>

                        <button onClick={() => window.location.reload()} className="mt-4 text-slate-400 hover:text-slate-600 transition-colors text-sm underline underline-offset-4 decoration-slate-200">
                            暂时不想测了
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // 2. Result View (With Lock Screen Logic)
    if (showResult) {
        return (
            <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#fdfbf7] flex flex-col overflow-hidden">
                <AmbientBackground />

                {/* Render Unlock Screen Modal for Payment */}
                <AnimatePresence>
                    {showUnlockModal && !isUnlocked && (
                        <UnlockScreen
                            mode={testMode}
                            onUnlock={() => {
                                setIsUnlocked(true);
                                setShowUnlockModal(false);
                            }}
                            onClose={() => setShowUnlockModal(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex-1 overflow-y-auto relative z-10" ref={contentRef}>
                    <div className="min-h-full flex flex-col items-center justify-center p-4 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] w-full max-w-3xl shadow-xl border border-rose-50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-rose-400 to-purple-200" />

                            {/* Header */}
                            <div className="text-center mb-8 mt-4">
                                <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">您的心理解析报告</h2>
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-500">
                                        {testMode === 'full' ? '完整专业版' : (testMode === 'rapid' ? '快速版' : '极简版')}
                                    </span>
                                    <span className="text-slate-400">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Warm Intro - ALWAYS VISIBLE - Builds Trust & Value */}
                            <div className="mb-10 p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Heart className="w-24 h-24 text-rose-500" />
                                </div>
                                <div className="relative z-10 flex gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-400">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 font-serif">致亲爱的你</h3>
                                        <p className="text-slate-600 leading-relaxed text-[15px] font-sans">
                                            {result.warmIntro || "正在为您生成温暖的解读..."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* General Status - Visible */}
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="text-center min-w-[120px]">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm ${result.level === '健康' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-500'}`}>
                                        {result.level === '健康' ? <Smile className="w-10 h-10" /> : <CloudSun className="w-10 h-10" />}
                                    </div>
                                    <div className="font-bold text-slate-700 text-lg">{result.level === '健康' ? '状态不错' : '需多关爱自己'}</div>
                                </div>
                                <div className="hidden md:block w-px h-16 bg-slate-200" />
                                <div className="text-left flex-1">
                                    <p className="text-slate-500 text-sm leading-loose">
                                        我们通过多维度的分析，为您的大脑和心灵做了一次“体检”。
                                        {result.level === '健康'
                                            ? "结果显示您的心理韧性很好，但也别忘了给持续运转的心灵放个假。"
                                            : "结果显示近期您可能承担了不少压力，身体和情绪都在提醒您需要停下来休息一下了。"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Analysis Section - BLURRED IF LOCKED */}
                            <div className="relative">
                                <div className={`transition-all duration-500 ${!isUnlocked ? 'filter blur-md opacity-40 select-none grayscale-[30%]' : ''}`}>
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-slate-400" /> 深度临床解读
                                    </h3>

                                    <div className="bg-white border border-slate-100 p-6 rounded-2xl mb-8 shadow-sm">
                                        <p className="text-slate-600 leading-loose whitespace-pre-line">
                                            {result.detailedAnalysis || "深度解析内容..."}
                                        </p>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-slate-400" /> 因子详细得分
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
                                        {Object.entries(result.factorScores).map(([factor, data]) => {
                                            if (data.count === 0) return null;
                                            return (
                                                <div key={factor}>
                                                    <div className="flex items-end justify-between mb-2">
                                                        <span className="text-slate-700 text-sm font-bold">{factor}</span>
                                                        <span className="text-xs text-slate-400/80">{scl90Data.factorDescriptions[factor]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${data.avg >= 2 ? 'bg-rose-400' : 'bg-emerald-300'}`}
                                                                style={{ width: `${Math.min((data.avg / 5) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-slate-500 font-mono w-8 text-right font-medium">{data.avg}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Comprehensive Factor Analysis & Suggestions - New Section */}
                                    {result.comprehensiveAnalysis && (
                                        <div className="mt-12 pt-8 border-t border-slate-100/50">
                                            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                                <Flower2 className="w-5 h-5 text-slate-400" /> 全维度深度心理画像 & 专属建议
                                            </h3>
                                            <div className="grid grid-cols-1 gap-6">
                                                {result.comprehensiveAnalysis.map((item, index) => (
                                                    <div key={index} className={`p-6 rounded-2xl border ${item.score >= 2 ? 'bg-orange-50/30 border-orange-100' : 'bg-green-50/30 border-green-50'}`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                                                                {item.factor}
                                                                <span className={`text-xs px-2 py-1 rounded-full ${item.score >= 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                                    {item.status} ({item.score})
                                                                </span>
                                                            </h4>
                                                        </div>
                                                        <p className="text-slate-600 text-sm leading-relaxed mb-3 font-medium">
                                                            {item.insight}
                                                        </p>
                                                        <div className="bg-white/60 p-3 rounded-lg text-slate-500 text-xs flex gap-2">
                                                            <span className="shrink-0 pt-0.5">💡</span>
                                                            <span>{item.suggestion}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* LOCK OVERLAY - Only shows if NOT unlocked */}
                                {!isUnlocked && (
                                    <div className="absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-start text-center p-6 pt-12 min-h-[500px]">
                                        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 max-w-sm w-full mx-auto sticky top-12">
                                            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-sm">
                                                <Lock className="w-7 h-7" />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">解锁深度临床解读</h4>
                                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                                想了解更深层的自己？<br />所有的情绪都值得被看见和理解。
                                            </p>
                                            <button
                                                onClick={() => testMode === 'minimal' ? setShowUnlockModal(true) : setShowUnlockModal(true)}
                                                className="w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-full font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {testMode === 'minimal' ? '分享免费解锁' : '支持我们 (¥9.90)'} <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <p className="text-[10px] text-slate-400 mt-3">
                                                {testMode === 'minimal' ? '只需简单分享即可' : '每一份支持都让我们走得更远'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons Area - Only show Reset if unlocked, or put it below */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 border-t border-slate-100 pt-8">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    重新评测
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                                >
                                    返回首页
                                </button>
                            </div>
                        </motion.div>

                        <div className="h-10" />
                    </div>
                </div>
            </div>
        );
    }

    // 3. Question View
    return (
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#fdfbf7] flex flex-col font-sans">
            <AmbientBackground />

            {/* Top Navigation */}
            <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
                <button onClick={handleReset} className="pointer-events-auto flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors px-4 py-2 rounded-full hover:bg-white/50 backdrop-blur-sm group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">退出</span>
                </button>

                <div className="text-rose-400 font-serif font-bold text-xl italic tracking-wider opacity-50">
                    MindHaven
                </div>

                <div className="w-20" />
            </div>

            {/* Main Question Area - Scrollable */}
            <div className="flex-1 overflow-y-auto flex flex-col relative z-10" ref={contentRef}>
                <div className="min-h-full flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto pt-24 pb-12">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.div
                            key={currentQuestion?.id || 'end'}
                            custom={direction}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.4 }}
                            className="w-full text-center"
                        >
                            {currentQuestion && (
                                <>
                                    <div className="mb-4 text-rose-400 font-medium tracking-widest text-xs uppercase bg-rose-50/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
                                        QUESTION {currentQuestionIndex + 1} / {activeQuestions.length}
                                    </div>

                                    <div className="mb-2 text-slate-400 text-sm font-light tracking-wide">
                                        最近一周，您是否经常感到…
                                    </div>

                                    <h2 className="text-2xl md:text-4xl font-serif font-medium text-slate-800 mb-12 leading-relaxed px-4 drop-shadow-sm">
                                        {currentQuestion.text}
                                    </h2>

                                    <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
                                        {currentQuestion.options.map((option, idx) => (
                                            <motion.button
                                                key={option.text}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + idx * 0.05 }}
                                                whileHover={{ scale: 1.02, backgroundColor: '#fff0f1', borderColor: '#fecdd3' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswer(option.score)}
                                                className="w-full py-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm text-slate-600 font-medium text-lg transition-all hover:text-rose-500 hover:shadow-md"
                                            >
                                                {option.text}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Previous Button */}
                                    {currentQuestionIndex > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={handlePrevious}
                                            className="mt-8 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2 mx-auto text-sm group"
                                        >
                                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            返回上一题
                                        </motion.button>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Progress - Fixed */}
            <div className="w-full h-1.5 bg-slate-100 z-30">
                <motion.div
                    className="h-full bg-rose-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};

export default AssessmentEngine;
