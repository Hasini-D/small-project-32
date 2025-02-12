const urlBase = "http://cop4331-32.xyz/LAMPAPI";
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contactsArray = [];

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

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                document.getElementById("firstName").value = "";
                document.getElementById("lastName").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("email").value = "";
                getContacts();
                location.reload(); // Refreshes the page from the server
            } 
            else {
                console.error("Error adding contact:", xhr.statusText);
                document.getElementById("contactAddResult").innerHTML = "Error: " + xhr.status + " - " + xhr.statusText;
            }
        }
    };

    xhr.send(jsonPayload);
}


document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", function() {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            searchContacts(searchQuery);
        } else {
            getContacts(); // Show all contacts if search is empty
        }
    });
});


function searchContacts(searchTerm) {
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
                    contactsArray = [];  // Clear the contacts if an error occurs
                    displayContacts();  
                } else {
                    console.log('Contacts found:', response.results);

                    // Format response to match displayContacts() expectations
                    contactsArray = response.results.map(contact => ({
                        Id: contact.Id,
                        FirstName: contact.firstName,
                        LastName: contact.lastName,
                        Email: contact.email,
                        Phone: contact.phone  // Phone number is not working
                    }));

                    displayContacts(); // refresh contacts
                }
            } else {
                console.error('Request failed with status:', xhr.status);
            }
        }
    };

    xhr.send(jsonPayload);
}

function getContacts() {
    console.log("Fetching contacts... User ID:", userId);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + "/Retrieve." + extension, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);

                if (response.error) {
                    console.error("Error loading contacts:", response.error);
                    contactsArray = [];  
                } else {
                    contactsArray = response.contacts.map(contact => ({
                        Id: contact.ID || contact.Id,
                        FirstName: contact.FirstName || contact.firstName,
                        LastName: contact.LastName || contact.lastName,
                        Phone: contact.Phone || contact.phone,
                        Email: contact.Email || contact.email
                    }));
                }

                displayContacts(); // Refresh contacts
            } else {
                console.error("Failed to fetch contacts:", xhr.status);
            }
        }
    };

    const requestData = { userId: userId };
    xhr.send(JSON.stringify(requestData));
}

function displayContacts() {
    const tbody = document.querySelector('#contactsTable tbody');
    tbody.innerHTML = ''; // Clear the table before populating it

    if (contactsArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No contacts found.</td></tr>';
        return;
    }

    contactsArray.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.FirstName}</td>
            <td>${contact.LastName}</td>
            <td>${contact.Email}</td>
            <td>${contact.Phone}</td>
            <td>
                <button onclick="editContact(${contact.Id})">
                    <img style="height:40px;" src="images/edit.png" alt="edit">
                </button>
                <button onclick="deleteContact(${contact.Id})">
                    <img style="height:40px;" src="images/trash.png" alt="delete">
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function editContact(contactId) {
    console.log("editContact called with contactId:", contactId);

    let contact = contactsArray.find(c => c.Id === contactId);

    if (!contact) {
        console.error("Contact not found for ID:", contactId);
        return;
    }

    console.log("Contact found:", contact);

    // Populate form fields with existing data
    document.getElementById("editContactId").value = contact.Id;
    document.getElementById("editFirstName").value = contact.FirstName;
    document.getElementById("editLastName").value = contact.LastName;
    document.getElementById("editEmail").value = contact.Email;
    document.getElementById("editPhone").value = contact.Phone;

    // Show the pop up editor
    document.getElementById("editContactModal").style.display = "block";
    console.log("Edit modal displayed.");
}

function closeEditModal() {
    console.log("Closing edit modal.");
    document.getElementById("editContactModal").style.display = "none";
}

// Handle the form submission for updating contact
document.getElementById("editContactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("Edit form submitted.");

    let updatedContact = {
        id: document.getElementById("editContactId").value,
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editPhone").value,
        userId: userId  // Assuming userId is stored globally
    };

    console.log("Updated contact data:", updatedContact);

    let jsonPayload = JSON.stringify(updatedContact);
    let url = urlBase + "/Update." + extension; 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        console.log("XHR readyState:", xhr.readyState, "status:", xhr.status);
        
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Contact updated successfully!", xhr.responseText);
            closeEditModal(); // Close modal
            getContacts(); // Refresh contacts list
        } else if (xhr.readyState === 4) {
            console.error("Error updating contact:", xhr.statusText, "Response:", xhr.responseText);
        }
    };

    console.log("Sending update request to:", url);
    xhr.send(jsonPayload);
});




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
                    contactsArray = contactsArray.filter(contact => contact.Id !== contactId); //deletes from array
                    getContacts(); //Refresh contacts
                } else {
                    console.error("Failed to delete contact");
                }
            }
        };

        xhr.send(jsonPayload);
    }
}
