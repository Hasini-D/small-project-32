<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$inData = getRequestInfo();

$phone = $inData["phone"];
$email = $inData["email"];
$newFirst = $inData["firstName"];
$newLast = $inData["lastName"];
$id = $inData["id"];
$userId = (int)$inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserId = ?");
$stmt->bind_param("ssssii", $newFirst, $newLast, $phone, $email, $id, $userId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    returnWithSuccess("Contact updated successfully.");
} else {
    returnWithError("No matching contact found or no changes made.");
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
    echo $obj;
}

function returnWithError($err)
{
    $retValue = json_encode(["error" => $err]);
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($msg)
{
    $retValue = json_encode(["message" => $msg]);
    sendResultInfoAsJson($retValue);
}

?>
