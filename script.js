let currentUser = null;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let savings = JSON.parse(localStorage.getItem('savings')) || 0;
let investments = JSON.parse(localStorage.getItem('investments')) || [];

// Function to show dashboard
function showDashboard() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');

    // Display savings
    document.getElementById('savings-total').textContent = savings;

    // Update transactions and investments
    updateTransactionList();
    updateInvestmentList();
}

// Toggle Login/Signup forms visibility
function toggleLoginSignup(section) {
    if (section === 'login') {
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('signup-section').classList.add('hidden');
    } else if (section === 'signup') {
        document.getElementById('signup-section').classList.remove('hidden');
        document.getElementById('login-section').classList.add('hidden');
    } else {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('signup-section').classList.add('hidden');
        document.getElementById('landing-section').classList.remove('hidden');
    }
}

// Handle login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
});

// Handle signup
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const confirmPassword = event.target[3].value;

    if (password === confirmPassword) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;  // Set currentUser to new user
        showDashboard();  // Redirect to Dashboard
    } else {
        alert('Passwords do not match!');
    }
});

// Handle transaction addition
document.getElementById('transaction-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = parseFloat(event.target[0].value);
    const type = event.target[1].value;
    const description = event.target[2].value;
    const transaction = { amount, type, description };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    if (type === 'income') {
        savings += amount;
    } else if (type === 'expense') {
        savings -= amount;
    }
    localStorage.setItem('savings', JSON.stringify(savings));

    updateTransactionList();
    document.getElementById('savings-total').textContent = savings;
});

// Handle investment addition
document.getElementById('investment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const type = event.target[0].value;
    const amount = parseFloat(event.target[1].value);
    investments.push({ type, amount });
    localStorage.setItem('investments', JSON.stringify(investments));
    updateInvestmentList();
});

// Update transaction list
function updateTransactionList() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    transactions.forEach((txn, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${txn.type}</td>
            <td>₹ ${txn.amount}</td>
            <td>${txn.description}</td>
            <td><button onclick="deleteTransaction(${index})">Delete</button></td>
        `;
        transactionList.appendChild(row);
    });
}

// Update investment list
function updateInvestmentList() {
    const investmentList = document.getElementById('investment-list');
    investmentList.innerHTML = '';
    investments.forEach(inv => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inv.type}</td>
            <td>₹ ${inv.amount}</td>
        `;
        investmentList.appendChild(row);
    });
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
}

// Clear all transactions
function clearAllTransactions() {
    transactions = [];
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
}
