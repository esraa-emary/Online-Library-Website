const form = document.getElementById("add-book-form");
    if (form) {
        form.addEventListener("submit", function(e) {
           

            if (window.history.replaceState) {
                window.history.replaceState(null, null, window.location.href);
            }

            alert("Book edited successfully");

          
            window.location.href = "LibraSphere/ManageBooks";
        });
    }