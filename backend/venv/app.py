from flask import Flask, request, jsonify
from exa_py import Exa
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Cross-origin request from React

EXA_API_KEY = os.getenv("EXA_API_KEY")

exa = Exa(EXA_API_KEY)

@app.route('/search', methods=['GET'])

def search():
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error":"Query parameter is missing!"}),400
    
    response = exa.search(
        query,
        num_results = 10,
        type='keyword',
        include_domains=['https://www.tiktok.com']
        
    )
    results = [{'title': result.title, 'url': result.url,'author': result.author,} for result in response.results]
    
    return jsonify({'results':results})

if __name__=='__main__':
    app.run(debug=True)