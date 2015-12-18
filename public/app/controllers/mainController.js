/** 
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
*/

(function () {
  angular
    .module('MSGraphConsoleApp')
    .controller('MainController', MainController);
    
  /**
   * The MainController code.
   */
  function MainController($http, $log, adalAuthenticationService,$rootScope) {
    var vm = this;
    
    // Properties
    vm.isConnected;
    vm.userAlias;
    vm.emailAddress;
    vm.emailAddressSent;
    vm.requestSuccess;
    vm.requestFinished; 
    vm.rootNode;
    
    // Methods
    vm.connect = connect;
    vm.disconnect = disconnect;
    vm.execute = execute;
    /////////////////////////////////////////
    // End of exposed properties and methods.
    
    /**
		 * This function does any initialization work the 
		 * controller needs.
		 */
    (function activate() {
      // Check connection status and show appropriate UI.
      if (adalAuthenticationService.userInfo.isAuthenticated) {
        vm.isConnected = true;
        
        // Get the user alias from the universal principal name (UPN).
        vm.userAlias = adalAuthenticationService.userInfo.profile.upn.split('@')[0];
        
        // Get the user email address.
        vm.emailAddress = adalAuthenticationService.userInfo.profile.upn;
      }
      else {
        vm.isConnected = false;
      }
    })();
    /**
     * initalise function get helper operations data
     */
     (function init() {
       var request={method:'GET',url:baseUrl+'/data/operations.json'};
       $http(request).then(
         function(response){
         vm.rootNode=response.data.root;
       },function(error){
         vm.operations={};
         $log.debug('Error loading operations..')
         
       });
    })();
    
    /**
		 * Expose the login method from ADAL to the view.
		 */
    function connect() {
      $log.debug('Connecting to Office 365...');
      adalAuthenticationService.config.clientId=vm.clientId;
      adalAuthenticationService.login();
    };
		
		/**
		 * Expose the logOut method from ADAL to the view.
		 */
    function disconnect() {
      $log.debug('Disconnecting from Office 365...');
      adalAuthenticationService.logOut();
    };
    /**Try Out End Microsoft Graph API endpoints*/
    function execute(){
      var request = {
        method: vm.method,
        url: graphUrl+vm.version+vm.url
      };
      if(vm.payload!=undefined &&vm.payload!=''){
        request.data=vm.payload;
      }
      $http(request)
        .then(function (response) {
          $log.debug('HTTP request to Microsoft Graph API returned successfully.', response);     
          response.status ===200 ? vm.requestSuccess = true : vm.requestSuccess = false; 
          vm.requestFinished = true;
          vm.responseData=response.data;
        }, function (error) {
          $log.error('HTTP request to Microsoft Graph API failed.');
          vm.requestSuccess= false;
          vm.requestFinished = true;
        });
    };
     $rootScope.$on('node:clicked',function(e,data){
       if(data.node.method){
          vm.method=data.node.method;
       }
       if(data.node.method){
          vm.url=data.node.url;
       }
       if(data.node.version){
          vm.version=data.node.version;
       }
       if(data.node.data){
          vm.payload=JSON.stringify(data.node.data);
       }
     });
  };
})();

// *********************************************************
//
// O365-Angular-Microsoft-Graph-Connect, https://github.com/OfficeDev/O365-Angular-Microsoft-Graph-Connect
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// *********************************************************