angular.module("ui.nested.combobox",[]).controller("NestedComboboxController",["$scope","$element","$attrs",function(e,t,r){"use strict";var o=this,n=null;this.isOpen=!1,this.currentMember=e.currentMember,e.$watch("controlDisabled",function(e){o.controlDisabled=e}),this.toggleOpen=function(){return"true"===o.controlDisabled?(this.isOpen.status=!1,!1):void(this.isOpen=!this.isOpen)},this.selectValue=function(t,r){return n===r.id?!0:("root"===r.id&&(r.name=t.currentTarget.innerText),e.changeEvent(r),o.currentMember=r,void(n=r.id))}}]).directive("nestedComboBox",function(){"use strict";return{restrict:"E",controller:"NestedComboboxController",controllerAs:"gs",replace:!0,templateUrl:"template/select-group.html",scope:{collection:"=",currentMember:"=",controlClass:"@",controlDisabled:"@",changeEvent:"="}}});