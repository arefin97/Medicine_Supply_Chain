/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"

	//"image/gif"
	//"image/png"
	//"image/jpeg"

	//"github.com/hyperledger/fabric/core/chaincode/shim"
	//sc "github.com/hyperledger/fabric/protos/peer"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library

type Medicine struct {
	Id        string
	Name      string
	PCompany  string
	Pdate     string
	Expdate   string
	Currstage string
	OwnerId   string
	Path      string
	Type      string
	Img_path  string
}

type Notification struct {
	SellerId   string
	SellerName string
	BuyerId    string
	BuyerName  string
	ProductId  string
	Time       string
	Type       string
}
type User struct {
	NID      string
	Name     string
	Email    string
	Password string
	Phone    string
	UserType string
	Img_Path string
	Dtype    string
}

type Seller struct {
	Id    string
	Name  string
	Email string
	Type  string
	Dtype string
}

type Flag struct {
	Id      string
	BuyerId string
	Flg     string
	Doctype string
}
type History struct {
	Id       string
	PId      string
	Ttype    string
	DealWith string
	DateTime string
	To_From  string
	Doctype  string
}
type Complain struct {
	Id             string
	ComplainTo     string
	ComplaineeId   string
	ComplaineeName string
	Complain       string
	Time           string
	Doctype        string
}

// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryAllRecords" {
		return s.queryAllRecords(APIstub)
	} else if function == "createMedicine" {
		return s.createMedicine(APIstub, args)
	} else if function == "queryMedicineById" {
		return s.queryMedicineById(APIstub, args)
	} else if function == "queryAllMedicine" {
		return s.queryAllMedicine(APIstub)
	} else if function == "createUser" {
		return s.createUser(APIstub, args)
	} else if function == "queryUser" {
		return s.queryUser(APIstub, args)
	} else if function == "addNotifications" {
		return s.addNotifications(APIstub, args)
	} else if function == "getNotifications" {
		return s.getNotifications(APIstub, args)
	} else if function == "getNotificationsByPId" {
		return s.getNotificationsByPId(APIstub, args)
	} else if function == "addSeller" {
		return s.addSeller(APIstub, args)
	} else if function == "getSeller" {
		return s.getSeller(APIstub, args)
	} else if function == "queryUserById" {
		return s.queryUserById(APIstub, args)
	} else if function == "addFlag" {
		return s.addFlag(APIstub, args)
	} else if function == "getFlag" {
		return s.getFlag(APIstub, args)
	} else if function == "addPath" {
		return s.addPath(APIstub, args)
	} else if function == "getPath" {
		return s.getPath(APIstub, args)
	} else if function == "changeMedicineOwner" {
		return s.changeMedicineOwner(APIstub, args)
	} else if function == "deleteNoti" {
		return s.deleteNoti(APIstub, args)
	} else if function == "addHistory" {
		return s.addHistory(APIstub, args)
	} else if function == "getHistory" {
		return s.getHistory(APIstub, args)
	} else if function == "addComplain" {
		return s.addComplain(APIstub, args)
	} else if function == "getComplain" {
		return s.getComplain(APIstub, args)
	} else if function == "getComplainById" {
		return s.getComplainById(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cars := []Car{
		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	return shim.Success(nil)
}
*/

func (s *SmartContract) createMedicine(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var medicineKey = args[0]

	var id string = args[1]
	//id, err := strconv.Atoi(args[1])

	//if err != nil {
	//	fmt.Println("the id should be an integer")
	//}
	var name string = args[2]
	var company string = args[3]
	var ownerId string = args[4]
	var pDate string = args[5]
	var expDate string = args[6]
	var cStage string = args[7]
	var path string = cStage
	var img string = args[8]
	var doctype string = "medicine"

	var medicine = Medicine{Id: id, Name: name, PCompany: company, OwnerId: ownerId, Pdate: pDate, Expdate: expDate, Currstage: cStage, Path: path, Type: doctype, Img_path: img}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	medicineAsBytes, _ := json.Marshal(medicine) //notice the variable declaration here, new variable introduced
	APIstub.PutState(medicineKey, medicineAsBytes)

	return shim.Success(nil)
}

//user adding
func (s *SmartContract) createUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]

	var id string = args[1]

	var name string = args[2]
	var email string = args[3]

	var password string = args[4]
	var phone string = args[5]

	var userType string = args[6]
	var img string = args[7]
	var dType string = "user"

	var user = User{NID: id, Name: name, Email: email, Password: password, Phone: phone, UserType: userType, Img_Path: img, Dtype: dType}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	userAsBytes, _ := json.Marshal(user) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, userAsBytes)

	return shim.Success(nil)
}

/*
 *This function selects all the records whose Doctype is medicine
 */

func (s *SmartContract) queryAllMedicine(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Type\":\"medicine\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func (s *SmartContract) queryUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	email := args[0]
	//email2 := args[1]
	//printf("Email %s\n", email)
	//email, err := strconv.Atoi(args[0])

	//let's make the query
	var queryString = fmt.Sprintf("{\"selector\": {\"Dtype\": \"user\",\"Email\": \"%v\"}}", email)
	//var queryString = fmt.Sprintf("{\"selector\": {\"UserType\": \"customer\",\"Email\": %v}}", email)
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

//////
func (s *SmartContract) queryUserById(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//email2 := args[1]
	//printf("Email %s\n", email)
	//email, err := strconv.Atoi(args[0])

	//let's make the query

	var queryString = fmt.Sprintf("{\"selector\": {\"Dtype\": \"user\",\"NID\": \"%v\"}}", id)
	//var queryString = fmt.Sprintf("{\"selector\": {\"UserType\": \"customer\",\"Email\": %v}}", email)
	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}
func (s *SmartContract) queryAllUser(APIstub shim.ChaincodeStubInterface) sc.Response {
	queryString := "{\"selector\":{\"Dtype\":\"user\"}}"

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

/////

func (s *SmartContract) queryMedicineById(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Type\": \"medicine\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

/*func (s *SmartContract) queryMoviesByGenre(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	genre := args[0] // as the genre is a string, no need to convert it

	//let's make the query AGAIN, this time selecting all movies. We'll filter later
	var queryString = fmt.Sprintf("{\"selector\":{\"Doctype\":\"movie\"}}") //this query selects all movies

	resultsIterator, _ := APIstub.GetQueryResult(queryString) //skip the errors
	//skipping error handling here :p

	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
		//skipping error handling again

		movieJSON := queryResponse.Value //not value, Value
		var movie Movie
		_ = json.Unmarshal(movieJSON, &movie) //json to golang object,

		if !strings.Contains(movie.Genre, genre) {
			continue //if the movie genre does not contain the genre the user is providing, then don't print this movie
		}

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return shim.Success(buffer.Bytes())
}*/

func (s *SmartContract) queryAllRecords(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := ""
	endKey := "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllRecords:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeMedicineOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	medicineAsBytes, _ := APIstub.GetState(args[0])
	medicine := Medicine{}

	json.Unmarshal(medicineAsBytes, &medicine)
	medicine.Currstage = args[1]
	medicine.OwnerId = args[2]

	medicineAsBytes, _ = json.Marshal(medicine)
	APIstub.PutState(args[0], medicineAsBytes)

	//

	return shim.Success(nil)
}

//notifications
func (s *SmartContract) addNotifications(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]

	var sellerId string = args[1]

	var sellerName string = args[2]
	var buyerId string = args[3]
	var buyerName string = args[4]
	var productId string = args[5]
	var time string = args[6]
	var doctype string = "notification"

	var notification = Notification{SellerId: sellerId, SellerName: sellerName, BuyerId: buyerId, BuyerName: buyerName, ProductId: productId, Time: time, Type: doctype}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	notificationAsBytes, _ := json.Marshal(notification) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, notificationAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getNotifications(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Type\": \"notification\",\"SellerId\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

///////
func (s *SmartContract) getNotificationsByPId(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Type\": \"notification\",\"ProductId\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

//////

/////
func (s *SmartContract) addFlag(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]

	var id string = args[1]
	var buyerId string = args[2]

	var flg string = args[3]
	var doctype string = "flag"

	var flag = Flag{Id: id, BuyerId: buyerId, Flg: flg, Doctype: doctype}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	flagAsBytes, _ := json.Marshal(flag) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, flagAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getFlag(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Doctype\": \"flag\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

////
func (s *SmartContract) addComplain(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]
	var id = args[1]
	var complain_to string = args[2]
	var complainee_id string = args[3]
	var complainee_name string = args[4]
	var complains string = args[5]
	var time string = args[6]
	var doctype string = "complain"

	var complain = Complain{Id: id, ComplainTo: complain_to, ComplaineeId: complainee_id, ComplaineeName: complainee_name, Complain: complains, Time: time, Doctype: doctype}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	complainAsBytes, _ := json.Marshal(complain) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, complainAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getComplain(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	email := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Doctype\": \"complain\",\"ComplainTo\": \"%v\"}}", email)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}
func (s *SmartContract) getComplainById(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Doctype\": \"complain\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

/////////////////

func (s *SmartContract) addHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]

	var id string = args[1]
	var pId string = args[2]
	var tType string = args[3]
	var dealWith string = args[4]
	var dateTime string = args[5]
	var to_from string = args[6]
	var doctype string = "history"

	var history = History{Id: id, PId: pId, Ttype: tType, DealWith: dealWith, DateTime: dateTime, To_From: to_from, Doctype: doctype}
	//var medicine = Medicine{Name: name, PCompany: company, Id: id, Currstage: cStage, Doctype: doctype}

	historyAsBytes, _ := json.Marshal(history) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, historyAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Doctype\": \"history\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

///////
func (s *SmartContract) addPath(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	medicineAsBytes, _ := APIstub.GetState(args[0])
	medicine := Medicine{}

	json.Unmarshal(medicineAsBytes, &medicine)
	medicine.Path = medicine.Path + "--->" + args[1]

	medicineAsBytes, _ = json.Marshal(medicine)
	APIstub.PutState(args[0], medicineAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getPath(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Doctype\": \"medicine\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

//////
////
func (s *SmartContract) addSeller(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var Key = args[0]

	var id string = args[1]
	var name string = args[2]
	var email string = args[3]
	var types string = args[4]
	var dType string = "seller"

	var seller = Seller{Id: id, Name: name, Email: email, Type: types, Dtype: dType}

	sellerAsBytes, _ := json.Marshal(seller) //notice the variable declaration here, new variable introduced
	APIstub.PutState(Key, sellerAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getSeller(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	id := args[0]
	//id, err := strconv.Atoi(args[0])

	//let's make the query
	//now we have to wrap it in quotes
	var queryString = fmt.Sprintf("{\"selector\": {\"Dtype\": \"seller\",\"Id\": \"%v\"}}", id)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

/////
//deleteKajmak method definition
func (s *SmartContract) deleteNoti(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	//var A = args[0]
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	err := APIstub.DelState(args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to delete Notification: %s", args[0]))
	}

	// Delete the key from the state in ledger

	eventPayload := "Notification with ID " + args[0]
	payloadAsBytes := []byte(eventPayload)
	eventErr := APIstub.SetEvent("deleteEvent", payloadAsBytes)
	if eventErr != nil {
		return shim.Error(fmt.Sprintf("Failed to emit event"))
	}
	fmt.Printf("- delete Event:\n%s\n", args[0])
	return shim.Success(nil)
}

/*func (s *SmartContract) changeCarOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.Owner = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}*/

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
