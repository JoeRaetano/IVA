IVA - Front End System :oncoming_automobile:
========================================

Install/Setup/Learning Notes
---------------------

:bowtie: UTK students go to: https://oit.utk.edu/Training/online-training/lynda/Pages/default.aspx for free training.
Search and complete Lynda training for (MongoDB, Expressjs, Angularjs, Nodejs (MEAN Stack)), Git, GitHub, Webprogramming HTML5, CSS, javascript.

:one: GitHub https://github.com/
  - Before you clone this repository on your machine, learn GitHub.
  - What is GitHub? GitHub is a free code version control portal to assist in working in teams.
  - Create an account on GitHub
  - Learn GitHub
    - https://help.github.com/
    - https://training.github.com/kit/
  - Learn Git http://git-scm.com/book/en/v2
  - Learn Markdown basics to edit this README.md file https://help.github.com/articles/markdown-basics/
  - Learn GitHub flavored Markdown https://help.github.com/articles/github-flavored-markdown/
  - Learn Special writing on GitHub https://help.github.com/articles/writing-on-github/
    :eyes:  http://www.emoji-cheat-sheet.com/
  - Install GitHub on your machine
    - Clone IVA Repo into a local folder called IVA
    - ensure you synchronize your local cloned repository with the master before you make any new edits.

:two: Webstorm IDE https://www.jetbrains.com/webstorm/
  - What is Webstorm? WebStorm is a lightweight yet powerful IDE, perfectly equipped for complex client-side development and server-side development with Node.js.
  - Install updated IDEA (webstorm) editor (free for students)
  - Learn Webstorm
    - https://www.jetbrains.com/webstorm/documentation/

:three: Nodejs https://nodejs.org
  - What is Nodejs? Node.js® is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.
  - Install nodejs
IMPORTANT (for mac, not sure about pc): 
When installing node, do not just go to the website and install. If you do, for some reason the files are stored in areas of your file system that will require you to use sudo everytime you want to execute a command with npm. This is very annoying as you use npm to install all of the packages that you want. 
    Instead, install *nvm* (node version manager). This will install everything in areas of your file system that will allow you to just run your commands. There is a helpful video on Lynda that will show you how to do this. The video is entitled "Installing Node.js via Node Version Manager on a Mac" and is the last video of the first chapter in the course "Node.js Essential Training"
    Additionally, you can just install nvm by going to https://github.com/creationix/nvm and executing the first command under the heading "Install script"
  - Learn nodejs
    - https://nodejs.org/documentation/
  - Node Package Manager (NPM) allows you to install/update all node packages comes installed with nodejs automatically
    - Learn about npm
      - https://www.npmjs.com/
	- update node (if you already have node installed)
	  - cd into IVA
		- sudo npm cache clean -f
		- sudo npm install -g n
		- sudo n stable
		- node -v (0.12.2)
	- update package dependencies (or install if needed)
	  - sudo npm update -g

:four: Bower http://bower.io/
  - What is Bower?  A package manager for the web.
	- Ensure you have bower installed
		- sudo npm install -g bower
		- (NOTICE: On Mac) When you execute the above command bower will ask you to install a version of the package angular. There were 4 different versions to choose from. Choose the second version offered, angular#1.4.0.
	- update bower packages
		- bower update
			
:five: MongoDB https://www.mongodb.org/
  - What is MongoDB? MongoDB is an open-source document database that provides high performance, high availability, and automatic scaling.
  - Download and extract mongo
    - cd ~/Downloads/mongodb-osx-x86_64-2.6.6/bin/
    - start mongo daemon
      - ./mongod --dbpath=../data
  - Learn MongoDB
    - https://university.mongodb.com
  - Download and run Robomongo http://robomongo.org/

:six: Grunt http://gruntjs.com/
  - What is Grunt? A JavaScript Task Runner.
	- Ensure you have grunt installed
		- sudo npm install -g grunt-cli
  - cd into IVA Repo
    - run grunt by running "grunt serve"
    - you should see grunt script running
    - check your web browser
    
:seven: Jade http://jade-lang.com/
  - What is Jade? A clean, whitespace-sensitive template language for writing HTML - Node Template Engine
  - Learn Jade http://jade-lang.com/tutorial/
  
:eight: Yo http://yeoman.io/
  - What is Yo? CLI tool for running Yeoman generators
  - Learn Yo http://yeoman.io/learning/
  
:nine: Express http://expressjs.com/
  - What is express? Fast, unopinionated, minimalist web framework
  
:one::zero: Angular https://angularjs.org/
  - What is Angular? HTML enhanced for web apps
  - Learn Angular: https://docs.angularjs.org/tutorial
    
:one::one: Admin
  - ensure you have a gravatar account (gravatar.com)
	- modify /server/config/seed.js (bottom) to add a dev/test acct as needed (match email used for gravatar)
	- Value found in cloning https://github.com/almasaeed2010/AdminLTE and browsing locally / leveraging code
  - node/site
  - site template
  - core authentication (local only)
  - Account Management (user-level)
    - change password
    - update profile (i.e. title, first name, last name)
  - Account Management (admin-level)
    - List, create, update, delete
    - update: set password, change first name, last name, title, email)
    - assign to role/roles
  - Groups/Roles
    - create / list / update / delete
    - add / remove users from roles

:one::two: Next Steps
  - see the github Issues section of IVA for more information
  - get with students to ensure they understand how to fire up the dev environment
