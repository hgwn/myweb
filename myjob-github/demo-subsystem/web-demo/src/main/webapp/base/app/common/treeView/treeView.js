angular.module('treeView', [])

    .provider('$treeView', function () {

        var pluginName = 'treeview';
        var defaults = {
            injectStyle: true,
            levels:2,

            expandIcon: 'glyphicon glyphicon-plus',
            collapseIcon: 'glyphicon glyphicon-minus',
            emptyIcon: 'glyphicon',
            userIcon: 'glyphicon glyphicon-user',
            groupIcon:'icon icon-group',

            color: undefined, // '#000000',
            backColor: undefined, // '#FFFFFF',
            borderColor: undefined, // '#dddddd',
            onhoverColor: '#F5F5F5',
            selectedColor: '#FFFFFF',
            selectedBackColor: '#428bca',
            searchResultColor: '#D9534F',
            searchResultBackColor: undefined, //'#FFFFFF',
            $defer:null,
            isStepByStep:true,//是否进行分步加载
            collapseGroup:false,//是否限制显示单个group(第一层组织节点)
            width:"259px",
            forSearchList:'',
            showRightButtons:true,

            enableLinks: false,
            highlightSelected: true,
            highlightSearchResults: true,
            showBorder: true,
            showTags: false,
            multiSelect: true,
            showCheckbox:true,
            fieldShowNameId:"addressgroupid",
            fieldShowName:"addressgroupname",
            leafFieldName:"contactname",
            leafFieldNameId:"addresslistid",

            // Event handlers
            onNodeInit:function(node){
            },
            onNodeCollapsed: function(event,node){
                console.log(node);
            },
            onNodeExpanded: function(event,node){
                console.log(node);
            },
            onNodeSelected: function(node){
                console.log(node);
            },
            onNodeUnselected: function(event,node){
                console.log(node);
            },
            onSearchComplete: function(event,node){
                console.log(node);
            },
            onSearchCleared: function(event,node){
                console.log(node);
            },
            onTargetFocused:function(target,node){
                console.log(node);
            },
            onMenuClicked:function(target,node){
                console.log(node);
            },
            onMenuInitialized:function(target,node){
                console.log(target,node);
            }
        };

        var Tree = function (element, options) {

            this.init(options);

            return {
                tree:this.tree,
                // Initialize / destroy methods
                init: $.proxy(this.init, this),

                //触发click
                clickHandler:$.proxy(this.clickHandler, this),

                // Search methods
                search: $.proxy(this.search, this),
                clearSearch: $.proxy(this.clearSearch, this)
            };
        };

        Tree.prototype.init = function (options) {

            this.tree = [];

            if (options.data) {
                if (typeof options.data === 'string') {
                    options.data = $.parseJSON(options.data);
                }
                this.tree = options.data;
            }
            this.options = options;

            this.setInitialStates({ nodes: this.tree }, 0);

        };

        Tree.prototype.setInitialStates = function (node, level) {

            if (!node.nodes) { return; }
            level += 1;

            var parent = node;
            var _this = this;
            $.each(node.nodes, function checkStates(index, node) {
                node.parent  = parent;
                node.level = level;
                if(node.isOld) node.isOld = false;
                if(!node.nodes) node.nodes = [];
                node.isGroup = true;
                if(node.nodes.length>0)
                node.isLoaded = true;
                _this.options.onNodeInit(node);
                _this.setInitialStates(node, level);

            });
        };

        Tree.prototype.clickHandler = function (node,target,scope,collapsed) {

            var classList = $(target).attr('class') ? $(target).attr('class').split(' ') : [];
            if (classList.indexOf('glyphicon-menu-hamburger') != -1) {
                this.options.onTargetFocused(target,node,scope);
            }else if(classList.indexOf('glyphicon-refresh')!=-1){
                this.options.onMenuClicked(target,node,"refresh");
            }else if(this.options.showCheckbox){
                this.toggleSelectedState(node,false);
            }else{
                this.options.onTargetFocused(target,node,scope);
            }

        };


        Tree.prototype.toggleSelectedState = function (node, silent) {
            if (!node) { return; }
            this.setSelectedState(node, !node.selected, silent);
        };

        Tree.prototype.setSelectedState = function (node, state, silent) {

            if (state) {
                // Continue selecting node
                node.selected = true;
                if (!silent) {
                    this.options.onNodeSelected(node);
                }
            }
            else {

                // Unselect node
                node.selected = false;
                if (!silent) {
                    this.options.onNodeUnselected(node);
                }
            }
        };

        /**
         Searches the tree for nodes (text) that match given criteria
         @param {String} pattern - A given string to match against
         @param {optional Object} options - Search criteria options
         @return {Array} nodes - Matching nodes
         */
        Tree.prototype.search = function (pattern, options) {

            this.clearSearch();

            var that = this;
            var results = [];
            if (pattern && pattern.length > 0) {

                if (options.exactMatch) {
                    pattern = '^' + pattern + '$';
                }

                var modifier = 'g';
                if (options.ignoreCase) {
                    modifier += 'i';
                }

                results = this.findNodes(pattern, modifier);
                $.each(results, function (index, node) {
                    node.searchResult = true;
                    that.setNodeChain(node);
                });

                that.setExpandedStateWithNodeChain(results);


            }

            this.$element.trigger('searchComplete', results);

            return results;
        };


        Tree.prototype.setNodeChain = function(node){
            if(typeof node.parent.nodeId =="undefined"){
                node.nodeChain = "";
                return;
            }
            this.setNodeChain(node.parent);
            if(typeof node.nodeChain == "undefined")
                node.nodeChain = node.parent.nodeChain+"&" + node.parent.nodeId;
        }

        Tree.prototype.setExpandedStateWithNodeChain = function(nodes){
            var expandIds = [];
            var that = this;
            $.each(nodes,function(key,node){
                var idsArray = node.nodeChain.substring(1,node.nodeChain.length).split("&");
                for(var i=0;i<idsArray.length;i++){
                    if(that.contains(expandIds,idsArray[i])) continue;
                    expandIds.push(idsArray[i]);
                }
            });

            for(var i =0;i<expandIds.length;i++){
                this.nodes[expandIds[i]].state.expanded = true;
            }
        }

        Tree.prototype.contains = function(array,elem){
            for(var i=0;i<array.length;i++){
                if(array[i] == elem){
                    return true;
                }
            }
            return false;
        }

        /**
         Clears previous search results
         */
        Tree.prototype.clearSearch = function () {

            var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
                node.searchResult = false;
            });



            this.$element.trigger('searchCleared', results);
        };

        /**
         Find nodes that match a given criteria
         @param {String} pattern - A given string to match against
         @param {optional String} modifier - Valid RegEx modifiers
         @param {optional String} attribute - Attribute to compare pattern against
         @return {Array} nodes - Nodes that match your criteria
         */
        Tree.prototype.findNodes = function (pattern, modifier, attribute) {


            modifier = modifier || 'g';
            attribute = attribute || this.options.leafFieldName;

            var _this = this;
            return $.grep(this.nodes, function (node) {
                var val = _this.getNodeValue(node, attribute);
                if (typeof val === 'string') {
                    return val.match(new RegExp(pattern, modifier));
                }
            });
        };

        Tree.prototype.pushNode = function (node) {
            this.nodes.push($.extend(node,{nodeId:this.nodes.length+1}));
        };

        this.$get = ["$window", "$rootScope","$templateCache","$q","$http","$compile","$animate","$timeout",function ($window, $rootScope,$templateCache,$q,$http,$compile,$animate,$timeout) {
            function TreeviewFactory(element, config) {
                // Common vars
                var options = angular.extend({}, defaults, config);
                var promise = fetchTemplate(options.template);
                var $treeView = new Tree(element, options);
                var scope = $treeView.$scope = options.scope && options.scope.$new() || $rootScope.$new();
                var linker,treeElement;

                scope.options = options;

                scope.remove = function (innerScope) {
                    innerScope.remove();
                };

                scope.triggerClick = function (node,$event,collapsed) {
                    $treeView.clickHandler(node,$event.target,this,collapsed);
                };

                scope.toggleCollapseState = function(targetScope,$event){
                    if(targetScope.collapsed == true&&targetScope.node.level == 1){
                        if(targetScope.node.scenetypeid == 1||options.showCheckbox){
                            targetScope.collapseAll();
                        }else{
                            $.each(targetScope.siblings(),function(key,item){
                                if(item.node.scenetypeid == 1)
                                item.collapse();
                            });
                        }

                        scope.$parent.currentExpandedGroup = targetScope.node;
                        scope.$parent.currentNodeScope = targetScope;
                    }
                    $timeout(function(){
                        targetScope.toggle();
                        targetScope.collapsed?options.onNodeCollapsed($event.target,targetScope.node):options.onNodeExpanded($event.target,targetScope.node);
                    });
                }

                scope.moveLastToTheBeginning = function () {
                    var a = scope.data.pop();
                    scope.data.splice(0, 0, a);
                };

                scope.newSubItem = function (innerScope) {
                    var nodeData = innerScope.$modelValue;
                    nodeData.nodes.push({
                        id: nodeData.id * 10 + nodeData.nodes.length,
                        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                        nodes: []
                    });
                };

                promise.then(function(template){
                    template = String.prototype.trim.apply(template);
                    linker = $compile(template);
                    $treeView.initTree();
                });

                $treeView.initTree = function(){

                    scope.treeData = $treeView.tree;
                    scope.$emit(options.prefixEvent + '.show.before', $treeView);
                    var parent = element;
                    var after = null

                    treeElement = $treeView.$element = linker(scope, function (clonedElement, scope) {
                    });

                    treeElement.css({top: '-9999px', left: '-9999px', display: 'block', visibility: 'hidden'}).addClass(options.placement);

                    // Options: animation
                    if (options.animation) treeElement.addClass(options.animation);
                    // Options: type
                    if (options.type) treeElement.addClass(options.prefixClass + '-' + options.type);
                    // Options: custom classes
                    if (options.customClass) treeElement.addClass(options.customClass);

                    // Support v1.3+ $animate
                    // https://github.com/angular/angular.js/commit/bf0f5502b1bbfddc5cdd2f138efd9188b8c652a9
                    var promise = $animate.enter(treeElement, parent, after, enterAnimateCallback);
                    if (promise && promise.then) promise.then(enterAnimateCallback);

                    scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
                    treeElement.css({visibility: 'visible'});

                }

                $treeView.refresh = function(){

                }

                function enterAnimateCallback() {
                    scope.$emit(options.prefixEvent + '.show', $treeView);
                }

                return $treeView;
            }

            function fetchTemplate(template) {
                return $q.when($templateCache.get(template) || $http.get(template))
                    .then(function (res) {
                        if (angular.isObject(res)) {
                            $templateCache.put(template, res.data);
                            return res.data;
                        }
                        return res;
                    });
            }

            return TreeviewFactory;
        }];

    })

