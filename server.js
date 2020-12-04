const express = require("express")
let app = express()
const PORT = process.env.PORT || 3000;

let path = require("path")
let bodyParser = require("body-parser")

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));
let student
let adminIsLogged = false
let userIsAvailable = true
let userExists = false
let foundUser
let order = "low to high"
let women = []
let men = []

let users = [
    { id: 1, log: 'AAA', pass: 'PASS1', age: 10, student: 'checked', gender: 'm' },
    { id: 2, log: 'BBB', pass: 'PASS2', age: 12, student: '', gender: 'k' },
    { id: 3, log: 'CCC', pass: 'PASS3', age: 18, student: 'checked', gender: 'm' },
    { id: 4, log: 'DDD', pass: 'PASS4', age: 16, student: '', gender: 'k' },
    { id: 5, log: 'EEE', pass: 'PASS5', age: 12, student: 'checked', gender: 'm' },
] 

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})


app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.post("/register", function (req, res) {
    console.log(req.body)
    if (req.body.student === undefined) {
        student = ""
    } else {
        student = req.body.student
    }

    console.log('New ID: ', users[users.length - 1].id + 1)

    let newUser = {
        id: users[users.length - 1].id + 1,
        log: req.body.log,
        pass: req.body.pass,
        age: parseInt(req.body.age),
        student: student,
        gender: req.body.gender
    }

    for (user of users) {
        if (user.log == req.body.log) {
            userIsAvailable = false
            break
        }
    }

    if (userIsAvailable == true) {
        users.push(newUser)
        console.log(users)
        res.send('Witaj ' + req.body.log + ', jesteś zarejestrowany.')
    } else {
        res.send('Login ' + req.body.log + ', jest już zarejestrowany.')
    }
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.post("/admin", function (req, res) {


    for (user of users) {
        if (user.log == req.body.log) {
            userExists = true
            foundUser = user
            break
        }
    }

    if (userExists == false) {
        res.send('Login ' + req.body.log + ' nie istnieje. Wpisz inny login.')
    } else {
        if (foundUser.pass == req.body.pass) {
            adminIsLogged = true
            res.sendFile(path.join(__dirname + "/static/admin_logged.html"))
        } else {
            res.send('Wpisano niepoprawne hasło dla użytkownika ' + req.body.log + '.')
        }
    }

})


app.get("/admin_logout", function (req, res) {
    adminIsLogged = false
    res.redirect("/")
})


app.get('/admin', function (req, res) {
    if (adminIsLogged == false) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/admin_logged.html"))
    }
})


function sort() {
    let html = [
        '<body style="margin: 10px 50px;padding: 0;font-family: sans-serif;background-color:#212121; color:white;">',
        '<header style="height: 30px;padding: 10px; margin-bottom:10px;display: flex;align-items: center;">',
        '<a href="/sort" style="font-weight: bold;margin-right: 10px;color:white;">sort</a>',
        '<a href="/gender" style="font-weight: bold;margin-right: 10px;color:white;">gender</a>',
        '<a href="/show" style="font-weight: bold;margin-right: 10px;color:white;">show</a>',
        '</header >',
        '<form onchange="this.submit()" action="/sort" method="POST">',
    ]

    if (order == "low to high") {
        html.push(
            '<input type="radio" name="kolejnosc" id="rosnaco" required value="rosnaco" checked><label for="rosnaco">rosnąco</label>',
            '<input type="radio" name="kolejnosc" id="malejaco" required value="malejaco"><label for="malejaco">malejąco</label>'
        )
    } else {
        html.push(
            '<input type="radio" name="kolejnosc" id="rosnaco" required value="rosnaco"><label for="rosnaco">rosnąco</label>',
            '<input type="radio" name="kolejnosc" id="malejaco" required value="malejaco" checked><label for="malejaco">malejąco</label>'
        )
    }

    html.push(
        '</form>',
        '<table style="width:100%;box-sizing:border-box">'
    )

    usersSorted = [...users]
    usersSorted.sort(function (a, b) {
        if (order == 'low to high') {
            return a.age - b.age;
        } else {
            return b.age - a.age;
        }
    })

    for (user of usersSorted) {
        html.push(
            '<tr>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">id: ' + user.id + '</td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">user: ' + user.log + ' - ' + user.pass + '</td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">wiek: ' + user.age + '</td>',
            '</tr>'
        )
    }
    html.push(
        '</table>',
        '</body>'
    )


    html = html.join('')
    return html
}

app.get('/sort', function (req, res) {
    if (adminIsLogged == true) {
        res.send(sort())
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

app.post('/sort', function (req, res) {
    if (adminIsLogged == true) {
        order = req.body.order
        res.send(sort())
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

function gender() {
    let html = [
        '<body style="margin: 10px 50px;padding: 0;font-family: sans-serif;background-color:#212121; color:white;">',
        '<header style="height: 30px;padding: 10px; margin-bottom:10px;display: flex;align-items: center;">',
        '<a href="/sort" style="font-weight: bold;margin-right: 10px;color:white;">sort</a>',
        '<a href="/gender" style="font-weight: bold;margin-right: 10px;color:white;">gender</a>',
        '<a href="/show" style="font-weight: bold;margin-right: 10px;color:white;">show</a>',
        '</header >',
        '<table style="width:100%;box-sizing:border-box">'
    ]



    for (user of users) {
        if (user.gender == 'k') {
            women.push(
                '<tr>',
                '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">id: ' + user.id + '</td>',
                '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">pleć: ' + user.gender + '</td>',
                '</tr>'
            )
        } else {
            men.push(
                '<tr>',
                '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">id: ' + user.id + '</td>',
                '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">pleć: ' + user.gender + '</td>',
                '</tr>'
            )

        }
    }
    html.push(
        women.join(''),
        '<tr style="height: 25px;"></tr>',
        men.join(''),
        '</table>',
        '</body>'
    )


    html = html.join('')
    return html
}

app.get('/gender', function (req, res) {
    if (adminIsLogged == true) {
        res.send(gender())
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

function show() {
    let html = [
        '<body style="margin: 10px 50px;padding: 0;font-family: sans-serif;background-color:#212121; color:white;">',
        '<header style="height: 30px;padding: 10px; margin-bottom:10px;display: flex;align-items: center;">',
        '<a href="/sort" style="font-weight: bold;margin-right: 10px;color:white;">sort</a>',
        '<a href="/gender" style="font-weight: bold;margin-right: 10px;color:white;">gender</a>',
        '<a href="/show" style="font-weight: bold;margin-right: 10px;color:white;">show</a>',
        '</header >',
        '<table style="width:100%;box-sizing:border-box">'
    ]


    for (user of users) {
        html.push(
            '<tr>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">id: ' + user.id + '</td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">user: ' + user.log + ' - ' + user.pass + '</td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">uczeń: <input type="checkbox" disabled ' + user.student + '></td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">wiek: ' + user.age + '</td>',
            '<td style="border:2px solid #c6b86f; border-radius: 4px; padding: 10px;">pleć: ' + user.gender + '</td>',
            '</tr>'
        )
    }
    html.push(
        '</table>',
        '</body>'
    )

    html = html.join('')

    return html
}

app.get('/show', function (req, res) {
    if (adminIsLogged == true) {
        res.send(show())
    } else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})