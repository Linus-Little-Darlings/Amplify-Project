# Amplify-Project
Amplify is a Spotify companion app meant to give you insights into your listening and visualize your music. 
We're using Node.js, Angular, and Three.js to create this experience - hope you enjoy :)

## Structure
Here we have the master branch. In addition to this, each team member (Max, Jake, Zora, Ella, Parker) have their own branch in which they work. There are a couple extra branches here and there, but in general, that is how all of our work is organized. Any html pages are in src/views, and our app.js is in the server folder. If you would like to get to our milestones, go back to the organization's main page and click into the milestones repo.

## How to Run/Test
To deploy Amplify, we used Amazon Web Services under an EC2-instance. Throughout the project, we ran node via terminals connected to the instance to make the sites live, and it is now permanently deployed by our main node file located in the server directory. However, there is not a build method for the mongo server - it is hosted locally on one of our machines. 

To test our code, visit https://184.72.165.88:3000/#!/home in an incognito tab (eliminates some of the ad-blocker issues). This is an elastic IP so it should not change. The browser will warn the user that the site is not secure because we are using a self-signed certificate, so continue by clicking on “More Details” and continue to the site.

## Test Cases
Before accessing anything inside the application, you will need to register an account. The page should default to login when not signed in, so if this is your first time visiting you will have to click register to create a new user. 
1. Enter an email and password. There is no special validation for email or password, they just cannot be empty. 
2. The app will take you to the home page. Click the “Connect Spotify” button in the upper right hand corner, and log in with a valid Spotify account. 
3. When this is done, you will have to sign back into the Amplify app through the login page, which is a UI flow we may fix in the future. 
 
 
Once logged some data will populate the page, including some of the user’s top songs recently. Visit the metrics page to see a larger list of various data metrics involving the user’s library. To use the visualizer, click one of the songs on the home page.Due to some out-of-sequence authorization with the Spotify API, this is occasionally faulty.  If this doesn't work, playing a song on the user’s Spotify account (either via phone or desktop app) and refreshing the page will start the animation in the center of the screen. The music visualizer will spin according to tempo and the colors will change based on valence, energy, and danceability throughout the song.



