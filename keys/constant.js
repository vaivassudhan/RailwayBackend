const COLLECTION_NAME = {
    USERS:"Users",
    DEPARTMENTS:"Departments",
    GRIEVANCES:"Grievances",
    NOTIFICATIONS:"Notifications",
    EMPLOYEE:"Employee",
    CHOS:"CHOS",
    DEALERS:"Dealers",
    FOOTER:"Footer"
};

const JWT_KEY = {
    SECRET:"USER_SECRET"
}

const GRIEVANCE_STATUS_CODE ={
    COORDINATOR: '00',
    DPO:'01',
    APO:'02',
    CHOS:'03',
    DEALER: '04',
    CHOSREPLY:'05',
    APOREPLY:'06',
    DPOREPLY:'07',
    COORDINATORREPLY:'08',
    GRANTED:'09',
    APOREVERT:'-01',
    DPOREVERT:'-02',
    COORDINATORREVERT:'-03',
    REVERTED:'-04'
}
const ROLE_CODE ={
    1 : "DPO",
    2 : "APO",
    3 : "Co-ord",
    4 : "CHOS",
    5 : "Dealer",
    6 : "EMP",
}
const ROLE_WITH_ADMIN_AUTH = ['1','3','2'];
const ROLE_WITH_MGMT_AUTH = ['1','2','3','4','5'];
module.exports = {
    COLLECTION_NAME,
    JWT_KEY,
    ROLE_WITH_ADMIN_AUTH,
    ROLE_WITH_MGMT_AUTH,
    GRIEVANCE_STATUS_CODE,
    ROLE_CODE
};
