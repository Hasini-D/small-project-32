<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];
$login = $inData["username"];
$password = $inData["password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) 
{
    returnWithError("Database connection failed: " . $conn->connect_error);
} 
else 
{
    // Check if the login already exists
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) 
    {
        returnWithError("User already exists");
    } 
    else 
    {
        // Insert the new user into the database
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Phone, Login, Password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiss", $firstName, $lastName, $email, $phone, $login, $password);

        if ($stmt->execute()) 
        {
            returnWithSuccess("User created successfully");
        } 
        else 
        {
            returnWithError("Error creating user: " . $stmt->error);
        }
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"success":false,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($msg)
{
    $retValue = '{"success":true,"message":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}
?>
