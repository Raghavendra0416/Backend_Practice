
//Getting all Users Data
const allUserData = users;

//get all Users
function getAllUsers(req, res) {
    const allUsers = allUserData;

    const payload = {
        sucess: true,
        data: allUsers,
        size: filteredUsers.length,
    }
    res.send(payload);
}

//Query params
function getAllUsersByRole(req, res) {
    const query = req.query; //{role: admin}
    const searchedRole = query.role;

    const filteredUsers = allUserData.filter((user) => {
        if (user.role === searchedRole) {
            return true;
        }
        return false;
    });

    const payload = {
        sucess: true,
        data: filteredUsers,
        size: filteredUsers.length,
    }
    res.send(payload);
};


// URL Params
function getUserByName(req, res) {

    const params = req.params;
    const searchedName = params.name;

    const filteredUsers = allUserData.filter((user) => {
        if (user.name === searchedName) {
            return true;
        }
        return false;
    });

    const payload = {
        sucess: true,
        data: filteredUsers,
        size: filteredUsers.length,
    }

    //Why res.json?
    res.json(payload);
};

module.exports = {
    getAllUsers,
    getAllUsersByRole,
    getUserByName,
};