Meteor.methods({
	createThread: function(topicId, title, content) {
		check(topicId, String);
		check(content, String);

		var user = Meteor.user();
		if(!user){
			throw new Meteor.Error("You need to be logged in to do this!");
		}
		if(!title){
			throw new Meteor.Error("Title can't be empty!")
		}
		if(!content){
			throw new Meteor.Error("You can't create an empty thread!");
		}

		var thread = {
			author: user.profile.name,
			createdAt: new Date(),
			topicId: topicId,
			title: title,
			content: content
		};
		return Threads.insert(thread);
	},

	createPost: function(threadId, content) {
		check(threadId, String);
		check(content, String);

		var user = Meteor.user();

		if(!user){
			throw new Meteor.Error("You need to be logged in to do this!");
		}
		if(!content){
			throw new Meteor.Error("Comment can't be empty");
		}

		var comment = {
			author: user.profile.name,
			createdAt: new Date(),
			content: content
		};
		return Blogs.update({_id: id}, {
			$addToSet: {comments: comment}
		});
	}
});