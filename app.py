from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

popular_df = pickle.load(open('popular.pkl', 'rb'))
pt = pickle.load(open('pt.pkl', 'rb'))
books = pickle.load(open('books.pkl', 'rb'))
similarity_scores = pickle.load(open('similarity_scores.pkl', 'rb'))

app = Flask(__name__)

@app.route('/')
def index():
    popular_df['avg_rating'] = popular_df['avg_rating'].round(1)
    return render_template(
        'index.html',
        book_name=list(popular_df['Book-Title'].values),
        author=list(popular_df['Book-Author'].values),
        image=list(popular_df['Image-URL-M'].values),
        votes=list(popular_df['num_ratings'].values),
        rating=list(popular_df['avg_rating'].values)
    )

@app.route('/recommend')
def recommend_ui():
    return render_template('recommend.html')

@app.route('/recommend_books', methods=['POST'])
def recommend():
    user_input = request.form.get('user_input')
    try:
        if user_input not in pt.index:
            raise ValueError(f"Book '{user_input}' not found. Please try a different book name.")
        
        index = np.where(pt.index == user_input)[0][0]
        similar_items = sorted(
            list(enumerate(similarity_scores[index])),
            key=lambda x: x[1], reverse=True
        )[1:5]

        data = []
        for i in similar_items:
            temp_df = books[books['Book-Title'] == pt.index[i[0]]]
            item = [
                temp_df.drop_duplicates('Book-Title')['Book-Title'].values[0],
                temp_df.drop_duplicates('Book-Title')['Book-Author'].values[0],
                temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values[0]
            ]
            data.append(item)

        return render_template('recommend.html', data=data)
    except ValueError as e:
        return render_template('recommend.html', error_message=str(e))
    except Exception as e:
        return render_template('recommend.html', error_message="An unexpected error occurred. Please try again.")

# 🔥 New Route for Autocomplete 🔥
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').lower()
    filtered_books = [book for book in pt.index if query in book.lower()]
    return jsonify(filtered_books[:10])  # Return max 10 suggestions

if __name__ == '__main__':
    app.run(debug=True)
