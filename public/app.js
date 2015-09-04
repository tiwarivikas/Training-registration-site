/**
 * Created by Administrator on 2/8/15.
 */
var myapp = angular.module('myapp', ['ngRoute','mongolabResourceHttp', 'textAngular', 'ngProgress'], function($routeProvider){
    $routeProvider
        .when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .when('/trainings', {
            templateUrl:'templates/trainingList.html',
            controller: 'TrainingListCtrl',
            resolve:{
                trainings:function(Training){
                    return Training.all();
                }
            }
        })
        .when('/training/:id', {
            templateUrl:'templates/trainingView.html',
            controller:'TrainingViewCtrl',
            resolve:{
                training:function(Training, $route){
                    return Training.getById($route.current.params.id);}
        }})
        .when('/new-training', {
            templateUrl: 'templates/trainingForm.html',
            controller: 'TrainingFormCtrl',
            resolve:{
                training:function(Training){
                    return new Training();
                }
            }
        })
        .when('/new-registration', {
            templateUrl: 'templates/registrationForm.html',
            controller: 'RegistrationFormCtrl',
            resolve:{
                registration:function(Registration){
                    return new Registration();
                }
            }
        })
        .otherwise({redirectTo:'/home'});
});

myapp.run(function($rootScope, ngProgress) {
   // ngProgress.color('#ffff00');
   // ngProgress.height('5px');
    $rootScope.$on('$routeChangeStart', function(ev,data) {
        ngProgress.start();
    });
    $rootScope.$on('$routeChangeSuccess', function(ev,data) {
        ngProgress.complete();
    });
});

myapp.constant('MONGOLAB_CONFIG',{
    API_KEY:'8I1y-AmgJHMkF77Kxoocn5rFr_Shua6C',
    DB_NAME:'ess-training'
});

myapp.service('SharedService', function() {
    var training;
//    var activeTab = "home";
    var regionList = [
        {RegionID:1, Name: 'Delhi'},
        {RegionID:2, Name: 'Mumbai'},
        {RegionID:3, Name: 'Bangalore'},
        {RegionID:4, Name: 'Kolkata'}
    ];
    return {
        training: function() {
            return training;
        },
        regionList: function() {
            return regionList;
        }/*,
        activeTab:function() {
            return activeTab;
        },
        setActiveTab:function(value){
            activeTab = value;
        }*/
    };
})

myapp.factory('Registration', function($mongolabResourceHttp){
    return $mongolabResourceHttp('registrations');
});
myapp.factory('Training', function($mongolabResourceHttp){
    return $mongolabResourceHttp('trainings');
});

myapp.controller('HomeCtrl', function($scope){
    console.log('Welcome to Home !');

});

myapp.controller('TrainingListCtrl', function($scope, $location, trainings){
    $scope.trainings = trainings;
});

myapp.controller('TrainingViewCtrl', function($scope, SharedService, training){
    $scope.training = training;
    SharedService.training = training;
})

myapp.controller('RegistrationFormCtrl', function($scope, $location, ngProgress, SharedService, registration) {
    $scope.regionList = SharedService.regionList();
    var registrationCopy = angular.copy(registration);
    $scope.training = SharedService.training;
    if($scope.training._id.$oid === null) {
        alert('Please select a training first.');
        $location.path('/trainings');
    }
    var changeSuccess = function(){
        ngProgress.complete();
        alert('Thanks for registering! You will hear from us soon.');
        $location.path('/trainings');
    };
    var changeError = function() {
        ngProgress.complete();
        throw new Error("Something went wrong..");
    };

    $scope.registration = registration;

    $scope.save = function() {
        ngProgress.start();
        $scope.registration.$save(changeSuccess, changeError);
        // $scope.training.$saveOrUpdate(changeSuccess,changeSuccess,changeError,changeError);
    };
    $scope.remove = function(){
        ngProgress.start();
        $scope.registration.$remove(changeSuccess,changeError);
    };
    $scope.hasChanges = function() {
        return !angular.equals($scope.registration, registrationCopy);
    };
    $scope.submitForm = function(){
        $scope.submitted = true;

        if ($scope.registrationForm.$valid){
            $scope.save();
           // alert('Thanks for registering! You will hear from us soon...');
          //  $location.path('/trainings');
        } else {
            alert('Please complete all the errors before submission.');
        }
    }
});
myapp.controller('TrainingFormCtrl', function($scope, $location, ngProgress, SharedService, training) {

    var trainingCopy = angular.copy(training);
    var changeSuccess = function(){
        ngProgress.complete();
        alert('Training has been added successfully');
        $location.path('/trainings');
    };
    var changeError = function() {
        ngProgress.complete();
        throw new Error("Something went wrong..");
    };

    $scope.training = training;

    $scope.save = function() {
        ngProgress.start();
        $scope.training.$save(changeSuccess, changeError);
       // $scope.training.$saveOrUpdate(changeSuccess,changeSuccess,changeError,changeError);
    };
    $scope.remove = function(){
        ngProgress.start();
        $scope.training.$remove(changeSuccess,changeError);
    };
    $scope.hasChanges = function() {
        return !angular.equals($scope.training, trainingCopy);
    };
    $scope.regionList = SharedService.regionList();
});

/*
myapp.controller('mainCtrl', function($scope, SharedService){
    $scope.setTab = function(value) {
        SharedService.setActiveTab(value);
    }
    $scope.isActive = function(value) {
        if(value == SharedService.activeTab()){
            return true;
        } else {
            return false;
        }
    }
});*/
