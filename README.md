# Movies

This program takes an actor's name, scraps Wikipedia for their list of movies, and then queries the Mojo Box Office api to get
the domestic (I think) box office earnings for each movie

I ran into programs in the Mojo Box Office naming scheme (Ex: The Avengers: Age of Ultron is avenger2 in Mojo)
To fix this issue would require me having my own database for looking up each movie alias, and at that point I might as well
keep the box office info myself - contradicting the point of the app
