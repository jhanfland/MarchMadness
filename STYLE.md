Style Guide:

Naming: snake_case (use_this_naming_convention)

Comments: Remember to Comment
    - TODO:

Commit message format: 
    - fix: 
    - update:
    - added:
    - completed:

******************************************************
Backend: Python

Variables:
db: Located in __init__.py, it is used as our connection to our MySQLDatabase
app: Located in run.py, it stores a refectence to our main Flask application

Modules: Record modules we use and describe their funtionality
backend\app:
    - __init__.py: Initiates the db variable that will be used as our main connection to the database
    as well as provides a function that initialized a Flask appliction  

backend\app\models:
    - bet.py: Models a bet object that is associated with a game and a user object
    - game.py: Modles a game object that will be used in our bracket
    - user.py: Models a user that has been regiestered in our database

backend\app\routes:
    - auth.py: Contains many API endpoints that are neccessary for user authentication
    - main.py: Contains a few dummy routes

******************************************************
Frontend: React

Variables:

Modules: Record modules we use and describe their funtionality
frontend-mm_app\src:
    - App.tsx: Main app component that containts references to different paged like signup page, login
    page, and bracket page
    - index.css: provides css for root component
    - main.tsx: created root component for App.tsx

frontend-mm_app\src\Pages:
    - Bracket.tsx: Will eventually handle frontend logic of the bracket as well as displays the coentent of the page 
    - Homepage.tsx: Handles frontend logic of the homepage as well as displays the coentent of the page 
    - Login-Form.tsx: Handles frontend logic of the login form as well as displays the coentent of the page 
    - Signup-Form.tsx: Handles frontend logic of the signup form as well as displays the coentent of the page 

frontend-mm_app\src\components\ui:
    - button.tsx, card.tsx, input.tsx, label.tsx, popover.tsx: Handles logic of respective frontend elements

******************************************************

Testing: Record tests here and describe what cases are being tested

backend.test.ts: Located in src\integration-tests\tests, Jest is used to test the API calls and ensure that
they return the correct message and the correct error code.

test_user_auth_backend.py: located in test/src, these are tests using pytest that also ensure that API calls are
functioning properly.

Login_Form.test.tsx, Signup-Form.test.tsx: Located in src\frontend-mm_app\src\components\tests, these tests simulate basic 
user submissions to each respective page and make sures that the correct information is stored as well as ensuring that the correct elements were rendered.