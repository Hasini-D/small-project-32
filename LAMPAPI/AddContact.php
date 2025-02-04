<?php
	$inData = getRequestInfo();

	if (
        !isset($inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userId"]) ||
        empty($inData["firstName"]) ||
        empty($inData["lastName"]) ||
        empty($inData["phone"]) ||
        empty($inData["email"]) ||
        !is_numeric($inData["userId"]) 
    ) {
        returnWithError("Missing or invalid input.");
        exit();
    }
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserId) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		if($stmt->execute())
		{
			returnWithSuccess("Contact added successfully");
		}
		else
		{
			returnWithError("Failed to add contact" . $stmt->error);
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		sendResultInfoAsJson(["error" => $err] );
	}

	function returnWithSuccess($msg)
	{
		sendResultInfoAsJson(["success" => $msg]);
	}
	
?>
