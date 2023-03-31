# 👋 Welcome to 2023sp-420-Maryjane 
![Lines of code](https://img.shields.io/tokei/lines/github/mucsci-students/2023sp-420-Maryjane) ![GitHub top language](https://img.shields.io/github/languages/top/mucsci-students/2023sp-420-Maryjane?color=yellow) ![GitHub](https://img.shields.io/github/license/mucsci-students/2023sp-420-Maryjane) ![GitHub Repo stars](https://img.shields.io/github/stars/mucsci-students/2023sp-420-Maryjane?color=red) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mucsci-students/2023sp-420-Maryjane?color=purple) 

## 🐝 Description 

A Spelling Bee App made in JavaScript for CSCI 420: Software Enginnerring at Millersville University.

## ⚡ Getting Started 
### Prequisites

* Node.js: You'll also need to have Node.js installed on your computer. Node.js is an open-source, cross-platform JavaScript runtime environment that allows you to run JavaScript on your computer. You can download Node.js from the official website at https://nodejs.org/.
* npm: Node.js comes with npm, which is a package manager for JavaScript. npm makes it easy for JavaScript developers to share and reuse code, and it makes it easy to update the code that you're sharing. If some how npm isn't installed, you can install npm by following the instructions on the official website at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
* Git: Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency. Git is easy to learn and has a tiny footprint with lightning fast performance. You can download Git from the official website at https://git-scm.com/downloads.

### Executing program

### CLI

* To run the program, you'll need to clone this repository to your local computer. You can do this by using the following command in your terminal or command line interface:
```
git clone https://github.com/mucsci-students/2023sp-420-Maryjane.git
```
* After cloning the repository, navigate to the repository using the following command:
```
cd 2023sp-420-Maryjane
```
* Before you can run the program, you'll need to install the dependencies. You can do this by using the following command:
```
npm install
```
* Once you've installed the dependencies, you can run the program by using the following command:

```
npm run cli
```

### GUI
* You can run the GUI either locally or remotely: 

* **Hosted Website (Remotely):**

  * Click this link to be sent to the GUI host website: 

     [SpellingBee Graphical User Interface 🐝](https://mucsci-students.github.io/2023sp-420-Maryjane/)




* **Through the terminal/command line interface (Locally):** 

  * To run the GUI through terminal/command line interface, you'll need to first clone this repository to your local computer. You can do this by using the following command in your terminal or command line interface:
  
```
git clone https://github.com/mucsci-students/2023sp-420-Maryjane.git
```

  * After cloning the repository, navigate to the repository using the following command:
  
```
cd 2023sp-420-Maryjane
```

  * Before you can run the program, you'll need to install the dependencies. You can do this by using the following command:

```
npm install
```

  * Once you've installed the dependencies, you can run the GUI by using the following command:
  
  
```
npm run gui
```

  * This command will make two links appear in the terminal under the "Available on" section (Picture example below). Use CNTRL-Click (Windows) or cmd-Click (MAC) on either of these links to start up the GUI:
  <code><img height="300" src="Screenshot (872).png"></code>

### Run tests
* To run the tests, you can use the following command:
* Note: You'll need to have the dependencies installed before you can run the tests. Refer to the "Executing program" section for more information.
* Note: You need to be in the root directory of the project to run the tests. (i.e. 2023sp-420-Maryjane)
```
npm run test
```

### Run Test Code Coverage
* To run the tests, you can use the following command:
* Note: You'll need to have the dependencies installed before you can run the tests. Refer to the "Executing program" section for more information.
* Note: You need to be in the root directory of the project to run the tests. (i.e. 2023sp-420-Maryjane)
```
npm test -- --coverage
```
* This will create a folder in your repo called coverage
* Go to 2023sp-420-Maryjane/coverage/Icov-report
* Open the index.html in a browser of your choice

## Design Patterns 

### MVC
The [model](https://github.com/mucsci-students/2023sp-420-Maryjane/blob/develop/src/model/Model.js) contains all the data relevant to the users' current game, such as the puzzle letters, found words, possible words, and more. The [views](https://github.com/mucsci-students/2023sp-420-Maryjane/tree/develop/src/views) contains everything used to display the model information on either the CLI or GUI. The [controller](https://github.com/mucsci-students/2023sp-420-Maryjane/tree/develop/src/controllers) adds event listerners to the GUI to be able to handle user interaction and handles commands in the CLI.


## Behavioral Patterns

### Iterator
We implement many ForEach loops in our code which iterate through a list of objects. For example, it can be seen in the [guess commands file](https://github.com/mucsci-students/2023sp-420-Maryjane/blob/develop/src/commands/guessCommands.js) where we iterate over the entire possible guesses to see if the users' guess is in that array.

### Command 
Our use of Vorpal commands and all commands in commands.js are object-oriented callback functions. These implementations can be found in the [CLI_Controller](https://github.com/mucsci-students/2023sp-420-Maryjane/blob/develop/src/controllers/CLI_Controller.js).

## 🖊️ Authors

👤 **Jonathan Rivera**

* Github 🤖: [@jjriver1](https://github.com/jjriver1)

👤 **Justin Stevens**

* Github 🤖: [@JSteve0](https://github.com/JSteve0)

👤 **Mitchell Harrison**

* Github 🤖: [@mharrison7787](https://github.com/mharrison7787)

👤 **Jayson Gayle**

* Github 🤖: [@OhMyDayz2023](https://github.com/OhMyDayz2023)

👤 **Michael Lewis**

* Github 🤖: [@mjlewis-millersville](https://github.com/mjlewis-millersville)

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page]((https://github.com/mucsci-students/2023sp-420-Maryjane/issues) ). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Distributed under the MIT License. See LICENSE for more information.
