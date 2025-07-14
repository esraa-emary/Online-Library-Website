document.getElementById('signUpBtn').addEventListener('click', function(e) {
        e.preventDefault();  
        var xml= new XMLHttpRequest();
        xml.open('POST', '/LibraSphere/Signup', true);

           const form = document.getElementById('signUpForm');
           const formData = new FormData(form);
      xml.onload = function() {
        if (xml.status === 200) {
            var response = JSON.parse(xml.responseText);
            
            if(response.success){
                alert("user registered successfully");
                window.location.href="Login";
            }
            else{ 
                document.getElementById('erroruser').textContent = '';
                document.getElementById('errorpassword').textContent = '';
                document.getElementById('erroremail').textContent = '';
                document.getElementById(response.type).textContent = response.error_message;
            }

        } else {
            document.getElementById('error-msg').textContent = 'There was an error with the signup request.';
        }
    };
          xml.onerror = function() {
        document.getElementById('error-msg').textContent = 'There was an error with the request.';
    };
        xml.send(formData);  
    }

    )