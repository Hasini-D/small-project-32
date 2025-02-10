<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods:*"); 
header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo();

$search = "%" . $inData["search"] . "%";
$userId = (int)$inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Add phone to select to return the phone numbers in the search
$stmt = $conn->prepare("SELECT Id, firstName, lastName, email, phone FROM Contacts WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ?) AND userId = ?");
$stmt->bind_param("sssi", $search, $search, $search, $userId);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

if (count($contacts) > 0) {
    returnWithSuccess($contacts);
} else {
    returnWithError("No contacts found.");
}

$stmt->close();
$conn->close();

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    sendResultInfoAsJson(["error" => $err]);
}

function returnWithSuccess($contacts)
{
    sendResultInfoAsJson(["results" => $contacts]);
}

?>
