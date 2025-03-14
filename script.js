// Authentication
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => window.location.href = 'profile.html')
            .catch(err => alert(err.message));
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => window.location.href = 'profile.html')
            .catch(err => alert(err.message));
    });
}

// Check Auth State
auth.onAuthStateChanged(user => {
    if (user) {
        if (document.getElementById('user-email')) {
            document.getElementById('user-email').textContent = `Email: ${user.email}`;
        }
    } else if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
});

// File Upload
const uploadBtn = document.getElementById('upload-btn');
const appUpload = document.getElementById('app-upload');
const uploadStatus = document.getElementById('upload-status');

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        const file = appUpload.files[0];
        if (file) {
            const storageRef = storage.ref(`apps/${file.name}`);
            storageRef.put(file).then(() => {
                storageRef.getDownloadURL().then(url => {
                    db.collection('products').add({
                        name: file.name,
                        url: url,
                        uploadedBy: auth.currentUser.email,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    uploadStatus.textContent = 'Upload successful!';
                });
            }).catch(err => uploadStatus.textContent = err.message);
        }
    });
}

// Display Products
const productList = document.getElementById('product-list');
if (productList) {
    db.collection('products').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        productList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `<h3>${data.name}</h3><a href="${data.url}" download>Download</a><p>By: ${data.uploadedBy}</p>`;
            productList.appendChild(div);
        });
    });
}

// About Section
const aboutContent = document.getElementById('about-content');
const saveAboutBtn = document.getElementById('save-about');

if (aboutContent) {
    db.collection('settings').doc('about').get().then(doc => {
        if (doc.exists) aboutContent.textContent = doc.data().content;
    });
    saveAboutBtn.addEventListener('click', () => {
        db.collection('settings').doc('about').set({
            content: aboutContent.textContent
        }).then(() => alert('About saved!'));
    });
}

// DMs and Inbox
const sendDmBtn = document.getElementById('send-dm');
const recipientInput = document.getElementById('recipient');
const messageInput = document.getElementById('message');
const inboxMessages = document.getElementById('inbox-messages');

if (sendDmBtn) {
    sendDmBtn.addEventListener('click', () => {
        const recipient = recipientInput.value;
        const message = messageInput.value;
        db.collection('messages').add({
            sender: auth.currentUser.email,
            recipient: recipient,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            messageInput.value = '';
            alert('Message sent!');
        });
    });
}

if (inboxMessages) {
    db.collection('messages')
        .where('recipient', '==', auth.currentUser.email)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            inboxMessages.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const div = document.createElement('div');
                div.innerHTML = `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
                inboxMessages.appendChild(div);
            });
        });
}
