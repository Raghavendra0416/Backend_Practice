

function homeResponse(req, res) {
    res.send("<h1>Express Js, Welcomes you!</h1>")
}

function aboutResponse(req, res) {
    res.send("<h1>About Page</h1>");
}

function contactResponse(req, res) {
    res.send("<h1>Contacts Page</h1>")
}

module.export = {
    homeResponse,
    aboutResponse,
    contactResponse,
}