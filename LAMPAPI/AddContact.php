<?php
    $inData = getRequestInfo();

    /*if (
        !isset($inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userId"]) ||
        empty($inData["firstName"]) ||
        empty($inData["lastName"]) ||
        empty($inData["phone"]) ||
        empty($inData["email"]) ||
        !is_numeric($inData["userId"]) 
    ) {
        returnWithError("Missing or invalid input.");
        exit();
    }*/
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
        exit();
    } 
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserId) VALUES(?,?,?,?,?)");
        if (!$stmt) {
            returnWithError($conn->error);
            $conn->close();
            exit();
        }
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
        if($stmt->execute())
        {
            returnWithSuccess("Contact added successfully");
        }
        else
        {
            returnWithError($stmt->error);
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError($err)
    {
        $retValue = json_encode(array("error" => $err));
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess($msg)
    {
        $retValue = json_encode(array("message" => $msg));
        sendResultInfoAsJson($retValue);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
?>