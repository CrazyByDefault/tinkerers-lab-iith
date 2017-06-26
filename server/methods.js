Meteor.methods({
    // Prep account
    prepAccount: function() {

    	var user = Meteor.user();

        // Prep account for commenting
        if (!user.profile.votedThings) {
        	Meteor.users.update({
        		_id: user._id
        	}, {
        		$set: {
        			"profile.votedThings": {
        				upvoted: [],
        				downvoted: []
        			}
        		}
        	});
        }
        console.log("Account prepped");
    },

    // Create a thread in a given topic
    createThread: function(topicId, title, content) {
    	check(topicId, String);
        // check(content, String);

        var user = Meteor.user();
        if (!user) {
        	throw new Meteor.Error("You need to be logged in to do this!");
        }
        if (!title) {
        	throw new Meteor.Error("Title can't be empty!")
        }
        if (!content) {
        	throw new Meteor.Error("You can't create an empty thread!");
        }

        var thread = {
        	author: user,
        	createdAt: new Date(),
        	topicId: topicId,
        	title: title,
        	content: content,
        	weight: 0
        };
        return Threads.insert(thread);
    },

    // Create comment on a blogpost
    createComment: function(blogId, content) {
    	check(blogId, String);
    	check(content, String);

    	var user = Meteor.user();

    	if (!user) {
    		throw new Meteor.Error("You need to be logged in to do this!");
    	}
    	if (!content) {
    		throw new Meteor.Error("Comment can't be empty");
    	}

    	var comment = {
    		author: user,
    		createdAt: new Date(),
    		content: content
    	};
    	return Blogs.update({
    		_id: blogId
    	}, {
    		$addToSet: {
    			comments: comment
    		}
    	});
    },

    // Create a reply to a thread or a project
    createReply: function(thingId, content, thing) {
    	check(thingId, String);
    	check(content, String);

    	var user = Meteor.user();

    	if (!user) {
    		throw new Meteor.Error("You need to be logged in to do this!");
    	}
    	if (!content) {
    		throw new Meteor.Error("Reply can't be empty");
    	}

    	if(thing == 'thread'){
	        
	        var reply = {
	        	author: user,
	        	createdAt: new Date(),
	        	content: content
	        };

	        Threads.update({ _id: thingId }, {
	        	$addToSet: {
	        		replies: reply
	        	}
	        });

	        // Ask for a notification for relevant user
	        if (user._id != Threads.findOne({ _id: thingId }).author._id) {
	        	Meteor.call("notificationConstructor", user, 'thread', thingId);
	        }
	    }

	    if(thing == 'project'){
	    	var reply = {
	    		author: user,
	    		createdAt: new Date(),
	    		content: content
	    	}

	    	Projects.update({ _id: thingId }, {
	    		$addToSet: {
	    			replies: reply
	    		}
	    	});

	    	// Ask for a notification for relevant user
	    	if (user._id != Projects.findOne({ _id: thingId }).author._id) {
	    		Meteor.call("notificationConstructor", user, 'thread', thingId);
	    	}
	    }

	},

	notificationConstructor: function(spawningUser, thing, thingId) {
		if (thing == 'thread') {
			Meteor.users.update({ _id: Threads.findOne({ _id: thingId }).author._id }, {
				$addToSet: {
					"profile.notifications": {
						parentThread: thingId,
						commentingUser: user,
						createdAt: new Date(),
						comment: content
					}
				}
			});
		}
	},

    // Clear a single notification
    clearNotification: function(date) {
    	var user = Meteor.user();

    	if (!user) {
    		throw Meteor.Error("Not logged in!");
    	}

    	Meteor.users.update({
    		_id: user._id
    	}, {
    		$pull: {
    			"profile.notifications": {
    				createdAt: date
    			}
    		}
    	});
    },

    // Clear all notifs
    clearAllNotifications: function() {
    	var user = Meteor.user();

    	if (!user) {
    		throw Meteor.Error("Not logged in!");
    	}

    	Meteor.users.update({
    		_id: user._id
    	}, {
    		$set: {
    			"profile.notifications": []
    		}
    	});
    },

    // Check sanity of vote, and then cast vote
    voteCaster: function(thingId, vote, mode) {
    	check(thingId, String);
        // check(vote, Number);
        // console.log("We got as far as voteCaster");

        var user = Meteor.user();
        var upvotedThings = user.profile.votedThings.upvoted;
        var downvotedThings = user.profile.votedThings.downvoted;

        if (!user) {
        	throw Meteor.Error("You need to be logged in to do this!");
        }

        // If mode is 1, we're dealing with a thread. Else, it's a project.
        if (mode == 1) {
        	if (!upvotedThings.includes(thingId) && !downvotedThings.includes(thingId)) {

        		console.log("Block 1 - fresh vote");
        		vote == 1 ?
        		Meteor.call("upvoteThread", thingId, function(err, result) {
        			console.log("Fresh upvote");
        			Meteor.users.update({
        				_id: user._id
        			}, {
        				$addToSet: {
        					"profile.votedThings.upvoted": thingId
        				}
        			});
        		}) :
        		Meteor.call("downvoteThread", thingId, function(err, result) {
        			console.log("Fresh downvote");
        			Meteor.users.update({
        				_id: user._id
        			}, {
        				$addToSet: {
        					"profile.votedThings.downvoted": thingId
        				}
        			});
        		})

        	} else if (vote == 1 && upvotedThings.includes(thingId)) {

        		console.log("Block 2 - unset upvote");
        		Meteor.call("downvoteThread", thingId);

        		Meteor.users.update({
        			_id: user._id
        		}, {
        			$pull: {
        				"profile.votedThings.upvoted": thingId
        			}
        		});

        	} else if (vote == -1 && downvotedThings.includes(thingId)) {

        		console.log("Block 3 - unset downvote");
        		Meteor.call("upvoteThread", thingId);

        		Meteor.users.update({
        			_id: user._id
        		}, {
        			$pull: {
        				"profile.votedThings.downvoted": thingId
        			}
        		});

        	} else {
                // Reverse votes

                if (vote == 1) {
                    // Reverse downvote
                    Meteor.users.update({
                    	_id: user._id
                    }, {
                    	$pull: {
                    		"profile.votedThings.downvoted": thingId
                    	}
                    });

                    Meteor.call("upvoteThread", thingId);
                    Meteor.call("upvoteThread", thingId, function(err, result) {
                    	console.log("Reversing downvote");
                    	Meteor.users.update({
                    		_id: user._id
                    	}, {
                    		$addToSet: {
                    			"profile.votedThings.upvoted": thingId
                    		}
                    	});
                    });
                } else {
                    // Reverse Upvote
                    Meteor.users.update({
                    	_id: user._id
                    }, {
                    	$pull: {
                    		"profile.votedThings.upvoted": thingId
                    	}
                    });

                    Meteor.call("downvoteThread", thingId);
                    Meteor.call("downvoteThread", thingId, function(err, result) {
                    	console.log("Reversing upvote");
                    	Meteor.users.update({
                    		_id: user._id
                    	}, {
                    		$addToSet: {
                    			"profile.votedThings.downvoted": thingId
                    		}
                    	});
                    })
                }
            }
        } else {
        	if (!upvotedThings.includes(thingId) && !downvotedThings.includes(thingId)) {

        		console.log("Block 1 - fresh vote");
        		vote == 1 ?
        		Meteor.call("upvoteProject", thingId, function(err, result) {
        			console.log("Fresh upvote");
        			Meteor.users.update({
        				_id: user._id
        			}, {
        				$addToSet: {
        					"profile.votedThings.upvoted": thingId
        				}
        			});
        		}) :
        		Meteor.call("downvoteProject", thingId, function(err, result) {
        			console.log("Fresh downvote");
        			Meteor.users.update({
        				_id: user._id
        			}, {
        				$addToSet: {
        					"profile.votedThings.downvoted": thingId
        				}
        			});
        		})

        	} else if (vote == 1 && upvotedThings.includes(thingId)) {

        		console.log("Block 2 - unset upvote");
        		Meteor.call("downvoteProject", thingId);

        		Meteor.users.update({
        			_id: user._id
        		}, {
        			$pull: {
        				"profile.votedThings.upvoted": thingId
        			}
        		});

        	} else if (vote == -1 && downvotedThings.includes(thingId)) {

        		console.log("Block 3 - unset downvote");
        		Meteor.call("upvoteProject", thingId);

        		Meteor.users.update({
        			_id: user._id
        		}, {
        			$pull: {
        				"profile.votedThings.downvoted": thingId
        			}
        		});

        	} else {
                // Reverse votes

                if (vote == 1) {
                    // Reverse downvote
                    Meteor.users.update({
                    	_id: user._id
                    }, {
                    	$pull: {
                    		"profile.votedThings.downvoted": thingId
                    	}
                    });

                    Meteor.call("upvoteProject", thingId);
                    Meteor.call("upvoteProject", thingId, function(err, result) {
                    	console.log("Reversing downvote");
                    	Meteor.users.update({
                    		_id: user._id
                    	}, {
                    		$addToSet: {
                    			"profile.votedThings.upvoted": thingId
                    		}
                    	});
                    });
                } else {
                    // Reverse Upvote
                    Meteor.users.update({
                    	_id: user._id
                    }, {
                    	$pull: {
                    		"profile.votedThings.upvoted": thingId
                    	}
                    });

                    Meteor.call("downvoteProject", thingId);
                    Meteor.call("downvoteProject", thingId, function(err, result) {
                    	console.log("Reversing upvote");
                    	Meteor.users.update({
                    		_id: user._id
                    	}, {
                    		$addToSet: {
                    			"profile.votedThings.downvoted": thingId
                    		}
                    	});
                    })
                }
            }
        }
    },

    // Upvote a thread
    upvoteThread: function(threadId) {

    	return Threads.update({
    		_id: threadId
    	}, {
    		$inc: {
    			weight: 1
    		}
    	})
    },

    // Downvote a thread
    downvoteThread: function(threadId) {

    	return Threads.update({
    		_id: threadId
    	}, {
    		$inc: {
    			weight: -1
    		}
    	})
    },

    // Upvote a project
    upvoteProject: function(projectId) {

    	return Projects.update({
    		_id: projectId
    	}, {
    		$inc: {
    			weight: 1
    		}
    	})
    },

    // Downvote a project
    downvoteProject: function(projectId) {
    	return Projects.update({
    		_id: projectId
    	}, {
    		$inc: {
    			weight: 1
    		}
    	})
    },

    // Create a new project
    createProject: function(title, descrip, timeline) {
    	check(title, String);
    	check(descrip, String);
        // check(timeline, Object);

        var user = Meteor.user();

        if (!user) {
        	throw new Meteor.Error("You gotta be logged in to do that!");
        }
        if (!title) {
        	throw new Meteor.Error("Title can't be empty");
        }
        if (!descrip) {
        	throw Meteor.Error("Description can't be empty");
        }

        var project = {
        	title: title,
        	author: user,
        	description: descrip,
        	timeline: timeline,
        	createdAt: new Date(),
        	weight: 0
        };
        return Projects.insert(project);
    }
});