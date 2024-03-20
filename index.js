const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "libraray_database",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting to MySQL:" + err.stack);
    return;
  }
  console.log("Connected to MySQL as id" + connection.threadId);
});
app.get("/users", (req, res) => {
  connection.query(
    "select * from students order by studentId asc",
    (error, results) => {
      if (error) {
        console.log("Error executing query: " + error);
        res.status(500).send("Error retrieving users");
        return;
      }
      res.json(results);
    }
  );
});
app.post("/post", (req, res) => {
  const { studentId, firstname, surname, birthdate, gender, Class, point } =
    req.body;
  connection.query(
    "INSERT INTO students (studentID, firstname, surname, birthdate, gender, class, point) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [studentId, firstname, surname, birthdate, gender, Class, point],
    (error, results) => {
      if (error) {
        console.log("Error executing query: " + error);
        res.status(500).send("Error inserting student");
        return;
      }
      res.json(results);
    }
  );
});

// app.patch("/update/:studentId", (req, res) => {
//   const { studentId } = req.params;
//   const { firstname, surname } = req.body;
//   connection.query(
//     `update students set firstname="${firstname}",surname="${surname}" where studentId=${studentId}`,
//     [studentId, firstname, surname],
//     (error, results) => {
//       if (error) {
//         console.log("Error executing query: " + error);
//         res.status(500).send("Error updating student");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

app.patch("/update/:studentId", (req, res) => {
  const { studentId } = req.params;
  const { firstname, surname, birthdate, gender, Class, point } = req.body;

  // Check if the provided studentId matches the one in the request body
  if (Number(studentId) !== Number(req.body.studentId)) {
    return res
      .status(400)
      .json({ error: "Mismatched studentId in URL and body" });
  }

  // Build the SQL update query dynamically based on the fields provided in the request
  let updateQuery = "UPDATE students SET ";
  const updateFields = [];
  const fieldValues = [];

  if (firstname) {
    updateFields.push("firstname = ?");
    fieldValues.push(firstname);
  }

  if (surname) {
    updateFields.push("surname = ?");
    fieldValues.push(surname);
  }

  if (birthdate) {
    updateFields.push("birthdate = ?");
    fieldValues.push(birthdate);
  }

  if (gender) {
    updateFields.push("gender = ?");
    fieldValues.push(gender);
  }

  if (Class) {
    updateFields.push("class = ?");
    fieldValues.push(Class);
  }

  if (point) {
    updateFields.push("point = ?");
    fieldValues.push(point);
  }

  // Add the WHERE clause to specify the studentId
  updateQuery += updateFields.join(", ");
  updateQuery += " WHERE studentId = ?";
  fieldValues.push(studentId);

  // Execute the dynamic update query
  connection.query(updateQuery, fieldValues, (error, results) => {
    if (error) {
      console.log("Error executing query: " + error);
      res.status(500).send("Error updating student");
      return;
    }

    if (results.affectedRows === 0) {
      // No rows were affected, meaning the studentId was not found
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(results);
  });
});

// app.post("/UserRegister", (req, res) => {
//   const { userId, firstname, surname, email, password } = req.body;
//   connection.query(
//     `INSERT INTO register (userId,fisrtname, surname, email, password) VALUES (${userId},"${firstname}","${surname}","${email}","${password}")`,
//     [userId, firstname, surname, email, password],
//     (error, results) => {
//       if (error) {
//         console.log("Error executing query: " + error);
//         res.status(500).send("Error retrieving users");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

app.delete("/delete", (req, res) => {
  const { studentId } = req.body;
  connection.query(
    `DELETE FROM students where studentId=${studentId}`,
    [studentId],
    (error, results) => {
      if (error) {
        console.log("Error executing query: " + error);
        res.status(500).send("Error retrieving users");
        return;
      }
      res.json(results);
    }
  );
});
const PORT = 8080;
app.listen(PORT, () => console.log(`Running Express Server on Port ${PORT}!`));

// app.get('/people', (req, res) => {
//   connection.query('SELECT * FROM people INNER JOIN borrows ON people.peopleId = borrows.peopleId ORDER BY people.peopleId', (error, results) => {
//     if (error) {
//       console.error('Error executing query ' + error);
//       res.status(500).send('Error retrieving people');
//       return;
//     }
//     res.json(results);
//   });
// });

// app.get('/types', (req, res) => {
//   connection.query('SELECT * FROM types', (error, results) => {
//     if (error) {
//       console.error('Error executing query ' + error);
//       res.status(500).send('Error retrieving types');
//       return;
//     }
//     res.json(results);
//   });
// });

//   connection.query(INSERT INTO types (typeId, name) VALUES ('${typeId}', '${name}' ), (error, results) => {
//     if (error) {
//       console.error('Error executing query ' + error);
//       res.status(500).send('Error posting types');
//       return;
//     }
//     res.json(results);
//   });
// });

// app.post("/post", (req, res) => {
//   const { directorId, name, surname } = req.body;

//   connection.query(
//     "INSERT INTO directors (directorId, name, surname) VALUES (?, ?, ?)",
//     [directorId, name, surname],
//     (error, results) => {
//       if (error) {
//         console.error("Error executing query " + error);
//         res.status(500).send("Error posting directors");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

// app.post('/post_movies', (req, res) => {
//   const { movieId, name, length, point, directorId, typeId } = req.body;

//   connection.query(
//     INSERT INTO movies (movieId, name, length, point, directorId, typeId) VALUES ('${movieId}', '${name}', '${length}', '${point}', '${directorId}', '${typeId}'),
//     (error, results) => {
//       if (error) {
//         console.error('Error executing query ' + error);
//         res.status(500).send('Error posting movies');
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

// app.post('/post_movies_directors', (req, res) => {
//   const { movieId, name, length, point, typeId, directorId, directorName, directorSurname } = req.body;

//   connection.query(
//     INSERT INTO directors (directorId, name, surname) VALUES (?, ?, ?),
//     [directorId, directorName, directorSurname],
//     (errorDirectors, resultsDirectors) => {
//       if (errorDirectors) {
//         console.error('Error inserting into directors table:', errorDirectors);
//         res.status(500).send('Error posting movies and directors');
//         return;
//       }

//       connection.query(
//         INSERT INTO movies (movieId, name, length, point, directorId, typeId) VALUES (?, ?, ?, ?, ?, ?),
//         [movieId, name, length, point, directorId, typeId],
//         (errorMovies, resultsMovies) => {
//           if (errorMovies) {
//             console.error('Error inserting into movies table:', errorMovies);
//             res.status(500).send('Error posting movies and directors');
//             return;
//           }

//           console.log('Movies and directors inserted successfully');
//           res.status(200).send('Movies and directors inserted successfully');
//         }
//       );
//     }
//   );
// });

// app.patch('/patch_types', (req, res) => {
//   const { typeId, name } = req.body;

//   connection.query(UPDATE types SET name = ? WHERE typeId = ? , [name, typeId], (error, results) => {
//     if (error) {
//       console.error('Error executing query ' + error);
//       res.status(500).send('Error updating types');
//       return;
//     }
//     res.json(results);
//   });
// });

// app.patch("/patch", (req, res) => {
//   const { directorId, name, surname } = req.body;

//   connection.query(
//     "UPDATE directors SET name = ?, surname = ? WHERE directorId = ?",
//     [name, surname, directorId],
//     (error, results) => {
//       if (error) {
//         console.error("Error executing query " + error);
//         res.status(500).send("Error updating directors");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

// app.delete('/delete_types', (req, res) => {
//   const typeId = req.params.typeId;

//   connection.query('DELETE FROM types WHERE typeId = ?', [typeId], (error, results) => {
//     if (error) {
//       console.error('Error executing query ' + error);
//       res.status(500).send('Error deleting types');
//       return;
//     }
//     res.json(results);
//   });
// });

// app.delete("/delete/:directorId", (req, res) => {
//   const directorId = req.params.directorId;

//   connection.query(
//     "DELETE FROM directors WHERE directorId = ?",
//     [directorId],
//     (error, results) => {
//       if (error) {
//         console.error("Error executing query " + error);
//         res.status(500).send("Error deleting director");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });
