# Developer README

This document will serve as a way to document different items worth noting throughout the codebase.

# Running the Programs

## Running CLI
Run the following commands in the `2023-420-MARYJANE` folder

```
node src/app.js
```

or from any folder in `2023-420-MARYJANE`

```
npm start
```

## Launching the GUI
Coming soon...

## Running the Database Script
Run the following command in the `2023-420-MARYJANE` folder. Database file is depreciated and will be deleted soon.

```
node src/database.js
```

## Running a JavaScript File
On any JavaScript file, you can run it directly using `node [pathToFile]`. The NPM command (`npm start`) is user-defined in the scripts section of the package.json file.

# NPM

## Installing Dependencies
When installing dependencies listed in package.json use the following command. This will generate a node_modules folder that is ignored by git with the .gitignore file. This is ignored due to it being a very large folder that can be over a gigabtye and it may differ a bit between users.
```
npm install
```

## Installing New Packages
Use the following command. After words, make sure to list them in the package.json file under dependencies, so other will be able to install them. 
```
npm install [packageName]
```

## Finding Dependencies Online
Use the following website if you know the name of a package: https://www.npmjs.com/

## package.json File
This file is used to organize our node/NPM project. For more information on what the fields mean, visit this website:
https://docs.npmjs.com/cli/v9/configuring-npm/package-json

## Current Dependencies/Packages
- [check-word](https://github.com/S0c5/node-check-word) - Used to check if a word is an actual English word
- [jest](https://jestjs.io/) - Testing framework
- [mongodb](https://mongodb.github.io/node-mongodb-native/4.13/) - Used to query the mongodb database
- [prompt-sync](https://github.com/heapwolf/prompt-sync) - Used to get user input with Node.js
- [scrabble](https://www.npmjs.com/package/scrabble) - Used to generate all possible combinations of a group of letters (currently not in use by this project)
- [@moleculer/vorpal](https://github.com/moleculerjs/vorpal) - Vorpal without the security issues. Used to make the CLI and is highly helpful.
- [sqlite](https://github.com/kriasoft/node-sqlite) - Database package

# GIT

## Common Process
1. Find task/feature to work on.
2. Get on the develop branch using `git checkout develop`
3. Pull the most recent changes from the remote repo using `git pull`
4. Get access to all the new branches incase you are hopping on one of those using `git fetch origin`
5. Go to the issues page on GitHub and click on the issue you are working on. On the right side under develop, click on the button called 'create a branch'.
6. Copy and paste the command it gives you into the terminal when in the `2023-420-MARYJANE` folder and it will automatically put you on that branch. You can also do this manually by creating your own branch, but it is slower and probably will have a worse naming convention than the GitHub generated one.
7. Complete your feature(s).
8. Run `git status` to see the changed files or go to the source control tab on VSCode.
9. Add the files to be committed later, only add the files that pertain to your current issue. This can also be done using the VSCode GUI by clicking the + button or using `git add <NameOfFile>` or the least recommended `git add .` which adds all the changed files.
10. Make sure your files being committed are accurate using `git status` or the VSCode GUI in the VSCode source control tab. If so, use `git commit -m "Name of commit"` or use the VSCode GUI dialog box and commit button.
11. Repeat steps 7-10 if you desire. 
12. When ready to sync your changes, use `git push` or in VSCode use "Sync Changes".
13. Go onto GitHub and make your pull request!
14. After your pull request is approved and merged, delete your branch on GitHub if you are done using it.

## Commands
I like this pdf provided by Dr. Schwartz on D2L: https://education.github.com/git-cheat-sheet-education.pdf

## Merge Conflicts
These can and are challenging to fix most of the time and for that reason, it is hard to answer how to solve a merge conflict. This link will help you get on the right track: https://stackoverflow.com/questions/38216541/visual-studio-code-how-to-resolve-merge-conflicts-with-git. However, I recommend reaching out to someone else on the team to walk you throught it.

# Testing
For the best information visit: https://jestjs.io/

## Notes
Each file must have its' own test file for accurate code code coverage.
Add more here...

## Running Tests
Use `npm test`

## Generating Code Coverage HTML File
1. Use `npm test -- --coverage`
2. Navigate to the `coverage` folder
3. Open any of the `index.html` files in a web browser

