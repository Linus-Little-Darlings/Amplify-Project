# Amplify-Project
Amplify is a Spotify companion app meant to give you insights into your listening and visualize your music. 
We're using Node.js, Angular, and Three.js to create this experience - hope you enjoy :)

## Structure
Here we have the master branch. In addition to this, each team member (Max, Jake, Zora, Ella, Parker) have their own branch in which they work. There are a couple extra branches here and there, but in general, that is how all of our work is organized. Any html pages are in src/views, and our app.js is in the server folder. If you would like to get to our milestones, go back to the organization's main page and click into the milestones repo.

## How to Run/Test
The main node file is located in the server directory. However there is not a build method for the mongo server, which is only hosted locally on one of our machines.
To test our code, visit https://184.72.165.88:3000/#!/home, which is an elastic IP so it should not change. Your browser will warn you that the site is not secure, because we are using a self-signed certificate, but you can just click more details and continue to the site.
