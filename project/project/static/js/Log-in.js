     // Handle form submission
        var loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();  // Prevent normal form submission
            var formData = new FormData(this);  // Get the form data

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/LibraSphere/Login', true);  // The URL where the request should go

            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);  // Parse the response as JSON
                    if (response.success) {
                       
                        window.location.href = "/";  // Redirect to homepage
                    } else {
                        // Display the error message if login failed
                        document.getElementById('error-msg').textContent = response.error_message;
                    }
                } else {
                    document.getElementById('error-msg').textContent = 'There was an error with the login request.';
                }
            };

            xhr.onerror = function() {
                document.getElementById('error-msg').textContent = 'There was an error with the request.';
            };

            xhr.send(formData);  // Send the form data
        });