import './App.css'
import axios from 'axios'
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { topBooks } from './books';
import { useState } from 'react';


async function getPopularBooks() {
  let data: any = await axios.get("http://127.0.0.1:5000")
  console.log(data)
  return data
}

function App() {

  async function getRecommendation(event: any) {
    setShowMainHead(false)
    setBakcBut(true)
    event.preventDefault()
    let input: string = event.target[0].value
    let data: object = {
      inputBook: input
    }
    let recommenddedBook = await axios.post("http://127.0.0.1:5000/recommend_books", data)
    console.log(recommenddedBook.data)
  }
  
  function backToHome() {
    setShowMainHead(true)
    setBakcBut(false)
  }

  let [showMainHead, setShowMainHead] = useState(true)
  let [backBut, setBakcBut] = useState(false)

  return (
    <>
      <div className="main-page">
    {
      (showMainHead)? (
          <div className="main-heading-box">
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
              <p className="main-heading text-[3.5rem] font-semibold">
                Top 50 books
              </p>
            </BoxReveal>
            <BoxReveal boxColor={"#5046e6"} duration={0.9}>
              <p className="main-heading text-[3.5rem] font-semibold">
                according to rating
              </p>
            </BoxReveal>
          </div>
      ) : null
    }
      <br />
      <form onSubmit={getRecommendation}>
        <div className="search-box">
          {
            (backBut) ? (
              <Button style={{
                backgroundColor: "white",
                color: "black"
              }}
              onClick={backToHome}
              type='button'>Back to Home</Button>
            ) : null
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
        <Autocomplete
          freeSolo
          options={topBooks}
          sx={{ width: 400 }}
          renderInput={(params) => <TextField {...params} label="Tell your favourite book" />}
        /> &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type='submit'>Recommend</Button>
        </div>
      </form>

      </div>
    </>
  );
}

export default App
