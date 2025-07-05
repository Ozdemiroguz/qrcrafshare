document.addEventListener('DOMContentLoaded', () => {
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle account deletion form
    const deleteForm = document.getElementById('delete-form');
    if (deleteForm) {
        const emailInput = document.getElementById('email');
        const messageDiv = document.getElementById('form-message');
        const submitButton = deleteForm.querySelector('button');

        // Check if a deletion request has already been submitted from this browser
        const hasRequestedDeletion = localStorage.getItem('deletionRequested') === 'true';
        if (hasRequestedDeletion) {
            emailInput.disabled = true;
            submitButton.disabled = true;
            messageDiv.textContent = 'You have already submitted a deletion request from this device.';
            messageDiv.className = 'success';
        }

        deleteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value;

            if (!email) {
                messageDiv.textContent = 'Email is required.';
                messageDiv.className = 'error';
                return;
            }

            submitButton.disabled = true;
            messageDiv.textContent = 'Submitting...';
            messageDiv.className = 'info';

            try {
                // Add a new document with a generated id.
                await db.collection("deletion_requests").add({
                    email: email,
                    requestedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Set the flag in localStorage to prevent further submissions
                localStorage.setItem('deletionRequested', 'true');

                messageDiv.textContent = 'Your account deletion request has been submitted successfully.';
                messageDiv.className = 'success';
                emailInput.disabled = true;

            } catch (error) {
                console.error('Error submitting deletion request:', error);
                messageDiv.textContent = `Error: ${error.message}`;
                messageDiv.className = 'error';
                submitButton.disabled = false; // Re-enable button on error
            }
        });
    }
}); 