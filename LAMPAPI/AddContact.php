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
    $userId = (int)$inData["userId"];
    //$userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        exit();
    } 
    else {

        $stmt = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE Phone = ? AND UserId = ?");
        $stmt->bind_param("si", $phone, $userId);
        $stmt->execute();
        $stmt->bind_result($contactCount);
        $stmt->fetch();
        $stmt->close();


        if ($contactCount > 0) {
            returnWithError("A contact with this phone number already exists for this user.");
            $conn->close();
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserId) VALUES(?, ?, ?, ?, ?)");
        if (!$stmt) {
            returnWithError($conn->error);
            $conn->close();
            exit();
        }
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		/*$stmt->bindParam(':value1',$firstName);
		$stmt->bindParam(':value2',$lastName);
		$stmt->bindParam(':value3',$phone);
		$stmt->bindParam(':value4',$email);
		$stmt->bindParam(':value5',$userId);*/
		$test = $stmt->execute();
		//$err = "Here is the statment status:"+$test;
		//print_r($stmt->test);
		//echo "Here is the statment status:" . $test;
        if ($test) {
            returnWithSuccess("Contact added successfully.");
        } else {
            returnWithError($stmt->error);
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError($err) {
        $retValue = json_encode(array("error" => $err));
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess($msg) {
        $retValue = json_encode(array("message" => $msg));
        sendResultInfoAsJson($retValue);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
?>
