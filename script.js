// Initialize Firebase (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyAAjT9cmvyFNVzahUNjCkKUriRr_1ukVxw",
	authDomain: "e-commerce-8f66d.firebaseapp.com",
	databaseURL: "https://e-commerce-8f66d-default-rtdb.firebaseio.com",
	projectId: "e-commerce-8f66d",
	storageBucket: "e-commerce-8f66d.appspot.com",
	messagingSenderId: "1003251890443",
	appId: "1:1003251890443:web:f9235d17e950baebcfca0e",
	measurementId: "G-C3G0GFFR73"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const logoutBtn = document.getElementById('logout');
const searchInput = document.getElementById('search-input');
const profileImg = document.getElementById('profile-img');
const profileName = document.getElementById('profile-name');
const userName = document.getElementById('user-name');
const totalTasks = document.getElementById('total-tasks');
const completedTasks = document.getElementById('completed-tasks');
const yearCompletedTasks = document.getElementById('year-completed-tasks');
const savings = document.getElementById('savings');
const savingsInput = document.getElementById('savings-input');
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskModal = document.getElementById('add-task-modal');
const cancelTaskBtn = document.getElementById('cancel-task');
const saveTaskBtn = document.getElementById('save-task');
const tasksContainer = document.getElementById('tasks-container');
const addNoteBtn = document.getElementById('add-note');
const addNoteModal = document.getElementById('add-note-modal');
const cancelNoteBtn = document.getElementById('cancel-note');
const saveNoteBtn = document.getElementById('save-note');
const notesContainer = document.getElementById('notes-container');
const viewAllNotesBtn = document.getElementById('view-all-notes');

// Event Listeners
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('hide'));
logoutBtn.addEventListener('click', handleLogout);
searchInput.addEventListener('input', filterTasks);
profileImg.addEventListener('click', changeProfilePhoto);
savingsInput.addEventListener('change', updateSavings);
addTaskBtn.addEventListener('click', () => addTaskModal.style.display = 'block');
cancelTaskBtn.addEventListener('click', () => addTaskModal.style.display = 'none');
saveTaskBtn.addEventListener('click', addTask);
addNoteBtn.addEventListener('click', () => addNoteModal.style.display = 'block');
cancelNoteBtn.addEventListener('click', () => addNoteModal.style.display = 'none');
saveNoteBtn.addEventListener('click', addNote);
addNoteBtn.addEventListener('click', () => addNoteModal.style.display = 'block');


// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        initializeApp();
    } else {
        window.location.href = 'login.html'; // Redirect to login page
    }
});

function initializeApp() {
    updateUserInfo();
    loadTasks();
    loadSavings();
    loadNotes();
    initializeCalendar();
    initializePriorityChart();
    startClock();
}

function updateUserInfo() {
    userName.textContent = currentUser.displayName || 'User';
    profileName.textContent = currentUser.displayName || 'User';
    profileImg.src = currentUser.photoURL || '/placeholder.svg?height=36&width=36';
}

function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// ... (rest of the script.js content remains unchanged)




// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Event Listeners
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('hide'));
logoutBtn.addEventListener('click', handleLogout);
searchInput.addEventListener('input', filterTasks);
profileImg.addEventListener('click', changeProfilePhoto);
savingsInput.addEventListener('change', updateSavings);
addTaskBtn.addEventListener('click', () => addTaskModal.style.display = 'block');
cancelTaskBtn.addEventListener('click', () => addTaskModal.style.display = 'none');
saveTaskBtn.addEventListener('click', addTask);
addNoteBtn.addEventListener('click', () => addNoteModal.style.display = 'block');
cancelNoteBtn.addEventListener('click', () => addNoteModal.style.display = 'none');
saveNoteBtn.addEventListener('click', addNote);


// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        initializeApp();
    } else {
        window.location.href = 'login.html'; // Redirect to login page
    }
});

function initializeApp() {
    updateUserInfo();
    loadTasks();
    loadSavings();
    loadNotes();
    initializeCalendar();
    initializePriorityChart();
    startClock();
}

function updateUserInfo() {
    userName.textContent = currentUser.displayName || 'User';
    profileName.textContent = currentUser.displayName || 'User';
    profileImg.src = currentUser.photoURL || '/placeholder.svg?height=36&width=36';
}

function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

function loadTasks() {
    db.collection('tasks').where('userId', '==', currentUser.uid)
        .onSnapshot((snapshot) => {
            const tasks = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            updateTaskStats(tasks);
            renderTasks(tasks);
            updatePriorityChart(tasks);
        }, (error) => {
            console.error("Error loading tasks:", error);
        });
}

function updateTaskStats(tasks) {
    const completed = tasks.filter(task => task.completed);
    const completedThisYear = completed.filter(task => new Date(task.date).getFullYear() === new Date().getFullYear());
    
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed.length;
    yearCompletedTasks.textContent = completedThisYear.length;
}

function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        
        // Set border color based on priority
        let borderColor;
        switch (task.priority) {
            case 'High':
                borderColor = 'var(--red)';
                break;
            case 'Medium':
                borderColor = 'var(--yellow)';
                break;
            case 'Low':
                borderColor = 'var(--green)';
                break;
           
        }
        
        // Apply the border color style
        taskElement.style.borderLeft = `8px solid ${borderColor}`;

        taskElement.innerHTML = `
            <div class="task-complete ${task.completed ? 'completed' : ''}" onclick="toggleTaskComplete('${task.id}', ${!task.completed})"></div>
            <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
            <div class="task-actions">
                <button onclick="editTask('${task.id}')"><i class="bx bx-edit"></i></button>
                <button onclick="deleteTask('${task.id}')"><i class="bx bx-trash"></i></button>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}


function filterTasks() {
    const query = searchInput.value.toLowerCase();
    const taskElements = tasksContainer.getElementsByClassName('task');
    
    Array.from(taskElements).forEach(taskElement => {
        const title = taskElement.querySelector('.task-title').textContent.toLowerCase();
        if (title.includes(query)) {
            taskElement.style.display = '';
        } else {
            taskElement.style.display = 'none';
        }
    });
}

function addTask() {
    const title = document.getElementById('task-title').value;
    const date = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;
    
    if (title && date) {
        db.collection('tasks').add({
            userId: currentUser.uid,
            title,
            date,
            priority,
            completed: false
        }).then(() => {
            addTaskModal.style.display = 'none';
            document.getElementById('task-title').value = '';
            document.getElementById('task-date').value = '';
            document.getElementById('task-priority').value = 'Medium';
        }).catch((error) => {
            console.error("Error adding task:", error);
        });
    }
}

function toggleTaskComplete(taskId, completed) {
    db.collection('tasks').doc(taskId).update({ completed })
        .then(() => {
            checkAllTasksCompleted();
        })
        .catch((error) => {
            console.error("Error updating task:", error);
        });
}

function editTask(taskId) {
    const newTitle = prompt("Enter new task title:");
    if (newTitle) {
        db.collection('tasks').doc(taskId).update({ title: newTitle })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    }
}

function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        db.collection('tasks').doc(taskId).delete()
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    }
}


function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        db.collection('notes').doc(noteId).delete()
            .then(() => {
                console.log('Note deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting note:', error);
            });
    }
}


function editNote(noteId) {
    const newContent = prompt("Edit your note:");
    if (newContent) {
        db.collection('notes').doc(noteId).update({
            content: newContent
        })
        .then(() => {
            console.log('Note updated successfully');
        })
        .catch((error) => {
            console.error('Error updating note:', error);
        });
    }
}





















function changeProfilePhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        const storageRef = storage.ref(`profilePhotos/${currentUser.uid}`);
        storageRef.put(file).then(() => {
            return storageRef.getDownloadURL();
        }).then(url => {
            return currentUser.updateProfile({ photoURL: url });
        }).then(() => {
            profileImg.src = currentUser.photoURL;
        }).catch((error) => {
            console.error("Error updating profile photo:", error);
        });
    };
    input.click();
}

function loadSavings() {
    db.collection('users').doc(currentUser.uid).get().then(doc => {
        if (doc.exists && doc.data().savings) {
            savings.textContent = `$${doc.data().savings.toFixed(2)}`;
        }
    }).catch((error) => {
        console.error("Error loading savings:", error);
    });
}

function updateSavings() {
    const amount = parseFloat(savingsInput.value);
    if (!isNaN(amount)) {
        db.collection('users').doc(currentUser.uid).set({
            savings: amount
        }, { merge: true }).then(() => {
            savings.textContent = `$${amount.toFixed(2)}`;
            savingsInput.value = '';
        }).catch((error) => {
            console.error("Error updating savings:", error);
        });
    }
}

function startClock() {
    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    updateClock();
    setInterval(updateClock, 1000);
}

function initializePriorityChart() {
    const ctx = document.getElementById('priority-chart').getContext('2d');
    window.priorityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#DB504A', '#FFCE26', '#38B000']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updatePriorityChart(tasks) {
    const priorityCounts = {
        High: tasks.filter(task => task.priority === 'High').length,
        Medium: tasks.filter(task => task.priority === 'Medium').length,
        Low: tasks.filter(task => task.priority === 'Low').length
    };
    
    window.priorityChart.data.datasets[0].data = [
        priorityCounts.High,
        priorityCounts.Medium,
        priorityCounts.Low
    ];
    window.priorityChart.update();
}

function initializeCalendar() {
    flatpickr("#calendar", {
        inline: true,
        onChange: function(selectedDates, dateStr, instance) {
            loadTasksForDate(dateStr);
        }
    });
}

function loadTasksForDate(date) {
    db.collection('tasks')
        .where('userId', '==', currentUser.uid)
        .where('date', '==', date)
        .get()
        .then((querySnapshot) => {
            const tasks = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            renderTasks(tasks);
        })
        .catch((error) => {
            console.error("Error loading tasks for date:", error);
        });
}

function loadNotes() {
    db.collection('notes')
        .where('userId', '==', currentUser.uid)
        .onSnapshot((snapshot) => {
            const notes = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            renderNotes(notes);
        }, (error) => {
            console.error("Error loading notes:", error);
        });
}


function renderNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';  // Clear the current notes

    // If no notes exist, show a message
    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="empty-notes">No important notes available.</div>';
        return;
    }

    // Loop through and render each note
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <div class="note-content">${note.content}</div>
            <div class="note-actions">
                <button onclick="editNote('${note.id}')" class="edit-note">
                    <i class="bx bx-edit"></i>
                </button>
                <button onclick="deleteNote('${note.id}')" class="delete-note">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}


function addNote() {
    const content = document.getElementById('note-content').value;
    if (content) {
        db.collection('notes').add({
            userId: currentUser.uid,
            content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            addNoteModal.style.display = 'none';
            document.getElementById('note-content').value = '';
        }).catch((error) => {
            console.error("Error adding note:", error);
        });
    }
}



function checkAllTasksCompleted() {
    db.collection('tasks')
        .where('userId', '==', currentUser.uid)
        .where('completed', '==', false)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                showCompletionAnimation();
            }
        })
        .catch((error) => {
            console.error("Error checking completed tasks:", error);
        });
}

function showCompletionAnimation() {
    // Implement completion animation
    console.log("All tasks completed!");
}

// Implement task reminder functionality
function sendTaskReminders() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    db.collection('tasks')
        .where('userId', '==', currentUser.uid)
        .where('date', '==', todayStr)
        .where('completed', '==', false)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const task = doc.data();
                // Here you would typically send a notification to the user
                console.log(`Reminder: Complete task "${task.title}"`);
            });
        })
        .catch((error) => {
            console.error("Error sending reminders:", error);
        });
}

// Call sendTaskReminders every hour
setInterval(sendTaskReminders, 360000);






// Modified script.js with new features and fixes

// ... (previous Firebase config and initialization remains same)

function initializeCalendar() {
    flatpickr("#calendar", {
        inline: true,
        static: true, // This prevents calendar scrolling
        onChange: function(selectedDates, dateStr, instance) {
            loadTasksForDate(dateStr);
        }
    });
}


// Updated notes functionality with delete feature
function renderNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) return;

    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <div class="note-content">${note.content}</div>
            <div class="note-actions">
                <button onclick="deleteNote('${note.id}')" class="delete-note">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}

// Add delete note function
function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        db.collection('notes').doc(noteId).delete()
            .then(() => {
                console.log('Note deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting note:', error);
            });
    }
}

// Updated user name display
function updateUserInfo() {
    const userName = document.getElementById('user-name');
    const profileName = document.getElementById('profile-name');
    const profileImg = document.getElementById('profile-img');
    
    if (currentUser) {
        const displayName = currentUser.displayName || 'User';
        if (userName) userName.textContent = displayName;
        if (profileName) profileName.textContent = displayName;
        if (profileImg) profileImg.src = currentUser.photoURL || '/placeholder.svg?height=36&width=36';
    }
}

// Task completion animation
function showCompletionAnimation() {
    const content = document.getElementById('content');
    if (!content) return;

    // Create confetti element
    const confetti = document.createElement('div');
    confetti.className = 'completion-animation';
    confetti.innerHTML = `
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
		
    `;
    
    content.appendChild(confetti);
    
    // Show congratulation message
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.textContent = '🎉 All tasks completed! Great job! 🎉';
    content.appendChild(message);

    // Remove animation after 3 seconds
    setTimeout(() => {
        confetti.remove();
        message.remove();
    }, 3000);
}

// Task reminder functionality with Firebase Cloud Messaging
function initializeNotifications() {
    // Request notification permission
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            // Get FCM token
            firebase.messaging().getToken().then(function(token) {
                // Save token to user's document in Firestore
                if (currentUser) {
                    db.collection('users').doc(currentUser.uid).update({
                        fcmToken: token
                    });
                }
            });
        }
    });
}

// Send task reminder
function sendTaskReminders() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    db.collection('tasks')
        .where('userId', '==', currentUser.uid)
        .where('date', '==', todayStr)
        .where('completed', '==', false)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const task = doc.data();
                // Send notification through FCM
                const message = {
                    notification: {
                        title: 'Task Reminder',
                        body: `Don't forget to complete: ${task.title}`
                    },
                    token: currentUser.fcmToken
                };

                // Send to Firebase Cloud Messaging
                firebase.functions().httpsCallable('sendTaskReminder')(message)
                    .then(() => {
                        console.log('Reminder sent successfully');
                    })
                    .catch((error) => {
                        console.error('Error sending reminder:', error);
                    });
            });
        });
}

// Initialize all features when app starts
function initializeApp() {
    updateUserInfo();
    loadTasks();
    loadSavings();
    loadNotes();
    initializeCalendar();
    initializePriorityChart();
    startClock();
    initializeNotifications();
}




function extractHiddenData() {
    const sidebarContent = document.getElementById('sidebar').innerText;
    if (sidebarContent) {
        const notesContainer = document.getElementById('notes-container');
        const hiddenNote = document.createElement('div');
        hiddenNote.className = 'note';
        hiddenNote.innerHTML = `<div class="note-content">${sidebarContent}</div>`;
        notesContainer.appendChild(hiddenNote);
    }
}
extractHiddenData();




