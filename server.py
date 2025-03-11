from flask import Flask, jsonify

app = Flask(__name__)



stories = [
    {"id": "1", "user": "Your story", "img": "https://randomuser.me/api/portraits/men/1.jpg", "isUser": True},
    {"id": "2", "user": "aesha_28_", "img": "https://randomuser.me/api/portraits/women/45.jpg"},
    {"id": "3", "user": "randomly.bhavya", "img": "https://randomuser.me/api/portraits/men/32.jpg"},
    {"id": "4", "user": "ritu_chauhan711", "img": "https://randomuser.me/api/portraits/women/28.jpg"},
    {"id": "5", "user": "jani_jagrat", "img": "https://randomuser.me/api/portraits/men/15.jpg"}
]


posts = [
    {
        "id": "1",
        "user": "alice",
        "profileImg": "https://randomuser.me/api/portraits/women/45.jpg",
        "img": "https://picsum.photos/500/500?random=1",
        "likes": 120,
        "caption": "Enjoying the beauty of nature!",
        "time": "2h",
        "comments": 5
    },
    {
        "id": "2",
        "user": "bob",
        "profileImg": "https://randomuser.me/api/portraits/men/32.jpg",
        "img": "https://picsum.photos/500/500?random=2",
        "likes": 95,
        "caption": "City lights never fail to amaze!",
        "time": "5h",
        "comments": 3,
    },
    {
        "id": "3",
        "user": "Sponsered",
        "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_ZYG46UzTwTMwEIdLGB5yKIk_t8U5fBC4A&s",
        "img": "https://images.jdmagicbox.com/v2/comp/ahmedabad/h3/079pxx79.xx79.240730160128.f3h3/catalogue/coffee-culture-the-ristorante-lounge-ahmedabad-coffee-shops-jppz7i4ot6.jpg",
        "likes": 69,
        "caption": "The Bunkers",
        "time": "AD",
        "comments": 7
    },
    {
        "id": "4",
        "user": "bob",
        "profileImg": "https://randomuser.me/api/portraits/men/32.jpg",
        "img": "https://picsum.photos/500/500?random=2",
        "likes": 95,
        "caption": "City lights never fail to amaze!",
        "time": "5h",
        "comments": 3
    }
]



@app.route('/api/stories', methods=['GET'])
def get_stories():
    return jsonify(stories)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)