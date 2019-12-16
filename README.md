# Amplify-Project
Amplify is a Spotify companion app meant to give you insights into your listening and visualize your music. 
We're using Node.js, Angular, and Three.js to create this experience - hope you enjoy :)

## Structure
Here we have the master branch. In addition to this, each team member (Max, Jake, Zora, Ella, Parker) have their own branch in which they work. There are a couple extra branches here and there, but in general, that is how all of our work is organized. Any html pages are in src/views, and our app.js is in the server folder. If you would like to get to our milestones, go back to the organization's main page and click into the milestones repo.

## How to Run/Test
The main node file is located in the server directory. However there is not a build method for the mongo server, which is only hosted locally on one of our machines.
To test our code, visit https://184.72.165.88:3000/#!/home, which is an elastic IP so it should not change. Your browser will warn you that the site is not secure, because we are using a self-signed certificate, but you can just click more details and continue to the site.

## Test Cases
Before accessing anything inside the application, you will need to register an account. The page should default to Login when not signed in, so if this is your first time visiting you will have to click register to create a new user. There is no special validation for email or password, they just cannot be empty. Then the app will take you to the home page. 
Next, you will need to click Connect Spotify, and log in with a valid spotify account. When this is done, you will have to sign back into the Amplify app through the login page, which is a UI flow we may fix in the future (store session data better).
Once logged some data will populate the page, including some of your top songs recently.
Visit the metrics page to see a larger list of various data metrics involving your library.
To use the visualizer, you can try clicking one of your songs on the home page, but occasionally this doesn't work due to authorization taking place out-of-sequence. If this doesn't work, try playing a song on your spotify account (either from your phone or desktop app) and refresh the amplify page.
The music visualizer will spin according to tempo and the colors will change based of valance, energy, and dancablility throughout the song.
