import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import StarIcon from "@mui/icons-material/Star";
import './App.css'

function BookCard({ sample_book }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        marginTop: "15px",
        padding: "5px",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          // border: "1px solid black",
          boxShadow: "0px 0px 15px grey",
          transform: "scale(1.03)"
        }
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={sample_book.image}
          alt="green iguana"
          sx={{
            objectFit: "contain",
            height: "250px",
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {sample_book.title}
          </Typography>
          <Typography>{sample_book.author}</Typography>
          <Typography
            component="div"
            sx={{
              display: "flex",
              height: "35px",
              alignItems: "center",
            }}
          >
            <StarIcon
              sx={{
                color: "#B8A200",
              }}
            />
            &nbsp;&nbsp;{sample_book.rating}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <a
          href={`https://www.amazon.in/s?k=${sample_book.title.replace(
            " ",
            "+"
          )}`}
          target="_blank"
        >
          <Button size="small" color="primary">
            Get buy link
          </Button>
        </a>
      </CardActions>
    </Card>
  );
}

export default BookCard;
