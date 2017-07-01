import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Inject } from "meteor/meteorhacks:inject-initial";

Meteor.startup(() => {
    // code to run on server at startup
    Inject.rawModHtml("addLanguage", function(html) {
        return html.replace(/<html>/, '<!-- HTML 5 -->\n<html lang="en">');
      });
});