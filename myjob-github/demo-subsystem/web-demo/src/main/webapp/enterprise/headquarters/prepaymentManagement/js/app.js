//�൱������Ӧ�ó�������
angular.module('masgetWebApp', [
    //�·���������ģ��
    //��ʾģ��
    'masgetWebApp.Prepayment',
    'masgetWebApp.Prepayment.service',
    'masgetWebApp.utils.service',
    'mgcrea.ngStrap',
    'ui.router',
    'ngAnimate',
    'ngMessages',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.resizeColumns'
])

    .run(
    [          '$rootScope', '$state', '$stateParams', '$sce', 'utils', '$modal',
        function ($rootScope, $state, $stateParams, $sce, utils, $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)

    .config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider

                //·�ɵ��ض���
                // .when('/c?id', '/contacts/:id')
                // .when('/user/:id', '/contacts/:id')

                //Ĭ��·��
                .otherwise('/list');

        }
    ]
);
