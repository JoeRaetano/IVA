IVA - Front End System :oncoming_automobile:
========================================

OVERVIEW
--------

The IVA is a front end system built on the MEAN stack as an interface to collect, analyze, and visualize vehicle data. Before
installing the IVA consult the training section to be able to fully understand and work with the system.


FUNDAMENTAL TRAINING
--------------------

:one: Git
  - Be sure to fully understand version control and Github before pushing or pulling any code
  - CodeSchool is a good resource with a class to learn git - https://www.codeschool.com/courses/try-git

:two: HTML/Javascript
  - These are the two fundamental tools that the MEAN stack builds upon. Make sure you have a good understanding of these
    before moving forward.
    
  - http://nodeschool.io/ (javascript)
    
MEAN STACK TRAINING
-------------------

:one: MongoDB
  - This is the database service that is used in the MEAN stack.
  - The best place to learn about MongoDb is http://docs.mongodb.org/manual/

:two: Express
  - Express is the web framework used in the Mean stack 
  - http://expressjs.com/starter/installing.html is the best place to get started learning express
  - All routing in the application is done with Express.
  
:three: AngularJs
  - Angular is the backbone of the MEAN stack. Spend the most time learning this framework to fully understand the system.
  - CodeSchool's free class is a great place to learn AngularJS and is linked below.
  - http://campus.codeschool.com/courses/shaping-up-with-angular-js/intro
  
:four: NodeJs
  - Node allows us to use javascript outside of the browser
  - http://nodeschool.io/ is the best resource to learn the basics of Nodejs
  
EXTRA RESOURCES
---------------

:one: Bower http://bower.io/
  - What is Bower?  A package manager for the web.
  - Bower is included in the system.

:two: Grunt http://gruntjs.com/
  - What is Grunt? A JavaScript Task Runner.

:three: Jade http://jade-lang.com/
  - What is Jade? A clean, whitespace-sensitive template language for writing HTML - Node Template Engine
  - Learn Jade http://jade-lang.com/tutorial/
  

INSTALLATION GUIDE ON MAC
-------------

:one: install WebstormIDE. https://www.jetbrains.com/webstorm/

:two: install Github desktop version. https://desktop.github.com/

:three: clone IVA directory to local folder or you can pull from within in webstorm, click install project from git: address is: https://github.com/JoeRaetano/IVA.

:four: Install Nodejs  

Note: to uninstall node that was installed previously with the sudo command 
https://gist.github.com/TonyMtz/d75101d9bdf764c890ef

0. Install latest version of XQuartz http://xquartz.macosforge.org/landing/

1. install or update Xcode

2. in a terminal window run: ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
if homebrew is already installed, "brew update" then "brew list" to show what you have installed, "brew info package", "brew uninstall package", "brew install package", 
"brew outdated", "brew upgrade", you may not want to upgrade a package such as mongodb so, "brew pin mongodb", later you can "brew unpin mongodb"
finally run "brew doctor" to ensure your brew installs will go smoothly

Installing Node.js and NPM is pretty straightforward using Homebrew. Homebrew handles downloading, unpacking and 
installing Node and NPM on your system. The whole process (after you have XCode and Homebrew installed) should only 
take you a few minutes.

3. Open the Terminal app and type "brew install node".
Sit back and wait. Homebrew downloads some files and installs them. And that’s it.
To make sure you have Node and NPM installed, run two simple commands to see what version of each is installed:

4. To see if Node is installed, type node -v in Terminal. This should print the version number so you’ll see something like this v4.2.1

5. To see if NPM is installed, type npm -v in Terminal. This should print the version number so you’ll see something like this 2.14.7

:five: Install MongoDB 

0. follow these instructions: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

1. in a terminal window type "brew update", "brew install mongodb"

2. To have launchd start mongodb at login:
   ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
3. Then to load mongodb now:
   launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
4. Or, if you don't want/need launchctl, you can just run:
   mongod --config /usr/local/etc/mongod.conf

:six: Install Robomongo to manage your MongoDB http://robomongo.org/

:seven: Install bower 

1. npm install -g bower
2. bower update

you may need to place the below code into the .bowerrc file

{
  "directory": "app/bower_components",
  "proxy": "http://PROXYSERVER:PORT",
  "https-proxy": "https://PROXYSERVER:PORT",
  "strict-ssl": false
}

:eight: Install grunt 

1. npm install -g grunt
2. npm install -g grunt-cli



Setup/Learning Notes
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

:four: Node Package Manager (NPM) allows you to install/update all node packages comes installed with nodejs automatically
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
	   
:five: MongoDB
  -Download and extract mongo
  - cd ~/Downloads/mongodb-osx-x86_64-2.6.6/bin/
  - start mongo daemon
    - ./mongod --dbpath=../data
    
:six: Bower
  - Ensure you have bower installed
    - sudo npm install -g bower
  - update bower packages
    - bower update
  - (NOTICE: On Mac) When you execute the install command bower will ask you to install a version of the package angular. 
  There were 4 different versions to choose from. Choose the second version offered, angular#1.4.0.

:seven: Grunt
  - Ensure you have grunt installed

:eight: Bower http://bower.io/
  - What is Bower?  A package manager for the web.
	- Ensure you have bower installed
		- sudo npm install -g bower
		- (NOTICE: On Mac) When you execute the above command bower will ask you to install a version of the package angular. There were 4 different versions to choose from. Choose the second version offered, angular#1.4.0.
	- update bower packages
		- bower update
			
:nine: MongoDB https://www.mongodb.org/
  - What is MongoDB? MongoDB is an open-source document database that provides high performance, high availability, and automatic scaling.
  - Download and extract mongo
    - cd ~/Downloads/mongodb-osx-x86_64-2.6.6/bin/
    - start mongo daemon
      - ./mongod --dbpath=../data
  - Learn MongoDB
    - https://university.mongodb.com
  - Download and run Robomongo http://robomongo.org/

:one: :zero: Grunt http://gruntjs.com/
  - What is Grunt? A JavaScript Task Runner.
	- Ensure you have grunt installed
		- sudo npm install -g grunt-cli
  
  - cd into IVA Repo
    - run grunt by running "grunt serve"
    - additionally, make sure MongoDB is running along side Grunt
    - you should see grunt script running
    - check your web browser

:one: :one: Admin


 Admin
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
