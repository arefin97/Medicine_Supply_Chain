# Medicine_Supply_Chain
### Detecting fake and counterfeit drugs through supply chain management using blockchain technology.
## Why we need it?:
Medicines are meant for saving lives. But if counterfeited, they endanger health of users and
sometimes lead to their death.
The counterfeiting of medicines is a criminal offence in Bangladesh. But those involved in
production, distribution and sale of such medicines are hardly punished. Mobile courts operated
by different departments sometimes take action against them but that is quite inadequate
compared to the gravity of the crimes.
So, to get rid of this problem we need digital solution using technology. Blockchain Technology is
one of them that we can use as a solution.
## How does our system work?:
We have built a website using blockchain where there are 4 types of users – customer, dealer/seller,
producer and admin.
The admin will add the infos of all verified dealers and producers with valid trade licence in the
database. Any user with a valid NID and unique email can sign in our system as a customer.
But to sign in as a dealer or producer, one needs to provide the verified trade licence that has been
added by admin. So any unauthorized person or company can’t be registered as a dealer or
producer. That is the first step of security.
Only a valid production company can insert the informations of a medicine like MedicineID, Name,
Company Name, Production Date, Expire Date , Current State etc. At the begennig, Current State of
a medicine will the production company. Gradually the state will be updated when it will be sold
dealer to dealer or customer. So, Current State represents to whom the medicine is occupied. It is
the second step of security.
So, to buy an original medicine a customer need to check –  
(i) if the Medicine ID exist in the database with the valid production company  
(ii) if the Current State of the medicine matches with the seller from where he is going to buy
the medicine.  
To buy a medicine, customer needs to click the buy button corresponding with the medicine. A
notification will be send to the seller. Then, seller can approve or reject the buy request. If he
approves , the Current State of the medicine will be changed as customer user name and
transaction will be completed. On the other hand, he rejects, no transaction will be happened
and state will remain same.
## Key Features:
(i) Login/Register: 4 types of user can use it – customer, dealer/seller, producer, admin.  
(ii) Without Login: Any one can see the infos of a medicine by searching with medicine ID.
Beside that Home page is open for all.  
(iii) Customer Login: A customer has a profile page, notification panel, can send buy request
against any medicine.  
(iv) Dealer/Seller Login: A dealer/seller enjoys all features a customer has. Additionally, He can
approve or remove any buy request to him.  
(v) Producer Login: A producer enjoys all features a dealer/seller has. Additionally, He can insert
his produced medicine in the database.  
(vi) Admin Login: An admin also has profile page, notification panel. Additionally, he can perform
some administrative actions like – add infos of all verified dealers and producers with valid
trade licence in the database.
