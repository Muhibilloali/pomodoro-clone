import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RxDotsVertical } from "react-icons/rx";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Photologo from "../Images/brandlogo-white.png";
import Modal from "react-modal";
import { AiTwotoneSound } from "react-icons/ai";
import { VscEdit } from "react-icons/vsc";
import "./Control.css";

Modal.setAppElement("#root"); // Set the app element for accessibility

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between mt-4 ml-[20px] mr-[25px]">
      <p className="text-sm">{label}</p>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="toggle-checkbox"
      />
    </div>
  );
}

function Daily() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState("Pomodoro");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newNotes, setNewNotes] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Settings state variables
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [background, setBackground] = useState("#ffff00");
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [autoCheckTasks, setAutoCheckTasks] = useState(false);
  const [autoSwitchTasks, setAutoSwitchTasks] = useState(false);
  const [alarmSound, setAlarmSound] = useState("Kitchen");
  const [alarmVolume, setAlarmVolume] = useState(84);
  const [tickingSound, setTickingSound] = useState("None");
  const [tickingVolume, setTickingVolume] = useState(50);
  const [hourFormat, setHourFormat] = useState("24-hour");
  const [darkMode, setDarkMode] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState(1);
  const [reminderInterval, setReminderInterval] = useState("Last");

  const { authToken, login, logout, user } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedPomodoroTime = localStorage.getItem("Pomodoro");
    const savedShortBreakTime = localStorage.getItem("Short");
    const savedLongBreakTime = localStorage.getItem("Long");
    const savedBackground = localStorage.getItem("Background");
    const savedAutoStartBreaks = localStorage.getItem("AutoStartBreaks");
    const savedAutoStartPomodoros = localStorage.getItem("AutoStartPomodoros");
    const savedAutoCheckTasks = localStorage.getItem("AutoCheckTasks");
    const savedAutoSwitchTasks = localStorage.getItem("AutoSwitchTasks");
    const savedAlarmSound = localStorage.getItem("AlarmSound");
    const savedAlarmVolume = localStorage.getItem("AlarmVolume");
    const savedTickingSound = localStorage.getItem("TickingSound");
    const savedTickingVolume = localStorage.getItem("TickingVolume");
    const savedHourFormat = localStorage.getItem("HourFormat");
    const savedDarkMode = localStorage.getItem("DarkMode");
    const savedReminderFrequency = localStorage.getItem("ReminderFrequency");
    const savedReminderInterval = localStorage.getItem("ReminderInterval");

    if (savedPomodoroTime) setPomodoroTime(parseInt(savedPomodoroTime, 10));
    if (savedShortBreakTime) setShortBreakTime(parseInt(savedShortBreakTime, 10));
    if (savedLongBreakTime) setLongBreakTime(parseInt(savedLongBreakTime, 10));
    if (savedBackground) setBackground(savedBackground);
    if (savedAutoStartBreaks) setAutoStartBreaks(savedAutoStartBreaks === "true");
    if (savedAutoStartPomodoros) setAutoStartPomodoros(savedAutoStartPomodoros === "true");
    if (savedAutoCheckTasks) setAutoCheckTasks(savedAutoCheckTasks === "true");
    if (savedAutoSwitchTasks) setAutoSwitchTasks(savedAutoSwitchTasks === "true");
    if (savedAlarmSound) setAlarmSound(savedAlarmSound);
    if (savedAlarmVolume) setAlarmVolume(parseInt(savedAlarmVolume, 10));
    if (savedTickingSound) setTickingSound(savedTickingSound);
    if (savedTickingVolume) setTickingVolume(parseInt(savedTickingVolume, 10));
    if (savedHourFormat) setHourFormat(savedHourFormat);
    if (savedDarkMode) setDarkMode(savedDarkMode === "true");
    if (savedReminderFrequency) setReminderFrequency(parseInt(savedReminderFrequency, 10));
    if (savedReminderInterval) setReminderInterval(savedReminderInterval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = background;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [background]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      login(token);
    }
  }, [login]);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = (current) => {
    setIsRunning(false);
    switch (current) {
      case "Pomodoro":
        setTime(pomodoroTime * 60);
        break;
      case "Short Break":
        setTime(shortBreakTime * 60);
        break;
      case "Long Break":
        setTime(longBreakTime * 60);
        break;
      default:
        setTime(pomodoroTime * 60);
    }
  };

  const switchMode = (mode) => {
    setCurrentMode(mode);
    resetTimer(mode);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const addTask = () => {
    if (!newTask.trim()) {
      setErrorMessage("Task is required");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        text: newTask,
        notes: newNotes.filter((note) => note),
      },
    ]);
    setNewTask("");
    setNewNotes([""]);
    setShowModal(false);
    setErrorMessage("");
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleOk = () => {
    setModalIsOpen(false);
    localStorage.setItem("Pomodoro", pomodoroTime);
    localStorage.setItem("Short", shortBreakTime);
    localStorage.setItem("Long", longBreakTime);
    localStorage.setItem("Background", background);
    localStorage.setItem("AutoStartBreaks", autoStartBreaks.toString());
    localStorage.setItem("AutoStartPomodoros", autoStartPomodoros.toString());
    localStorage.setItem("AutoCheckTasks", autoCheckTasks.toString());
    localStorage.setItem("AutoSwitchTasks", autoSwitchTasks.toString());
    localStorage.setItem("AlarmSound", alarmSound);
    localStorage.setItem("AlarmVolume", alarmVolume.toString());
    localStorage.setItem("TickingSound", tickingSound);
    localStorage.setItem("TickingVolume", tickingVolume.toString());
    localStorage.setItem("HourFormat", hourFormat);
    localStorage.setItem("DarkMode", darkMode.toString());
    localStorage.setItem("ReminderFrequency", reminderFrequency.toString());
    localStorage.setItem("ReminderInterval", reminderInterval);
  };

  const handleCancel = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex justify-between w-full px-8 py-4">
        <img src={Photologo} alt="logo" className="h-8" />
        <div className="relative">
          <button
            onClick={(event) => {
              setDropdownPosition({
                top: event.clientY,
                left: event.clientX,
              });
              setShowDropdown(!showDropdown);
            }}
          >
            <RxDotsVertical size={24} />
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              ref={dropdownRef}
            >
              <div className="px-4 py-3">
                <p className="text-sm leading-5">Signed in as</p>
                <p className="text-sm font-medium leading-5 text-gray-900 truncate">
                  {user ? user.email : "Guest"}
                </p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => setModalIsOpen(true)}
                  className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">{currentMode}</h1>
      <div className="text-6xl font-mono">{formatTime(time)}</div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={startTimer}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md"
        >
          Pause
        </button>
        <button
          onClick={() => resetTimer(currentMode)}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Reset
        </button>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => switchMode("Pomodoro")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode("Short Break")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode("Long Break")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Long Break
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center space-x-4 p-2 border ${
              task.completed ? "bg-green-200" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.text}</span>
            <button
              onClick={() => removeTask(task.id)}
              className="px-2 py-1 bg-red-500 text-white rounded-md"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Task
        </button>
      </div>

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2>Add Task</h2>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Task name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="mt-4">
          <h3>Notes</h3>
          {newNotes.map((note, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  const updatedNotes = [...newNotes];
                  updatedNotes[index] = e.target.value;
                  setNewNotes(updatedNotes);
                }}
                placeholder="Note"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => {
                  const updatedNotes = newNotes.filter(
                    (_, i) => i !== index
                  );
                  setNewNotes(updatedNotes);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => setNewNotes([...newNotes, ""])}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Note
          </button>
        </div>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </Modal>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Pomodoro Time (minutes)
              </label>
              <input
                type="number"
                value={pomodoroTime}
                onChange={(e) => setPomodoroTime(parseInt(e.target.value, 10))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Short Break Time (minutes)
              </label>
              <input
                type="number"
                value={shortBreakTime}
                onChange={(e) =>
                  setShortBreakTime(parseInt(e.target.value, 10))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Long Break Time (minutes)
              </label>
              <input
                type="number"
                value={longBreakTime}
                onChange={(e) => setLongBreakTime(parseInt(e.target.value, 10))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Background</label>
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <ToggleSwitch
              label="Auto-Start Breaks"
              checked={autoStartBreaks}
              onChange={(e) => setAutoStartBreaks(e.target.checked)}
            />
            <ToggleSwitch
              label="Auto-Start Pomodoros"
              checked={autoStartPomodoros}
              onChange={(e) => setAutoStartPomodoros(e.target.checked)}
            />
            <ToggleSwitch
              label="Auto-Check Tasks"
              checked={autoCheckTasks}
              onChange={(e) => setAutoCheckTasks(e.target.checked)}
            />
            <ToggleSwitch
              label="Auto-Switch Tasks"
              checked={autoSwitchTasks}
              onChange={(e) => setAutoSwitchTasks(e.target.checked)}
            />
            <div>
              <label className="block text-sm font-medium">Alarm Sound</label>
              <select
                value={alarmSound}
                onChange={(e) => setAlarmSound(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Kitchen">Kitchen</option>
                <option value="Bell">Bell</option>
                <option value="Alarm">Alarm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Alarm Volume</label>
              <input
                type="range"
                value={alarmVolume}
                onChange={(e) => setAlarmVolume(parseInt(e.target.value, 10))}
                min="0"
                max="100"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ticking Sound</label>
              <select
                value={tickingSound}
                onChange={(e) => setTickingSound(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="None">None</option>
                <option value="Clock">Clock</option>
                <option value="Tick">Tick</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Ticking Volume
              </label>
              <input
                type="range"
                value={tickingVolume}
                onChange={(e) => setTickingVolume(parseInt(e.target.value, 10))}
                min="0"
                max="100"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Hour Format</label>
              <select
                value={hourFormat}
                onChange={(e) => setHourFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="12-hour">12-hour</option>
                <option value="24-hour">24-hour</option>
              </select>
            </div>
            <ToggleSwitch
              label="Dark Mode"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <div>
              <label className="block text-sm font-medium">
                Reminder Frequency (minutes)
              </label>
              <input
                type="number"
                value={reminderFrequency}
                onChange={(e) =>
                  setReminderFrequency(parseInt(e.target.value, 10))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Reminder Interval
              </label>
              <select
                value={reminderInterval}
                onChange={(e) => setReminderInterval(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Last">Last</option>
                <option value="First">First</option>
                <option value="All">All</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleOk}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Daily;
