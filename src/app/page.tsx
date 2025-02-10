"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import { Todo } from "@/types/todo";
import { useTheme } from "@/context/ThemeContext";
import "./globals.css";

export default function TodoApp() {
  // useState hook kullanımı
  //-bileşen içinde state yönetmek için kullanılır.
  //- todos: görevleri tutan state
  //- inputValue: görevleri güncellemek için kullanılır.

  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  // useRef hook kullanımı
  //- DOM elementlerine erişmek için kullanılır.
  //- inputRef: input alanına erişmek için kullanılır.
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect hook kullanımı
  //- bileşen içinde side efektleri yönetmek için kullanılır.
  //- useEffect: localStorage'dan görevleri yüklemek için kullanılır.
  //- useEffect: localStorage'a görevleri kaydetmek için kullanılır.

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
      toast.info("useEffect: Kaydedilmiş görevler yüklendi!", {
        position: "top-right",
      });
    }
  }, []);

  // useEffect ile localStorage'a kaydetme
  //- todos değiştiğinde localStorage'a görevleri kaydetmek için kullanılır.
  //- useEffect: localStorage'a görevleri kaydetmek için kullanılır.

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // useCallback hook kullanımı
  //- görev ekleme işlemini optimize etmek için kullanılır.
  //- useCallback: görev ekleme işlemini optimize etmek için kullanılır.

  const addTodo = useCallback(() => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date(),
      };
      setTodos((prev) => [...prev, newTodo]);
      setInputValue("");
      toast.success("useCallback: Yeni görev eklendi!");
    }
  }, [inputValue]);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    toast.info("useState: Görev durumu güncellendi!");
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.error("useState: Görev silindi!");
  };

  // useContext hook kullanımı
  // - Tema değişikliğini global state'te yönetmek için kullanılır
  // - useTheme: tema durumunu ve değiştirme fonksiyonunu sağlar
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`container ${theme}`}>
      <div className="todo-card">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="todo-content">
          <div>
            <h1 className="title">Todo List - Hooks </h1>

            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="todo-input"
                placeholder="Yeni görev ekle..."
              />
              <button onClick={addTodo} className="add-button">
                Ekle
              </button>
            </div>

            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <div className="todo-item-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className={todo.completed ? "completed" : ""}>
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer theme={theme} />
    </div>
  );
}
