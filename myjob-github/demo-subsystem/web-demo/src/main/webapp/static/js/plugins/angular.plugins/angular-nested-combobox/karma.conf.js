module.exports=function(e){e.set({basePath:".",frameworks:["jasmine"],files:["bower_components/angular/angular.js","bower_components/angular-mocks/angular-mocks.js","src/ng-nested-combobox.js","src/**/*.js","test/unit/**/*.spec.js","template/*.js"],exclude:[],reports:["progress"],port:9876,colors:!0,logLevel:e.LOG_INFO,browsers:[process.env.TRAVIS?"Firefox":"Chrome"],captureTimeout:6e4,singleRun:!1,plugins:["karma-jasmine","karma-chrome-launcher","karma-firefox-launcher","karma-phantomjs-launcher"]})};