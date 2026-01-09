import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import css from './Dashboard.module.css';
import GoogleFitLogin from "./GoogleFitLogin";
import { FITCHAT_DATA } from "./utils/fitChat";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import DailyChallenge from "./components/DailyChallenge";
import StreakHeatmap from "./components/StreakHeatmap";
import AchievementsModal from "./components/AchievementsModal";
import WinterEffect from "./components/WinterEffect";
import ChristmasTheme from "./components/ChristmasTheme";

const API_BASE = import.meta.env.VITE_API_URL;





const Dashboard = () => {
  // Constant
              //doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

  const navigate =  useNavigate();
  const GLASS_CAPACITY = 500;
  const PIE_COLORS = ["#36d1dc", "#2c2f4a"];
  
  const getTodayLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  
  const todayStr = getTodayLocal();
  //not
  const quotes = [
    "💪 The only bad workout is the one that didn't happen.",
    "🌊 Water is life. Stay hydrated, stay healthy!",
    "🔥 Your future self will thank you for today's effort.",
    "🌟 Small progress is still progress.",
    "⚡ Energy flows where attention goes.",
    "🏆 Champions are made in the daily routine."
  ];

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // UI State
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuotePopup, setShowQuotePopup] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showWaterCongrats, setShowWaterCongrats] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBmiHistory, setShowBmiHistory] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  const [streakRefresh, setStreakRefresh] = useState(0);//streakk
const [showAchievements, setShowAchievements] = useState(false);


  // Todo State
  const [dailyTodo, setDailyTodo] = useState([]);
  const [selectedDayTodos, setSelectedDayTodos] = useState([]);
  const completedTodos = selectedDayTodos.filter(t => t.done);
const pendingTodos = selectedDayTodos.filter(t => !t.done);

  const [weeklyTodoData, setWeeklyTodoData] = useState([]);
  const [monthlyTodoData, setMonthlyTodoData] = useState([]);
  const [todayCompletion, setTodayCompletion] = useState(0);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmTodoId, setConfirmTodoId] = useState(null);
  const [pieView, setPieView] = useState("today");
  const isViewingToday = selectedDate === todayStr;
  const [snowOn, setSnowOn] = useState(false);//wintertheme


  // BMI State
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('#36d1dc');
  const [bmiHistory, setBmiHistory] = useState([]);
  const [loadingBmiHistory, setLoadingBmiHistory] = useState(false);
  const [isBmiFlipped, setIsBmiFlipped] = useState(false);

  // Water Tracker State
const [waterGoalLiters, setWaterGoalLiters] = useState(null);
  const [waterGlasses, setWaterGlasses] = useState([]);
const [waterLoading, setWaterLoading] = useState(true);


  const [totalWater, setTotalWater] = useState(0);
  const [isWaterGoalLocked, setIsWaterGoalLocked] = useState(false);
  const [waterHistory, setWaterHistory] = useState([]);
const [selectedWaterDate, setSelectedWaterDate] = useState(getTodayLocal());
const [isEditingWaterGoal, setIsEditingWaterGoal] = useState(false);



  // Google Fit State
  const [googleFitData, setGoogleFitData] = useState(
    JSON.parse(localStorage.getItem("googleFitData")) || {}
  );

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Edit Profile State
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    oldPassword: "",
    newPassword: ""
  });

  // Workouts State
  const [activeWorkouts, setActiveWorkouts] = useState([
    { id: 1, name: 'Morning HIIT', duration: '30 min', calories: 320, icon: '⚡', status: 'completed' },
    { id: 2, name: 'Evening Yoga', duration: '45 min', calories: 280, icon: '🧘', status: 'pending' },
    { id: 3, name: 'Swimming', duration: '1 hour', calories: 500, icon: '🏊', status: 'upcoming' }
  ]);

  // Celebrities State
  const [celebrities] = useState([
    {
      id: 1,
      name: "Virat Kohli",
      sport: "Cricket",
      image: "/virat.jpg",
      stats: "8% Body Fat | 69kg | 175cm",
      routine: {
        morning: "5:00 AM - Wake up, lemon water\n5:30 AM - Cardio\n7:00 AM - Breakfast\n8:00 AM - Net practice",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Rest\n4:00 PM - Gym session\n6:00 PM - Fielding practice",
        evening: "8:00 PM - Dinner\n9:00 PM - Recovery\n10:30 PM - Sleep"
      }
    },
    {
      id: 2,
name: "Cristiano Ronaldo",
      sport: "Football",
image: "/CRISTIANO.jpg",
      stats: "5% Body Fat | 84kg | 187cm",
      routine: {
        morning: "5:30 AM - Wake up\n6:00 AM - Protein breakfast\n7:00 AM - Cardio\n9:00 AM - Strength training",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Power nap\n4:00 PM - Skill drills\n6:00 PM - Recovery",
        evening: "8:00 PM - Light dinner\n9:30 PM - Stretching\n10:30 PM - Sleep"
      }
    },
    {
      id: 3,
      name: "Serena Williams",
      sport: "Tennis",
    image: "/Serena-Williams.jpg",
      stats: "Muscle Mass 45% | 72kg | 175cm",
      routine: {
        morning: "6:00 AM - Wake up\n6:30 AM - Stretching\n7:00 AM - Breakfast\n8:00 AM - Tennis practice",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Strength training\n4:00 PM - Cardio",
        evening: "7:00 PM - Dinner\n8:00 PM - Recovery\n9:30 PM - Sleep"
      }
    },
    {
      id: 4,
      name: "LeBron James",
      sport: "Basketball",
image: "/lebron-james.jpg",
      stats: "113kg | 206cm | Vertical Jump 111cm",
      routine: {
        morning: "5:00 AM - Wake up\n5:30 AM - Breakfast\n6:30 AM - Shooting drills\n8:00 AM - Weight training",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Film study\n4:00 PM - Skill work",
        evening: "8:00 PM - Dinner\n9:00 PM - Cryotherapy\n10:00 PM - Sleep"
      }
    },
    {
      id: 5,
      name: "Simone Biles",
      sport: "Gymnastics",
image: "/simone-biles.jpg",
      stats: "47kg | 142cm | 5 Olympic Golds",
      routine: {
        morning: "6:30 AM - Wake up\n7:00 AM - Breakfast\n8:00 AM - Gym training",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Conditioning\n5:00 PM - Physical therapy",
        evening: "7:30 PM - Dinner\n8:30 PM - Mental training\n10:00 PM - Sleep"
      }
    },
    {
      id: 6,
      name: "Katie Ledecky",
      sport: "Swimming",
image: "/katie-ledecky.jpg",
      stats: "Swims 60km/week | 5 Olympic Golds",
      routine: {
        morning: "4:30 AM - Wake up\n5:00 AM - Swim session\n7:30 AM - Breakfast",
        afternoon: "12:00 PM - Lunch\n3:00 PM - Second swim session\n6:00 PM - Strength training",
        evening: "8:00 PM - Dinner\n9:30 PM - Recovery\n10:00 PM - Sleep"
      }
    },
    {
      id: 7,
      name: "Mary Kom",
      sport: "Boxing",
        image: "/mary-kom.jpg",
      stats: "6 World Championships | 51kg | 158cm",
      routine: {
        morning: "5:00 AM - Wake up\n5:30 AM - Roadwork\n7:00 AM - Breakfast",
        afternoon: "12:30 PM - Lunch\n4:00 PM - Strength training\n6:00 PM - Sparring",
        evening: "8:00 PM - Dinner\n9:00 PM - Family time\n10:00 PM - Sleep"
      }
    }
  ]);

  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const sliderCelebrities = celebrities.filter(c =>
  [
    "Virat Kohli",
    "Cristiano Ronaldo",
    "Serena Williams",
    "LeBron James",
    "Katie Ledecky",
    "Mary Kom",
    "Simone Biles"
  ].includes(c.name)
);


  // Helper Functions
  const isToday = (dateStr) => dateStr === todayStr;

  const getPiePercent = () => {
    if (pieView === "today") {
      return todayCompletion;
    }

    if (pieView === "week") {
      if (weeklyTodoData.length === 0) return 0;
      const avg = weeklyTodoData.reduce(
        (sum, d) => sum + (d.completionPercent || 0),
        0
      ) / weeklyTodoData.length;
      return Math.round(avg);
    }

    if (pieView === "month") {
      if (monthlyTodoData.length === 0) return 0;
      const avg = monthlyTodoData.reduce(
        (sum, d) => sum + (d.completionPercent || 0),
        0
      ) / monthlyTodoData.length;
      return Math.round(avg);
    }

    return 0;
  };

  const piePercent = getPiePercent();
const safePiePercent =
  typeof piePercent !== "number"
    ? 0
    : Math.max(0, Math.min(100, piePercent));


const pieData = useMemo(() => {
  return [
    { name: "Completed", value: safePiePercent },
    { name: "Remaining", value: 100 - safePiePercent }
  ];
}, [safePiePercent]);


const addNewTodo = async () => {
  if (!newTodo.trim() || !user?._id) return;

  const newItem = {
    id: Date.now(),
    label: newTodo.toUpperCase(),
    target: "Required",
    done: false,
    locked: false
  };

  const updatedTodos = [...dailyTodo, newItem];

  // 1️⃣ Update UI immediately
  setDailyTodo(updatedTodos);
  setNewTodo("");

  try {
await fetch(`${API_BASE}/api/todo/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        date: todayStr,
        todos: updatedTodos
      })
    });
  } catch (err) {
    console.error("ADD TODO SAVE ERROR:", err);
  }
};


const deleteTodo = async (id) => {
  const updatedTodos = dailyTodo.filter(
    item => (item._id || item.id) !== id
  );

  // Update UI
  setDailyTodo(updatedTodos);

  //doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

  // Save to DB
  try {
await fetch(`${API_BASE}/api/todo/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        date: selectedDate,
        todos: updatedTodos
      })
    });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
  }
};


  const updateTarget = (id, value) => {
    if (!isEditMode) return;
    setDailyTodo(prev =>
      prev.map(item =>
        item.id === id ? { ...item, target: value } : item
      )
    );
  };

  const toggleDone = (id) => {
    const task = dailyTodo.find(t => t.id === id);
    if (!task || task.locked) return;
    setConfirmTodoId(id);
  };

const handleWaterGoalChange = (e) => {
  let value = Number(e.target.value);
  if (value < 1) value = 1;
  if (value > 5) value = 5;

  // ONLY update goal number
  setWaterGoalLiters(value);
};

  const handleSetWaterGoal = async () => {
  if (!user?._id) return alert("User not logged in");

  try {
    const res = await fetch(`${API_BASE}/api/water/set-goal`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        date: getTodayLocal(),
        goalLiters: waterGoalLiters
      })
    });

    const data = await res.json();

  if (data.success) {
  setIsWaterGoalLocked(true);

  const count = (waterGoalLiters * 1000) / GLASS_CAPACITY;
  setWaterGlasses(Array(count).fill(0));
}
 else {
      alert(data.message || "Goal already set");
    }
  } catch (err) {
    alert("Server error");
  }
};


const toggleWaterGlass = (index) => {
  if (!isWaterGoalLocked) return;

  const newGlasses = [...waterGlasses];

  if (newGlasses[index] === 0) {
    newGlasses[index] = 250;
  } else if (newGlasses[index] === 250) {
    newGlasses[index] = 500;
  } else {
    newGlasses[index] = 0;
  }

  setWaterGlasses(newGlasses);

  const totalMl = newGlasses.reduce((sum, v) => sum + v, 0);
  saveWaterProgress(totalMl);
};

const fillAllWater = () => {
  if (!isWaterGoalLocked) {
    alert("Please set water goal first 💧");
    return;
  }

  setWaterGlasses(
    Array((waterGoalLiters * 1000) / GLASS_CAPACITY).fill(500)
  );
};

const resetWaterTracker = () => {
  if (!isWaterGoalLocked) return;

  const empty = Array(waterGlasses.length).fill(0);
  setWaterGlasses(empty);
  saveWaterProgress(0);
};


  const showCelebrityRoutine = (celebrity) => {
    setSelectedCelebrity(celebrity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCelebrity(null);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.toLowerCase();

    setChatMessages(prev => [...prev, "You: " + chatInput]);
    setChatInput("");

    let reply = "🤖 I can help with fitness, water, calories, BMI, sleep, workouts, and health tips. Try asking something related!";
    for (let item of FITCHAT_DATA) {
      if (item.keywords.some(keyword => userMessage.includes(keyword))) {
        reply = item.answer;
        break;
      }
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, "FitChat: " + reply]);
    }, 500);
  };

  // API Functions
  const saveDailyTodo = async () => {
    try {
      if (!user?._id) {
        alert("User not logged in");
        return;
      }

await fetch(`${API_BASE}/api/todo/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          date: getTodayLocal(),
          todos: dailyTodo
        })
      });

      setIsEditMode(false);
      alert("Daily Todo Saved!");
    } catch (err) {
      console.error("SAVE TODO ERROR:", err);
      alert("Failed to save todo");
    }
  };
  //bmiapi

  const handleSaveBMI = async () => {
    try {
      if (!user?._id) {
        alert("User not logged in");
        return;
      }

      const res = await fetch(`${API_BASE}/api/bmi/save`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          bmi: Number(bmi)
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("BMI saved successfully ✅");
      } else {
        alert("Failed to save BMI ❌");
      }
    } catch (error) {
      console.error("SAVE BMI ERROR:", error);
      alert("Server error while saving BMI");
    }
  };

  const handleOpenBmiHistory = async () => {
    try {
      if (!user?._id) return alert("User not logged in");
      setLoadingBmiHistory(true);

      const res = await fetch(`${API_BASE}/api/bmi/history/${user._id}`)

      const data = await res.json();

      if (data.success) {
        setBmiHistory(data.history);
        setShowBmiHistory(true);
      } else {
        alert("Failed to load BMI history");
      }
    } catch (err) {
      console.error("BMI HISTORY ERROR:", err);
      alert("Server error");
    } finally {
      setLoadingBmiHistory(false);
    }
  };

  const handleDeleteBmiHistory = async () => {
  if (!user?._id) return;

  const confirmDelete = window.confirm("Delete all BMI history?");
  if (!confirmDelete) return;

  try {
const res = await fetch(
  `${API_BASE}/api/bmi/history/${user._id}`,
  { method: "DELETE" }
);


    const data = await res.json();

    if (data.success) {
      setBmiHistory([]);
      alert("BMI history deleted ✅");
    } else {
      alert("Failed to delete BMI history ❌");
    }
  } catch (err) {
    console.error("BMI DELETE ERROR:", err);
    alert("Server error");
  }
};

//doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2222222222222222222222222

const selectedWaterRecord =
  selectedWaterDate === todayStr
    ? null
    : waterHistory.find(d => d.date === selectedWaterDate);

const completedMl =
  selectedWaterDate === todayStr
    ? totalWater
    : (selectedWaterRecord?.totalDrankMl || 0);
    
const goalMl =
  selectedWaterDate === todayStr
    ? waterGoalLiters ? waterGoalLiters * 1000 : 0
    : selectedWaterRecord
      ? selectedWaterRecord.goalLiters * 1000
      : 0;


const waterCompletedPercent =
  goalMl === 0
    ? 0
    : Math.round((completedMl / goalMl) * 100);

const waterPieData = [
  { name: "Completed", value: waterCompletedPercent },
  { name: "Remaining", value: 100 - waterCompletedPercent }
];


const confirmComplete = async (id) => {
  if (!isViewingToday) return;

  let updatedTodos = [];

  setDailyTodo(prev => {
    updatedTodos = prev.map(item =>
      (item._id || item.id) === id
        ? { ...item, done: true, locked: true }
        : item
    );

    const completed = updatedTodos.filter(t => t.done).length;

    if (completed === updatedTodos.length) {
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 4000);
    }

    return updatedTodos;
  });

  setConfirmTodoId(null);

  try {
await fetch(`${API_BASE}/api/todo/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        date: todayStr,   // ✅ FIX IS HERE
        todos: updatedTodos
      })
    });
  } catch (err) {
    console.error("CONFIRM SAVE ERROR:", err);
  }
};


  const handleSaveProfile = async () => {
    const payload = {
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      phone: editData.phone,
      gender: editData.gender,
      oldPassword: editData.oldPassword,
      newPassword: editData.newPassword
    };

    const res = await fetch(`${API_BASE}/api/update-profile/${user._id}`, {

      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile Updated Successfully!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setShowEditModal(false);
    } else {
      alert(data.message);
    }
  };

  // Styling Constants
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white"
  };

  const saveBtnStyle = {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px"
  };

  // useEffect Hooks (in proper sequence)
  //bbmi
  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(calculatedBmi);

    if (calculatedBmi < 18.5) {
      setBmiCategory('Underweight');
      setBmiColor('#3498db');
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setBmiCategory('Fit');
      setBmiColor('#2ecc71');
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setBmiCategory('Overweight');
      setBmiColor('#f39c12');
    } else {
      setBmiCategory('Obese');
      setBmiColor('#e74c3c');
    }
  }, [height, weight]);
  

useEffect(() => {
  if (waterGoalLiters == null) return;

  const total = waterGlasses.reduce((sum, v) => sum + v, 0);
  setTotalWater(total);

  if (
    isWaterGoalLocked &&
    total > 0 &&
    total >= waterGoalLiters * 1000
  ) {
    setShowWaterCongrats(true);
    setTimeout(() => setShowWaterCongrats(false), 3500);
  }
}, [waterGlasses, waterGoalLiters, isWaterGoalLocked]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
      setShowQuotePopup(true);
      setTimeout(() => setShowQuotePopup(false), 5000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const saveWaterProgress = async (totalMl) => {
  if (!user?._id || !isWaterGoalLocked) return;

  try {
    await fetch(`${API_BASE}/api/water/update`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        date: getTodayLocal(),
        totalDrankMl: totalMl
      })
    });
  } catch (err) {
    console.error("WATER UPDATE ERROR:", err);
  }
};
useEffect(() => {
  if (!user?._id) return;

  setWaterLoading(true);

fetch(`${API_BASE}/api/water/history/${user._id}`)
    .then(res => res.json())
  .then(data => {
  if (!data.success) return;

  setWaterHistory(data.history || []);

  const today = getTodayLocal();
  const todayRecord = data.history.find(d => d.date === today);

  if (!todayRecord) {
    setWaterGoalLiters(null);
    setIsWaterGoalLocked(false);
    setWaterGlasses([]);
    setTotalWater(0);
    return;
  }

  setWaterGoalLiters(todayRecord.goalLiters);
  setIsWaterGoalLocked(true);

  const glassCount =
    (todayRecord.goalLiters * 1000) / GLASS_CAPACITY;

  const filledGlasses = Array(glassCount).fill(0);
  let remaining = todayRecord.totalDrankMl;

  for (let i = 0; i < filledGlasses.length; i++) {
    if (remaining >= 500) {
      filledGlasses[i] = 500;
      remaining -= 500;
    } else if (remaining >= 250) {
      filledGlasses[i] = 250;
      remaining -= 250;
    }
  }

  setWaterGlasses(filledGlasses);
  setTotalWater(todayRecord.totalDrankMl);
})
.finally(() => setWaterLoading(false));

}, [user]);

  useEffect(() => {
    const refreshToken = localStorage.getItem("googleFitRefreshToken");
    if (!refreshToken) return;

fetch(`${API_BASE}/api/googlefit/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("googleFitAccessToken", data.access_token);
          localStorage.setItem("googleFitData", JSON.stringify(data.fitnessData));
          setGoogleFitData(data.fitnessData);
        }
      })
      .catch(err => console.log("REFRESH ERROR:", err));
  }, []);

useEffect(() => {
  if (!user?._id) return;
  if (selectedDate !== todayStr) return;

fetch(`${API_BASE}/api/todo/today/${user._id}`)
    .then(res => res.json())
    .then(data => {
      const todos = data?.todos || [];

      // 1️⃣ Update todo list (edit section)
      setDailyTodo(todos);

      // 2️⃣ Update pie breakdown (completed / pending)
      setSelectedDayTodos(todos);
    })
    .catch(() => {
      setDailyTodo([]);
      setSelectedDayTodos([]);
    });
}, [user, selectedDate, todayStr]);



  useEffect(() => {
    if (!user?._id) return;

fetch(`${API_BASE}/api/todo/week/${user._id}`)
      .then(res => res.json())
      .then(data => {
        setWeeklyTodoData(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("WEEK TODO FETCH ERROR:", err));
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

fetch(`${API_BASE}/api/todo/month/${user._id}`)
      .then(res => res.json())
      .then(data => {
        setMonthlyTodoData(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("MONTH TODO FETCH ERROR:", err));
  }, [user]);

useEffect(() => {
  if (!user?._id) return;

fetch(`${API_BASE}/api/todo/auto-rollover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user._id })
  }).catch(() => {});
}, [user, todayStr]);


useEffect(() => {
  if (!user?._id) return;

  const checkNewDay = () => {
    const now = getTodayLocal();

    if (now !== selectedDate) {
      setSelectedDate(now);
      setDailyTodo([]);
      setTodayCompletion(0);
    }
  };

  
  // check every 1 minute
  const interval = setInterval(checkNewDay, 60000);

  return () => clearInterval(interval);
}, [user, selectedDate]);

useEffect(() => {
  if (!user?._id) return;

  // TODAY → calculate from UI
  if (selectedDate === todayStr) {
    const total = dailyTodo.length;
    const completed = dailyTodo.filter(t => t.done).length;
    setTodayCompletion(
      total === 0 ? 0 : Math.round((completed / total) * 100)
    );
    return;
  }

  // PAST → fetch from DB
fetch(`${API_BASE}/api/todo/by-date`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      date: selectedDate
    })
  })
    .then(res => res.json())
.then(data => {
  setTodayCompletion(data?.completionPercent || 0);
  setSelectedDayTodos(data?.todos || []);
})
    .catch(() => setTodayCompletion(0));

}, [selectedDate, dailyTodo, user, todayStr]);


useEffect(() => {
  if (!sliderCelebrities.length) return;

  const interval = setInterval(() => {
    setSelectedIndex(prev =>
      prev === sliderCelebrities.length - 1 ? 0 : prev + 1
    );
  }, 8000); // ⏱ 8 seconds

  return () => clearInterval(interval);
}, [sliderCelebrities.length]);




 

  // Main Render
  return (
    <div className={css.container}>
      {snowOn && <WinterEffect />}
      {snowOn && <ChristmasTheme />}


      <div className={css.contentContainer}>
        <nav className={css.navbar}>
          <div className={css.logo}>
            <h1 className={css.logoText}>FitNation</h1>
          </div>
<div className={css.navRight}>
<button
  className={css.snowToggleBtn}
  onClick={() => setSnowOn(prev => !prev)}
>
  {snowOn ? "❄ Snow OFF" : "❄ Snow ON"}
</button>


  <GoogleFitLogin />
</div>


          <div
            className={css.avatarWrapper}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className={css.userAvatar}>
              {user?.firstName?.[0] || "U"}
            </div>

            {showUserMenu && (
              <div className={css.userMenu}>
                <div
                  className={`${css.userMenuItem} ${hoverIndex === 0 ? css.userMenuItemHover : ''}`}
                  onMouseEnter={() => setHoverIndex(0)}
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                >
                  👤 Profile
                </div>

                <div
                  className={`${css.userMenuItem} ${hoverIndex === 1 ? css.userMenuItemHover : ''}`}
                  onMouseEnter={() => setHoverIndex(1)}
                >
                  ⚙️ Settings
                </div>

                <div
                  className={`${css.userMenuItem} ${hoverIndex === 2 ? css.userMenuItemHover : ''}`}
                  onMouseEnter={() => setHoverIndex(2)}
                >
                  📞 Contact Us
                </div>

              <div
  className={`${css.userMenuItem} ${hoverIndex === 4 ? css.userMenuItemHover : ''}`}
  onMouseEnter={() => setHoverIndex(4)}
  onClick={() => setShowLogoutConfirm(true)}
>
  🚪 Logout
</div>

                <div
  className={`${css.userMenuItem} ${hoverIndex === 3 ? css.userMenuItemHover : ''}`}
  onMouseEnter={() => setHoverIndex(3)}
  onClick={() => {
    setShowAchievements(true);
    setShowUserMenu(false);
  }}
>
  🏆 My Achievements
</div>

              </div>
            )}
          </div>
        </nav>
{showWelcome && (
  <div className={css.welcomeBanner}>
    <h2 className={css.welcomeTitle}>
      Welcome to FitNation,{" "}
      <span className={css.userNameAccent}>{user?.firstName}</span>! 💪
    </h2>

    <p className={css.welcomeText}>
      Track your fitness journey with BMI calculator, water tracker, and learn from elite athletes' routines.
      Stay hydrated and achieve your goals!
    </p>
  </div>
)}

{/* 🔥 DAILY CHALLENGE */}
<section className={css.challengeSection}>
<DailyChallenge
  userId={user?._id}
  onCompleted={() => setStreakRefresh(v => v + 1)}
  snowOn={snowOn}
/>

</section>

{/* 🔥 STREAK GRID */}
<section className={css.streakSection}>
  <StreakHeatmap
    userId={user?._id}
    refresh={streakRefresh}
  />
</section>

        <div className={css.gridContainer}>
          <div className={css.glassCard}>
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>💓</div>
              <h1 className={css.cardTitle}>Your Fitness Data</h1>
            </div>
{/**herw */}
        <div className={css.fitDetails}>

  <div className={css.fitItem}>
    <span className={css.fitLabel}>Steps Today</span>
    <span className={css.fitValue}>
      {googleFitData.steps ?? "No Data"}
    </span>
  </div>

  <div className={css.fitItem}>
    <span className={css.fitLabel}>Heart Rate</span>
    <span className={css.fitValue}>
      {googleFitData.heartRate ?? "No Data"} bpm
    </span>
  </div>

  <div className={css.fitItem}>
    <span className={css.fitLabel}>Distance Walked</span>
    <span className={css.fitValue}>
      {googleFitData.distance ?? "No Data"} km
    </span>
  </div>

  <div className={css.fitItem}>
    <span className={css.fitLabel}>Calories Burned</span>
    <span className={css.fitValue}>
      {googleFitData.calories ?? "No Data"} kcal
    </span>
  </div>

</div>
{/*here to */}
          </div>

          <div className={`${css.glassCard} ${css.flipCard}`}>
            <div className={`${css.flipInner} ${isBmiFlipped ? css.flipped : ""}`}>
              {/* Front Side (BMI Calculator) */}
              <div className={css.flipFront}>
                <div className={css.cardHeader}>
                  <div className={css.cardIcon}>⚖️</div>
                  <h3 className={css.cardTitle}>BMI Calculator</h3>
                  <button
                    className={css.bmiHistoryBtn}
                    onClick={async () => {
                      await handleOpenBmiHistory();
                      setIsBmiFlipped(true);
                    }}
                  >
                    📊 History
                  </button>
                </div>

                <div className={css.bmiDisplay}>
                  <div className={css.bmiValue} style={{ color: bmiColor }}>
                    {bmi}
                  </div>
                  <div
                    className={css.bmiCategory}
                    style={{
                      background: `${bmiColor}20`,
                      border: `1px solid ${bmiColor}`
                    }}
                  >
                    {bmiCategory}
                  </div>
                </div>

                <div className={css.bmiBars}>
                  <div className={css.bmiOuterGlow}></div>
                  <div className={css.bmiTrack}>
                    <div
                      className={css.bmiColorBar}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, ((bmi - 10) / 30) * 100)
                        )}%`
                      }}
                    />
                  </div>
                  <div
                    className={css.bmiPointer}
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(0, ((bmi - 10) / 30) * 100)
                      )}%`
                    }}
                  />
                </div>

                <div className={css.scaleLabels}>
                  <span>Underweight</span>
                  <span>Healthy</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>

                <div className={css.sliderRow}>
                  <span className={css.sliderText}>Height: {height} cm</span>
                  <input
                    type="range"
                    min="100"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className={css.sliderInput}
                  />
                </div>

                <div className={css.sliderRow}>
                  <span className={css.sliderText}>Weight: {weight} kg</span>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className={css.sliderInput}
                  />
                </div>
                <button
                  className={css.saveBmiBtn}
                  onClick={handleSaveBMI}
                >
                  💾 Save BMI
                </button>
              </div>

              {/* Back Side (BMI History) */}
              <div className={css.flipBack}>
              <div className={css.cardHeader}>
  <h3 className={css.cardTitle}>📊 BMI History</h3>

  <div style={{ display: "flex", gap: "10px" }}>
    <button
      className={css.deleteHistoryBtn}
      onClick={handleDeleteBmiHistory}
    >
      🗑 Delete History
    </button>

    <button
      className={css.backBtn}
      onClick={() => setIsBmiFlipped(false)}
    >
      ⬅ Back
    </button>
  </div>
</div>


{/**doneeeeeeeeeee bmi hository */}


                {loadingBmiHistory ? (
                  <p style={{ color: "white" }}>Loading...</p>
                ) : bmiHistory.length === 0 ? (
                  <p style={{ color: "white" }}>No BMI records</p>
                ) : (
                  <div className={css.bmiHistoryContainer}>
                    {bmiHistory.map((item) => (
                      <div key={item._id} className={css.bmiHistoryCard}>
                        <div className={css.bmiRow}>
                          <span className={css.bmiLabel}>BMI Score</span>
                          <span className={css.bmiValue}>{item.bmi}</span>
                        </div>
                        <div className={css.bmiRow}>
                          <span className={css.bmiLabel}>Category</span>
                          <span
                            className={`${css.bmiBadge} ${css[item.category.toLowerCase()]}`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div className={css.bmiDate}>
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })} •{" "}
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={css.glassCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className={css.cardHeader}>
              <div className={css.goalBadge}>
                <span className={css.goalText}>Goal</span>
                <div className={css.goalControl}>
                  <span className={css.dropIcon}>💧</span>
<input
  type="number"
  min="1"
  max="5"
  step="0.5"
value={waterGoalLiters ?? ""}
  onChange={handleWaterGoalChange}
  disabled={isWaterGoalLocked && !isEditingWaterGoal}
  className={css.goalInput}
/>


<button className={css.setGoalBtn}
  onClick={() => setIsEditingWaterGoal(true)}
>
  Set Goal
</button>
{isEditingWaterGoal && (
  <>
    <button
      className={css.primaryButton}
      onClick={async () => {
        await handleSetWaterGoal(); // save to backend
        setIsEditingWaterGoal(false);
        alert(`Today's water goal set to ${waterGoalLiters} L 💧`);
      }}
    >
      ✅  OK
    </button>

  
  </>
)}



                  <span className={css.goalUnit}>L</span>
                </div>
              </div>
            </div>

            <div className={css.waterDisplay}>
              <div className={css.waterAmount}>
                {totalWater}
                <span className={css.waterUnit}>ml</span>
              </div>
              <div className={css.waterProgress}>
                <div className={css.waterProgressFill} style={{
width:
  waterGoalLiters
    ? `${(totalWater / (waterGoalLiters * 1000)) * 100}%`
    : "0%"
                }}></div>
              </div>
              <div className={css.waterGoal}>
{waterGoalLiters
  ? `${Math.round(totalWater)} ml of ${waterGoalLiters * 1000} ml today`
  : "Set water goal for today"}
              </div>
            </div>

            <div className={css.waterGlasses}>
              {waterGlasses.map((filled, index) => (
             <div
  className={css.waterGlass}
  onClick={() => toggleWaterGlass(index)}
  style={{ opacity: isWaterGoalLocked ? 1 : 0.4, pointerEvents: isWaterGoalLocked ? "auto" : "none" }}
>

                  <div className={css.glassContent}>
                    <div
                      className={css.glassWater}
                      style={{
                        height:
                          waterGlasses[index] === 250 ? "50%" :
                            waterGlasses[index] === 500 ? "100%" : "0%"
                      }}
                    />
                    🥛
                  </div>
                  <span className={css.glassLabel}>Glass {index + 1}</span>
                </div>
              ))}
            </div>




            <div className={css.waterActions}>
              <button
                className={`${css.button} ${css.primaryButton}`}
                onClick={fillAllWater}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>💧</span> Drink All
              </button>
              <button
                className={`${css.button} ${css.secondaryButton}`}
                onClick={resetWaterTracker}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>🔄</span> Reset
              </button>
            </div>
            {showWaterCongrats && (
              <div className={css.waterCongrats}>
                💧 Congratulations! <br />
                You have completed your daily water goal 🌊
              </div>
            )}
          </div>

          {/* Daily Todo List */}
          <div className={css.glassCard}>
            {showCongrats && (
              <div className={css.todoCongrats}>
                🎉 Congratulations! <br />
                You completed all your today's tasks 💪
              </div>
            )}

            <div className={css.cardHeader}>
              <div className={css.cardIcon}>📝</div>
              <h3 className={css.cardTitle}>Daily Todo List</h3>
              <div className={css.todoActions}>
                <button
                  className={css.editBtn}
                  onClick={() => setIsEditMode(prev => !prev)}
                >
                  ✏️ {isEditMode ? "Cancel" : "Edit"}
                </button>
                {isEditMode && isViewingToday && (
                  <button
                    className={css.saveBtn}
                    onClick={saveDailyTodo}
                  >
                    💾 Save
                  </button>
                )}
              </div>
            </div>

            {isEditMode && (
              <div className={css.addTodoRow}>
                <input
                  className={css.todoInput}
                  placeholder="Add new todo (e.g. Cardio)"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button className={css.addTodoBtn} onClick={addNewTodo}>
                  ➕
                </button>
              </div>
            )}

            {dailyTodo.map(item => (
              <React.Fragment key={item._id || item.id}>
<div
  className={`${css.todoRow} ${item.done ? css.completed : ""}`}
>
                  <div className={css.todoLeft}>
                    <div
                      className={`${css.tickBox} ${item.done ? css.tickActive : ""}`}
                      onClick={() => {
                        if (!isViewingToday) return;
                        if (confirmTodoId !== null) return;
                        if (!item.done && !item.locked) {
                          setConfirmTodoId(item._id || item.id);
                        }
                      }}
                    >
                      {item.done && "✔"}
                    </div>
                    <span
                      className={css.todoLabel}
                      style={{
                        textDecoration: item.done ? "line-through" : "none",
                        opacity: item.done ? 0.6 : 1
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

             <div className={css.todoRight}>
  <input
    type="text"
    value={item.target === "Required" ? "" : item.target}
    placeholder="Enter target"
    disabled={!isEditMode || item.locked}
    onFocus={() => {
      if (isEditMode && item.target === "Required") {
        updateTarget(item._id || item.id, "");
      }
    }}
    onChange={(e) =>
      updateTarget(item._id || item.id, e.target.value)
    }
    className={css.todoInput}
  />

  {isEditMode && (
    <button
      className={css.deleteBtn}
      onClick={() => deleteTodo(item._id || item.id)}
    >
      🗑
    </button>
  )}
</div>

                </div>

                {confirmTodoId === (item._id || item.id) && (
                  <div className={css.confirmBox}>
                    <p className={css.confirmText}>
                      Mark <strong>{item.label}</strong> as completed?
                    </p>
                    <div className={css.confirmActions}>
                      <button
                        className={css.confirmYes}
                        onClick={() => confirmComplete(item._id || item.id)}
                      >
                        ✅ Sure
                      </button>
                      <button
                        className={css.confirmNo}
                        onClick={() => setConfirmTodoId(null)}
                      >
                        ❌ Not sure
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Today Pie Chart */}
          <div className={css.glassCard}>
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>🥧</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3 className={css.cardTitle}>Task Completion</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => {
                      const d = new Date(selectedDate);
                      d.setDate(d.getDate() - 1);
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      setSelectedDate(d.toISOString().slice(0, 10));
                    }}
                  >
                    ⬅️
                  </button>
                  <span style={{ color: "white", fontWeight: 600 }}>
                    {new Date(selectedDate).toDateString()}
                  </span>
                  <button
                    disabled={selectedDate === todayStr}
                    onClick={() => {
                      const d = new Date(selectedDate);
                      d.setDate(d.getDate() + 1);
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      setSelectedDate(d.toISOString().slice(0, 10));
                    }}
                  >
                    ➡️
                  </button>
                </div>
              </div>
            </div>


            <PieChart width={220} height={220}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                isAnimationActive={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>

            <div style={{ color: "white", marginTop: "10px", fontSize: "18px" }}>
              {piePercent}% completed
            </div>
            {/* Pie Task Details */}
<div className={css.pieTaskBreakdown}>

  {/* Completed Tasks */}
<div className={`${css.taskGroup} ${css.completedBox}`}>
    <h4 className={css.doneTitle}>✅ Completed</h4>

    {completedTodos.length === 0 ? (
      <p className={css.emptyText}>No completed tasks</p>
    ) : (
      completedTodos.map(item => (
        <div
          key={item._id || item.id}
          className={css.doneTask}
        >
          {item.label}
        </div>
      ))
    )}
  </div>

  {/* Pending Tasks */}
  <div className={css.taskGroup}>
    <h4 className={css.pendingTitle}>⏳ Pending</h4>

    {pendingTodos.length === 0 ? (
      <p className={css.emptyText}>All tasks completed 🎉</p>
    ) : (
      pendingTodos.map(item => (
        <div
          key={item._id || item.id}
          className={css.pendingTask}
        >
          {item.label}
        </div>
      ))
    )}
  </div>

</div>

          </div>

          {/* Weekly Todo Completion */}
          <div className={css.glassCard}>
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>📊</div>
              <h3 className={css.cardTitle}>Weekly Todo Completion</h3>
            </div>

            {weeklyTodoData.length === 0 ? (
              <p style={{ color: "white" }}>No weekly data yet</p>
            ) : (
              <LineChart width={320} height={220} data={weeklyTodoData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completionPercent"
                />
              </LineChart>
            )}
          </div>
          {/* Water Completion */}
<div className={css.glassCard}>
<div className={css.cardHeader}>
  {/* Title Row */}
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <div className={css.cardIcon}>💧</div>
    <h3 className={css.cardTitle}>Water Completion</h3>
  </div>

  {/* Calendar Row (same as Task Completion) */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginTop: "6px"
    }}
  >
    <button
      onClick={() => {
        const d = new Date(selectedWaterDate);
        d.setDate(d.getDate() - 1);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setSelectedWaterDate(d.toISOString().slice(0, 10));
      }}
    >
      ⬅️
    </button>

    <span style={{ color: "white", fontWeight: 600 }}>
      {new Date(selectedWaterDate).toDateString()}
    </span>

    <button
      disabled={selectedWaterDate === getTodayLocal()}
      onClick={() => {
        const d = new Date(selectedWaterDate);
        d.setDate(d.getDate() + 1);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setSelectedWaterDate(d.toISOString().slice(0, 10));
      }}
    >
      ➡️
    </button>
  </div>
</div>



  <PieChart width={220} height={220}>
    <Pie
      data={waterPieData}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={90}
      dataKey="value"
      isAnimationActive={false}
    >
      <Cell fill="#36d1dc" />
      <Cell fill="#2c2f4a" />
    </Pie>
  </PieChart>

  <div style={{ color: "white", marginTop: "10px", fontSize: "18px" }}>
    {waterCompletedPercent}% completed
    {/* Water Breakdown (same as Todo Completion) */}
<div className={css.waterBreakdown}>

  <div className={css.waterCompletedBox}>
    <h4 className={css.waterDoneTitle}>💧 Completed</h4>
    <div className={css.waterDonePill}>
      {(completedMl / 1000).toFixed(1)} L ({completedMl} ml)
    </div>
  </div>

  <div className={css.waterPendingBox}>
    <h4 className={css.waterPendingTitle}>⏳ Pending</h4>
    <div className={css.waterPendingPill}>
      {((goalMl - completedMl) / 1000).toFixed(1)} L
      ({Math.max(goalMl - completedMl, 0)} ml)
    </div>
  </div>

</div>

  </div>
</div>



        </div>
        
        

        <section className={css.celebritySection}>
          <div className={css.sectionHeader}>
            <h2 className={css.sectionTitle}>Elite Athlete Routines</h2>
            <p className={css.sectionSubtitle}>
              Learn from the best athletes across different sports
            </p>
          </div>

          <div className={css.sliderLayout}>
            <div className={css.sliderMain}>
              <div className={css.slidesRow} style={{ transform: `translateX(-${selectedIndex * 100}%)` }}>
              {sliderCelebrities.map((celebrity, index) => (

                    <div
                      key={index}
                      className={css.slideCard}
                      onClick={() => showCelebrityRoutine(celebrity)}
                    >
                      <img
                        src={celebrity.image}
                        alt={celebrity.name}
                        className={css.slideImg}
                      />
                      <div className={css.slideText}>
                        <h2 className={css.slideName}>{celebrity.name}</h2>
                        <p className={css.slideSport}>{celebrity.sport}</p>
                        <p className={css.slideStats}>{celebrity.stats}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <button className={css.arrowLeft} onClick={() => setSelectedIndex(prev => Math.max(prev - 1, 0))}>⬅</button>
              <button className={css.arrowRight} onClick={() =>
  setSelectedIndex(prev =>
    Math.min(prev + 1, sliderCelebrities.length - 1))}>➡</button>
            </div>

            <div className={css.chatBox}>
              <div className={css.chatHeader}>
                🤖 FitChat
                <span className={css.chatOnline} />
              </div>

              <div className={css.chatMessages}>
                {chatMessages.map((m, i) => (
                  <div key={i} className={css.chatMessage} style={{
                    background: m.startsWith("You:")
                      ? "linear-gradient(135deg, #36d1dc55, #5b86e555)"
                      : "linear-gradient(135deg, #5b86e533, #36d1dc33)"
                  }}>
                    {m}
                  </div>
                ))}
              </div>

              <div className={css.chatInputArea}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className={css.chatInput}
                />
                <button onClick={handleChatSend} className={css.chatSend}>➤</button>
              </div>

              <button onClick={() => setChatMessages([])} className={css.clearChat}>🧹 Clear Chat</button>
            </div>
          </div>
        </section>

        {showModal && selectedCelebrity && (
          <div className={css.modalOverlay} onClick={closeModal}>
            <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={css.closeBtnModal} onClick={closeModal}>✕</button>
              <div className={css.modalHeader}>
                <div className={css.modalImage} style={{ backgroundImage: `url(${selectedCelebrity.image})` }} />
                <div className={css.modalTitle}>
                  <h2 className={css.modalTitleText}>{selectedCelebrity.name}'s Daily Routine</h2>
                  <div className={css.modalTags}>
                    <span className={css.modalTag}>{selectedCelebrity.sport}</span>
                    <span className={css.modalStats}>{selectedCelebrity.stats}</span>
                  </div>
                </div>
              </div>

              <div className={css.routineSections}>
                {['morning', 'afternoon', 'evening'].map((time) => (
                  <div key={time} className={css.routineSection}>
                    <h3 className={css.routineTitle}>
                      <span>{time === 'morning' ? '🌅' : time === 'afternoon' ? '☀️' : '🌙'}</span>
                      {time.charAt(0).toUpperCase() + time.slice(1)} Routine
                    </h3>
                    <div className={css.routineList}>
                      {selectedCelebrity.routine[time].split('\n').map((item, index) => (
                        <div key={index} className={css.routineItem}>
                          <span className={css.routineTime}>{item.split(' - ')[0]}</span>
                          <span className={css.routineActivity}>{item.split(' - ')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={css.modalFooter}>
                <button className={css.inspireButton}>💪 Get Inspired by {selectedCelebrity.name}'s Dedication</button>
              </div>
            </div>
          </div>
        )}

        {showProfileModal && (
          <div className={css.modalOverlay}>
            <div className={css.profileCard} onClick={(e) => e.stopPropagation()}>
              <div className={css.profileHeader}>
                <div className={css.profileAvatar}>{user?.firstName?.[0] || "U"}</div>
                <div>
                  <h2 className={css.profileTitle}>User Profile</h2>
                  <p className={css.profileSubtitle}>Your account information</p>
                </div>
                <button className={css.closeProfileBtn} onClick={() => setShowProfileModal(false)}>✕</button>
              </div>

              <div className={css.profileContent}>
                <div className={css.profileRow}>
                  <span className={css.profileLabel}>First Name:</span>
                  <span className={css.profileValue}>{user?.firstName}</span>
                </div>
                <div className={css.profileRow}>
                  <span className={css.profileLabel}>Last Name:</span>
                  <span className={css.profileValue}>{user?.lastName}</span>
                </div>
                <div className={css.profileRow}>
                  <span className={css.profileLabel}>Email:</span>
                  <span className={css.profileValue}>{user?.email}</span>
                </div>
                <div className={css.profileRow}>
                  <span className={css.profileLabel}>Phone:</span>
                  <span className={css.profileValue}>{user?.phone}</span>
                </div>
                <div className={css.profileRow}>
                  <span className={css.profileLabel}>Gender:</span>
                  <span className={css.profileValue}>{user?.gender}</span>
                </div>
              </div>

              <div className={css.profileFooter}>
                <button
                  className={css.editProfileBtn}
                  onClick={() => {
                    setShowProfileModal(false);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit Profile
                </button>
                <button className={css.closeBtn} onClick={() => setShowProfileModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className={css.modalOverlay}>
            <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={css.closeBtnModal} onClick={() => setShowEditModal(false)}>✕</button>
              <div style={{ padding: "30px" }}>
                <h2 style={{ color: "white" }}>Edit Profile</h2>
                <label style={{ color: "#36d1dc" }}>First Name</label>
                <input style={inputStyle} value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>Last Name</label>
                <input style={inputStyle} value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>Email</label>
                <input style={inputStyle} value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>Phone</label>
                <input style={inputStyle} value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>Gender</label>
                <input style={inputStyle} value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>Old Password</label>
                <input type="password" style={inputStyle} placeholder="Enter your current password" value={editData.oldPassword} onChange={(e) => setEditData({ ...editData, oldPassword: e.target.value })} />
                <label style={{ color: "#36d1dc" }}>New Password</label>
                <input type="password" style={inputStyle} placeholder="Enter new password" value={editData.newPassword} onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })} />
                <button style={saveBtnStyle} onClick={handleSaveProfile}>💾 Save Changes</button>
                <button
                  style={{
                    padding: "12px 20px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    marginLeft: "12px"
                  }}
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showLogoutConfirm && (
          <div className={css.modalOverlay}>
            <div className={css.logoutBox}>
              <h2 className={css.logoutTitle}>Log out?</h2>
              <p className={css.logoutText}>Are you sure you want to logout?</p>
              <div className={css.logoutButtons}>
                <button
                  className={css.logoutYes}
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/signin");
                  }}
                >
                  Yes
                </button>
                <button
                  className={css.logoutNo}
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {showQuotePopup && (
          <div className={css.quotePopup}>
            ⭐ {quotes[currentQuote]}
          </div>
        )}
        {showAchievements && (
  <AchievementsModal
    onClose={() => setShowAchievements(false)}
  />
)}


        <footer className={css.footerContainer}>
          <div className={css.footerSections}>
            <div className={css.footerColumn}>
              <h3 className={css.footerHeading}>ABOUT FITNATION</h3>
              <p className={css.footerAboutText}>
                FitNation is your all-in-one fitness companion — track BMI, monitor water,
                follow elite athlete routines, and stay motivated every day.
                Your journey to a healthier lifestyle begins here!
              </p>
            </div>

            <div className={css.footerColumn}>
              <h3 className={css.footerHeading}>FITNESS CATEGORIES</h3>
              <a className={css.footerLink}>BMI Calculator</a>
              <a className={css.footerLink}>Water Tracker</a>
              <a className={css.footerLink}>Workout Routines</a>
              <a className={css.footerLink}>Daily Goals</a>
              <a className={css.footerLink}>Elite Athlete Programs</a>
            </div>

            <div className={css.footerColumn}>
              <h3 className={css.footerHeading}>USEFUL LINKS</h3>
              <a className={css.footerLink}>Fitness Blog</a>
              <a className={css.footerLink}>Community Forum</a>
              <a className={css.footerLink}>Career at FitNation</a>
              <a className={css.footerLink}>Partnerships</a>
              <a className={css.footerLink}>Contact Support</a>
            </div>

            <div className={css.footerColumn}>
              <h3 className={css.footerHeading}>POLICIES</h3>
              <a className={css.footerLink}>Privacy Policy</a>
              <a className={css.footerLink}>Terms & Conditions</a>
              <a className={css.footerLink}>Refund Policy</a>
              <a className={css.footerLink}>Data Protection</a>
              <a className={css.footerLink}>User Safety Guide</a>
            </div>

            <div className={css.footerColumn}>
              <h3 className={css.footerHeading}>CONNECT WITH US</h3>
              <div className={css.footerSocialRow}>
                <span className={css.footerSocialIcon}>📘</span>
                <span className={css.footerSocialIcon}>🐦</span>
                <span className={css.footerSocialIcon}>📸</span>
                <span className={css.footerSocialIcon}>▶️</span>
              </div>

              <h3 className={css.footerHeading} style={{ marginTop: "20px" }}>DOWNLOAD APP</h3>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Play_Store_badge_EN.svg" className={css.appBadge} alt="play" />
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className={css.appBadge} alt="appstore" />
            </div>
          </div>

          <div className={css.footerBottomBar}>
            © {new Date().getFullYear()} FitNation – Be Strong. Stay Healthy. 💪
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard; 