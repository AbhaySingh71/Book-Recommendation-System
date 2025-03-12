from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

popular_df = pickle.load(open('popular.pkl', 'rb'))
pt = pickle.load(open('pt.pkl', 'rb'))
books = pickle.load(open('books.pkl', 'rb'))
similarity_scores = pickle.load(open('similarity_scores.pkl', 'rb'))

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    popular_df['avg_rating'] = popular_df['avg_rating'].round(1)
    data = {
        "books": [
            {
                "title": row["Book-Title"],
                "author": row["Book-Author"],
                "image": row["Image-URL-M"],
                "votes": row["num_ratings"],
                "rating": row["avg_rating"]
            }
            for _, row in popular_df.iterrows()
        ]
    }
    return jsonify(data)

@app.route('/recommend_books', methods=['POST'])
def recommend():
    print(request.json)
    user_input = request.json.get('inputBook')

    try:
        if user_input not in pt.index:
            return jsonify({"error": f"Book '{user_input}' not found. Please try a different book name."}), 404
        
        # Find similar books
        index = np.where(pt.index == user_input)[0][0]
        similar_items = sorted(
            list(enumerate(similarity_scores[index])),
            key=lambda x: x[1], reverse=True
        )[1:5]  # Exclude the first (itself)

        recommendations = []
        for i in similar_items:
            temp_df = books[books['Book-Title'] == pt.index[i[0]]]
            recommendations.append({
                "title": temp_df.drop_duplicates('Book-Title')['Book-Title'].values[0],
                "author": temp_df.drop_duplicates('Book-Title')['Book-Author'].values[0],
                "image": temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values[0]
            })

        return jsonify({"recommendations": recommendations})
    
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)
