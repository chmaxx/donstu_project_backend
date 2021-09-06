from flask import Flask;

app = Flask(__name__)


# Members API Route
@app.route("/members")
def members():
    return {
        "member_count": 3,
        "members": ["Member 1", "Member 2", "Member 3"]
            }


if __name__ == "__main__":
    app.run()
