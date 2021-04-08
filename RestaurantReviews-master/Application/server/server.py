from flask import Flask, redirect, request, url_for, render_template, make_response, jsonify
import pandas as pd
import numpy as np
import pickle
import re
import nltk
from flask_cors import CORS
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

def preprocess(input_dic):
    new_review = input_dic['0']
    new_review = re.sub('[^a-zA-Z]', ' ', new_review)
    new_review = new_review.lower()
    new_review = new_review.split()
    ps = PorterStemmer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')
    new_review = [ps.stem(word) for word in new_review if not word in set(all_stopwords)]
    new_review = ' '.join(new_review)
    new_corpus = [new_review]
    return new_corpus

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=["POST"])
def predict_page():
    dic = request.form
    #Preprocess user inputs
    corpus = preprocess(dic)
    print(corpus)
    
    #Model prediction
    #Load the model
    filename = 'D:\\Projects\\Sentiment Analysis\\RestaurantReviews-master\\Application\\models\\tuple_model.pkl'
    model, score = pickle.load(open(filename, 'rb'))
    #Load the count vectorizer
    filename = 'D:\\Projects\\Sentiment Analysis\\RestaurantReviews\\Application\\models\\cntvect.pickle'
    cntvect = pickle.load(open(filename, 'rb'))
    X = cntvect.transform(corpus).toarray()
    y_pred = model.predict(X)

    #Response
    resp = {}
    resp['review'] = dic['0']
    if(y_pred[0] == 1):
        resp['result'] = 'The review is Positive.' 
        resp['color'] = 'green'
    else:
        resp['result'] = 'The review is Negative.'
        resp['color'] = 'red'
    resp['score'] = score
    print(resp)
    response = make_response(jsonify(resp), 200)
    response.headers['Content-Type'] = 'application/json'
    response.headers.add('Access-Control-Allow-Origin', 'localhost')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    print(response)
    return response

if __name__ == '__main__':
    app.run()