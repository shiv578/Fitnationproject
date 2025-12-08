import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import css from './Dashboard.module.css';


const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuotePopup, setShowQuotePopup] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setSelectedIndex(prev => (prev + 1) % 8);
    }, 8000);
    return () => clearInterval(autoSlide);
  }, []);

  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    oldPassword: "",
    newPassword: ""
  });

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: ""
  });

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

    const res = await fetch(`http://localhost:5000/api/update-profile/${user._id}`, {
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

  useEffect(() => {
    if (!user?._id) return;
    fetch(`http://localhost:5000/api/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUserDetails(data.user);
      })
      .catch(err => console.log("PROFILE ERROR:", err));
  }, [user]);

  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('#36d1dc');

  const [waterGlasses, setWaterGlasses] = useState([false, false, false, false, false, false, false, false]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [totalWater, setTotalWater] = useState(0);

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

  const [showWelcome, setShowWelcome] = useState(true);

  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, title: '10,000 Steps', icon: '👣', current: 8520, target: 10000, completed: false },
    { id: 2, title: '8 Glasses Water', icon: '💧', current: 5, target: 8, completed: false },
    { id: 3, title: '30 Min Cardio', icon: '🏃', current: 25, target: 30, completed: false },
    { id: 4, title: 'Strength Training', icon: '💪', current: 45, target: 45, completed: true },
    { id: 5, title: 'Sleep 8 Hours', icon: '😴', current: 7, target: 8, completed: false }
  ]);

  const [activeWorkouts, setActiveWorkouts] = useState([
    { id: 1, name: 'Morning HIIT', duration: '30 min', calories: 320, icon: '⚡', status: 'completed' },
    { id: 2, name: 'Evening Yoga', duration: '45 min', calories: 280, icon: '🧘', status: 'pending' },
    { id: 3, name: 'Swimming', duration: '1 hour', calories: 500, icon: '🏊', status: 'upcoming' }
  ]);

  const [celebrities, setCelebrities] = useState([
    {
      id: 1,
      name: "Virat Kohli",
      sport: "Cricket",
      image: "https://images.radiocity.in/images/uploads/web-stories/ws-virat-22may-05.png",
      stats: "8% Body Fat | 69kg | 175cm",
      routine: {
        morning: "5:00 AM - Wake up, lemon water\n5:30 AM - Cardio (running/cycling)\n7:00 AM - Breakfast\n8:00 AM - Net practice (3 hours)",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Rest\n4:00 PM - Gym session\n6:00 PM - Fielding practice",
        evening: "8:00 PM - Dinner\n9:00 PM - Recovery\n10:30 PM - Sleep"
      }
    },
    {
      id: 2,
      name: "Cristiano Ronaldo",
      sport: "Football",
      image: "https://wallpapercave.com/wp/wp3474580.jpg",
      stats: "5% Body Fat | 84kg | 187cm",
      routine: {
        morning: "5:30 AM - Wake up, meditation\n6:00 AM - High-protein breakfast\n7:00 AM - Cardio\n9:00 AM - Strength training",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Rest/nap\n4:00 PM - Skill training\n6:00 PM - Recovery",
        evening: "8:00 PM - Light dinner\n9:30 PM - Film analysis\n10:30 PM - Sleep"
      }
    },
    {
      id: 3,
      name: "Serena Williams",
      sport: "Tennis",
      image: "https://wallpapercave.com/wp/wp8946276.jpg",
      stats: "Muscle Mass 45% | 72kg | 175cm",
      routine: {
        morning: "6:00 AM - Wake up, hydration\n6:30 AM - Dynamic stretching\n7:00 AM - Breakfast\n8:00 AM - Tennis practice",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Strength & conditioning\n4:00 PM - Cardio",
        evening: "7:00 PM - Dinner\n8:00 PM - Recovery\n9:30 PM - Sleep"
      }
    },
    {
      id: 4,
      name: "LeBron James",
      sport: "Basketball",
      image: "https://wallpapercave.com/wp/wp7890926.jpg",
      stats: "113kg | 206cm | Vertical Jump 111cm",
      routine: {
        morning: "5:00 AM - Wake up, meditation\n5:30 AM - Breakfast\n6:30 AM - Shooting practice\n8:00 AM - Weight training",
        afternoon: "12:00 PM - Lunch\n2:00 PM - Film study\n3:00 PM - Skill work\n5:00 PM - Team practice",
        evening: "8:00 PM - Dinner\n9:00 PM - Cryotherapy\n10:00 PM - Sleep"
      }
    },
    {
      id: 5,
      name: "Simone Biles",
      sport: "Gymnastics",
      image: "https://wallpapercave.com/wp/wp7890964.jpg",
      stats: "47kg | 142cm | 5 Olympic Golds",
      routine: {
        morning: "6:30 AM - Wake up, breakfast\n7:30 AM - Gym arrival\n8:00 AM - Morning training (4 hours)",
        afternoon: "12:00 PM - Lunch & recovery\n2:00 PM - Afternoon training\n5:00 PM - Physical therapy",
        evening: "7:30 PM - Dinner\n8:30 PM - Mental training\n10:00 PM - Sleep"
      }
    },
    {
      id: 6,
      name: "Usain Bolt",
      sport: "Athletics",
      image: "https://wallpapercave.com/wp/wp7120044.jpg",
      stats: "World Record 9.58s | 94kg | 195cm",
      routine: {
        morning: "7:00 AM - Wake up\n7:30 AM - Breakfast\n9:00 AM - Track session\n11:00 AM - Weight training",
        afternoon: "1:00 PM - Lunch\n3:00 PM - Rest\n5:00 PM - Gym session\n7:00 PM - Recovery",
        evening: "9:00 PM - Dinner\n10:30 PM - Sleep"
      }
    },
    {
      id: 7,
      name: "Katie Ledecky",
      sport: "Swimming",
      image: "https://wallpapercave.com/dwp2x/wp7890927.jpg",
      stats: "Swims 60km/week | 5 Olympic Golds",
      routine: {
        morning: "4:30 AM - Wake up\n5:00 AM - First swim session\n7:30 AM - Breakfast\n9:00 AM - Dryland training",
        afternoon: "12:00 PM - Lunch\n1:00 PM - Rest\n3:00 PM - Second swim session\n6:00 PM - Strength training",
        evening: "8:00 PM - Dinner\n9:30 PM - Recovery\n10:00 PM - Sleep"
      }
    },
    {
      id: 8,
      name: "Novak Djokovic",
      sport: "Tennis",
      image: "https://wallpapercave.com/dwp2x/wp8946280.jpg",
      stats: "Gluten-free | 77kg | 188cm",
      routine: {
        morning: "6:00 AM - Wake up, meditation\n6:30 AM - Yoga & stretching\n7:30 AM - Gluten-free breakfast\n8:30 AM - Tennis practice",
        afternoon: "12:30 PM - Lunch\n2:00 PM - Recovery\n4:00 PM - Fitness training\n6:00 PM - Skill work",
        evening: "8:00 PM - Dinner\n9:00 PM - Reading\n10:00 PM - Sleep"
      }
    },
    {
      id: 9,
      name: "M.S. Dhoni",
      sport: "Cricket",
      image: "https://wallpapercave.com/wp/wp8963849.jpg",
      stats: "Captain Cool | 75kg | 178cm",
      routine: {
        morning: "6:00 AM - Wake up, meditation\n6:30 AM - Running\n8:00 AM - Breakfast\n9:30 AM - Net practice",
        afternoon: "1:00 PM - Lunch\n2:30 PM - Rest\n4:30 PM - Gym workout\n6:30 PM - Strategy session",
        evening: "8:00 PM - Dinner\n9:30 PM - Review matches\n10:30 PM - Sleep"
      }
    },
    {
      id: 10,
      name: "Mary Kom",
      sport: "Boxing",
      image: "https://wallpapercave.com/dwp2x/wp7890972.jpg",
      stats: "6 World Championships | 51kg | 158cm",
      routine: {
        morning: "5:00 AM - Wake up, prayer\n5:30 AM - Roadwork\n7:00 AM - Breakfast\n8:30 AM - Boxing training",
        afternoon: "12:30 PM - Lunch\n2:00 PM - Rest\n4:00 PM - Strength training\n6:00 PM - Sparring",
        evening: "8:00 PM - Dinner\n9:00 PM - Family time\n10:00 PM - Sleep"
      }
    }
  ]);

  const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const quotes = [
    "💪 The only bad workout is the one that didn't happen.",
    "🌊 Water is life. Stay hydrated, stay healthy!",
    "🔥 Your future self will thank you for today's effort.",
    "🌟 Small progress is still progress.",
    "⚡ Energy flows where attention goes.",
    "🏆 Champions are made in the daily routine."
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/profile/" + user._id)
      .then(res => res.json())
      .then(data => setUserDetails(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(calculatedBmi);

    if (calculatedBmi < 18.5) {
      setBmiCategory('Underweight');
      setBmiColor('#3498db');
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setBmiCategory('Healthy');
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
    const filledGlasses = waterGlasses.filter(glass => glass).length;
    setWaterIntake(filledGlasses);
    setTotalWater(filledGlasses * 250);
  }, [waterGlasses]);

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

  useEffect(() => {
    if (!user._id) return;

    fetch(`http://localhost:5000/api/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        console.log("PROFILE DATA:", data);
        setUserDetails(data);
      })
      .catch(err => console.log("PROFILE ERROR:", err));
  }, [user]);

  const toggleWaterGlass = (index) => {
    const newWaterGlasses = [...waterGlasses];
    newWaterGlasses[index] = !newWaterGlasses[index];
    setWaterGlasses(newWaterGlasses);
  };

  const fillAllWater = () => {
    setWaterGlasses(Array(8).fill(true));
  };

  const resetWaterTracker = () => {
    setWaterGlasses(Array(8).fill(false));
  };

  const toggleGoalComplete = (id) => {
    setDailyGoals(goals =>
      goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const showCelebrityRoutine = (celebrity) => {
    setSelectedCelebrity(celebrity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCelebrity(null);
  };

  const getSportIcon = (sport) => {
    const icons = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Tennis': '🎾',
      'Basketball': '🏀',
      'Gymnastics': '🤸',
      'Athletics': '🏃',
      'Swimming': '🏊',
      'Boxing': '🥊'
    };
    return icons[sport] || '🏆';
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const msg = chatInput.toLowerCase().trim();
    let reply = "";

    if (["hi", "hello", "hiii"].includes(msg)) reply = "Hello! I am FitChat 😊 How can I help?";
    else if (msg.includes("bmi")) reply = "BMI shows if your weight is healthy.";
    else if (msg.includes("water")) reply = "Drink at least 2–3 liters every day!";
    else if (msg.includes("best athlete")) reply = "Virat Kohli is a legend! 🔥";
    else if (msg.includes("fitnation")) reply = "FitNation helps you track your fitness journey.";
    else if (msg.includes("motivation")) reply = "Small progress every day leads to big results! 💪";
    else reply = "Sorry 😅 I can answer only simple fitness questions.";

    setChatMessages(prev => [...prev, "You: " + chatInput, "FitChat: " + reply]);
    setChatInput("");
  };

  return (
    <div className={css.container}>
      <div className={css.contentContainer}>
        <nav className={css.navbar}>
          <div className={css.logo}>
            <h1 className={css.logoText}>FitNation</h1>
          </div>

      <div
  className={css.avatarWrapper}
  onMouseEnter={() => setShowUserMenu(true)}
>
  
   <div
    className={css.userMenuArea}
    onMouseLeave={() => setShowUserMenu(false)}
  >
    </div></div> 
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
                  className={`${css.userMenuItem} ${hoverIndex === 3 ? css.userMenuItemHover : ''}`}
                  onMouseEnter={() => setHoverIndex(3)}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </nav>

        {showWelcome && (
          <div className={css.welcomeBanner}>
<h2 className={css.welcomeTitle}>
  Welcome to FitNation, <span className={css.userNameAccent}>{user?.firstName}</span>! 💪
</h2>
            <p className={css.welcomeText}>
              Track your fitness journey with BMI calculator, water tracker, and learn from elite athletes' routines.
              Stay hydrated and achieve your goals!
            </p>
          </div>
        )}

        <div className={css.gridContainer}>
          <div
            className={css.glassCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>⚖️</div>
              <h3 className={css.cardTitle}>BMI Calculator</h3>
              <span className={css.cardSubtitle}>Healthy: 18.5-24.9</span>
            </div>

            <div className={css.bmiDisplay}>
              <div className={css.bmiValue} style={{ color: bmiColor }}>{bmi}</div>
              <div className={css.bmiCategory} style={{ background: `${bmiColor}20`, border: `1px solid ${bmiColor}` }}>
                {bmiCategory}
              </div>
            </div>
<div className={css.bmiBars}>

  <div className={css.bmiOuterGlow}></div>

  <div className={css.bmiTrack}>
    <div 
      className={css.bmiColorBar}
      style={{
        width: `${Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100))}%`
      }}
    ></div>
  </div>

  <div 
    className={css.bmiPointer}
    style={{
      left: `${Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100))}%`
    }}
  ></div>

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

          </div>

          <div
            className={css.glassCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>💧</div>
              <h3 className={css.cardTitle}>Water Tracker</h3>
              <span className={css.cardSubtitle}>Goal: 2L</span>
            </div>

            <div className={css.waterDisplay}>
              <div className={css.waterAmount}>
                {totalWater}
                <span className={css.waterUnit}>ml</span>
              </div>
              <div className={css.waterProgress}>
                <div className={css.waterProgressFill} style={{ width: `${(waterIntake / 8) * 100}%` }}></div>
              </div>
              <div className={css.waterGoal}>{waterIntake} of 8 glasses today</div>
            </div>

            <div className={css.waterGlasses}>
              {waterGlasses.map((filled, index) => (
                <div
                  key={index}
                  className={css.waterGlass}
                  onClick={() => toggleWaterGlass(index)}
                >
                  <div className={`${css.glassContent} ${filled ? css.glassFilled : ''}`}>
                    <span>🥛</span>
                    {filled && (
                      <div className={css.glassWater} style={{ height: '100%' }}></div>
                    )}
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
          </div>

          <div
            className={css.glassCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>🎯</div>
              <h3 className={css.cardTitle}>Daily Goals</h3>
              <span className={css.cardSubtitle}>Today's Progress</span>
            </div>

            <div className={css.goalsList}>
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={css.goalItem}
                  onClick={() => toggleGoalComplete(goal.id)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                >
                  <div className={css.goalIcon}>{goal.icon}</div>
                  <div className={css.goalInfo}>
                    <div className={css.goalTitle}>{goal.title}</div>
                    <div className={css.goalProgressBar}>
                      <div className={css.goalProgressFill} style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className={css.goalCheck} style={{ color: goal.completed ? '#f093fb' : 'rgba(255, 255, 255, 0.3)' }}>
                    {goal.completed ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={css.glassCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className={css.cardHeader}>
              <div className={css.cardIcon}>🏋️</div>
              <h3 className={css.cardTitle}>Active Workouts</h3>
              <span className={css.cardSubtitle}>Today's Plan</span>
            </div>

            <div className={css.goalsList}>
              {activeWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className={css.goalItem}
                  style={{
                    background: workout.status === 'completed' ? 'rgba(46, 204, 113, 0.1)' :
                      workout.status === 'pending' ? 'rgba(241, 196, 15, 0.1)' :
                        'rgba(52, 152, 219, 0.1)'
                  }}
                >
                  <div className={css.goalIcon}>{workout.icon}</div>
                  <div className={css.goalInfo}>
                    <div className={css.goalTitle}>{workout.name}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {workout.duration} • {workout.calories} kcal
                    </div>
                  </div>
                  <div className={css.goalCheck} style={{
                    color: workout.status === 'completed' ? '#2ecc71' :
                      workout.status === 'pending' ? '#f1c40f' : '#3498db'
                  }}>
                    {workout.status === 'completed' ? '✓' :
                      workout.status === 'pending' ? '⏳' : '→'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className={css.celebritySection}>
          <div className={css.sectionHeader}>
            <h2 className={css.sectionTitle}>  Elite Athlete Routines</h2>
            <p className={css.sectionSubtitle}>Learn from the best athletes across different sports</p>
          </div>

          <div className={css.sliderLayout}>
            <div className={css.sliderMain}>
              <div className={css.slidesRow} style={{ transform: `translateX(-${selectedIndex * 100}%)` }}>
                {celebrities
                  .filter(c =>
                    ["Virat Kohli", "Cristiano Ronaldo", "Serena Williams", "LeBron James",
                      "Usain Bolt", "Katie Ledecky", "Mary Kom", "Simone Biles"].includes(c.name)
                  )
                  .map((celebrity, index) => (
                    <div
                      key={index}
                      className={css.slideCard}
                      onClick={() => showCelebrityRoutine(celebrity)}
                    >
{celebrity.name === "Virat Kohli" ? (
  <video
    className={css.slideImg}
    src="/virat.mp4"
    autoPlay
    muted
    loop
    playsInline
  />
) : (
  <img
    src={celebrity.image}
    alt={celebrity.name}
    className={css.slideImg}
  />
)}
     <div className={css.slideText}>
         <h2 className={css.slideName}>{celebrity.name}</h2>
           <p className={css.slideSport}>{celebrity.sport}</p>
             <p className={css.slideStats}>{celebrity.stats}</p>
              </div>
                 </div>
                  ))}
              </div>

              <button className={css.arrowLeft} onClick={() => setSelectedIndex(prev => Math.max(prev - 1, 0))}>⬅</button>
              <button className={css.arrowRight} onClick={() => setSelectedIndex(prev => Math.min(prev + 1, 7))}>➡</button>
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
