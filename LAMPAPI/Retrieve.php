<?php

$inData = getRequestInfo();

$userId = $inData["userId"]; // The user ID to retrieve contacts for

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) 
{
    returnWithError("Database connection failed: " . $conn->connect_error);
} 
else 
{
    // Retrieve all contacts for the given user
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserId=?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) 
    {
        $contacts = [];
        while ($row = $result->fetch_assoc()) 
        {
            $contacts[] = $row;
        }
        returnWithInfo($contacts);
    } 
    else 
    {
        returnWithError("No contacts found");
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

function returnWithInfo($contacts)
{
    $retValue = '{"success":true,"contacts":' . json_encode($contacts) . '}';
    sendResultInfoAsJson($retValue);
}

?>
