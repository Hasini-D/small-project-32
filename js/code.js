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

    // Clear any previous messages
    document.getElementById("contactAddResult").innerHTML = "";

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
                console.log("XHR Status:", xhr.status); // Debugging line
                if (xhr.status == 200) {
                    console.log("Contact added successfully!"); // Debugging line
                    // Clear input fields after contact is added
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("phone").value = "";
                    document.getElementById("email").value = "";

                    // Refresh the contact list automatically
                    getContacts();  
                } else {
                    console.error("Error adding contact:", xhr.statusText); // Debugging line
                    document.getElementById("contactAddResult").innerHTML = "Error: " + xhr.status + " - " + xhr.statusText;
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Request error:", err); // Debugging line
        document.getElementById("contactAddResult").innerHTML = "Error: " + err.message;
    }
}





document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    // Handle search button click
    searchBtn.addEventListener("click", function() {
        const searchQuery = searchInput.value.toLowerCase();
        console.log("Search query:", searchQuery);  // Debugging step
        if (searchQuery) {
            searchContacts(searchQuery, userId);
        }
    });
});



// Function to search contacts using XMLHttpRequest
function searchContacts(searchTerm, userId) {
    const url = urlBase + '/Search.' + extension;
    
    const requestData = {
        search: searchTerm,
        userId: userId
    };

    const jsonPayload = JSON.stringify(requestData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.error) {
                    console.error('Error:', response.error);
                    displayContacts([]);  // Clear results if error occurs
                } else {
                    console.log('Contacts found:', response.results);
                    displayContacts(response.results); 
                }
            } else {
                console.error('Request failed with status:', xhr.status);
            }
        }
    };

    xhr.send(jsonPayload);
}

function getContacts() {
    console.log("Fetching contacts... User ID:", userId);  // Debugging line
    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + "/Retrieve." + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.success) {
                displayContacts(response.contacts);
            } else {
                console.error("Error loading contacts");
                displayContacts([]); // Show empty table if an error occurs
            }
        }
    };

    const requestData = { userId: userId };
    xhr.send(JSON.stringify(requestData));
}


function displayContacts(contacts) {
    
    const tbody = document.querySelector('#contactsTable tbody');
    
    if (tbody) {
        tbody.innerHTML = '';  // Clear previous contacts

        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No contacts found.</td></tr>';
            return;
        }

        contacts.forEach(contact => {
            console.log("Contact ID:", contact.Id); 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName}</td>
                <td>${contact.lastName}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>
                    <button onclick="editContact(${contact.Id})">Edit</button>
                    <button onclick="deleteContact(${contact.Id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } else {
        console.error('Error: Contacts table tbody not found.');
    }
}

//Not working
function editContact(contactId) {
    const url = urlBase + '/Retrieve.' + extension;

    const requestData = { contactId: contactId, userId: userId };
    const jsonPayload = JSON.stringify(requestData);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.contact) {
                    // Populate the "Add Contact" form with the contact details for editing
                    document.getElementById("firstName").value = response.contact.firstName;
                    document.getElementById("lastName").value = response.contact.lastName;
                    document.getElementById("phone").value = response.contact.phone;
                    document.getElementById("email").value = response.contact.email;

                    // Set a flag to indicate that we are editing an existing contact
                    document.getElementById("contactId").value = response.contact.id;
                } else {
                    alert("Contact not found.");
                }
            } else {
                console.error("Failed to fetch contact:", xhr.status);
            }
        }
    };

    xhr.send(jsonPayload);
}


function deleteContact(contactId) {
    if (confirm("Are you sure you want to delete this contact?")) {
        const contactData = {
            Id: contactId,
            userId: userId
        };
        console.log("User ID:", userId);

        let jsonPayload = JSON.stringify(contactData);
        let url = urlBase + "/Delete." + extension; 

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        console.log("Deleting contact with ID:", contactId, "and User ID:", userId);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    getContacts(); //Refresh contacts
                } else {
                    console.error("Failed to delete contact");
                }
            }
        };

        xhr.send(jsonPayload);
    }
}
