(function () {
    var injectParams = ['$scope', '$location', '$routeParams','progressBarManager',
                        '$timeout','ngDialog', 'config', 'dataService','toaster','displayModel','MyCache'];

    var testController = function ($scope, $location, $routeParams,progressBarManager,
                                           $timeout, ngDialog,config, dataService,toaster,displayModel,MyCache) {

        var vm = this;


        vm.data = {};
        vm.sourceOPtions = {'mark':[],'sale':[]};
        vm.progressVal1 = null;
        vm.progressVal2 = null;
        vm.progressVal3 = null;
        vm.progressVal4 = null;
        vm.state = '全部';
        vm.tags = {'mark':[],'sale':[]};
        vm.markLength = 0;
        vm.saleLength = 0;


        vm.selectedSource = {'mark_source_detail':[],'sale_source':[]};

        //获取选项数据
        vm.getSourceOptions = function () {
                dataService.getSourceOptions()
                .then(function (data) {
                    vm.sourceOPtions  = data;
                        console.info(vm.sourceOPtions )
                        if(vm.sourceOPtions['mark']){
                            for (var i = 0; i<vm.sourceOPtions['mark'].length;i++){
                                for (var j = 0; j<vm.sourceOPtions['mark'][i]['detail'].length;j++){
                                    vm.markLength = vm.markLength + 1;

                                }
                            }
                        }
                        if(vm.sourceOPtions['sale']){
                            for (var i = 0; i<vm.sourceOPtions['sale'].length; i++){
                                vm.saleLength = vm.saleLength + 1
                            }
                        }

                        //初始化默认全选
                        var initChecked = {'mark_source_detail':[], 'sale_source':[]};

                        for(var i = 0;i< vm.sourceOPtions['mark'].length;i++){
            
                            for(var j = 0; j<vm.sourceOPtions['mark'][i]['detail'].length;j++){
                                initChecked['mark_source_detail'].push(vm.sourceOPtions['mark'][i]['detail'][j]['id'])
                            }
                        }
            
                        for(var i = 0;i<vm.sourceOPtions['sale'].length;i++){
            
                            initChecked['sale_source'].push(vm.sourceOPtions['sale'][i]['id'])
                        }
            
                        vm.selectedSource = angular.toJson(initChecked);
            
                        vm.getPartnerStatistics();

                }, function (error) {
                            toaster.pop('error', "处理失败", "很遗憾处理失败，由于网络原因无法连接到服务器！");
                        })
            };


        vm.getPartnerStatistics = function(){
            //debugger;
            dataService.getPartnerStatistics(vm.selectedSource).then(function (data) {
                vm.data = data;
                
                vm.getProgressVals();
                
                //debugger;
            }, function (error) {
                        toaster.pop('error', "处理失败", "很遗憾处理失败，由于网络原因无法连接到服务器！");
                    })
        };


        vm.chooseSources = function(){

            var vm1 = $scope;


            //Add for select
            vm1.data = vm.sourceOPtions;

            vm1.checked = {'mark_source_detail':[], 'sale_source':[]};
            vm.tags = {'mark':[],'sale':[]};


            //判断市场部是否选中
            vm1.isSelected_mark0 = function() {
                return (vm1.checked['mark_source_detail'].length != 0)
            };

            //判断销售部是否选中
            vm1.isSelected_sale0 = function(){
                return (vm1.checked['sale_source'].length != 0)
            };



            //点击市场部发生的动作
            vm1.updateSelection_mark0 = function ($event) {
                if(vm1.isSelected_mark0()){
                    vm1.checked['mark_source_detail'] = [];
                    vm.tags['mark'] = [];
                }
                else{

                    for (var i = 0; i<vm1.data['mark'].length;i++){

                        for(var j = 0; j<vm1.data['mark'][i]['detail'].length;j++){
                            vm1.checked['mark_source_detail'].push(vm1.data['mark'][i]['detail'][j]['id'])
                            vm.tags['mark'].push(vm1.data['mark'][i]['detail'][j]['name'])

                        }
                    }

                }

            };

            //点击销售部发生的动作
            vm1.updateSelection_sale0 = function($event){
                if (vm1.isSelected_sale0()){
                    vm1.checked['sale_source'] = [];
                    vm.tags['sale'] = [];
                }else{
                     for (var i = 0; i<vm1.data['sale'].length; i++){
                         vm1.checked['sale_source'].push(vm1.data['sale'][i]['id']);
                         vm.tags['sale'].push(vm1.data['sale'][i]['name'])
                     }
                }

            };


            //判断市场部下一级菜单是否选中
            vm1.isSelected_mark1 = function(mark_source){
                for(var i = 0; i<mark_source['detail'].length; i++){
                    if ((vm1.checked['mark_source_detail'].indexOf(mark_source['detail'][i]['id'])) > -1){
                        return true;
                    }
                }
                return false;
            };


            //判断销售部下一级菜单是否选中
            vm1.isSelected_sale1 = function (sale_source) {

                return vm1.checked['sale_source'].indexOf(sale_source.id) > -1
            };




            //点击市场部下一级菜单触发的选项
            vm1.updateSelection_mark1 = function($event, mark_source){
                if (vm1.isSelected_mark1(mark_source)) {
                    //debugger;
                    for (var i = 0; i< mark_source['detail'].length; i++){
                        if (vm1.checked['mark_source_detail'].indexOf(mark_source['detail'][i]['id'])>-1){

                            var idx = vm1.checked['mark_source_detail'].indexOf(mark_source['detail'][i]['id'])
                            vm1.checked['mark_source_detail'].splice(idx,1);

                            var idz =  vm.tags['mark'].indexOf(mark_source['detail'][i]['name']);
                            vm.tags['mark'].splice(idz,1);


                        }
                    }


                }else{
                    for (var i = 0; i< mark_source['detail'].length; i++){

                        vm1.checked['mark_source_detail'].push(mark_source['detail'][i]['id']);

                        vm.tags['mark'].push(mark_source['detail'][i]['name'])
                    }

                }
            };


            //点击销售部下一级菜单触发的选项
            vm1.updateSelection_sale1 = function($event, sale_source){
                if(vm1.isSelected_sale1(sale_source)){
                    var idx = vm1.checked['sale_source'].indexOf(sale_source.id);
                    vm1.checked['sale_source'].splice(idx,1);

                    var idz =  vm.tags['sale'].indexOf(sale_source.name);
                    vm.tags['sale'].splice(idz,1);

                }else{
                    vm1.checked['sale_source'].push(sale_source.id);

                    vm.tags['sale'].push(sale_source.name)

                }
            };

            //判断市场部下二级是否选中
            vm1.isSelected_mark2 = function (mark_source_detail) {
                return vm1.checked['mark_source_detail'].indexOf(mark_source_detail.id) > -1
            };

            //点击市场部下二级菜单触发的选项
            vm1.updateSelection_mark2 = function($event,mark_source_detail){
                if(vm1.isSelected_mark2(mark_source_detail)){
                    var idx = vm1.checked['mark_source_detail'].indexOf(mark_source_detail.id);
                    vm1.checked['mark_source_detail'].splice(idx,1)

                    var idz = vm.tags['mark'].indexOf(mark_source_detail.name);
                    vm.tags['mark'].splice(idx,1)
                }else{
                    vm1.checked['mark_source_detail'].push(mark_source_detail.id)
                    vm.tags['mark'].push(mark_source_detail.name)
                }
            };


            ngDialog.openConfirm({
                template:'/born_manager/static/defaultApp/views/report/selectTest.html',
                className: 'ngdialog',
                scope: vm1
            }).then(function (data) {
                if(data == 'ok'){

                    if(vm.tags['mark'].length == vm.markLength && vm.tags['sale'].length== vm.saleLength){
                        vm.state = '全部';
                    }
                    else if(vm.tags['mark'].length>0){
                        vm.state = vm.tags['mark'][0] + '等';


                    }else if (vm.tags['sale'].length>0){
                        vm.state = vm.tags['sale'][0] + '等';

                    }else {
                        vm.state = '无'
                    }
                    console.info(vm.tags)
                    console.info(vm.state)
                    console.info(vm.markLength)
                    console.info(vm.saleLength)

                    vm.selectedSource = angular.toJson(vm1.checked);

                    vm.getPartnerStatistics();

                }
            })

        };

        vm.getProgressVals = function(){
            if(vm.data['all_number']){
                vm.progressVal1 = 100;
                vm.progressVal2 = 100 * (vm.data['has_mission_number']/vm.data['all_number']);
                vm.progressVal3 = 100 * (vm.data['has_installed_number']/vm.data['all_number']);
                vm.progressVal4 = 100 * (vm.data['has_used_number']/vm.data['all_number']);
            }else{
                vm.progressVal1 = 0;
                vm.progressVal2 = 0;
                vm.progressVal3 = 0;
                vm.progressVal4 = 0;
            }

        };

        function init(){
            vm.getSourceOptions();

        }

        init();

    };

    testController.$inject = injectParams;
    angular.module('managerApp').controller('testController', testController);

}());