
const http = require('http');
const fs = require('fs');

const PORT = 3000;

// Create HTTP Server
const server = http.createServer((req, res) => {

    // Display HTML Form
    if (req.url === '/' && req.method === 'GET') {

        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Records</title>
            </head>
            <body>
                <h1>Welcome to Student Record Management</h1>

                <form action="/add-student" method="POST">

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
                <a href="/students">View All Students</a>

            </body>
            </html>
        `);
    }

    // Receive and Store Student Data
    else if (req.url === '/add-student' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            const formData = new URLSearchParams(body);

            const student = {
                name: formData.get('name'),
                roll: formData.get('roll'),
                course: formData.get('course'),
                email: formData.get('email')
            };

            // Read existing records
            fs.readFile('students.json', 'utf8', (err, data) => {

                let students = [];

                if (!err && data.trim() !== '') {
                    students = JSON.parse(data);
                }

                students.push(student);

                // Save updated records
                fs.writeFile(
                    'students.json',
                    JSON.stringify(students, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500);
                            return res.end('Error saving student record');
                        }

                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });

                        res.end(`
                            <h2>Student Added Successfully!</h2>
                            <a href="/">Add Another Student</a>
                            <br><br>
                            <a href="/students">View Students</a>
                        `);
                    }
                );
            });
        });
    }

    // Display All Student Records
    else if (req.url === '/students' && req.method === 'GET') {

        fs.readFile('students.json', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500);
                return res.end('Unable to read student records');
            }

            const students = JSON.parse(data || '[]');

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            let html = `
                <h1>Student Records</h1>
                <table border="1" cellpadding="10">
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Course</th>
                        <th>Email</th>
                    </tr>
            `;

            students.forEach(student => {
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
                <a href="/">Go Back</a>
            `;

            res.end(html);
        });
    }

    // Handle Invalid Routes
    else {
        res.writeHead(404);
        res.end('Page Not Found');
    }

});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
