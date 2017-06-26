if (Topics.find().count() === 0) {
    _.each(
    	[{
                name: 'Ideas Zone',
                description: 'Discuss your project ideas here'
            }, {
            	name: 'General Discussion',
            	description: 'A place where you can discuss anything and everything'
        }],
        function(tempTopic) {
            Topics.insert({
                name: tempTopic.name,
                description: tempTopic.description
            });
        });
}

if (Blogs.find().count() === 0) {
    _.each(
        [{
            name: 'Placeholder 99',
            author: 'Tom',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus mi tortor, non dignissim turpis porttitor quis. Fusce lobortis justo vel ligula vehicula suscipit. Nunc semper, dolor ut pulvinar tincidunt, lorem nisi ullamcorper nibh, ac commodo massa nisi vitae ligula. Suspendisse quis tempus nulla. Ut ullamcorper, enim at consequat dictum, augue tellus mollis justo, id dignissim augue libero sit amet dui. Aenean consequat justo lorem, sit amet posuere arcu feugiat ac. Duis tincidunt placerat tortor id posuere. Aenean pulvinar ultricies risus ac suscipit. Suspendisse commodo libero et facilisis maximus.nterdum et malesuada fames ac ante ipsum primis in faucibus. Duis nec suscipit lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec massa dolor, facilisis nec justo in, aliquet viverra lacus. Sed quis molestie libero. Donec ac leo ac enim vulputate cursus non nec eros. In tempor ex a dui fermentum fringilla.Nullam sit amet neque efficitur dui tincidunt tempor. Phasellus hendrerit tempor turpis, eu rhoncus nisl imperdiet et. Praesent at venenatis neque. Nullam a mauris lorem. Cras pretium massa tellus, sit amet semper metus tempor eu. Ut tincidunt venenatis tincidunt. Nam luctus euismod neque.',
            comments: [{
                author: 'Harry',
                content: 'This is a placeholder comment'
            }]
        }, {
            name: 'Placeholder 2',
            author: 'Dick',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus mi tortor, non dignissim turpis porttitor quis. Fusce lobortis justo vel ligula vehicula suscipit. Nunc semper, dolor ut pulvinar tincidunt, lorem nisi ullamcorper nibh, ac commodo massa nisi vitae ligula. Suspendisse quis tempus nulla. Ut ullamcorper, enim at consequat dictum, augue tellus mollis justo, id dignissim augue libero sit amet dui. Aenean consequat justo lorem, sit amet posuere arcu feugiat ac. Duis tincidunt placerat tortor id posuere. Aenean pulvinar ultricies risus ac suscipit. Suspendisse commodo libero et facilisis maximus.nterdum et malesuada fames ac ante ipsum primis in faucibus. Duis nec suscipit lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec massa dolor, facilisis nec justo in, aliquet viverra lacus. Sed quis molestie libero. Donec ac leo ac enim vulputate cursus non nec eros. In tempor ex a dui fermentum fringilla.Nullam sit amet neque efficitur dui tincidunt tempor. Phasellus hendrerit tempor turpis, eu rhoncus nisl imperdiet et. Praesent at venenatis neque. Nullam a mauris lorem. Cras pretium massa tellus, sit amet semper metus tempor eu. Ut tincidunt venenatis tincidunt. Nam luctus euismod neque.',
            comments: [{
                author: 'Harry',
                content: 'This is a placeholder comment'
            }]
        }, {
            name: 'Placeholder 3',
            author: 'Harry',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus mi tortor, non dignissim turpis porttitor quis. Fusce lobortis justo vel ligula vehicula suscipit. Nunc semper, dolor ut pulvinar tincidunt, lorem nisi ullamcorper nibh, ac commodo massa nisi vitae ligula. Suspendisse quis tempus nulla. Ut ullamcorper, enim at consequat dictum, augue tellus mollis justo, id dignissim augue libero sit amet dui. Aenean consequat justo lorem, sit amet posuere arcu feugiat ac. Duis tincidunt placerat tortor id posuere. Aenean pulvinar ultricies risus ac suscipit. Suspendisse commodo libero et facilisis maximus.nterdum et malesuada fames ac ante ipsum primis in faucibus. Duis nec suscipit lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec massa dolor, facilisis nec justo in, aliquet viverra lacus. Sed quis molestie libero. Donec ac leo ac enim vulputate cursus non nec eros. In tempor ex a dui fermentum fringilla.Nullam sit amet neque efficitur dui tincidunt tempor. Phasellus hendrerit tempor turpis, eu rhoncus nisl imperdiet et. Praesent at venenatis neque. Nullam a mauris lorem. Cras pretium massa tellus, sit amet semper metus tempor eu. Ut tincidunt venenatis tincidunt. Nam luctus euismod neque.',
            comments: [{
                author: 'Harry',
                content: 'This is a placeholder comment'
            }]
        }, {
            name: 'Placeholder 4',
            author: 'Ballsy',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus mi tortor, non dignissim turpis porttitor quis. Fusce lobortis justo vel ligula vehicula suscipit. Nunc semper, dolor ut pulvinar tincidunt, lorem nisi ullamcorper nibh, ac commodo massa nisi vitae ligula. Suspendisse quis tempus nulla. Ut ullamcorper, enim at consequat dictum, augue tellus mollis justo, id dignissim augue libero sit amet dui. Aenean consequat justo lorem, sit amet posuere arcu feugiat ac. Duis tincidunt placerat tortor id posuere. Aenean pulvinar ultricies risus ac suscipit. Suspendisse commodo libero et facilisis maximus.nterdum et malesuada fames ac ante ipsum primis in faucibus. Duis nec suscipit lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec massa dolor, facilisis nec justo in, aliquet viverra lacus. Sed quis molestie libero. Donec ac leo ac enim vulputate cursus non nec eros. In tempor ex a dui fermentum fringilla.Nullam sit amet neque efficitur dui tincidunt tempor. Phasellus hendrerit tempor turpis, eu rhoncus nisl imperdiet et. Praesent at venenatis neque. Nullam a mauris lorem. Cras pretium massa tellus, sit amet semper metus tempor eu. Ut tincidunt venenatis tincidunt. Nam luctus euismod neque.',
            comments: [{
                author: 'Harry',
                content: 'This is a placeholder comment'
            }]
        }, {
            name: 'Placeholder 5',
            author: 'Blabla',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus mi tortor, non dignissim turpis porttitor quis. Fusce lobortis justo vel ligula vehicula suscipit. Nunc semper, dolor ut pulvinar tincidunt, lorem nisi ullamcorper nibh, ac commodo massa nisi vitae ligula. Suspendisse quis tempus nulla. Ut ullamcorper, enim at consequat dictum, augue tellus mollis justo, id dignissim augue libero sit amet dui. Aenean consequat justo lorem, sit amet posuere arcu feugiat ac. Duis tincidunt placerat tortor id posuere. Aenean pulvinar ultricies risus ac suscipit. Suspendisse commodo libero et facilisis maximus.nterdum et malesuada fames ac ante ipsum primis in faucibus. Duis nec suscipit lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec massa dolor, facilisis nec justo in, aliquet viverra lacus. Sed quis molestie libero. Donec ac leo ac enim vulputate cursus non nec eros. In tempor ex a dui fermentum fringilla.Nullam sit amet neque efficitur dui tincidunt tempor. Phasellus hendrerit tempor turpis, eu rhoncus nisl imperdiet et. Praesent at venenatis neque. Nullam a mauris lorem. Cras pretium massa tellus, sit amet semper metus tempor eu. Ut tincidunt venenatis tincidunt. Nam luctus euismod neque.',
            comments: [{
                author: 'Harry',
                content: 'This is a placeholder comment'
            }]
        }],
        function(tempBlog) {
            Blogs.insert({
                name: tempBlog.name,
                author: tempBlog.author,
                content: tempBlog.content,
                createdAt: new Date(),
                description: tempBlog.content.substring(0, 300),
                comments: tempBlog.comments
            });
        });
}