document.querySelectorAll("#return-form").forEach(function(form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        var xml = new XMLHttpRequest();
        xml.open("POST", form.action, true);
        var data = new FormData(form);

        xml.onload = function() {
            if (xml.status == 200) {
                var response = JSON.parse(xml.responseText);
                if (response.success) {
                    alert("Book returned successfully!");
                    location.reload();
                } else {
                    alert("Error returning book: " + response.error);
                }
            } else {
                alert("Error: " + xml.statusText);
            }
        };

        xml.send(data);
    });
});