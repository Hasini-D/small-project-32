const urlBase = "http://cop4331-32.xyz/LAMPAPI";
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    let userId = 0;
    let firstName = "";
    let lastName = "";

    const login = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    const tmp = { username: login, password: password };
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + '/Login.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let res = JSON.parse(xhr.responseText);
                    console.log("Parsed JSON:", res);
        
                    if (res.id > 0) {
                        document.cookie = "firstName=" + res.firstName + "; path=/; expires=" + new Date(Date.now() + 86400000).toUTCString();
                        document.cookie = "lastName=" + res.lastName + "; path=/; expires=" + new Date(Date.now() + 86400000).toUTCString();
                        document.cookie = "userId=" + res.id + "; path=/; expires=" + new Date(Date.now() + 86400000).toUTCString();
        
                        window.location.href = "contactmanager.html";
                    } else {
                        console.error("Login failed:", res.error);
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        };        
        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Error:", err.message);
        alert("An unexpected error occurred.");
    }
}


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    let expires = "expires=" + date.toUTCString();

    document.cookie = `firstName=${firstName}; path=/; ${expires}`;
    document.cookie = `lastName=${lastName}; path=/; ${expires}`;
    document.cookie = `userId=${userId}; path=/; ${expires}`;
}


function readCookie() {
    let cookies = document.cookie.split(";");

    userId = -1, firstName = "", lastName = "";

    cookies.forEach(cookie => {
        let [key, value] = cookie.trim().split("=");

        if (key === "firstName") 
            firstName = value;
       
        if (key === "lastName") 
            lastName = value;
       
        if (key === "userId") 
            userId = parseInt(value, 10);
    });

    if (userId > 0) {
        document.getElementById("userName").textContent = `Logged in as ${firstName} ${lastName}`;
    } else {
        window.location.href = "index.html";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    // Clear cookies? Might need to change later
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "index.html"; 
}


function signUp() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const loginName = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    const data = {
        firstName: firstName,
        lastName: lastName,
        login: loginName,
        password: password
    };

	const url = urlBase + '/Register.' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-Type", "application/json");
	
    xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				const response = JSON.parse(xhr.responseText);
				
                if (response.success) {
					console.log("Data being sent:", data);
					alert(response.message);
					window.location.href = "index.html";
				} 
                
                else {
					console.log("Data being sent:", data);
					alert("Error: " + response.error);
				}
			} 
            
            else {
				console.log("Data being sent:", data);
				alert("Server error: " + this.status + " - " + this.statusText);
			}
		}
	};

	xhr.send(JSON.stringify(data));
}

function addContact() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    document.getElementById("contactAddResult").innerHTML = "";  // Clear any previous messages

    let contactData = {
        firstName: firstName, 
        lastName: lastName, 
        phone: phone,
        email: email,
        userId: userId
    };

    
    let jsonPayload = JSON.stringify(contactData);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // Clear input fields after contact is added
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("phone").value = "";
                    document.getElementById("email").value = "";

                    document.getElementById("contactAddResult").innerHTML;

                    // Refresh the contact list automatically
                    getContacts();
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Error: " + xhr.status + " - " + xhr.statusText;
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = "Error: " + err.message;
    }
}


function getContacts() {
    const url = urlBase + '/Retrieve.' + extension;
    
    const requestData = { userId: userId };
    const jsonPayload = JSON.stringify(requestData);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true); 
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if (response.hasOwnProperty("contacts") && Array.isArray(response.contacts)) {
                        if (response.contacts.length > 0) {
                            const formattedContacts = response.contacts.map(contact => ({
                                firstName: contact.FirstName || "",
                                lastName: contact.LastName || "",
                                email: contact.Email || "",
                                phone: contact.Phone || ""
                            }));
                            
                            displayContacts(formattedContacts);
                        } else {
                            document.getElementById("contactAddResult").innerHTML = "No contacts found.";
                        }
                    } else {
                        document.getElementById("contactAddResult").innerHTML = "Error: Invalid data format from server.";
                    }
                } catch (error) {
                    console.error("Error parsing contacts response:", error);
                    document.getElementById("contactAddResult").innerHTML = "Error loading contacts.";
                }
            } else {
                console.error("Error fetching contacts:", xhr.status, xhr.statusText);
                document.getElementById("contactAddResult").innerHTML = "Error fetching contacts.";
            }
        }
    };

    xhr.send(jsonPayload);
}



function displayContacts(contacts) {
    const container = document.getElementById("contactAddResult");

    container.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("contacts-table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["First Name", "Last Name", "Email", "Phone"];
    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    contacts.forEach(contact => {
        let row = document.createElement("tr");

        let firstNameCell = document.createElement("td");
        firstNameCell.textContent = contact.firstName; 
        row.appendChild(firstNameCell);

        let lastNameCell = document.createElement("td");
        lastNameCell.textContent = contact.lastName; 
        row.appendChild(lastNameCell);

        let emailCell = document.createElement("td");
        emailCell.textContent = contact.email;
        row.appendChild(emailCell);

        let phoneCell = document.createElement("td");
        phoneCell.textContent = contact.phone;
        row.appendChild(phoneCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}
