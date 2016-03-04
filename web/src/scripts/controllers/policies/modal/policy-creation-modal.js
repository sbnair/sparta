(function () {
  'use strict';

  /*POLICY CREATION MODAL CONTROLLER */
  angular
    .module('webApp')
    .controller('PolicyCreationModalCtrl', PolicyCreationModalCtrl);

  PolicyCreationModalCtrl.$inject = ['PolicyModelFactory', 'title', 'PolicyFactory', 'TemplateFactory', '$modalInstance'];

  function PolicyCreationModalCtrl(PolicyModelFactory, title, PolicyFactory, TemplateFactory, $modalInstance) {
    /*jshint validthis: true*/
    var vm = this;
    vm.cancel = cancel;
    vm.validateForm = validateForm;

    init();

    ///////////////////////////////////////

    function init() {
      vm.title = title;
      return TemplateFactory.getPolicyTemplate().then(function (template) {
        PolicyModelFactory.setTemplate(template);
        vm.policy = PolicyModelFactory.getCurrentPolicy();
        vm.template = template;
        vm.helpLink = template.helpLinks[0];
      });
    }

    function validateForm() {
      if (vm.form.$valid) {
        vm.error = false;
        /*Check if the name of the policy already exists*/
        return PolicyFactory.existsPolicy(vm.policy.name, vm.policy.id).then(function (found) {
          vm.error = found;
          /* Policy name doesn't exist */
          if (!found) {
            $modalInstance.close();
          }
          /* Policy name exists */
          else {
            var policyName = vm.template.basicSettings[0];
            document.querySelector('#dataSource'+policyName.propertyName+'Form').focus();
            vm.errorText = "_INPUT_ERROR_200_";
          }
        });
      }
      else{
        /*Focus on the first invalid input*/
        document.querySelector('input.ng-invalid').focus();
      }
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

})();