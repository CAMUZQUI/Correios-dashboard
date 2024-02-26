import os
from flask import Flask, render_template

app = Flask(__name__)

# API_KEY en variables de entorno
API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

@app.route('/')
def home():    
    return render_template('index.html', API_KEY=API_KEY)

if __name__ == '__main__':
    app.run(debug=False, use_reloader=False)
    ## Reemplaza '192.168.X.X' con tu dirección IP real o usa '0.0.0.0'
    # app.run(host='0.0.0.0', port=5000)
