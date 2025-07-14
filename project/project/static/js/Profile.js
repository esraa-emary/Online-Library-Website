 if("{{user.sex}}"=="male"){
            document.getElementById('male').checked=true;
        }
        else if("{{user.sex}}"=="female"){
            document.getElementById('female').checked=true
        }

        var name=document.getElementById('name').value;
        var phone=document.getElementById('phone').value;
        var email=document.getElementById('email').value;
    document.getElementById('editBtn').addEventListener('click', function() {
        document.getElementById('name').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('phone').disabled = false;
        document.getElementById('female').disabled = false;
        document.getElementById('male').disabled = false;
        document.getElementById('saveBtn').style.display = 'block';
        document.getElementById('cancelBtn').style.display = 'block';
        document.getElementById('editBtn').style.display = 'none';
    });
    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('name').disabled = true;
        document.getElementById('email').disabled = true;
        document.getElementById('phone').disabled = true;
        document.getElementById('saveBtn').style.display='none';
        document.getElementById('cancelBtn').style.display='none';
        document.getElementById('editBtn').style.display='block';
        document.getElementById('email').value=email;
        document.getElementById('phone').value=phone;
        document.getElementById('name').value=name;

    })
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var xml=new XMLHttpRequest();
        xml.open('POST', '/LibraSphere/Profile', true);
        var data = new FormData(this);
        xml.onload = function() {
            if (xml.status === 200) {
                var response = JSON.parse(xml.responseText);
                if (response.success) {
                    alert('Profile updated successfully');
                    document.getElementById('name').disabled = true;
                    document.getElementById('email').disabled = true;
                    document.getElementById('phone').disabled = true;
                    document.getElementById('saveBtn').style.display='none';
                    document.getElementById('cancelBtn').style.display='none';
                    document.getElementById('editBtn').style.display='block';
                    name=document.getElementById('name').value;
                } else {
                    alert('Error updating profile: ' + response.error_message);
                }
            }
            else {
                alert('Error: ' + xml.statusText);
            }
        };
        xml.send(data);

    })

