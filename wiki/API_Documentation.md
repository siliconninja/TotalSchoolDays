# Total School Days App Wiki

## Table of Contents
[API Documentation](#api-documentation)

[Create Your Own Total School Days Website](#getting-started--how-to-create-your-own-total-school-days-website)

[Build Your Own Counter](#build-your-own-counter)

[License Information](#licensing)

***

## How to set up a Linux server locally or in the cloud
Get a Linux web server set up. Install Linux on a computer that will be your server, or get a virtual private server from a service such as DigitalOcean or Linode. **I recommend installing Ubuntu or Debian on your server to start out with. Get your root password and pick your web server software.**

## API Documentation
**Useful for making your own version while using this app's data**

### Important things to note
No authentication or headers are required.

The API endpoint is public because the data is not sensitive or confidential.

### Getting data
Example (where example.com hosts the repo files in website under /apps/school): Send a GET request to http://example.com/apps/school/api/school.json

You should get something similar to this:
````json
{
  "rows": [
    {
      "key": 0,
      "value": 15
    }
  ]
}
````

As you can see, it's a very simple API to use. The GET request gives you JSON-formatted data.

It doesn't give much output because the API is designed to be minimal so anyone can use it.

### API output data

|JSON object|                                                Description                                       |
|-----------|--------------------------------------------------------------------------------------------------|
|   value   |Returns the total number of school days that have been counted throughout the year. Updated daily.|

### Other data you can create in your setup

Things you can 'bake into' your own version of Total School Days (the example above is used):

|Information| Website implementation/formula | Example data used in the app |
|-----------|-----------|--------|
| Days left | The number of days in the school year &minus; the number of days that have passed. | 181 school year days &minus; 15 days passed |
| Hours left | The number of days left in the school year &times; the number of hours in your school day. | 166 days left &times; 7 hours |
|Periods left| The number of days left in the school year &times; the number of periods in your school day. | 166 days left &times; 6 periods |

Use the **value** function in this case to get 15 total school days.

You can also create your own values; for instance, minutes left, or even club meetings left!

### How the data is used/parsed/sanitized for the website
1. The total number of school days is stored as data on the web server (nginx/apache...) and updated manually by the database or system administrator through scripting, and results in either a static JSON file updated through scripting or a public database endpoint where a JSON file is generated using the database's files

  i. Authentication can be used so only certain people can access the data; however, since this information is not confidential, it is publicly available.

2. The data is requested by the client (the person browsing the website)

  i. The collected data from the JSON file is requested in JavaScript/JQuery and stored temporarily in memory on the computer (here's where the minimal part comes in)

3. Using JavaScript or another website scripting language, the local data is manipulated, updated, and finally shown to the user.

A similar process can be used to create a Total School Days app or administrator control panel on a computer, Arduino LCD panel, or mobile app.

## Getting Started &mdash; How to create your own Total School Days website

### Requirements
- A local or remote Linux web server (if local-only, users can only access your app while in school)
  - Recommended software: [nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/), [lighttpd](http://redmine.lighttpd.net/projects/lighttpd/wiki/GetLighttpd), [apache](http://httpd.apache.org/docs/2.4/install.html)
- Internet access
- 1-2 hours of spare time

[Set up a Linux web server](#how-to-set-up-a-linux-server-locally-or-in-the-cloud).

### Using my template
Download the master branch from: https://github.com/siliconninja/TotalSchoolDays

In the index.html file, find this JavaScript/JQuery code at the bottom:
````javascript
$.ajax({
    type: 'GET',
    url: 'http://example.com/apps/school/api/school.json',
    data: {  },
````

Here is where you will modify the code to your liking:
````javascript
// Set text of div to total school days variable...
$('#total_school_days').text(intTotalSchoolDays.toString())

// Set the total number of total school days left for other variables to use
intSchoolDaysLeft = intSchoolYearDays - intTotalSchoolDays;
			
// Set the total number of school days left as text.
$('#countdown_days').text(intSchoolDaysLeft.toString())
			
// Set the number of periods left in school as text...
$('#countdown_periods').text((intSchoolDaysLeft * 6).toString())	
	
// Set the number of hours left in school as text...
$('#countdown_hours').text((intSchoolDaysLeft * 7).toString())
````

You can also change elements or add new ones, and change the odometer style (read the [odometer docs](http://github.hubspot.com/odometer/) for details):
````html
<!-- Large box for total school day count -->
<div class="row" id="tsd_info_box">
	<!-- Placeholder column for optimal alignment -->
	<div class="col-lg-4">
	</div>
	
	<div class="col-lg-4">
		<div class="jumbotron">
			<h1>
				<!-- In case prepending any text (putting any text) before the number is needed/required -->
				<span id="tsd_days_text"></span>
				
				<div id="total_school_days" class="counter">0</div>
				
				<span id="subtitle_tsd">/ 181</span>
				
			</h1>
			
			<div class="tsd_moreinfo">
				<span class="counter" id="countdown_days">?</span> days left
			</div>
			
			<div class="tsd_moreinfo">
				<span class="counter" id="countdown_periods">?</span> periods left
			</div>
			
			<div class="tsd_moreinfo">
				<span class="counter" id="countdown_hours">?</span> hours left
			</div>

			<br>

			<!-- Progress bar (uses progressbar.js library) -->
			<div id="tsd_progressbar">
			</div>
		</div>
	</div>
</div>
````

Modify the scrolling numbers:
````javascript
// Query all matching elements (total days, days left, hours left, periods left)
var el = document.querySelector('.counter');
var el_d = document.querySelector('#countdown_days');
var el_h = document.querySelector('#countdown_hours');
var el_p = document.querySelector('#countdown_periods');
// Initialize instances of odometers
od = new Odometer({
  el: el,
  value: 0,
  // Any option (other than auto and selector) can be passed in here
  format: '(,ddd)',
  theme: 'minimal',
  duration: 300
});
od_d = new Odometer({
  el: el_d,
  value: 0,
  // Any option (other than auto and selector) can be passed in here
  format: '(,ddd)',
  theme: 'minimal',
  duration: 300
});
````

Modify the 'semicircle' progress bar:
````javascript
// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
var bar = new ProgressBar.SemiCircle("#tsd_progressbar", {
  strokeWidth: 6,
  color: '#FFEA82',
  trailColor: '#eee',
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 2000,
  svgStyle: null,
  text: {
    value: '',
    alignToBottom: true
  },
  from: {color: '#00e676'},
  to: {color: '#4caf50'},
````
### Using your own template/getting started (basic overview)

**Note: [you MUST credit my work](#licensing) even if you are just using my JSON data for your own app or creating something out of the code that I use.**

Create an HTML file with the usual `<!DOCTYPE HTML>`, `<html>`, `<head>`, `<body>`, etc.

Import JQuery:
````html
<!-- Code source: https://developers.google.com/speed/libraries/#libraries -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
````
Insert a `<div>` with `id="total_school_days"` in the body of your webpage.

Insert this JavaScript at the bottom of your webpage:
````javascript
$.ajax({
    type: 'GET',
    url: 'http://example.com/apps/school/api/school.json',
    data: {  },
    // Fix CORS/JSON error using Access-Control-Allow-Origin header in nginx sites-enabled/default file
    dataType: 'json',
    // Function successfully run!
    success: function (data) { 
        $.each(data, function(index, element) {
	  // Get length of array in JS: http://stackoverflow.com/a/6700
	  for(var i = 0; i < Object.keys(element).length; i++){
		// Add each element of array to an integer.
		intTotalSchoolDays += element[i].value;
	}
        // Set text of div to total school days variable...
        $('#total_school_days').text(intTotalSchoolDays.toString())
    }
    // When an error in the function (the collection and THEN parsing of data) has occurred...
    fail: function (data) {
        // Bring up an alert message to notify the user that there was something wrong with gathering data
        alert("Something went wrong. The server may be down, or your internet connection is experiencing issues. Please reload the page and try again.");
    }
});
````

Save your index.html file and load it in your browser. If you see the correct number of school days inside of `<div id="total_school_days">`, that means it worked. Congrats! :+1: 

## Build Your Own Counter
**Useful for building your own school's version of Total School Days from scratch or using a different day counter style**

### Requirements
- A local or remote Linux web server (if local-only, users can only access your app while in school)
  - Recommended software: [nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/), [lighttpd](http://redmine.lighttpd.net/projects/lighttpd/wiki/GetLighttpd), [apache](http://httpd.apache.org/docs/2.4/install.html)
- Internet access
- 5-6 hours of spare time to figure this stuff out

[Set up a Linux web server](#how-to-set-up-a-linux-server-locally-or-in-the-cloud).

Log in to your virtual private server using an ssh client (`ssh root@example.com`). In this example, I will be using nginx. Type `apt-get install nginx` and follow the prompts.

Restart your server after installation. Now type `cd /etc/nginx` (or wherever you installed nginx)

Configure nginx to match your setup:

  i. [Simple guide](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)

  ii. [Comprehensive guide](https://www.linode.com/docs/websites/nginx/how-to-configure-nginx)

Add an `api` folder/directory to wherever you are going to put your website.

In that folder, add a new file called `school.json`. Add the following to your JSON file:

````json
{
    "rows": [
      {
        "key": 0,
        "value": 0
      }
    ]
}
````

In `/etc/nginx/sites-available/default` or wherever you named/placed your file, add the following (`/api` is where you added the `school.json` file, (security info) GET requests are the only ones allowed to be executed, which is why there is a script only on the server to modify the .json file):
````nginx
# CORS fix for school.json file (get rid of "access denied" issue)
location /api {
    if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*';
    }
}
````

Now type `apt-get install jq` and follow the instructions. This program/library will let you modify JSON directly using its own scripting language. *It is a little tricky to get working*. Here are some good resources to help:

  i. [Workaround for editing json files in place with jq](https://github.com/stedolan/jq/issues/105#issue-13463021)

  ii. [How jq works, simple tutorial for jq](https://robots.thoughtbot.com/jq-is-sed-for-json)

You can also use the [finished script](https://github.com/siliconninja/TotalSchoolDays/releases/tag/jq-script). It increments the JSON value `value` by 1 every time it is run and overwrites the existing JSON file. Because we want the entire JSON file in the output (nothing should be shortened for the website to read), we just write `jq ".rows[].value += 1" school.json > sc.json` and then `mv sc.json school.json` to rename `sc.json` which will overwrite the `school.json` file.

When you are ready to use your file, run the finished script by typing `chmod +x jq-script-v1.sh` and then `./jq-script-v1.sh` or type the commands above manually.

Want to change the value back to 0? Just type `nano school.json` and make sure this is set: `"value": 0`.

[Create your own version of the TSD website or modify the original](#getting-started--how-to-create-your-own-total-school-days-website). (Replace `http://example.com/apps/school/api/school.json` with your URL where you stored the JSON file)

You're done! Below are resources for automating the script that increments the total school days value.

(**Optional: Automation on Android, no root access required**) Automation is very flexible. :+1: Use [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) :calling: and [ConnectBot (SSH client)](https://play.google.com/store/apps/details?id=org.connectbot) :computer: on Android to [automate the script being run on the SSH server](http://android.stackexchange.com/a/1459). You can use a 'location' profile or a 'when WiFi connected' profile and have it set a variable so it only executes once until a certain time the next day. Automate (a simpler alternative to Tasker) can also work.

(**Optional: Automation on iOS, No Jailbreak**) In my experience without a jailbreak, automation on iOS is quite limited. At least it's possible. You can use [Workflow](https://itunes.apple.com/us/app/workflow-powerful-automation/id915249334) :calling: with [Prompt](https://itunes.apple.com/us/app/prompt-2/id917437289) :computer: or IFTTT :earth_americas: (non-jailbroken).

(**Optional: Automation on iOS, With Jailbreak**) Super easy. :+1: [OpenSSH](https://cydia.saurik.com/package/openssh/) :computer: and [Activator](http://cydia.saurik.com/package/libactivator/) :calling: on Cydia (both free). You can use a 'location' profile or a 'when WiFi connected' profile and have it set a variable so it only executes once until a certain time the next day.

## Licensing
First things first, everything here is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.

Put simply, this means:
- you must credit me for any work you have created from this (uses Total School Days by siliconninja), **please reference this repository**
- you must keep your work free &ndash; you can't charge for it, sell it and market it as your own, or make money from another source (e.g. ad revenue), trackers such as Google Analytics are OK.
- you must license your work with the EXACT SAME license (CC BY-NC-SA 4.0): mention the license somewhere in your repository &amp; include an official Creative Commons link to the license (https://creativecommons.org/licenses/by-nc-sa/4.0/).

In addition, please credit the following libraries if you decide to use my website as-is. If you remove a library or use your own, credit for what you don't use is not needed:
- Progressbar.js (https://kimmobrunfeldt.github.io/progressbar.js/), MIT license
- Odometer (https://github.com/HubSpot/odometer), MIT license
- Cyborg Bootstrap theme from Bootswatch (https://bootswatch.com/cyborg/), MIT license
