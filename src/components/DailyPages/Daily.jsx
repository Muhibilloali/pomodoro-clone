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
// import "boxicons";
import { AiTwotoneSound } from "react-icons/ai";
import { VscEdit } from "react-icons/vsc";
import "./Control.css";

import kitchen from "../../Music/alarm-clock-short.mp3";
import bell from "../../Music/alarm.mp3";
import bird from "../../Music/chiptune.mp3";
import wood from "../../Music/kitchen.mp3";
import chime from "../../Music/digital.mp3";

Modal.setAppElement("#root"); // Set the app element for accessibility

function ToggleSwitch({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center justify-between mt-4 ml-[20px] mr-[25px]">
      <p className="text-sm">{label}</p>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="toggle-checkbox"
      />
    </div>
  );
}

function Daily() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Xato holati
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { authToken, login, logout, user } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  console.log(authToken);

  fetch("https://djangoapibekmurod.pythonanywhere.com/auth/users/me/", {
    method: "GET",
    headers: {
      // "Content-Type": "application/json",
      Authorization: `JWT ${authToken}`,
    },
    // body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log(data.background_color);
      localStorage.setItem("Background", data.background_color);
      localStorage.setItem("sound", data.sound);
      localStorage.setItem("user_id", data.id);

      // You can handle success here
    });
  // .catch((error) => {
  //   console.error("Login failed:", error);
  //   setError("Incorrect email or password."); // Xato xabarini o'rnatish
  // });

  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  let sound = localStorage.getItem("sound");

  console.log(!sound);

  if (!sound) {
    sound = 5;
  }

  // Function to fetch audio from the API and play it
  const playAudioFromAPI = () => {
    const apiUrl = `https://djangoapibekmurod.pythonanywhere.com/audio/${sound}/`;

    // Fetch the audio file from the API
    fetch(apiUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a new URL object from the blob
        const audioUrl = URL.createObjectURL(blob);

        // Set the audio URL and play it
        setAudioUrl(audioUrl);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error fetching audio:", error);
      });
  };

  const [time, setTime] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState("Pomodoro");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Settings state variables
  const [pomodoroTime, setPomodoroTime] = useState(0);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [background, setBackground] = useState();
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [autoCheckTasks, setAutoCheckTasks] = useState(false);
  const [autoSwitchTasks, setAutoSwitchTasks] = useState(false);
  // const [alarmSound, setAlarmSound] = useState("Kitchen");
  const [alarmVolume, setAlarmVolume] = useState(84);
  const [tickingSound, setTickingSound] = useState("None");
  const [tickingVolume, setTickingVolume] = useState(50);
  const [hourFormat, setHourFormat] = useState("24-hour");
  const [darkMode, setDarkMode] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState(1);
  const [reminderInterval, setReminderInterval] = useState("Last");

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
    if (savedShortBreakTime)
      setShortBreakTime(parseInt(savedShortBreakTime, 10));
    if (savedLongBreakTime) setLongBreakTime(parseInt(savedLongBreakTime, 10));
    if (savedBackground) setBackground(savedBackground);
    if (savedAutoStartBreaks)
      setAutoStartBreaks(savedAutoStartBreaks === "true");
    if (savedAutoStartPomodoros)
      setAutoStartPomodoros(savedAutoStartPomodoros === "true");
    if (savedAutoCheckTasks) setAutoCheckTasks(savedAutoCheckTasks === "true");
    if (savedAutoSwitchTasks)
      setAutoSwitchTasks(savedAutoSwitchTasks === "true");
    if (savedAlarmSound) setAlarmSound(savedAlarmSound);
    if (savedAlarmVolume) setAlarmVolume(parseInt(savedAlarmVolume, 10));
    if (savedTickingSound) setTickingSound(savedTickingSound);
    if (savedTickingVolume) setTickingVolume(parseInt(savedTickingVolume, 10));
    if (savedHourFormat) setHourFormat(savedHourFormat);
    if (savedDarkMode) setDarkMode(savedDarkMode === "true");
    if (savedReminderFrequency)
      setReminderFrequency(parseInt(savedReminderFrequency, 10));
    if (savedReminderInterval) setReminderInterval(savedReminderInterval);
    if (savedPomodoroTime) setTime(parseInt(savedPomodoroTime, 10));
  }, []);

  console.log(currentMode);

  //add task API uchun start

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const response = await fetch(
          "https://djangoapibekmurod.pythonanywhere.com/todos/",
          {
            // method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "JWT " + token,
            },
          }
        );
        const data = await response.json();
        setTasks(data);
      } else {
        console.log("elyor gay");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask) {
      setErrorMessage("Task cannot be empty");
      return;
    }
    setErrorMessage("");

    const token = localStorage.getItem("accessToken");

    const task = {
      title: newTask,
      notes: newNotes,
    };
    if (token) {
      try {
        const response = await fetch(
          "https://djangoapibekmurod.pythonanywhere.com/todos/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "JWT " + token,
            },
            body: JSON.stringify(task),
          }
        );

        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          setShowModal(false);
          setNewTask("");
          setNewNotes("");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Error adding task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        setErrorMessage("Error adding task");
      }
    } else {
      indexedDB.setItem(1, task);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `https://djangoapibekmurod.pythonanywhere.com/todos/delete/${taskId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  //add task API uchun end

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

  // const addTask = () => {
  //   if (!newTask.trim()) {
  //     setErrorMessage("Task is required");
  //     return;
  //   }
  //   setTasks([
  //     ...tasks,
  //     {
  //       id: tasks.length + 1,
  //       text: newTask,
  //       notes: newNotes.filter((note) => note),
  //     },
  //   ]);
  //   setNewTask("");
  //   setNewNotes([""]);
  //   setShowModal(false);
  //   setErrorMessage("");
  // };

  // const toggleTaskCompletion = (taskId) => {
  //   setTasks(
  //     tasks.map((task) =>
  //       task.id === taskId ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };

  // const deleteTask = (taskId) => {
  //   setTasks(tasks.filter((task) => task.id !== taskId));
  // };

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

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;
  //   const reorderedTasks = Array.from(tasks);
  //   const [movedTask] = reorderedTasks.splice(result.source.index, 1);
  //   reorderedTasks.splice(result.destination.index, 0, movedTask);
  //   setTasks(reorderedTasks);
  // };
  // const handleDropdownClick = (event) => {
  //   const rect = event.target.getBoundingClientRect();
  //   setDropdownPosition({
  //     top: rect.bottom + window.scrollY,
  //     left: rect.left + window.scrollX,
  //   });
  //   setShowDropdown(!showDropdown);
  // };

  const [alarmSound, setAlarmSound] = useState(kitchen);
  const [volume, setVolume] = useState(84);
  // const [bgColor, setBgColor] = useState(""); // Initialize bgColor state
  const audioRef = useRef(null);

  const alarmSounds = [
    { label: "Kitchen", value: kitchen },
    { label: "Bell", value: bell },
    { label: "Bird", value: bird },
    { label: "Wood", value: wood },
    { label: "Chime", value: chime },
  ];

  const handleSoundChange = (event) => {
    setAlarmSound(event.target.value);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = event.target.value;
      audioRef.current.play();
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const playMelody = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleColorChange = (event) => {
    setBgColor(event.target.value);
  };

  const ToggleSwitch = ({ label }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
      setIsChecked(!isChecked);
    };

    return (
      <div className="txt">
        <p>{label}</p>
        <div className="button r" id="button-3">
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked}
            onChange={handleToggle}
          />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen p-4  text-black">
      <h1 className="flex text-4xl font-bold mb-4">
        <a href="/" className="pomodoro-logo">
          <img
            src={Photologo}
            className="font-thin mr-10 text-black text-xs w-auto h-12 sm:w-96"
            alt="Logo"
          />
        </a>

        <button
          type="button"
          className="setting-button bg-custom-blue backdrop-blur-md"
          onClick={() => setModalIsOpen(true)}
        >
          Settings
        </button>

        {authToken ? (
          <>
            <button
              onClick={(event) => {
                setDropdownPosition({
                  top: event.clientY,
                  left: event.clientX,
                });
                setShowDropdown(!showDropdown);
              }}
            >
              <RxDotsVertical className="setting-button" />
            </button>
          </>
        ) : (
          <h1 className="flex to-0%">
            <Link to="/signin">
              <button type="button" className="setting-button">
                Sign_In
              </button>
            </Link>
            <button
              onClick={(event) => {
                setDropdownPosition({
                  top: event.clientY,
                  left: event.clientX,
                });
                setShowDropdown(!showDropdown);
              }}
            >
              <RxDotsVertical className="setting-button" />
            </button>
          </h1>
        )}
      </h1>
      {showDropdown && (
        <div
          className="absolute z-50 mt-2 bg-white  text-black p-4 rounded shadow-lg"
          ref={dropdownRef}
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          {authToken ? (
            <div>
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
                onClick={showDropdown}
              >
                {/* {isModalNameOpen && (
                  <EditNameModal
                    closeModal={closeModal}
                    updateName={updateName}
                    currentName={name}
                  />
                )} */}
                <PersonIcon className="mr-2" /> Account
              </Link>
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
              >
                <WorkspacePremiumIcon className="mr-2" /> Premium
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded mt-4 w-full"
              >
                <LogoutIcon className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <div>
              <div className="py-2">
                <Link
                  to="/signin"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
                >
                  <ExitToAppIcon className="mr-2" /> Sign_In
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
                >
                  <LockOpenIcon className="mr-2" /> Sign_Up
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100"
                >
                  <WorkspacePremiumIcon className="mr-2" /> Premium
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="box-time text-center rounded-xl p-4 mb-8">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => switchMode("Pomodoro")}
            className={`pomodoro-button mx-2 px-4 py-2 ${
              currentMode === "Pomodoro" ? "" : "opacity-30"
            } rounded`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => switchMode("Short Break")}
            className={`pomodoro-button mx-2 px-4 py-2 ${
              currentMode === "Short Break" ? "" : "opacity-30"
            } rounded`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode("Long Break")}
            className={`pomodoro-button mx-2 px-4 py-2 ${
              currentMode === "Long Break" ? "" : "opacity-30"
            } rounded`}
          >
            Long Break
          </button>
        </div>
        <div className="text-6xl text-black font-bold mb-4">
          {formatTime(time)}
        </div>
        {isRunning ? (
          <button
            onClick={pauseTimer}
            className="start-button px-8 py-4 text-black rounded text-2xl"
          >
            PAUSE
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="start-button px-8 py-4 text-black rounded text-2xl"
          >
            START
          </button>
        )}
      </div>
      <div className="w-full max-w-md">
        <h2 className="flex justify-center item-center mb-4">
          Time for a break!
        </h2>
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white text-black p-4 rounded mb-2"
                      >
                        <div className="flex justify-between items-center">
                          <span>{task.title}</span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-white bg-red-700 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                        {/* {task.notes.map((note, noteIndex) => (
                          <div
                            key={noteIndex}
                            className="bg-yellow-100 text-black p-2 rounded mt-2"
                          >
                            {note}
                          </div>
                        ))} */}
                        <div className="bg-yellow-100 text-black p-2 rounded mt-2">
                          {task.notes}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => setShowModal(true)}
          className="add-task-button w-full px-4 py-2 rounded mt-2"
        >
          + Add Task
        </button>

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Add Task Modal"
          className="bg-white p-6 rounded-lg shadow-lg text-black"
          overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-2xl font-bold mb-4">Add Task</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          {/* {newNotes.map((note, idx) => ( */}
          <input
            // key={idx}
            type="text"
            value={newNotes}
            onChange={(e) => {
              // const updatedNotes = [...newNotes];
              // updatedNotes[idx] = e.target.value;
              setNewNotes(e.target.value);
            }}
            placeholder="Note (optional)"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          {/* ))} */}
          {/* <button
            onClick={() => setNewNotes([...newNotes, ""])}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Note
          </button> */}
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Task
            </button>
          </div>
        </Modal>

        <div className="modal-setting">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Settings Modal"
            className="text-black"
            overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
          >
            <div className="all">
              <div className="top">
                <p>Settings</p>
                <i className="bx bx-x"></i>
              </div>
              <br />
              <hr />
              <div className="timer" style={{ display: "flex" }}>
                <i className="bx bx-time bx-rotate-270"></i>
                <box-icon color="#9a9a9a9a" name="time" rotate="270"></box-icon>
                <p>Timer</p>
              </div>
              <p className="min">Time (minutes)</p>
              <div className="inputs">
                <div className="inp">
                  <p>Pomodoro</p>
                  <input type="number" id="num1" defaultValue="1" />
                </div>
                <div className="inp">
                  <p>Short Break</p>
                  <input type="number" id="num2" defaultValue="5" />
                </div>
                <div className="inp">
                  <p>Long Break</p>
                  <input type="number" id="num3" defaultValue="15" />
                </div>
              </div>
              <div className="onoff">
                <ToggleSwitch label="Auto Start Breaks" />
                <ToggleSwitch label="Auto Start Pomodoros" />
                <div className="txt">
                  <p>Auto Start Breaks</p>
                  <input type="number" id="break" defaultValue="4" />
                </div>
              </div>
              <br />
              <hr />
              <div className="task">
                <box-icon name="check-square" color="#9a9a9a"></box-icon>
                <p>Tasks</p>
              </div>
              <ToggleSwitch label="Auto check Tasks" />
              <ToggleSwitch label="Auto switch Tasks" />
              <br />
              <hr />
              <div className="flex pl-[20px] mt-4">
                <AiTwotoneSound className="mt-1 text-[20px] text-blue-gray-500" />
                <p className="text-[20px]">Sound</p>
              </div>
              <div className="flex ml-[20px] mt-4">
                <p className="text-gray-800">Alarm sound</p>
                <select
                  className="ml-[145px] w-[100px] h-8 bg-gray-300 rounded text-gray-700"
                  value={alarmSound}
                  onChange={handleSoundChange}
                >
                  {alarmSounds.map((sound) => (
                    <option key={sound.value} value={sound.value}>
                      {sound.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between mt-4 ml-[20px] mr-[25px]">
                <p className="text-sm">Volume</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-[140px]"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
              <div className="flex float-right mt-5 mr-[25px]">
                <p className="text-black">repeat</p>
                <input
                  className="bg-gray-300 w-[70px] h-8 rounded pl-2 ml-2"
                  defaultValue={1}
                  type="number"
                />
              </div>
              <br />
              <br />
              {/* <div className="flex ml-[20px] mt-10">
              <p className="text-gray-800">Ticking sound</p>
              <select
                className="ml-[145px] w-[100px] h-8 bg-gray-300 rounded text-gray-700"
                value={alarmSound}
                onChange={handleSoundChange}
              >
                {alarmSounds.map((sound) => (
                  <option key={sound.value} value={sound.value}>
                    {sound.label}
                  </option>
                ))}
              </select>
            </div> */}
              <br />
              <hr />
              <div className="flex ml-[20px] mt-4">
                <VscEdit />
                <p className="ml-2">Theme</p>
              </div>
              <div className="flex ml-[20px] mt-4 justify-between">
                <p className="text-gray-800">Color Themes</p>
                <div className="mr-[25px]">
                  <input
                    type="color"
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="w-6 mr-2"
                  />
                  {/* <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-6 mr-2"
                  />{" "}
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-6 mr-2"
                  /> */}
                </div>
              </div>
              {/* <div className="flex ml-[20px] mt-5">
              <p className="text-gray-800">Hour format</p>
              <select
                className="ml-[145px] w-[100px] h-8 bg-gray-300 rounded text-gray-700"
                value={alarmSound}
                onChange={handleSoundChange}
              >
                {alarmSounds.map((sound) => (
                  <option key={sound.value} value={sound.value}>
                    {sound.label}
                  </option>
                ))}
              </select>
            </div> */}
              <ToggleSwitch label="Dark mode when running" />
              <br />
              <hr />
              <div className="flex ml-[20px] mt-4">
                <box-icon
                  name="bell-ring"
                  type="solid"
                  color="#bebaba"
                ></box-icon>
                <p className="ml-2">Notification</p>
              </div>
              <div className="flex ml-[20px] mt-4 justify-between">
                <p className="text-gray-800">Reminder</p>
                <div className="mr-[25px] flex">
                  <select className="w-[100px] h-8 bg-gray-300 rounded text-gray-700">
                    <option value="">Last</option>
                    <option value="">Every</option>
                  </select>
                  <input
                    className="bg-gray-300 w-[70px] h-8 rounded pl-2 ml-2"
                    defaultValue={1}
                    type="number"
                  />
                  <p className="ml-2 text-gray-800">min</p>
                </div>
              </div>
              <div className="bg-gray-300 w-[100%] h-16 mt-3 rounded-bl-lg rounded-br-lg flex justify-end">
                <button
                  className="bg-black text-white w-[50px] rounded h-7 mt-4 mr-4"
                  onClick={handleOk}
                >
                  Ok
                </button>
              </div>
              <audio ref={audioRef}>
                <source src={alarmSound} />
              </audio>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Daily;
