# Imports
from flask_login import UserMixin
from db import get_db

# Class that represents a user and handles the Flask-Login integration
class User(UserMixin):
    def __init__(self, _id, name, email, profile_picture):
        """
        Initialize a User object.

        Args:
            _id (str): Unique user ID (usually provided by OAuth).
            name (str): User name.
            email (str): User email address.
            profile_picture (str): URL of the user's profile picture.
        """
        self.id = _id
        self.name = name
        self.email = email
        self.profile_picture = profile_picture

    @staticmethod
    def get(user_id):
        """
        Get a user from the database by its ID.

        Args:
            user_id (str): Unique ID of the user to look up.

        Returns:
            User | None: A User object if found in the database,
                         otherwise None.
        """
        # Get the database connection
        db = get_db()

        # Run the query to find the user by ID
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", (user_id,)
        ).fetchone()

        # If the user does not exist, return None
        if not user:
            return None

        # Create a User object from the database data
        user = User(
            _id=user[0], name=user[1], email=user[2], profile_picture=user[3]
        )

        return user

    @staticmethod
    def create(_id, name, email, profile_picture):
        """
        Create a new user in the database and return the User object.

        Args:
            _id (str): Unique user ID.
            name (str): User name.
            email (str): User email address.
            profile_picture (str): URL of the profile picture.

        Returns:
            User: The newly created User object.
        """
        # Get the database connection
        db = get_db()

        # Insert the user into the 'user' table
        db.execute(
            "INSERT INTO user (id, name, email, profile_picture) VALUES(?, ?, ?, ?)",
            (_id, name, email, profile_picture),
        )
        db.commit()

        # Return the created User object
        return User(_id=_id, name=name, email=email, profile_picture=profile_picture)
