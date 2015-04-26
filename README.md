Intelligent Vehicle Analysis - Front End
========================================

Joe should type `this is cool` and then get on with life

Basic Hackathon Notes
---------------------

- Setup
  - updated IDEA (webstorm) editor
	- update node
		- sudo npm cache clean -f
		- sudo npm install -g n
		- sudo n stable
		- node -v (0.12.0)
	- update package dependencies (or install if needed)
	  - sudo npm update -g
	- Ensure you have bower installed
		- sudo npm install -g bower
	- Ensure you have grunt installed
		- sudo npm install -g grunt-cli
	- update bower packages
		- bower update
  - ensure you have a gravatar account (gravatar.com)
	- modify /server/config/seed.js (bottom) to add a dev/test acct as needed (match email used for gravatar)
	- Value found in cloning https://github.com/almasaeed2010/AdminLTE and browsing locally / leveraging code
			
- Core
  - mongo
    - cd ~/Downloads/mongodb-osx-x86_64-2.6.6/bin/
    - ./mongod --dbpath=../data
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

- Next Steps
  - see the Issues section for more information
