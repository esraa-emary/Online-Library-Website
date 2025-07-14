// ---------------------------------------- search-pages

function showHint2(str) {
    const resultsContainer = document.getElementById("txtHint");
    const search = document.getElementById("search");
    const rows = resultsContainer.getElementsByClassName('result-row');
    
    if (str.length == 0) {
        resultsContainer.style.display = "none";
        search.style.borderBottomLeftRadius = "10px";
        search.style.borderBottomRightRadius = "10px";
        search.style.borderBottom="1px solid var(--first-color)";
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            resultsContainer.innerHTML = "";
            var response = JSON.parse(xmlhttp.responseText);
            console.log(response);
            if (this.responseText === "no suggestion") {
                const noResult = document.createElement("div");
                noResult.className = "no-suggestion";
                noResult.textContent = "No suggestions found";
                noResult.style.paddingLeft = "30px";
                resultsContainer.appendChild(noResult);
            } else {
                const names = response;
                names.forEach(name => {
                    const row = document.createElement("div");
                    row.className = "result-row";
                    row.textContent = name;
                    row.onclick = function() {
                        document.getElementById("search").value = name;
                        resultsContainer.style.display = "none";
                        search.style.borderBottomLeftRadius = "10px";
                        search.style.borderBottomRightRadius = "10px";
                        search.style.borderBottom="1px solid var(--first-color)";
                    };
                    resultsContainer.appendChild(row);
                });
            }
            search.style.borderBottomLeftRadius="0";
            search.style.borderBottomRightRadius="0";
            search.style.borderBottom="none";
            resultsContainer.style.paddingBottom = "10px";
            resultsContainer.style.display = "flex";
            resultsContainer.style.flexDirection="column";
            resultsContainer.style.textAlign="left";
            resultsContainer.style.border="1px solid var(--first-color)";
            resultsContainer.style.backgroundColor="var(--third-color)";
            resultsContainer.style.borderBottomLeftRadius="10px";
            resultsContainer.style.borderBottomRightRadius="10px";
            resultsContainer.style.position="absolute";
            resultsContainer.style.top="40px";  
            resultsContainer.style.left="0";     
            resultsContainer.style.borderTop="none";
            resultsContainer.style.width="400px";
            Array.from(rows).forEach(row => {
                row.style.paddingLeft = "30px";
                row.addEventListener("mouseenter", () => {
                    row.style.backgroundColor = "gray";
                    
                    
                });
                row.addEventListener("mouseleave", () => {
                    row.style.backgroundColor = "";
                    
                });
            });
        }
    };
    xmlhttp.open("GET", "/LibraSphere/searchBooks?q=" + encodeURIComponent(str), true);

    xmlhttp.send();
}
