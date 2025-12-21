from flask import Flask, render_template, request, jsonify
import json, os

app = Flask(__name__)
DATA_FILE = 'cards.json'

def load_cards():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_cards(cards):
    with open(DATA_FILE, 'w') as f:
        json.dump(cards, f)

cards = load_cards()


@app.route('/')
def index():
    return render_template('index.html', cards=cards)


@app.route('/add_card', methods=['POST'])
def add_card():
    data = request.json
    card = {
        'id': max([c['id'] for c in cards], default=0) + 1,
        'color': data['color'],
        'name': data['name'],
        'desc': data['desc'],
        'status': 'not_started'
    }
    cards.append(card)
    save_cards(cards)
    return jsonify(card)

@app.route('/move_card', methods=['POST'])
def move_card():
    data = request.json
    for c in cards:
        if c['id'] == data['id']:
            c['status'] = data['status']
            break
    save_cards(cards)
    return jsonify({'success': True})

@app.route('/delete_card', methods=['POST'])
def delete_card():
    data = request.json
    global cards
    cards = [c for c in cards if c['id'] != data['id']]
    save_cards(cards)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
