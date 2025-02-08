<?php

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

$inData = getRequestInfo();

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Prepare and execute the delete statement
$stmt = $conn->prepare("DELETE FROM Contacts WHERE Id=? AND userId=?");
$stmt->bind_param("ii", $inData["Id"], $inData["userId"]);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Contact deleted successfully"]);
    } else {
        echo json_encode(["error" => "No matching contact found"]);
    }
} else {
    error_log("SQL error: " . $stmt->error);
    echo json_encode(["error" => "Failed to delete contact"]);
}

$stmt->close();
$conn->close();
?>
