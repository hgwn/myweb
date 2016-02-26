angular.module('masgetWebApp.find', [
  'ui.router'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // find     //
        //////////////
        .state('find', {

          // With abstract set to true, that means this state can not be explicitly activated.
          // It can only be implicitly activated by activating one of its children.
          // abstract: true,

          // This abstract state will prepend '/contacts' onto the urls of all its children.
          url: '/find',
          views:{
        	  "find":{
        		// Example of loading a template from a file. This is also a top level state,
                  // so this template file will be loaded and then inserted into the ui-view
                  // within index.html.
                  templateUrl: 'base/app/find/find.html',

                  // // Use `resolve` to resolve any asynchronous controller dependencies
                  // // *before* the controller is instantiated. In this case, since contacts
                  // // returns a promise, the controller will wait until contacts.all() is
                  // // resolved before instantiation. Non-promise return values are considered
                  // // to be resolved immediately.
                  // resolve: {
                  //   find: ['find',
                  //     function( find){
                  //       return find.all();
                  //     }]
                  // },

                  // // You can pair a controller to your template. There *must* be a template to pair with.
                  controller: ['$scope', '$state', 'find', 'utils',
                    function (  $scope,   $state,  find,  utils) {

                      // Add a 'contacts' field in this abstract parent's scope, so that all
                      // child state views can access it in their scopes. Please note: scope
                      // inheritance is not due to nesting of states, but rather choosing to
                      // nest the templates of those states. It's normal scope inheritance.
                      $scope.find = find;

                      // $scope.goToRandom = function () {
                      //   var randId = utils.newRandomKey($scope.contacts, "id", $state.params.contactId);

                      //   // $state.go() can be used as a high level convenience method
                      //   // for activating a state programmatically.
                      //   $state.go('contacts.detail', { contactId: randId });
                      // };
                    }]
	  
        	  }
          }
                  });
    }
  ]
);
