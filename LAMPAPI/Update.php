<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) {
   	 returnWithError($conn->connect_error);
	} else {
    	// Prepare the SQL statement for updating a contact
    	$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
    	$stmt->bind_param(
>>>>>>> b59c20f3fa67ae360e7ddca9946b0c4d5f14ee54
        "ssssii", 
        $inData["FirstName"], 
        $inData["LastName"], 
        $inData["Phone"], 
        $inData["Email"], 
        $inData["ID"], 
        $inData["UserID"]
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            returnWithInfo("Contact updated successfully");
        } else {
            returnWithError("No matching contact found or no changes made");
        }
    } else {
        returnWithError("Failed to update contact: " . $stmt->error);
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($message)
{
    $retValue = '{"message":"' . $message . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>
<<<<<<< HEAD
=======

>>>>>>> b59c20f3fa67ae360e7ddca9946b0c4d5f14ee54
