import './App.css'
import axios from 'axios'

async function getPopularBooks() {
  let data: any = await axios.get("http://127.0.0.1:5000")
  console.log(data)
  return data
}

async function getRecommendation(event: any) {
  event.preventDefault()
  let input: string = event.target[0].value
  let data: object = {
    inputBook: input
  }
  let recommenddedBook = await axios.post("http://127.0.0.1:5000/recommend_books", data)
  console.log(recommenddedBook.data)
}

function App() {
  return (
    <>
    <button onClick={getPopularBooks}>Test index route</button>
    <form action="" onSubmit={getRecommendation}>
      <input type="text" required/>
      <button type='submit'>Test recommend route</button>
    </form>
    </>
  )
}

export default App
