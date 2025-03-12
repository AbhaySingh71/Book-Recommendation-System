import "./App.css";
import axios from "axios";
import { BoxReveal } from "@/components/magicui/box-reveal";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { topBooks } from "./books";
import { useState } from "react";
import BookCard from "./BookCard";

function App() {
  async function getPopularBooks() {
    let data: any = await axios.get("https://bookverse-server.onrender.com")
    setBooks(data.data.books);
    return data.data.books;
  }
  type Book = {
    author: string
    title: string
    rating: number
    image: string
  };

  let [books, setBooks] = useState<Book[]>([]);
  let [loadBooks, setLoadBooks] = useState(true);
  let [errorMsg, setErrorMsg] = useState("")
  if (books.length == 0 && loadBooks) {
    getPopularBooks();
  }

  async function getRecommendation(event: any) {
    setBackBut(true);
    event.preventDefault();
    let input: string = initSearchVal;
    let data: object = {
      inputBook: input,
    };
    let responseStatus: number = 200;
    let recommenddedBook = await axios
      .post("https://bookverse-server.onrender.com/recommend_books", data)
      .catch((e) => {
        responseStatus = e.status;
        setErrorMsg(e.response.data.error)
      });
    setSearchVal("");
    if (responseStatus == 200) {
      console.log((recommenddedBook as any).data.recommendations)
      setMainHead(["The", "Recommendations"])
      setBooks((recommenddedBook as any).data.recommendations)
      setLoadBooks(true)
    } else {
      setBooks([])
      setLoadBooks(false)
    }
  }

  function backToHome() {
    setBackBut(false)
    getPopularBooks()
    setLoadBooks(true)
    setMainHead(["Top 50 books", "according to rating"])
  }

  function changeSearchVal(newVal: string) {
    if (newVal == undefined) {
      setSearchVal("");
    } else {
      setSearchVal(newVal);
    }
  }

  let [backBut, setBackBut] = useState(false);
  let [mainHead, setMainHead] = useState([
    "Top 50 books",
    "according to rating",
  ]);
  let [initSearchVal, setSearchVal] = useState("");

  return (
    <>
      <div className="main-page">
        <img
          src="https://i.ibb.co/SwStW5Tz/Screenshot-2025-03-11-211430.png"
          alt="BookVerse"
          style={{
            height: "80px",
            position: "absolute",
            top: "10px",
            left: "10px",
          }}
        />
        <div className="main-heading-box">
          {mainHead.map((text, index) => (
            <BoxReveal
              key={text + index}
              boxColor={"#5046e6"}
              duration={0.5 + index * 0.4}
            >
              <p className="main-heading text-[3.5rem] font-semibold">{text}</p>
            </BoxReveal>
          ))}
        </div>
        <br />
        <form onSubmit={getRecommendation}>
          <div className="search-box">
            {backBut ? (
              <button
                style={{
                  backgroundColor: "white",
                  color: "black",
                }}
                onClick={backToHome}
                type="button"
              >
                Back to Home
              </button>
            ) : null}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Autocomplete
              freeSolo
              options={topBooks}
              value={initSearchVal}
              onChange={(event) => changeSearchVal((event.target as HTMLElement).innerText)}
              sx={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(event) => changeSearchVal(event.target.value)}
                  label="Tell your favourite book"
                  required
                />
              )}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button
              type="submit"
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              Recommend
            </button>
          </div>
        </form>
        <hr />
        <div className="books-grid row row-cols-2">
          {books.length !== 0 ? (
            books.map((el) => <BookCard sample_book={el} />)
          ) : (
            <div>""</div>
          )}
        </div>
        {loadBooks ? null : (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
