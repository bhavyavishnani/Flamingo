from flask import Flask, jsonify, request
import os

app = Flask(__name__)

detectedWord = ["bird","dog", "cat", "house"]

stories = [
    {"id": "1", "user": "Your story", "img": "https://randomuser.me/api/portraits/men/1.jpg", "show": "true"},
    {"id": "2", "user": "aesha_28_", "img": "https://randomuser.me/api/portraits/women/45.jpg", "show": "true"},
    {"id": "3", "user": "randomly.bhavya", "img": "https://randomuser.me/api/portraits/men/32.jpg", "show": "true"},
    {"id": "4", "user": "ritu_chauhan711", "img": "https://randomuser.me/api/portraits/women/28.jpg", "show": "true"},
    {"id": "5", "user": "jani_jagrat", "img": "https://randomuser.me/api/portraits/men/15.jpg", "show": "true"}
]

adsStory = [
    {"id": "11", "user": "Sponsered", "img": "https://img.freepik.com/premium-vector/birds-banner-design-facebook-banner-design-fb-post-design-ads-design-birds-ads-design_585740-47.jpg", "show": "false"},
    {"id": "22", "user": "Sponsered", "img": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dog-food-ads-design-template-789d7b7857c76d145a268f44085dd98c_screen.jpg?ts=1650357822", "show": "false"},
    {"id": "33", "user": "Sponsered", "img": "https://i.pinimg.com/originals/e0/be/24/e0be24141974cd0577ea7f443d617069.jpg", "show": "false"},
    {"id": "44", "user": "Sponsered", "img": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dream-house-ads-design-template-914cf2a8bc013ed1e37e8cc3e0f09265_screen.jpg?ts=1650964341", "show": "false"},
]


adsPosts = [
    {
        "id": "12",
        "user": "Sponsered",
        "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_ZYG46UzTwTMwEIdLGB5yKIk_t8U5fBC4A&s",
        "img": "https://img.freepik.com/premium-vector/birds-banner-design-facebook-banner-design-fb-post-design-ads-design-birds-ads-design_585740-47.jpg",
        "likes": 89,
        "caption": "Birds Caring",
        "time": "AD",
        "comments": 17,
        "show": "true"
    },
    {
        "id": "23",
        "user": "Sponsered",
        "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_ZYG46UzTwTMwEIdLGB5yKIk_t8U5fBC4A&s",
        "img": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dog-food-ads-design-template-789d7b7857c76d145a268f44085dd98c_screen.jpg?ts=1650357822",
        "likes": 75,
        "caption": "Dog Stuffs",
        "time": "AD",
        "comments": 12,
        "show": "true"
    },
    {
        "id": "34",
        "user": "Sponsered",
        "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_ZYG46UzTwTMwEIdLGB5yKIk_t8U5fBC4A&s",
        "img": "https://i.pinimg.com/originals/e0/be/24/e0be24141974cd0577ea7f443d617069.jpg",
        "likes": 169,
        "caption": "Cat Caring",
        "time": "AD",
        "comments": 41,
        "show": "true"
    },
    {
        "id": "45",
        "user": "Sponsered",
        "profileImg": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_ZYG46UzTwTMwEIdLGB5yKIk_t8U5fBC4A&s",
        "img": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dream-house-ads-design-template-914cf2a8bc013ed1e37e8cc3e0f09265_screen.jpg?ts=1650964341",
        "likes": 204,
        "caption": "Dream House",
        "time": "AD",
        "comments": 37,
        "show": "true"
    }
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
        "comments": 5,
        "show": "true"
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
        "show": "true"
    },

    {
        "id": "4",
        "user": "bob",
        "profileImg": "https://randomuser.me/api/portraits/men/32.jpg",
        "img": "https://picsum.photos/500/500?random=2",
        "likes": 95,
        "caption": "City lights never fail to amaze!",
        "time": "5h",
        "comments": 3,
        "show": "true"
    }
]

if "cat" in detectedWord:
    posts.insert(2, adsPosts[2])

elif "dog" in detectedWord:
    stories.insert(2, adsStory[1])



@app.route('/api/stories', methods=['GET'])
def get_stories():
    return jsonify(stories)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    # Ensure the uploads directory exists
    upload_folder = "./uploads"
    os.makedirs(upload_folder, exist_ok=True)

    # Save the uploaded file
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)

    return jsonify({"message": "Audio uploaded successfully!"}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)