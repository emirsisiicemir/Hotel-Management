class Hotel {
    name;
    static rooms = [];
    static users = [];
    constructor(name) {
        this.name = name;
    }
}

class Room {
    roomID;
    static IDcounter = 1;
    roomType; // single, double, apartment
    isOccupied;
    currentOccupant;
    constructor(roomType) {
        this.roomID = Room.IDcounter++;
        this.roomType = roomType;
        this.isOccupied = false;
        Hotel.rooms.push(this);
    }
}

//CREATING ROOMS FOR HOTEL, mandatory
for (let i = 0; i < 30; i++) new Room("Single bed room");
for (let i = 0; i < 30; i++) new Room("Double bed room");
for (let i = 0; i < 30; i++) new Room("Apartment");

class User {
    //in constructor
    firstName; //string
    lastName; //string
    gender; //string
    documentID; //string
    age; //number
    roomID; //number
    roomType; //string
    dateOfArrival; //DATE!!
    #username; //string, must be unique
    #password; //string

    //not in constructor
    isLoggedIn = false; //boolean
    serviceList = []; // array holding strings
    daysSpent; //number

    constructor(
        firstName,
        lastName,
        gender,
        documentID,
        age,
        roomID,
        roomType,
        dateOfArrival = new Date(),
        username,
        password
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.documentID = documentID;
        this.age = age;
        this.roomID = roomID;
        this.roomType = roomType;
        this.dateOfArrival = dateOfArrival; //by default the date the object was created
        this.#username = username;
        this.#password = password;

        //calculates the difference between current date and date of arrival
        this.daysSpent = Math.round(
            (new Date() - new Date(this.dateOfArrival)) / (1000 * 60 * 60 * 24)
        );
    }

    //getter for username, others should be able to see
    get username() {
        return this.#username;
    }

    get password() {
        return this.#password;
    }

    //checks the users's current bill status
    checkBill() {
        console.log("-----------------------");
        let totalPrice = 0;

        //Main room price evaulation per day spent in hotel
        switch (this.roomType) {
            case "Single bed room":
                totalPrice += 20 * this.daysSpent;
                console.log("Single bed room : 20 KM");
                console.log(
                    this.daysSpent + " days : " + 20 * this.daysSpent + " KM\n"
                );
                break;

            case "Double bed room":
                totalPrice += 40 * this.daysSpent;
                console.log("Double bed room : 40 KM");
                console.log(
                    this.daysSpent + " days : " + 40 * this.daysSpent + " KM\n"
                );
                break;

            case "Apartment":
                totalPrice += 60 * this.daysSpent;
                console.log("Apartment : 60 KM");
                console.log(
                    this.daysSpent + " days : " + 60 * this.daysSpent + " KM\n"
                );
                break;

            default:
                console.log("Error : unexpected roomType found");
                break;
        }

        //additional services evaulation per order
        for (let i = 0; i < this.serviceList.length; i++) {
            const element = this.serviceList[i];

            let servicePrice;
            switch (element) {
                case "Gym":
                    servicePrice = 5;
                    break;

                case "Cinema":
                    servicePrice = 15;
                    break;

                case "Restaurant":
                    servicePrice = 20;
                    break;

                case "Pool":
                    servicePrice = 15;
                    break;

                case "Sauna":
                    servicePrice = 10;
                    break;

                default:
                    console.log("Error : unexpected service found");
                    break;
            }
            totalPrice += servicePrice;
            console.log("+ " + element + " : " + servicePrice + " KM");

        }
        //total evaluation
        console.log("TOTAL : ", totalPrice, " KM");
        console.log("-----------------------");
    }

    //adds a new sevice to seviceList of the user
    orderService(service) {
        if (
            service === "Gym" ||
            service === "Cinema" ||
            service === "Restaurant" ||
            service === "Pool" ||
            service === "Sauna"
        )
            this.serviceList.push(service);
        else console.log("Error : unexpected service recieved");
    }

    changeRoom(room) {
        if (Hotel.rooms.includes === room)
            this.roomID = room.roomID;
        this.roomType = room.roomType;
    }

    //sets isLoggedIn flag to false
    logOut() {
        this.isLoggedIn = false;
        console.log(this.#username, "logged out.");
    }

}



class Admin {
    username;
    #password;
    isSystemOn;

    constructor(username, password) {
        this.#password = password;
        this.username = username;
    }

    logInUser(username, password) {
        for (let i = 0; i < Hotel.users.length; i++) {
            let user = Hotel.users[i];

            if (user.username === username && user.password === password) {
                user.isLoggedIn = true;
                console.log(`${username} logged in.`);  //if username exists, gets logged in
                return 0;
            }
        }

        console.log("Username or Password invalid!");
        return 1;
    }

    registerUser(
        firstName,
        lastName,
        gender,
        documentID,
        age,
        roomType,
        dateOfArrivial,
        username,
        password
    ) {
        let roomID = null;//goes into constructor,empty for now, will be generated below

        //ROOM CHECK
        // Finds an empty room for the user, if it exists

        for (let i = 0; i < Hotel.rooms.length; i++) {
            let hotelRoom = Hotel.rooms[i];

            //if current room is taken or wrong type, skip immediately
            if (hotelRoom.isOccupated === true || hotelRoom.roomType !== roomType) continue;
            //otherwise, gives the user the id of the current room
            else roomID = hotelRoom.roomID;
        }

        //if no rooms found, aborts
        if (roomID === null) {
            console.log(`${roomType} is not available!`);
            return 1;// 1 - room error
        }

        //USERNAME CHECK

        for (let i = 0; i < Hotel.users.length; i++) {
            let user = Hotel.users[i];

            if(user.username===username){
                console.log(`Username "${username}" is not available`);
                return 2;// 2 - username error
            }
        }

        //REGISTRATION
        let korisnik = new User(
            firstName,
            lastName,
            gender,
            documentID,
            age,
            roomID,
            roomType,
            dateOfArrivial,
            username,
            password
        );
        Hotel.users.push(korisnik);
        return 0;// 0 - user registered
    }

    userChanges(username, change) {
        let currentUserObject;
        for (let i = 0; i < Hotel.users.length; i++) {
            let userObject = Hotel.users[i];
            if (userObject.username === username) {
                currentUserObject = userObject;
                break;
            }
        }
        if (
            change === "Single bed room" ||
            change === "Double bed room" ||
            change === "Apartment"
        ) {
            //console.log(currentUserObject);

            currentUserObject.roomType = change;
        }
        if (
            change === "Gym" ||
            change === "Cinema" ||
            change === "Restaurant" ||
            change === "Pool" ||
            change === "Sauna"
        ) {
            currentUserObject.serviceList.push(change);
        }
    }
    billServices(username) {
        let currentUserObject;
        let overallPrice = 0;
        for (let i = 0; i < Hotel.users.length; i++) {
            let userObject = Hotel.users[i];
            if (userObject.username === username) {
                currentUserObject = userObject;
                break;
            }
        }
        for (let i = 0; i < currentUserObject.serviceList.length; i++) {
            let element = currentUserObject.serviceList[i];
            switch (element) {
                case "Gym":
                    overallPrice += 5;
                    break;

                case "Cinema":
                    overallPrice += 15;
                    break;

                case "Restaurant":
                    overallPrice += 20;
                    break;

                case "Pool":
                    overallPrice += 15;
                    break;

                case "Sauna":
                    overallPrice += 10;
                    break;

                default:
                    console.log("Error : unexpected service found");
                    break;
            }
        }
        console.log(
            `User ${currentUserObject.firstName} ${currentUserObject.lastName} has used ${overallPrice} KM of additional services.`
        );
    }
    logOutUser(username) {
        let user = this.searchForUser(username);//finds the user using the username

        if (user.isLoggedIn) {
            user.isLoggedIn = false;
            console.log(`${user.username} logged out.`);
        } else {
            console.log("User already logged out");
        }
    }
    loggingOutUsers(users) {
        let loggedInUsers = [];
        for (let i = 0; i < Hotel.users.length; i++) {
            let currentUserObject = Hotel.users[i];
            if (currentUserObject.isLoggedIn === true) {
                loggedInUsers.push(currentUserObject.username);
            }
        }
        if (loggedInUsers.length === 0) {
            console.log("All users already logged out.");
            return;
        } else {
            console.log(`Currently logged in users are: ${loggedInUsers}`);
        }

        if (users !== "All") {//individual user logout
            let currentUserObject = this.searchForUser(users);//finds the user using the username
            if(currentUserObject!==0) {
            currentUserObject.isLoggedIn=false;
            console.log(`User ${users} logged out.`);
            }
            else console.log(`User ${users} does not exist.`);
        }
        if (users === "All") {//all users logout
            for (let i = 0; i < Hotel.users.length; i++) {
                let curretnUserObject = Hotel.users[i];
                curretnUserObject.isLoggedIn = false;
            }
            this.isSystemOn = false;
            console.log("All users logged out. System is turning off.");
        }
    }
    searchForUser(username) {
        for (let i = 0; i < Hotel.users.length; i++) {
            let currentUserObject = Hotel.users[i];
            if (currentUserObject.username === username) {
                return currentUserObject;
            }
        }
        return 0;//user not found
    }
}





    //Testiranje da li sve radi kako treba
    const anis = new Admin("a19k", 12321);

anis.registerUser(
    "Emir",
    "Sisic",
    "male",
    "1",
    25,
    "Single bed room",
    new Date(),
    "Emiiiir",
    "0000"
);


anis.logInUser(
    "mahko",
    "0000"
);

anis.registerUser(
    "Anis",
    "Karic",
    "male",
    "2",
    25,
    "Apartment",
    new Date(),
    "a19k",
    "1111",
);

console.log("---------------------------------");

anis.userChanges("a19k", "Double bed room");
anis.userChanges("a19k", "Cinema");
anis.userChanges("a19k", "Gym");


console.log(Hotel.users);

anis.billServices("a19k");
Hotel.users[1].checkBill();

anis.logInUser("a19k","1111")
anis.logOutUser("a19k");
anis.loggingOutUsers("mahko");
console.log(anis.searchForUser("mahko"));

anis.loggingOutUsers("mahko");
