document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let isLoggedIn = false;

    // DOM Elements
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskFormWrapper = document.getElementById('task-form-wrapper');
    const themeToggle = document.getElementById('theme-toggle');
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close');
    const authForm = document.getElementById('auth-form');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.textContent = isDark ? '🌙' : '☀️';
    });

    // Auth Logic
    authBtn.addEventListener('click', () => {
        if (isLoggedIn) {
            isLoggedIn = false;
            authBtn.textContent = 'Login';
            alert('Logged out successfully');
        } else {
            authModal.style.display = 'block';
        }
    });

    closeModal.onclick = () => authModal.style.display = 'none';
    
    authForm.onsubmit = (e) => {
        e.preventDefault();
        isLoggedIn = true;
        authBtn.textContent = 'Logout';
        authModal.style.display = 'none';
        alert('Logged in successfully!');
    };

    // Task Logic
    addTaskBtn.addEventListener('click', () => {
        taskFormWrapper.style.display = taskFormWrapper.style.display === 'none' ? 'block' : 'none';
    });

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const priority = document.getElementById('task-priority').value;
        
        const newTask = {
            id: Date.now(),
            title,
            priority,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
        taskFormWrapper.style.display = 'none';
    };

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const div = document.createElement('div');
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <span class="badge">${task.priority}</span>
                </div>
                <div>
                    <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(div);
        });
        updateStats();
    }

    window.toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    };

    function updateStats() {
        document.getElementById('total-tasks').textContent = tasks.length;
        document.getElementById('completed-tasks').textContent = tasks.filter(t => t.completed).length;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    renderTasks();
});
