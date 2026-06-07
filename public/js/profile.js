 function openPasswordModal() {
            document.getElementById('passwordModal').classList.add('open');
        }

        function closePasswordModal() {
            document.getElementById('passwordModal').classList.remove('open');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
            document.getElementById('passwordError').style.display = 'none';
        }

        function savePassword() {
            const currentPassword  = document.getElementById('currentPassword').value;
            const newPassword      = document.getElementById('newPassword').value;
            const confirmPassword  = document.getElementById('confirmNewPassword').value;
            const errorEl          = document.getElementById('passwordError');

            if (newPassword !== confirmPassword) {
                errorEl.innerText = 'New passwords do not match!';
                errorEl.style.display = 'block';
                return;
            }
            const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!newPassword.match(pattern)) {
                errorEl.innerText = 'Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number.';
                errorEl.style.display = 'block';
                return;
            }
            errorEl.style.display = 'none';
            fetch('/api/auth/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    alert('Password changed successfully!');
                    closePasswordModal();
                } else {
                    errorEl.innerText = result.message;
                    errorEl.style.display = 'block';
                }
            });
        }
        
        function openEditModal() {
            document.getElementById('editModal').classList.add('open');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('open');
        }

        function saveEdit() {
            const data = {
                firstName: document.getElementById('editFirstName').value,
                lastName:  document.getElementById('editLastName').value,
                phone:     document.getElementById('editPhone').value,
                dob:       document.getElementById('editDob').value
            };

            fetch('/api/auth/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    alert('Profile updated!');
                    location.reload();
                } else {
                    alert(result.message);
                }
            });
        }
        function switchTab(name) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + name).classList.add('active');
            event.currentTarget.classList.add('active');
        }
function openDeleteModal() {
    document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    document.getElementById('deletePasswordInput').value = '';
    document.getElementById('deletePasswordError').style.display = 'none';
}

function confirmDeleteAccount() {
    const password = document.getElementById('deletePasswordInput').value;
    const errorEl = document.getElementById('deletePasswordError');

    if (!password) {
        errorEl.innerText = 'Please enter your password to confirm.';
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';

    if (confirm("Are you absolutely sure you want to permanently delete your CineX account? This action cannot be undone.")) {
        fetch('/api/auth/deleteAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Your account has been successfully deleted.');
                window.location.href = '/'; 
            } else {
                errorEl.innerText = result.message;
                errorEl.style.display = 'block';
            }
        })
        .catch(err => {
            console.error(err);
            errorEl.innerText = 'Something went wrong. Please try again.';
            errorEl.style.display = 'block';
        });
    }
}
