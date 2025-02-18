# Research Report
## Intro to Flask
### Summary of Work
I researched how to install and use the basic functionality of Flask. I read several sources that explained how to use this framework and then I used this knowledge in order to create a basic application.
### Motivation
For our project, we determined that Flask would be good to use as a backend framework. In order to contribute to the project, I needed to learn the basics of Flask and how it will be able to interact with the MySQL database.
### Time Spent
~15 minutes installing Flask and setting up an environment
~105 minutes reading tutorials as well and coding
### Results
From the Flask website I learned how to install and set up an environment for a flask project.
To do this, I used the following commands:
```shell
py -3 -m venv .venv
.venv\Scripts\activate


pip install Flask
```
The first two commands create a .venv file and activate the environment and the last command installs Flask.


I used information from the Flask website and the Flask tutorial from DigitalOcean to create a simple application that displays a webpage that reads information from a .css file and an html file.


Main program that creates the the web application so it can be seen on port 5000 and reads information from the html file (index.html).
```python
from flask import Flask, render_template


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')
```


html file that links to the css file and provides frontend information to be displayed.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{ url_for('static', filename= 'css/style.css') }}">
    <title>I am Learning Flask</title>
</head>
<body>
   <h1>Lance's Attempt at Flask</h1>
   <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
   </ul>
</body>
</html>


```


css file that stylizes the information provided on the html file by providing a boarder, color, font, text alighting, and padding.
```css
h1 {
    border: 2px #eee solid;
    color: brown;
    text-align: center;
    padding: 10px;
}


body {
    border: 10px #fff;
    color: blue;
    font-family: "Helvetica", serif;
}
```
Once you have the structure of your Flask application, you can run it with the command:
```shell
flask --app test run

```
You can replace “test” with the name of the main .py file to run the program and it should provide a link that you can copy into a web browser to see the program. The program should run locally and be on port 5000 by default. The link should be similar to http://127.0.0.1:5000/1 and now you should be able to display the web application. In order to stop running the application, press Ctrl + C in the terminal to terminate it.


### Sources
- Flask setup and instal tutorial [^1]
- Flask Basics[^2]
[^1]: https://flask.palletsprojects.com/en/stable/quickstart/#accessing-request-data
[^2]:https://www.digitalocean.com/community/tutorials/how-to-make-a-web-application-using-flask-in-python-3




