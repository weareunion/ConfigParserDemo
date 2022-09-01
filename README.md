
# Config Parser Demo

This is a coding demo. The instructions are listed at the bottom of the page.

Written by Karl Schmidt (https://karlschmidt.me/) on September 1st, 2022
## About the Tech

This project was written, for the most part (excluding the JS embedded in the `demo.html` file), in TypeScript. This 
is a compiled language, and can be compiled from source. This compiled source (JS) lives in the `/dist` folder. 
I have already compiled the TypeScript for you, but you can also do it yourself as well. 

To do this, execute the following in the root directory of the project: 
```shell
npm run build
```

**NOTE:**
This may fail if you do not have TypeScript installed. 
You can fix this by running 
```shell
npm install typescript
``` 
or just 
```shell
npm i
``` 
since the package.json makes note of this dependency.

Once you have compiled the source (or have decided to use the included one) you can reload the `demo.html` page to begin. 

### The API

#### Creating an Instance
Create an instance of the `ConfigurationFile` class, using the following method (you can replace the given text with your own config file):  

```JavaScript
let configfile = new ConfigurationFile("test_text=true")
```

Unless you set the `autoProcess` feature to `false` in the constructor, 
the instance will automatically process and populate its internal map structure. 

#### Handling Errors 

The following errors can be thrown (-> sigifies inheritance):

**`ParseError` -> `ConfigError` -> `Error`**: Throws when: a) there is a line with no assigment (such as "data value"), or there is one with more than one assigment ("data = value1 = value2")

**`DuplicateIndex` -> `ConfigError` -> `Error`**: Throws when there is a duplicate index

I decided to create this pattern since we can individually detect ConfigErrors overarchingly but also ParseError and DuplicateIndex. 

#### Extracting Data

Extracting data can be done with the following two methods

`ConfigurationFile.get(key:string)` and `ConfigurationFile.getAllEntries()`. 

For example, we can get a certain key 

```JavaScript
let configfile = new ConfigurationFile("test_text=true")
configfile.get("test_text") //true:boolean
configfile.get("something_else") //undefined
```

...or return all entries as one single object 

```JavaScript
let configfile = new ConfigurationFile("test_text=true")
configfile.getAllEntries() //{"test_text":true}:{[key:string]:[value:String|Number|Boolean]}
```
## Demo

There is a simple HTML site that can demo the JS. This can be accessed as /public/demo.html.
## Instructions

Please create a parsing tool that takes the example config file (provided below) and turns it into a usable object in the language of your choice (hash, JSON object, associative array, class, etc). The instructions for this are below. Please let us know if you have any questions!

1. Do not use existing "complete" configuration parsing libraries/functions, we want to see how you would write the code to do this.

2. Use of core and stdlib functions/objects such as string manipulation, regular expressions, etc is ok.

3. We should be able to get the values of the config parameters in code, via their name. How this is done specifically is up to you.

4. Boolean-like config values (on/off, yes/no, true/false) should return real booleans: true/false.

5. Numeric config values should return real numerics: integers, doubles, etc

6. Ignore or error out on invalid config lines, your choice.

7. Please include a short example usage of your code so we can see how you call it/etc.

8. Push your work to a public git repository (github, bitbucket, etc) and send us the link.
