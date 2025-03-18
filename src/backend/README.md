

## File Structure

app/models - contains SQL alchemy classes for each table (data layer)
app/routes - contains actual route logic (controller layer)
app/__init__.py contains init logic
app/error_handler contains error set up

run.py - entry point for app
config.py  - config and env vars


## Endpoints

# Default
# /

"Hello world"

returns on success:
{
    "message": "Hello, World!"
}

# Register - register a new account into DB
# /auth/register 

body: 
{
    "email" : "example@gmail.com",
    "password" : "password"
}

return on success:
{
    "message": "User registered",
    "user": {
        "email": "example@gmail.com",
        "password": "password"
    }
}

return on fail - this needs to be fixed

{
    "message": "Internal Server Error"
}

# Login - login with existing credentials
# /auth/login

body: 
{
    "email" : "example@gmail.com",
    "password" : "password"
}

returns on success:

{
    "message": "Login successful",
    "token": "generated_token_id"
}

on fail:
{
    "message": "Invalid credentials"
}



#  How to test

localhost:8000{endpoint}

example:  
in postman
GET localhost:8000/

POST localhost:8000/auth/login
body:
{
    "email" : "example@gmail.com",
    "password" : "password"
} 
