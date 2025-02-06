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

    let userId = -1, firstName = "", lastName = "";

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



function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const loginName = document.getElementById("loginName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
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
					window.location.href = "color.html";
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
