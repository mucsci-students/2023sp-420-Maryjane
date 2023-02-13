# Developer README

This document will serve as a way to document different items worth noting throughout the codebase.

# Running the Programs

## Running CLI
Run the following commands in the `2023-420-MARYJANE` folder

```
node src/app.js
```

or

```
npm start
```

## Running the Database Script
Run the following command in the `2023-420-MARYJANE` folder

```
node src/database.js
```

## Running a JavaScript file
On any JavaScript file, you can run it directly using `node [pathToFile]`. The NPM command (`npm start`) is user-defined in the scripts section of the package.json file.

# NPM

## Installing dependencies
When installing dependencies listed in package.json use the following command. This will generate a node_modules folder that is ignored by git with the .gitignore file. This is ignored due to it being a very large folder that can be over a gigabtye and it may differ a bit between users.
```
npm install
```

## Installing new packages
Use the following command. After words, make sure to list them in the package.json file, so other will be able to install them. 
```
npm install [packageName]
```

## Finding dependencies online
Use the following website if you know the name of a package: https://www.npmjs.com/

## package.json file
This file is used to organize our node/NPM project. For more information on what the fields mean, visit this website:
https://docs.npmjs.com/cli/v9/configuring-npm/package-json

# GIT

## Common process
1. Find task/feature to work on.
2. Get on the develop branch using `git checkout develop`
3. Pull the most recent changes from the remote repo using `git pull`
4. Get access to all the new branches incase you are hopping on one of those using `git fetch origin`
5. Go to the issues page on GitHub and click on the issue you are working on. On the right side under develop, click on the button called 'create a branch'.
6. Copy and paste the command it gives you into the terminal when in the `2023-420-MARYJANE` folder and it will automatically put you on that branch. You can also do this manually by creating your own branch, but it is slower and probably will a worse naming convention than the GitHub generated one.
7. Complete your feature(s).
8. Run `git status` to see the changed files.
9. Add the files to be committed later, only add the files that pertain to your current issue. This can also be done using the VSCode GUI by clicking the + button.
10. Make sure your files being committed are accurate using `git status` or the VSCode GUI. If so, use `git commit -m "Name of commit"` or use the VSCode GUI dialog box and commit button.
11. Repeat steps 7-10 if you desire. 
12. When ready to sync your changes, use `git push` or in VSCode use "Sync Changes".
13. Go onto GitHub and make your pull request!

## Commands
I like this pdf provided by Dr. Schwartz on D2L: https://education.github.com/git-cheat-sheet-education.pdf


