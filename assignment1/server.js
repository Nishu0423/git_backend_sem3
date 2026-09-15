const http = require("http");
const fs = require("fs");

const PORT = 3000;

const server = http.createServer((req, res) => {

    // Home page
    if (req.method === "GET" && req.url === "/") {

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Records</title>
        </head>
        <body>

            <h1>Welcome to Student Record Management System</h1>

            <h2>Add Student</h2>

            <form method="POST" action="/add-student">

                <label>Student Name:</label>
                <input type="text" name="name" required>
                <br><br>

                <label>Roll Number:</label>
                <input type="text" name="roll" required>
                <br><br>

                <label>Course:</label>
                <input type="text" name="course" required>
                <br><br>

                <label>Email:</label>
                <input type="email" name="email" required>
                <br><br>

                <button type="submit">Add Student</button>

            </form>

            <br>

            <a href="/students">View Student Records</a>

        </body>
        </html>
        `;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    }


    // Add student
    else if (req.method === "POST" && req.url === "/add-student") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const data = new URLSearchParams(body);

            const student = {
                name: data.get("name"),
                roll: data.get("roll"),
                course: data.get("course"),
                email: data.get("email")
            };

            fs.readFile("students.json", "utf8", (err, fileData) => {

                let students = [];

                if (!err && fileData) {
                    students = JSON.parse(fileData);
                }

                students.push(student);

                fs.writeFile(
                    "students.json",
                    JSON.stringify(students, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            res.end("Error saving student record");
                            return;
                        }

                        res.writeHead(302, {
                            Location: "/students"
                        });

                        res.end();
                    }
                );
            });
        });
    }


    // Display students
    else if (req.method === "GET" && req.url === "/students") {

        fs.readFile("students.json", "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/html"
                });

                res.end("<h1>Error reading student records</h1>");
                return;
            }

            const students = JSON.parse(data);

            let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Records</title>
            </head>
            <body>

            <h1>Student Records</h1>

            <table border="1" cellpadding="10">

                <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Email</th>
                </tr>
            `;

            students.forEach((student) => {

                html += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.roll}</td>
                    <td>${student.course}</td>
                    <td>${student.email}</td>
                </tr>
                `;
            });

            html += `
            </table>

            <br>

            <a href="/">Add Another Student</a>

            </body>
            </html>
            `;

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(html);
        });
    }


    // Invalid route
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end("<h1>404 - Page Not Found</h1>");
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});