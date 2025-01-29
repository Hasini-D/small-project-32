async function signUp() {
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const loginName = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    const data = {
        email: email,
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        login: loginName,
        password: password
    };

    try {
        const response = await fetch("Register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message); 
            window.location.href = "color.html";
        } else {
            alert("Error: " + result.error); 
        }
    } 
    catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
}
