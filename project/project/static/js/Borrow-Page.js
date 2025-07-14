       myform = document.getElementById('borrowForm');
        myform.addEventListener('submit', function(e) {
            e.preventDefault(); 
            var xml=new XMLHttpRequest();
            var formData = new FormData(this);
            title=document.getElementById("bookTitle").innerHTML;
            console.log(title)
       xml.open("POST", "/LibraSphere/BorrowBook?title=" + encodeURIComponent(title), true);

            xml.onload = function(){ 
            if(xml.status === 200) {   
            alert(" Book Borrowed Successfully");
            window.location.href = "/LibraSphere/ListPage";
           }
            }
        
            xml.onerror = function() {
                alert("Error occurred while borrowing the book.");
            }
            xml.send(formData);
        
    });
        