document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const themeToggle = document.getElementById('themeToggle');
            const addTaskForm = document.getElementById('addTaskForm');
            const taskInput = document.getElementById('taskInput');
            const tasksList = document.getElementById('tasksList');
            const tasksCount = document.getElementById('tasksCount');
            const completedCount = document.getElementById('completedCount');
            const clearCompletedBtn = document.getElementById('clearCompletedBtn');
            
            // State
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let darkMode = localStorage.getItem('darkMode') === 'true';
            
            // Initialize
            if (darkMode) {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            }
            
            renderTasks();
            updateTasksCount();
            
            // Event Listeners
            themeToggle.addEventListener('click', toggleDarkMode);
            addTaskForm.addEventListener('submit', addTask);
            clearCompletedBtn.addEventListener('click', clearCompletedTasks);
            
            // Functions
            function toggleDarkMode() {
                darkMode = !darkMode;
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', darkMode);
                
                if (darkMode) {
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                } else {
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                }
            }
            
            function addTask(e) {
                e.preventDefault();
                
                const taskText = taskInput.value.trim();
                if (taskText === '') return;
                
                const task = {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    timestamp: new Date().toISOString()
                };
                
                tasks.unshift(task);
                saveTasks();
                renderTasks();
                updateTasksCount();
                
                taskInput.value = '';
                taskInput.focus();
            }
            
            function toggleTaskCompletion(id) {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
                updateTasksCount();
            }
            
            function editTask(id, newText) {
                if (newText.trim() === '') return;
                
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, text: newText.trim() };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
            }
            
            function deleteTask(id) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
                updateTasksCount();
            }
            
            function clearCompletedTasks() {
                tasks = tasks.filter(task => !task.completed);
                saveTasks();
                renderTasks();
                updateTasksCount();
            }
            
            function renderTasks() {
                if (tasks.length === 0) {
                    tasksList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-clipboard-list"></i>
                            <p>No tasks yet. Add a task to get started!</p>
                        </div>
                    `;
                    return;
                }
                
                tasksList.innerHTML = '';
                
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
                    
                    taskElement.innerHTML = `
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="task-action-btn task-edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="task-action-btn task-delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    const checkbox = taskElement.querySelector('.task-checkbox');
                    const editBtn = taskElement.querySelector('.task-edit');
                    const deleteBtn = taskElement.querySelector('.task-delete');
                    const taskText = taskElement.querySelector('.task-text');
                    
                    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
                    deleteBtn.addEventListener('click', () => deleteTask(task.id));
                    
                    editBtn.addEventListener('click', () => {
                        const newText = prompt('Edit your task:', task.text);
                        if (newText !== null) {
                            editTask(task.id, newText);
                        }
                    });
                    
                    tasksList.appendChild(taskElement);
                });
            }
            
            function updateTasksCount() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                
                tasksCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
                completedCount.textContent = `${completedTasks} completed`;
            }
            
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });