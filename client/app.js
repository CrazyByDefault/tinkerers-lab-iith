angular.module('forum', ['angular-meteor', 'ui.router', 'angularTrix', 'ngAnimate'])
    .config(function($urlRouterProvider, $stateProvider) {
        // Set the default route 
        $urlRouterProvider
            .when('/', '/welcome')
            .otherwise('/welcome');

        $stateProvider.state('welcome', {
            url: '/welcome',
            templateUrl: 'views/pages/welcome.html',
            controller: 'WelcomeController'
        });

        $stateProvider.state('inventory', {
            url: '/inventory',
            templateUrl: 'views/pages/inventory.html',
            controller: 'InventoryController'
        });

        $stateProvider.state('blogs', {
            url: '/blogs',
            templateUrl: 'views/pages/blogs.html',
            controller: 'BlogsController'
        });

        $stateProvider.state('blog', {
            url: '/blog/:blogId',
            templateUrl: 'views/pages/blog.html',
            controller: 'BlogController'
        });

        $stateProvider.state('projects', {
            url: '/projects',
            templateUrl: 'views/pages/projects.html',
            controller: 'ProjectsController'
        });

        $stateProvider.state('project', {
            url: '/projects/:projectId',
            templateUrl: 'views/pages/project.html',
            controller: 'ProjectController'
        });

        $stateProvider.state('topics', {
            url: '/topics',
            templateUrl: 'views/pages/topics.html',
            controller: 'TopicsContoller'
        });

        $stateProvider.state('topic', {
            url: '/topic/:topicId',
            templateUrl: 'views/pages/topic.html',
            controller: 'TopicContoller'
        });

        $stateProvider.state('thread', {
            url: '/thread/:threadId',
            templateUrl: 'views/pages/thread.html',
            controller: 'ThreadContoller'
        });

        $stateProvider.state('about', {
            url: '/about',
            templateUrl: 'views/pages/about.html'
        })
    })
    .run(function($state, $stateParams, $rootScope, $sce, $meteor) {
        // We inject $state here to initialize ui.router 
        $rootScope.helpers({
            availableAccountAction: function() {
                if (Meteor.user()) {
                    return 'Logout';
                }
                return 'Sign In';
            },
        });

        $rootScope.getNumber = function(num) {
            return new Array(num);
        }

        $rootScope.clearNotification = function(date) {
            console.log(date)
            $meteor.call("clearNotification", date).then(function() {
                console.log("Cleared a notif!");
            });
        };

        $rootScope.clearAllNotifications = function() {
            $meteor.call("clearAllNotifications").then(function() {
                console.log("Cleared all notifs!")
            });
        };

        $rootScope.trustHtml = function(stuff) {
            return $sce.trustAsHtml(stuff);
        };

        $rootScope.logInorOut = function() {
            if (!Meteor.user()) {
                console.log("Logging in");
                Meteor.loginWithGoogle({
                    requestPermissions: ['email', 'profile'],
                    loginStyle: 'popup'
                }, function(error) {
                    if(error){
                        console.log("Error logging in!");
                    }else{
                        $meteor.call("prepAccount");
                    }
                });
            } else {
                console.log("Logging out");
                Meteor.logout();
            }
        }
    })
    .controller('WelcomeController', function($scope, $stateParams) {

        $scope.subscribe('blog', function() {
            return [$stateParams.blogId];
        });

        $scope.subscribe('blogs');
        $scope.helpers({
            blogs: function() {
                return Blogs.find({}, {
                    sort: {
                        name: 1
                    },
                });
            }
        })
    })
    .controller('TopicsContoller', function($scope) {
        $scope.subscribe('topics');
        $scope.helpers({
            topics: function() {
                return Topics.find({}, {});
            }
        });
    })
    .controller('TopicContoller', function($scope, $stateParams, $meteor) {
        $scope.subscribe('topic', function() {
            return [$stateParams.topicId];
        });
        $scope.subscribe('threads', function() {
            return [$stateParams.topicId];
        });
        $scope.helpers({
            topic: function() {
                return Topics.findOne({
                    _id: $stateParams.topicId
                });
            },
            threads: function() {
                return Threads.find({
                    topicId: $stateParams.topicId
                }, {
                    sort: {
                        weight: -1
                    }
                });
            }
        });

        $scope.castVote = function(threadId, vote) {
            $meteor.call("voteCaster", threadId, vote, 1).then(function() {
                // TODO Do I need anything here?
            }).catch(function(err) {
                alert("Vote failed for mysterious reasons... " + err);
            });
        }

        $scope.upvoteThread = function(threadId) {
            $meteor.call("upvoteThread", threadId).then(function() {
                //TODO Do I need anything here?
            }).catch(function(err) {
                alert("Upvote failed... da fuq?" + err );
            });
        }

        $scope.downvoteThread = function() {
            $meteor.call("downvoteThread", $stateParams.threadId).then(function() {
                //TODO Do I need anything here?
            }).catch(function(err) {
                alert("Downvote failed... da fuq?" + err );
            });
        }

        $scope.createThread = function(thread) {
            $meteor.call("createThread", $stateParams.topicId, thread.title, thread.content).then(function() {
                thread.content = '';
                thread.title = '';
            }).catch(function(error) {
                alert("An error occured while creating the thread! " + error);
            });
        };
    })
    .controller('ThreadContoller', function($scope, $sce, $stateParams, $meteor) {
        $scope.subscribe('thread', function() {
            // $scope.htmlString = thread.content;
            return [$stateParams.threadId];
        });
        $scope.helpers({
            thread: function() {
                    return Threads.findOne({
                        _id: $stateParams.threadId
                    });
                }
                /*,
                            comments: function() {
                                return Threads.findOne({
                                    _id: $stateParams.threadId
                                }).comments;
                            }*/
        });


        $scope.createReply = function(reply) {
            $meteor.call('createReply', $stateParams.threadId, reply.content).then(function() {
                reply.content = '';
            }).catch(function(err) {
                alert("An error occured while creating reply! " + err);
            });
        };
    })
    .controller('BlogsController', function($scope, $stateParams) {
        $scope.subscribe('blogs');
        $scope.helpers({
            blogs: function() {
                return Blogs.find({}, {
                    sort: {
                        name: 1,
                    },
                });
            }
        });
    })
    .controller('BlogController', function($scope, $stateParams, $meteor) {
        $scope.subscribe('blog', function() {
            return [$stateParams.blogId];
        });

        $scope.createComment = function(comment) {
            $meteor.call('createComment', $stateParams.blogId, comment.content).then(function() {
                comment.content = '';
            }).catch(function(err) {
                alert("An error occured while creating comment! " + err);
            });
        };

        $scope.helpers({
            blog: function() {
                    return Blogs.findOne({
                        _id: $stateParams.blogId
                    });
                }
                /*,
                            comments: function() {
                                const currentBlog = Blogs.findOne({ _id: $stateParams.blogId })
                                return Blogs.findOne({
                                    _id: $stateParams.blogId
                                }, {
                                    fields: { comments: 1 }
                                }).comments;
                            }*/
        });
    })
    .controller('ProjectsController', function($scope, $stateParams, $meteor) {
        $scope.subscribe('projects');

        $scope.helpers({
            projects: function() {
                return Projects.find({}, {
                    sort: {
                        weight: 1
                    }
                });
            }

        });

        $scope.hideTrixTB = function() {
            angular.element(document.querySelector('trix-toolbar')).removeClass('ng-show')
            angular.element(document.querySelector('trix-toolbar')).addClass('ng-hide')
        }

        $scope.showTrixTB = function() {
            angular.element(document.querySelector('trix-toolbar')).removeClass('ng-hide')
            angular.element(document.querySelector('trix-toolbar')).addClass('ng-show')
        }

        $scope.projectDescrip = true;

        $scope.nextPage = function() {
            $scope.projectDescrip = false;
        }

        $scope.milestoneCount = 2;
        $scope.addMilestone = function() {
            $scope.milestoneCount++;
        }

        $scope.timeline = {
            milestones: {
                milestone: {},
                deadline: {},
                status: {}
            }
        };

        $scope.castVote = function(threadId, vote) {
            $meteor.call("voteCaster", threadId, vote, 0).then(function() {
                // TODO Do I need anything here?
            }).catch(function(err) {
                alert("Vote failed for mysterious reasons... " + err);
            });
        }

        $scope.createProject = function(project) {
            $meteor.call("createProject", project.title, project.description, $scope.timeline).then(function() {
                project.title = '';
                project.description = '';
                $scope.timeline = {
                    milestones: {
                        milestone: {},
                        deadline: {}
                    }
                };
            }).catch(function(err) {
                alert("Error - " + err);
            });
        }
    })
    .controller('ProjectController', function($scope, $sce, $stateParams, $meteor) {
        $scope.subscribe('project', function() {
            // $scope.htmlString = project.content;
            return [$stateParams.projectId];
        });
        $scope.helpers({
            project: function() {
                    return Projects.findOne({
                        _id: $stateParams.projectId
                    });
                }
                /*,
                            comments: function() {
                                return Projects.findOne({
                                    _id: $stateParams.projectId
                                }).comments;
                            }*/
        });


        $scope.createReply = function(reply) {
            $meteor.call('createReply', $stateParams.projectId, reply.content).then(function() {
                reply.content = '';
            }).catch(function(err) {
                alert("An error occured while creating reply! " + err);
            });
        };
    })
    .controller('InventoryController', function($scope, $meteor) {
        $scope.elecHidden = true;
        $scope.mechHidden = true;

        $scope.toggleElec = function() {
            $scope.elecHidden = !$scope.elecHidden;
        }

        $scope.toggleMech = function() {
            $scope.mechHidden = !$scope.mechHidden;
        }

        $scope.createResourceReq = function(req) {
            $meteor.call('createReq', 'resource', req, "inventory_page").then(function() {
                $scope.req = '';
            }).catch(function(err) {
                alert("Error - " + err)
            });
        }
    });