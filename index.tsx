import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Trophy, TrendingUp, BookOpen, Calculator, Globe, Microscope, Palette, Music, Dumbbell, Code, Languages, Sun, Moon, Save, RefreshCw, Award, Target, Zap, Star } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  gradient: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export default function PerformanceTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker');
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  
  const initialSubjects: Subject[] = [
    { id: 'math', name: 'Mathématiques', icon: <Calculator className="w-5 h-5" />, value: 50, color: 'from-blue-400 to-blue-600', gradient: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { id: 'french', name: 'Français', icon: <BookOpen className="w-5 h-5" />, value: 50, color: 'from-purple-400 to-purple-600', gradient: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { id: 'english', name: 'Anglais', icon: <Languages className="w-5 h-5" />, value: 50, color: 'from-green-400 to-green-600', gradient: 'bg-gradient-to-r from-green-400 to-green-600' },
    { id: 'history', name: 'Histoire-Géo', icon: <Globe className="w-5 h-5" />, value: 50, color: 'from-amber-400 to-amber-600', gradient: 'bg-gradient-to-r from-amber-400 to-amber-600' },
    { id: 'science', name: 'Sciences', icon: <Microscope className="w-5 h-5" />, value: 50, color: 'from-cyan-400 to-cyan-600', gradient: 'bg-gradient-to-r from-cyan-400 to-cyan-600' },
    { id: 'art', name: 'Arts', icon: <Palette className="w-5 h-5" />, value: 50, color: 'from-pink-400 to-pink-600', gradient: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { id: 'music', name: 'Musique', icon: <Music className="w-5 h-5" />, value: 50, color: 'from-indigo-400 to-indigo-600', gradient: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
    { id: 'sport', name: 'Sport', icon: <Dumbbell className="w-5 h-5" />, value: 50, color: 'from-red-400 to-red-600', gradient: 'bg-gradient-to-r from-red-400 to-red-600' },
    { id: 'tech', name: 'Technologie', icon: <Code className="w-5 h-5" />, value: 50, color: 'from-teal-400 to-teal-600', gradient: 'bg-gradient-to-r from-teal-400 to-teal-600' },
  ];

  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [badges, setBadges] = useState<Badge[]>([
    { id: 'perfectionist', name: 'Perfectionniste', description: 'Toutes les matières à 80%+', icon: <Trophy className="w-6 h-6" />, unlocked: false },
    { id: 'balanced', name: 'Équilibré', description: 'Aucune matière en dessous de 40%', icon: <Target className="w-6 h-6" />, unlocked: false },
    { id: 'specialist', name: 'Spécialiste', description: 'Une matière à 100%', icon: <Star className="w-6 h-6" />, unlocked: false },
    { id: 'improver', name: 'En progression', description: 'Moyenne générale > 70%', icon: <TrendingUp className="w-6 h-6" />, unlocked: false },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('performanceData');
    if (saved) {
      setSubjects(JSON.parse(saved));
    }
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    checkBadges();
  }, [subjects]);

  const checkBadges = () => {
    const newBadges = [...badges];
    newBadges[0].unlocked = subjects.every(s => s.value >= 80);
    newBadges[1].unlocked = subjects.every(s => s.value >= 40);
    newBadges[2].unlocked = subjects.some(s => s.value === 100);
    const average = subjects.reduce((acc, s) => acc + s.value, 0) / subjects.length;
    newBadges[3].unlocked = average > 70;
    setBadges(newBadges);
  };

  const handleSliderChange = (id: string, value: number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, value } : s));
  };

  const saveData = () => {
    localStorage.setItem('performanceData', JSON.stringify(subjects));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    setShowSaveAnimation(true);
    setTimeout(() => setShowSaveAnimation(false), 2000);
  };

  const resetData = () => {
    setSubjects(initialSubjects);
    localStorage.removeItem('performanceData');
  };

  const getPerformanceLabel = (value: number) => {
    if (value >= 90) return { text: 'Excellent! 🌟', color: 'text-green-500' };
    if (value >= 70) return { text: 'Très bien! 💪', color: 'text-blue-500' };
    if (value >= 50) return { text: 'Correct 👍', color: 'text-yellow-500' };
    if (value >= 30) return { text: 'À améliorer 📚', color: 'text-orange-500' };
    return { text: 'Révisions nécessaires 🎯', color: 'text-red-500' };
  };

  const getAverageScore = () => {
    return Math.round(subjects.reduce((acc, s) => acc + s.value, 0) / subjects.length);
  };

  const chartData = subjects.map(s => ({
    subject: s.name.substring(0, 4),
    score: s.value,
    fullName: s.name
  }));

  const radarData = subjects.map(s => ({
    subject: s.name,
    score: s.value,
  }));

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'}`}>
      {showSaveAnimation && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Save className="w-5 h-5" />
            <span className="font-medium">Sauvegardé!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Performance Tracker
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Visualise ta progression</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setDarkMode(!darkMode); localStorage.setItem('darkMode', JSON.stringify(!darkMode)); }}
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-lg`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={saveData}
                className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>
              <button
                onClick={resetData}
                className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {['tracker', 'stats', 'badges'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'tracker' && 'Évaluation'}
              {tab === 'stats' && 'Statistiques'}
              {tab === 'badges' && 'Badges'}
            </button>
          ))}
        </div>

        {activeTab === 'tracker' && (
          <div className="grid gap-4">
            <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Score Moyen</h2>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className={`text-3xl font-bold ${getAverageScore() >= 70 ? 'text-green-500' : getAverageScore() >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {getAverageScore()}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${getAverageScore()}%` }}
                />
              </div>
            </div>

            {subjects.map((subject) => {
              const performance = getPerformanceLabel(subject.value);
              return (
                <div
                  key={subject.id}
                  className={`p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-3 rounded-xl ${subject.gradient} text-white shadow-lg`}>
                        {subject.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {subject.name}
                        </h3>
                        <p className={`text-sm font-medium ${performance.color}`}>
                          {performance.text}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {subject.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={subject.value}
                      onChange={(e) => handleSliderChange(subject.id, parseInt(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, ${subject.color.split(' ')[1]} 0%, ${subject.color.split(' ')[3]} ${subject.value}%, #e5e7eb ${subject.value}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>À réviser</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Excellent</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid gap-6">
            <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vue d'ensemble</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="subject" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(value) => chartData.find(d => d.subject === value)?.fullName}
                  />
                  <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Radar des compétences</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <PolarAngleAxis dataKey="subject" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Radar name="Score" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-2xl shadow-xl transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white transform hover:scale-105'
                    : darkMode ? 'bg-gray-800 opacity-50' : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-4 rounded-full ${badge.unlocked ? 'bg-white/20' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {React.cloneElement(badge.icon as React.ReactElement, {
                      className: `w-8 h-8 ${badge.unlocked ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-400'}`
                    })}
                  </div>
                  <h3 className={`font-bold ${badge.unlocked ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-sm ${badge.unlocked ? 'text-white/90' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {badge.description}
                  </p>
                  {badge.unlocked && (
                    <Award className="w-6 h-6 text-white animate-bounce" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: none;
          transition: transform 0.2s;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
