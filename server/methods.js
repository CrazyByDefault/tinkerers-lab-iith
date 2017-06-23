Meteor.methods({
	// Create a thread in a given topic
    createThread: function(topicId, title, content) {
        check(topicId, String);
        check(content, String);

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
            content: content
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

    // Create a reply to a thread
    createReply: function(threadId, content) {
        check(threadId, String);
        check(content, String);

        var user = Meteor.user();

        if (!user) {
            throw new Meteor.Error("You need to be logged in to do this!");
        }
        if (!content) {
            throw new Meteor.Error("Reply can't be empty");
        }

        // Generate a notification for user who created the post
        if (user._id != Threads.findOne({ _id: threadId }).author._id) {
	        Meteor.users.update({ _id: Threads.findOne({ _id: threadId }).author._id }, {
	        	$addToSet: {
	        		"profile.notifications": {
	        			parentThread: threadId,
	        			commentingUser: user,
	        			createdAt: new Date(),
	        			comment: content
	        		}
	        	}
	        });
	    }

        var reply = {
            author: user,
            createdAt: new Date(),
            content: content
        };
        return Threads.update({
            _id: threadId
        }, {
            $addToSet: {
                replies: reply
            }
        });
    },

    // Clear a single notification
    clearNotification: function(date) {
    	var user = Meteor.user();

    	if(!user){
    		throw Meteor.Error("Not logged in!");
    	}

    	Meteor.users.update({ _id: user._id }, {
    		$pull: { "profile.notifications": { createdAt: date } }
    	});
    },

    // Clear all notifs
    clearAllNotifications: function() {
    	var user = Meteor.user();

    	if(!user){
    		throw Meteor.Error("Not logged in!");
    	}

    	Meteor.users.update({ _id: user._id }, {
    		$set: { 
    			"profile.notifications": []
    		}
    	});
    },

    // Check sanity of vote, and then cast vote
    voteCaster: function(threadId, vote) {
        check(threadId, String);
        // check(vote, Number);
        console.log("We got as far as voteCaster");

        var user = Meteor.user();

        if (!user) {
            throw Meteor.Error("You need to be logged in to do this!");
        }


        if (!user.profile.votedThreads || !user.profile.votedThreads.upvoted || !user.profile.votedThreads.downvoted || ( !user.profile.votedThreads.upvoted.includes(threadId) && !user.profile.votedThreads.downvoted.includes(threadId)) ) {

            console.log("Block 1");
            vote == 1 ? Meteor.call("upvoteThread", threadId, user._id) : Meteor.call("downvoteThread", threadId, user._id)

        } else if (vote == -1 && user.profile.votedThreads.upvoted && user.profile.votedThreads.upvoted.includes(threadId)) {

            console.log("Block 2");
            Meteor.call("downvoteThread", threadId, user._id);

            Meteor.users.update({
                _id: user._id
            }, {
                $pull: {
                    "profile.votedThreads.upvoted": threadId
                }
            });

        } else if (vote == 1 && user.profile.votedThreads.downvoted && user.profile.votedThreads.downvoted.includes(threadId)) {

            console.log("Block 3");
            Meteor.call("upvoteThread", threadId, user._id);

            Meteor.users.update({
                _id: user._id
            }, {
                $pull: {
                    "profile.votedThreads.downvoted": threadId
                }
            });

        } else {
            console.log("Block...??? Where am I? Why am I here?");
        }
    },

    // Upvote a thread
    upvoteThread: function(threadId, userId) {

    	Meteor.users.update({ _id: userId }, {
    		$addToSet: {
    			"profile.votedThreads.upvoted": threadId
    		}
    	});

    	return Threads.update({ _id: threadId }, {
    		$inc: {
    			weight: 1
    		}
    	})
    },
    
    // Downvote a thread
    downvoteThread: function(threadId, userId) {

    	Meteor.users.update({ _id: userId }, {
    		$addToSet: {
    			"profile.votedThreads.downvoted": threadId
    		}
    	});

    	return Threads.update({ _id: threadId }, {
    		$inc: {
    			weight: -1
    		}
    	})
    }
});