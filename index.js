const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "goodreads.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get Books API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      book
    ORDER BY
      book_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//Get Book API
app.get("/books/:Id/", async (request, response) => {
  const { Id } = request.params;
  const getBookQuery = `SELECT * FROM book WHERE Book_id=${Id}`;
  const book = await db.get(getBookQuery);
  response.send(book);
});
//API for create book
app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;
  const dbresponse = await db.run(addBookQuery);
  const bookID = dbresponse.lastID;
  response.send({ bookID: bookID });
});
//API FOR UPDATE
app.put("/books/:Id/", async (request, response) => {
  const { Id } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price= ${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${Id};`;
  const updated = await db.run(updateBookQuery);
  response.send("book updated successfully");
});
//API FOR DELETE
app.delete("/books/:Id/", async (request, response) => {
  const { Id } = request.params;
  const deleteBookQuery = `
    DELETE FROM
        book
    WHERE
        book_id = ${Id};`;
  const deleted = await db.run(deleteBookQuery);
  response.send("Deleted successfully");
});
//API TO GET AUTHOR ALL BOOKS
app.get("/authors/:Id/books/", async (request, response) => {
  const { Id } = request.params;
  const authorAllbookQuerie = `SELECT * FROM book WHERE author_id=${Id}`;
  const authorBooks = await db.all(authorAllbookQuerie);
  response.send(authorBooks);
});
